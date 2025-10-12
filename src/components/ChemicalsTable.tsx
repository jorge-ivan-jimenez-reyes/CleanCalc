import React from 'react';
import { motion } from 'framer-motion';
import { Product } from '../types';
import { getAllChemicalsFromProducts, CategoryChemicals } from '../data/chemicals';
import { AlertTriangle, CheckCircle } from 'lucide-react';

interface ChemicalsTableProps {
  products: Product[];
}

const ChemicalsTable: React.FC<ChemicalsTableProps> = ({ products }) => {
  const chemicalsData = getAllChemicalsFromProducts(products);
  
  if (chemicalsData.length === 0) {
    return null;
  }

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high':
        return 'bg-red-100 text-red-800 border-red-300';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'low':
        return 'bg-green-100 text-green-800 border-green-300';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  const getSeverityLabel = (severity: string) => {
    switch (severity) {
      case 'high':
        return 'Alto';
      case 'medium':
        return 'Medio';
      case 'low':
        return 'Bajo';
      default:
        return 'N/A';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      className="w-full max-w-7xl mx-auto mb-12 px-4"
    >
      <div className="bg-white rounded-2xl shadow-xl p-8">
        <div className="text-center mb-8">
          <AlertTriangle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-3xl font-bold text-gray-800 mb-2">
            Químicos Dañinos en tus Productos Actuales
          </h2>
          <p className="text-gray-600">
            Estos son los químicos que estás usando actualmente y su impacto en tu salud y el medio ambiente
          </p>
        </div>

        {chemicalsData.map((categoryData: CategoryChemicals, catIndex: number) => (
          <motion.div
            key={catIndex}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: catIndex * 0.2 }}
            className="mb-8 last:mb-0"
          >
            <div className="bg-gradient-to-r from-teal-50 to-blue-50 rounded-lg p-4 mb-4">
              <h3 className="text-xl font-bold text-gray-800 flex items-center">
                <span className="bg-teal-600 text-white rounded-full w-8 h-8 flex items-center justify-center mr-3 text-sm">
                  {categoryData.count}
                </span>
                {categoryData.category}
              </h3>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b-2 border-gray-200">
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Químico</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Impacto en Salud</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Impacto Ambiental</th>
                    <th className="text-center py-3 px-4 font-semibold text-gray-700">Severidad</th>
                  </tr>
                </thead>
                <tbody>
                  {categoryData.chemicals.map((chemical, chemIndex) => (
                    <motion.tr
                      key={chemIndex}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: catIndex * 0.2 + chemIndex * 0.1 }}
                      className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
                    >
                      <td className="py-3 px-4">
                        <p className="font-medium text-gray-800 text-sm">{chemical.name}</p>
                      </td>
                      <td className="py-3 px-4">
                        <p className="text-sm text-gray-600">{chemical.healthImpact}</p>
                      </td>
                      <td className="py-3 px-4">
                        <p className="text-sm text-gray-600">{chemical.environmentalImpact}</p>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex justify-center">
                          <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getSeverityColor(chemical.severity)}`}>
                            {getSeverityLabel(chemical.severity)}
                          </span>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>
        ))}

        {/* Comparación con GECO */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-8 bg-gradient-to-r from-green-50 to-teal-50 rounded-xl p-6 border-2 border-green-200"
        >
          <div className="flex items-center justify-center mb-4">
            <CheckCircle className="w-10 h-10 text-green-600 mr-3" />
            <h3 className="text-2xl font-bold text-green-800">
              Con GECO: 0 Químicos Dañinos
            </h3>
          </div>
          <p className="text-center text-gray-700 text-lg">
            GECO está formulado con ingredientes naturales y seguros, eliminando todos estos químicos dañinos de tu lavandería
          </p>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default ChemicalsTable;

