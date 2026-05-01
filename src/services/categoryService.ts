import {
  collection,
  getDocs,
  doc,
  addDoc,
  updateDoc,
  deleteDoc
} from 'firebase/firestore';
import { db } from '../lib/firebase';
import { Category } from '../types';

const CATEGORIES_COLLECTION = 'categories';

export const categoryService = {
  async getCategories() {
    const snapshot = await getDocs(collection(db, CATEGORIES_COLLECTION));

    const categories = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as Category));

    return categories.sort((a, b) => {
      const orderA = Number(a.order || 0);
      const orderB = Number(b.order || 0);
      return orderA - orderB;
    });
  },

  async getActiveCategories() {
    const categories = await this.getCategories();
    return categories.filter(c => c.isActive !== false);
  },

  async createCategory(category: Omit<Category, 'id'>) {
    const docRef = await addDoc(collection(db, CATEGORIES_COLLECTION), {
      name: category.name,
      slug: category.slug,
      order: Number(category.order || 0),
      isActive: category.isActive !== false
    });

    return docRef.id;
  },

  async updateCategory(id: string, category: Partial<Category>) {
    const ref = doc(db, CATEGORIES_COLLECTION, id);

    await updateDoc(ref, {
      ...category,
      order: Number(category.order || 0),
      isActive: category.isActive !== false
    });
  },

  async deleteCategory(id: string) {
    const ref = doc(db, CATEGORIES_COLLECTION, id);
    await deleteDoc(ref);
  }
};