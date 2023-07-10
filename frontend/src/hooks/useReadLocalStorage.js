import { useState, useEffect, useCallback } from 'react';

export function useReadLocalStorage(key) {
  const readValue = useCallback(() => {
    if (typeof window === 'undefined') {
      return null;
    }

    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : null;
    } catch (error) {
      console.warn(`Error reading localStorage key "${key}":`, error);
      return null;
    }
  }, [key]);

  const [storedValue, setStoredValue] = useState(readValue);

  useEffect(() => {
    setStoredValue(readValue());
  }, [readValue]);

  const handleStorageChange = useCallback((event) => {
    if (event.key && event.key !== key) {
      return;
    }
    setStoredValue(readValue());
  }, [key, readValue]);

  useEffect(() => {
    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('local-storage', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('local-storage', handleStorageChange);
    };
  }, [handleStorageChange]);

  return storedValue;
}
