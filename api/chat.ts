
import { GoogleGenAI } from '@google/genai';

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
    const API_KEY = process.env.API_KEY;

    if (!API_KEY) {
        return new Response(JSON.stringify({ error: 'API key is not configured on the server.' }), {
          status: 500,
          headers: { 'Content-Type': 'application/json' },
        });
    }

    // Initialize the Google GenAI client with a named parameter
    const ai = new GoogleGenAI({ apiKey: API_KEY });
    
    // Create a more concise summary of the portfolio data to keep the prompt efficient.
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

    const contents = history.map(msg => ({
      role: msg.role,
      parts: [{ text: msg.text }],
    }));

    // CRITICAL FIX: The Gemini API's 'generateContent' endpoint requires the conversation history
    // to start with a 'user' role. The frontend sends a history that begins with the model's
    // initial greeting. We must slice this off to create a valid request.
    let validContents = contents;
    if (validContents.length > 0 && validContents[0].role === 'model') {
        validContents = validContents.slice(1);
    }

    // Ensure there's still something to process after slicing.
    if (validContents.length === 0) {
        return new Response(JSON.stringify({ error: 'No user message to process.' }), {
            status: 400,
            headers: { 'Content-Type': 'application/json' },
        });
    }

    // Using the recommended gemini-3-flash-preview model for basic text tasks
    const result = await ai.models.generateContentStream({
        model: 'gemini-3-flash-preview',
        contents: validContents,
        config: { systemInstruction }
    });

    const stream = new ReadableStream({
      async start(controller) {
        for await (const chunk of result) {
          // Access the text property directly from the chunk (chunk is a GenerateContentResponse)
          const chunkText = chunk.text;
          if (chunkText) {
             controller.enqueue(new TextEncoder().encode(chunkText));
          }
        }
        controller.close();
      },
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
