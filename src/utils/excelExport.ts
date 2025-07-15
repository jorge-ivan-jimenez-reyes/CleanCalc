import { ExpenseSummary, Product, LaundryStats, getDurationInWeeks } from '../types';
import { formatCurrency } from './calculator';

export interface ExportData {
  expenseSummary: ExpenseSummary;
  selectedProducts: Product[];
  laundryStats?: LaundryStats;
}

export const exportToExcel = async (data: ExportData) => {
  const { expenseSummary, selectedProducts, laundryStats } = data;
  
  // Importación dinámica para evitar conflictos con React
  const XLSX = await import('xlsx');

  // Crear un nuevo libro de trabajo
  const workbook = XLSX.utils.book_new();

  // Hoja 1: Resumen de Comparación
  const summaryData = [
    ['COMPARACIÓN GECO vs PRODUCTOS TRADICIONALES', '', '', ''],
    ['', '', '', ''],
    ['CONCEPTO', 'PRODUCTOS TRADICIONALES', 'GECO', 'AHORRO'],
    ['Gasto Anual', formatCurrency(expenseSummary.yearlyExpense), formatCurrency(expenseSummary.gecoYearlyExpense), formatCurrency(expenseSummary.savedMoney)],
    ['Consumo de Agua (L/año)', expenseSummary.yearlyWaterUsage.toLocaleString(), expenseSummary.gecoYearlyWaterUsage.toLocaleString(), expenseSummary.savedWater.toLocaleString()],
    ['Tiempo Invertido (horas/año)', expenseSummary.yearlyTimeSpent.toFixed(1), expenseSummary.gecoYearlyTimeSpent.toFixed(1), expenseSummary.savedTime.toFixed(1)],
    ['', '', '', ''],
    ['DESGLOSE POR CATEGORÍA', '', '', ''],
    ['Detergente', formatCurrency(expenseSummary.detergentExpense * 12), 'Incluido en GECO', ''],
    ['Suavizante', formatCurrency(expenseSummary.softenerExpense * 12), 'Incluido en GECO', ''],
    ['Desinfectante', formatCurrency(expenseSummary.disinfectantExpense * 12), 'Incluido en GECO', ''],
    ['Potenciadores', formatCurrency(expenseSummary.enhancerExpense * 12), 'Incluido en GECO', ''],
    ['', '', '', ''],
    ['VENTAJAS DE GECO', '', '', ''],
    ['✓ TODO EN UNO: detergente + suavizante + desinfectante + aroma', '', '', ''],
    ['✓ Solo 2 tabletas por carga (no más productos adicionales)', '', '', ''],
    ['✓ Fórmula eco-friendly concentrada', '', '', ''],
    ['✓ Reduce tiempo de lavado en 30 minutos', '', '', ''],
    ['✓ Menor consumo de agua (50% menos)', '', '', ''],
    ['✓ Más económico vs comprar múltiples productos', '', '', '']
  ];

  const summarySheet = XLSX.utils.aoa_to_sheet(summaryData);
  
  // Ajustar ancho de columnas
  summarySheet['!cols'] = [
    { wch: 35 }, // Columna A
    { wch: 20 }, // Columna B
    { wch: 15 }, // Columna C
    { wch: 15 }  // Columna D
  ];

  // Agregar formato a la hoja
  summarySheet['A1'].s = {
    font: { bold: true, sz: 14 },
    alignment: { horizontal: 'center' }
  };

  XLSX.utils.book_append_sheet(workbook, summarySheet, 'Comparación');

  // Hoja 2: Productos Seleccionados
  const productsData = [
    ['PRODUCTOS TRADICIONALES SELECCIONADOS', '', '', '', '', ''],
    ['', '', '', '', '', ''],
    ['PRODUCTO', 'CATEGORÍA', 'PRECIO', 'CANTIDAD', 'DURACIÓN', 'COSTO ANUAL'],
    ...selectedProducts.map(product => [
      product.name,
      product.category,
      formatCurrency(product.price),
      product.quantity.toString(),
      product.duration || 'N/A',
      formatCurrency(
        product.duration 
          ? (product.price * (52 / getDurationInWeeks(product.duration)))
          : (product.price / product.quantity) * product.usageFrequency * 12
      )
    ])
  ];

  const productsSheet = XLSX.utils.aoa_to_sheet(productsData);
  productsSheet['!cols'] = [
    { wch: 30 }, // Producto
    { wch: 15 }, // Categoría
    { wch: 12 }, // Precio
    { wch: 12 }, // Cantidad
    { wch: 15 }, // Duración
    { wch: 15 }  // Costo Anual
  ];

  XLSX.utils.book_append_sheet(workbook, productsSheet, 'Productos');

  // Hoja 3: Estadísticas de Lavandería
  if (laundryStats) {
    const statsData = [
      ['ESTADÍSTICAS DE LAVANDERÍA', '', ''],
      ['', '', ''],
      ['CONCEPTO', 'VALOR', 'UNIDAD'],
      ['Cargas por semana', laundryStats.loadsPerWeek.toString(), 'cargas'],
      ['Tiempo por carga', laundryStats.timePerLoad.toString(), 'minutos'],
      ['Agua por carga', laundryStats.waterPerLoad.toString(), 'litros'],
      ['', '', ''],
      ['CÁLCULOS ANUALES', '', ''],
      ['Total de cargas al año', (laundryStats.loadsPerWeek * 52).toString(), 'cargas'],
      ['Tiempo total al año', Math.round((laundryStats.loadsPerWeek * 52 * laundryStats.timePerLoad) / 60).toString(), 'horas'],
      ['Agua total al año', (laundryStats.loadsPerWeek * 52 * laundryStats.waterPerLoad).toString(), 'litros']
    ];

    const statsSheet = XLSX.utils.aoa_to_sheet(statsData);
    statsSheet['!cols'] = [
      { wch: 25 }, // Concepto
      { wch: 15 }, // Valor
      { wch: 15 }  // Unidad
    ];

    XLSX.utils.book_append_sheet(workbook, statsSheet, 'Estadísticas');
  }

  // Generar y descargar el archivo
  const fileName = `analisis-geco-${new Date().toISOString().split('T')[0]}.xlsx`;
  XLSX.writeFile(workbook, fileName);
  
  return fileName;
};

export const exportSummaryToExcel = async (expenseSummary: ExpenseSummary) => {
  // Importación dinámica para evitar conflictos con React
  const XLSX = await import('xlsx');
  const summaryData = [
    ['RESUMEN DE AHORROS CON GECO', '', ''],
    ['', '', ''],
    ['CONCEPTO', 'AHORRO ANUAL', 'PORCENTAJE'],
    [
      'Ahorro Económico', 
      formatCurrency(expenseSummary.savedMoney),
      expenseSummary.yearlyExpense > 0 ? `${((expenseSummary.savedMoney / expenseSummary.yearlyExpense) * 100).toFixed(1)}%` : '0%'
    ],
    [
      'Ahorro de Agua', 
      `${expenseSummary.savedWater.toLocaleString()} litros`,
      expenseSummary.yearlyWaterUsage > 0 ? `${((expenseSummary.savedWater / expenseSummary.yearlyWaterUsage) * 100).toFixed(1)}%` : '0%'
    ],
    [
      'Ahorro de Tiempo', 
      `${expenseSummary.savedTime.toFixed(1)} horas`,
      expenseSummary.yearlyTimeSpent > 0 ? `${((expenseSummary.savedTime / expenseSummary.yearlyTimeSpent) * 100).toFixed(1)}%` : '0%'
    ]
  ];

  const workbook = XLSX.utils.book_new();
  const sheet = XLSX.utils.aoa_to_sheet(summaryData);
  
  sheet['!cols'] = [
    { wch: 20 },
    { wch: 20 },
    { wch: 15 }
  ];

  XLSX.utils.book_append_sheet(workbook, sheet, 'Resumen Ahorros');
  
  const fileName = `resumen-ahorros-geco-${new Date().toISOString().split('T')[0]}.xlsx`;
  XLSX.writeFile(workbook, fileName);
  
  return fileName;
}; 