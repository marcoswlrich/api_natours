import * as nodemailer from 'nodemailer';

type EmailDto = {
  email: string;
  subject: string;
  message: string;
};

export async function sendEmail(email: EmailDto) {
  const transporter = nodemailer.createTransport({
    host: 'smtp.mailtrap.io',
    port: 25,
    secure: false,
    auth: {
      user: process.env.EMAIL_USERNAME,
      pass: process.env.EMAIL_PASSWORD,
    },
  });

  const info = await transporter.sendMail({
    from: '"Bot 👻" <marcos@email.com>',
    to: email.email, // list of receivers
    subject: email.subject, // Subject line
    html: email.message, // html body
  });

  console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
}
