import {
  collection,
  getDocs,
  doc,
  getDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  serverTimestamp
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
  }
};