import React from 'react';

export const ImpactView: React.FC = () => {
  return (
    <div className="flex flex-col h-full bg-slate-50 dark:bg-slate-900 transition-colors duration-300 animate-fade-in-up">
      <header className="bg-white dark:bg-slate-800 border-b border-gray-200 dark:border-slate-700 px-8 py-6">
        <div className="flex items-center gap-3">
             <div className="w-10 h-10 rounded-lg bg-teal-100 dark:bg-teal-900/30 flex items-center justify-center text-teal-600 dark:text-teal-400">
                <span className="material-symbols-outlined text-2xl">query_stats</span>
             </div>
             <div>
                <h2 className="text-2xl font-bold text-slate-800 dark:text-white">Análisis de Impacto</h2>
                <p className="text-slate-500 dark:text-slate-400 text-sm">Diagnóstico inteligente de eficacia y satisfacción</p>
             </div>
        </div>
      </header>

      <div className="flex-1 overflow-auto p-8">
        
        {/* The AI Insight Card */}
        <div className="bg-gradient-to-r from-slate-900 to-slate-800 rounded-2xl p-6 md:p-8 text-white shadow-xl mb-8 relative overflow-hidden border border-slate-700">
            <div className="absolute top-0 right-0 w-64 h-64 bg-teal-500/10 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none"></div>
            
            <div className="relative z-10 flex flex-col md:flex-row gap-6 items-start">
                <div className="w-16 h-16 rounded-2xl bg-teal-500/20 flex items-center justify-center shrink-0 border border-teal-500/30 shadow-[0_0_15px_rgba(20,184,166,0.3)]">
                    <span className="material-symbols-outlined text-4xl text-teal-400 animate-pulse">auto_fix_high</span>
                </div>
                <div className="flex-1">
                    <h3 className="text-xl font-bold text-teal-50 mb-2">Diagnóstico del Sistema IA</h3>
                    <p className="text-slate-300 text-sm leading-relaxed mb-4">
                        "He analizado los últimos 500 reportes. He notado que el <strong className="text-white">20% de las incidencias de 'Agua' son duplicadas</strong> en un rango de 24 horas. Esto está saturando la cola de moderación humana."
                    </p>
                    
                    <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                        <p className="text-xs font-bold text-teal-400 uppercase tracking-widest mb-2">Sugerencia de Corrección</p>
                        <p className="text-sm font-medium">Implementar un filtro de agrupación temporal: Si un usuario reporta una avería de agua en un radio de 50m de un reporte existente (menos de 4h), sugerir "Adherirse al reporte existente" en lugar de crear uno nuevo.</p>
                        <div className="mt-3 flex gap-3">
                            <button className="bg-teal-600 hover:bg-teal-500 text-white px-4 py-1.5 rounded-lg text-xs font-bold transition-colors">Aplicar Corrección</button>
                            <button className="bg-transparent border border-slate-500 text-slate-300 hover:bg-white/5 px-4 py-1.5 rounded-lg text-xs font-bold transition-colors">Ignorar</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            
            {/* Success Area */}
            <div className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-gray-200 dark:border-slate-700 shadow-sm">
                <div className="flex items-center gap-2 mb-4">
                    <span className="material-symbols-outlined text-green-500">check_circle</span>
                    <h4 className="font-bold text-slate-800 dark:text-white">Interacciones Exitosas</h4>
                </div>
                <div className="text-4xl font-black text-slate-800 dark:text-white mb-2">85%</div>
                <p className="text-sm text-slate-500 dark:text-slate-400">De los usuarios completan su reporte en menos de 2 minutos.</p>
                <div className="mt-4 h-2 bg-gray-100 dark:bg-slate-700 rounded-full overflow-hidden">
                    <div className="h-full bg-green-500 w-[85%]"></div>
                </div>
            </div>

            {/* Friction Area */}
            <div className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-gray-200 dark:border-slate-700 shadow-sm">
                <div className="flex items-center gap-2 mb-4">
                    <span className="material-symbols-outlined text-orange-500">warning</span>
                    <h4 className="font-bold text-slate-800 dark:text-white">Puntos de Fricción</h4>
                </div>
                <div className="text-4xl font-black text-slate-800 dark:text-white mb-2">12%</div>
                <p className="text-sm text-slate-500 dark:text-slate-400">De abandonos ocurren en la pantalla de "Carga de Foto".</p>
                <div className="mt-4 h-2 bg-gray-100 dark:bg-slate-700 rounded-full overflow-hidden">
                    <div className="h-full bg-orange-500 w-[12%]"></div>
                </div>
                <p className="text-xs text-orange-500 mt-2 font-bold">Posible causa: Tiempos de carga lentos en 3G.</p>
            </div>

            {/* Failure Area */}
            <div className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-gray-200 dark:border-slate-700 shadow-sm">
                <div className="flex items-center gap-2 mb-4">
                    <span className="material-symbols-outlined text-red-500">error</span>
                    <h4 className="font-bold text-slate-800 dark:text-white">Tasa de Rechazo</h4>
                </div>
                <div className="text-4xl font-black text-slate-800 dark:text-white mb-2">3%</div>
                <p className="text-sm text-slate-500 dark:text-slate-400">Reportes marcados como "Spam" o "No procede" por la IA.</p>
                <div className="mt-4 h-2 bg-gray-100 dark:bg-slate-700 rounded-full overflow-hidden">
                    <div className="h-full bg-red-500 w-[3%]"></div>
                </div>
            </div>

        </div>

      </div>
    </div>
  );
};