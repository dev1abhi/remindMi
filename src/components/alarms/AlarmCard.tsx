import React from 'react';
import { Mail, Phone, MessageSquare, Calendar, Clock, Trash2 } from 'lucide-react';
import { format } from 'date-fns';
import type { Alarm } from '../../types';

interface AlarmCardProps {
  alarm: Alarm;
  onDelete: (id: string) => void;
}

export function AlarmCard({ alarm, onDelete }: AlarmCardProps) {
  const notificationIcons = {
    email: <Mail size={16} />,
    whatsapp: <MessageSquare size={16} />,
    sms: <MessageSquare size={16} />,
    call: <Phone size={16} />
  };

  //console.log(alarm.datetime);
  //console.log(format(new Date(alarm.datetime), "MMM d, yyyy h:mm a"));

 

  return (
    <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl shadow-lg p-6 border border-purple-500/20 hover:border-purple-500/40 transition-colors duration-300">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-lg font-semibold text-white mb-1">{alarm.title}</h3>
          <div className="flex items-center gap-2 text-gray-400 text-sm">
            <Calendar size={14} />
            <span>{format(new Date(alarm.datetime), "MMM d, yyyy")}</span>
            <Clock size={14} className="ml-2" />
            <span>{format(new Date(alarm.datetime), "h:mm a")}</span>
          </div>
        </div>
        <button
          onClick={() => alarm._id && onDelete(alarm._id)}
          className="text-gray-500 hover:text-red-400 transition-colors p-2 hover:bg-gray-700/50 rounded-lg"
        >
          <Trash2 size={20} />
        </button>
      </div>

      <div className="mt-4">
        <div className="flex flex-wrap gap-2">
          {Object.entries(alarm.notifications).map(([method, enabled]) => 
            enabled && (
              <span key={method} className="inline-flex items-center gap-1 text-sm text-purple-300 bg-purple-900/30 px-3 py-1.5 rounded-lg border border-purple-500/20">
                {notificationIcons[method as keyof typeof notificationIcons]}
                <span className="capitalize">{method}</span>
              </span>
            )
          )}
        </div>
      </div>

      <div className="mt-4 space-y-1 text-sm">
        <p className="text-gray-400 flex items-center gap-2">
          <Mail size={14} className="text-gray-500" />
          {alarm.contactInfo.email}
        </p>
        <p className="text-gray-400 flex items-center gap-2">
          <Phone size={14} className="text-gray-500" />
          {alarm.contactInfo.phone}
        </p>
      </div>
    </div>
  );
}