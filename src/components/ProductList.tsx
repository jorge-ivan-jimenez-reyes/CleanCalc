import React from 'react';
import { Product, productDurations } from '../types';
import { Trash2 } from 'lucide-react';

interface ProductListProps {
  products: Product[];
  onRemoveProduct: (id: string) => void;
}

const ProductList: React.FC<ProductListProps> = ({ products, onRemoveProduct }) => {
  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'detergent':
        return 'bg-blue-100 text-blue-800';
      case 'softener':
        return 'bg-purple-100 text-purple-800';
      case 'disinfectant':
        return 'bg-green-100 text-green-800';
      case 'enhancer':
        return 'bg-amber-100 text-amber-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getCategoryName = (category: string) => {
    switch (category) {
      case 'detergent':
        return 'Detergente';
      case 'softener':
        return 'Suavizante';
      case 'disinfectant':
        return 'Desinfectante';
      case 'enhancer':
        return 'Potenciador';
      default:
        return category;
    }
  };

  const getDurationLabel = (durationValue: string | undefined) => {
    if (!durationValue) return 'No especificado';
    const duration = productDurations.find(d => d.value === durationValue);
    return duration ? duration.label : 'No especificado';
  };

  const calculateMonthlyExpense = (product: Product) => {
    return ((product.price / product.quantity) * product.usageFrequency).toFixed(2);
  };

  if (products.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-md p-6 text-center">
        <p className="text-gray-500">No hay productos agregados. Agrega tu primer producto de limpieza arriba.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden mb-8">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Producto
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Categoría
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Precio
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Duración
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Costo Mensual
              </th>
              <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {products.map((product) => (
              <tr key={product.id} className="hover:bg-gray-50 transition-colors duration-150">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">{product.name}</div>
                  {product.type && product.size && product.unit && (
                    <div className="text-xs text-gray-500">
                      {product.type} • {product.size}{product.unit}
                    </div>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getCategoryColor(product.category)}`}>
                    {getCategoryName(product.category)}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  ${product.price.toFixed(2)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {getDurationLabel(product.duration)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">
                  ${calculateMonthlyExpense(product)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button
                    onClick={() => onRemoveProduct(product.id)}
                    className="text-red-600 hover:text-red-900 transition-colors duration-150"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ProductList;