const getTransporter = require('../config/emailConfig');
const {
  VERIFICATION_EMAIL_TEMPLATE,
  PASSWORD_RESET_REQUEST_TEMPLATE,
  PASSWORD_RESET_SUCCESS_TEMPLATE,
  WELCOME_EMAIL_TEMPLATE,
} = require('./emailTemplate');

const sendVerificationEmail = async (email, verificationToken) => {
  try {
    const transporter = await getTransporter();
    const mailOptions = {
      from: `"Task Management" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: 'Verify Your Email - Task Management',
      html: VERIFICATION_EMAIL_TEMPLATE.replace('{verificationCode}', verificationToken),
    };
    await transporter.sendMail(mailOptions);
    console.log('✅ Verification email sent to:', email);
  } catch (error) {
    console.error('❌ Error sending verification email:', error);
    throw new Error('Failed to send verification email');
  }
};

const sendWelcomeEmail = async (email, name) => {
  try {
    const transporter = await getTransporter();
    const mailOptions = {
      from: `"Task Management" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: 'Welcome to Task Management!',
      html: WELCOME_EMAIL_TEMPLATE.replace('{name}', name),
    };
    await transporter.sendMail(mailOptions);
    console.log('✅ Welcome email sent to:', email);
  } catch (error) {
    console.error('❌ Error sending welcome email:', error);
    throw new Error('Failed to send welcome email');
  }
};

const sendPasswordResetEmail = async (email, resetURL) => {
  try {
    const transporter = await getTransporter();
    const mailOptions = {
      from: `"Task Management" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: 'Reset Your Password - Task Management',
      html: PASSWORD_RESET_REQUEST_TEMPLATE.replace('{resetURL}', resetURL),
    };
    await transporter.sendMail(mailOptions);
    console.log('✅ Password reset email sent to:', email);
  } catch (error) {
    console.error('❌ Error sending password reset email:', error);
    throw new Error('Failed to send password reset email');
  }
};

const sendResetSuccessEmail = async (email) => {
  try {
    const transporter = await getTransporter();
    const mailOptions = {
      from: `"Task Management" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: 'Password Reset Successful - Task Management',
      html: PASSWORD_RESET_SUCCESS_TEMPLATE,
    };
    await transporter.sendMail(mailOptions);
    console.log('✅ Reset success email sent to:', email);
  } catch (error) {
    console.error('❌ Error sending reset success email:', error);
    throw new Error('Failed to send reset success email');
  }
};

module.exports = {
  sendVerificationEmail,
  sendWelcomeEmail,
  sendPasswordResetEmail,
  sendResetSuccessEmail,
};
