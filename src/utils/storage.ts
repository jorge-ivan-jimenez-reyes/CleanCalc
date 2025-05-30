import { Product } from '../types';

const STORAGE_KEY = 'cleanCalc_products';

export const saveProducts = (products: Product[]): void => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(products));
  } catch (error) {
    console.error('Error saving products to localStorage', error);
  }
};

export const loadProducts = (): Product[] => {
  try {
    const storedProducts = localStorage.getItem(STORAGE_KEY);
    return storedProducts ? JSON.parse(storedProducts) : [];
  } catch (error) {
    console.error('Error loading products from localStorage', error);
    return [];
  }
};