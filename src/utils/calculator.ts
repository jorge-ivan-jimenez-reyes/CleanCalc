import { Product, ExpenseSummary, LaundryStats, getDurationInWeeks } from '../types';

const WEEKS_PER_YEAR = 52;
const MONTHS_PER_YEAR = 12;

// Constantes para GECO
const GECO_PRICE_PER_LOAD = 20;  // Costo por carga con GECO (2 pastillas x $10 c/u)
const GECO_TIME_SAVED_PER_LOAD = 30; // Minutos ahorrados por carga
const GECO_WATER_REDUCTION_FACTOR = 0.5; // Factor de reducción de agua (50%)

export const calculateExpenseSummary = (products: Product[], laundryStats?: LaundryStats): ExpenseSummary => {
  const initialSummary: ExpenseSummary = {
    totalExpense: 0,
    detergentExpense: 0,
    softenerExpense: 0,
    disinfectantExpense: 0,
    enhancerExpense: 0,
    yearlyExpense: 0,
    yearlyWaterUsage: 0,
    yearlyTimeSpent: 0,
    
    // Gastos con GECO
    gecoYearlyExpense: 0,
    gecoYearlyWaterUsage: 0,
    gecoYearlyTimeSpent: 0,
    
    // Ahorros
    savedMoney: 0,
    savedWater: 0,
    savedTime: 0
  };

  const summary = products.reduce((summary, product) => {
    // Calculate yearly expense for this product based on duration
    let yearlyExpenseForProduct = 0;
    
    if (product.duration) {
      // Calculate how many times the product needs to be replaced per year
      const durationInWeeks = getDurationInWeeks(product.duration);
      const replacementsPerYear = WEEKS_PER_YEAR / durationInWeeks;
      yearlyExpenseForProduct = product.price * replacementsPerYear;
    } else {
      // Calculate using the old method if duration not specified
      const monthlyExpense = (product.price / product.quantity) * product.usageFrequency;
      yearlyExpenseForProduct = monthlyExpense * MONTHS_PER_YEAR;
    }
    
    // Divide by 12 to get monthly expense
    const monthlyExpense = yearlyExpenseForProduct / MONTHS_PER_YEAR;
    
    // Add to the appropriate category
    switch (product.category) {
      case 'detergent':
        summary.detergentExpense += monthlyExpense;
        break;
      case 'softener':
        summary.softenerExpense += monthlyExpense;
        break;
      case 'disinfectant':
        summary.disinfectantExpense += monthlyExpense;
        break;
      case 'enhancer':
        summary.enhancerExpense += monthlyExpense;
        break;
    }
    
    // Update total monthly expense
    summary.totalExpense += monthlyExpense;
    
    return summary;
  }, initialSummary);

  // Calculate yearly expenses from monthly
  summary.yearlyExpense = summary.totalExpense * MONTHS_PER_YEAR;

  // Calculate yearly water usage and time spent if laundry stats are provided
  if (laundryStats) {
    const yearlyLoads = laundryStats.loadsPerWeek * WEEKS_PER_YEAR;
    
    // Cálculos para productos tradicionales
    summary.yearlyWaterUsage = yearlyLoads * laundryStats.waterPerLoad;
    summary.yearlyTimeSpent = (yearlyLoads * laundryStats.timePerLoad) / 60; // Convert to hours
    
    // Cálculos para GECO
    // cuanto gastas en productos al año ($20 x cargas de lavado a la semana x 52 semanas)
    summary.gecoYearlyExpense = GECO_PRICE_PER_LOAD * laundryStats.loadsPerWeek * WEEKS_PER_YEAR;
    
    // cuanto tiempo utilizas en lavar al año (80 min - 30 min x cargas de lavado a la semana x 52 semanas)
    const reducedTimePerLoad = Math.max(laundryStats.timePerLoad - GECO_TIME_SAVED_PER_LOAD, 0);
    summary.gecoYearlyTimeSpent = (yearlyLoads * reducedTimePerLoad) / 60; // Convert to hours
    
    // cuánta agua utilizas en lavar al año (60 litros /2)
    summary.gecoYearlyWaterUsage = summary.yearlyWaterUsage * GECO_WATER_REDUCTION_FACTOR;
    
    // Calcular ahorros
    summary.savedMoney = summary.yearlyExpense - summary.gecoYearlyExpense;
    summary.savedWater = summary.yearlyWaterUsage - summary.gecoYearlyWaterUsage;
    summary.savedTime = summary.yearlyTimeSpent - summary.gecoYearlyTimeSpent;
  }

  return summary;
};

export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(amount);
};

export const formatNumber = (value: number, unit: string): string => {
  return `${value.toLocaleString('en-US', { maximumFractionDigits: 1 })} ${unit}`;
};