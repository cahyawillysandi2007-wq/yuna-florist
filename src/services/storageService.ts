import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage } from '../lib/firebase';

export const storageService = {
  async uploadProductImage(file: File) {
    const filename = `${Date.now()}_${file.name.replace(/\s+/g, '_')}`;
    const storageRef = ref(storage, `products/${filename}`);
    
    await uploadBytes(storageRef, file);
    return await getDownloadURL(storageRef);
  },
  
  async uploadLogo(file: File) {
    const filename = `logo_${Date.now()}`;
    const storageRef = ref(storage, `brand/${filename}`);
    
    await uploadBytes(storageRef, file);
    return await getDownloadURL(storageRef);
  }
};
