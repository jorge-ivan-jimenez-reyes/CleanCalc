import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Product, LaundryStats, FlowStep } from './types';
import { calculateExpenseSummary } from './utils/calculator';
import { saveProducts, loadProducts } from './utils/storage';
import { validateStep, getNextStep, getPreviousStep } from './utils/flowManager';

// Componentes del nuevo flujo
import WelcomeScreen from './components/WelcomeScreen';
import StepProgressBar from './components/StepProgressBar';
import LaundryStatsForm from './components/LaundryStatsForm';
import ProductSelectionStep from './components/ProductSelectionStep';
import ProductForm from './components/ProductForm';
import ResultsReveal from './components/ResultsReveal';
import AnimatedComparison from './components/AnimatedComparison';

// Iconos
import { ArrowLeft, ArrowRight, Check } from 'lucide-react';

function App() {
  // Estado del flujo
  const [currentStep, setCurrentStep] = useState<FlowStep>('welcome');
  const [completedSteps, setCompletedSteps] = useState<FlowStep[]>([]);
  const [canProceed, setCanProceed] = useState(true);

  // Estado de datos
  const [products, setProducts] = useState<Product[]>([]);
  const [laundryStats, setLaundryStats] = useState<LaundryStats>({
    loadsPerWeek: 3,
    timePerLoad: 80,
    waterPerLoad: 95
  });

  // Validaciones para cada paso
  const [stepValidations, setStepValidations] = useState<Record<string, boolean>>({
    'welcome': true,
    'laundry-habits': false,
    'product-selection': false,
    'product-config': false,
    'results-reveal': true,
    'comparison': true
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

  // Validar paso actual cuando cambien los datos
  useEffect(() => {
    const validation = validateStep(currentStep, products, laundryStats);
    setStepValidations(prev => ({
      ...prev,
      [currentStep]: validation.isValid
    }));
    setCanProceed(validation.isValid);
  }, [currentStep, products, laundryStats]);

  const handleNextStep = () => {
    if (!canProceed) return;

    // Marcar paso actual como completado
    if (!completedSteps.includes(currentStep)) {
      setCompletedSteps(prev => [...prev, currentStep]);
    }

    const nextStep = getNextStep(currentStep);
    if (nextStep) {
      setCurrentStep(nextStep);
    }
  };

  const handlePreviousStep = () => {
    const previousStep = getPreviousStep(currentStep);
    if (previousStep) {
      setCurrentStep(previousStep);
    }
  };

  const handleRestartFlow = () => {
    setCurrentStep('welcome');
    setCompletedSteps([]);
    setProducts([]);
    setLaundryStats({
      loadsPerWeek: 3,
      timePerLoad: 80,
      waterPerLoad: 95
    });
  };

  const handleAddProduct = (product: Product) => {
    setProducts(prevProducts => [...prevProducts, product]);
  };

  const handleRemoveProduct = (id: string) => {
    setProducts(prevProducts => prevProducts.filter(product => product.id !== id));
  };

  const handleProductsChange = (newProducts: Product[]) => {
    setProducts(newProducts);
  };

  const handleValidationChange = (isValid: boolean) => {
    setStepValidations(prev => ({
      ...prev,
      [currentStep]: isValid
    }));
    setCanProceed(isValid);
  };

  // Calcular resumen de gastos
  const expenseSummary = calculateExpenseSummary(products, laundryStats);

  // Renderizar contenido según el paso actual
  const renderStepContent = () => {
    switch (currentStep) {
      case 'welcome':
        return <WelcomeScreen onContinue={handleNextStep} />;

      case 'laundry-habits':
        return (
          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-xl shadow-lg p-8">
              <div className="text-center mb-8">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">
                  Cuéntanos sobre tus Hábitos de Lavado
                </h2>
                <p className="text-gray-600">
                  Esta información nos ayudará a calcular tus gastos actuales
                </p>
              </div>
              <LaundryStatsForm onStatsUpdate={setLaundryStats} />
            </div>
          </div>
        );

      case 'product-selection':
        return (
          <div className="max-w-6xl mx-auto">
            <ProductSelectionStep
              selectedProducts={products}
              onProductsChange={handleProductsChange}
              onValidationChange={handleValidationChange}
            />
          </div>
        );

      case 'product-config':
        return (
          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-xl shadow-lg p-8">
              <div className="text-center mb-8">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">
                  Configura tus Productos
                </h2>
                <p className="text-gray-600">
                  Ajusta los precios y duración de cada producto seleccionado
                </p>
              </div>
              
              <div className="space-y-6">
                {products.map((product) => (
                  <motion.div
                    key={product.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="border border-gray-200 rounded-lg p-6"
                  >
                    <h3 className="font-semibold text-gray-800 mb-4">{product.name}</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Precio
                        </label>
                        <input
                          type="number"
                          value={product.price}
                          onChange={(e) => {
                            const updatedProducts = products.map(p =>
                              p.id === product.id
                                ? { ...p, price: parseFloat(e.target.value) || 0 }
                                : p
                            );
                            setProducts(updatedProducts);
                          }}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                          placeholder="0.00"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Duración
                        </label>
                        <select
                          value={product.duration || '1month'}
                          onChange={(e) => {
                            const updatedProducts = products.map(p =>
                              p.id === product.id
                                ? { ...p, duration: e.target.value }
                                : p
                            );
                            setProducts(updatedProducts);
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
                      <div className="flex items-end">
                        <button
                          onClick={() => handleRemoveProduct(product.id)}
                          className="w-full bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors"
                        >
                          Eliminar
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>

              {products.length === 0 && (
                <div className="text-center py-8">
                  <p className="text-gray-500">No hay productos seleccionados</p>
                </div>
              )}
            </div>
          </div>
        );

      case 'results-reveal':
        return (
          <ResultsReveal
            expenseSummary={expenseSummary}
            onContinue={handleNextStep}
          />
        );

      case 'comparison':
        return (
          <AnimatedComparison
            expenseSummary={expenseSummary}
            selectedProducts={products}
            laundryStats={laundryStats}
            onRestart={handleRestartFlow}
          />
        );

      default:
        return null;
    }
  };

  // Si estamos en welcome o results-reveal, mostrar pantalla completa
  if (currentStep === 'welcome' || currentStep === 'results-reveal' || currentStep === 'comparison') {
    return (
      <AnimatePresence mode="wait">
        <motion.div
          key={currentStep}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          {renderStepContent()}
        </motion.div>
      </AnimatePresence>
    );
  }

  // Para otros pasos, mostrar con navegación
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Barra de progreso */}
        <StepProgressBar 
          currentStep={currentStep} 
          completedSteps={completedSteps} 
        />

        {/* Contenido del paso */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            {renderStepContent()}
          </motion.div>
        </AnimatePresence>

        {/* Navegación */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="flex justify-between items-center mt-8 max-w-4xl mx-auto"
        >
          <button
            onClick={handlePreviousStep}
            disabled={getPreviousStep(currentStep) === null}
            className={`flex items-center space-x-2 px-6 py-3 rounded-xl font-medium transition-all ${
              getPreviousStep(currentStep) === null
                ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200 shadow-sm'
            }`}
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Anterior</span>
          </button>

          <div className="flex items-center space-x-2 text-sm text-gray-600">
            {!canProceed && (
              <span className="text-amber-600 font-medium">
                Completa este paso para continuar
              </span>
            )}
          </div>

          <button
            onClick={handleNextStep}
            disabled={!canProceed}
            className={`flex items-center space-x-2 px-6 py-3 rounded-xl font-medium transition-all ${
              canProceed
                ? 'bg-gradient-to-r from-teal-500 to-blue-500 text-white shadow-lg hover:shadow-xl'
                : 'bg-gray-200 text-gray-400 cursor-not-allowed'
            }`}
          >
            <span>
              {currentStep === 'product-config' ? 'Ver Resultados' : 'Siguiente'}
            </span>
            {canProceed ? (
              <ArrowRight className="w-5 h-5" />
            ) : (
              <div className="w-5 h-5 border-2 border-gray-400 border-t-transparent rounded-full animate-spin" />
            )}
          </button>
        </motion.div>
      </div>
    </div>
  );
}

export default App;