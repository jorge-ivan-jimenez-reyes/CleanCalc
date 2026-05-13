import { motion } from 'framer-motion';
import { Zap } from 'lucide-react';

interface IntegraWatermarkProps {
  href?: string;
  label?: string;
}

export default function IntegraWatermark({
  href = 'https://integra-group.ai',
  label = 'by Integra',
}: IntegraWatermarkProps) {
  return (
    <motion.a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.6, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      whileHover={{ scale: 1.04 }}
      whileTap={{ scale: 0.97 }}
      className="fixed bottom-4 right-4 z-50 inline-flex items-center gap-1.5 rounded-full border border-gray-200 bg-white/80 px-3 py-1.5 text-xs font-medium text-gray-600 shadow-sm backdrop-blur transition-colors hover:border-gray-300 hover:text-gray-900 sm:bottom-5 sm:right-5"
      aria-label="Hecho por Integra Group AI"
    >
      <span className="grid h-4 w-4 place-items-center rounded-full bg-gradient-to-br from-indigo-500 to-amber-300 text-white">
        <Zap size={9} strokeWidth={3} />
      </span>
      <span>{label}</span>
      <span aria-hidden className="text-gray-400">→</span>
    </motion.a>
  );
}
