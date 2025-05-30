import React from 'react';
import { Lightbulb, WashingMachine, Droplet, DollarSign, Package } from 'lucide-react';

const Tips: React.FC = () => {
  const tips = [
    {
      title: "GECO: La Solución Eficiente",
      description: "GECO te permite reducir tus gastos en productos de limpieza hasta un 50%, además de ahorrar tiempo y agua.",
      icon: <WashingMachine className="w-10 h-10 text-teal-500 mb-3" />,
      color: "bg-teal-50 border-teal-100",
      textColor: "text-teal-700"
    },
    {
      title: "Compra a Granel",
      description: "Adquiere cantidades mayores de productos de limpieza para reducir el costo por uso.",
      icon: <Package className="w-10 h-10 text-blue-500 mb-3" />,
      color: "bg-blue-50 border-blue-100",
      textColor: "text-blue-700"
    },
    {
      title: "Limpiadores Ecológicos",
      description: "Crea tus propias soluciones de limpieza con ingredientes como vinagre, bicarbonato y aceites esenciales.",
      icon: <Droplet className="w-10 h-10 text-green-500 mb-3" />,
      color: "bg-green-50 border-green-100",
      textColor: "text-green-700"
    },
    {
      title: "Productos Concentrados",
      description: "Las fórmulas concentradas suelen requerir menos producto por uso y duran más tiempo.",
      icon: <DollarSign className="w-10 h-10 text-amber-500 mb-3" />,
      color: "bg-amber-50 border-amber-100",
      textColor: "text-amber-700"
    }
  ];

  return (
    <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100 transition-all hover:shadow-lg">
      <div className="flex items-center mb-6">
        <div className="bg-amber-100 p-2 rounded-full mr-3">
          <Lightbulb className="w-6 h-6 text-amber-600" />
        </div>
        <h2 className="text-xl font-semibold text-gray-800">Consejos para Ahorrar</h2>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {tips.map((tip, index) => (
          <div 
            key={index} 
            className={`${tip.color} border rounded-xl p-5 hover:shadow-sm transition-all duration-200 ${index === 0 ? 'md:col-span-2' : ''}`}
          >
            <div className="flex flex-col items-center text-center">
              {tip.icon}
              <h3 className={`font-semibold text-lg mb-2 ${tip.textColor}`}>{tip.title}</h3>
              <p className="text-sm text-gray-600">{tip.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Tips;