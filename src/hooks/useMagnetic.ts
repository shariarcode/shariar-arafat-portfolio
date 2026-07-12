import { useEffect, useRef } from 'react';
import gsap from 'gsap';

export const useMagnetic = (strength: number = 0.35) => {
    const ref = useRef<any>(null);

    useEffect(() => {
        const el = ref.current;
        if (!el) return;

        const onMouseMove = (e: MouseEvent) => {
            const rect = el.getBoundingClientRect();
            const centerX = rect.left + rect.width / 2;
            const centerY = rect.top + rect.height / 2;
            
            const distanceX = e.clientX - centerX;
            const distanceY = e.clientY - centerY;
            
            const distance = Math.hypot(distanceX, distanceY);
            const triggerRange = Math.max(rect.width, rect.height, 60);
            
            if (distance < triggerRange) {
                // Pull toward mouse
                gsap.to(el, {
                    x: distanceX * strength,
                    y: distanceY * strength,
                    duration: 0.3,
                    ease: 'power2.out',
                    overwrite: 'auto'
                });
            } else {
                // Return to normal
                gsap.to(el, {
                    x: 0,
                    y: 0,
                    duration: 0.4,
                    ease: 'power2.out',
                    overwrite: 'auto'
                });
            }
        };

        const onMouseLeave = () => {
            gsap.to(el, {
                x: 0,
                y: 0,
                duration: 0.5,
                ease: 'elastic.out(1, 0.4)',
                overwrite: 'auto'
            });
        };

        window.addEventListener('mousemove', onMouseMove);
        el.addEventListener('mouseleave', onMouseLeave);

        return () => {
            window.removeEventListener('mousemove', onMouseMove);
            el.removeEventListener('mouseleave', onMouseLeave);
        };
    }, [strength]);

    return ref;
};
