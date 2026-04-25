import type { VercelRequest, VercelResponse } from '@vercel/node';

interface ChatMessage {
    role: 'user' | 'model';
    text: string;
}

interface PortfolioData {
    userName: string;
    userEmail: string;
    userLocation: string;
    heroSubheading: string;
    heroRoles: string[];
    careerObjective: string;
    expertiseAreas: { name: string }[];
    skillsData: { technologies: string[] }[];
    projectsData: { title: string }[];
}

// Simple in-memory rate limiting (Note: This resets on function redeploy/cold start)
const rateLimit = new Map<string, { count: number, lastRequest: number }>();
const LIMIT = 5; // max 5 requests
const WINDOW = 60 * 1000; // per 1 minute

function isRateLimited(ip: string): boolean {
    const now = Date.now();
    const userLimit = rateLimit.get(ip);

    if (!userLimit) {
        rateLimit.set(ip, { count: 1, lastRequest: now });
        return false;
    }

    if (now - userLimit.lastRequest > WINDOW) {
        rateLimit.set(ip, { count: 1, lastRequest: now });
        return false;
    }

    if (userLimit.count >= LIMIT) {
        return true;
    }

    userLimit.count++;
    return false;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const ip = (req.headers['x-forwarded-for'] as string) || 'anonymous';
    if (isRateLimited(ip)) {
        return res.status(429).json({ error: 'Too many requests. Please try again in a minute.' });
    }

    try {
        let history: ChatMessage[];
        let portfolioData: PortfolioData;

        if (req.body && typeof req.body === 'object') {
            ({ history, portfolioData } = req.body);
        } else {
            return res.status(400).json({ error: 'Invalid request body' });
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

        const customInstruction = portfolioData.aiSettings?.systemInstruction;
        
        const systemInstruction = customInstruction || `You are a friendly, helpful AI assistant for Shariar Arafat's portfolio website. Answer questions about him using the provided context. Keep answers concise and conversational.

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

        // If custom instruction exists, we should still append the context to help it answer facts
        const finalInstruction = customInstruction 
            ? `${customInstruction}\n\nUSE THIS CONTEXT TO ANSWER QUESTIONS:\n- Name: ${portfolioData.userName}\n- Skills: ${skillsText}\n- Projects: ${projectsText}\n- Contact: ${portfolioData.userEmail}`
            : systemInstruction;

        let validContents = history;
        if (validContents.length > 0 && validContents[0].role === 'model') {
            validContents = validContents.slice(1); // skip initial greeting
        }

        if (validContents.length === 0) {
            return res.status(400).json({ error: 'No user message to process.' });
        }

        const messages = [
            { role: 'system', content: finalInstruction },
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
