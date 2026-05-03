export interface Product {
  id?: string;
  name: string;
  price: number;
  description: string;
  categoryId: string;
  categoryName: string;
  imageUrl: string;
  isAvailable: boolean;
  labels?: string[];
  stock?: number;
  eventTags: string[]; // Wisuda, Ulang Tahun, etc.
  budgetRange: string;
  dominantColor: string;
  createdAt: any;
  updatedAt: any;
}

export interface Category {
  id?: string;
  name: string;
  slug: string;
  order: number;
  isActive: boolean;
}

export interface Order {
  id?: string;
  orderCode?: string;
  customerName: string;
  customerWhatsapp: string;
  productId: string;
  productName: string;
  productPrice: number;
  note: string;
  pickupDate: string;
  status: 'New' | 'Processing' | 'Completed' | 'Cancelled' | 'CancelRequested' | 'CancelRejected';
  createdAt: any;
}

export interface StoreSettings {
  storeName: string;
  whatsappNumber: string;
  instagram: string;
  facebook: string;
  tiktok?: string;
  address: string;
  openingHours: string;
  description: string;
  logoUrl: string;
}
