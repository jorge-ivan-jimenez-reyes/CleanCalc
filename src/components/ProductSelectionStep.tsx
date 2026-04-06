import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Product, LaundryStats } from '../types';
import { Check, X, AlertCircle, ChevronDown } from 'lucide-react';

// Products with suggested prices
const productOptions = {
  detergent: [
    { id: 'white', label: 'Ropa blanca', detail: 'Blanqueador o detergente especial', price: 85 },
    { id: 'black', label: 'Ropa negra', detail: 'Detergente para oscuros', price: 95 },
    { id: 'color', label: 'Ropa de color', detail: 'Detergente para colores', price: 90 },
    { id: 'all', label: 'Mismo para todo', detail: 'Detergente universal', price: 75 }
  ],
  softener: [
    { id: 'suavitel', label: 'Suavitel', detail: '~$45/mes', price: 45 },
    { id: 'downy', label: 'Downy', detail: '~$55/mes', price: 55 },
    { id: 'ensueño', label: 'Ensueño', detail: '~$35/mes', price: 35 },
    { id: 'foca', label: 'Foca', detail: '~$30/mes', price: 30 },
    { id: 'other', label: 'Otra marca', detail: 'Ingresa el precio', price: 40 }
  ],
  disinfectant: [
    { id: 'pinol', label: 'Pinol', detail: 'Multiusos', price: 35 },
    { id: 'cloralex', label: 'Cloralex', detail: 'Cloro / blanqueador', price: 25 },
    { id: 'lysol', label: 'Lysol', detail: 'Antibacterial', price: 65 },
    { id: 'other', label: 'Otra marca', detail: 'Ingresa el precio', price: 40 }
  ],
  enhancer: [
    { id: 'downy', label: 'Downy Unstopables', detail: 'Perlas de aroma', price: 85 },
    { id: 'suavitel', label: 'Suavitel Aromas', detail: 'Potenciador de frescura', price: 65 },
    { id: 'gain', label: 'Gain Fireworks', detail: 'Perlas de aroma', price: 90 },
    { id: 'other', label: 'Otra marca', detail: 'Ingresa el precio', price: 70 }
  ]
};

interface ProductSelectionStepProps {
  selectedProducts: Product[];
  onProductsChange: (products: Product[]) => void;
  onValidationChange: (isValid: boolean) => void;
  laundryStats?: LaundryStats;
  onStatsUpdate?: (stats: LaundryStats) => void;
}

const ProductSelectionStep: React.FC<ProductSelectionStepProps> = ({
  selectedProducts, onProductsChange, onValidationChange, laundryStats, onStatsUpdate
}) => {
  const [activeCategory, setActiveCategory] = useState<string>('detergent');
  const [stats, setStats] = useState<LaundryStats>(laundryStats || { loadsPerWeek: 3, timePerLoad: 80, waterPerLoad: 95 });

  const isValid = selectedProducts.length >= 1 && selectedProducts.every(p => p.duration);

  useEffect(() => { onValidationChange(isValid); }, [isValid]);

  const handleStatsChange = (value: number) => {
    const newStats = { ...stats, loadsPerWeek: value };
    setStats(newStats);
    onStatsUpdate?.(newStats);
  };

  const categories = [
    { id: 'detergent', label: 'Detergente' },
    { id: 'softener', label: 'Suavizante' },
    { id: 'disinfectant', label: 'Desinfectante' },
    { id: 'enhancer', label: 'Potenciador' },
  ];

  const handleSelect = (categoryId: string, label: string, suggestedPrice: number) => {
    if (selectedProducts.some(p => p.category === categoryId && p.name === label)) return;
    onProductsChange([...selectedProducts, {
      id: Date.now().toString() + Math.random(), name: label, price: suggestedPrice, quantity: 1,
      usageFrequency: 1, category: categoryId as any, duration: '1month', brand: label
    }]);
  };

  const handleRemove = (id: string) => onProductsChange(selectedProducts.filter(p => p.id !== id));

  const updateProduct = (id: string, field: string, value: any) => {
    onProductsChange(selectedProducts.map(p => p.id === id ? { ...p, [field]: value } : p));
  };


  return (
    <motion.div
      className="max-w-2xl mx-auto"
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Laundry stats inline — no separate step */}
      <div className="flex items-center gap-4 mb-8 pb-6 border-b border-gray-100">
        <div className="flex-1">
          <label className="block text-sm font-medium text-gray-700 mb-1">Cargas por semana</label>
          <input
            type="number"
            value={stats.loadsPerWeek}
            onChange={(e) => handleStatsChange(parseInt(e.target.value) || 1)}
            min="1"
            className="w-20 px-3 py-2 border border-gray-200 rounded-lg text-lg font-bold text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400"
          />
        </div>
        <div className="text-sm text-gray-400">
          <span className="font-medium text-gray-600">80 min</span> por carga · <span className="font-medium text-gray-600">95 L</span> de agua
        </div>
      </div>

      <p className="text-sm text-gray-400 mb-5">
        Selecciona todo lo que usas al lavar. GECO reemplaza todos estos productos.
      </p>

      {/* Selected products with price */}
      <AnimatePresence>
        {selectedProducts.length > 0 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mb-6"
          >
            <div className="flex items-center gap-2 mb-3">
              <div className="w-5 h-5 rounded-full bg-blue-500 flex items-center justify-center">
                <span className="text-white text-xs font-bold">{selectedProducts.length}</span>
              </div>
              <span className="text-sm font-medium text-gray-700">productos seleccionados</span>
            </div>

            <div className="space-y-2">
              {selectedProducts.map((product) => (
                <motion.div
                  key={product.id}
                  layout
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 10 }}
                  className="bg-blue-50/50 border border-blue-100 rounded-lg p-3"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-800">{product.name}</span>
                    <div className="flex items-center gap-2">
                    <select
                      value={product.duration || '1month'}
                      onChange={(e) => updateProduct(product.id, 'duration', e.target.value)}
                      className="text-xs text-gray-500 bg-white border border-blue-200 rounded px-2 py-1 focus:outline-none focus:border-blue-400"
                    >
                      <option value="1week">1 semana</option>
                      <option value="2weeks">2 semanas</option>
                      <option value="1month">1 mes</option>
                      <option value="2months">2 meses</option>
                      <option value="3months">3 meses</option>
                      <option value="6months">6 meses</option>
                      <option value="1year">1 año</option>
                    </select>
                    <button onClick={() => handleRemove(product.id)} className="text-gray-300 hover:text-red-400 transition-colors">
                      <X className="w-4 h-4" />
                    </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Category tabs */}
      <div className="flex gap-1 mb-5 border-b border-gray-100">
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setActiveCategory(cat.id)}
            className={`px-4 py-2.5 text-sm font-medium transition-all relative ${
              activeCategory === cat.id ? 'text-blue-500' : 'text-gray-400 hover:text-gray-600'
            }`}
          >
            {cat.label}
            {activeCategory === cat.id && (
              <motion.div
                layoutId="activeTab"
                className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-500"
                transition={{ type: 'spring', stiffness: 400, damping: 30 }}
              />
            )}
          </button>
        ))}
      </div>

      {/* Options */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeCategory}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.25 }}
          className="space-y-1"
        >
          {productOptions[activeCategory as keyof typeof productOptions]?.map((option) => {
            const isSelected = selectedProducts.some(p => p.category === activeCategory && p.name === option.label);
            return (
              <button
                key={option.id}
                onClick={() => !isSelected && handleSelect(activeCategory, option.label, option.price)}
                className={`w-full text-left px-4 py-3.5 rounded-lg text-sm transition-all flex items-center justify-between group ${
                  isSelected ? 'bg-blue-50 text-blue-600' : 'hover:bg-gray-50 text-gray-700'
                }`}
              >
                <div>
                  <span className={isSelected ? 'font-medium' : ''}>{option.label}</span>
                  <span className="block text-xs text-gray-400 mt-0.5">{option.detail}</span>
                </div>
                <div className="flex items-center gap-3">
                  {isSelected ? (
                    <Check className="w-4 h-4 text-blue-500" />
                  ) : (
                    <span className="text-xs text-gray-300 opacity-0 group-hover:opacity-100 transition-opacity">+</span>
                  )}
                </div>
              </button>
            );
          })}
        </motion.div>
      </AnimatePresence>

      {!isValid && selectedProducts.length === 0 && (
        <motion.div className="flex items-center gap-2 mt-6 text-sm text-gray-400" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
          <AlertCircle className="w-4 h-4" />
          <span>Selecciona al menos 1 producto</span>
        </motion.div>
      )}
    </motion.div>
  );
};

export default ProductSelectionStep;
