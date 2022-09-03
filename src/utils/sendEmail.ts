import * as nodemailer from 'nodemailer';

import { IUser } from '../interfaces/models/IUser';

type EmailDto = {
  subject: string;
  body: string;
};

export async function sendEmail(email: EmailDto, to: IUser) {
  const testAccount = await nodemailer.createTestAccount();

  const transporter = nodemailer.createTransport({
    host: 'smtp.ethereal.email',
    port: 587,
    secure: false,
    auth: {
      user: testAccount.user, // generated ethereal user
      pass: testAccount.pass, // generated ethereal password
    },
  });

  const info = await transporter.sendMail({
    from: '"Bot 👻" <Bot@mail.com>',
    to: to.email, // list of receivers
    subject: email.subject, // Subject line
    html: email.body, // html body
  });

  console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
}
