import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ExpenseSummary } from '../types';
import { formatCurrency, formatNumber } from '../utils/calculator';
import { DollarSign, Droplet, Clock, TrendingUp, Sparkles, ArrowDown, Zap } from 'lucide-react';

interface ResultsRevealProps {
  expenseSummary: ExpenseSummary;
  onContinue: () => void;
}

const ResultsReveal: React.FC<ResultsRevealProps> = ({ expenseSummary, onContinue }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [showGeco, setShowGeco] = useState(false);

  const steps = [
    'calculating',
    'current-expenses',
    'impact-reveal',
    'geco-intro',
    'savings-reveal'
  ];

  useEffect(() => {
    const timer = setTimeout(() => {
      if (currentStep < steps.length - 1) {
        setCurrentStep(currentStep + 1);
      }
    }, currentStep === 0 ? 2000 : currentStep === 1 ? 3000 : 2500);

    if (currentStep === 3) {
      setTimeout(() => setShowGeco(true), 1000);
    }

    return () => clearTimeout(timer);
  }, [currentStep]);

  const CounterAnimation = ({ value, prefix = '', suffix = '', duration = 2000 }: {
    value: number;
    prefix?: string;
    suffix?: string;
    duration?: number;
  }) => {
    const [count, setCount] = useState(0);

    useEffect(() => {
      const increment = value / (duration / 50);
      const timer = setInterval(() => {
        setCount(prev => {
          const next = prev + increment;
          if (next >= value) {
            clearInterval(timer);
            return value;
          }
          return next;
        });
      }, 50);

      return () => clearInterval(timer);
    }, [value, duration]);

    return (
      <span>
        {prefix}{Math.round(count).toLocaleString()}{suffix}
      </span>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-teal-900 flex items-center justify-center p-4">
      <div className="max-w-4xl w-full">
        <AnimatePresence mode="wait">
          {/* Paso 1: Calculando */}
          {currentStep === 0 && (
            <motion.div
              key="calculating"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.2 }}
              className="text-center text-white"
            >
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                className="w-20 h-20 border-4 border-teal-400 border-t-transparent rounded-full mx-auto mb-8"
              />
              <h2 className="text-3xl font-bold mb-4">Analizando tus gastos...</h2>
              <p className="text-xl text-gray-300">Calculando el impacto en tu economía</p>
            </motion.div>
          )}

          {/* Paso 2: Gastos actuales */}
          {currentStep >= 1 && (
            <motion.div
              key="current-expenses"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center text-white mb-8"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.8, type: "spring", bounce: 0.5 }}
                className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 mb-6"
              >
                <h2 className="text-2xl font-bold mb-6">Tus Gastos Actuales</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5, duration: 0.6 }}
                    className="bg-red-500/20 rounded-xl p-6"
                  >
                    <DollarSign className="w-8 h-8 text-red-400 mx-auto mb-3" />
                    <p className="text-sm text-gray-300 mb-2">Gasto Anual</p>
                    <p className="text-3xl font-bold text-red-400">
                      <CounterAnimation 
                        value={expenseSummary.yearlyExpense} 
                        prefix="$" 
                        duration={1500}
                      />
                    </p>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.7, duration: 0.6 }}
                    className="bg-blue-500/20 rounded-xl p-6"
                  >
                    <Droplet className="w-8 h-8 text-blue-400 mx-auto mb-3" />
                    <p className="text-sm text-gray-300 mb-2">Agua Anual</p>
                    <p className="text-3xl font-bold text-blue-400">
                      <CounterAnimation 
                        value={expenseSummary.yearlyWaterUsage} 
                        suffix=" L" 
                        duration={1500}
                      />
                    </p>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.9, duration: 0.6 }}
                    className="bg-purple-500/20 rounded-xl p-6"
                  >
                    <Clock className="w-8 h-8 text-purple-400 mx-auto mb-3" />
                    <p className="text-sm text-gray-300 mb-2">Tiempo Anual</p>
                    <p className="text-3xl font-bold text-purple-400">
                      <CounterAnimation 
                        value={expenseSummary.yearlyTimeSpent} 
                        suffix=" hrs" 
                        duration={1500}
                      />
                    </p>
                  </motion.div>
                </div>
              </motion.div>
            </motion.div>
          )}

          {/* Paso 3: Impacto revelado */}
          {currentStep >= 2 && (
            <motion.div
              key="impact"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8 }}
              className="text-center text-white mb-8"
            >
                             <motion.div
                 animate={{ 
                   scale: [1, 1.02, 1],
                   boxShadow: [
                     "0 0 0 0 rgba(239, 68, 68, 0.4)",
                     "0 0 0 10px rgba(239, 68, 68, 0)",
                     "0 0 0 0 rgba(239, 68, 68, 0)"
                   ]
                 }}
                 transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                 className="bg-red-500/20 backdrop-blur-sm rounded-2xl p-8 border border-red-500/30"
               >
                <TrendingUp className="w-16 h-16 text-red-400 mx-auto mb-4" />
                <h3 className="text-2xl font-bold text-red-400 mb-4">
                  ¡Esto es mucho dinero!
                </h3>
                <p className="text-lg text-gray-300">
                  En 5 años gastarías{' '}
                  <span className="text-3xl font-bold text-red-400">
                    {formatCurrency(expenseSummary.yearlyExpense * 5)}
                  </span>
                </p>
              </motion.div>
            </motion.div>
          )}

          {/* Paso 4: Introducción a GECO */}
          {currentStep >= 3 && (
            <motion.div
              key="geco-intro"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center text-white mb-8"
            >
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="mb-6"
              >
                <h3 className="text-xl text-gray-300 mb-4">Pero espera...</h3>
                <motion.h2
                  initial={{ scale: 0 }}
                  animate={{ scale: showGeco ? 1 : 0 }}
                  transition={{ type: "spring", bounce: 0.6, duration: 1 }}
                  className="text-4xl font-bold bg-gradient-to-r from-teal-400 to-blue-400 bg-clip-text text-transparent mb-4"
                >
                  ¿Y si hubiera una mejor opción?
                </motion.h2>
              </motion.div>

              <AnimatePresence>
                {showGeco && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0, rotateY: 180 }}
                    animate={{ opacity: 1, scale: 1, rotateY: 0 }}
                    transition={{ duration: 1, type: "spring", bounce: 0.4 }}
                    className="bg-gradient-to-br from-teal-500/20 to-blue-500/20 backdrop-blur-sm rounded-2xl p-8 border border-teal-500/30"
                  >
                                         <motion.div
                       animate={{ 
                         rotate: [0, 2, -2, 0],
                         scale: [1, 1.05, 1]
                       }}
                       transition={{ duration: 4, repeat: Infinity, repeatDelay: 2, ease: "easeInOut" }}
                       className="w-24 h-24 bg-gradient-to-br from-teal-400 to-blue-400 rounded-full flex items-center justify-center mx-auto mb-6"
                     >
                      <Sparkles className="w-12 h-12 text-white" />
                    </motion.div>
                    
                                         <h3 className="text-3xl font-bold text-teal-400 mb-4">
                       Conoce GECO
                     </h3>
                     <p className="text-lg text-gray-300 mb-4">
                       <strong className="text-teal-400">TODO EN UNO:</strong> detergente + suavizante + desinfectante + aroma
                     </p>
                     <p className="text-sm text-gray-400 mb-6">
                       ¡No necesitas comprar productos adicionales!
                     </p>
                    
                                         <div className="grid grid-cols-3 gap-4 text-sm">
                       <div className="text-center">
                         <Zap className="w-6 h-6 text-yellow-400 mx-auto mb-2" />
                         <p className="text-yellow-400">Todo incluido</p>
                         <p className="text-xs text-gray-400">2 tabletas/carga</p>
                       </div>
                       <div className="text-center">
                         <Droplet className="w-6 h-6 text-blue-400 mx-auto mb-2" />
                         <p className="text-blue-400">Eco-friendly</p>
                         <p className="text-xs text-gray-400">50% menos agua</p>
                       </div>
                       <div className="text-center">
                         <DollarSign className="w-6 h-6 text-green-400 mx-auto mb-2" />
                         <p className="text-green-400">Solo $10/carga</p>
                         <p className="text-xs text-gray-400">vs múltiples productos</p>
                       </div>
                     </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          )}

          {/* Paso 5: Revelación de ahorros */}
          {currentStep >= 4 && (
            <motion.div
              key="savings"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center text-white"
            >
                             <motion.div
                 animate={{ 
                   scale: [1, 1.01, 1],
                   boxShadow: [
                     "0 0 0 0 rgba(34, 197, 94, 0.3)",
                     "0 0 0 8px rgba(34, 197, 94, 0)",
                     "0 0 0 0 rgba(34, 197, 94, 0)"
                   ]
                 }}
                 transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                 className="bg-green-500/20 backdrop-blur-sm rounded-2xl p-8 border border-green-500/30 mb-8"
               >
                <h3 className="text-2xl font-bold text-green-400 mb-6">
                  ¡Mira cuánto puedes ahorrar con GECO!
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                  <motion.div
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.5, type: "spring", bounce: 0.5 }}
                    className="bg-green-600/30 rounded-xl p-6"
                  >
                    <ArrowDown className="w-8 h-8 text-green-400 mx-auto mb-3" />
                    <p className="text-sm text-gray-300 mb-2">Ahorro Anual</p>
                    <p className="text-3xl font-bold text-green-400">
                      <CounterAnimation 
                        value={Math.max(0, expenseSummary.savedMoney)} 
                        prefix="$" 
                        duration={2000}
                      />
                    </p>
                    <p className="text-xs text-green-300 mt-2">
                      {expenseSummary.yearlyExpense > 0 
                        ? `${((expenseSummary.savedMoney / expenseSummary.yearlyExpense) * 100).toFixed(0)}% menos`
                        : '0% menos'
                      }
                    </p>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.7, type: "spring", bounce: 0.5 }}
                    className="bg-blue-600/30 rounded-xl p-6"
                  >
                    <Droplet className="w-8 h-8 text-blue-400 mx-auto mb-3" />
                    <p className="text-sm text-gray-300 mb-2">Menos Agua</p>
                    <p className="text-3xl font-bold text-blue-400">
                      <CounterAnimation 
                        value={Math.max(0, expenseSummary.savedWater)} 
                        suffix=" L" 
                        duration={2000}
                      />
                    </p>
                    <p className="text-xs text-blue-300 mt-2">50% reducción</p>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.9, type: "spring", bounce: 0.5 }}
                    className="bg-purple-600/30 rounded-xl p-6"
                  >
                    <Clock className="w-8 h-8 text-purple-400 mx-auto mb-3" />
                    <p className="text-sm text-gray-300 mb-2">Tiempo Ahorrado</p>
                    <p className="text-3xl font-bold text-purple-400">
                      <CounterAnimation 
                        value={Math.max(0, expenseSummary.savedTime)} 
                        suffix=" hrs" 
                        duration={2000}
                      />
                    </p>
                    <p className="text-xs text-purple-300 mt-2">30 min menos por carga</p>
                  </motion.div>
                </div>

                <motion.button
                  onClick={onContinue}
                  className="bg-gradient-to-r from-teal-500 to-blue-500 text-white font-bold py-4 px-8 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.5 }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Ver Comparación Detallada
                </motion.button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default ResultsReveal; 