import { useEffect, useRef, useState } from 'react';

export interface CursorEvent {
  x: number;
  y: number;
  timestamp: number;
  velocity: number;
}

export interface HoverEvent {
  selector: string;
  enterTime: number;
  duration: number;
}

export interface ClickEvent {
  x: number;
  y: number;
  timestamp: number;
  target: string;
}

export interface TrackingData {
  movements: CursorEvent[];
  hovers: HoverEvent[];
  clicks: ClickEvent[];
  scrollDepth: number;
  exitIntentCount: number;
  startTime: number;
  totalDwellTime: number;
}

const MAX_MOVEMENTS = 500; // Limit to avoid memory issues

export const useCursorTracker = () => {
  const [data, setData] = useState<TrackingData>({
    movements: [],
    hovers: [],
    clicks: [],
    scrollDepth: 0,
    exitIntentCount: 0,
    startTime: Date.now(),
    totalDwellTime: 0,
  });

  const lastPos = useRef({ x: 0, y: 0, time: Date.now() });
  const hoverStart = useRef<{ [key: string]: number }>({});
  const activeHovers = useRef<Set<string>>(new Set());

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const now = Date.now();
      const dt = now - lastPos.current.time;
      const dx = e.clientX - lastPos.current.x;
      const dy = e.clientY - lastPos.current.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      const velocity = dt > 0 ? dist / dt : 0;

      setData(prev => {
        const newMovements = [...prev.movements, { x: e.clientX, y: e.clientY, timestamp: now, velocity }];
        if (newMovements.length > MAX_MOVEMENTS) newMovements.shift();
        
        return {
          ...prev,
          movements: newMovements,
          totalDwellTime: now - prev.startTime
        };
      });

      lastPos.current = { x: e.clientX, y: e.clientY, time: now };

      // Exit Intent Detection
      if (e.clientY < 20 && velocity > 0.5) {
        setData(prev => ({ ...prev, exitIntentCount: prev.exitIntentCount + 1 }));
      }
    };

    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const selector = target.id ? `#${target.id}` : target.className ? `.${target.className.split(' ')[0]}` : target.tagName.toLowerCase();
      
      setData(prev => ({
        ...prev,
        clicks: [...prev.clicks, { x: e.clientX, y: e.clientY, timestamp: Date.now(), target: selector }]
      }));
    };

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const interactive = target.closest('a, button, [role="button"], input, textarea, select, label');
      if (interactive) {
        const selector = interactive.getAttribute('aria-label') || interactive.textContent?.slice(0, 20) || interactive.tagName;
        if (!activeHovers.current.has(selector)) {
          activeHovers.current.add(selector);
          hoverStart.current[selector] = Date.now();
        }
      }
    };

    const handleMouseOut = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const interactive = target.closest('a, button, [role="button"], input, textarea, select, label');
      if (interactive) {
        const selector = interactive.getAttribute('aria-label') || interactive.textContent?.slice(0, 20) || interactive.tagName;
        if (activeHovers.current.has(selector)) {
          const duration = Date.now() - hoverStart.current[selector];
          setData(prev => ({
            ...prev,
            hovers: [...prev.hovers, { selector, enterTime: hoverStart.current[selector], duration }]
          }));
          activeHovers.current.delete(selector);
        }
      }
    };

    const handleScroll = () => {
      const winHeight = window.innerHeight;
      const docHeight = document.documentElement.scrollHeight;
      const scrollTop = window.scrollY;
      const scrollPercent = (scrollTop / (docHeight - winHeight)) * 100;
      
      setData(prev => ({
        ...prev,
        scrollDepth: Math.max(prev.scrollDepth, Math.round(scrollPercent))
      }));
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('click', handleClick);
    document.addEventListener('mouseover', handleMouseOver);
    document.addEventListener('mouseout', handleMouseOut);
    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('click', handleClick);
      document.removeEventListener('mouseover', handleMouseOver);
      document.removeEventListener('mouseout', handleMouseOut);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return data;
};
