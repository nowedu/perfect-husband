import { useState, useEffect } from 'react';
import CryptoJS from 'crypto-js';

const ENCRYPTION_KEY = 'perfect-husband-secret-key-2024';

export function useLocalStorage<T>(key: string, initialValue: T) {
  const [storedValue, setStoredValue] = useState<T>(() => {
    if (typeof window === 'undefined') {
      return initialValue;
    }
    try {
      const item = window.localStorage.getItem(key);
      if (item) {
        const decrypted = CryptoJS.AES.decrypt(item, ENCRYPTION_KEY).toString(CryptoJS.enc.Utf8);
        return decrypted ? JSON.parse(decrypted) : initialValue;
      }
      return initialValue;
    } catch (error) {
      console.error(`Error reading localStorage key "${key}":`, error);
      return initialValue;
    }
  });

  const setValue = (value: T | ((val: T) => T)) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      if (typeof window !== 'undefined') {
        const encrypted = CryptoJS.AES.encrypt(JSON.stringify(valueToStore), ENCRYPTION_KEY).toString();
        window.localStorage.setItem(key, encrypted);
      }
    } catch (error) {
      console.error(`Error setting localStorage key "${key}":`, error);
    }
  };

  return [storedValue, setValue] as const;
}
