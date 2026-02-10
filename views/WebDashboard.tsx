import React from 'react';
import { MOCK_KPIS } from '../constants';

const GOV_GOALS = [
  { id: 1, title: 'Eficiencia en Servicios Públicos', progress: 78, target: '90%', status: 'ontrack' },
  { id: 2, title: 'Ejecución del Presupuesto Participativo', progress: 45, target: '100%', status: 'delayed' },
  { id: 3, title: 'Digitalización de Trámites Comunales', progress: 92, target: '80%', status: 'completed' },
];

export const WebDashboard: React.FC = () => {
  return (
    <div className="flex flex-col h-full bg-slate-50 dark:bg-slate-900 transition-colors duration-300">
      {/* Dashboard Header */}
      <header className="bg-white dark:bg-slate-800 border-b border-gray-200 dark:border-slate-700 px-8 py-6">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold text-slate-800 dark:text-white">Panel de Gobernanza</h2>
            <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">Monitor público de directrices y transparencia</p>
          </div>
          <div className="flex gap-3">
            <button className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-slate-700 border border-gray-300 dark:border-slate-600 rounded-lg text-slate-600 dark:text-slate-200 text-sm font-medium hover:bg-gray-50 dark:hover:bg-slate-600 transition-colors">
              <span className="material-symbols-outlined text-lg">download</span>
              Memoria y Cuenta
            </button>
          </div>
        </div>
      </header>

      <div className="flex-1 overflow-auto p-8">
        
        {/* Top KPIs */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          {MOCK_KPIS.map((kpi, idx) => (
            <div key={idx} className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-gray-200 dark:border-slate-700 shadow-sm">
              <div className="flex justify-between items-start mb-2">
                <p className="text-sm font-medium text-slate-500 dark:text-slate-400">{kpi.label}</p>
                <span className={`text-xs px-2 py-1 rounded-full font-bold ${kpi.trend === 'up' ? 'bg-green-50 dark:bg-green-900/30 text-brand-green dark:text-green-400' : 'bg-red-50 dark:bg-red-900/30 text-red-500 dark:text-red-400'}`}>
                  {kpi.change}
                </span>
              </div>
              <h3 className="text-3xl font-bold text-slate-800 dark:text-white">{kpi.value}</h3>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Main Column: Strategic Guidelines */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* Goals Progress */}
            <div className="bg-white dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-slate-700 shadow-sm p-6">
               <h3 className="font-bold text-slate-800 dark:text-white mb-6 flex items-center gap-2">
                  <span className="material-symbols-outlined text-brand-blue">flag</span>
                  Cumplimiento del Plan Comunal
               </h3>
               <div className="space-y-6">
                  {GOV_GOALS.map(goal => (
                    <div key={goal.id}>
                      <div className="flex justify-between mb-2">
                        <span className="text-sm font-bold text-slate-700 dark:text-slate-300">{goal.title}</span>
                        <span className={`text-xs font-bold px-2 py-0.5 rounded ${
                          goal.status === 'completed' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' :
                          goal.status === 'delayed' ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' :
                          'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
                        }`}>
                          {goal.progress}% / Meta: {goal.target}
                        </span>
                      </div>
                      <div className="h-3 bg-gray-100 dark:bg-slate-700 rounded-full overflow-hidden">
                        <div 
                          className={`h-full rounded-full transition-all duration-1000 ${
                            goal.status === 'completed' ? 'bg-brand-green' :
                            goal.status === 'delayed' ? 'bg-red-500' : 'bg-brand-blue'
                          }`} 
                          style={{ width: `${goal.progress}%` }}
                        ></div>
                      </div>
                      <p className="text-xs text-slate-400 mt-1">
                        {goal.status === 'delayed' ? 'Alerta: Requiere atención prioritaria del consejo comunal.' : 'Ejecución acorde a los tiempos establecidos.'}
                      </p>
                    </div>
                  ))}
               </div>
            </div>

            {/* Budget Visualization (Simple Mock) */}
            <div className="bg-white dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-slate-700 shadow-sm p-6">
                <h3 className="font-bold text-slate-800 dark:text-white mb-4 flex items-center gap-2">
                  <span className="material-symbols-outlined text-brand-orange">pie_chart</span>
                  Distribución del Presupuesto
               </h3>
               <div className="flex flex-col md:flex-row gap-8 items-center">
                  <div className="w-48 h-48 rounded-full border-[16px] border-l-brand-blue border-t-brand-green border-r-orange-400 border-b-gray-200 dark:border-b-slate-600 box-content"></div>
                  <div className="flex-1 grid grid-cols-2 gap-4">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-brand-blue rounded-full"></div>
                        <div>
                          <p className="text-xs text-slate-500">Infraestructura</p>
                          <p className="font-bold text-slate-800 dark:text-white">45%</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-brand-green rounded-full"></div>
                        <div>
                          <p className="text-xs text-slate-500">Salud</p>
                          <p className="font-bold text-slate-800 dark:text-white">30%</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-orange-400 rounded-full"></div>
                        <div>
                          <p className="text-xs text-slate-500">Cultura</p>
                          <p className="font-bold text-slate-800 dark:text-white">15%</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-gray-200 dark:bg-slate-600 rounded-full"></div>
                        <div>
                          <p className="text-xs text-slate-500">Reserva</p>
                          <p className="font-bold text-slate-800 dark:text-white">10%</p>
                        </div>
                      </div>
                  </div>
               </div>
            </div>

          </div>

          {/* Sidebar Column: Recent Decisions */}
          <div className="bg-white dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-slate-700 shadow-sm p-6">
            <h3 className="font-bold text-slate-800 dark:text-white mb-4">Últimas Decisiones</h3>
            <div className="space-y-6 relative before:absolute before:inset-0 before:ml-2.5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-slate-300 before:to-transparent">
              
              <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                <div className="flex items-center justify-center w-5 h-5 rounded-full border border-white bg-slate-300 group-[.is-active]:bg-brand-blue text-slate-500 group-[.is-active]:text-white shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10"></div>
                <div className="w-[calc(100%-3rem)] bg-gray-50 dark:bg-slate-700/50 p-3 rounded-lg border border-gray-100 dark:border-slate-700">
                  <div className="flex items-center justify-between space-x-2 mb-1">
                    <div className="font-bold text-slate-900 dark:text-slate-100 text-sm">Aprobación de Recursos</div>
                  </div>
                  <div className="text-xs text-slate-500 dark:text-slate-400">Hace 2 días • Asamblea General</div>
                </div>
              </div>

               <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group">
                <div className="flex items-center justify-center w-5 h-5 rounded-full border border-white bg-slate-300 text-slate-500 shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10"></div>
                <div className="w-[calc(100%-3rem)] bg-gray-50 dark:bg-slate-700/50 p-3 rounded-lg border border-gray-100 dark:border-slate-700">
                  <div className="flex items-center justify-between space-x-2 mb-1">
                    <div className="font-bold text-slate-900 dark:text-slate-100 text-sm">Cierre de Votación #102</div>
                  </div>
                  <div className="text-xs text-slate-500 dark:text-slate-400">Hace 5 días • Automático</div>
                </div>
              </div>

               <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group">
                <div className="flex items-center justify-center w-5 h-5 rounded-full border border-white bg-slate-300 text-slate-500 shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10"></div>
                <div className="w-[calc(100%-3rem)] bg-gray-50 dark:bg-slate-700/50 p-3 rounded-lg border border-gray-100 dark:border-slate-700">
                  <div className="flex items-center justify-between space-x-2 mb-1">
                    <div className="font-bold text-slate-900 dark:text-slate-100 text-sm">Inicio Censo Salud</div>
                  </div>
                  <div className="text-xs text-slate-500 dark:text-slate-400">Hace 1 semana • Comité Salud</div>
                </div>
              </div>

            </div>
          </div>

        </div>
      </div>
      
      {/* Footer */}
      <footer className="bg-white dark:bg-slate-800 border-t border-gray-200 dark:border-slate-700 px-8 py-6 text-center text-slate-400 dark:text-slate-500 text-sm transition-colors">
        <p>&copy; 2023 Comuna Banco Obrero Inteligente. Plataforma de Código Abierto.</p>
      </footer>
    </div>
  );
};