import React from 'react';
import { Toaster } from 'react-hot-toast';

export function Toast() {
  return (
    <Toaster
      position="top-right"
      toastOptions={{
        duration: 4000,
        style: {
          background: '#1f2937',
          color: '#f3f4f6',
          border: '1px solid #374151',
          borderRadius: '0.75rem',
          fontSize: '14px',
        },
        success: {
          iconTheme: {
            primary: '#10b981',
            secondary: '#1f2937',
          },
        },
        error: {
          iconTheme: {
            primary: '#ef4444',
            secondary: '#1f2937',
          },
          style: {
            background: '#1f2937',
            color: '#f3f4f6',
            border: '1px solid #dc2626',
          },
        },
      }}
    />
  );
}