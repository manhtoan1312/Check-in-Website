const nodemailer = require('nodemailer');

const MAIL_SETTINGS = {
  service:'Gmail', 
  auth: {
    user: process.env.MAIL_EMAIL,
    pass: process.env.MAIL_PASSWORD,
  },
};

const transporter = nodemailer.createTransport(MAIL_SETTINGS);
  
  module.exports.sendMail = async (params) => {
    try {
      let info = await transporter.sendMail({
        from: MAIL_SETTINGS.auth.user,
        to: params.to, 
        subject: '[Checkin Website] Plesse verify yours ✔',
        html: `
        <div
          class="container"
          style="max-width: 90%; margin: auto; padding-top: 20px"
        >
          <h2>This email were sent by Website checkin.</h2>
          <h4>Hello ${params.name}!!</h4>
          <p style="margin-bottom: 30px;"> This is your's OTP code to change your password, Do not share this information with anyone.</p>
          <p>Your One-time password will expire after 5 minutes</p>
          <h1 style="font-size: 40px; letter-spacing: 2px; text-align:center;">${params.OTP}</h1>
     </div>
      `,
      });
      return true;
    } catch (error) {
      console.log(error);
      return false;
    }
  };