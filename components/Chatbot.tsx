import React, { useState, useEffect, useRef } from 'react';
import { GoogleGenAI, Chat } from '@google/genai';
import { CloseIcon, SparklesIcon, SendIcon } from './Icons';
import type { PortfolioData, ChatMessage } from '../types';

interface ChatbotProps {
    onClose: () => void;
    portfolioData: PortfolioData;
}

const Chatbot: React.FC<ChatbotProps> = ({ onClose, portfolioData }) => {
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [userInput, setUserInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const chatRef = useRef<Chat | null>(null);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    
    const API_KEY = process.env.API_KEY;

    useEffect(() => {
        if (!API_KEY) {
            setError("API key is not configured. The chatbot is disabled.");
            return;
        }

        const ai = new GoogleGenAI({ apiKey: API_KEY });
        const systemInstruction = `You are a friendly and professional AI assistant for Shariar Arafat's portfolio website. Your goal is to answer questions from visitors like potential employers or collaborators based ONLY on the information provided below. Be concise and helpful. If a question is outside the scope of this information, politely state that you can only answer questions related to Shariar's portfolio.

        Here is all the information about Shariar Arafat:
        - Name: ${portfolioData.userName}
        - Email: ${portfolioData.userEmail}
        - Location: ${portfolioData.userLocation}
        - Career Objective: ${portfolioData.careerObjective}
        - Key Roles: ${portfolioData.heroRoles.join(', ')}
        - Subheading: ${portfolioData.heroSubheading}
        - Expertise Areas: ${portfolioData.expertiseAreas.map(area => `${area.name}: ${area.description}`).join('; ')}
        - Technical Skills: ${portfolioData.skillsData.map(skill => `${skill.name} (Technologies: ${skill.technologies.join(', ')})`).join('; ')}
        - Projects: ${portfolioData.projectsData.map(project => `${project.title}: ${project.description}`).join('; ')}
        - Contact Phone: ${portfolioData.contactInfo.phone}
        - Social Links: LinkedIn: ${portfolioData.socialLinks.linkedin}, GitHub: ${portfolioData.socialLinks.github}, Behance: ${portfolioData.socialLinks.behance}
        `;

        chatRef.current = ai.chats.create({
            model: 'gemini-2.5-flash',
            config: { systemInstruction },
        });

        setMessages([{ role: 'model', text: `Hello! I'm Shariar's AI assistant. How can I help you today?` }]);
    }, [portfolioData, API_KEY]);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const handleSendMessage = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!userInput.trim() || isLoading || !chatRef.current) return;
        
        const userMessage: ChatMessage = { role: 'user', text: userInput };
        setMessages(prev => [...prev, userMessage]);
        setUserInput('');
        setIsLoading(true);
        setError(null);

        try {
            const stream = await chatRef.current.sendMessageStream({ message: userInput });
            
            let currentModelMessage = '';
            setMessages(prev => [...prev, { role: 'model', text: '' }]);

            for await (const chunk of stream) {
                currentModelMessage += chunk.text;
                setMessages(prev => {
                    const newMessages = [...prev];
                    newMessages[newMessages.length - 1] = { role: 'model', text: currentModelMessage };
                    return newMessages;
                });
            }

        } catch (err: any) {
            console.error("AI chat error:", err);
            const errorMessage = "Sorry, I encountered an error. Please try again.";
            setError(errorMessage);
            setMessages(prev => [...prev, { role: 'model', text: errorMessage }]);
        } finally {
            setIsLoading(false);
        }
    };
    
    return (
        <div className="fixed bottom-0 right-0 sm:bottom-8 sm:right-8 w-full h-full sm:w-[400px] sm:h-[600px] bg-white dark:bg-dark-card shadow-2xl rounded-t-2xl sm:rounded-2xl flex flex-col z-[100] animate-slide-up">
            {/* Header */}
            <div className="flex-shrink-0 flex items-center justify-between p-4 bg-gray-100 dark:bg-gray-900 rounded-t-2xl sm:rounded-t-lg border-b border-gray-200 dark:border-gray-700">
                <div className="flex items-center gap-2">
                    <SparklesIcon className="text-primary" />
                    <h3 className="font-bold text-lg text-gray-900 dark:text-white">AI Assistant</h3>
                </div>
                <button onClick={onClose} className="p-2 rounded-full text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700">
                    <CloseIcon />
                </button>
            </div>

            {/* Messages */}
            <div className="flex-grow p-4 overflow-y-auto space-y-4">
                {messages.map((msg, index) => (
                    <div key={index} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                        <div className={`max-w-[80%] p-3 rounded-2xl ${msg.role === 'user' ? 'bg-primary text-white rounded-br-none' : 'bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white rounded-bl-none'}`}>
                            <p className="text-sm" style={{ whiteSpace: 'pre-wrap' }}>{msg.text}</p>
                        </div>
                    </div>
                ))}
                 {isLoading && (
                    <div className="flex justify-start">
                       <div className="max-w-[80%] p-3 rounded-2xl bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white rounded-bl-none">
                            <div className="flex items-center space-x-1">
                               <div className="h-2 w-2 bg-primary rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                               <div className="h-2 w-2 bg-primary rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                               <div className="h-2 w-2 bg-primary rounded-full animate-bounce"></div>
                            </div>
                        </div>
                    </div>
                )}
                <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="flex-shrink-0 p-4 bg-gray-100 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 rounded-b-2xl sm:rounded-b-lg">
                {error && <p className="text-red-500 text-xs text-center mb-2">{error}</p>}
                <form onSubmit={handleSendMessage} className="flex items-center gap-2">
                    <input
                        type="text"
                        value={userInput}
                        onChange={(e) => setUserInput(e.target.value)}
                        placeholder="Ask about my skills..."
                        disabled={isLoading || !!error}
                        className="w-full px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-full text-sm text-gray-900 dark:text-white focus:ring-2 focus:ring-primary focus:outline-none disabled:opacity-50"
                    />
                    <button type="submit" disabled={isLoading || !userInput.trim() || !!error} className="p-3 bg-primary text-white rounded-full hover:bg-primary-dark disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors">
                        <SendIcon className="h-5 w-5" />
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Chatbot;
