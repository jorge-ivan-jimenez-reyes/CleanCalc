import { ProductDatabase } from '../data/products';

// Define la ruta de los archivos CSV externos (originales)
const CSV_BASE_PATH = '/Users/JorgeJimenez/Documents/GFRESHHH/project/utils/';

// Define la ruta de los archivos CSV en la carpeta pública (copia local)
const PUBLIC_CSV_PATH = '/data/';

// Mapeo de los nombres de archivo a categorías
const FILE_CATEGORY_MAP: Record<string, string> = {
  'Detergentes.csv': 'detergent',
  'Suavizante.csv': 'softener',
  'Desinfectante.csv': 'disinfectant',
  'Potenciadores.csv': 'enhancer',
  'Desmanchadores.csv': 'enhancer', // Asumiendo que los desmanchadores son potenciadores
};

// Función para cargar un archivo CSV desde una ruta
async function loadCSV(filePath: string): Promise<string> {
  try {
    const response = await fetch(filePath);
    if (!response.ok) {
      throw new Error(`Error al cargar el archivo CSV: ${response.status}`);
    }
    return await response.text();
  } catch (error) {
    console.error(`Error al cargar el archivo CSV ${filePath}:`, error);
    return '';
  }
}

// Función para parsear CSV a objetos
function parseCSV(csvText: string, category: string): ProductDatabase[] {
  if (!csvText) return [];

  const lines = csvText.split('\n');
  // Saltamos las primeras dos líneas que contienen los encabezados
  const dataLines = lines.slice(2);
  
  const products: ProductDatabase[] = [];
  
  dataLines.forEach(line => {
    if (!line.trim()) return;
    
    const columns = line.split(',');
    
    // Basado en el formato observado en los CSVs
    // El formato puede variar según el archivo, ajustamos dinámicamente
    let brand = '';
    let name = '';
    let type = '';
    let size = 0;
    let price = 0;
    
    if (category === 'detergent') {
      // Para Detergentes.csv
      brand = columns[0] || 'Genérico';
      name = columns[1] || 'Detergente';
      type = columns[2] || 'Líquido';
      size = parseFloat(columns[3]) || 1;
      price = parseFloat(columns[4]) || 0;
    } else if (category === 'softener') {
      // Para Suavizante.csv
      brand = columns[1] || 'Genérico';
      name = columns[2] || 'Suavizante';
      type = columns[3] || 'Líquido';
      size = parseFloat(columns[4]) || 1;
      price = parseFloat(columns[5]) || 0;
    } else {
      // Para otros archivos (ajustar según sea necesario)
      brand = columns[1] || 'Genérico';
      name = columns[2] || category;
      type = columns[3] || 'Líquido';
      size = parseFloat(columns[4]) || 1;
      price = parseFloat(columns[5]) || 0;
    }
    
    // Solo agregar productos con datos válidos
    if (brand && price > 0) {
      products.push({
        brand,
        name,
        type,
        size,
        unit: 'L', // Asumimos litros como unidad por defecto
        price,
        category: category as any
      });
    }
  });
  
  return products;
}

// Función principal para cargar todos los archivos CSV desde la ruta externa
export async function loadAllExternalProducts(): Promise<ProductDatabase[]> {
  const allProducts: ProductDatabase[] = [];
  
  try {
    // Obtener lista de archivos
    const fileNames = Object.keys(FILE_CATEGORY_MAP);
    
    // Cargar y procesar cada archivo
    for (const fileName of fileNames) {
      const filePath = `${CSV_BASE_PATH}${fileName}`;
      const category = FILE_CATEGORY_MAP[fileName];
      
      console.log(`Cargando ${fileName} desde ruta externa...`);
      const csvText = await loadCSV(filePath);
      
      if (csvText) {
        const products = parseCSV(csvText, category);
        console.log(`Cargados ${products.length} productos de ${fileName}`);
        allProducts.push(...products);
      }
    }
    
    return allProducts;
  } catch (error) {
    console.error('Error al cargar los productos externos:', error);
    return [];
  }
}

// Función para cargar desde archivos en la carpeta public (copia local)
export async function loadLocalCSVFiles(): Promise<ProductDatabase[]> {
  const allProducts: ProductDatabase[] = [];
  
  try {
    // Obtener lista de archivos
    const fileNames = Object.keys(FILE_CATEGORY_MAP);
    
    // Cargar y procesar cada archivo
    for (const fileName of fileNames) {
      const filePath = `${PUBLIC_CSV_PATH}${fileName}`;
      const category = FILE_CATEGORY_MAP[fileName];
      
      console.log(`Cargando ${fileName} desde carpeta pública...`);
      const csvText = await loadCSV(filePath);
      
      if (csvText) {
        const products = parseCSV(csvText, category);
        console.log(`Cargados ${products.length} productos de ${fileName}`);
        allProducts.push(...products);
      }
    }
    
    return allProducts;
  } catch (error) {
    console.error('Error al cargar los productos desde carpeta pública:', error);
    return [];
  }
} 