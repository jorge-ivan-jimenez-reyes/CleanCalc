import React, { useRef, useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { gsap } from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ExpenseSummary } from '../types';
import { ArrowRight, ArrowDown } from 'lucide-react';

gsap.registerPlugin(useGSAP, ScrollTrigger);

interface ResultsRevealProps {
  expenseSummary: ExpenseSummary;
  onContinue: () => void;
}

// Animated donut
const DonutChart = ({ percentage, color, size = 110, strokeWidth = 7, delay = 0 }: {
  percentage: number; color: string; size?: number; strokeWidth?: number; delay?: number;
}) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const center = size / 2;
  const [offset, setOffset] = useState(circumference);

  useEffect(() => {
    const t = setTimeout(() => {
      setOffset(circumference - (circumference * Math.min(percentage, 100)) / 100);
    }, delay * 1000);
    return () => clearTimeout(t);
  }, [percentage, circumference, delay]);

  return (
    <svg width={size} height={size} className="transform -rotate-90">
      <circle cx={center} cy={center} r={radius} fill="none" stroke="#f3f4f6" strokeWidth={strokeWidth} />
      <circle
        cx={center} cy={center} r={radius} fill="none"
        stroke={color} strokeWidth={strokeWidth} strokeLinecap="round"
        strokeDasharray={circumference}
        strokeDashoffset={offset}
        style={{ transition: `stroke-dashoffset 1.5s cubic-bezier(0.16, 1, 0.3, 1)` }}
      />
    </svg>
  );
};

const Counter = ({ value, prefix = '', suffix = '' }: { value: number; prefix?: string; suffix?: string }) => {
  const [count, setCount] = useState(0);
  useEffect(() => {
    const steps = 50;
    let frame = 0;
    const timer = setInterval(() => {
      frame++;
      setCount(Math.round(value * (1 - Math.pow(1 - frame / steps, 3))));
      if (frame >= steps) clearInterval(timer);
    }, 30);
    return () => clearInterval(timer);
  }, [value]);
  return <>{prefix}{count.toLocaleString()}{suffix}</>;
};

const ResultsReveal: React.FC<ResultsRevealProps> = ({ expenseSummary, onContinue }) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const sections = gsap.utils.toArray<HTMLElement>('.reveal-section');

    sections.forEach((section) => {
      gsap.from(section, {
        autoAlpha: 0,
        y: 50,
        filter: 'blur(8px)',
        duration: 0.8,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: section,
          start: 'top 80%',
          toggleActions: 'play none none none',
        },
      });
    });
  }, { scope: containerRef });

  return (
    <div ref={containerRef} className="min-h-screen px-6 py-16">
      <div className="max-w-lg mx-auto">

        {/* Section 1: What you use today */}
        <div className="reveal-section mb-20 invisible">
          <p className="text-sm text-gray-400 mb-1">Tus resultados</p>
          <h2 className="text-3xl font-bold text-gray-900 mb-10">Esto usas cada año</h2>

          <div className="grid grid-cols-3 gap-6 text-center">
            {[
              { label: 'Químicos', value: expenseSummary.totalChemicals, color: '#ef4444', pct: Math.min(expenseSummary.totalChemicals * 14, 100) },
              { label: 'Agua', value: expenseSummary.yearlyWaterUsage, suffix: ' L', color: '#3b82f6', pct: 85 },
              { label: 'Tiempo', value: expenseSummary.yearlyTimeSpent, suffix: ' hrs', color: '#8b5cf6', pct: 70 },
            ].map((item, i) => (
              <div key={i}>
                <div className="relative inline-block mb-3">
                  <DonutChart percentage={item.pct} color={item.color} delay={0.3 + i * 0.2} />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-lg font-bold text-gray-900 tabular-nums">
                      <Counter value={item.value} suffix={item.suffix || ''} />
                    </span>
                  </div>
                </div>
                <p className="text-xs text-gray-400">{item.label}</p>
              </div>
            ))}
          </div>

        </div>

        {/* Scroll hint */}
        <div className="reveal-section flex justify-center mb-20 invisible">
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
            className="text-gray-300"
          >
            <ArrowDown className="w-5 h-5" />
          </motion.div>
        </div>

        {/* Section 2: The problem */}
        <div className="reveal-section mb-20 text-center invisible">
          <div className="inline-block mb-6">
            <DonutChart percentage={100} color="#ef4444" size={130} strokeWidth={8} delay={0.2} />
            <div className="relative -mt-[100px] flex items-center justify-center h-[70px]">
              <span className="text-4xl font-bold text-red-500">
                <Counter value={expenseSummary.totalChemicals} />
              </span>
            </div>
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mt-6 mb-2">químicos dañinos</h3>
          <p className="text-sm text-gray-400 max-w-xs mx-auto">
            En tus productos actuales, perjudiciales para tu salud y el medio ambiente
          </p>
        </div>

        {/* Section 3: Before / After visual */}
        <div className="reveal-section mb-20 invisible">
          <h3 className="text-xl font-bold text-gray-900 mb-6 text-center">¿Y si solo necesitaras uno?</h3>
          <div className="flex items-center gap-4">
            {/* Before */}
            <div className="flex-1 bg-red-50 rounded-xl p-5 border border-red-100">
              <p className="text-[10px] uppercase tracking-wider text-red-400 font-medium mb-3">Hoy usas</p>
              <div className="space-y-2">
                {['Detergente', 'Suavizante', 'Desinfectante', 'Potenciador'].map((p, i) => (
                  <motion.div
                    key={i}
                    className="text-xs bg-white text-red-500 px-3 py-1.5 rounded-lg border border-red-100"
                    initial={{ opacity: 0, x: -10 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1 }}
                  >
                    {p}
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Arrow */}
            <ArrowRight className="w-5 h-5 text-gray-300 flex-shrink-0" />

            {/* After */}
            <div className="flex-1 bg-blue-50 rounded-xl p-5 border border-blue-100">
              <p className="text-[10px] uppercase tracking-wider text-blue-500 font-medium mb-3">Con GECO</p>
              <div className="w-14 h-14 bg-blue-500 rounded-xl flex items-center justify-center mb-3">
                <span className="text-white font-bold text-lg">G</span>
              </div>
              <p className="text-xs text-gray-600 mb-1">Todo en uno</p>
              <p className="text-xs text-gray-400">2 tabletas por carga</p>
            </div>
          </div>
        </div>

        {/* Section 4: Your savings */}
        <div className="reveal-section mb-12 invisible">
          <p className="text-sm text-blue-500 font-medium mb-1">Con GECO ahorras</p>
          <h2 className="text-3xl font-bold text-gray-900 mb-8">Tu ahorro anual</h2>

          <div className="grid grid-cols-2 gap-4 mb-6">
            {[
              { label: 'Químicos eliminados', value: expenseSummary.savedChemicals, suffix: '', color: '#10b981', pct: 100 },
              { label: 'Litros de agua', value: Math.max(0, expenseSummary.savedWater), suffix: ' L', color: '#3b82f6', pct: 50 },
              { label: 'Horas libres', value: Math.max(0, expenseSummary.savedTime), suffix: ' hrs', color: '#8b5cf6', pct: 38 },
            ].map((item, i) => (
              <motion.div
                key={i}
                className="text-center p-4 bg-gray-50 rounded-xl"
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 + i * 0.1 }}
              >
                <div className="relative inline-block mb-2">
                  <DonutChart percentage={item.pct} color={item.color} size={80} strokeWidth={5} delay={0.3 + i * 0.15} />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-sm font-bold text-gray-900 tabular-nums">
                      <Counter value={item.value} prefix={(item as any).prefix || ''} />
                    </span>
                  </div>
                </div>
                <p className="text-xs text-gray-400">{item.label}</p>
              </motion.div>
            ))}
          </div>

          <motion.button
            onClick={onContinue}
            className="bg-blue-500 text-white font-medium py-3.5 px-7 rounded-lg flex items-center gap-3 hover:bg-blue-600 transition-colors mt-6"
            whileTap={{ scale: 0.98 }}
          >
            <span>Ver comparación detallada</span>
            <ArrowRight className="w-4 h-4" />
          </motion.button>
        </div>
      </div>
    </div>
  );
};

export default ResultsReveal;
