import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, TrendingDown, Droplet, Clock, ArrowRight } from 'lucide-react';

interface WelcomeScreenProps {
  onContinue: () => void;
}

const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ onContinue }) => {
  const benefits = [
    {
      icon: <TrendingDown className="w-6 h-6" />,
      title: "Ahorra hasta 60%",
      description: "En gastos de lavandería",
      color: "text-green-600",
      bgColor: "bg-green-100"
    },
    {
      icon: <Droplet className="w-6 h-6" />,
      title: "50% menos agua",
      description: "Cuida el medio ambiente",
      color: "text-blue-600",
      bgColor: "bg-blue-100"
    },
    {
      icon: <Clock className="w-6 h-6" />,
      title: "30 min menos",
      description: "Por cada carga de lavado",
      color: "text-purple-600",
      bgColor: "bg-purple-100"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 via-blue-50 to-purple-50 flex items-center justify-center p-4">
      <motion.div 
        className="max-w-2xl w-full bg-white rounded-2xl shadow-xl p-8 text-center"
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        {/* Icono principal animado */}
        <motion.div
          className="flex justify-center mb-6"
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.3, type: "spring", bounce: 0.5 }}
        >
          <div className="relative">
            <div className="w-20 h-20 bg-gradient-to-br from-teal-500 to-blue-500 rounded-full flex items-center justify-center">
              <Sparkles className="w-10 h-10 text-white" />
            </div>
            {/* Anillos animados alrededor del icono */}
                         <motion.div
               className="absolute inset-0 w-20 h-20 border-2 border-teal-300 rounded-full"
               animate={{ 
                 scale: [1, 1.2, 1],
                 opacity: [0.5, 0, 0.5]
               }}
               transition={{ 
                 duration: 3,
                 repeat: Infinity,
                 ease: "easeInOut"
               }}
             />
                         <motion.div
               className="absolute inset-0 w-20 h-20 border-2 border-blue-300 rounded-full"
               animate={{ 
                 scale: [1, 1.3, 1],
                 opacity: [0.3, 0, 0.3]
               }}
               transition={{ 
                 duration: 4,
                 repeat: Infinity,
                 ease: "easeInOut",
                 delay: 1
               }}
             />
          </div>
        </motion.div>

        {/* Título principal */}
        <motion.h1 
          className="text-3xl md:text-4xl font-bold text-gray-800 mb-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
        >
          ¡Bienvenido a la{' '}
          <span className="bg-gradient-to-r from-teal-600 to-blue-600 bg-clip-text text-transparent">
            Revolución
          </span>{' '}
          del Lavado!
        </motion.h1>

        {/* Subtítulo */}
        <motion.p 
          className="text-lg text-gray-600 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.7 }}
        >
          Descubre cuánto puedes ahorrar con{' '}
          <span className="font-semibold text-teal-600">GECO</span>
        </motion.p>

        {/* Beneficios */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          {benefits.map((benefit, index) => (
            <motion.div
              key={index}
              className="p-4 rounded-xl border border-gray-100 hover:shadow-md transition-shadow"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.9 + index * 0.1 }}
              whileHover={{ scale: 1.02 }}
            >
              <div className={`w-12 h-12 ${benefit.bgColor} rounded-full flex items-center justify-center mx-auto mb-3`}>
                <span className={benefit.color}>
                  {benefit.icon}
                </span>
              </div>
              <h3 className="font-semibold text-gray-800 mb-1">{benefit.title}</h3>
              <p className="text-sm text-gray-600">{benefit.description}</p>
            </motion.div>
          ))}
        </div>

        {/* Mensaje motivacional */}
        <motion.div 
          className="bg-gradient-to-r from-teal-50 to-blue-50 rounded-xl p-6 mb-8"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 1.3 }}
        >
          <p className="text-gray-700 font-medium mb-2">
            ¿Sabías que puedes ahorrar hasta{' '}
            <motion.span 
              className="text-2xl font-bold text-green-600"
              animate={{ scale: [1, 1.05, 1] }}
              transition={{ duration: 2, repeat: Infinity, repeatDelay: 3, ease: "easeInOut" }}
            >
              $2,000
            </motion.span>{' '}
            al año?
          </p>
          <p className="text-sm text-gray-600">
            Solo necesitamos conocer tus hábitos de lavado actuales
          </p>
        </motion.div>

        {/* Botón de continuar */}
        <motion.button
          onClick={onContinue}
          className="w-full bg-gradient-to-r from-teal-500 to-blue-500 text-white font-semibold py-4 px-8 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center space-x-2 group"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 1.5 }}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <span>¡Comenzar mi Análisis!</span>
                     <motion.div
             animate={{ x: [0, 3, 0] }}
             transition={{ duration: 2, repeat: Infinity, repeatDelay: 2, ease: "easeInOut" }}
           >
            <ArrowRight className="w-5 h-5" />
          </motion.div>
        </motion.button>

        {/* Nota adicional */}
        <motion.p 
          className="text-xs text-gray-500 mt-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 1.7 }}
        >
          Solo tomará 3 minutos • 100% gratuito • Sin registro
        </motion.p>
      </motion.div>
    </div>
  );
};

export default WelcomeScreen; 