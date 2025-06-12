import React, { useState } from 'react';
import { LaundryStats } from '../types';
import { WashingMachine } from 'lucide-react';

interface LaundryStatsFormProps {
  onStatsUpdate: (stats: LaundryStats) => void;
}

const LaundryStatsForm: React.FC<LaundryStatsFormProps> = ({ onStatsUpdate }) => {
  const [stats, setStats] = useState<LaundryStats>({
    loadsPerWeek: 3,
    timePerLoad: 80, // Fijo en 80 minutos
    waterPerLoad: 95 // Fijo en 95 litros
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
    <div className="bg-white rounded-lg shadow-sm p-4 transition-all hover:shadow-md border border-gray-100">
      <div className="flex items-center mb-4">
        <div className="bg-teal-100 p-2 rounded-full mr-3">
          <WashingMachine className="w-5 h-5 text-teal-600" />
        </div>
        <h2 className="text-lg font-semibold text-gray-800">Hábitos de Lavado</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-gray-50 p-3 rounded-lg border border-gray-100">
          <div className="flex items-center mb-2">
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
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 bg-white text-sm"
          />
          <p className="text-xs text-gray-500 mt-1 italic">
            ¿Cuántas veces lavas ropa a la semana?
          </p>
        </div>

        <div className="bg-gray-50 p-3 rounded-lg border border-gray-100">
          <div className="text-sm font-medium text-gray-700 mb-2">
            Tiempo por Carga
          </div>
          <div className="text-lg font-semibold text-gray-800">80 minutos</div>
          <p className="text-xs text-gray-500 mt-1 italic">
            Tiempo fijo establecido
          </p>
        </div>

        <div className="bg-gray-50 p-3 rounded-lg border border-gray-100">
          <div className="text-sm font-medium text-gray-700 mb-2">
            Agua por Carga
          </div>
          <div className="text-lg font-semibold text-gray-800">95 litros</div>
          <p className="text-xs text-gray-500 mt-1 italic">
            Consumo promedio establecido
          </p>
        </div>
      </div>
    </div>
  );
};

export default LaundryStatsForm;