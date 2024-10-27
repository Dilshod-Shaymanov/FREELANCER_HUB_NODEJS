import nodemailer from "nodemailer";
import config from "config";

class MailService {
  constructor() {
    this.trasnporter = nodemailer.createTransport({
      service: "gmail",
      host: config.get("smtp_host"),
      port: config.get("smtp_port"),
      secure: false,
      auth: {
        user: config.get("smtp_user"),
        pass: config.get("smtp_pass"),
      },
    });
  }
  async sendActivitionMail(toEmail, link) {
    await this.trasnporter.sendMail({
      from: config.get("smtp_user"),
      to: toEmail,
      subject: "FreelancerHub ni faollashtrish",
      text: "",
      html: `<h1>Accountni faollashtirish uchun quyidagi linkni bosing</h1>
            <a href="${link}">FAOLLASHTIRING</a>
            `,
    });
  }
  async sendLinkToEmail(email, otp) {
    const transporter = nodemailer.createTransport({
      service: "Gmail",
      auth: {
        user: config.get("smtp_user"),
        pass: config.get("smtp_pass"),
      },
    });
    const mailOptions = {
      from: config.get("smtp_user"),
      to: email,
      subject: "Parolni tiklash",
      text: "",
      html: `<h3>Sizning emailingizga parolingizni tiklash uchun code yuborildi \n\n <h1> ${otp}</h1></h3>`,
    };
    await transporter.sendMail(mailOptions);
  }
}

export default new MailService();
