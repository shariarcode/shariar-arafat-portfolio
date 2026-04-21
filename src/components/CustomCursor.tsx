import React, { useEffect, useState } from 'react';

const CustomCursor: React.FC = () => {
    const [enabled, setEnabled] = useState(false);
    const [pos, setPos] = useState({ x: 0, y: 0 });

    useEffect(() => {
        const supportsFinePointer = window.matchMedia('(pointer: fine)').matches;
        setEnabled(supportsFinePointer);
        if (!supportsFinePointer) return;

        const onMove = (event: MouseEvent) => {
            setPos({ x: event.clientX, y: event.clientY });
        };
        window.addEventListener('mousemove', onMove);
        return () => window.removeEventListener('mousemove', onMove);
    }, []);

    if (!enabled) return null;

    return (
        <div
            aria-hidden
            className="fixed pointer-events-none z-[120] hidden md:block"
            style={{ left: pos.x, top: pos.y, transform: 'translate(-50%, -50%)' }}
        >
            <div className="relative">
                <div className="w-3 h-3 rounded-full bg-primary" />
                <div className="absolute -top-3 -left-3 w-9 h-9 rounded-full border border-primary/50" />
            </div>
        </div>
    );
};

export default CustomCursor;
