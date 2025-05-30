export interface Product {
  id: string;
  name: string;
  price: number;
  quantity: number; // Cuántos usos por envase
  usageFrequency: number; // Times per month
  category: 'detergent' | 'softener' | 'disinfectant' | 'enhancer';
  brand?: string;
  type?: string;
  size?: number;
  unit?: string;
  duration?: string; // Cuánto dura el producto (selección múltiple)
}

export interface ExpenseSummary {
  // Gastos tradicionales
  totalExpense: number;
  detergentExpense: number;
  softenerExpense: number;
  disinfectantExpense: number;
  enhancerExpense: number;
  yearlyExpense: number;
  yearlyWaterUsage: number; // in liters
  yearlyTimeSpent: number; // in hours
  
  // Gastos con GECO
  gecoYearlyExpense: number;
  gecoYearlyWaterUsage: number;
  gecoYearlyTimeSpent: number;
  
  // Ahorros
  savedMoney: number;
  savedWater: number;
  savedTime: number;
}

export interface LaundryStats {
  loadsPerWeek: number;
  timePerLoad: number; // in minutes
  waterPerLoad: number; // in liters
}

export interface ProductDuration {
  value: string;
  label: string;
}

export const productDurations: ProductDuration[] = [
  { value: "1week", label: "1 semana" },
  { value: "2weeks", label: "2 semanas" },
  { value: "1month", label: "1 mes" },
  { value: "2months", label: "2 meses" },
  { value: "3months", label: "3 meses" },
  { value: "6months", label: "6 meses" },
  { value: "1year", label: "1 año" }
];

export const getDurationInWeeks = (duration: string): number => {
  switch (duration) {
    case "1week": return 1;
    case "2weeks": return 2;
    case "1month": return 4.33;
    case "2months": return 8.66;
    case "3months": return 13;
    case "6months": return 26;
    case "1year": return 52;
    default: return 4.33; // default to 1 month
  }
};