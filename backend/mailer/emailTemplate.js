const VERIFICATION_EMAIL_TEMPLATE = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Verify Your Email</title>
</head>
<body style="font-family: Arial, sans-serif; line-height:1.6; color:#333; max-width:600px; margin:0 auto; padding:20px; background:#f5f5f5;">
  <div style="background:linear-gradient(to right,#667eea,#764ba2); padding:20px; text-align:center; border-radius:5px 5px 0 0;">
    <h1 style="color:white; margin:0;">Verify Your Email</h1>
  </div>
  <div style="background-color:#fff; padding:30px; border-radius:0 0 5px 5px; box-shadow:0 2px 5px rgba(0,0,0,0.1);">
    <p>Hello,</p>
    <p>Thank you for signing up! Please verify your email address by entering the code below:</p>
    <div style="text-align:center; margin:30px 0;">
      <h2 style="background-color:#667eea; color:white; padding:15px; border-radius:5px; letter-spacing:5px;">
        {verificationCode}
      </h2>
    </div>
    <p>This code will expire in 24 hours.</p>
    <p>If you didn't create an account with us, please ignore this email.</p>
    <p style="color:#666; font-size:12px; margin-top:20px;">Best regards,<br><strong>Task Management Team</strong></p>
  </div>
</body>
</html>
`;

const PASSWORD_RESET_REQUEST_TEMPLATE = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Reset Your Password</title>
</head>
<body style="font-family: Arial, sans-serif; line-height:1.6; color:#333; max-width:600px; margin:0 auto; padding:20px; background:#f5f5f5;">
  <div style="background:linear-gradient(to right,#667eea,#764ba2); padding:20px; text-align:center; border-radius:5px 5px 0 0;">
    <h1 style="color:white; margin:0;">Reset Your Password</h1>
  </div>
  <div style="background-color:#fff; padding:30px; border-radius:0 0 5px 5px; box-shadow:0 2px 5px rgba(0,0,0,0.1);">
    <p>Hello,</p>
    <p>We received a request to reset your password. Click the button below to proceed:</p>
    <div style="text-align:center; margin:30px 0;">
      <a href="{resetURL}" style="background-color:#667eea; color:white; padding:12px 30px; text-decoration:none; border-radius:5px; display:inline-block;">
        Reset Password
      </a>
    </div>
    <p>This link will expire in 1 hour.</p>
    <p>If you didn't request this, please ignore this email.</p>
    <p style="color:#666; font-size:12px; margin-top:20px;">Best regards,<br><strong>Task Management Team</strong></p>
  </div>
</body>
</html>
`;

const PASSWORD_RESET_SUCCESS_TEMPLATE = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Password Reset Successful</title>
</head>
<body style="font-family: Arial, sans-serif; line-height:1.6; color:#333; max-width:600px; margin:0 auto; padding:20px; background:#f5f5f5;">
  <div style="background:linear-gradient(to right,#667eea,#764ba2); padding:20px; text-align:center; border-radius:5px 5px 0 0;">
    <h1 style="color:white; margin:0;">Password Reset Successful</h1>
  </div>
  <div style="background-color:#fff; padding:30px; border-radius:0 0 5px 5px; box-shadow:0 2px 5px rgba(0,0,0,0.1);">
    <p>Hello,</p>
    <p>Your password has been successfully reset. You can now log in with your new password.</p>
    <p style="color:#666; font-size:12px; margin-top:20px;">Best regards,<br><strong>Task Management Team</strong></p>
  </div>
</body>
</html>
`;

const WELCOME_EMAIL_TEMPLATE = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Welcome!</title>
</head>
<body style="font-family: Arial, sans-serif; line-height:1.6; color:#333; max-width:600px; margin:0 auto; padding:20px; background:#f5f5f5;">
  <div style="background:linear-gradient(to right,#667eea,#764ba2); padding:20px; text-align:center; border-radius:5px 5px 0 0;">
    <h1 style="color:white; margin:0;">Welcome to Task Management!</h1>
  </div>
  <div style="background-color:#fff; padding:30px; border-radius:0 0 5px 5px; box-shadow:0 2px 5px rgba(0,0,0,0.1);">
    <p>Hello {name},</p>
    <p>Welcome! Your email has been verified and your account is now active.</p>
    <p>You can now log in and start managing your tasks.</p>
    <p style="color:#666; font-size:12px; margin-top:20px;">Best regards,<br><strong>Task Management Team</strong></p>
  </div>
</body>
</html>
`;

module.exports = {
  VERIFICATION_EMAIL_TEMPLATE,
  PASSWORD_RESET_REQUEST_TEMPLATE,
  PASSWORD_RESET_SUCCESS_TEMPLATE,
  WELCOME_EMAIL_TEMPLATE,
};
