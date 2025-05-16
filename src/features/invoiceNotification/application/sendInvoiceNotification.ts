import sgMail from '@sendgrid/mail';
import { Order } from '../domain/types';

sgMail.setApiKey(process.env.SENDGRID_API_KEY!);

export async function sendInvoiceNotification(order: Order) {
  const emailContent = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto;">
      <img src="https://your-logo-url.com/logo.png" alt="FIORA Logo" height="50" />
      <h2>Invoice Request Status Notification</h2>
      <p>Dear <strong>${order.cusName}</strong>,</p>
      <p>
        We would like to thank you for your trust and use of FIORA’s services.
      </p>
      <p>
        We would like to inform you that your invoice request has been received and sent to the accounting department for processing.
        We are currently taking the necessary steps to complete the invoice according to the information you provided.
      </p>
      <div style="background-color: #f5f5f5; padding: 12px; margin: 16px 0;">
        <strong>Order number:</strong> ${order.orderNo}
      </div>
      <p><strong>Estimated processing time:</strong> 2 days.</p>
      <p>
        As soon as the invoice is issued, we will send it back to you via email. If you need further assistance or have any requests to edit information, 
        please contact us again via this email or hotline: <strong>[Support phone number]</strong>.
      </p>
      <br />
      <p>Sincerely,</p>
      <p><strong>FIORA</strong></p>
    </div>
  `;

  await sgMail.send({
    to: order.email,
    from: process.env.SENDER_EMAIL!,
    subject: `Invoice Request for Order #${order.orderNo}`,
    html: emailContent,
  });
}
