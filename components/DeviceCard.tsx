import React from 'react';
import { LucideIcon } from 'lucide-react';

interface DeviceCardProps {
  title: string;
  value: string | number;
  isActive: boolean;
  icon: LucideIcon;
  colorClass: string; // e.g., 'text-green-500' or 'text-orange-500'
  onClick: () => void;
}

export const DeviceCard: React.FC<DeviceCardProps> = ({ 
  title, 
  value, 
  isActive, 
  icon: Icon, 
  colorClass,
  onClick 
}) => {
  return (
    <div 
      onClick={onClick}
      className={`glass-panel p-4 rounded-2xl cursor-pointer transition-all duration-300 hover:-translate-y-1 hover:shadow-lg
        ${isActive ? 'border-opacity-50 border-white' : 'border-opacity-10 border-white'}
      `}
    >
      <div className="flex justify-between items-start mb-4">
        <div className={`p-3 rounded-full ${isActive ? 'bg-opacity-20 bg-white' : 'bg-slate-800'}`}>
          <Icon className={`w-6 h-6 ${isActive ? colorClass : 'text-slate-400'}`} />
        </div>
        <div className={`w-2 h-2 rounded-full ${isActive ? 'bg-green-500 shadow-[0_0_8px_#22c55e]' : 'bg-slate-600'}`}></div>
      </div>
      
      <div className="space-y-1">
        <h3 className="text-slate-400 text-sm font-medium uppercase tracking-wider">{title}</h3>
        <p className={`text-xl font-bold ${isActive ? 'text-white' : 'text-slate-500'}`}>
          {value}
        </p>
      </div>
    </div>
  );
};
