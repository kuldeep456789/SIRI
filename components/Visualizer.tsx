import React from 'react';

interface VisualizerProps {
  isActive: boolean;
  isSpeaking: boolean;
}

export const Visualizer: React.FC<VisualizerProps> = ({ isActive, isSpeaking }) => {
  return (
    <div className="relative flex items-center justify-center h-48 w-48 mx-auto my-8">
      {/* Outer Rings */}
      <div className={`absolute inset-0 rounded-full border-2 border-orange-500/30 transition-all duration-1000 ${isActive ? 'scale-110 opacity-100' : 'scale-90 opacity-50'}`}></div>
      <div className={`absolute inset-0 rounded-full border border-green-500/20 transition-all duration-[2000ms] ${isActive ? 'scale-125 opacity-100 rotate-90' : 'scale-95 opacity-30'}`}></div>
      
      {/* Core Pulsing Element */}
      <div className={`relative z-10 flex items-center justify-center w-24 h-24 rounded-full shadow-[0_0_30px_rgba(249,115,22,0.4)] transition-all duration-300 
        ${isActive ? 'bg-gradient-to-br from-orange-500 to-green-500 scale-110' : 'bg-slate-700 scale-100'}
      `}>
        {isActive && (
          <div className="absolute inset-0 rounded-full animate-ping bg-orange-400 opacity-20"></div>
        )}
        
        {/* Inner Icon or State */}
        <div className="text-white font-bold text-2xl">
           {isActive ? (isSpeaking ? '🔊' : '👂') : 'AI'}
        </div>
      </div>

      {/* Waveforms (Simulated) */}
      {isActive && (
        <div className="absolute w-full flex justify-center items-center gap-1 h-32 pointer-events-none">
          {[1, 2, 3, 4, 5].map((i) => (
            <div
              key={i}
              className={`w-1 bg-green-400 rounded-full animate-pulse`}
              style={{
                height: isSpeaking ? `${Math.random() * 60 + 20}%` : '20%',
                animationDuration: `${Math.random() * 0.5 + 0.5}s`
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
};
