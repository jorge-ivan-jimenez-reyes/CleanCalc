import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { LaundryStats } from '../types';

interface LaundryStatsFormProps {
  onStatsUpdate: (stats: LaundryStats) => void;
}

const LaundryStatsForm: React.FC<LaundryStatsFormProps> = ({ onStatsUpdate }) => {
  const [stats, setStats] = useState<LaundryStats>({
    loadsPerWeek: 3,
    timePerLoad: 80,
    waterPerLoad: 95
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const newStats = { ...stats, [name]: parseInt(value) || 0 };
    setStats(newStats);
    onStatsUpdate(newStats);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <p className="text-sm text-gray-400 mb-6">Esto nos ayuda a calcular tu consumo actual</p>

      <div className="mb-8">
        <label htmlFor="loadsPerWeek" className="block text-sm font-medium text-gray-700 mb-2">
          Cargas de lavado por semana
        </label>
        <input
          type="number"
          id="loadsPerWeek"
          name="loadsPerWeek"
          value={stats.loadsPerWeek}
          onChange={handleChange}
          min="1"
          className="w-full max-w-[160px] px-4 py-3 border border-gray-200 rounded-lg text-2xl font-bold text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition-all"
        />
      </div>

      <div className="flex gap-12 text-sm">
        <div>
          <p className="text-gray-400 mb-1">Tiempo por carga</p>
          <p className="text-lg font-semibold text-gray-900">80 min</p>
        </div>
        <div>
          <p className="text-gray-400 mb-1">Agua por carga</p>
          <p className="text-lg font-semibold text-gray-900">95 L</p>
        </div>
      </div>
    </motion.div>
  );
};

export default LaundryStatsForm;
