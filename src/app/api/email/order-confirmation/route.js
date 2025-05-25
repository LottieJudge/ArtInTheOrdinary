import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req) {
  try {
    const { firstName, lastName, email, phone, requirements } = await req.json();

    const data = await resend.emails.send({
      from: 'enquiries@marcosotech.com',
      to: ['sg@marcosotrade.com', 'aa@marcosotrade.com'],
      subject: 'New Enquiery For Services - MTR Website Submission',
      html: 
        `<h2>New Contact Form Submission</h2>
        <strong>First Name:</strong> ${firstName}<br />
        <strong>Last Name:</strong> ${lastName}<br />
        <strong>Email:</strong> ${email}<br />
        <strong>Phone:</strong> ${phone}<br />
        <strong>Requirements:</strong><br />${requirements}
      `,
    });

    return Response.json({ success: true });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}
 