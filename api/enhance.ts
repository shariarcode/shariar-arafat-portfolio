import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const { text } = req.body;

        if (!text || typeof text !== 'string') {
            return res.status(400).json({ error: 'Text is required for enhancement.' });
        }

        let OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY || process.env.VITE_OPENROUTER_API_KEY;

        if (OPENROUTER_API_KEY) {
            OPENROUTER_API_KEY = OPENROUTER_API_KEY.replace(/^"|"$/g, '').replace(/\\n/g, '').trim();
        }

        if (!OPENROUTER_API_KEY) {
            return res.status(500).json({
                error: 'Server configuration error: Missing API key.',
            });
        }

        const systemInstruction = `You are an expert copywriter. Your task is to enhance the provided text for a professional portfolio.
Improve the grammar, tone, and professional impact while keeping it concise and authentic. 
Return ONLY the enhanced text without any explanations, quotes, or conversational fillers.`;

        const openRouterRes = await fetch('https://openrouter.ai/api/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
                'Content-Type': 'application/json',
                'HTTP-Referer': 'https://shariar-arafat-portfolio.vercel.app',
                'X-Title': 'Portfolio AI Writing Enhancer',
            },
            body: JSON.stringify({
                model: 'nvidia/nemotron-3-super-120b-a12b:free',
                messages: [
                    { role: 'system', content: systemInstruction },
                    { role: 'user', content: `Enhance this text: ${text}` },
                ],
                stream: false,
                max_tokens: 1000,
            }),
        });

        if (!openRouterRes.ok) {
            const errText = await openRouterRes.text();
            console.error('OpenRouter Error:', openRouterRes.status, errText);
            return res.status(502).json({
                error: `AI service error (${openRouterRes.status}).`,
            });
        }

        const data = await openRouterRes.json();
        const enhancedText = data.choices?.[0]?.message?.content?.trim();

        if (!enhancedText) {
            return res.status(500).json({ error: 'Received an empty response from the AI.' });
        }

        return res.status(200).json({ enhancedText });

    } catch (error: any) {
        console.error('Error in enhance API:', error);
        return res.status(500).json({ error: 'An internal server error occurred.' });
    }
}
