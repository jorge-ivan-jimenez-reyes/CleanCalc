import React from 'react';
import { Product, productDurations } from '../types';
import { Trash2, Package, Tag, Clock, DollarSign, ShoppingBag } from 'lucide-react';

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
      <div className="bg-white rounded-lg shadow-sm p-6 text-center border border-gray-100">
        <ShoppingBag className="w-12 h-12 mx-auto text-gray-300 mb-3" />
        <p className="text-base text-gray-500 mb-2">No hay productos agregados aún</p>
        <p className="text-xs text-gray-400">Agrega tu primer producto de limpieza usando el formulario de arriba</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden border border-gray-100 transition-all hover:shadow-md">
      <div className="p-4 border-b border-gray-100">
        <div className="flex items-center mb-3">
          <div className="bg-gray-100 p-2 rounded-full mr-3">
            <ShoppingBag className="w-5 h-5 text-gray-600" />
          </div>
          <h2 className="text-lg font-semibold text-gray-800">Tus Productos</h2>
          <span className="ml-3 px-2 py-0.5 bg-blue-100 text-blue-800 text-xs rounded-full">
            {products.length} {products.length === 1 ? 'producto' : 'productos'}
          </span>
        </div>
      
        <div className="overflow-x-auto -mx-4 px-4">
          <table className="min-w-full divide-y divide-gray-200 text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Producto
                </th>
                <th scope="col" className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Categoría
                </th>
                <th scope="col" className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Precio
                </th>
                <th scope="col" className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Duración
                </th>
                <th scope="col" className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Costo/Mes
                </th>
                <th scope="col" className="px-3 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {products.map((product) => (
                <tr key={product.id} className="hover:bg-gray-50 transition-colors duration-150">
                  <td className="px-3 py-3 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="p-1.5 bg-gray-100 rounded-full mr-2">
                        <Package className="h-4 w-4 text-gray-500" />
                      </div>
                      <div>
                        <div className="text-sm font-medium text-gray-900">{product.name}</div>
                        {product.type && product.size && product.unit && (
                          <div className="text-xs text-gray-500 flex items-center mt-1">
                            <Tag className="h-3 w-3 mr-1" />
                            {product.type} • {product.size}{product.unit}
                          </div>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="px-3 py-3 whitespace-nowrap">
                    <span className={`px-2 py-1 inline-flex text-xs leading-5 font-medium rounded-full ${getCategoryColor(product.category)}`}>
                      {getCategoryName(product.category)}
                    </span>
                  </td>
                  <td className="px-3 py-3 whitespace-nowrap">
                    <div className="flex items-center text-xs text-gray-500">
                      <DollarSign className="h-3.5 w-3.5 mr-1 text-gray-400" />
                      {product.price.toFixed(2)}
                    </div>
                  </td>
                  <td className="px-3 py-3 whitespace-nowrap">
                    <div className="flex items-center text-xs text-gray-500">
                      <Clock className="h-3.5 w-3.5 mr-1 text-gray-400" />
                      {getDurationLabel(product.duration)}
                    </div>
                  </td>
                  <td className="px-3 py-3 whitespace-nowrap">
                    <div className="text-xs text-gray-900 font-medium bg-green-50 px-2 py-1 rounded-full inline-flex items-center">
                      <DollarSign className="h-3.5 w-3.5 mr-1 text-green-500" />
                      {calculateMonthlyExpense(product)}
                    </div>
                  </td>
                  <td className="px-3 py-3 whitespace-nowrap text-right text-sm font-medium">
                    <button
                      onClick={() => onRemoveProduct(product.id)}
                      className="text-red-500 hover:text-red-700 transition-colors duration-150 bg-red-50 p-1.5 rounded-full"
                      title="Eliminar producto"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ProductList;