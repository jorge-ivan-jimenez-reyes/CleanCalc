import React, { useState } from 'react';
import { Product, productDurations } from '../types';
import { PlusCircle, Search } from 'lucide-react';
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
    <div className="bg-white rounded-xl shadow-md p-6 mb-8 transition-all hover:shadow-lg">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">Agregar Nuevo Producto</h2>
      
      <div className="mb-6">
        <div className="relative">
          <input
            type="text"
            placeholder="Buscar productos (ej. MAS, PERSIL, ACE...)..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onFocus={() => setShowProductList(true)}
            className="w-full px-3 py-2 pl-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
          />
          <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
        </div>
        
        {showProductList && (
          <div className="absolute z-10 mt-1 w-full max-w-2xl bg-white rounded-lg shadow-lg border border-gray-200">
            <div className="max-h-60 overflow-auto">
              {Object.entries(filteredGroups).map(([key, products]) => (
                <div key={key} className="border-b border-gray-100 py-2 px-4">
                  <div className="font-medium text-gray-800">{products[0].brand} {products[0].name}</div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-1 mt-1">
                    {products.map((p, idx) => (
                      <button
                        key={idx}
                        onClick={() => handleProductSelect(p)}
                        className="text-left px-2 py-1 text-sm rounded hover:bg-gray-50 focus:bg-gray-50 focus:outline-none"
                      >
                        <span className="font-medium">{p.type}</span> • {p.size}{p.unit} • ${p.price.toFixed(2)}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
              {Object.keys(filteredGroups).length === 0 && (
                <div className="py-2 px-4 text-gray-500">
                  No se encontraron productos. Intenta con otro término.
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
              Nombre del Producto
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={product.name}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
              placeholder="ej., MAS Original"
              required
            />
          </div>
          <div>
            <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
              Categoría
            </label>
            <select
              id="category"
              name="category"
              value={product.category}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
            >
              <option value="detergent">Detergente</option>
              <option value="softener">Suavizante</option>
              <option value="disinfectant">Desinfectante</option>
              <option value="enhancer">Potenciador de Aroma</option>
            </select>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-1">
              Precio ($)
            </label>
            <input
              type="number"
              id="price"
              name="price"
              value={product.price || ''}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
              min="0.01"
              step="0.01"
              placeholder="0.00"
              required
            />
          </div>
          <div>
            <label htmlFor="duration" className="block text-sm font-medium text-gray-700 mb-1">
              ¿Cuánto te dura el producto?
            </label>
            <select
              id="duration"
              name="duration"
              value={product.duration}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
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
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="quantity" className="block text-sm font-medium text-gray-700 mb-1">
              Usos por Envase
            </label>
            <input
              type="number"
              id="quantity"
              name="quantity"
              value={product.quantity || 1}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
              min="1"
              required
            />
          </div>
          <div>
            <label htmlFor="usageFrequency" className="block text-sm font-medium text-gray-700 mb-1">
              Usos por Mes
            </label>
            <input
              type="number"
              id="usageFrequency"
              name="usageFrequency"
              value={product.usageFrequency || 1}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
              min="1"
              required
            />
          </div>
        </div>
        
        <button
          type="submit"
          className="w-full flex items-center justify-center px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500"
        >
          <PlusCircle className="w-5 h-5 mr-2" />
          Agregar Producto
        </button>
      </form>
    </div>
  );
};

export default ProductForm;