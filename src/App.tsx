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
import AnimatedBackground from './components/AnimatedBackground';
import IntegraWatermark from './components/IntegraWatermark';

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

      case 'product-selection':
        return (
          <div className="max-w-2xl mx-auto">
            <ProductSelectionStep
              selectedProducts={products}
              onProductsChange={handleProductsChange}
              onValidationChange={handleValidationChange}
              laundryStats={laundryStats}
              onStatsUpdate={setLaundryStats}
            />
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
      <>
        <AnimatedBackground />
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            style={{ position: 'relative', zIndex: 1 }}
            initial={{ opacity: 0, filter: 'blur(8px)', scale: 0.98 }}
            animate={{ opacity: 1, filter: 'blur(0px)', scale: 1 }}
            exit={{ opacity: 0, filter: 'blur(6px)', scale: 1.02 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          >
            {renderStepContent()}
          </motion.div>
        </AnimatePresence>
        <IntegraWatermark />
      </>
    );
  }

  // Para otros pasos, mostrar con navegación
  return (
    <div className="min-h-screen py-8 px-4" style={{ position: 'relative', zIndex: 1 }}>
      <AnimatedBackground />
      <div className="max-w-2xl mx-auto">
        {/* Barra de progreso */}
        <StepProgressBar 
          currentStep={currentStep} 
          completedSteps={completedSteps} 
        />

        {/* Contenido del paso */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, y: 30, filter: 'blur(6px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            exit={{ opacity: 0, y: -20, filter: 'blur(4px)' }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          >
            {renderStepContent()}
          </motion.div>
        </AnimatePresence>

        {/* Navegación */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="flex justify-between items-center mt-8 max-w-2xl mx-auto"
        >
          <motion.button
            onClick={handlePreviousStep}
            disabled={getPreviousStep(currentStep) === null}
            whileHover={{ x: -3 }}
            whileTap={{ scale: 0.97 }}
            transition={{ type: 'spring', stiffness: 400, damping: 25 }}
            className={`flex items-center space-x-2 px-6 py-3 rounded-xl font-medium transition-all ${
              getPreviousStep(currentStep) === null
                ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200 shadow-sm'
            }`}
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Anterior</span>
          </motion.button>

          <div className="flex items-center space-x-2 text-sm text-gray-600">
            {!canProceed && (
              <span className="text-amber-600 font-medium">
                Completa este paso para continuar
              </span>
            )}
          </div>

          <motion.button
            onClick={handleNextStep}
            disabled={!canProceed}
            whileHover={{ x: 3, scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
            transition={{ type: 'spring', stiffness: 400, damping: 25 }}
            className={`flex items-center space-x-2 px-6 py-3 rounded-lg font-medium transition-all ${
              canProceed
                ? 'bg-gray-900 text-white hover:bg-gray-800'
                : 'bg-gray-100 text-gray-300 cursor-not-allowed'
            }`}
          >
            <span>
              {currentStep === 'product-selection' ? 'Ver Resultados' : 'Siguiente'}
            </span>
            {canProceed ? (
              <motion.div animate={{ x: [0, 3, 0] }} transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}>
                <ArrowRight className="w-5 h-5" />
              </motion.div>
            ) : (
              <div className="w-5 h-5 border-2 border-gray-400 border-t-transparent rounded-full animate-spin" />
            )}
          </motion.button>
        </motion.div>
      </div>
      <IntegraWatermark />
    </div>
  );
}

export default App;