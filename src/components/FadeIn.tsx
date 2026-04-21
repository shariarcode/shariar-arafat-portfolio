import React, { ReactNode } from 'react';
import { motion } from 'framer-motion';

interface FadeInProps {
    children: ReactNode;
    delay?: number;
    direction?: 'up' | 'down' | 'left' | 'right' | 'none';
    duration?: number;
    className?: string;
}

const FadeIn: React.FC<FadeInProps> = ({ 
    children, 
    delay = 0, 
    direction = 'up', 
    duration = 0.5,
    className = ''
}) => {
    const hiddenState = {
        opacity: 0,
        y: direction === 'up' ? 40 : direction === 'down' ? -40 : 0,
        x: direction === 'left' ? 40 : direction === 'right' ? -40 : 0,
    };

    return (
        <motion.div
            initial={hiddenState}
            whileInView={{ opacity: 1, y: 0, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: duration, delay: delay, ease: 'easeOut' }}
            className={className}
        >
            {children}
        </motion.div>
    );
};

export default FadeIn;
