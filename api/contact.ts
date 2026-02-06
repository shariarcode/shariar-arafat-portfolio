import { Resend } from 'resend';

// This API route handles sending contact form submissions via email using Resend.
// IMPORTANT: You must set the RESEND_API_KEY as an environment variable in your deployment environment (e.g., Vercel).
const resend = new Resend(process.env.RESEND_API_KEY);

// The email address where you want to receive messages.
const TO_EMAIL = 'shariararafar123@gmail.com'; 
// The "from" address for Resend. For development, 'onboarding@resend.dev' works.
// For production, you must use a verified domain.
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

  if (!process.env.RESEND_API_KEY || process.env.RESEND_API_KEY.trim() === '') {
      console.error('RESEND_API_KEY is not set.');
      return new Response(JSON.stringify({ error: 'Server configuration error: The email service API key is missing.' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      });
  }

  try {
    const { name, email, subject, message } = await req.json();

    if (!name || !email || !subject || !message) {
      return new Response(JSON.stringify({ error: 'Missing required fields. Please fill out the entire form.' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const { data, error } = await resend.emails.send({
      from: FROM_EMAIL,
      to: [TO_EMAIL],
      subject: `New Portfolio Message: ${subject}`,
      // The 'replyTo' property sets the Reply-To email header, allowing direct replies to the sender.
      replyTo: email,
      html: `
        <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
          <h2>New Message from Your Portfolio</h2>
          <p>You have received a new message from your portfolio's contact form.</p>
          <hr style="border: 0; border-top: 1px solid #eee;">
          <p><strong>From:</strong> ${name}</p>
          <p><strong>Email:</strong> <a href="mailto:${email}">${email}</a></p>
          <p><strong>Subject:</strong> ${subject}</p>
          <h3>Message:</h3>
          <div style="padding: 12px; border: 1px solid #ddd; border-radius: 5px; background-color: #f9f9f9; white-space: pre-wrap; font-size: 14px;">${message}</div>
          <hr style="border: 0; border-top: 1px solid #eee;">
          <p style="font-size: 12px; color: #999;">This email was sent from your portfolio website.</p>
        </div>
      `,
    });

    if (error) {
      console.error('Resend API error:', error);
      // The error object from Resend might contain sensitive details, so we return a generic but informative message.
      return new Response(JSON.stringify({ error: `Failed to send email. The mail server responded with: ${error.message}` }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    return new Response(JSON.stringify({ message: 'Email sent successfully!' }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });

  } catch (err: any) {
    console.error('Error in contact API:', err);
    return new Response(JSON.stringify({ error: 'An internal server error occurred while processing the request.' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
