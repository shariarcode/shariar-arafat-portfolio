export const config = {
  runtime: 'edge',
};

// Simple in-memory rate limiter for Edge (resets on cold start but helps with burst protection)
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();
const RATE_LIMIT = 3; // max 3 requests per window
const RATE_WINDOW = 60 * 1000; // 1 minute window

// Honeypot timestamp storage (prevents rapid submissions)
const submissionTimestamps = new Map<string, number>();
const MIN_SUBMISSION_INTERVAL = 5000; // 5 seconds between submissions from same IP

function isRateLimited(ip: string): { limited: boolean; retryAfter?: number } {
  const now = Date.now();
  const record = rateLimitMap.get(ip);

  if (!record) {
    rateLimitMap.set(ip, { count: 1, resetTime: now + RATE_WINDOW });
    return { limited: false };
  }

  if (now > record.resetTime) {
    rateLimitMap.set(ip, { count: 1, resetTime: now + RATE_WINDOW });
    return { limited: false };
  }

  if (record.count >= RATE_LIMIT) {
    return { limited: true, retryAfter: Math.ceil((record.resetTime - now) / 1000) };
  }

  record.count++;
  return { limited: false };
}

function isRapidSubmission(ip: string): boolean {
  const now = Date.now();
  const lastSubmission = submissionTimestamps.get(ip);

  if (lastSubmission && (now - lastSubmission) < MIN_SUBMISSION_INTERVAL) {
    return true;
  }

  submissionTimestamps.set(ip, now);
  return false;
}

function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

function sanitizeString(str: unknown, maxLength: number): string {
  if (typeof str !== 'string') return '';
  return str.trim().slice(0, maxLength);
}

export default async function handler(req: Request) {
  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'anonymous';

  // Rate limiting check
  const rateLimitCheck = isRateLimited(ip);
  if (rateLimitCheck.limited) {
    return new Response(JSON.stringify({ 
      error: `Too many requests. Please try again in ${rateLimitCheck.retryAfter} seconds.` 
    }), {
      status: 429,
      headers: { 
        'Content-Type': 'application/json',
        'Retry-After': String(rateLimitCheck.retryAfter)
      },
    });
  }

  // Rapid submission check (anti-spam)
  if (isRapidSubmission(ip)) {
    return new Response(JSON.stringify({ 
      error: 'Please wait a moment before submitting again.' 
    }), {
      status: 429,
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
    const body = await req.json();
    let { name, email, subject, message, honeypot } = body;

    // Honeypot check - if filled, it's a bot
    if (honeypot && honeypot.length > 0) {
      // Silently reject but return success to fool the bot
      return new Response(JSON.stringify({ message: 'Email sent successfully!' }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Validate required fields
    if (!name || !email || !subject || !message) {
      return new Response(JSON.stringify({ error: 'Missing required fields. Please fill out the entire form.' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Sanitize and validate
    name = sanitizeString(name, 100);
    email = sanitizeString(email, 254);
    subject = sanitizeString(subject, 200);
    message = sanitizeString(message, 5000);

    if (!name || !email || !subject || !message) {
      return new Response(JSON.stringify({ error: 'Invalid field values.' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Email format validation
    if (!validateEmail(email)) {
      return new Response(JSON.stringify({ error: 'Please enter a valid email address.' }), {
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
