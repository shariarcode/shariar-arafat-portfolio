import React from 'react';
import { ChatIcon } from './Icons';

interface ChatBubbleProps {
    onOpen: () => void;
}

const ChatBubble: React.FC<ChatBubbleProps> = ({ onOpen }) => {
    return (
        <button
            onClick={onOpen}
            className="fixed bottom-8 left-8 bg-primary hover:bg-primary-dark text-white p-4 rounded-full shadow-lg transition-all duration-300 z-50 animate-bounce"
            aria-label="Open AI Chat"
        >
            <ChatIcon className="h-7 w-7" />
        </button>
    );
};

export default ChatBubble;