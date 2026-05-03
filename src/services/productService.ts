import {
  collection,
  getDocs,
  doc,
  getDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  serverTimestamp,
  runTransaction
} from 'firebase/firestore';
import { db } from '../lib/firebase';
import { Product } from '../types';

const PRODUCTS_COLLECTION = 'products';

export const productService = {
  async getProducts() {
    const snapshot = await getDocs(collection(db, PRODUCTS_COLLECTION));

    const products = snapshot.docs.map((docItem) => ({
      id: docItem.id,
      ...docItem.data()
    } as Product));

    return products
      .filter((product) => product.isAvailable !== false)
      .sort((a, b) => {
        const timeA = a.createdAt?.seconds || 0;
        const timeB = b.createdAt?.seconds || 0;
        return timeB - timeA;
      });
  },

  async getAllProducts() {
    const snapshot = await getDocs(collection(db, PRODUCTS_COLLECTION));

    const products = snapshot.docs.map((docItem) => ({
      id: docItem.id,
      ...docItem.data()
    } as Product));

    return products.sort((a, b) => {
      const timeA = a.createdAt?.seconds || 0;
      const timeB = b.createdAt?.seconds || 0;
      return timeB - timeA;
    });
  },

  async getProductsByCategory(categoryId: string) {
    const products = await this.getProducts();
    return products.filter((product) => product.categoryId === categoryId);
  },

  async getLatestProducts(count = 6) {
    const products = await this.getProducts();
    return products.slice(0, count);
  },

  async getProductById(id: string) {
    const ref = doc(db, PRODUCTS_COLLECTION, id);
    const snapshot = await getDoc(ref);

    if (!snapshot.exists()) return null;

    return {
      id: snapshot.id,
      ...snapshot.data()
    } as Product;
  },

  async createProduct(product: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>) {
    const data = {
      ...product,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    };

    const docRef = await addDoc(collection(db, PRODUCTS_COLLECTION), data);
    return docRef.id;
  },

  async updateProduct(id: string, product: Partial<Product>) {
    const ref = doc(db, PRODUCTS_COLLECTION, id);

    await updateDoc(ref, {
      ...product,
      updatedAt: serverTimestamp()
    });
  },

  async deleteProduct(id: string) {
    const ref = doc(db, PRODUCTS_COLLECTION, id);
    await deleteDoc(ref);
  },

  async decreaseStock(productId: string, quantity: number) {
    const ref = doc(db, PRODUCTS_COLLECTION, productId);

    await runTransaction(db, async (transaction) => {
      const snapshot = await transaction.get(ref);

      if (!snapshot.exists()) {
        throw new Error('Produk tidak ditemukan.');
      }

      const product = snapshot.data() as Product;
      const currentStock = Number(product.stock ?? 0);
      const orderQuantity = Number(quantity || 1);

      if (orderQuantity <= 0) {
        throw new Error('Jumlah produk tidak valid.');
      }

      if (currentStock < orderQuantity) {
        throw new Error(
          `Stok ${product.name} tidak cukup. Tersisa ${currentStock}, diminta ${orderQuantity}.`
        );
      }

      const newStock = currentStock - orderQuantity;

      transaction.update(ref, {
        stock: newStock,
        isAvailable: newStock > 0,
        updatedAt: serverTimestamp()
      });

      console.log('STOK DIKURANGI:', {
        productId,
        productName: product.name,
        currentStock,
        orderQuantity,
        newStock
      });
    });
  },

  async decreaseStocks(
    items: {
      productId: string;
      quantity: number;
      name?: string;
    }[]
  ) {
    for (const item of items) {
      if (!item.productId) {
        throw new Error(`Produk ${item.name || ''} tidak punya ID.`);
      }

      await this.decreaseStock(item.productId, item.quantity);
    }
  }
};