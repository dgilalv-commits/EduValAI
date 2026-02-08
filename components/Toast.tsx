
import React from 'react';

interface Props {
  message: string;
  type?: 'success' | 'error';
}

const Toast: React.FC<Props> = ({ message, type = 'success' }) => {
  return (
    <div className={`fixed top-8 right-8 z-50 animate-bounce p-4 rounded-xl shadow-2xl flex items-center gap-3 border ${type === 'success' ? 'bg-green-600 border-green-400' : 'bg-red-600 border-red-400'}`}>
      <span className="text-2xl">{type === 'success' ? '✅' : '❌'}</span>
      <span className="font-bold text-white">{message}</span>
    </div>
  );
};

export default Toast;
