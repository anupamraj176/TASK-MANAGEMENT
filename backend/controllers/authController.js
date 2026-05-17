const User = require('../models/User');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const { generateTokenAndSetCookie } = require('../utils/generateToken');
const {
  sendVerificationEmail,
  sendWelcomeEmail,
  sendPasswordResetEmail,
  sendResetSuccessEmail,
} = require('../mailer/mail');

// ✅ Sign Up
const signup = async (req, res) => {
  const { email, password, name, role } = req.body;
  const normalizedEmail = (email || '').trim().toLowerCase();

  try {
    if (!normalizedEmail || !password || !name || !role) {
      return res.status(400).json({
        success: false,
        message: 'All fields are required',
      });
    }

    const userExists = await User.findOne({ email: normalizedEmail });
    if (userExists) {
      return res.status(400).json({
        success: false,
        message: 'User already exists',
      });
    }

    const emailServiceConfigured = !!(process.env.EMAIL_USER && process.env.EMAIL_APP_PASSWORD);

    const hashedPassword = await bcrypt.hash(password, 10);
    const verificationToken = Math.floor(100000 + Math.random() * 900000).toString();

    const user = new User({
      email: normalizedEmail,
      password: hashedPassword,
      name,
      role: role || 'user',
      isVerified: !emailServiceConfigured, // Auto-verify if email service is not configured!
      verificationToken: emailServiceConfigured ? verificationToken : undefined,
      verificationTokenExpiresAt: emailServiceConfigured ? (Date.now() + 24 * 60 * 60 * 1000) : undefined,
    });

    await user.save();

    const token = generateTokenAndSetCookie(res, user._id, user.role);

    if (emailServiceConfigured) {
      sendVerificationEmail(user.email, verificationToken).catch((emailError) => {
        console.error('Email sending failed in background:', emailError);
      });
    } else {
      console.log('ℹ️ Email service not configured. Auto-verified user:', normalizedEmail);
    }

    res.status(201).json({
      success: true,
      message: emailServiceConfigured 
        ? 'User created successfully. Check your email for verification code.'
        : 'User created successfully. Auto-verified (email service unconfigured).',
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        isVerified: user.isVerified,
      },
    });
  } catch (error) {
    console.error('Signup error:', error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ✅ Login
const login = async (req, res) => {
  const { email, password, role } = req.body;
  const normalizedEmail = (email || '').trim().toLowerCase();

  try {
    if (!normalizedEmail || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email and password are required',
      });
    }

    const user = await User.findOne({ email: normalizedEmail }).select('+password');

    if (!user) {
      return res.status(400).json({
        success: false,
        message: 'Invalid credentials',
      });
    }

    if (role && user.role !== role) {
      return res.status(400).json({
        success: false,
        message: `This account is not a ${role}`,
      });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(400).json({
        success: false,
        message: 'Invalid credentials',
      });
    }

    const token = generateTokenAndSetCookie(res, user._id, user.role);

    user.lastLogin = new Date();
    await user.save();

    res.status(200).json({
      success: true,
      message: 'Logged in successfully',
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        isVerified: user.isVerified,
        profileImage: user.profileImage,
        bio: user.bio,
        phoneNumber: user.phoneNumber,
        createdAt: user.createdAt,
        lastLogin: user.lastLogin,
      },
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ✅ Logout
const logout = (req, res) => {
  res.clearCookie('token', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
  });
  res.status(200).json({
    success: true,
    message: 'Logged out successfully',
  });
};

// ✅ Verify Email
const verifyEmail = async (req, res) => {
  const { code } = req.body;

  try {
    if (!code) {
      return res.status(400).json({
        success: false,
        message: 'Verification code is required',
      });
    }

    const emailServiceConfigured = !!(process.env.EMAIL_USER && process.env.EMAIL_APP_PASSWORD);

    let user;
    if (emailServiceConfigured) {
      user = await User.findOne({
        verificationToken: code,
        verificationTokenExpiresAt: { $gt: Date.now() },
      });
    } else {
      // Fallback: If email service is not configured, match token or grab the latest unverified user
      user = await User.findOne({ verificationToken: code }) || await User.findOne({ isVerified: false });
    }

    if (!user) {
      return res.status(400).json({
        success: false,
        message: 'Invalid or expired verification code',
      });
    }

    user.isVerified = true;
    user.verificationToken = undefined;
    user.verificationTokenExpiresAt = undefined;
    await user.save();

    const token = generateTokenAndSetCookie(res, user._id, user.role);

    if (emailServiceConfigured) {
      sendWelcomeEmail(user.email, user.name).catch((emailError) => {
        console.error('Welcome email sending failed in background:', emailError);
      });
    }

    res.status(200).json({
      success: true,
      message: 'Email verified successfully',
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        isVerified: user.isVerified,
      },
    });
  } catch (error) {
    console.error('Verify email error:', error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ✅ Check Auth
const checkAuth = async (req, res) => {
  try {
    const user = await User.findById(req.userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    res.status(200).json({
      success: true,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        isVerified: user.isVerified,
        profileImage: user.profileImage,
        bio: user.bio,
        phoneNumber: user.phoneNumber,
      },
    });
  } catch (error) {
    console.error('Check auth error:', error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ✅ Forgot Password
const forgotPassword = async (req, res) => {
  const { email } = req.body;
  const normalizedEmail = (email || '').trim().toLowerCase();

  try {
    if (!normalizedEmail) {
      return res.status(400).json({
        success: false,
        message: 'Email is required',
      });
    }

    const user = await User.findOne({ email: normalizedEmail });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: 'User not found',
      });
    }

    const resetToken = crypto.randomBytes(20).toString('hex');
    const resetTokenExpiresAt = Date.now() + 1 * 60 * 60 * 1000;

    user.resetPasswordToken = resetToken;
    user.resetPasswordExpiresAt = resetTokenExpiresAt;
    await user.save();

        const clientUrl = process.env.CLIENT_URL || 'http://localhost:5173';
    const resetURL = `${clientUrl}/reset-password/${resetToken}`;

    sendPasswordResetEmail(user.email, resetURL).catch((emailError) => {
      console.error('Password reset email sending failed in background:', emailError);
    });

    res.status(200).json({
      success: true,
      message: 'Password reset link sent to your email',
    });
  } catch (error) {
    console.error('Forgot password error:', error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ✅ Reset Password
const resetPassword = async (req, res) => {
  const { token } = req.params;
  const { password } = req.body;

  try {
    if (!token || !password) {
      return res.status(400).json({
        success: false,
        message: 'Token and password are required',
      });
    }

    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpiresAt: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: 'Invalid or expired reset token',
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    user.password = hashedPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpiresAt = undefined;
    await user.save();

    sendResetSuccessEmail(user.email).catch((emailError) => {
      console.error('Reset success email sending failed in background:', emailError);
    });

    res.status(200).json({
      success: true,
      message: 'Password reset successfully',
    });
  } catch (error) {
    console.error('Reset password error:', error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ✅ Update Profile
const updateProfile = async (req, res) => {
  try {
    const { name, profileImage, bio, phoneNumber } = req.body;

    const user = await User.findById(req.userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    if (name) user.name = name;
    if (profileImage) user.profileImage = profileImage;
    if (bio !== undefined) user.bio = bio;
    if (phoneNumber !== undefined) user.phoneNumber = phoneNumber;

    await user.save();

    res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        isVerified: user.isVerified,
        profileImage: user.profileImage,
        bio: user.bio,
        phoneNumber: user.phoneNumber,
      },
    });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  signup,
  login,
  logout,
  verifyEmail,
  checkAuth,
  forgotPassword,
  resetPassword,
  updateProfile,
};
