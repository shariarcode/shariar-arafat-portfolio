import { Resend } from 'resend';

// NOTE: This assumes a RESEND_API_KEY environment variable is set in your deployment environment.
// The `from` address uses 'onboarding@resend.dev' which is suitable for development and testing.
// For production, you would need a verified domain with Resend.
const resend = new Resend(process.env.RESEND_API_KEY);
const TO_EMAIL = 'shariararafar123@gmail.com'; // Your email address
const FROM_EMAIL = 'Portfolio Contact <onboarding@resend.dev>';

export const config = {
  runtime: 'edge',
};

export default async function handler(req: Request) {
  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  try {
    const { name, email, subject, message } = await req.json();

    if (!name || !email || !subject || !message) {
      return new Response(JSON.stringify({ error: 'Missing required fields' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const { data, error } = await resend.emails.send({
      from: FROM_EMAIL,
      to: [TO_EMAIL],
      subject: `New Portfolio Message: ${subject}`,
      reply_to: email,
      html: `
        <div style="font-family: sans-serif; font-size: 16px; color: #333;">
          <h2>New Message from your Portfolio Contact Form</h2>
          <p><strong>Name:</strong> ${name}</p>
          <p><strong>Email:</strong> <a href="mailto:${email}">${email}</a></p>
          <p><strong>Subject:</strong> ${subject}</p>
          <hr>
          <h3>Message:</h3>
          <p>${message.replace(/\n/g, '<br>')}</p>
        </div>
      `,
    });

    if (error) {
      console.error('Resend API error:', error);
      return new Response(JSON.stringify({ error: 'Failed to send email.' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    return new Response(JSON.stringify({ message: 'Email sent successfully!' }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });

  } catch (error: any) {
    console.error('Error in contact API:', error);
    return new Response(JSON.stringify({ error: 'An internal server error occurred.' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
