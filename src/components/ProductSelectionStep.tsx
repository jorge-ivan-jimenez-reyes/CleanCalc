import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Product } from '../types';
import { commonProducts, ProductDatabase } from '../data/products';
import { loadAllExternalProducts } from '../utils/csvLoader';
import { Package, Plus, Check, Trash2, AlertCircle, ChevronDown, ChevronUp } from 'lucide-react';

interface ProductSelectionStepProps {
  selectedProducts: Product[];
  onProductsChange: (products: Product[]) => void;
  onValidationChange: (isValid: boolean) => void;
}

const ProductSelectionStep: React.FC<ProductSelectionStepProps> = ({ 
  selectedProducts, 
  onProductsChange, 
  onValidationChange 
}) => {
  const [availableProducts, setAvailableProducts] = useState<ProductDatabase[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(new Set());
  
  const MINIMUM_PRODUCTS = 2;
  const isValid = selectedProducts.length >= MINIMUM_PRODUCTS;

  useEffect(() => {
    onValidationChange(isValid);
  }, [isValid, onValidationChange]);

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const products = await loadAllExternalProducts();
        setAvailableProducts(products.length > 0 ? products : commonProducts);
      } catch (error) {
        setAvailableProducts(commonProducts);
      } finally {
        setLoading(false);
      }
    };
    loadProducts();
  }, []);

  const getRealisticDuration = (productData: ProductDatabase): string => {
    const { category, size, unit } = productData;
    
    // Calcular duración basada en tamaño y categoría
    if (category === 'detergent') {
      // Detergentes: ~50ml por carga, 3 cargas/semana
      const mlPerWeek = 50 * 3; // 150ml por semana
      const totalMl = unit === 'L' ? size * 1000 : size;
      const weeks = totalMl / mlPerWeek;
      
      if (weeks <= 2) return '2weeks';
      if (weeks <= 6) return '1month';
      if (weeks <= 10) return '2months';
      if (weeks <= 18) return '3months';
      if (weeks <= 30) return '6months';
      return '1year';
    }
    
    if (category === 'softener') {
      // Suavizantes: ~30ml por carga
      const mlPerWeek = 30 * 3; // 90ml por semana
      const totalMl = unit === 'L' ? size * 1000 : size;
      const weeks = totalMl / mlPerWeek;
      
      if (weeks <= 3) return '2weeks';
      if (weeks <= 8) return '1month';
      if (weeks <= 12) return '2months';
      if (weeks <= 20) return '3months';
      if (weeks <= 35) return '6months';
      return '1year';
    }
    
    if (category === 'disinfectant') {
      // Desinfectantes: ~20ml por carga
      const mlPerWeek = 20 * 3; // 60ml por semana
      const totalMl = unit === 'L' ? size * 1000 : size;
      const weeks = totalMl / mlPerWeek;
      
      if (weeks <= 4) return '1month';
      if (weeks <= 10) return '2months';
      if (weeks <= 18) return '3months';
      if (weeks <= 30) return '6months';
      return '1year';
    }
    
    if (category === 'enhancer') {
      // Potenciadores: cantidad variable según tipo
      if (unit === 'kg') {
        // Perlas: ~10g por carga
        const gPerWeek = 10 * 3; // 30g por semana
        const totalG = size * 1000;
        const weeks = totalG / gPerWeek;
        
        if (weeks <= 6) return '1month';
        if (weeks <= 12) return '2months';
        if (weeks <= 20) return '3months';
        return '6months';
      } else if (unit === 'piezas') {
        // Cápsulas: 1 por carga
        const weeks = size / 3; // 3 cargas por semana
        
        if (weeks <= 2) return '2weeks';
        if (weeks <= 6) return '1month';
        if (weeks <= 10) return '2months';
        return '3months';
      }
    }
    
    return '1month'; // fallback
  };

  const handleProductSelect = (productData: ProductDatabase) => {
    // Verificar si ya está seleccionado
    const isAlreadySelected = selectedProducts.some(p => 
      p.name === `${productData.brand} ${productData.name} - ${productData.type} ${productData.size}${productData.unit}`
    );

    if (isAlreadySelected) return;

    const newProduct: Product = {
      id: Date.now().toString() + Math.random(),
      name: `${productData.brand} ${productData.name} - ${productData.type} ${productData.size}${productData.unit}`,
      price: productData.price,
      quantity: 1,
      usageFrequency: 1,
      category: productData.category,
      duration: getRealisticDuration(productData),
      brand: productData.brand,
      type: productData.type,
      size: productData.size,
      unit: productData.unit,
    };

    onProductsChange([...selectedProducts, newProduct]);
  };

  const handleProductRemove = (productId: string) => {
    onProductsChange(selectedProducts.filter(p => p.id !== productId));
  };

  const toggleGroupExpansion = (groupKey: string) => {
    const newExpanded = new Set(expandedGroups);
    if (newExpanded.has(groupKey)) {
      newExpanded.delete(groupKey);
    } else {
      newExpanded.add(groupKey);
    }
    setExpandedGroups(newExpanded);
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'detergent': return '🧽';
      case 'softener': return '🌸';
      case 'disinfectant': return '🦠';
      case 'enhancer': return '✨';
      default: return '📦';
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'detergent': return 'from-blue-500 to-blue-600';
      case 'softener': return 'from-purple-500 to-purple-600';
      case 'disinfectant': return 'from-green-500 to-green-600';
      case 'enhancer': return 'from-amber-500 to-amber-600';
      default: return 'from-gray-500 to-gray-600';
    }
  };

  // Filtrar productos por categoría
  const filteredProducts = availableProducts.filter(product => 
    selectedCategory === 'all' || product.category === selectedCategory
  );

  // Agrupar productos por marca y nombre
  const groupedProducts = filteredProducts.reduce((acc, product) => {
    const key = `${product.brand}-${product.name}`;
    if (!acc[key]) {
      acc[key] = [];
    }
    acc[key].push(product);
    return acc;
  }, {} as Record<string, ProductDatabase[]>);

  return (
    <div className="space-y-6">
      {/* Header con progreso */}
      <motion.div 
        className="text-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h2 className="text-2xl font-bold text-gray-800 mb-2">
          Selecciona tus Productos Actuales
        </h2>
        <p className="text-gray-600 mb-4">
          Elige al menos {MINIMUM_PRODUCTS} productos que uses regularmente
        </p>
        
        {/* Contador de progreso */}
        <motion.div 
          className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-medium ${
            isValid 
              ? 'bg-green-100 text-green-800' 
              : 'bg-amber-100 text-amber-800'
          }`}
          animate={{ scale: isValid ? [1, 1.05, 1] : 1 }}
          transition={{ duration: 0.3 }}
        >
          {isValid ? (
            <>
              <Check className="w-4 h-4 mr-2" />
              ¡Perfecto! {selectedProducts.length} productos seleccionados
            </>
          ) : (
            <>
              <AlertCircle className="w-4 h-4 mr-2" />
              {selectedProducts.length} de {MINIMUM_PRODUCTS} productos mínimos
            </>
          )}
        </motion.div>
      </motion.div>

      {/* Productos seleccionados */}
      <AnimatePresence>
        {selectedProducts.length > 0 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="bg-green-50 rounded-xl p-4 border border-green-200"
          >
            <h3 className="font-semibold text-green-800 mb-3 flex items-center">
              <Check className="w-5 h-5 mr-2" />
              Productos Seleccionados
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {selectedProducts.map((product, index) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  className="bg-white rounded-lg p-3 border border-green-200 flex items-center justify-between"
                >
                  <div className="flex items-center">
                    <span className="text-lg mr-3">
                      {getCategoryIcon(product.category)}
                    </span>
                    <div>
                      <p className="font-medium text-gray-800 text-sm">{product.brand}</p>
                      <p className="text-xs text-gray-600">{product.type} - {product.size}{product.unit}</p>
                      <p className="text-xs font-semibold text-green-600">${product.price}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => handleProductRemove(product.id)}
                    className="text-red-500 hover:text-red-700 p-1"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Filtros de categoría */}
      <motion.div 
        className="flex flex-wrap gap-2 justify-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        {[
          { id: 'all', label: 'Todos', icon: '📦' },
          { id: 'detergent', label: 'Detergentes', icon: '🧽' },
          { id: 'softener', label: 'Suavizantes', icon: '🌸' },
          { id: 'disinfectant', label: 'Desinfectantes', icon: '🦠' },
          { id: 'enhancer', label: 'Potenciadores', icon: '✨' }
        ].map((category) => (
          <button
            key={category.id}
            onClick={() => setSelectedCategory(category.id)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
              selectedCategory === category.id
                ? 'bg-teal-500 text-white shadow-md'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <span className="mr-2">{category.icon}</span>
            {category.label}
          </button>
        ))}
      </motion.div>

      {/* Lista de productos disponibles */}
      <motion.div 
        className="bg-white rounded-xl border border-gray-200 p-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        <h3 className="font-semibold text-gray-800 mb-4 flex items-center">
          <Package className="w-5 h-5 mr-2" />
          Productos Disponibles
        </h3>

        {loading ? (
          <div className="text-center py-8">
            <div className="animate-spin w-8 h-8 border-4 border-teal-500 border-t-transparent rounded-full mx-auto mb-4"></div>
            <p className="text-gray-600">Cargando productos...</p>
          </div>
        ) : (
          <div className="space-y-4 max-h-96 overflow-y-auto">
            {Object.entries(groupedProducts).map(([key, products]) => {
              const mainProduct = products[0];
              const hasVariants = products.length > 1;
              const isExpanded = expandedGroups.has(key);
              
              return (
                <motion.div
                  key={key}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3 }}
                  className="border border-gray-200 rounded-lg overflow-hidden"
                >
                  {/* Producto principal */}
                  <div className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center flex-1">
                        <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${getCategoryColor(mainProduct.category)} flex items-center justify-center text-white text-lg mr-4`}>
                          {getCategoryIcon(mainProduct.category)}
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-800">{mainProduct.brand}</h4>
                          <p className="text-gray-600 text-sm">{mainProduct.name}</p>
                        </div>
                      </div>
                      
                      {hasVariants && (
                        <button
                          onClick={() => toggleGroupExpansion(key)}
                          className="flex items-center text-teal-600 hover:text-teal-700 text-sm font-medium"
                        >
                          <span className="mr-1">{products.length} variantes</span>
                          {isExpanded ? (
                            <ChevronUp className="w-4 h-4" />
                          ) : (
                            <ChevronDown className="w-4 h-4" />
                          )}
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Variantes expandidas */}
                  <AnimatePresence>
                    {(isExpanded || !hasVariants) && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="border-t border-gray-100 bg-gray-50"
                      >
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 p-4">
                          {products.map((variant, index) => {
                            const isSelected = selectedProducts.some(p => 
                              p.name === `${variant.brand} ${variant.name} - ${variant.type} ${variant.size}${variant.unit}`
                            );

                            return (
                              <motion.div
                                key={index}
                                className={`border rounded-lg p-3 cursor-pointer transition-all ${
                                  isSelected 
                                    ? 'border-green-500 bg-green-50' 
                                    : 'border-gray-200 hover:border-teal-300 hover:shadow-sm bg-white'
                                }`}
                                onClick={() => !isSelected && handleProductSelect(variant)}
                                whileHover={{ scale: isSelected ? 1 : 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.2, delay: index * 0.05 }}
                              >
                                <div className="flex items-center justify-between mb-2">
                                  <div>
                                    <p className="font-medium text-gray-800 text-sm">{variant.type}</p>
                                    <p className="text-gray-600 text-xs">{variant.size}{variant.unit}</p>
                                  </div>
                                  {isSelected && (
                                    <div className="bg-green-500 text-white rounded-full p-1">
                                      <Check className="w-3 h-3" />
                                    </div>
                                  )}
                                </div>
                                <p className="text-teal-600 font-bold">${variant.price}</p>
                              </motion.div>
                            );
                          })}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })}
          </div>
        )}
      </motion.div>

      {/* Mensaje de ayuda */}
      {!isValid && (
        <motion.div 
          className="bg-amber-50 border border-amber-200 rounded-lg p-4"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
        >
          <div className="flex items-start">
            <AlertCircle className="w-5 h-5 text-amber-600 mr-3 mt-0.5" />
            <div>
              <p className="text-amber-800 font-medium text-sm">
                Necesitas seleccionar al menos {MINIMUM_PRODUCTS} productos
              </p>
              <p className="text-amber-700 text-xs mt-1">
                Esto nos ayudará a calcular tus gastos actuales de manera más precisa
              </p>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default ProductSelectionStep; 