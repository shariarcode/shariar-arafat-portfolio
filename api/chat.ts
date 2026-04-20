interface PortfolioData {
    userName: string;
    userEmail: string;
    userLocation: string;
    careerObjective: string;
    heroRoles: string[];
    heroSubheading: string;
    expertiseAreas: { name: string; description: string }[];
    skillsData: { name: string, technologies: string[] }[];
    projectsData: { title: string, description:string }[];
    contactInfo: { phone: string };
    socialLinks: { linkedin: string; github: string; behance: string };
}

interface ChatMessage {
    role: 'user' | 'model';
    text: string;
}

export default async function handler(req: Request) {
  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  try {
    const { history, portfolioData } = await req.json() as { history: ChatMessage[], portfolioData: PortfolioData };

    const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY || process.env.VITE_OPENROUTER_API_KEY || process.env.VITE_API_KEY;

    if (!OPENROUTER_API_KEY) {
        return new Response(JSON.stringify({ error: 'Server configuration error: Missing API key. Please set OPENROUTER_API_KEY in Vercel environment variables.' }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
        });
    }

    const expertiseText = portfolioData.expertiseAreas.map(a => a.name).join(', ');
    const skillsText = [...new Set(portfolioData.skillsData.flatMap(s => s.technologies))].join(', ');
    const projectsText = portfolioData.projectsData.map(p => p.title).join(', ');

    const systemInstruction = `You are a friendly, helpful AI assistant for Shariar Arafat's portfolio website. Answer questions about him using the provided context. Keep answers concise and conversational.

CONTEXT ABOUT SHARIAR ARAFAT:
- Name: ${portfolioData.userName}
- Summary: ${portfolioData.heroSubheading}
- Roles: ${portfolioData.heroRoles.join(', ')}
- Goal: ${portfolioData.careerObjective}
- Expertise: ${expertiseText}
- Skills & Technologies: ${skillsText}
- Key Projects: ${projectsText}
- Contact: ${portfolioData.userEmail}, located in ${portfolioData.userLocation}

If asked something outside this context, politely say you don't have that information. Always be helpful and professional.`;

    let validContents = history;
    if (validContents.length > 0 && validContents[0].role === 'model') {
        validContents = validContents.slice(1); // skip initial greeting
    }

    if (validContents.length === 0) {
        return new Response(JSON.stringify({ error: 'No user message to process.' }), {
            status: 400,
            headers: { 'Content-Type': 'application/json' },
        });
    }

    const messages = [
        { role: 'system', content: systemInstruction },
        ...validContents.map(msg => ({
            role: msg.role === 'model' ? 'assistant' : 'user',
            content: msg.text
        }))
    ];

    // Using non-streaming for maximum reliability across all hosting runtimes
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
            'Content-Type': 'application/json',
            'HTTP-Referer': 'https://shariar-arafat-portfolio.vercel.app',
            'X-Title': 'Portfolio AI Assistant',
        },
        body: JSON.stringify({
            model: 'nvidia/nemotron-3-super-120b-a12b:free',
            messages,
            stream: false,
            max_tokens: 500,
        })
    });

    if (!response.ok) {
        const errText = await response.text();
        console.error('OpenRouter Error:', response.status, errText);
        return new Response(
            JSON.stringify({ error: `AI service error (${response.status}). Please try again.` }),
            { status: 502, headers: { 'Content-Type': 'application/json' } }
        );
    }

    const data = await response.json();
    const replyText = data.choices?.[0]?.message?.content;

    if (!replyText) {
        console.error('Unexpected OpenRouter response shape:', JSON.stringify(data));
        return new Response(JSON.stringify({ error: 'Received an empty response from the AI.' }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
        });
    }

    return new Response(JSON.stringify({ reply: replyText }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
    });

  } catch (error: any) {
    console.error('Error in chat API:', error);
    return new Response(JSON.stringify({ error: 'An internal server error occurred.' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
