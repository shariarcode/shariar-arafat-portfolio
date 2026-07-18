import React from 'react';
import { ChatIcon } from './Icons';
import { motion } from 'framer-motion';

interface ChatBubbleProps {
    onOpen: () => void;
}

const ChatBubble: React.FC<ChatBubbleProps> = ({ onOpen }) => {
    return (
        <motion.button
            onClick={onOpen}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 260, damping: 20 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            className="fixed bottom-5 right-5 md:bottom-6 md:right-6 lg:bottom-8 lg:right-8 left-auto bg-primary hover:bg-primary-dark text-white p-4 rounded-full shadow-[0_0_20px_rgba(0,223,143,0.35)] hover:shadow-[0_0_25px_rgba(0,223,143,0.55)] transition-shadow duration-300 z-[1050] min-w-[56px] min-h-[56px] flex items-center justify-center"
            aria-label="Open AI Chat"
        >
            <ChatIcon className="h-7 w-7 text-white" />
        </motion.button>
    );
};

export default ChatBubble;