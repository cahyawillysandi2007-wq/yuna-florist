import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatPrice(price: number) {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(price);
}

export function generateWhatsAppLink(phone: string, message: string) {
  const cleanPhone = phone.replace(/\D/g, '');
  // If starts with 0, replace with 62
  const formattedPhone = cleanPhone.startsWith('0') ? '62' + cleanPhone.slice(1) : cleanPhone;
  return `https://wa.me/${formattedPhone}?text=${encodeURIComponent(message)}`;
}
export function generateOrderCode(orderId?: string) {
  if (!orderId) return 'YF-ORDER';

  return `YF-${orderId.slice(-6).toUpperCase()}`;
}