import { Resend } from 'resend';
import { OrderConfirmation } from '@/emails/OrderConfirmation';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request) {
  try {
    const { to, subject, data } = await request.json();
    const { data: emailData, error } = await resend.emails.send({
      from: 'Maison Metapack <noreply@maisonmetapack.com>',
      to: [to],
      subject: subject,
      react: OrderConfirmation({ ...data }),
    });

    if (error) {
        return Response.json({ error });
      }
      return Response.json({ success: true, data: emailData });
    } catch (error) {
      return Response.json({ error: error.message });
    }
}