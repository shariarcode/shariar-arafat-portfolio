import React, { useState } from 'react';
import { useCursorTracker } from '../lib/CursorTracker';

const CursorAnalysisOverlay: React.FC = () => {
  const data = useCursorTracker();
  const [isVisible, setIsVisible] = useState(false);

  if (!isVisible) {
    return (
      <button 
        onClick={() => setIsVisible(true)}
        className="fixed bottom-4 right-4 z-[10000] bg-primary text-white p-2 rounded-full shadow-lg text-xs opacity-50 hover:opacity-100 transition-opacity"
      >
        📊 Analysis
      </button>
    );
  }

  const avgVelocity = data.movements.length > 0 
    ? (data.movements.reduce((acc, m) => acc + m.velocity, 0) / data.movements.length).toFixed(2)
    : 0;

  const topHovers = [...data.hovers]
    .sort((a, b) => b.duration - a.duration)
    .slice(0, 5);

  return (
    <div className="fixed inset-0 z-[10000] pointer-events-none">
      {/* Click Heatmap Dots */}
      {data.clicks.map((click, i) => (
        <div 
          key={i}
          className="absolute w-4 h-4 bg-red-500 rounded-full opacity-60 animate-ping"
          style={{ left: click.x - 8, top: click.y - 8 }}
        />
      ))}

      {/* Stats Panel */}
      <div className="absolute top-4 right-4 w-80 bg-black/80 backdrop-blur-md text-white p-6 rounded-xl border border-white/10 pointer-events-auto shadow-2xl">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-bold">Cursor Behavior Analysis</h3>
          <button onClick={() => setIsVisible(false)} className="text-white/50 hover:text-white">✕</button>
        </div>

        <div className="space-y-4 text-sm">
          <div className="grid grid-cols-2 gap-2">
            <div className="bg-white/5 p-3 rounded-lg">
              <p className="text-white/50 text-xs">Avg Velocity</p>
              <p className="text-xl font-mono">{avgVelocity}px/ms</p>
            </div>
            <div className="bg-white/5 p-3 rounded-lg">
              <p className="text-white/50 text-xs">Exit Intents</p>
              <p className="text-xl font-mono text-red-400">{data.exitIntentCount}</p>
            </div>
          </div>

          <div className="bg-white/5 p-3 rounded-lg">
            <p className="text-white/50 text-xs mb-2">Top Element Dwell Time</p>
            {topHovers.length > 0 ? (
              <ul className="space-y-1">
                {topHovers.map((h, i) => (
                  <li key={i} className="flex justify-between font-mono text-xs">
                    <span className="truncate mr-2">{h.selector}</span>
                    <span className="text-primary">{(h.duration / 1000).toFixed(1)}s</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-white/30 italic">No interaction data yet...</p>
            )}
          </div>

          <div className="bg-white/5 p-3 rounded-lg">
            <div className="flex justify-between text-xs text-white/50 mb-1">
              <span>Scroll Depth</span>
              <span>{data.scrollDepth}%</span>
            </div>
            <div className="w-full bg-white/10 h-1.5 rounded-full overflow-hidden">
              <div 
                className="bg-primary h-full transition-all duration-500" 
                style={{ width: `${data.scrollDepth}%` }}
              />
            </div>
          </div>

          <div className="text-[10px] text-white/30 pt-2 border-t border-white/5">
            Methodology: Real-time event tracking via DOM hooks.
            Metrics calculated from {data.movements.length} movement samples.
          </div>
        </div>
      </div>
    </div>
  );
};

export default CursorAnalysisOverlay;
