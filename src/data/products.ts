export interface ProductDatabase {
  brand: string;
  name: string;
  type: string;
  size: number;
  unit: string;
  price: number;
  category: 'detergent' | 'softener' | 'disinfectant' | 'enhancer';
}

export const commonProducts: ProductDatabase[] = [
  // MAS Products
  {
    brand: "MAS",
    name: "Original",
    type: "Líquido",
    size: 0.83,
    unit: "L",
    price: 34.50,
    category: "detergent"
  },
  {
    brand: "MAS",
    name: "Original",
    type: "Líquido",
    size: 1.83,
    unit: "L",
    price: 72.00,
    category: "detergent"
  },
  {
    brand: "MAS",
    name: "Original",
    type: "Líquido",
    size: 3.0,
    unit: "L",
    price: 133.00,
    category: "detergent"
  },
  {
    brand: "MAS",
    name: "Original",
    type: "Líquido",
    size: 4.65,
    unit: "L",
    price: 185.00,
    category: "detergent"
  },
  {
    brand: "MAS",
    name: "Original",
    type: "Líquido",
    size: 6.64,
    unit: "L",
    price: 225.00,
    category: "detergent"
  },
  {
    brand: "MAS",
    name: "Renueva y Florece",
    type: "Líquido",
    size: 4.65,
    unit: "L",
    price: 185.00,
    category: "detergent"
  },
  {
    brand: "MAS",
    name: "Ropa Oscura",
    type: "Líquido",
    size: 6.64,
    unit: "L",
    price: 225.00,
    category: "detergent"
  },
  {
    brand: "MAS",
    name: "Bebé",
    type: "Líquido",
    size: 1.83,
    unit: "L",
    price: 72.00,
    category: "detergent"
  },
  {
    brand: "MAS",
    name: "Frescura Intensa",
    type: "Líquido",
    size: 4.65,
    unit: "L",
    price: 185.00,
    category: "detergent"
  },

  // ACE Products
  {
    brand: "ACE",
    name: "Original",
    type: "Polvo",
    size: 0.648,
    unit: "L",
    price: 35.50,
    category: "detergent"
  },
  {
    brand: "ACE",
    name: "Original",
    type: "Polvo",
    size: 1.72,
    unit: "L",
    price: 98.00,
    category: "detergent"
  },
  {
    brand: "ACE",
    name: "Original",
    type: "Polvo",
    size: 4.86,
    unit: "L",
    price: 265.00,
    category: "detergent"
  },
  {
    brand: "ACE",
    name: "Original",
    type: "Polvo",
    size: 5.83,
    unit: "L",
    price: 318.00,
    category: "detergent"
  },
  {
    brand: "ACE",
    name: "Original",
    type: "Líquido",
    size: 5,
    unit: "L",
    price: 199.00,
    category: "detergent"
  },

  // PERSIL Products
  {
    brand: "PERSIL",
    name: "Original",
    type: "Polvo",
    size: 0.9,
    unit: "L",
    price: 39.90,
    category: "detergent"
  },
  {
    brand: "PERSIL",
    name: "Original",
    type: "Polvo",
    size: 4.5,
    unit: "L",
    price: 183.00,
    category: "detergent"
  },
  {
    brand: "PERSIL",
    name: "Original",
    type: "Líquido",
    size: 3,
    unit: "L",
    price: 115.00,
    category: "detergent"
  },
  {
    brand: "PERSIL",
    name: "Original",
    type: "Líquido",
    size: 4,
    unit: "L",
    price: 185.00,
    category: "detergent"
  },
  {
    brand: "PERSIL",
    name: "Original",
    type: "Líquido",
    size: 6.64,
    unit: "L",
    price: 243.00,
    category: "detergent"
  },
  {
    brand: "PERSIL",
    name: "Color",
    type: "Líquido",
    size: 0.83,
    unit: "L",
    price: 51.90,
    category: "detergent"
  },
  {
    brand: "PERSIL",
    name: "Color",
    type: "Líquido",
    size: 3,
    unit: "L",
    price: 115.00,
    category: "detergent"
  },
  {
    brand: "PERSIL",
    name: "Color",
    type: "Líquido",
    size: 4.65,
    unit: "L",
    price: 185.00,
    category: "detergent"
  },
  {
    brand: "PERSIL",
    name: "Color",
    type: "Líquido",
    size: 6.64,
    unit: "L",
    price: 243.00,
    category: "detergent"
  },

  // 123 Products
  {
    brand: "123",
    name: "Color",
    type: "Líquido",
    size: 4.65,
    unit: "L",
    price: 130.00,
    category: "detergent"
  },

  // ARIEL Products
  {
    brand: "ARIEL",
    name: "Original",
    type: "Polvo",
    size: 0.75,
    unit: "L",
    price: 40.50,
    category: "detergent"
  },
  {
    brand: "ARIEL",
    name: "Original",
    type: "Polvo",
    size: 2,
    unit: "L",
    price: 103.50,
    category: "detergent"
  },
  {
    brand: "ARIEL",
    name: "Original",
    type: "Polvo",
    size: 5.5,
    unit: "L",
    price: 291.50,
    category: "detergent"
  },
  {
    brand: "ARIEL",
    name: "Original",
    type: "Polvo",
    size: 6,
    unit: "L",
    price: 318.00,
    category: "detergent"
  },
  {
    brand: "ARIEL",
    name: "Revita Color (Mezclilla)",
    type: "Líquido",
    size: 5,
    unit: "L",
    price: 209.50,
    category: "detergent"
  },
  {
    brand: "ARIEL",
    name: "Ropa Color",
    type: "Líquido",
    size: 0.8,
    unit: "L",
    price: 40.00,
    category: "detergent"
  },
  {
    brand: "ARIEL",
    name: "Ropa Color",
    type: "Líquido",
    size: 1.8,
    unit: "L",
    price: 89.00,
    category: "detergent"
  },
  {
    brand: "ARIEL",
    name: "Ropa Color",
    type: "Líquido",
    size: 2.8,
    unit: "L",
    price: 147.00,
    category: "detergent"
  },
  {
    brand: "ARIEL",
    name: "Ropa Color",
    type: "Líquido",
    size: 5,
    unit: "L",
    price: 210.00,
    category: "detergent"
  },
  {
    brand: "ARIEL",
    name: "Dark & Colors",
    type: "Líquido",
    size: 8,
    unit: "L",
    price: 355.00,
    category: "detergent"
  },

  // SUAVIZANTES
  {
    brand: "SUAVITEL",
    name: "Suavizante Campo Fresco",
    type: "Líquido",
    size: 0.85,
    unit: "L",
    price: 35.50,
    category: "softener"
  },
  {
    brand: "SUAVITEL",
    name: "Suavizante Campo Fresco",
    type: "Líquido",
    size: 1.75,
    unit: "L",
    price: 68.90,
    category: "softener"
  },
  {
    brand: "SUAVITEL",
    name: "Suavizante Campo Fresco",
    type: "Líquido",
    size: 3.1,
    unit: "L",
    price: 118.00,
    category: "softener"
  },
  {
    brand: "SUAVITEL",
    name: "Suavizante Lavanda",
    type: "Líquido",
    size: 0.85,
    unit: "L",
    price: 35.50,
    category: "softener"
  },
  {
    brand: "SUAVITEL",
    name: "Suavizante Lavanda",
    type: "Líquido",
    size: 1.75,
    unit: "L",
    price: 68.90,
    category: "softener"
  },
  {
    brand: "DOWNY",
    name: "Suavizante Aroma Floral",
    type: "Líquido",
    size: 0.8,
    unit: "L",
    price: 42.50,
    category: "softener"
  },
  {
    brand: "DOWNY",
    name: "Suavizante Aroma Floral",
    type: "Líquido",
    size: 1.8,
    unit: "L",
    price: 89.00,
    category: "softener"
  },
  {
    brand: "DOWNY",
    name: "Suavizante Libre Enjuague",
    type: "Líquido",
    size: 0.8,
    unit: "L",
    price: 45.00,
    category: "softener"
  },

  // DESINFECTANTES
  {
    brand: "LYSOL",
    name: "Desinfectante Multiusos",
    type: "Líquido",
    size: 0.5,
    unit: "L",
    price: 28.90,
    category: "disinfectant"
  },
  {
    brand: "LYSOL",
    name: "Desinfectante Multiusos",
    type: "Líquido",
    size: 1,
    unit: "L",
    price: 52.50,
    category: "disinfectant"
  },
  {
    brand: "FABULOSO",
    name: "Desinfectante Lavanda",
    type: "Líquido",
    size: 0.9,
    unit: "L",
    price: 38.90,
    category: "disinfectant"
  },
  {
    brand: "FABULOSO",
    name: "Desinfectante Lavanda",
    type: "Líquido",
    size: 1.8,
    unit: "L",
    price: 72.50,
    category: "disinfectant"
  },
  {
    brand: "FABULOSO",
    name: "Desinfectante Océano",
    type: "Líquido",
    size: 0.9,
    unit: "L",
    price: 38.90,
    category: "disinfectant"
  },
  {
    brand: "PINOL",
    name: "Desinfectante Original",
    type: "Líquido",
    size: 0.9,
    unit: "L",
    price: 32.50,
    category: "disinfectant"
  },
  {
    brand: "PINOL",
    name: "Desinfectante Original",
    type: "Líquido",
    size: 1.8,
    unit: "L",
    price: 58.90,
    category: "disinfectant"
  },

  // POTENCIADORES DE AROMA
  {
    brand: "DOWNY",
    name: "Unstopables Frescura",
    type: "Perlas",
    size: 0.375,
    unit: "kg",
    price: 89.50,
    category: "enhancer"
  },
  {
    brand: "DOWNY",
    name: "Unstopables Frescura",
    type: "Perlas",
    size: 0.750,
    unit: "kg",
    price: 158.90,
    category: "enhancer"
  },
  {
    brand: "DOWNY",
    name: "Unstopables Lavanda",
    type: "Perlas",
    size: 0.375,
    unit: "kg",
    price: 89.50,
    category: "enhancer"
  },
  {
    brand: "ARIEL",
    name: "Power Pods",
    type: "Cápsulas",
    size: 12,
    unit: "piezas",
    price: 45.90,
    category: "enhancer"
  },
  {
    brand: "ARIEL",
    name: "Power Pods",
    type: "Cápsulas",
    size: 24,
    unit: "piezas",
    price: 89.50,
    category: "enhancer"
  },
  {
    brand: "GAIN",
    name: "Fireworks Aroma Boost",
    type: "Perlas",
    size: 0.375,
    unit: "kg",
    price: 92.50,
    category: "enhancer"
  }
];