const nodemailer = require("nodemailer");

async function sendRecoveryCode(receiverEmail, recoveryCode) {
  try {
    let from = process.env.NODE_MAILER_EMAIL
    let transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      secure: false,
      auth: {
        user: from,
        pass: process.env.NODE_MAILER_PASSWORD,
      },
    })
    await transporter.sendMail({
      from: from,
      to: receiverEmail,
      subject: "Password Recovery Email",
      html: recoveryCode,
    })
    return true
  } catch (error) {
    console.log('error in sending email', error)
    return false
  }
}

module.exports = sendRecoveryCode