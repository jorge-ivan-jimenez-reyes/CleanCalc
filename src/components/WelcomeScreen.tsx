import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

interface WelcomeScreenProps {
  onContinue: () => void;
}

// Custom SVG water drop icon — not an emoji, not lucide generic
const WaterIcon = () => (
  <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
    <path
      d="M16 3C16 3 6 14.5 6 20.5C6 26 10.5 29 16 29C21.5 29 26 26 26 20.5C26 14.5 16 3 16 3Z"
      fill="url(#water-grad)"
      stroke="none"
    />
    <ellipse cx="12" cy="20" rx="2.5" ry="3" fill="white" opacity="0.3" />
    <defs>
      <linearGradient id="water-grad" x1="16" y1="3" x2="16" y2="29" gradientUnits="userSpaceOnUse">
        <stop stopColor="#93C5FD" />
        <stop offset="1" stopColor="#3B82F6" />
      </linearGradient>
    </defs>
  </svg>
);

const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ onContinue }) => {
  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className="max-w-xl w-full">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.2, type: 'spring', stiffness: 200, damping: 20 }}
          className="mb-8"
        >
          <WaterIcon />
        </motion.div>

        <motion.h1
          className="text-4xl md:text-5xl font-extrabold text-gray-900 leading-[1.08] tracking-tight mb-5"
          initial={{ opacity: 0, y: 20, filter: 'blur(8px)' }}
          animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          transition={{ duration: 0.8, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
        >
          Descubre cuanto
          <br />
          <span className="text-blue-500">puedes ahorrar</span>
          <br />
          en tu lavado
        </motion.h1>

        <motion.p
          className="text-base text-gray-400 leading-relaxed mb-8 max-w-sm"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
        >
          Compara tus productos actuales con GECO — el producto todo-en-uno que ahorra agua, tiempo y elimina quimicos.
        </motion.p>

        {/* Visual: mini before/after comparison */}
        <motion.div
          className="bg-gray-50 rounded-xl p-5 mb-8 max-w-sm"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.65 }}
        >
          <div className="flex items-center gap-4 mb-3">
            <div className="flex-1">
              <p className="text-[10px] uppercase tracking-wider text-gray-400 mb-1">Hoy</p>
              <div className="flex gap-1">
                {['Detergente', 'Suavizante', 'Cloro', 'Aroma'].map((p, i) => (
                  <span key={i} className="text-[10px] bg-red-50 text-red-400 px-1.5 py-0.5 rounded">
                    {p}
                  </span>
                ))}
              </div>
            </div>
            <ArrowRight className="w-4 h-4 text-gray-300 flex-shrink-0" />
            <div className="flex-1">
              <p className="text-[10px] uppercase tracking-wider text-gray-400 mb-1">Con GECO</p>
              <span className="text-[10px] bg-blue-50 text-blue-500 px-2 py-0.5 rounded font-medium">
                1 producto
              </span>
            </div>
          </div>
          <div className="flex gap-6 text-xs text-gray-500 pt-3 border-t border-gray-100">
            <span><strong className="text-gray-900">50%</strong> menos agua</span>
            <span><strong className="text-gray-900">30 min</strong> menos</span>
            <span><strong className="text-gray-900">0</strong> quimicos</span>
          </div>
        </motion.div>

        <motion.button
          onClick={onContinue}
          className="bg-blue-500 text-white font-medium py-3.5 px-7 rounded-lg flex items-center gap-3 hover:bg-blue-600 transition-colors"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.8 }}
          whileTap={{ scale: 0.98 }}
        >
          <span>Comenzar</span>
          <ArrowRight className="w-4 h-4" />
        </motion.button>

        <motion.p
          className="text-xs text-gray-300 mt-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
        >
          3 minutos · gratuito · sin registro
        </motion.p>
      </div>
    </div>
  );
};

export default WelcomeScreen;
