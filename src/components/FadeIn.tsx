import React, { ReactNode } from 'react';
import { motion } from 'framer-motion';

interface FadeInProps {
    children: ReactNode;
    delay?: number;
    direction?: 'up' | 'down' | 'left' | 'right' | 'none';
    duration?: number;
    className?: string;
    stagger?: boolean;       // enable staggered children
    staggerDelay?: number;   // delay between each child
}

// Variants for the parent when stagger=true
const containerVariants = (staggerDelay: number) => ({
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: staggerDelay,
            delayChildren: 0.05,
        },
    },
});

const childVariants = (direction: FadeInProps['direction']) => ({
    hidden: {
        opacity: 0,
        y: direction === 'up' ? 30 : direction === 'down' ? -30 : 0,
        x: direction === 'left' ? 30 : direction === 'right' ? -30 : 0,
    },
    visible: {
        opacity: 1,
        y: 0,
        x: 0,
        transition: { duration: 0.5, ease: 'easeOut' as const },
    },
});

const FadeIn: React.FC<FadeInProps> = ({
    children,
    delay = 0,
    direction = 'up',
    duration = 0.5,
    className = '',
    stagger = false,
    staggerDelay = 0.08,
}) => {
    const hiddenState = {
        opacity: 0,
        y: direction === 'up' ? 40 : direction === 'down' ? -40 : 0,
        x: direction === 'left' ? 40 : direction === 'right' ? -40 : 0,
    };

    if (stagger) {
        return (
            <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: '-80px' }}
                variants={containerVariants(staggerDelay)}
                className={className}
            >
                {React.Children.map(children, (child) =>
                    child ? (
                        <motion.div variants={childVariants(direction)}>
                            {child}
                        </motion.div>
                    ) : null
                )}
            </motion.div>
        );
    }

    return (
        <motion.div
            initial={hiddenState}
            whileInView={{ opacity: 1, y: 0, x: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration, delay, ease: 'easeOut' }}
            className={className}
        >
            {children}
        </motion.div>
    );
};

export default FadeIn;
