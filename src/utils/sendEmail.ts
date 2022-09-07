import * as nodemailer from 'nodemailer';

type EmailDto = {
  email: string;
  subject: string;
  message: string;
};

export async function sendEmail(email: EmailDto) {
  const testAccount = await nodemailer.createTestAccount();

  const transporter = nodemailer.createTransport({
    host: 'smtp.ethereal.email',
    port: 25,
    secure: false,
    auth: {
      user: testAccount.user, // generated ethereal user
      pass: testAccount.pass, // generated ethereal password
    },
  });

  const info = await transporter.sendMail({
    from: '"Bot 👻" <Bot@mail.com>',
    to: email.email, // list of receivers
    subject: email.subject, // Subject line
    html: email.message, // html body
  });

  console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
}
