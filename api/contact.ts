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

  const resendApiKey = process.env.RESEND_API_KEY;

  if (!resendApiKey || resendApiKey.trim() === '') {
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

    const TO_EMAIL = 'shariararafar123@gmail.com'; 
    const FROM_EMAIL = 'Portfolio Contact <onboarding@resend.dev>';

    const htmlBody = `
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
    `;

    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${resendApiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        from: FROM_EMAIL,
        to: [TO_EMAIL],
        subject: `New Portfolio Message: ${subject}`,
        reply_to: email,
        html: htmlBody
      })
    });

    if (!res.ok) {
        let errorMsg = 'Failed to send email';
        try {
            const data = await res.json();
            errorMsg = data.message || data.error?.message || errorMsg;
        } catch(e) {}
        return new Response(JSON.stringify({ error: `Mail server responded with: ${errorMsg}` }), {
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
