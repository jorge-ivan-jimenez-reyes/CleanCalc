import React, { useState } from 'react';
import { LaundryStats } from '../types';
import { WashingMachine, Droplets, Clock } from 'lucide-react';

interface LaundryStatsFormProps {
  onStatsUpdate: (stats: LaundryStats) => void;
}

const LaundryStatsForm: React.FC<LaundryStatsFormProps> = ({ onStatsUpdate }) => {
  const [stats, setStats] = useState<LaundryStats>({
    loadsPerWeek: 3,
    timePerLoad: 80, // 80 minutos por defecto (requisito)
    waterPerLoad: 60 // 60 litros por defecto (requisito)
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const newStats = {
      ...stats,
      [name]: parseInt(value) || 0
    };
    setStats(newStats);
    onStatsUpdate(newStats);
  };

  return (
    <div className="bg-white rounded-xl shadow-md p-6 transition-all hover:shadow-lg border border-gray-100">
      <div className="flex items-center mb-6">
        <div className="bg-teal-100 p-2 rounded-full mr-3">
          <WashingMachine className="w-6 h-6 text-teal-600" />
        </div>
        <h2 className="text-xl font-semibold text-gray-800">Hábitos de Lavado</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
          <div className="flex items-center mb-3">
            <WashingMachine className="w-4 h-4 text-teal-600 mr-2 opacity-70" />
            <label htmlFor="loadsPerWeek" className="block text-sm font-medium text-gray-700">
              Cargas por Semana
            </label>
          </div>
          <input
            type="number"
            id="loadsPerWeek"
            name="loadsPerWeek"
            value={stats.loadsPerWeek}
            onChange={handleChange}
            min="1"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 bg-white"
          />
          <p className="text-xs text-gray-500 mt-2 italic">
            ¿Cuántas veces lavas ropa a la semana?
          </p>
        </div>

        <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
          <div className="flex items-center mb-3">
            <Clock className="w-4 h-4 text-purple-600 mr-2 opacity-70" />
            <label htmlFor="timePerLoad" className="block text-sm font-medium text-gray-700">
              Minutos por Carga
            </label>
          </div>
          <input
            type="number"
            id="timePerLoad"
            name="timePerLoad"
            value={stats.timePerLoad}
            onChange={handleChange}
            min="30"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 bg-white"
          />
          <p className="text-xs text-gray-500 mt-2 italic">
            Tiempo promedio: 80 minutos
          </p>
        </div>

        <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
          <div className="flex items-center mb-3">
            <Droplets className="w-4 h-4 text-blue-600 mr-2 opacity-70" />
            <label htmlFor="waterPerLoad" className="block text-sm font-medium text-gray-700">
              Agua por Carga (Litros)
            </label>
          </div>
          <input
            type="number"
            id="waterPerLoad"
            name="waterPerLoad"
            value={stats.waterPerLoad}
            onChange={handleChange}
            min="20"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 bg-white"
          />
          <p className="text-xs text-gray-500 mt-2 italic">
            Consumo promedio: 60 litros
          </p>
        </div>
      </div>
    </div>
  );
};

export default LaundryStatsForm;