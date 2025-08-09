import React, { useState, useEffect, useRef } from 'react';
import { CloseIcon, SparklesIcon, SendIcon } from './Icons';
import type { PortfolioData, ChatMessage } from '../types';

interface ChatbotProps {
    onClose: () => void;
    portfolioData: PortfolioData;
}

const Chatbot: React.FC<ChatbotProps> = ({ onClose, portfolioData }) => {
    const [messages, setMessages] = useState<ChatMessage[]>([
        { role: 'model', text: `Hello! I'm Shariar's AI assistant. How can I help you today?` }
    ]);
    const [userInput, setUserInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const handleSendMessage = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!userInput.trim() || isLoading) return;

        const userMessage: ChatMessage = { role: 'user', text: userInput };
        const newHistory = [...messages, userMessage];
        
        setMessages(newHistory);
        setUserInput('');
        setIsLoading(true);
        setError(null);

        // Add a placeholder for the model's response
        setMessages(prev => [...prev, { role: 'model', text: '' }]);

        try {
            const response = await fetch('/api/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    history: newHistory, // Send history including the latest user message
                    portfolioData,
                }),
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({ error: 'The server returned an error.' }));
                throw new Error(errorData.error);
            }

            const reader = response.body?.getReader();
            if (!reader) {
                throw new Error('Failed to read response stream.');
            }

            const decoder = new TextDecoder();
            let currentModelMessage = '';

            while (true) {
                const { done, value } = await reader.read();
                if (done) break;

                currentModelMessage += decoder.decode(value, { stream: true });
                setMessages(prev => {
                    const latestMessages = [...prev];
                    latestMessages[latestMessages.length - 1] = { role: 'model', text: currentModelMessage };
                    return latestMessages;
                });
            }

        } catch (err: any) {
            console.error("AI chat error:", err);
            const errorMessage = "Sorry, I couldn't get a response. Please try again later.";
            setError(errorMessage);
            setMessages(prev => {
                const latestMessages = [...prev];
                latestMessages[latestMessages.length - 1] = { role: 'model', text: errorMessage };
                return latestMessages;
            });
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
                 {isLoading && messages[messages.length-1]?.role === 'model' && messages[messages.length-1]?.text === '' && (
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
                        disabled={isLoading}
                        className="w-full px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-full text-sm text-gray-900 dark:text-white focus:ring-2 focus:ring-primary focus:outline-none disabled:opacity-50"
                    />
                    <button type="submit" disabled={isLoading || !userInput.trim()} className="p-3 bg-primary text-white rounded-full hover:bg-primary-dark disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors">
                        <SendIcon className="h-5 w-5" />
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Chatbot;