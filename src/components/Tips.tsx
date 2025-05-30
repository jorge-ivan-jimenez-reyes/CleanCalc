import React from 'react';
import { Lightbulb } from 'lucide-react';

const Tips: React.FC = () => {
  const tips = [
    {
      title: "GECO: La Solución Eficiente",
      description: "GECO te permite reducir tus gastos en productos de limpieza hasta un 50%, además de ahorrar tiempo y agua."
    },
    {
      title: "Compra a Granel",
      description: "Adquiere cantidades mayores de productos de limpieza para reducir el costo por uso."
    },
    {
      title: "Limpiadores Ecológicos",
      description: "Crea tus propias soluciones de limpieza con ingredientes como vinagre, bicarbonato y aceites esenciales."
    },
    {
      title: "Productos Concentrados",
      description: "Las fórmulas concentradas suelen requerir menos producto por uso y duran más tiempo."
    }
  ];

  return (
    <div className="bg-white rounded-xl shadow-md p-6">
      <div className="flex items-center mb-4">
        <Lightbulb className="w-5 h-5 text-amber-500 mr-2" />
        <h2 className="text-xl font-semibold text-gray-800">Consejos para Ahorrar</h2>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {tips.map((tip, index) => (
          <div key={index} className={`border border-gray-100 rounded-lg p-4 hover:shadow-sm transition-shadow duration-200 ${index === 0 ? 'bg-teal-50 md:col-span-2' : ''}`}>
            <h3 className="font-medium text-teal-700 mb-2">{tip.title}</h3>
            <p className="text-sm text-gray-600">{tip.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Tips;