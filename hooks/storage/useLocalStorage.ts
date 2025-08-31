import { useState, useEffect } from 'react';
import CryptoJS from 'crypto-js';

const SECRET_KEY = 'perfect-husband-secret-2024';

export function useLocalStorage<T>(key: string, defaultValue: T) {
  const [value, setValue] = useState<T>(() => {
    if (typeof window === 'undefined') {
      return defaultValue;
    }

    try {
      const item = window.localStorage.getItem(key);
      if (!item) {
        return defaultValue;
      }

      // Decrypt the data
      const bytes = CryptoJS.AES.decrypt(item, SECRET_KEY);
      const decryptedData = bytes.toString(CryptoJS.enc.Utf8);
      
      if (!decryptedData) {
        return defaultValue;
      }

      const parsedData = JSON.parse(decryptedData);
      
      // Migration: Add partnerNotes if it doesn't exist
      if (parsedData && typeof parsedData === 'object' && !parsedData.partnerNotes) {
        parsedData.partnerNotes = [];
      }
      
      return parsedData;
    } catch (error) {
      console.error('Error reading from localStorage:', error);
      return defaultValue;
    }
  });

  const setStoredValue = (newValue: T | ((val: T) => T)) => {
    try {
      const valueToStore = newValue instanceof Function ? newValue(value) : newValue;
      setValue(valueToStore);

      if (typeof window !== 'undefined') {
        // Encrypt the data before storing
        const encrypted = CryptoJS.AES.encrypt(JSON.stringify(valueToStore), SECRET_KEY).toString();
        window.localStorage.setItem(key, encrypted);
      }
    } catch (error) {
      console.error('Error saving to localStorage:', error);
    }
  };

  return [value, setStoredValue] as const;
}
