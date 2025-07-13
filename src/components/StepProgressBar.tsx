import React from 'react';
import { motion } from 'framer-motion';
import { FlowStep } from '../types';
import { FLOW_STEPS, getStepIndex, getStepTitle } from '../utils/flowManager';
import { Check, Circle } from 'lucide-react';

interface StepProgressBarProps {
  currentStep: FlowStep;
  completedSteps: FlowStep[];
}

const StepProgressBar: React.FC<StepProgressBarProps> = ({ currentStep, completedSteps }) => {
  const currentIndex = getStepIndex(currentStep);
  const totalSteps = FLOW_STEPS.length;
  const progressPercentage = ((currentIndex + 1) / totalSteps) * 100;

  return (
    <div className="w-full bg-white rounded-lg shadow-sm p-4 mb-4 border border-gray-100">
      {/* Título del paso actual */}
      <div className="text-center mb-4">
        <motion.h2 
          key={currentStep}
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="text-lg font-semibold text-gray-800"
        >
          {getStepTitle(currentStep)}
        </motion.h2>
        <motion.p 
          key={`desc-${currentStep}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3, delay: 0.1 }}
          className="text-sm text-gray-600"
        >
          Paso {currentIndex + 1} de {totalSteps}
        </motion.p>
      </div>

      {/* Barra de progreso principal */}
      <div className="relative">
        <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
          <motion.div
            className="bg-gradient-to-r from-teal-500 to-blue-500 h-2 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${progressPercentage}%` }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          />
        </div>
        
        {/* Indicadores de pasos */}
        <div className="flex justify-between items-center">
          {FLOW_STEPS.map((step, index) => {
            const isCompleted = completedSteps.includes(step);
            const isCurrent = step === currentStep;
            const isPast = index < currentIndex;
            
            return (
              <motion.div
                key={step}
                className="flex flex-col items-center"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                {/* Círculo del paso */}
                <motion.div
                  className={`
                    w-8 h-8 rounded-full flex items-center justify-center border-2 mb-2
                    ${isCurrent 
                      ? 'bg-blue-500 border-blue-500 text-white shadow-lg' 
                      : isCompleted || isPast
                        ? 'bg-green-500 border-green-500 text-white'
                        : 'bg-gray-200 border-gray-300 text-gray-500'
                    }
                  `}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {isCompleted || isPast ? (
                    <Check className="w-4 h-4" />
                  ) : (
                    <Circle className={`w-3 h-3 ${isCurrent ? 'fill-current' : ''}`} />
                  )}
                </motion.div>
                
                {/* Etiqueta del paso */}
                <span className={`
                  text-xs text-center font-medium hidden sm:block max-w-16
                  ${isCurrent 
                    ? 'text-blue-600' 
                    : isCompleted || isPast
                      ? 'text-green-600'
                      : 'text-gray-400'
                  }
                `}>
                  {getStepTitle(step)}
                </span>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Mensaje de progreso */}
      <motion.div 
        className="text-center mt-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        <div className="flex items-center justify-center space-x-2">
          <div className="w-2 h-2 bg-teal-500 rounded-full animate-pulse"></div>
          <span className="text-xs text-gray-600">
            {completedSteps.length} de {totalSteps} pasos completados
          </span>
        </div>
      </motion.div>
    </div>
  );
};

export default StepProgressBar; 