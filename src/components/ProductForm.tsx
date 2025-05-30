import React, { useState } from 'react';
import { Product, productDurations } from '../types';
import { PlusCircle, Search, Package, DollarSign, Timer, Repeat } from 'lucide-react';
import { commonProducts, ProductDatabase } from '../data/products';

interface ProductFormProps {
  onAddProduct: (product: Product) => void;
}

const ProductForm: React.FC<ProductFormProps> = ({ onAddProduct }) => {
  const [showProductList, setShowProductList] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [product, setProduct] = useState<Omit<Product, 'id'>>({
    name: '',
    price: 0,
    quantity: 1,
    usageFrequency: 1,
    category: 'detergent',
    duration: '1month',
  });
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (product.name && product.price > 0) {
      onAddProduct({
        ...product,
        id: Date.now().toString(),
      });
      setProduct({
        name: '',
        price: 0,
        quantity: 1,
        usageFrequency: 1,
        category: 'detergent',
        duration: '1month',
      });
      setShowProductList(false);
    }
  };
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setProduct((prev) => ({
      ...prev,
      [name]: name === 'price' || name === 'quantity' || name === 'usageFrequency' 
        ? parseFloat(value) || 0 
        : value,
    }));
  };

  const handleProductSelect = (selectedProduct: ProductDatabase) => {
    setProduct(prev => ({
      ...prev,
      name: `${selectedProduct.brand} ${selectedProduct.name}`,
      price: selectedProduct.price,
      category: selectedProduct.category,
      brand: selectedProduct.brand,
      type: selectedProduct.type,
      size: selectedProduct.size,
      unit: selectedProduct.unit,
    }));
    setShowProductList(false);
  };

  // Agrupar productos por marca y tipo
  const groupedProducts = commonProducts.reduce((acc, product) => {
    const key = `${product.brand}-${product.name}`;
    if (!acc[key]) {
      acc[key] = [];
    }
    acc[key].push(product);
    return acc;
  }, {} as Record<string, ProductDatabase[]>);

  // Filtrar grupos por término de búsqueda
  const filteredGroups = Object.entries(groupedProducts)
    .filter(([key]) => {
      const [brand, name] = key.split('-');
      return `${brand} ${name}`.toLowerCase().includes(searchTerm.toLowerCase());
    })
    .reduce((acc, [key, products]) => {
      acc[key] = products;
      return acc;
    }, {} as Record<string, ProductDatabase[]>);

  return (
    <div className="bg-white rounded-xl shadow-md p-6 transition-all hover:shadow-lg border border-gray-100">
      <div className="flex items-center mb-6">
        <div className="bg-blue-100 p-2 rounded-full mr-3">
          <Package className="w-6 h-6 text-blue-600" />
        </div>
        <h2 className="text-xl font-semibold text-gray-800">Agregar Nuevo Producto</h2>
      </div>
      
      <div className="mb-6">
        <div className="relative">
          <input
            type="text"
            placeholder="Buscar productos (ej. MAS, PERSIL, ACE...)..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onFocus={() => setShowProductList(true)}
            className="w-full px-4 py-3 pl-12 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50"
          />
          <Search className="absolute left-4 top-3.5 h-5 w-5 text-gray-400" />
        </div>
        
        {showProductList && (
          <div className="absolute z-10 mt-2 w-full max-w-2xl bg-white rounded-lg shadow-xl border border-gray-200">
            <div className="max-h-72 overflow-auto">
              {Object.entries(filteredGroups).map(([key, products]) => (
                <div key={key} className="border-b border-gray-100 py-3 px-4 hover:bg-gray-50">
                  <div className="font-medium text-gray-800 flex items-center">
                    <span className="px-2 py-0.5 rounded bg-blue-100 text-blue-800 text-xs mr-2">{products[0].brand}</span>
                    {products[0].name}
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-2">
                    {products.map((p, idx) => (
                      <button
                        key={idx}
                        onClick={() => handleProductSelect(p)}
                        className="text-left px-3 py-2 text-sm rounded-lg bg-white border border-gray-100 hover:border-blue-200 hover:bg-blue-50 transition-colors"
                      >
                        <div className="flex justify-between">
                          <span className="font-medium">{p.type}</span>
                          <span className="text-blue-600 font-medium">${p.price.toFixed(2)}</span>
                        </div>
                        <div className="text-xs text-gray-500">{p.size} {p.unit}</div>
                      </button>
                    ))}
                  </div>
                </div>
              ))}
              {Object.keys(filteredGroups).length === 0 && (
                <div className="py-4 px-4 text-gray-500 text-center">
                  <Search className="h-8 w-8 mx-auto text-gray-300 mb-2" />
                  No se encontraron productos. Intenta con otro término.
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
            <div className="flex items-center mb-3">
              <Package className="w-4 h-4 text-gray-500 mr-2" />
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                Nombre del Producto
              </label>
            </div>
            <input
              type="text"
              id="name"
              name="name"
              value={product.name}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
              placeholder="ej., MAS Original"
              required
            />
          </div>
          <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
            <div className="flex items-center mb-3">
              <Search className="w-4 h-4 text-gray-500 mr-2" />
              <label htmlFor="category" className="block text-sm font-medium text-gray-700">
                Categoría
              </label>
            </div>
            <select
              id="category"
              name="category"
              value={product.category}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
            >
              <option value="detergent">Detergente</option>
              <option value="softener">Suavizante</option>
              <option value="disinfectant">Desinfectante</option>
              <option value="enhancer">Potenciador de Aroma</option>
            </select>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
            <div className="flex items-center mb-3">
              <DollarSign className="w-4 h-4 text-gray-500 mr-2" />
              <label htmlFor="price" className="block text-sm font-medium text-gray-700">
                Precio ($)
              </label>
            </div>
            <input
              type="number"
              id="price"
              name="price"
              value={product.price || ''}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
              min="0.01"
              step="0.01"
              placeholder="0.00"
              required
            />
          </div>
          <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
            <div className="flex items-center mb-3">
              <Timer className="w-4 h-4 text-gray-500 mr-2" />
              <label htmlFor="duration" className="block text-sm font-medium text-gray-700">
                ¿Cuánto te dura el producto?
              </label>
            </div>
            <select
              id="duration"
              name="duration"
              value={product.duration}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
              required
            >
              {productDurations.map((duration) => (
                <option key={duration.value} value={duration.value}>
                  {duration.label}
                </option>
              ))}
            </select>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
            <div className="flex items-center mb-3">
              <Package className="w-4 h-4 text-gray-500 mr-2" />
              <label htmlFor="quantity" className="block text-sm font-medium text-gray-700">
                Usos por Envase
              </label>
            </div>
            <input
              type="number"
              id="quantity"
              name="quantity"
              value={product.quantity || 1}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
              min="1"
              required
            />
          </div>
          <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
            <div className="flex items-center mb-3">
              <Repeat className="w-4 h-4 text-gray-500 mr-2" />
              <label htmlFor="usageFrequency" className="block text-sm font-medium text-gray-700">
                Usos por Mes
              </label>
            </div>
            <input
              type="number"
              id="usageFrequency"
              name="usageFrequency"
              value={product.usageFrequency || 1}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
              min="1"
              required
            />
          </div>
        </div>
        
        <button
          type="submit"
          className="w-full flex items-center justify-center px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          <PlusCircle className="w-5 h-5 mr-2" />
          Agregar Producto
        </button>
      </form>
    </div>
  );
};

export default ProductForm;