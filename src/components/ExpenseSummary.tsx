import React, { useState } from 'react';
import { ExpenseSummary as ExpenseSummaryType } from '../types';
import { formatNumber, formatCurrency } from '../utils/calculator';
import { DollarSign, Droplet, Clock, BarChart } from 'lucide-react';

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
    <div className="bg-white rounded-lg shadow-sm p-3 mb-4 border border-gray-100 transition-all hover:shadow-md overflow-hidden">
      <div className="flex items-center mb-3">
        <div className="bg-teal-100 p-1.5 rounded-full mr-2">
          <BarChart className="w-4 h-4 text-teal-600" />
        </div>
        <h2 className="text-base font-semibold text-gray-800">Resumen de Gastos</h2>
      </div>
      
      {/* Tabs */}
      <div className="flex mb-3 border-b overflow-x-auto hide-scrollbar">
        {[
          { id: 'traditional', label: 'Productos' },
          { id: 'geco', label: 'GECO' },
          { id: 'comparison', label: 'Comparar' }
        ].map((tab) => (
          <button 
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`px-2 py-1.5 text-xs whitespace-nowrap transition-all ${
              activeTab === tab.id 
                ? 'text-teal-700 border-b-2 border-teal-500 font-medium' 
                : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50 rounded-t-lg'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>
      
      {/* Tradicional */}
      {activeTab === 'traditional' && (
        <div className="flex flex-col lg:flex-row gap-3">
          <div className="lg:w-1/2">
            <div className="grid grid-cols-2 gap-2 mb-3">
              <div className="bg-teal-50 rounded-md p-2 border border-teal-100 flex flex-col items-center justify-center">
                <DollarSign className="w-3.5 h-3.5 text-teal-600 mb-0.5" />
                <h3 className="text-base font-bold text-teal-700">{formatCurrency(summary.totalExpense)}</h3>
                <p className="text-xxs text-gray-500 text-center">Gastos Mensuales</p>
              </div>
              <div className="bg-purple-50 rounded-md p-2 border border-purple-100 flex flex-col items-center justify-center">
                <DollarSign className="w-3.5 h-3.5 text-purple-600 mb-0.5" />
                <h3 className="text-base font-bold text-purple-700">{formatCurrency(summary.yearlyExpense)}</h3>
                <p className="text-xxs text-gray-500 text-center">Gastos Anuales</p>
              </div>
            </div>
            
            <div className="space-y-2">
              {categories.map((category, index) => (
                <div key={index} className="p-1.5 rounded-md border border-gray-100 hover:bg-gray-50 transition-colors">
                  <div className="flex justify-between items-center mb-0.5">
                    <span className="text-xs font-medium text-gray-700">{category.name}</span>
                    <span className="text-xxs font-semibold text-gray-900 bg-gray-100 px-1.5 py-0.5 rounded-full">{formatCurrency(category.value)}</span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-1.5 overflow-hidden">
                    <div 
                      className={`${category.color} h-1.5 rounded-full transition-all duration-500 ease-out`} 
                      style={{ width: `${category.percentage}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
            
            {summary.costPerLoad > 0 && (
              <div className="bg-red-50 rounded-md p-2.5 border border-red-100 mt-3">
                <h3 className="text-xs font-semibold text-red-800 mb-2">Costo por Carga</h3>
                <div className="flex items-center bg-white p-1.5 rounded-md border border-red-100">
                  <DollarSign className="h-3.5 w-3.5 mr-1.5 text-red-500" />
                  <p className="text-xs text-red-700">
                    {formatCurrency(summary.costPerLoad)} (múltiples productos)
                  </p>
                </div>
              </div>
            )}
          </div>
          
          <div className="lg:w-1/2">
            <div className="bg-gray-50 rounded-md p-2.5 border border-gray-100">
              <h3 className="text-xs font-semibold text-gray-800 mb-2">Estadísticas Anuales</h3>
              <div className="space-y-2">
                <div className="flex items-center bg-white rounded-md p-2 border border-gray-100">
                  <div className="bg-blue-100 p-1.5 rounded-full mr-2">
                    <Droplet className="w-3.5 h-3.5 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-xxs text-gray-600">Consumo de Agua</p>
                    <p className="text-xs font-semibold text-blue-600">
                      {formatNumber(summary.yearlyWaterUsage, 'litros')}
                    </p>
                  </div>
                </div>
                <div className="flex items-center bg-white rounded-md p-2 border border-gray-100">
                  <div className="bg-purple-100 p-1.5 rounded-full mr-2">
                    <Clock className="w-3.5 h-3.5 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-xxs text-gray-600">Tiempo Invertido</p>
                    <p className="text-xs font-semibold text-purple-600">
                      {formatNumber(summary.yearlyTimeSpent, 'horas')}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* GECO */}
      {activeTab === 'geco' && (
        <div className="flex flex-col gap-3">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            <div className="bg-green-50 rounded-md p-2 border border-green-100 flex flex-col items-center">
              <DollarSign className="w-3.5 h-3.5 text-green-600 mb-0.5" />
              <h3 className="text-base font-bold text-green-700">{formatCurrency(summary.gecoYearlyExpense)}</h3>
              <p className="text-xxs text-gray-500 text-center">Gasto Anual</p>
            </div>
            <div className="bg-blue-50 rounded-md p-2 border border-blue-100 flex flex-col items-center">
              <Droplet className="w-3.5 h-3.5 text-blue-600 mb-0.5" />
              <h3 className="text-base font-bold text-blue-700">
                {formatNumber(summary.gecoYearlyWaterUsage, 'litros')}
              </h3>
              <p className="text-xxs text-gray-500 text-center">Agua Anual</p>
            </div>
            <div className="bg-amber-50 rounded-md p-2 border border-amber-100 flex flex-col items-center">
              <Clock className="w-3.5 h-3.5 text-amber-600 mb-0.5" />
              <h3 className="text-base font-bold text-amber-700">
                {formatNumber(summary.gecoYearlyTimeSpent, 'horas')}
              </h3>
              <p className="text-xxs text-gray-500 text-center">Tiempo Anual</p>
            </div>
          </div>
          
                      <div className="bg-gray-50 rounded-md p-2.5 border border-gray-100">
            <h3 className="text-xs font-semibold text-gray-800 mb-2">Detalles del Cálculo</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xxs">
              <div className="flex items-center bg-white p-1.5 rounded-md border border-gray-100">
                <DollarSign className="h-3.5 w-3.5 mr-1.5 text-gray-500" />
                <p>Costo por carga: {formatCurrency(summary.gecoCostPerLoad)} (2 pastillas)</p>
              </div>
              <div className="flex items-center bg-white p-1.5 rounded-md border border-gray-100">
                <Clock className="h-3.5 w-3.5 mr-1.5 text-gray-500" />
                <p>-30 min por carga</p>
              </div>
              <div className="flex items-center bg-white p-1.5 rounded-md border border-gray-100">
                <Droplet className="h-3.5 w-3.5 mr-1.5 text-gray-500" />
                <p>-50% consumo agua</p>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Comparación - Optimizada */}
      {activeTab === 'comparison' && (
        <div className="space-y-3">
          {/* Ahorro Monetario */}
          <div className="flex">
            <div className="w-1/3 bg-green-50 rounded-md p-2 border border-green-100 flex flex-col justify-center">
              <h3 className="text-xs font-semibold text-green-700 flex items-center justify-between">
                <span>Ahorro</span>
                {moneyPercentage > 0 && (
                  <span className="text-xxs font-bold bg-green-100 text-green-800 px-1 py-0.5 rounded-full ml-1">
                    {moneyPercentage > 0 ? `${moneyPercentage.toFixed(0)}%` : '0%'}
                  </span>
                )}
              </h3>
              <p className="text-base font-bold text-green-700">
                {formatCurrency(Math.max(0, summary.savedMoney))}
              </p>
            </div>
            <div className="w-2/3 ml-2">
              <div className="bg-white rounded-md p-2 border border-gray-100 mb-1.5">
                <p className="text-xxs text-gray-500 mb-0.5">Tradicional:</p>
                <div className="flex items-center">
                  <DollarSign className="h-3 w-3 mr-1 text-gray-600" />
                  <span className="text-xs font-medium">{formatCurrency(summary.yearlyExpense)}</span>
                </div>
              </div>
              <div className="bg-white rounded-md p-2 border border-gray-100">
                <p className="text-xxs text-gray-500 mb-0.5">GECO:</p>
                <div className="flex items-center">
                  <DollarSign className="h-3 w-3 mr-1 text-green-600" />
                  <span className="text-xs font-medium">{formatCurrency(summary.gecoYearlyExpense)}</span>
                </div>
              </div>
            </div>
          </div>
          
          {/* Ahorro de Agua */}
          <div className="flex">
            <div className="w-1/3 bg-blue-50 rounded-md p-2 border border-blue-100 flex flex-col justify-center">
              <h3 className="text-xs font-semibold text-blue-700 flex items-center justify-between">
                <span>Agua</span>
                {waterPercentage > 0 && (
                  <span className="text-xxs font-bold bg-blue-100 text-blue-800 px-1 py-0.5 rounded-full ml-1">
                    {waterPercentage > 0 ? `${waterPercentage.toFixed(0)}%` : '0%'}
                  </span>
                )}
              </h3>
              <p className="text-base font-bold text-blue-700">
                {formatNumber(Math.max(0, summary.savedWater), 'l')}
              </p>
            </div>
            <div className="w-2/3 ml-2">
              <div className="bg-white rounded-md p-2 border border-gray-100 mb-1.5">
                <p className="text-xxs text-gray-500 mb-0.5">Tradicional:</p>
                <div className="flex items-center">
                  <Droplet className="h-3 w-3 mr-1 text-gray-600" />
                  <span className="text-xs font-medium">{formatNumber(summary.yearlyWaterUsage, 'l')}</span>
                </div>
              </div>
              <div className="bg-white rounded-md p-2 border border-gray-100">
                <p className="text-xxs text-gray-500 mb-0.5">GECO:</p>
                <div className="flex items-center">
                  <Droplet className="h-3 w-3 mr-1 text-blue-600" />
                  <span className="text-xs font-medium">{formatNumber(summary.gecoYearlyWaterUsage, 'l')}</span>
                </div>
              </div>
            </div>
          </div>
          
          {/* Ahorro de Tiempo */}
          <div className="flex">
            <div className="w-1/3 bg-amber-50 rounded-md p-2 border border-amber-100 flex flex-col justify-center">
              <h3 className="text-xs font-semibold text-amber-700 flex items-center justify-between">
                <span>Tiempo</span>
                {timePercentage > 0 && (
                  <span className="text-xxs font-bold bg-amber-100 text-amber-800 px-1 py-0.5 rounded-full ml-1">
                    {timePercentage > 0 ? `${timePercentage.toFixed(0)}%` : '0%'}
                  </span>
                )}
              </h3>
              <p className="text-base font-bold text-amber-700">
                {formatNumber(Math.max(0, summary.savedTime), 'h')}
              </p>
            </div>
            <div className="w-2/3 ml-2">
              <div className="bg-white rounded-md p-2 border border-gray-100 mb-1.5">
                <p className="text-xxs text-gray-500 mb-0.5">Tradicional:</p>
                <div className="flex items-center">
                  <Clock className="h-3 w-3 mr-1 text-gray-600" />
                  <span className="text-xs font-medium">{formatNumber(summary.yearlyTimeSpent, 'h')}</span>
                </div>
              </div>
              <div className="bg-white rounded-md p-2 border border-gray-100">
                <p className="text-xxs text-gray-500 mb-0.5">GECO:</p>
                <div className="flex items-center">
                  <Clock className="h-3 w-3 mr-1 text-amber-600" />
                  <span className="text-xs font-medium">{formatNumber(summary.gecoYearlyTimeSpent, 'h')}</span>
                </div>
              </div>
            </div>
          </div>
          
          {/* Comparación de Costo por Carga */}
          {summary.costPerLoad > 0 && (
            <div className="flex mt-3">
              <div className="w-1/3 bg-orange-50 rounded-md p-2 border border-orange-100 flex flex-col justify-center">
                <h3 className="text-xs font-semibold text-orange-700 flex items-center justify-between">
                  <span>Por Carga</span>
                  {summary.costPerLoad > summary.gecoCostPerLoad && (
                    <span className="text-xxs font-bold bg-orange-100 text-orange-800 px-1 py-0.5 rounded-full ml-1">
                      {summary.costPerLoad > 0 ? `${(((summary.costPerLoad - summary.gecoCostPerLoad) / summary.costPerLoad) * 100).toFixed(0)}%` : '0%'}
                    </span>
                  )}
                </h3>
                <p className="text-base font-bold text-orange-700">
                  {formatCurrency(Math.max(0, summary.costPerLoad - summary.gecoCostPerLoad))}
                </p>
              </div>
              <div className="w-2/3 ml-2">
                <div className="bg-white rounded-md p-2 border border-gray-100 mb-1.5">
                  <p className="text-xxs text-gray-500 mb-0.5">Tradicional:</p>
                  <div className="flex items-center">
                    <DollarSign className="h-3 w-3 mr-1 text-gray-600" />
                    <span className="text-xs font-medium">{formatCurrency(summary.costPerLoad)}</span>
                  </div>
                </div>
                <div className="bg-white rounded-md p-2 border border-gray-100">
                  <p className="text-xxs text-gray-500 mb-0.5">GECO:</p>
                  <div className="flex items-center">
                    <DollarSign className="h-3 w-3 mr-1 text-green-600" />
                    <span className="text-xs font-medium">{formatCurrency(summary.gecoCostPerLoad)}</span>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {/* Impacto Ambiental - Ocultado por espacio */}
        </div>
      )}
    </div>
  );
};

export default ExpenseSummary;