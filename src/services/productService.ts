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

    const products = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as Product));

    return products
      .filter(product => product.isAvailable !== false)
      .sort((a, b) => {
        const timeA = a.createdAt?.seconds || 0;
        const timeB = b.createdAt?.seconds || 0;
        return timeB - timeA;
      });
  },

  async getAllProducts() {
    const snapshot = await getDocs(collection(db, PRODUCTS_COLLECTION));

    const products = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as Product));

    return products.sort((a, b) => {
      const timeA = a.createdAt?.seconds || 0;
      const timeB = b.createdAt?.seconds || 0;
      return timeB - timeA;
    });
  },

  async getProductsByCategory(categoryId: string) {
    const products = await this.getProducts();
    return products.filter(product => product.categoryId === categoryId);
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

  async decreaseStocks(
    items: {
      productId: string;
      quantity: number;
      name?: string;
    }[]
  ) {
    await runTransaction(db, async (transaction) => {
      const productRefs = items.map((item) =>
        doc(db, PRODUCTS_COLLECTION, item.productId)
      );

      const productSnapshots = [];

      for (const ref of productRefs) {
        const snapshot = await transaction.get(ref);
        productSnapshots.push(snapshot);
      }

      for (let i = 0; i < items.length; i++) {
        const item = items[i];
        const snapshot = productSnapshots[i];

        if (!snapshot.exists()) {
          throw new Error(`Produk ${item.name || ''} tidak ditemukan.`);
        }

        const product = snapshot.data() as Product;
        const currentStock = Number(product.stock ?? 0);
        const requestedQuantity = Number(item.quantity || 0);

        if (requestedQuantity <= 0) {
          throw new Error(`Jumlah produk ${product.name} tidak valid.`);
        }

        if (currentStock < requestedQuantity) {
          throw new Error(
            `Stok ${product.name} tidak cukup. Tersisa ${currentStock}, diminta ${requestedQuantity}.`
          );
        }

        const newStock = currentStock - requestedQuantity;

        transaction.update(productRefs[i], {
          stock: newStock,
          isAvailable: newStock > 0,
          updatedAt: serverTimestamp()
        });
      }
    });
  }
};