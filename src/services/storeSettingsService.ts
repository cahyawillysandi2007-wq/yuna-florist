import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { StoreSettings } from '../types';

const defaultSettings: StoreSettings = {
  storeName: 'Yuna Florist Adiluwih',
  whatsappNumber: '085768300253',
  instagram: 'yunafloristadiluwih',
  facebook: 'Yuna Florist Adiluwih',
  address: 'Adiluwih, Pringsewu, Lampung',
  openingHours: '08:00 - 20:00',
  description: 'Buket cantik untuk momen spesial Anda.',
  logoUrl: ''
};

export const storeSettingsService = {
  async getSettings(): Promise<StoreSettings> {
    const ref = doc(db, 'store_settings', 'default');
    const snapshot = await getDoc(ref);

    if (!snapshot.exists()) {
      await setDoc(ref, defaultSettings);
      return defaultSettings;
    }

    return {
      ...defaultSettings,
      ...(snapshot.data() as StoreSettings)
    };
  },

  async updateSettings(settings: StoreSettings) {
    await setDoc(doc(db, 'store_settings', 'default'), settings);
  }
};