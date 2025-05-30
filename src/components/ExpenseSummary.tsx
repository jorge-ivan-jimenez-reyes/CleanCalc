import React, { useState } from 'react';
import { ExpenseSummary as ExpenseSummaryType } from '../types';
import { formatNumber, formatCurrency } from '../utils/calculator';

interface ExpenseSummaryProps {
  summary: ExpenseSummaryType;
}

interface CategoryItem {
  name: string;
  value: number;
  color: string;
  percentage?: number;
}

const ExpenseSummary: React.FC<ExpenseSummaryProps> = ({ summary }) => {
  const [activeTab, setActiveTab] = useState<'traditional' | 'geco' | 'comparison'>('traditional');

  const categories: CategoryItem[] = [
    { name: 'Detergentes', value: summary.detergentExpense, color: 'bg-blue-500' },
    { name: 'Suavizantes', value: summary.softenerExpense, color: 'bg-purple-500' },
    { name: 'Desinfectantes', value: summary.disinfectantExpense, color: 'bg-green-500' },
    { name: 'Potenciadores', value: summary.enhancerExpense, color: 'bg-amber-500' },
  ];

  // Calculate percentages for the chart
  const total = summary.totalExpense;
  categories.forEach(category => {
    category.percentage = total > 0 ? (category.value / total) * 100 : 0;
  });

  // Calculate savings percentages
  const moneyPercentage = summary.yearlyExpense > 0 
    ? (summary.savedMoney / summary.yearlyExpense) * 100 
    : 0;
  const waterPercentage = summary.yearlyWaterUsage > 0 
    ? (summary.savedWater / summary.yearlyWaterUsage) * 100 
    : 0;
  const timePercentage = summary.yearlyTimeSpent > 0 
    ? (summary.savedTime / summary.yearlyTimeSpent) * 100 
    : 0;

  return (
    <div className="bg-white rounded-xl shadow-md p-6 mb-8">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">Resumen de Gastos</h2>
      
      {/* Tabs */}
      <div className="flex mb-6 border-b">
        <button 
          onClick={() => setActiveTab('traditional')}
          className={`px-4 py-2 ${activeTab === 'traditional' ? 'text-teal-700 border-b-2 border-teal-500 font-medium' : 'text-gray-500 hover:text-gray-700'}`}
        >
          Productos Tradicionales
        </button>
        <button 
          onClick={() => setActiveTab('geco')}
          className={`px-4 py-2 ${activeTab === 'geco' ? 'text-teal-700 border-b-2 border-teal-500 font-medium' : 'text-gray-500 hover:text-gray-700'}`}
        >
          GECO
        </button>
        <button 
          onClick={() => setActiveTab('comparison')}
          className={`px-4 py-2 ${activeTab === 'comparison' ? 'text-teal-700 border-b-2 border-teal-500 font-medium' : 'text-gray-500 hover:text-gray-700'}`}
        >
          Comparación
        </button>
      </div>
      
      {/* Tradicional */}
      {activeTab === 'traditional' && (
        <div className="flex flex-col md:flex-row gap-8">
          <div className="md:w-1/2">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div className="bg-teal-50 rounded-lg p-4">
                <h3 className="text-2xl font-bold text-teal-700 mb-1">{formatCurrency(summary.totalExpense)}</h3>
                <p className="text-sm text-gray-500">Gastos Mensuales</p>
              </div>
              <div className="bg-purple-50 rounded-lg p-4">
                <h3 className="text-2xl font-bold text-purple-700 mb-1">{formatCurrency(summary.yearlyExpense)}</h3>
                <p className="text-sm text-gray-500">Gastos Anuales</p>
              </div>
            </div>
            
            <div className="space-y-4">
              {categories.map((category, index) => (
                <div key={index}>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-sm font-medium text-gray-700">{category.name}</span>
                    <span className="text-sm font-semibold text-gray-900">{formatCurrency(category.value)}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div 
                      className={`${category.color} h-2.5 rounded-full transition-all duration-500 ease-out`} 
                      style={{ width: `${category.percentage}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <div className="md:w-1/2">
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Estadísticas Anuales</h3>
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-gray-600">Consumo de Agua</p>
                  <p className="text-xl font-semibold text-blue-600">
                    {formatNumber(summary.yearlyWaterUsage, 'litros')}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Tiempo Invertido</p>
                  <p className="text-xl font-semibold text-purple-600">
                    {formatNumber(summary.yearlyTimeSpent, 'horas')}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* GECO */}
      {activeTab === 'geco' && (
        <div className="flex flex-col gap-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-green-50 rounded-lg p-4">
              <h3 className="text-2xl font-bold text-green-700 mb-1">{formatCurrency(summary.gecoYearlyExpense)}</h3>
              <p className="text-sm text-gray-500">Gasto Anual con GECO</p>
            </div>
            <div className="bg-blue-50 rounded-lg p-4">
              <h3 className="text-2xl font-bold text-blue-700 mb-1">
                {formatNumber(summary.gecoYearlyWaterUsage, 'litros')}
              </h3>
              <p className="text-sm text-gray-500">Consumo Anual de Agua</p>
            </div>
            <div className="bg-amber-50 rounded-lg p-4">
              <h3 className="text-2xl font-bold text-amber-700 mb-1">
                {formatNumber(summary.gecoYearlyTimeSpent, 'horas')}
              </h3>
              <p className="text-sm text-gray-500">Tiempo Anual Invertido</p>
            </div>
          </div>
          
          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Detalles del Cálculo</h3>
            <div className="space-y-2 text-sm">
              <p>• Costo inicial: {formatCurrency(2000)}</p>
              <p>• Costo por carga: {formatCurrency(20)} por carga</p>
              <p>• Reducción de tiempo: 30 minutos menos por carga</p>
              <p>• Reducción de agua: 50% menos de consumo de agua</p>
            </div>
          </div>
        </div>
      )}
      
      {/* Comparación */}
      {activeTab === 'comparison' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-green-50 rounded-lg p-4">
              <div className="flex justify-between items-center mb-1">
                <h3 className="text-lg font-semibold text-green-700">Ahorro Monetario</h3>
                <span className="text-sm font-bold bg-green-100 text-green-800 px-2 py-1 rounded">
                  {moneyPercentage > 0 ? `${moneyPercentage.toFixed(0)}%` : '0%'}
                </span>
              </div>
              <p className="text-2xl font-bold text-green-700 mb-1">
                {formatCurrency(Math.max(0, summary.savedMoney))}
              </p>
              <div className="flex justify-between text-sm">
                <span>Tradicional: {formatCurrency(summary.yearlyExpense)}</span>
                <span>GECO: {formatCurrency(summary.gecoYearlyExpense)}</span>
              </div>
            </div>
            
            <div className="bg-blue-50 rounded-lg p-4">
              <div className="flex justify-between items-center mb-1">
                <h3 className="text-lg font-semibold text-blue-700">Ahorro de Agua</h3>
                <span className="text-sm font-bold bg-blue-100 text-blue-800 px-2 py-1 rounded">
                  {waterPercentage > 0 ? `${waterPercentage.toFixed(0)}%` : '0%'}
                </span>
              </div>
              <p className="text-2xl font-bold text-blue-700 mb-1">
                {formatNumber(Math.max(0, summary.savedWater), 'litros')}
              </p>
              <div className="flex justify-between text-sm">
                <span>Tradicional: {formatNumber(summary.yearlyWaterUsage, 'l')}</span>
                <span>GECO: {formatNumber(summary.gecoYearlyWaterUsage, 'l')}</span>
              </div>
            </div>
            
            <div className="bg-amber-50 rounded-lg p-4">
              <div className="flex justify-between items-center mb-1">
                <h3 className="text-lg font-semibold text-amber-700">Ahorro de Tiempo</h3>
                <span className="text-sm font-bold bg-amber-100 text-amber-800 px-2 py-1 rounded">
                  {timePercentage > 0 ? `${timePercentage.toFixed(0)}%` : '0%'}
                </span>
              </div>
              <p className="text-2xl font-bold text-amber-700 mb-1">
                {formatNumber(Math.max(0, summary.savedTime), 'horas')}
              </p>
              <div className="flex justify-between text-sm">
                <span>Tradicional: {formatNumber(summary.yearlyTimeSpent, 'h')}</span>
                <span>GECO: {formatNumber(summary.gecoYearlyTimeSpent, 'h')}</span>
              </div>
            </div>
          </div>
          
          <div className="bg-teal-50 rounded-lg p-4">
            <h3 className="text-lg font-semibold text-teal-800 mb-2">Impacto Ambiental</h3>
            <p className="text-sm text-teal-700">
              Usando GECO, ahorrarías aproximadamente {formatNumber(summary.savedWater, 'litros')} de agua al año, 
              contribuyendo significativamente a la conservación del agua potable. Además, reducirías el uso de 
              productos químicos que eventualmente terminan en el sistema de aguas residuales.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default ExpenseSummary;