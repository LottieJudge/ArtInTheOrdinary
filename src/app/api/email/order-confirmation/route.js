import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req) {
  try {
    const { first_name, email_address } = await req.json();

    const data = await resend.emails.send({
      from: 'sg@marcosotrade.com',
      to: email_address,
      subject: 'Thanks for coming to see us!',
      html: `
        <div style="font-family: sans-serif; padding: 20px;">
          <h2>Thanks for your time today, ${first_name}!</h2>
          <p>We're excited to work together soon, in the meantime we'll be shipping out your cap asap!</p>
          <p>Team Maison Metapack</p>
        </div>
      `,
    });

    return Response.json({ success: true });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}