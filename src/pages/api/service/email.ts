import nodemailer from "nodemailer";
// import * as dotenv from "dotenv";

// dotenv.config();

class EmailServices {
  constructor() {}

  private transporter = nodemailer.createTransport({
    // host: process.env.MAIL_SERVER || "gollum.sg.rapidplex.com",
    // port: 465,
    // secure: true,
    // auth: {
    //   user: process.env.MAIL_USERNAME || "",
    //   pass: process.env.MAIL_PASSWORD || "",
    // },
    host: "leafeon.rapidplex.com",
    port: 465,
    secure: true,
    auth: {
      user: "bimbellinear@okifirsyah.com",
      pass: ".I[x$haWm&?w",
    },
  });

  public async sendEmail(email: string, subject: string, html: string) {
    const mailOptions = {
      from: "bimbellinear@okifirsyah.com",
      to: email,
      subject: subject,
      html: html,
    };

    this.transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.log(error);
      } else {
        console.log("Email sent: " + info.response);
      }
    });
  }

  public async sendEmailVerification(email: string, token: string) {
    this.sendEmail(
      email,
      "Email verification",
      `<h2>Verifikasi Email</h2>

      <p>Harap inputkan kode berikut untuk pendaftaran Bimbel Linear.</p>

      </br>
      </br>
       <h3><b>${token}</b></h3>
       </br>
       </br>
       <p>Jika ini bukan anda, harap abaikan email ini.</p>
       `
    );
  }

  public async sendEmailResetPassword(email: string, token: number) {
    this.sendEmail(
      email,
      "Reset password",
      `<h2>Reset password</h2>

      <p>Harap inputkan kode berikut untuk reset password Bimbel Linear.</p>

      </br>
      </br>
       <h3><b>${token}</b></h3>
       </br>
       </br>
       <p>Jika ini bukan anda, harap abaikan email ini.</p>
       `
    );
  }

  public async sendEmailChangePassword(email: string, token: number) {
    this.sendEmail(
      email,
      "Change password",
      `<h2>Change password</h2>

      <p>Harap inputkan kode berikut untuk mengubah password Bimbel Linear.</p>

      </br>
      </br>
       <h3><b>${token}</b></h3>
       </br>
       </br>
       <p>Jika ini bukan anda, harap abaikan email ini.</p>
       `
    );
  }
}

export default new EmailServices();