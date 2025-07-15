import React, { useState, useEffect, useRef } from 'react';
import { Product, productDurations } from '../types';
import { PlusCircle, Search, Package, DollarSign, Timer, Filter, AlertCircle } from 'lucide-react';
import { commonProducts, ProductDatabase } from '../data/products';
import { loadAllExternalProducts, loadLocalCSVFiles } from '../utils/csvLoader';

interface ProductFormProps {
  onAddProduct: (product: Product) => void;
}

const ProductForm: React.FC<ProductFormProps> = ({ onAddProduct }) => {
  const [showProductList, setShowProductList] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedBrand, setSelectedBrand] = useState<string>('all');
  const [externalProducts, setExternalProducts] = useState<ProductDatabase[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isProductSelected, setIsProductSelected] = useState(false);
  const [product, setProduct] = useState<Omit<Product, 'id'>>({
    name: '',
    price: 0,
    quantity: 1,
    usageFrequency: 1,
    category: 'detergent',
    duration: '1month',
  });
  
  const productListRef = useRef<HTMLDivElement>(null);

  // Cargar productos desde archivos CSV externos
  useEffect(() => {
    const loadProducts = async () => {
      setLoading(true);
      setError(null);
      
      try {
        // Intentar cargar productos externos
        console.log('Cargando productos desde archivos CSV externos...');
        const products = await loadAllExternalProducts();
        
        if (products.length > 0) {
          console.log(`Cargados ${products.length} productos externos con éxito.`);
          setExternalProducts(products);
        } else {
          // Intentar cargar desde archivos locales como respaldo
          console.log('No se pudieron cargar productos externos. Intentando respaldo...');
          const localProducts = await loadLocalCSVFiles();
          
          if (localProducts.length > 0) {
            console.log(`Cargados ${localProducts.length} productos locales como respaldo.`);
            setExternalProducts(localProducts);
          } else {
            // Usar productos predefinidos como último recurso
            console.log('Usando productos predefinidos como último recurso.');
            setExternalProducts(commonProducts);
          }
        }
      } catch (err) {
        console.error('Error al cargar productos:', err);
        setError('No se pudieron cargar los productos. Usando datos predefinidos.');
        setExternalProducts(commonProducts);
      } finally {
        setLoading(false);
      }
    };
    
    loadProducts();
  }, []);
  
  // Cerrar el buscador al hacer click fuera
  useEffect(() => {
    if (!showProductList) return;
    const handleClickOutside = (event: MouseEvent) => {
      if (productListRef.current && !productListRef.current.contains(event.target as Node)) {
        setShowProductList(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showProductList]);
  
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
      setIsProductSelected(false);
      setSearchTerm('');
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

  const getRealisticDuration = (productData: ProductDatabase): string => {
    const { category, size, unit } = productData;
    
    // Calcular duración basada en tamaño y categoría
    if (category === 'detergent') {
      // Detergentes: ~50ml por carga, 3 cargas/semana
      const mlPerWeek = 50 * 3; // 150ml por semana
      const totalMl = unit === 'L' ? size * 1000 : size;
      const weeks = totalMl / mlPerWeek;
      
      if (weeks <= 2) return '2weeks';
      if (weeks <= 6) return '1month';
      if (weeks <= 10) return '2months';
      if (weeks <= 18) return '3months';
      if (weeks <= 30) return '6months';
      return '1year';
    }
    
    if (category === 'softener') {
      // Suavizantes: ~30ml por carga
      const mlPerWeek = 30 * 3; // 90ml por semana
      const totalMl = unit === 'L' ? size * 1000 : size;
      const weeks = totalMl / mlPerWeek;
      
      if (weeks <= 3) return '2weeks';
      if (weeks <= 8) return '1month';
      if (weeks <= 12) return '2months';
      if (weeks <= 20) return '3months';
      if (weeks <= 35) return '6months';
      return '1year';
    }
    
    if (category === 'disinfectant') {
      // Desinfectantes: ~20ml por carga
      const mlPerWeek = 20 * 3; // 60ml por semana
      const totalMl = unit === 'L' ? size * 1000 : size;
      const weeks = totalMl / mlPerWeek;
      
      if (weeks <= 4) return '1month';
      if (weeks <= 10) return '2months';
      if (weeks <= 18) return '3months';
      if (weeks <= 30) return '6months';
      return '1year';
    }
    
    if (category === 'enhancer') {
      // Potenciadores: cantidad variable según tipo
      if (unit === 'kg') {
        // Perlas: ~10g por carga
        const gPerWeek = 10 * 3; // 30g por semana
        const totalG = size * 1000;
        const weeks = totalG / gPerWeek;
        
        if (weeks <= 6) return '1month';
        if (weeks <= 12) return '2months';
        if (weeks <= 20) return '3months';
        return '6months';
      } else if (unit === 'piezas') {
        // Cápsulas: 1 por carga
        const weeks = size / 3; // 3 cargas por semana
        
        if (weeks <= 2) return '2weeks';
        if (weeks <= 6) return '1month';
        if (weeks <= 10) return '2months';
        return '3months';
      }
    }
    
    return '1month'; // fallback
  };

  const handleProductSelect = (selectedProduct: ProductDatabase) => {
    setProduct(prev => ({
      ...prev,
      name: `${selectedProduct.brand} ${selectedProduct.name} - ${selectedProduct.type} ${selectedProduct.size}${selectedProduct.unit}`,
      price: selectedProduct.price,
      category: selectedProduct.category,
      duration: getRealisticDuration(selectedProduct),
      brand: selectedProduct.brand,
      type: selectedProduct.type,
      size: selectedProduct.size,
      unit: selectedProduct.unit,
    }));
    setShowProductList(false);
    setIsProductSelected(true);
    setSearchTerm(`${selectedProduct.brand} ${selectedProduct.name}`);
  };

  // Productos a mostrar: externos o predefinidos
  const productsToUse = externalProducts.length > 0 ? externalProducts : commonProducts;

  // Obtener todas las marcas únicas para el filtro
  const allBrands = Array.from(new Set(productsToUse.map(product => product.brand)));

  // Agrupar productos por marca y tipo
  const groupedProducts = productsToUse.reduce((acc, product) => {
    const key = `${product.brand}-${product.name}`;
    if (!acc[key]) {
      acc[key] = [];
    }
    acc[key].push(product);
    return acc;
  }, {} as Record<string, ProductDatabase[]>);

  // Filtrar grupos por término de búsqueda, categoría y marca seleccionada
  const filteredGroups = Object.entries(groupedProducts)
    .filter(([key, products]) => {
      const [brand, name] = key.split('-');
      
      // Filtrar por término de búsqueda
      const matchesSearch = searchTerm.length === 0 || 
        `${brand} ${name}`.toLowerCase().includes(searchTerm.toLowerCase());
      
      // Filtrar por categoría
      const matchesCategory = selectedCategory === 'all' || 
        products.some(p => p.category === selectedCategory);
      
      // Filtrar por marca
      const matchesBrand = selectedBrand === 'all' || brand === selectedBrand;
      
      return matchesSearch && matchesCategory && matchesBrand;
    })
    .reduce((acc, [key, products]) => {
      // Si hay filtro de categoría, filtrar productos dentro del grupo
      if (selectedCategory !== 'all') {
        const filteredProducts = products.filter(p => p.category === selectedCategory);
        if (filteredProducts.length > 0) {
          acc[key] = filteredProducts;
        }
      } else {
        acc[key] = products;
      }
      return acc;
    }, {} as Record<string, ProductDatabase[]>);

  return (
    <div className="bg-white rounded-lg shadow-sm p-4 transition-all hover:shadow-md border border-gray-100">
      <div className="flex items-center mb-4">
        <div className="bg-blue-100 p-2 rounded-full mr-3">
          <Package className="w-5 h-5 text-blue-600" />
        </div>
        <h2 className="text-lg font-semibold text-gray-800">Agregar Nuevo Producto</h2>
      </div>
      
      {loading && (
        <div className="bg-blue-50 p-2 rounded-md mb-3 text-center text-xs text-blue-600">
          <div className="animate-pulse">Cargando productos...</div>
        </div>
      )}
      
      {error && (
        <div className="bg-amber-50 p-2 rounded-md mb-3 flex items-start text-xs">
          <AlertCircle className="w-3.5 h-3.5 text-amber-500 mr-1.5 mt-0.5 flex-shrink-0" />
          <p className="text-amber-700">{error}</p>
        </div>
      )}
      
      <div className="mb-4">
        <div className="relative">
          <input
            type="text"
            placeholder="Buscar productos (ej. MAS, PERSIL, ACE...)..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onFocus={() => setShowProductList(true)}
            className="w-full px-4 py-2 pl-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50 text-sm"
          />
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
        </div>
        
        {showProductList && (
          <div ref={productListRef} className="absolute z-10 mt-1 w-full max-w-2xl bg-white rounded-lg shadow-xl border border-gray-200">
            <div className="flex border-b border-gray-100 p-2 bg-gray-50">
              <div className="flex items-center">
                <Filter className="h-3.5 w-3.5 text-gray-500 mr-1.5" />
                <span className="text-xs text-gray-600 mr-2">Filtros:</span>
              </div>
              
              <select 
                value={selectedCategory} 
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="text-xs border border-gray-200 rounded px-2 py-1 mr-2 bg-white"
              >
                <option value="all">Todas las categorías</option>
                <option value="detergent">Detergentes</option>
                <option value="softener">Suavizantes</option>
                <option value="disinfectant">Desinfectantes</option>
                <option value="enhancer">Potenciadores</option>
              </select>
              
              <select 
                value={selectedBrand} 
                onChange={(e) => setSelectedBrand(e.target.value)}
                className="text-xs border border-gray-200 rounded px-2 py-1 bg-white"
              >
                <option value="all">Todas las marcas</option>
                {allBrands.map((brand) => (
                  <option key={brand} value={brand}>{brand}</option>
                ))}
              </select>
            </div>
            
            <div className="max-h-64 overflow-auto">
              {!loading && Object.entries(filteredGroups).map(([key, products]) => (
                <div key={key} className="border-b border-gray-100 py-2 px-3 hover:bg-gray-50">
                  <div className="font-medium text-gray-800 flex items-center text-sm">
                    <span className="px-1.5 py-0.5 rounded bg-blue-100 text-blue-800 text-xxs mr-2">{products[0].brand}</span>
                    <span>{products[0].name}</span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 mt-1.5">
                    {products.map((p, idx) => (
                      <button
                        key={idx}
                        onClick={() => handleProductSelect(p)}
                        className="text-left px-2 py-1.5 text-xs rounded-md bg-white border border-gray-100 hover:border-blue-200 hover:bg-blue-50 transition-colors"
                      >
                        <div className="flex justify-between">
                          <span className="font-medium">{p.type}</span>
                          <span className="text-blue-600 font-medium">${p.price.toFixed(2)}</span>
                        </div>
                        <div className="text-xxs text-gray-500">{p.size} {p.unit} - {getCategoryLabel(p.category)}</div>
                      </button>
                    ))}
                  </div>
                </div>
              ))}
              
              {!loading && Object.keys(filteredGroups).length === 0 && (
                <div className="py-3 px-3 text-gray-500 text-center text-sm">
                  <Search className="h-6 w-6 mx-auto text-gray-300 mb-1" />
                  No se encontraron productos. Intenta con otro término o filtro.
                </div>
              )}
              
              {loading && (
                <div className="py-8 px-3 text-gray-500 text-center">
                  <div className="animate-spin h-8 w-8 border-4 border-blue-200 border-t-blue-600 rounded-full mx-auto mb-2"></div>
                  <p className="text-sm">Cargando productos...</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Mostrar el formulario solo si ya se seleccionó un producto */}
      {isProductSelected && (
        <>
          <div className="flex items-center mb-2">
            <span className="text-sm font-medium text-gray-700 mr-2">Producto seleccionado:</span>
            <span className="px-2 py-1 rounded bg-blue-100 text-blue-800 text-xs font-semibold mr-2">{product.name}</span>
            <button
              type="button"
              onClick={() => { setIsProductSelected(false); setShowProductList(true); }}
              className="ml-2 px-2 py-1 text-xs bg-gray-200 hover:bg-blue-200 text-gray-700 rounded transition-colors"
            >
              Cambiar producto
            </button>
          </div>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="bg-gray-50 p-3 rounded-md border border-gray-100">
                <div className="flex items-center mb-2">
                  <Package className="w-3.5 h-3.5 text-gray-500 mr-1.5" />
                  <label htmlFor="name" className="block text-xs font-medium text-gray-700">
                    Nombre del Producto
                  </label>
                </div>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={product.name}
                  onChange={handleChange}
                  className="w-full px-2.5 py-1.5 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                  placeholder="ej., MAS Original"
                  required
                />
              </div>
              <div className="bg-gray-50 p-3 rounded-md border border-gray-100">
                <div className="flex items-center mb-2">
                  <Search className="w-3.5 h-3.5 text-gray-500 mr-1.5" />
                  <label htmlFor="category" className="block text-xs font-medium text-gray-700">
                    Categoría
                  </label>
                </div>
                <select
                  id="category"
                  name="category"
                  value={product.category}
                  onChange={handleChange}
                  className="w-full px-2.5 py-1.5 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                >
                  <option value="detergent">Detergente</option>
                  <option value="softener">Suavizante</option>
                  <option value="disinfectant">Desinfectante</option>
                  <option value="enhancer">Potenciador de Aroma</option>
                </select>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="bg-gray-50 p-3 rounded-md border border-gray-100">
                <div className="flex items-center mb-2">
                  <DollarSign className="w-3.5 h-3.5 text-gray-500 mr-1.5" />
                  <label htmlFor="price" className="block text-xs font-medium text-gray-700">
                    Precio ($)
                  </label>
                </div>
                <input
                  type="number"
                  id="price"
                  name="price"
                  value={product.price || ''}
                  onChange={handleChange}
                  disabled={isProductSelected}
                  className={`w-full px-2.5 py-1.5 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    isProductSelected ? 'bg-gray-100 cursor-not-allowed' : 'bg-white'
                  }`}
                  min="0.01"
                  step="0.01"
                  placeholder="0.00"
                  required
                />
                {isProductSelected && (
                  <p className="text-xs text-gray-500 mt-1">Precio fijo del producto seleccionado</p>
                )}
              </div>
              <div className="bg-gray-50 p-3 rounded-md border border-gray-100">
                <div className="flex items-center mb-2">
                  <Timer className="w-3.5 h-3.5 text-gray-500 mr-1.5" />
                  <label htmlFor="duration" className="block text-xs font-medium text-gray-700">
                    ¿Cuánto te dura el producto?
                  </label>
                </div>
                <select
                  id="duration"
                  name="duration"
                  value={product.duration}
                  onChange={handleChange}
                  className="w-full px-2.5 py-1.5 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
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
            <div className="flex justify-end">
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 transition-colors flex items-center text-sm"
              >
                <PlusCircle className="w-4 h-4 mr-2" />
                Agregar Producto
              </button>
            </div>
          </form>
        </>
      )}
    </div>
  );
};

// Helper function to convertir categoría a etiqueta en español
const getCategoryLabel = (category: string): string => {
  switch (category) {
    case 'detergent': return 'Detergente';
    case 'softener': return 'Suavizante';
    case 'disinfectant': return 'Desinfectante';
    case 'enhancer': return 'Potenciador';
    default: return category;
  }
};

export default ProductForm;