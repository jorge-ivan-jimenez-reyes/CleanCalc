import { FlowStep, FlowState, StepValidation, Product, LaundryStats } from '../types';

export const FLOW_STEPS: FlowStep[] = [
  'welcome',
  'laundry-habits', 
  'product-selection',
  'product-config',
  'results-reveal',
  'comparison'
];

export const getStepIndex = (step: FlowStep): number => {
  return FLOW_STEPS.indexOf(step);
};

export const getNextStep = (currentStep: FlowStep): FlowStep | null => {
  const currentIndex = getStepIndex(currentStep);
  if (currentIndex < FLOW_STEPS.length - 1) {
    return FLOW_STEPS[currentIndex + 1];
  }
  return null;
};

export const getPreviousStep = (currentStep: FlowStep): FlowStep | null => {
  const currentIndex = getStepIndex(currentStep);
  if (currentIndex > 0) {
    return FLOW_STEPS[currentIndex - 1];
  }
  return null;
};

export const validateStep = (
  step: FlowStep, 
  products: Product[], 
  laundryStats: LaundryStats
): StepValidation => {
  switch (step) {
    case 'welcome':
      return { isValid: true };
      
    case 'laundry-habits':
      const isValidHabits = laundryStats.loadsPerWeek > 0;
      return {
        isValid: isValidHabits,
        message: isValidHabits ? undefined : 'Debes ingresar al menos 1 carga por semana'
      };
      
    case 'product-selection':
      const hasMinProducts = products.length >= 2;
      return {
        isValid: hasMinProducts,
        message: hasMinProducts ? undefined : 'Selecciona al menos 2 productos para continuar'
      };
      
    case 'product-config':
      const allProductsConfigured = products.every(p => 
        p.price > 0 && p.duration && p.name.trim() !== ''
      );
      return {
        isValid: allProductsConfigured,
        message: allProductsConfigured ? undefined : 'Completa la información de todos los productos'
      };
      
    case 'results-reveal':
    case 'comparison':
      return { isValid: true };
      
    default:
      return { isValid: false, message: 'Paso no válido' };
  }
};

export const getStepTitle = (step: FlowStep): string => {
  switch (step) {
    case 'welcome':
      return '¡Bienvenido!';
    case 'laundry-habits':
      return 'Tus Hábitos de Lavado';
    case 'product-selection':
      return 'Selecciona tus Productos';
    case 'product-config':
      return 'Configura tus Productos';
    case 'results-reveal':
      return 'Tus Gastos Actuales';
    case 'comparison':
      return 'Comparación con GECO';
    default:
      return '';
  }
};

export const getStepDescription = (step: FlowStep): string => {
  switch (step) {
    case 'welcome':
      return '¿Sabías que puedes ahorrar hasta 60% en gastos de lavandería?';
    case 'laundry-habits':
      return 'Cuéntanos sobre tus hábitos de lavado para calcular tus gastos';
    case 'product-selection':
      return 'Selecciona los productos que usas actualmente (mínimo 2)';
    case 'product-config':
      return 'Completa la información de cada producto';
    case 'results-reveal':
      return 'Veamos cuánto gastas actualmente...';
    case 'comparison':
      return 'Descubre cuánto podrías ahorrar con GECO';
    default:
      return '';
  }
}; 