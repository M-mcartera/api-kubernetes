import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as SendGrid from '@sendgrid/mail';
@Injectable()
export class MailService {
  constructor(private readonly configService: ConfigService) {
    console.log(this.configService.get('sengrid.secure_key'));
    SendGrid.setApiKey(this.configService.get('sengrid.secure_key'));
  }

  async sendEmail(email, subject = '', text = '', html = '') {
    try {
      const mail = {
        to: email,
        subject,
        from: 'vip.sfsfd@gmail.com',
        text,
        html,
      };
      const transport = await SendGrid.send(mail);
      console.log('E-mail sent to %s', mail.to);
      return transport;
    } catch (error) {
      throw new Error(
        `Error sending email to ${email}: ${error.response.body}`,
      );
    }
  }
}
