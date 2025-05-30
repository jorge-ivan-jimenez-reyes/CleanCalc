import React, { useState, useEffect } from 'react';
import Layout from './components/Layout';
import ProductForm from './components/ProductForm';
import ProductList from './components/ProductList';
import ExpenseSummary from './components/ExpenseSummary';
import LaundryStatsForm from './components/LaundryStatsForm';
import Tips from './components/Tips';
import { Product, LaundryStats } from './types';
import { calculateExpenseSummary } from './utils/calculator';
import { saveProducts, loadProducts } from './utils/storage';

function App() {
  const [products, setProducts] = useState<Product[]>([]);
  const [laundryStats, setLaundryStats] = useState<LaundryStats>({
    loadsPerWeek: 3,
    timePerLoad: 80, // 80 minutos por defecto (requisito)
    waterPerLoad: 60 // 60 litros por defecto (requisito)
  });
  
  // Cargar productos guardados al iniciar
  useEffect(() => {
    const savedProducts = loadProducts();
    setProducts(savedProducts);
  }, []);
  
  // Guardar productos cuando cambien
  useEffect(() => {
    saveProducts(products);
  }, [products]);
  
  const handleAddProduct = (product: Product) => {
    setProducts(prevProducts => [...prevProducts, product]);
  };
  
  const handleRemoveProduct = (id: string) => {
    setProducts(prevProducts => prevProducts.filter(product => product.id !== id));
  };
  
  // Calcular resumen de gastos basado en productos actuales y hábitos de lavado
  const expenseSummary = calculateExpenseSummary(products, laundryStats);

  return (
    <Layout>
      <div className="mb-4 text-center bg-gradient-to-r from-teal-500 to-blue-500 p-3 rounded-md text-white shadow-sm">
        <h1 className="text-xl font-bold mb-1">Calculadora de Gastos</h1>
        <p className="text-xs max-w-2xl mx-auto">
          Compara tus gastos en productos de limpieza tradicionales vs. GECO
        </p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
        <div className="lg:col-span-2 space-y-3">
          <LaundryStatsForm onStatsUpdate={setLaundryStats} />
          <ProductForm onAddProduct={handleAddProduct} />
          <ProductList products={products} onRemoveProduct={handleRemoveProduct} />
        </div>
        
        <div className="space-y-3">
          <ExpenseSummary summary={expenseSummary} />
          <Tips />
        </div>
      </div>
    </Layout>
  );
}

export default App;