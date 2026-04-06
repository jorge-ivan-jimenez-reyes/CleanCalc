import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ExpenseSummary, Product, LaundryStats } from '../types';
import { formatNumber } from '../utils/calculator';
import { Droplet, Clock, CheckCircle, ArrowRight, RotateCcw } from 'lucide-react';
import ChemicalsTable from './ChemicalsTable';

interface AnimatedComparisonProps {
  expenseSummary: ExpenseSummary;
  selectedProducts?: Product[];
  laundryStats?: LaundryStats;
  onRestart: () => void;
}

const Counter = ({ value, duration = 1500 }: { value: number; duration?: number }) => {
  const [count, setCount] = useState(0);
  useEffect(() => {
    const steps = 50;
    let frame = 0;
    const timer = setInterval(() => {
      frame++;
      setCount(Math.round(value * (1 - Math.pow(1 - frame / steps, 3))));
      if (frame >= steps) clearInterval(timer);
    }, duration / steps);
    return () => clearInterval(timer);
  }, [value, duration]);
  return <>{count.toLocaleString()}</>;
};

const AnimatedComparison: React.FC<AnimatedComparisonProps> = ({ expenseSummary, selectedProducts = [], onRestart }) => {
  const [activeTab, setActiveTab] = useState<'water' | 'time' | 'summary'>('water');

  const comparisons = [
    { id: 'water' as const, title: 'Agua', fullTitle: 'Consumo de Agua', icon: <Droplet className="w-5 h-5" />, traditional: expenseSummary.yearlyWaterUsage, geco: expenseSummary.gecoYearlyWaterUsage, savings: expenseSummary.savedWater, unit: 'L', color: 'blue', description: 'Litros por año' },
    { id: 'time' as const, title: 'Tiempo', fullTitle: 'Tiempo Invertido', icon: <Clock className="w-5 h-5" />, traditional: expenseSummary.yearlyTimeSpent, geco: expenseSummary.gecoYearlyTimeSpent, savings: expenseSummary.savedTime, unit: 'hrs', color: 'violet', description: 'Horas por año' },
  ];

  const BarChart = ({ comparison }: { comparison: typeof comparisons[0] }) => {
    const maxVal = Math.max(comparison.traditional, comparison.geco);
    const tradPct = (comparison.traditional / maxVal) * 100;
    const gecoPct = (comparison.geco / maxVal) * 100;
    const savePct = comparison.traditional > 0 ? (comparison.savings / comparison.traditional) * 100 : 0;

    return (
      <div className="max-w-lg mx-auto">
        <motion.div
          className="text-center mb-10"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h3 className="text-2xl font-bold text-gray-900 mb-1">{comparison.fullTitle}</h3>
          <p className="text-sm text-gray-400">{comparison.description}</p>
        </motion.div>

        <div className="space-y-6">
          {/* Traditional */}
          <motion.div
            initial={{ opacity: 0, x: -15 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            <div className="flex items-baseline justify-between mb-2">
              <span className="text-sm text-gray-400">Productos tradicionales</span>
              <span className="text-lg font-bold text-red-400 tabular-nums">
                <Counter value={comparison.traditional} /> {comparison.unit}
              </span>
            </div>
            <div className="w-full bg-gray-100 rounded-full h-4 overflow-hidden">
              <motion.div
                className="h-4 rounded-full bg-red-400 flex items-center justify-end pr-2"
                initial={{ width: 0 }}
                animate={{ width: `${tradPct}%` }}
                transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1], delay: 0.3 }}
              />
            </div>
          </motion.div>

          {/* GECO */}
          <motion.div
            initial={{ opacity: 0, x: -15 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.45, duration: 0.5 }}
          >
            <div className="flex items-baseline justify-between mb-2">
              <span className="text-sm text-blue-500 font-medium">GECO</span>
              <span className="text-lg font-bold text-blue-500 tabular-nums">
                <Counter value={comparison.geco} duration={1800} /> {comparison.unit}
              </span>
            </div>
            <div className="w-full bg-gray-100 rounded-full h-4 overflow-hidden">
              <motion.div
                className="h-4 rounded-full bg-blue-400 flex items-center justify-end pr-2"
                initial={{ width: 0 }}
                animate={{ width: `${gecoPct}%` }}
                transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1], delay: 0.55 }}
              />
            </div>
          </motion.div>

          {/* Savings */}
          <motion.div
            className="pt-6 border-t border-gray-100"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1, duration: 0.5 }}
          >
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-400">Tu ahorro anual</span>
              <div className="text-right">
                <span className="text-3xl font-bold text-gray-900 tabular-nums">
                  <Counter value={Math.max(0, comparison.savings)} duration={2000} /> {comparison.unit}
                </span>
                <p className="text-xs text-blue-500 mt-1">{savePct.toFixed(0)}% menos</p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen py-10 px-6">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-10"
        >
          <p className="text-sm text-blue-500 font-medium mb-1">Resultados</p>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">
            Comparación detallada
          </h1>
        </motion.div>

        {/* Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.4 }}
          className="flex gap-1 mb-10 border-b border-gray-100"
        >
          {[...comparisons.map(c => ({ id: c.id, label: c.title })), { id: 'summary' as const, label: 'Resumen' }].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-4 py-2.5 text-sm font-medium transition-all relative ${
                activeTab === tab.id ? 'text-blue-500' : 'text-gray-400 hover:text-gray-600'
              }`}
            >
              {tab.label}
              {activeTab === tab.id && (
                <motion.div
                  layoutId="compTab"
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-500"
                  transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                />
              )}
            </button>
          ))}
        </motion.div>

        {/* Content */}
        <AnimatePresence mode="wait">
          {activeTab !== 'summary' ? (
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 15, filter: 'blur(4px)' }}
              animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              exit={{ opacity: 0, y: -10, filter: 'blur(4px)' }}
              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            >
              <BarChart comparison={comparisons.find(c => c.id === activeTab)!} />
            </motion.div>
          ) : (
            <motion.div
              key="summary"
              initial={{ opacity: 0, y: 15, filter: 'blur(4px)' }}
              animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4 }}
              className="space-y-8"
            >
              {/* Annual savings */}
              <div className="bg-blue-50 rounded-2xl p-8">
                <p className="text-sm text-blue-500 font-medium mb-1">Ahorro anual con GECO</p>
                <div className="flex gap-8 mt-4">
                  {comparisons.map((c, i) => (
                    <motion.div
                      key={c.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2 + i * 0.1 }}
                    >
                      <p className="text-3xl font-bold text-gray-900 tabular-nums">
                        {Math.max(0, c.savings).toLocaleString()} {c.unit}
                      </p>
                      <p className="text-sm text-blue-500/70">{c.title}</p>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Benefits */}
              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-4">¿Por qué GECO?</h3>
                <div className="space-y-3">
                  {[
                    'Todo en uno: detergente + suavizante + desinfectante + aroma',
                    'Solo 2 tabletas por carga — sin medir ni mezclar',
                    'Fórmula eco-friendly: 50% menos agua',
                    '30 minutos menos por cada carga',
                    '0 químicos dañinos para ti y tu familia',
                  ].map((b, i) => (
                    <motion.div
                      key={i}
                      className="flex items-start gap-3 text-sm text-gray-600"
                      initial={{ opacity: 0, x: -8 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.4 + i * 0.06 }}
                    >
                      <CheckCircle className="w-4 h-4 text-blue-400 flex-shrink-0 mt-0.5" />
                      <span>{b}</span>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* 5 year impact */}
              <div className="bg-gray-50 rounded-2xl p-6">
                <h3 className="text-sm font-semibold text-gray-900 mb-4">Impacto en 5 años</h3>
                <div className="flex gap-8">
                  <div>
                    <p className="text-xs text-gray-400 mb-1">Agua ahorrada</p>
                    <p className="text-xl font-bold text-blue-500">
                      {formatNumber(Math.max(0, expenseSummary.savedWater) * 5, 'litros')}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-400 mb-1">Tiempo ahorrado</p>
                    <p className="text-xl font-bold text-violet-500">
                      {formatNumber(Math.max(0, expenseSummary.savedTime) * 5, 'horas')}
                    </p>
                  </div>
                </div>
              </div>

              {/* Chemicals table */}
              {selectedProducts.length > 0 && <ChemicalsTable products={selectedProducts} />}

              {/* CTA */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="flex gap-3 pt-4"
              >
                <button
                  onClick={onRestart}
                  className="flex items-center gap-2 px-5 py-3 rounded-lg text-sm font-medium text-gray-500 border border-gray-200 hover:bg-gray-50 transition-colors"
                >
                  <RotateCcw className="w-4 h-4" />
                  Calcular de nuevo
                </button>
                <a
                  href="https://clean-calc.vercel.app/"
                  className="flex items-center gap-2 px-5 py-3 rounded-lg text-sm font-medium bg-blue-500 text-white hover:bg-blue-600 transition-colors"
                >
                  Conocer GECO
                  <ArrowRight className="w-4 h-4" />
                </a>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default AnimatedComparison;
