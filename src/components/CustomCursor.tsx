import React, { useEffect, useRef, useState } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';

const CustomCursor: React.FC = () => {
    const [isHovering, setIsHovering] = useState(false);
    const cursorX = useMotionValue(-100);
    const cursorY = useMotionValue(-100);
    const outerX = useMotionValue(-100);
    const outerY = useMotionValue(-100);

    // Outer ring lags behind with spring physics
    const springX = useSpring(cursorX, { stiffness: 120, damping: 22, mass: 0.5 });
    const springY = useSpring(cursorY, { stiffness: 120, damping: 22, mass: 0.5 });

    // State for hover label
    const dotRef = useRef<HTMLDivElement>(null);
    const ringRef = useRef<HTMLDivElement>(null);
    const labelRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const supportsFinePointer = window.matchMedia('(pointer: fine)').matches;
        if (!supportsFinePointer) return;

        const onMove = (e: MouseEvent) => {
            cursorX.set(e.clientX);
            cursorY.set(e.clientY);
        };

        // Hide default cursor globally
        document.documentElement.classList.add('custom-cursor-active');

        const onEnterInteractive = (e: MouseEvent) => {
            const target = e.target as HTMLElement;
            const isInteractive = target.closest('a, button, [role="button"], input, textarea, select, label');
            if (!isInteractive) return;
            setIsHovering(true);
            if (ringRef.current) {
                ringRef.current.style.width = '56px';
                ringRef.current.style.height = '56px';
                ringRef.current.style.borderColor = 'rgba(111, 66, 193, 0.6)';
                ringRef.current.style.backgroundColor = 'rgba(111, 66, 193, 0.08)';
            }
            if (labelRef.current) {
                const tagName = (target.closest('a') ? 'View' : 'Click');
                labelRef.current.textContent = tagName;
                labelRef.current.style.opacity = '1';
            }
        };

        const onLeaveInteractive = () => {
            setIsHovering(false);
            if (ringRef.current) {
                ringRef.current.style.width = '36px';
                ringRef.current.style.height = '36px';
                ringRef.current.style.borderColor = 'rgba(111, 66, 193, 0.5)';
                ringRef.current.style.backgroundColor = 'transparent';
            }
            if (labelRef.current) labelRef.current.style.opacity = '0';
        };

        window.addEventListener('mousemove', onMove);
        document.addEventListener('mouseover', onEnterInteractive);
        document.addEventListener('mouseout', onLeaveInteractive);

        return () => {
            window.removeEventListener('mousemove', onMove);
            document.removeEventListener('mouseover', onEnterInteractive);
            document.removeEventListener('mouseout', onLeaveInteractive);
            document.documentElement.classList.remove('custom-cursor-active');
        };
    }, [cursorX, cursorY]);

    return (
        <div className="fixed pointer-events-none z-[9998] hidden md:block" aria-hidden>
            {/* Dot — instant follow */}
            <motion.div
                ref={dotRef}
                style={{ 
                    x: cursorX, 
                    y: cursorY,
                    translateX: '-50%',
                    translateY: '-50%'
                }}
                animate={{
                    scale: isHovering ? 2.2 : 1
                }}
                className="fixed w-2.5 h-2.5 rounded-full bg-primary z-[9999]"
                transition={{ 
                    transform: { type: 'spring', stiffness: 1000, damping: 50 },
                    scale: { duration: 0.2 }
                }}
            />

            {/* Lagging outer ring with spring physics */}
            <motion.div
                style={{ x: springX, y: springY }}
                className="fixed pointer-events-none"
            >
                <div
                    ref={ringRef}
                    className="relative flex items-center justify-center"
                    style={{
                        width: '36px',
                        height: '36px',
                        borderRadius: '50%',
                        border: '1.5px solid rgba(111, 66, 193, 0.5)',
                        transform: 'translate(-50%, -50%)',
                        transition: 'width 0.3s ease, height 0.3s ease, border-color 0.3s ease, background-color 0.3s ease',
                    }}
                >
                    {/* "View" / "Click" label */}
                    <div
                        ref={labelRef}
                        className="absolute text-[9px] font-bold text-primary uppercase tracking-wider whitespace-nowrap"
                        style={{ opacity: 0, transition: 'opacity 0.2s ease' }}
                    />
                </div>
            </motion.div>
        </div>
    );
};

export default CustomCursor;
