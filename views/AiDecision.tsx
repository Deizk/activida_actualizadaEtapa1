import React from 'react';
import { MOCK_INCIDENTS } from '../constants';
import { IncidentPriority } from '../types';

export const AiDecision: React.FC = () => {
  // Filter incidents for display
  const highPriority = MOCK_INCIDENTS.filter(i => i.priority === IncidentPriority.HIGH);
  const otherPriority = MOCK_INCIDENTS.filter(i => i.priority !== IncidentPriority.HIGH);

  return (
    <div className="flex flex-col h-full bg-slate-50 dark:bg-slate-900 transition-colors duration-300">
      {/* Header */}
      <div className="bg-white dark:bg-slate-800 px-6 py-6 border-b border-gray-200 dark:border-slate-700">
        <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white shadow-lg shadow-indigo-500/30">
                <span className="material-symbols-outlined text-3xl animate-pulse">psychology</span>
            </div>
            <div>
                <h2 className="text-2xl font-bold text-slate-800 dark:text-white">Decisión IA</h2>
                <p className="text-sm text-slate-500 dark:text-slate-400">Motor de priorización y clasificación automática</p>
            </div>
        </div>
      </div>

      <div className="flex-1 overflow-auto p-4 md:p-6 space-y-8">
        
        {/* Metric Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
             <div className="bg-white dark:bg-slate-800 p-4 rounded-xl border border-gray-100 dark:border-slate-700 shadow-sm flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 flex items-center justify-center">
                    <span className="material-symbols-outlined">analytics</span>
                </div>
                <div>
                    <p className="text-xs text-slate-500 dark:text-slate-400 font-bold uppercase">Precisión del Modelo</p>
                    <p className="text-xl font-bold text-slate-800 dark:text-white">94.2%</p>
                </div>
             </div>
             <div className="bg-white dark:bg-slate-800 p-4 rounded-xl border border-gray-100 dark:border-slate-700 shadow-sm flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-orange-50 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400 flex items-center justify-center">
                    <span className="material-symbols-outlined">bolt</span>
                </div>
                <div>
                    <p className="text-xs text-slate-500 dark:text-slate-400 font-bold uppercase">Tiempo de Análisis</p>
                    <p className="text-xl font-bold text-slate-800 dark:text-white">~1.2s</p>
                </div>
             </div>
             <div className="bg-white dark:bg-slate-800 p-4 rounded-xl border border-gray-100 dark:border-slate-700 shadow-sm flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 flex items-center justify-center">
                    <span className="material-symbols-outlined">check_circle</span>
                </div>
                <div>
                    <p className="text-xs text-slate-500 dark:text-slate-400 font-bold uppercase">Reportes Procesados</p>
                    <p className="text-xl font-bold text-slate-800 dark:text-white">1,248</p>
                </div>
             </div>
        </div>

        {/* High Priority Section */}
        <section>
            <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-4 flex items-center gap-2">
                <span className="material-symbols-outlined text-red-500">priority_high</span>
                Prioridad Urgente (Acción Inmediata)
            </h3>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {highPriority.map(inc => (
                    <div key={inc.id} className="bg-red-50 dark:bg-red-900/10 border border-red-100 dark:border-red-900/30 rounded-2xl p-5 relative overflow-hidden group hover:shadow-md transition-all">
                        <div className="absolute top-0 right-0 w-24 h-24 bg-red-500/5 rounded-full -mr-10 -mt-10 group-hover:scale-150 transition-transform duration-500"></div>
                        
                        <div className="flex justify-between items-start mb-3 relative z-10">
                            <span className="bg-red-500 text-white text-[10px] font-bold px-2 py-1 rounded-full flex items-center gap-1 shadow-sm">
                                <span className="material-symbols-outlined text-[12px]">smart_toy</span>
                                IA SCORE: 98/100
                            </span>
                            <span className="text-xs font-mono text-red-700 dark:text-red-300">{inc.timestamp}</span>
                        </div>
                        
                        <h4 className="font-bold text-slate-800 dark:text-red-100 text-lg mb-1 relative z-10">{inc.category}</h4>
                        <p className="text-sm text-slate-600 dark:text-slate-300 mb-4 relative z-10">{inc.description}</p>
                        
                        <div className="bg-white/60 dark:bg-slate-800/60 p-3 rounded-xl backdrop-blur-sm border border-red-100 dark:border-red-900/30 relative z-10">
                            <p className="text-[10px] text-slate-400 dark:text-slate-500 font-bold uppercase mb-1">Motivo de Priorización</p>
                            <p className="text-xs font-medium text-slate-700 dark:text-slate-200 flex items-start gap-2">
                                <span className="material-symbols-outlined text-sm text-red-500 mt-0.5">auto_awesome</span>
                                {inc.aiJustification}
                            </p>
                        </div>

                        <div className="mt-4 flex gap-2 relative z-10">
                            <button className="flex-1 bg-red-600 hover:bg-red-700 text-white py-2 rounded-lg text-sm font-bold shadow-lg shadow-red-500/20 transition-colors">
                                Despachar Unidad
                            </button>
                            <button className="px-3 bg-white dark:bg-slate-700 border border-red-200 dark:border-slate-600 rounded-lg text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-slate-600 transition-colors">
                                <span className="material-symbols-outlined text-xl">edit</span>
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </section>

        {/* Standard Priority Section */}
        <section>
            <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-4 flex items-center gap-2">
                <span className="material-symbols-outlined text-blue-500">list</span>
                Cola General (Leve / Moderado)
            </h3>
            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-gray-200 dark:border-slate-700 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead className="bg-gray-50 dark:bg-slate-900/50 border-b border-gray-100 dark:border-slate-700 text-xs uppercase text-slate-500 dark:text-slate-400 font-semibold">
                            <tr>
                                <th className="p-4">Categoría</th>
                                <th className="p-4">Prioridad IA</th>
                                <th className="p-4 hidden md:table-cell">Análisis</th>
                                <th className="p-4 text-right">Acción</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 dark:divide-slate-700 text-sm">
                            {otherPriority.map(inc => (
                                <tr key={inc.id} className="hover:bg-gray-50 dark:hover:bg-slate-700/30 transition-colors">
                                    <td className="p-4">
                                        <p className="font-bold text-slate-800 dark:text-slate-200">{inc.category}</p>
                                        <p className="text-xs text-slate-500 dark:text-slate-400 truncate max-w-[200px]">{inc.description}</p>
                                    </td>
                                    <td className="p-4">
                                        <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                                            inc.priority === 'Media' 
                                            ? 'bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400' 
                                            : 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400'
                                        }`}>
                                            {inc.priority}
                                        </span>
                                    </td>
                                    <td className="p-4 hidden md:table-cell text-slate-600 dark:text-slate-300">
                                        {inc.aiJustification}
                                    </td>
                                    <td className="p-4 text-right">
                                        <button className="text-brand-blue dark:text-sky-400 hover:underline font-medium">Ver detalles</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </section>
      </div>
    </div>
  );
};