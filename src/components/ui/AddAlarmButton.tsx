import React from 'react';
import { Plus } from 'lucide-react';

interface AddAlarmButtonProps {
  onClick: () => void;
}

export function AddAlarmButton({ onClick }: AddAlarmButtonProps) {
  return (
    <button
      onClick={onClick}
      className="w-full bg-gray-800/50 backdrop-blur-sm border-2 border-dashed border-purple-500/30 rounded-xl p-4 flex items-center justify-center gap-2 text-purple-400 hover:bg-gray-800/70 transition-all duration-300 mb-8 group"
    >
      <Plus size={20} className="group-hover:rotate-90 transition-transform duration-300" />
      <span className="group-hover:translate-x-1 transition-transform duration-300">Add New Alarm</span>
    </button>
  );
}