import React from 'react';
import { motion } from 'framer-motion';
import { FlowStep } from '../types';
import { FLOW_STEPS, getStepIndex, getStepTitle } from '../utils/flowManager';

interface StepProgressBarProps {
  currentStep: FlowStep;
  completedSteps: FlowStep[];
}

const StepProgressBar: React.FC<StepProgressBarProps> = ({ currentStep, completedSteps }) => {
  const currentIndex = getStepIndex(currentStep);
  const totalSteps = FLOW_STEPS.length;
  const progress = ((currentIndex + 1) / totalSteps) * 100;

  return (
    <div className="mb-8">
      <div className="flex items-baseline justify-between mb-3">
        <motion.h2
          key={currentStep}
          initial={{ opacity: 0, x: -8 }}
          animate={{ opacity: 1, x: 0 }}
          className="text-sm font-semibold text-gray-900"
        >
          {getStepTitle(currentStep)}
        </motion.h2>
        <span className="text-xs text-gray-400 tabular-nums">
          {currentIndex + 1} / {totalSteps}
        </span>
      </div>

      {/* Single clean progress bar — no step circles */}
      <div className="w-full bg-gray-100 rounded-full h-1 overflow-hidden">
        <motion.div
          className="bg-gray-900 h-1 rounded-full"
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        />
      </div>
    </div>
  );
};

export default StepProgressBar;
