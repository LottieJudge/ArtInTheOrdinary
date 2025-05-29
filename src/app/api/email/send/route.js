import { Resend } from 'resend';
import { OrderConfirmationEmail } from '@/app/api/email/send/OrderConfirmationEmail';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request) {
  try {
    const { to, subject, data } = await request.json();
    console.log('📧 Attempting to send email to:', to);
    console.log('📦 Email data:', data);

    const { data: emailData, error } = await resend.emails.send({
      from: 'Maison Metapack <noreply@maisonmetapack.com>',
      to: [to],
      subject: subject,
      react: OrderConfirmationEmail({ ...data }),
    });

    if (error) {
      console.error('❌ Email error:', error);
      return Response.json({ error });
    }

    console.log('✅ Email sent successfully:', emailData);
    return Response.json({ success: true, data: emailData });
  } catch (error) {
    console.error('❌ Unexpected error:', error.message);
    return Response.json({ error: error.message });
  }
}