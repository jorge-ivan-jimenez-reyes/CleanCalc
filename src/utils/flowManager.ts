import { FlowStep, FlowState, StepValidation, Product, LaundryStats } from '../types';

export const FLOW_STEPS: FlowStep[] = [
  'welcome',
  'product-selection',
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

    case 'product-selection':
      const hasMinProducts = products.length >= 1;
      const allProductsConfigured = products.every(p =>
        p.duration && p.name.trim() !== ''
      );
      const hasValidLoads = laundryStats.loadsPerWeek > 0;
      return {
        isValid: hasMinProducts && allProductsConfigured && hasValidLoads,
        message: !hasValidLoads ? 'Debes ingresar al menos 1 carga por semana' :
                 !hasMinProducts ? 'Selecciona al menos 1 producto para continuar' :
                 !allProductsConfigured ? 'Completa la duración de todos los productos' : undefined
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
    case 'product-selection':
      return 'Selecciona tus Productos';
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
    case 'product-selection':
      return 'Selecciona los productos que usas actualmente';
    case 'results-reveal':
      return 'Veamos cuánto gastas actualmente...';
    case 'comparison':
      return 'Descubre cuánto podrías ahorrar con GECO';
    default:
      return '';
  }
}; 