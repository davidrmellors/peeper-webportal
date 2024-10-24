import sgMail from '@sendgrid/mail';
import { env } from '~/env';

sgMail.setApiKey(env.SENDGRID_API_KEY);

export const sendApprovalEmail = async (to: string, orgName: string) => {
  const msg = {
    to,
    from: 'peeper.tracking@gmail.com', // Ensure this is a verified sender in SendGrid
    subject: 'Your Organization Request Has Been Approved',
    text: `Congratulations! Your request to join ${orgName} has been approved.`,
    html: `<strong>Congratulations!</strong> Your request to join ${orgName} has been approved.`,
  };

  try {
    await sgMail.send(msg);
    console.log('Email sent successfully');
  } catch (error) {
    console.error('Error sending email:', JSON.stringify(error));
  }
};
