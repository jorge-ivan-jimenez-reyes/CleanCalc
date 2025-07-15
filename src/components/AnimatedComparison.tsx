import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ExpenseSummary } from '../types';
import { formatCurrency, formatNumber } from '../utils/calculator';
import { DollarSign, Droplet, Clock, TrendingDown, Award, Sparkles, ArrowRight, CheckCircle } from 'lucide-react';

interface AnimatedComparisonProps {
  expenseSummary: ExpenseSummary;
  onRestart: () => void;
}

const AnimatedComparison: React.FC<AnimatedComparisonProps> = ({ expenseSummary, onRestart }) => {
  const [activeComparison, setActiveComparison] = useState<'money' | 'water' | 'time' | 'summary'>('money');
  const [showSummary, setShowSummary] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setShowSummary(true), 2000);
    return () => clearTimeout(timer);
  }, []);

  const comparisons = [
    {
      id: 'money' as const,
      title: 'Ahorro Económico',
      icon: <DollarSign className="w-6 h-6" />,
      traditional: expenseSummary.yearlyExpense,
      geco: expenseSummary.gecoYearlyExpense,
      savings: expenseSummary.savedMoney,
      color: 'green',
      unit: '$',
      description: 'Gasto anual en productos de lavandería'
    },
    {
      id: 'water' as const,
      title: 'Consumo de Agua',
      icon: <Droplet className="w-6 h-6" />,
      traditional: expenseSummary.yearlyWaterUsage,
      geco: expenseSummary.gecoYearlyWaterUsage,
      savings: expenseSummary.savedWater,
      color: 'blue',
      unit: 'L',
      description: 'Litros de agua usados por año'
    },
    {
      id: 'time' as const,
      title: 'Tiempo Invertido',
      icon: <Clock className="w-6 h-6" />,
      traditional: expenseSummary.yearlyTimeSpent,
      geco: expenseSummary.gecoYearlyTimeSpent,
      savings: expenseSummary.savedTime,
      color: 'purple',
      unit: 'hrs',
      description: 'Horas dedicadas al lavado por año'
    }
  ];

  const getColorClasses = (color: string, type: 'bg' | 'text' | 'border') => {
    const colors = {
      green: {
        bg: 'bg-green-500',
        text: 'text-green-600',
        border: 'border-green-500'
      },
      blue: {
        bg: 'bg-blue-500',
        text: 'text-blue-600',
        border: 'border-blue-500'
      },
      purple: {
        bg: 'bg-purple-500',
        text: 'text-purple-600',
        border: 'border-purple-500'
      }
    };
    return colors[color as keyof typeof colors][type];
  };

  const BarChart = ({ comparison }: { comparison: typeof comparisons[0] }) => {
    const maxValue = Math.max(comparison.traditional, comparison.geco);
    const traditionalPercentage = (comparison.traditional / maxValue) * 100;
    const gecoPercentage = (comparison.geco / maxValue) * 100;
    const savingsPercentage = comparison.traditional > 0 ? (comparison.savings / comparison.traditional) * 100 : 0;

    return (
      <div className="space-y-6">
        <div className="text-center">
          <h3 className="text-2xl font-bold text-gray-800 mb-2">{comparison.title}</h3>
          <p className="text-gray-600">{comparison.description}</p>
        </div>

        <div className="space-y-4">
          {/* Productos Tradicionales */}
          <div className="bg-red-50 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="font-medium text-gray-700">Productos Tradicionales</span>
              <span className="font-bold text-red-600">
                {comparison.traditional.toLocaleString()} {comparison.unit}
              </span>
            </div>
            <div className="w-full bg-red-200 rounded-full h-8 relative overflow-hidden">
              <motion.div
                className="bg-red-500 h-8 rounded-full flex items-center justify-end pr-3"
                initial={{ width: 0 }}
                animate={{ width: `${traditionalPercentage}%` }}
                transition={{ duration: 1.5, ease: "easeOut" }}
              >
                <span className="text-white font-bold text-sm">100%</span>
              </motion.div>
            </div>
          </div>

          {/* GECO */}
          <div className="bg-teal-50 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center">
                <span className="font-medium text-gray-700 mr-2">GECO</span>
                <Sparkles className="w-4 h-4 text-teal-500" />
              </div>
              <span className="font-bold text-teal-600">
                {comparison.geco.toLocaleString()} {comparison.unit}
              </span>
            </div>
            <div className="w-full bg-teal-200 rounded-full h-8 relative overflow-hidden">
              <motion.div
                className="bg-teal-500 h-8 rounded-full flex items-center justify-end pr-3"
                initial={{ width: 0 }}
                animate={{ width: `${gecoPercentage}%` }}
                transition={{ duration: 1.5, ease: "easeOut", delay: 0.5 }}
              >
                <span className="text-white font-bold text-sm">
                  {(100 - savingsPercentage).toFixed(0)}%
                </span>
              </motion.div>
            </div>
          </div>

          {/* Ahorro */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 1, duration: 0.5 }}
            className={`bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg p-6 text-white text-center`}
          >
            <TrendingDown className="w-8 h-8 mx-auto mb-2" />
            <p className="text-sm mb-1">Tu ahorro anual</p>
            <p className="text-3xl font-bold">
              {Math.max(0, comparison.savings).toLocaleString()} {comparison.unit}
            </p>
            <p className="text-sm mt-1">
              ¡{savingsPercentage.toFixed(0)}% menos que antes!
            </p>
          </motion.div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl font-bold text-gray-800 mb-4">
            Comparación <span className="text-teal-600">Detallada</span>
          </h1>
          <p className="text-xl text-gray-600">
            Descubre las ventajas de GECO en cada aspecto
          </p>
        </motion.div>

        {/* Navegación de pestañas */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="flex flex-wrap justify-center gap-4 mb-8"
        >
          {comparisons.map((comparison, index) => (
            <button
              key={comparison.id}
              onClick={() => setActiveComparison(comparison.id)}
              className={`flex items-center space-x-2 px-6 py-3 rounded-full font-medium transition-all ${
                activeComparison === comparison.id
                  ? `${getColorClasses(comparison.color, 'bg')} text-white shadow-lg`
                  : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'
              }`}
            >
              <span className={activeComparison === comparison.id ? 'text-white' : getColorClasses(comparison.color, 'text')}>
                {comparison.icon}
              </span>
              <span>{comparison.title}</span>
            </button>
          ))}
          <button
            onClick={() => setActiveComparison('summary')}
            className={`flex items-center space-x-2 px-6 py-3 rounded-full font-medium transition-all ${
              activeComparison === 'summary'
                ? 'bg-gradient-to-r from-teal-500 to-blue-500 text-white shadow-lg'
                : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'
            }`}
          >
            <Award className="w-5 h-5" />
            <span>Resumen</span>
          </button>
        </motion.div>

        {/* Contenido principal */}
        <AnimatePresence mode="wait">
          {activeComparison !== 'summary' ? (
            <motion.div
              key={activeComparison}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="bg-white rounded-2xl shadow-xl p-8"
            >
              <BarChart comparison={comparisons.find(c => c.id === activeComparison)!} />
            </motion.div>
          ) : (
            <motion.div
              key="summary"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.1 }}
              transition={{ duration: 0.5 }}
              className="space-y-8"
            >
              {/* Resumen de ahorros */}
              <div className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl shadow-xl p-8 text-white text-center">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.3, type: "spring", bounce: 0.5 }}
                >
                  <Award className="w-16 h-16 mx-auto mb-4" />
                  <h2 className="text-3xl font-bold mb-4">¡Felicidades!</h2>
                  <p className="text-xl mb-6">
                    Con GECO puedes ahorrar anualmente:
                  </p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {comparisons.map((comparison, index) => (
                      <motion.div
                        key={comparison.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 + index * 0.1 }}
                        className="bg-white/20 backdrop-blur-sm rounded-xl p-4"
                      >
                        <div className="text-white/80 mb-2">{comparison.icon}</div>
                        <p className="text-2xl font-bold">
                          {Math.max(0, comparison.savings).toLocaleString()} {comparison.unit}
                        </p>
                        <p className="text-sm text-white/80">{comparison.title}</p>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              </div>

              {/* Beneficios adicionales */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.7 }}
                  className="bg-white rounded-xl shadow-lg p-6"
                >
                  <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                    <CheckCircle className="w-6 h-6 text-green-500 mr-2" />
                    Beneficios de GECO
                  </h3>
                  <ul className="space-y-3">
                                         {[
                       'Sistema todo-en-uno (detergente + aroma + desinfección)',
                       'Solo 2 pastillas por carga',
                       'Fórmula eco-friendly',
                       'Reduce tiempo de lavado',
                       'Menor consumo de agua',
                       'Más económico a largo plazo'
                     ].map((benefit, index) => (
                      <motion.li
                        key={index}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.8 + index * 0.1 }}
                        className="flex items-center text-gray-700"
                      >
                        <CheckCircle className="w-4 h-4 text-green-500 mr-3 flex-shrink-0" />
                        {benefit}
                      </motion.li>
                    ))}
                  </ul>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.9 }}
                  className="bg-white rounded-xl shadow-lg p-6"
                >
                  <h3 className="text-xl font-bold text-gray-800 mb-4">
                    Impacto en 5 años
                  </h3>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                      <span className="text-gray-700">Ahorro total:</span>
                      <span className="font-bold text-green-600">
                        {formatCurrency(Math.max(0, expenseSummary.savedMoney) * 5)}
                      </span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
                      <span className="text-gray-700">Agua ahorrada:</span>
                      <span className="font-bold text-blue-600">
                        {formatNumber(Math.max(0, expenseSummary.savedWater) * 5, 'litros')}
                      </span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-purple-50 rounded-lg">
                      <span className="text-gray-700">Tiempo ahorrado:</span>
                      <span className="font-bold text-purple-600">
                        {formatNumber(Math.max(0, expenseSummary.savedTime) * 5, 'horas')}
                      </span>
                    </div>
                  </div>
                </motion.div>
              </div>

              {/* Call to action */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.2 }}
                className="text-center"
              >
                <div className="bg-gradient-to-r from-teal-500 to-blue-500 rounded-2xl p-8 text-white">
                  <h3 className="text-2xl font-bold mb-4">
                    ¿Listo para hacer el cambio?
                  </h3>
                  <p className="text-lg mb-6">
                    Únete a la revolución del lavado inteligente
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <button
                      onClick={onRestart}
                      className="bg-white text-teal-600 font-bold py-3 px-6 rounded-xl hover:bg-gray-100 transition-colors"
                    >
                      Calcular de Nuevo
                    </button>
                    <button className="bg-teal-600 text-white font-bold py-3 px-6 rounded-xl hover:bg-teal-700 transition-colors flex items-center justify-center">
                      Conocer más sobre GECO
                      <ArrowRight className="w-5 h-5 ml-2" />
                    </button>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default AnimatedComparison; 