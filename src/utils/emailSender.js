const nodemailer = require("nodemailer");
require("dotenv").config;

async function sendRecoveryCode(receiverEmail, recoveryCode) {
  console.log("Nodemailer Email: ", process.env.NODE_MAILER_EMAIL);
  console.log("Nodemailer Password: ", process.env.NODE_MAILER_PASSWORD);
  console.log("User Email: ", receiverEmail);
  console.log("Recovery Code", recoveryCode);
  try {
    const from = process.env.NODE_MAILER_EMAIL;
    const pass = process.env.NODE_MAILER_PASSWORD;
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 567,
      secure: true,
      auth: {
        user: from,
        pass: pass,
      },
    });
    console.log("Transporter created: ", transporter);
    const mailStatus = await transporter.sendMail({
      from: from,
      to: receiverEmail,
      subject: "Password Recovery Email",
      html: recoveryCode,
    });
    console.log(mailStatus);
    return true;
  } catch (error) {
    console.log("error in sending email", error);
    return false;
  }
}

module.exports = sendRecoveryCode;
