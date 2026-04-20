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

  const web3formsKey = process.env.WEB3FORMS_ACCESS_KEY;

  if (!web3formsKey || web3formsKey.trim() === '') {
    return new Response(JSON.stringify({ error: 'Server configuration error: WEB3FORMS_ACCESS_KEY is missing.' }), {
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

    const res = await fetch('https://api.web3forms.com/submit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        access_key: web3formsKey,
        name,
        email,
        subject: `Portfolio Contact: ${subject}`,
        message: `From: ${name} <${email}>\n\n${message}`,
        // This tells Web3Forms to send a plain-text + formatted email
        botcheck: false,
      }),
    });

    const data = await res.json();

    if (!res.ok || !data.success) {
      console.error('Web3Forms error:', data);
      return new Response(JSON.stringify({ error: data.message || 'Failed to send email. Please try again.' }), {
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
    return new Response(JSON.stringify({ error: 'An internal server error occurred.' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
