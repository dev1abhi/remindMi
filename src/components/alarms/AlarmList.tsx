import React from 'react';
import { AlarmCard } from './AlarmCard';
import type { Alarm } from '../../types';

interface AlarmListProps {
  alarms: Alarm[];
  onDelete: (id: string) => void;
}

export function AlarmList({ alarms, onDelete }: AlarmListProps) {
  if (alarms.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-400 text-lg">No alarms yet</p>
        <p className="text-gray-500 text-sm mt-2">Create your first alarm to get started</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {alarms.map((alarm) => (
        <AlarmCard key={alarm._id} alarm={alarm} onDelete={onDelete} />
      ))}
    </div>
  );
}