import React from 'react';
import { motion } from 'framer-motion';

const AnimatedBackground: React.FC = () => {
  const blobs = [
    { color: '#3b82f6', left: '65%', top: '-10%', size: 500, opacity: 0.15, dur: 20, dx: [0, 40, -20, 0], dy: [0, 30, -15, 0] },
    { color: '#06b6d4', left: '-8%', top: '25%', size: 400, opacity: 0.12, dur: 25, dx: [0, -30, 25, 0], dy: [0, -40, 20, 0] },
    { color: '#60a5fa', left: '15%', top: '75%', size: 550, opacity: 0.10, dur: 28, dx: [0, 50, -30, 0], dy: [0, -25, 30, 0] },
    { color: '#8b5cf6', left: '25%', top: '2%', size: 350, opacity: 0.08, dur: 22, dx: [0, -25, 35, 0], dy: [0, 30, -20, 0] },
    { color: '#14b8a6', left: '80%', top: '50%', size: 400, opacity: 0.10, dur: 18, dx: [0, 30, -20, 0], dy: [0, -35, 20, 0] },
  ];

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 0,
        overflow: 'hidden',
        pointerEvents: 'none',
      }}
    >
      {blobs.map((blob, i) => (
        <motion.div
          key={i}
          style={{
            position: 'absolute',
            left: blob.left,
            top: blob.top,
            width: blob.size,
            height: blob.size,
            borderRadius: '50%',
            background: blob.color,
            opacity: blob.opacity,
            filter: 'blur(100px)',
            willChange: 'transform',
          }}
          animate={{
            x: blob.dx,
            y: blob.dy,
            scale: [1, 1.1, 0.95, 1],
          }}
          transition={{
            duration: blob.dur,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: i * 2,
          }}
        />
      ))}
    </div>
  );
};

export default AnimatedBackground;
