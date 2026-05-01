import React from 'react';
import { MessageCircle } from 'lucide-react';
import { generateWhatsAppLink } from '../lib/utils';

export default function FloatingWA() {
  const whatsappUrl = generateWhatsAppLink('085768300253', 'Halo Yuna Florist, saya ingin tanya-tanya tentang buketnya.');

  return (
    <a 
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-50 bg-green-500 text-white p-4 rounded-full shadow-lg hover:bg-green-600 transition-all hover:scale-110 active:scale-95 group"
      aria-label="Chat WhatsApp"
    >
      <MessageCircle className="w-6 h-6" />
      <span className="absolute right-full mr-3 bg-white text-slate-800 px-3 py-1 rounded-md text-sm font-medium shadow-sm opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none border border-slate-100">
        Chat Owner Yuk!
      </span>
    </a>
  );
}
