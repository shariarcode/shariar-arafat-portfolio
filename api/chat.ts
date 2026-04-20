import type { VercelRequest, VercelResponse } from '@vercel/node';

interface PortfolioData {
    userName: string;
    userEmail: string;
    userLocation: string;
    careerObjective: string;
    heroRoles: string[];
    heroSubheading: string;
    expertiseAreas: { name: string; description: string }[];
    skillsData: { name: string; technologies: string[] }[];
    projectsData: { title: string; description: string }[];
    contactInfo: { phone: string };
    socialLinks: { linkedin: string; github: string; behance: string };
}

interface ChatMessage {
    role: 'user' | 'model';
    text: string;
}

// Helper to read the raw body from a Node.js IncomingMessage
function readBody(req: VercelRequest): Promise<string> {
    return new Promise((resolve, reject) => {
        let body = '';
        req.on('data', (chunk: Buffer) => { body += chunk.toString(); });
        req.on('end', () => resolve(body));
        req.on('error', reject);
    });
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        // Parse body — Vercel may auto-parse it or leave it as a stream
        let history: ChatMessage[];
        let portfolioData: PortfolioData;

        if (req.body && typeof req.body === 'object') {
            // Already parsed by Vercel middleware
            ({ history, portfolioData } = req.body);
        } else {
            const rawBody = await readBody(req);
            ({ history, portfolioData } = JSON.parse(rawBody));
        }

        let OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY || process.env.VITE_OPENROUTER_API_KEY;

        if (OPENROUTER_API_KEY) {
            OPENROUTER_API_KEY = OPENROUTER_API_KEY.replace(/^"|"$/g, '').replace(/\\n/g, '').trim();
            console.log("Found API key starting with:", OPENROUTER_API_KEY.substring(0, 10), "Length:", OPENROUTER_API_KEY.length);
        } else {
             console.error("API KEY IS MISSING from environment variables!");
        }

        if (!OPENROUTER_API_KEY) {
            return res.status(500).json({
                error: 'Server configuration error: Missing API key. Please set OPENROUTER_API_KEY in Vercel environment variables.',
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
            return res.status(400).json({ error: 'No user message to process.' });
        }

        const messages = [
            { role: 'system', content: systemInstruction },
            ...validContents.map(msg => ({
                role: msg.role === 'model' ? 'assistant' : 'user',
                content: msg.text,
            })),
        ];

        const openRouterRes = await fetch('https://openrouter.ai/api/v1/chat/completions', {
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
            }),
        });

        if (!openRouterRes.ok) {
            const errText = await openRouterRes.text();
            console.error('OpenRouter Error:', openRouterRes.status, errText);
            return res.status(502).json({
                error: `AI service error (${openRouterRes.status}). Please try again.`,
            });
        }

        const data = await openRouterRes.json();
        const replyText = data.choices?.[0]?.message?.content;

        if (!replyText) {
            console.error('Unexpected OpenRouter response shape:', JSON.stringify(data));
            return res.status(500).json({ error: 'Received an empty response from the AI.' });
        }

        return res.status(200).json({ reply: replyText });

    } catch (error: any) {
        console.error('Error in chat API:', error);
        return res.status(500).json({ error: 'An internal server error occurred.' });
    }
}
