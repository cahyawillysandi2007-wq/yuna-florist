import {
  collection,
  query,
  orderBy,
  getDocs,
  doc,
  addDoc,
  updateDoc,
  deleteDoc,
  serverTimestamp,
  where
} from 'firebase/firestore';
import { db } from '../lib/firebase';
import { Order } from '../types';
import { generateOrderCode } from '../lib/utils';

const ORDERS_COLLECTION = 'orders';

export const orderService = {
  async getOrders() {
    const q = query(
      collection(db, ORDERS_COLLECTION),
      orderBy('createdAt', 'desc')
    );

    const snapshot = await getDocs(q);

    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as Order));
  },

  async getOrdersByStatus(status: string) {
    const q = query(
      collection(db, ORDERS_COLLECTION),
      where('status', '==', status),
      orderBy('createdAt', 'desc')
    );

    const snapshot = await getDocs(q);

    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as Order));
  },

  async getOrdersByCustomerWhatsapp(whatsapp: string) {
    const q = query(
      collection(db, ORDERS_COLLECTION),
      where('customerWhatsapp', '==', whatsapp)
    );

    const snapshot = await getDocs(q);

    const orders = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as Order));

    return orders.sort((a, b) => {
      const timeA = a.createdAt?.seconds || 0;
      const timeB = b.createdAt?.seconds || 0;
      return timeB - timeA;
    });
  },

  async getOrdersByOrderCode(code: string) {
    const normalizedCode = code.trim().toUpperCase();

    const snapshot = await getDocs(collection(db, ORDERS_COLLECTION));

    const orders = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as Order));

    return orders
      .filter(order => {
        const storedCode = order.orderCode?.toUpperCase();
        const generatedCode = generateOrderCode(order.id).toUpperCase();

        return storedCode === normalizedCode || generatedCode === normalizedCode;
      })
      .sort((a, b) => {
        const timeA = a.createdAt?.seconds || 0;
        const timeB = b.createdAt?.seconds || 0;
        return timeB - timeA;
      });
  },

  async createOrder(order: Omit<Order, 'id' | 'createdAt' | 'orderCode'>) {
    const data = {
      ...order,
      createdAt: serverTimestamp()
    };

    const docRef = await addDoc(collection(db, ORDERS_COLLECTION), data);

    const orderCode = generateOrderCode(docRef.id);

    await updateDoc(docRef, {
      orderCode
    });

    return docRef.id;
  },

  async updateOrderStatus(id: string, status: Order['status']) {
    const ref = doc(db, ORDERS_COLLECTION, id);

    await updateDoc(ref, {
      status
    });
  },

  async requestCancelOrder(id: string) {
    const ref = doc(db, ORDERS_COLLECTION, id);

    await updateDoc(ref, {
      status: 'CancelRequested'
    });
  },

  async approveCancelOrder(id: string) {
    const ref = doc(db, ORDERS_COLLECTION, id);

    await updateDoc(ref, {
      status: 'Cancelled'
    });
  },

  async rejectCancelOrder(id: string) {
    const ref = doc(db, ORDERS_COLLECTION, id);

    await updateDoc(ref, {
      status: 'CancelRejected'
    });
  },

  async deleteOrder(id: string) {
    const ref = doc(db, ORDERS_COLLECTION, id);
    await deleteDoc(ref);
  }
};