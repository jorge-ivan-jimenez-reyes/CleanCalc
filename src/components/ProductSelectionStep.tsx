import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Product } from '../types';
import { Package, Check, Trash2, AlertCircle } from 'lucide-react';

// Opciones simplificadas para cada categoría
const simpleProductOptions = {
  detergent: [
    { id: 'white', label: 'Detergente para ropa blanca', icon: '⚪' },
    { id: 'black', label: 'Detergente para ropa negra', icon: '⚫' },
    { id: 'color', label: 'Detergente para ropa de color', icon: '🌈' },
    { id: 'all', label: 'Mismo detergente para todo', icon: '🧺' }
  ],
  softener: [
    { id: 'suavitel', label: 'Suavitel', icon: '🌸' },
    { id: 'downy', label: 'Downy', icon: '🌸' },
    { id: 'ensueño', label: 'Ensueño', icon: '🌸' },
    { id: 'foca', label: 'Foca', icon: '🌸' },
    { id: 'other', label: 'Otra marca', icon: '🌸' }
  ],
  disinfectant: [
    { id: 'pinol', label: 'Pinol', icon: '🦠' },
    { id: 'cloralex', label: 'Cloralex', icon: '🦠' },
    { id: 'lysol', label: 'Lysol', icon: '🦠' },
    { id: 'other', label: 'Otra marca', icon: '🦠' }
  ],
  enhancer: [
    { id: 'downy', label: 'Downy Unstopables', icon: '✨' },
    { id: 'suavitel', label: 'Suavitel Aromas', icon: '✨' },
    { id: 'gain', label: 'Gain Fireworks', icon: '✨' },
    { id: 'other', label: 'Otra marca', icon: '✨' }
  ]
};


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
  const [selectedCategory, setSelectedCategory] = useState<string>('detergent');
  
  const MINIMUM_PRODUCTS = 1;
  const isValid = selectedProducts.length >= MINIMUM_PRODUCTS && 
                  selectedProducts.every(p => p.duration);

  useEffect(() => {
    onValidationChange(isValid);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isValid]);

  const categories = [
    { id: 'detergent', label: 'Detergente', icon: '🧽', color: 'from-blue-500 to-blue-600' },
    { id: 'softener', label: 'Suavizante', icon: '🌸', color: 'from-purple-500 to-purple-600' },
    { id: 'disinfectant', label: 'Desinfectante', icon: '🦠', color: 'from-green-500 to-green-600' },
    { id: 'enhancer', label: 'Potenciador', icon: '✨', color: 'from-amber-500 to-amber-600' }
  ];

  const handleProductSelect = (categoryId: string, optionId: string, optionLabel: string) => {
    // Verificar si ya está seleccionado
    const isAlreadySelected = selectedProducts.some(p => 
      p.category === categoryId && p.name === optionLabel
    );

    if (isAlreadySelected) return;

    const newProduct: Product = {
      id: Date.now().toString() + Math.random(),
      name: optionLabel,
      price: 0, // Se configurará en el siguiente paso
      quantity: 1,
      usageFrequency: 1,
      category: categoryId as any,
      duration: '1month', // Se configurará en el siguiente paso
      brand: optionLabel
    };

    onProductsChange([...selectedProducts, newProduct]);
  };

  const handleProductRemove = (productId: string) => {
    onProductsChange(selectedProducts.filter(p => p.id !== productId));
  };

  const getCategoryIcon = (category: string) => {
    const cat = categories.find(c => c.id === category);
    return cat?.icon || '📦';
  };

  const getCategoryColor = (category: string) => {
    const cat = categories.find(c => c.id === category);
    return cat?.color || 'from-gray-500 to-gray-600';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
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
          Elige los productos que usas actualmente
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
              Selecciona al menos {MINIMUM_PRODUCTS} producto
            </>
          )}
        </motion.div>
      </motion.div>

      {/* Productos seleccionados con configuración */}
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
              Productos Seleccionados - Configura duración
            </h3>
            <div className="space-y-3">
              {selectedProducts.map((product, index) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  className="bg-white rounded-lg p-4 border border-green-200"
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center">
                      <span className="text-lg mr-3">
                        {getCategoryIcon(product.category)}
                      </span>
                      <p className="font-medium text-gray-800">{product.name}</p>
                    </div>
                    <button
                      onClick={() => handleProductRemove(product.id)}
                      className="text-red-500 hover:text-red-700 p-1.5 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                  
                  <div className="grid grid-cols-1 gap-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Duración
                      </label>
                      <select
                        value={product.duration || '1month'}
                        onChange={(e) => {
                          const updatedProducts = selectedProducts.map(p =>
                            p.id === product.id
                              ? { ...p, duration: e.target.value }
                              : p
                          );
                          onProductsChange(updatedProducts);
                        }}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                      >
                        <option value="1week">1 semana</option>
                        <option value="2weeks">2 semanas</option>
                        <option value="1month">1 mes</option>
                        <option value="2months">2 meses</option>
                        <option value="3months">3 meses</option>
                        <option value="6months">6 meses</option>
                        <option value="1year">1 año</option>
                      </select>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Tabs de categorías */}
      <motion.div 
        className="flex gap-2 overflow-x-auto pb-2"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        {categories.map((category) => (
          <button
            key={category.id}
            onClick={() => setSelectedCategory(category.id)}
            className={`px-6 py-3 rounded-xl text-sm font-medium transition-all whitespace-nowrap ${
              selectedCategory === category.id
                ? 'bg-gradient-to-r ' + category.color + ' text-white shadow-lg'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <span className="mr-2">{category.icon}</span>
            {category.label}
          </button>
        ))}
      </motion.div>

      {/* Opciones de productos */}
      <motion.div 
        className="bg-white rounded-xl border border-gray-200 p-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        <h3 className="font-semibold text-gray-800 mb-4 flex items-center">
          <Package className="w-5 h-5 mr-2" />
          Opciones de {categories.find(c => c.id === selectedCategory)?.label}
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {simpleProductOptions[selectedCategory as keyof typeof simpleProductOptions]?.map((option) => {
            const isSelected = selectedProducts.some(p => 
              p.category === selectedCategory && p.name === option.label
            );

            return (
              <motion.div
                key={option.id}
                className={`border-2 rounded-xl p-4 cursor-pointer transition-all ${
                  isSelected 
                    ? 'border-green-500 bg-green-50' 
                    : 'border-gray-200 hover:border-teal-400 hover:shadow-md bg-white'
                }`}
                onClick={() => !isSelected && handleProductSelect(selectedCategory, option.id, option.label)}
                whileHover={{ scale: isSelected ? 1 : 1.02 }}
                whileTap={{ scale: 0.98 }}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2 }}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <span className="text-2xl mr-3">{option.icon}</span>
                    <p className="font-medium text-gray-800">{option.label}</p>
                  </div>
                  {isSelected && (
                    <div className="bg-green-500 text-white rounded-full p-1.5">
                      <Check className="w-4 h-4" />
                    </div>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
      </motion.div>

      {/* Mensaje informativo */}
      <motion.div 
        className="bg-blue-50 border border-blue-200 rounded-lg p-4"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
      >
        <div className="flex items-start">
          <AlertCircle className="w-5 h-5 text-blue-600 mr-3 mt-0.5" />
          <div>
            <p className="text-blue-800 font-medium text-sm">
              Configura la duración de cada producto
            </p>
            <p className="text-blue-700 text-xs mt-1">
              Indica cuánto tiempo te dura cada producto para mejorar la comparación
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default ProductSelectionStep;
