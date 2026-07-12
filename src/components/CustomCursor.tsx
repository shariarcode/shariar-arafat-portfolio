import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';

const CustomCursor: React.FC = () => {
    const dotRef = useRef<HTMLDivElement>(null);
    const ringRef = useRef<HTMLDivElement>(null);
    const labelRef = useRef<HTMLDivElement>(null);
    
    const mouse = useRef({ x: -100, y: -100 });
    const ringPos = useRef({ x: -100, y: -100 });
    const activeMagnetic = useRef<HTMLElement | null>(null);

    useEffect(() => {
        // Automatically disable on touch devices
        const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
        if (isTouchDevice) return;

        // Hide default cursor globally
        document.documentElement.classList.add('custom-cursor-active');

        const onMouseMove = (e: MouseEvent) => {
            mouse.current.x = e.clientX;
            mouse.current.y = e.clientY;

            // Instantly move the small dot
            if (!activeMagnetic.current) {
                gsap.to(dotRef.current, {
                    x: e.clientX,
                    y: e.clientY,
                    duration: 0.08,
                    overwrite: 'auto'
                });
            } else {
                // Snapped dot movement (slightly moves within the snapped area)
                const rect = activeMagnetic.current.getBoundingClientRect();
                const centerX = rect.left + rect.width / 2;
                const centerY = rect.top + rect.height / 2;
                const diffX = e.clientX - centerX;
                const diffY = e.clientY - centerY;
                
                gsap.to(dotRef.current, {
                    x: centerX + diffX * 0.15,
                    y: centerY + diffY * 0.15,
                    duration: 0.15,
                    overwrite: 'auto'
                });
            }
        };

        // Smoothly interpolate the lagging outer ring position
        let animFrameId: number;
        const render = () => {
            // Check if active magnetic element has been unmounted from DOM
            if (activeMagnetic.current && !document.body.contains(activeMagnetic.current)) {
                activeMagnetic.current = null;
                gsap.to(ringRef.current, {
                    width: 36,
                    height: 36,
                    borderRadius: '50%',
                    backgroundColor: 'transparent',
                    borderColor: 'rgba(255, 255, 255, 0.4)',
                    duration: 0.3,
                    overwrite: 'auto'
                });
                gsap.to(dotRef.current, {
                    scale: 1,
                    duration: 0.2
                });
                if (labelRef.current) {
                    gsap.to(labelRef.current, { opacity: 0, duration: 0.2 });
                }
            }

            if (!activeMagnetic.current) {
                // Standard lag follow
                ringPos.current.x += (mouse.current.x - ringPos.current.x) * 0.15;
                ringPos.current.y += (mouse.current.y - ringPos.current.y) * 0.15;
                
                gsap.set(ringRef.current, {
                    x: ringPos.current.x,
                    y: ringPos.current.y
                });
            } else {
                // Snap to magnetic element
                const rect = activeMagnetic.current.getBoundingClientRect();
                const centerX = rect.left + rect.width / 2;
                const centerY = rect.top + rect.height / 2;
                
                ringPos.current.x += (centerX - ringPos.current.x) * 0.25;
                ringPos.current.y += (centerY - ringPos.current.y) * 0.25;
                
                gsap.set(ringRef.current, {
                    x: ringPos.current.x,
                    y: ringPos.current.y
                });
            }
            animFrameId = requestAnimationFrame(render);
        };
        animFrameId = requestAnimationFrame(render);

        const onMouseOver = (e: MouseEvent) => {
            const target = e.target as HTMLElement;
            const interactive = target.closest('a, button, [role="button"], input, textarea, select, label, .clickable');
            const magnetic = target.closest('[data-magnetic]') as HTMLElement;

            if (interactive) {
                // Outer ring expansion
                gsap.to(ringRef.current, {
                    width: magnetic ? rectWidth(magnetic) : 56,
                    height: magnetic ? rectHeight(magnetic) : 56,
                    borderRadius: magnetic ? '12px' : '50%',
                    backgroundColor: 'rgba(255, 255, 255, 0.12)',
                    borderColor: 'rgba(255, 255, 255, 0.9)',
                    duration: 0.3,
                    overwrite: 'auto'
                });
                
                gsap.to(dotRef.current, {
                    scale: 2.0,
                    duration: 0.2
                });

                if (labelRef.current) {
                    const tag = target.closest('a') ? 'View' : 'Click';
                    labelRef.current.textContent = tag;
                    gsap.to(labelRef.current, { opacity: 1, duration: 0.2 });
                }
            }

            if (magnetic) {
                activeMagnetic.current = magnetic;
                const rect = magnetic.getBoundingClientRect();
                
                gsap.to(ringRef.current, {
                    width: rect.width + 12,
                    height: rect.height + 12,
                    borderRadius: '12px',
                    borderColor: 'rgba(255, 255, 255, 0.6)',
                    backgroundColor: 'rgba(255, 255, 255, 0.08)',
                    duration: 0.3,
                    overwrite: 'auto'
                });
            }
        };

        const rectWidth = (el: HTMLElement) => el.getBoundingClientRect().width;
        const rectHeight = (el: HTMLElement) => el.getBoundingClientRect().height;

        const onMouseOut = (e: MouseEvent) => {
            const target = e.target as HTMLElement;
            const related = e.relatedTarget as HTMLElement;
            
            const interactive = target.closest('a, button, [role="button"], input, textarea, select, label, .clickable');
            const relatedInteractive = related ? related.closest('a, button, [role="button"], input, textarea, select, label, .clickable') : null;
            
            if (interactive && !relatedInteractive) {
                gsap.to(ringRef.current, {
                    width: 36,
                    height: 36,
                    borderRadius: '50%',
                    backgroundColor: 'transparent',
                    borderColor: 'rgba(255, 255, 255, 0.4)',
                    duration: 0.3,
                    overwrite: 'auto'
                });
                gsap.to(dotRef.current, {
                    scale: 1,
                    duration: 0.2
                });
                if (labelRef.current) {
                    gsap.to(labelRef.current, { opacity: 0, duration: 0.2 });
                }
            }

            const magnetic = target.closest('[data-magnetic]');
            const relatedMagnetic = related ? related.closest('[data-magnetic]') : null;

            if (magnetic && !relatedMagnetic) {
                activeMagnetic.current = null;
                gsap.to(ringRef.current, {
                    width: 36,
                    height: 36,
                    borderRadius: '50%',
                    duration: 0.3,
                    overwrite: 'auto'
                });
            }
        };

        window.addEventListener('mousemove', onMouseMove);
        document.addEventListener('mouseover', onMouseOver);
        document.addEventListener('mouseout', onMouseOut);

        return () => {
            cancelAnimationFrame(animFrameId);
            window.removeEventListener('mousemove', onMouseMove);
            document.removeEventListener('mouseover', onMouseOver);
            document.removeEventListener('mouseout', onMouseOut);
            document.documentElement.classList.remove('custom-cursor-active');
        };
    }, []);

    return (
        <div className="fixed pointer-events-none z-[9998] hidden md:block" aria-hidden>
            {/* Dot (Instant Follow) */}
            <div
                ref={dotRef}
                className="fixed w-2.5 h-2.5 rounded-full bg-white z-[9999] custom-cursor-dot"
                style={{ 
                    left: 0, 
                    top: 0,
                    transform: 'translate(-50%, -50%)',
                    willChange: 'transform'
                }}
            />

            {/* Ring (Interpolated Follow) */}
            <div
                ref={ringRef}
                className="fixed pointer-events-none flex items-center justify-center custom-cursor-ring"
                style={{
                    left: 0,
                    top: 0,
                    width: '36px',
                    height: '36px',
                    borderRadius: '50%',
                    border: '1.5px solid rgba(255, 255, 255, 0.4)',
                    transform: 'translate(-50%, -50%)',
                    willChange: 'transform',
                    zIndex: 9998
                }}
            >
                {/* Center Label */}
                <div
                    ref={labelRef}
                    className="text-[9px] font-bold text-white uppercase tracking-wider whitespace-nowrap"
                    style={{ opacity: 0 }}
                />
            </div>
        </div>
    );
};

export default CustomCursor;

