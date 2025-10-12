// Información sobre químicos dañinos por categoría de producto

export interface ChemicalInfo {
  name: string;
  healthImpact: string;
  environmentalImpact: string;
  severity: 'high' | 'medium' | 'low';
}

export interface CategoryChemicals {
  category: string;
  count: number;
  chemicals: ChemicalInfo[];
}

// Químicos en detergentes
export const detergentChemicals: ChemicalInfo[] = [
  {
    name: 'Tensioactivos aniónicos (LAS, SLS)',
    healthImpact: 'Irritación cutánea y ocular, posible disrupción endocrina',
    environmentalImpact: 'Tóxicos para vida acuática, bioacumulación',
    severity: 'high'
  },
  {
    name: 'Fosfatos y fosfonatos',
    healthImpact: 'Irritación cutánea leve',
    environmentalImpact: 'Eutrofización de cuerpos de agua',
    severity: 'high'
  },
  {
    name: 'Blanqueadores ópticos',
    healthImpact: 'Alergias y sensibilización cutánea',
    environmentalImpact: 'Persistentes en ambiente, tóxicos para peces',
    severity: 'medium'
  },
  {
    name: 'Enzimas (proteasas, amilasas)',
    healthImpact: 'Alergias respiratorias y cutáneas',
    environmentalImpact: 'Generalmente biodegradables',
    severity: 'medium'
  },
  {
    name: 'Fragancias sintéticas',
    healthImpact: 'Alergias, irritación respiratoria, disrupción endocrina',
    environmentalImpact: 'Persistencia en agua, contaminación',
    severity: 'high'
  },
  {
    name: 'Conservantes (formaldehído, MIT/CMIT)',
    healthImpact: 'Alergias severas, posible carcinógeno',
    environmentalImpact: 'Tóxicos para organismos acuáticos',
    severity: 'high'
  },
  {
    name: 'Colorantes artificiales',
    healthImpact: 'Reacciones alérgicas',
    environmentalImpact: 'Persistentes en ambiente acuático',
    severity: 'low'
  }
];

// Químicos en suavizantes
export const softenerChemicals: ChemicalInfo[] = [
  {
    name: 'Sales de amonio cuaternario',
    healthImpact: 'Irritación cutánea, problemas respiratorios, alergias',
    environmentalImpact: 'Muy tóxicos para vida acuática, bioacumulables',
    severity: 'high'
  },
  {
    name: 'Fragancias encapsuladas (poliacrilatos)',
    healthImpact: 'Dermatitis de contacto, liberan formaldehído',
    environmentalImpact: 'Microplásticos, persistencia ambiental',
    severity: 'high'
  },
  {
    name: 'Ftalatos (DEP)',
    healthImpact: 'Disruptor endocrino, afecta fertilidad',
    environmentalImpact: 'Bioacumulación en organismos acuáticos',
    severity: 'high'
  },
  {
    name: 'Almizcles sintéticos (galaxolide)',
    healthImpact: 'Disrupción endocrina, bioacumulación',
    environmentalImpact: 'Persistente en sedimentos acuáticos',
    severity: 'high'
  },
  {
    name: 'Polímeros (PEGs etoxilados)',
    healthImpact: 'Irritación leve, contaminación por óxido de etileno',
    environmentalImpact: 'No biodegradables',
    severity: 'medium'
  },
  {
    name: 'Colorantes artificiales',
    healthImpact: 'Sensibilizantes cutáneos',
    environmentalImpact: 'Persistentes en ambiente acuático',
    severity: 'low'
  }
];

// Químicos en desinfectantes
export const disinfectantChemicals: ChemicalInfo[] = [
  {
    name: 'Hipoclorito de sodio (cloro)',
    healthImpact: 'Irritación respiratoria severa, quemaduras cutáneas',
    environmentalImpact: 'Genera organoclorados tóxicos en agua',
    severity: 'high'
  },
  {
    name: 'Compuestos de amonio cuaternario',
    healthImpact: 'Irritación respiratoria, alergias',
    environmentalImpact: 'Tóxicos para peces y algas',
    severity: 'high'
  },
  {
    name: 'Fenoles (o-fenilfenol)',
    healthImpact: 'Irritación cutánea, posible disruptor endocrino',
    environmentalImpact: 'Tóxico para vida acuática',
    severity: 'high'
  },
  {
    name: 'Alcohol etílico',
    healthImpact: 'Irritación cutánea y ocular',
    environmentalImpact: 'Biodegradable rápidamente',
    severity: 'low'
  },
  {
    name: 'Fragancias sintéticas',
    healthImpact: 'Alergias respiratorias',
    environmentalImpact: 'Persistencia en agua',
    severity: 'medium'
  }
];

// Químicos en potenciadores de aroma
export const enhancerChemicals: ChemicalInfo[] = [
  {
    name: 'Fragancias encapsuladas en microcápsulas',
    healthImpact: 'Liberan formaldehído, dermatitis de contacto',
    environmentalImpact: 'Microplásticos, contaminación a largo plazo',
    severity: 'high'
  },
  {
    name: 'Ftalatos (DEP, DEHP)',
    healthImpact: 'Disruptor endocrino, afecta reproducción',
    environmentalImpact: 'Bioacumulación en fauna acuática',
    severity: 'high'
  },
  {
    name: 'Almizcles sintéticos (galaxolide, tonalide)',
    healthImpact: 'Disrupción hormonal, alergias',
    environmentalImpact: 'Bioacumulables y persistentes',
    severity: 'high'
  },
  {
    name: 'Poliacrilamidas',
    healthImpact: 'Contaminación por acrilamida (neurotóxica)',
    environmentalImpact: 'No biodegradables',
    severity: 'high'
  },
  {
    name: 'Colorantes artificiales',
    healthImpact: 'Sensibilizantes',
    environmentalImpact: 'Persistentes en ambiente acuático',
    severity: 'low'
  }
];

// Función para obtener químicos por categoría
export const getChemicalsByCategory = (category: string): ChemicalInfo[] => {
  switch (category) {
    case 'detergent':
      return detergentChemicals;
    case 'softener':
      return softenerChemicals;
    case 'disinfectant':
      return disinfectantChemicals;
    case 'enhancer':
      return enhancerChemicals;
    default:
      return [];
  }
};

// Función para calcular total de químicos según productos seleccionados
export const calculateTotalChemicals = (products: Array<{ category: string }>): number => {
  const categories = new Set(products.map(p => p.category));
  let total = 0;
  
  categories.forEach(category => {
    total += getChemicalsByCategory(category).length;
  });
  
  return total;
};

// Función para obtener todos los químicos de productos seleccionados
export const getAllChemicalsFromProducts = (products: Array<{ category: string }>): CategoryChemicals[] => {
  const categories = new Set(products.map(p => p.category));
  const result: CategoryChemicals[] = [];
  
  const categoryNames: Record<string, string> = {
    'detergent': 'Detergente',
    'softener': 'Suavizante',
    'disinfectant': 'Desinfectante',
    'enhancer': 'Potenciador de Aroma'
  };
  
  categories.forEach(category => {
    const chemicals = getChemicalsByCategory(category);
    if (chemicals.length > 0) {
      result.push({
        category: categoryNames[category] || category,
        count: chemicals.length,
        chemicals
      });
    }
  });
  
  return result;
};

