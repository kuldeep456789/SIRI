import React, { useEffect, useRef } from 'react';
import { ChatMessage } from '../types';

interface StatusLogProps {
  messages: ChatMessage[];
}

export const StatusLog: React.FC<StatusLogProps> = ({ messages }) => {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  if (messages.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-slate-500 text-center p-8">
        <p>System Ready.</p>
        <p className="text-sm mt-2">"Hey Omni, turn on the lights"</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col space-y-4 p-4 h-full overflow-y-auto max-h-[400px]">
      {messages.map((msg, idx) => (
        <div 
          key={msg.timestamp + idx}
          className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
        >
          <div className={`max-w-[80%] px-4 py-3 rounded-2xl text-sm leading-relaxed
            ${msg.role === 'user' 
              ? 'bg-orange-600 text-white rounded-tr-sm' 
              : 'bg-slate-700 text-slate-200 rounded-tl-sm border-l-4 border-green-500'}
          `}>
            {msg.text}
          </div>
        </div>
      ))}
      <div ref={bottomRef} />
    </div>
  );
};
