import React, { useState, useRef } from 'react';
import type { Alarm } from '../../types';

interface AlarmFormProps {
  onSubmit: (alarm: Alarm) => void;
  onCancel: () => void;
}

export function AlarmForm({ onSubmit, onCancel }: AlarmFormProps) {
  const [formData, setFormData] = useState<Partial<Alarm>>({
    notifications: {
      email: false,
      whatsapp: false,
      sms: false,
      call: false
    },
    contactInfo: {
      email: '',
      phone: ''
    }
  });

  const inputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      title: formData.title || '',
      datetime: formData.datetime || '',
      notifications: formData.notifications!,
      contactInfo: formData.contactInfo!
    });
  };

  const handleWrapperClick = () => {
    if (inputRef.current) {
      inputRef.current.showPicker?.();
      inputRef.current.focus();
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-gray-800/50 backdrop-blur-sm rounded-xl shadow-lg p-6 mb-8 border border-purple-500/20">
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">Event Title</label>
          <input
            type="text"
            required
            className="w-full px-4 py-2 bg-gray-900/50 border border-gray-700 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-white placeholder-gray-500"
            value={formData.title || ''}
            onChange={e => setFormData({ ...formData, title: e.target.value })}
            placeholder="Enter event title"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">Date & Time</label>
          <div
            className="relative cursor-pointer"
            onClick={handleWrapperClick}
          >
            <input
              ref={inputRef}
              type="datetime-local"
              required
              className="w-full px-4 py-2 pr-10 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
              value={formData.datetime || ''}
              onChange={e => setFormData({ ...formData, datetime: e.target.value })}
            />
            <span className="absolute inset-y-0 right-3 flex items-center text-gray-400">
              🕒
            </span>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Notification Methods</label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {Object.entries(formData.notifications!).map(([key, value]) => (
              <label key={key} className="flex items-center gap-2 bg-gray-900/30 p-3 rounded-lg cursor-pointer hover:bg-gray-900/50 transition-colors">
                <input
                  type="checkbox"
                  checked={value}
                  onChange={e => setFormData({
                    ...formData,
                    notifications: {
                      ...formData.notifications!,
                      [key]: e.target.checked
                    }
                  })}
                  className="rounded text-purple-500 focus:ring-purple-500 bg-gray-700 border-gray-600"
                />
                <span className="capitalize text-gray-300">{key}</span>
              </label>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">Email</label>
          <input
            type="email"
            className="w-full px-4 py-2 bg-gray-900/50 border border-gray-700 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-white placeholder-gray-500"
            value={formData.contactInfo?.email || ''}
            onChange={e => setFormData({
              ...formData,
              contactInfo: { ...formData.contactInfo!, email: e.target.value }
            })}
            placeholder="your@email.com"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">Phone Number</label>
          <input
            type="tel"
            className="w-full px-4 py-2 bg-gray-900/50 border border-gray-700 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-white placeholder-gray-500"
            value={formData.contactInfo?.phone || ''}
            onChange={e => setFormData({
              ...formData,
              contactInfo: { ...formData.contactInfo!, phone: e.target.value }
            })}
            placeholder="+1234567890"
          />
        </div>
      </div>

      <div className="mt-6 flex gap-3">
        <button
          type="submit"
          className="flex-1 bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-gray-900 transition-colors duration-200"
        >
          Create Alarm
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="flex-1 bg-gray-700 text-gray-300 px-4 py-2 rounded-lg hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 focus:ring-offset-gray-900 transition-colors duration-200"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}