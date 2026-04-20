export const config = {
  runtime: 'edge',
};

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

    // Get your OpenRouter key from .env (fallback to VITE_API_KEY if you just renamed the old one)
    const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY || process.env.VITE_API_KEY;
    
    if (!OPENROUTER_API_KEY) {
        throw new Error("Missing OpenRouter API Key");
    }

    const expertiseText = portfolioData.expertiseAreas.map(a => a.name).join(', ');
    const skillsText = [...new Set(portfolioData.skillsData.flatMap(s => s.technologies))].join(', ');
    const projectsText = portfolioData.projectsData.map(p => p.title).join(', ');

    const systemInstruction = `You are a friendly, helpful AI assistant for Shariar Arafat. Answer questions about him using the provided context. You can also have a general conversation.

CONTEXT ABOUT SHARIAR ARAFAT:
- Name: ${portfolioData.userName}
- Summary: ${portfolioData.heroSubheading}
- Roles: ${portfolioData.heroRoles.join(', ')}
- Goal: ${portfolioData.careerObjective}
- Expertise: ${expertiseText}
- Skills: ${skillsText}
- Key Projects: ${projectsText}
- Contact: ${portfolioData.userEmail}, located in ${portfolioData.userLocation}

If a question cannot be answered from this context, say you don't have information on that topic. Be polite and conversational.`;

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

    // Format matches OpenRouter/OpenAI standards
    const messages = [
        { role: 'system', content: systemInstruction },
        ...validContents.map(msg => ({
            role: msg.role === 'model' ? 'assistant' : 'user',
            content: msg.text
        }))
    ];

    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
            'Content-Type': 'application/json',
            'HTTP-Referer': 'https://shariar-arafat-portfolio.vercel.app',
            'X-Title': 'Portfolio AI Assistant', 
        },
        body: JSON.stringify({
            model: 'google/gemma-3-27b-it:free',
            messages,
            stream: true
        })
    });

    if (!response.ok) {
        const errText = await response.text();
        console.error("OpenRouter Error Response:", response.status, errText);
        return new Response(
            JSON.stringify({ error: `OpenRouter Error ${response.status}: ${errText.slice(0, 200)}` }),
            { status: 502, headers: { 'Content-Type': 'application/json' } }
        );
    }

    // Parse the Server-Sent Events (SSE) stream from OpenRouter
    const stream = new ReadableStream({
      async start(controller) {
        const reader = response.body?.getReader();
        const decoder = new TextDecoder("utf-8");
        let buffer = '';

        if (!reader) {
            controller.close();
            return;
        }

        try {
            while (true) {
                const { done, value } = await reader.read();
                if (done) break;

                buffer += decoder.decode(value, { stream: true });
                const lines = buffer.split('\n');
                
                // Keep the last incomplete line in the buffer
                buffer = lines.pop() || '';
                
                for (const line of lines) {
                    if (line.startsWith('data: ') && line.trim() !== 'data: [DONE]') {
                        try {
                            const data = JSON.parse(line.substring(6));
                            const content = data.choices[0]?.delta?.content || "";
                            if (content) {
                                controller.enqueue(new TextEncoder().encode(content));
                            }
                        } catch (e) {
                            // Ignored: incomplete JSON chunk string
                        }
                    }
                }
            }
        } finally {
            reader.releaseLock();
            controller.close();
        }
      }
    });

    return new Response(stream, {
      headers: { 'Content-Type': 'text/plain; charset=utf-8' },
    });

  } catch (error: any) {
    console.error('Error in chat API:', error);
    return new Response(JSON.stringify({ error: 'An internal server error occurred.' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
