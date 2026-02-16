import React, { useState } from 'react';

export const ImpactView: React.FC = () => {
  const [optimizationState, setOptimizationState] = useState<'idle' | 'processing' | 'active'>('idle');

  const handleApplyCorrection = () => {
    setOptimizationState('processing');
    
    // Simulate AI model reconfiguration delay
    setTimeout(() => {
        setOptimizationState('active');
    }, 2500);
  };

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
        
        {/* The AI Insight Card (Dynamic) */}
        <div className={`rounded-2xl p-6 md:p-8 text-white shadow-xl mb-8 relative overflow-hidden border transition-all duration-500 ${
            optimizationState === 'active' 
            ? 'bg-gradient-to-r from-teal-900 to-emerald-900 border-teal-700' 
            : 'bg-gradient-to-r from-slate-900 to-slate-800 border-slate-700'
        }`}>
            <div className="absolute top-0 right-0 w-64 h-64 bg-teal-500/10 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none"></div>
            
            <div className="relative z-10 flex flex-col md:flex-row gap-6 items-start">
                <div className={`w-16 h-16 rounded-2xl flex items-center justify-center shrink-0 border shadow-[0_0_15px_rgba(20,184,166,0.3)] transition-colors duration-500 ${
                    optimizationState === 'active' 
                    ? 'bg-emerald-500/20 border-emerald-500/30 text-emerald-400' 
                    : 'bg-teal-500/20 border-teal-500/30 text-teal-400'
                }`}>
                    {optimizationState === 'processing' ? (
                        <span className="material-symbols-outlined text-4xl animate-spin">settings</span>
                    ) : optimizationState === 'active' ? (
                        <span className="material-symbols-outlined text-4xl animate-fade-in-up">check_circle</span>
                    ) : (
                        <span className="material-symbols-outlined text-4xl animate-pulse">auto_fix_high</span>
                    )}
                </div>
                
                <div className="flex-1">
                    {optimizationState === 'active' ? (
                        <div className="animate-fade-in-up">
                            <h3 className="text-xl font-bold text-emerald-50 mb-2">Optimización Aplicada Exitosamente</h3>
                            <p className="text-emerald-100/80 text-sm leading-relaxed mb-4">
                                El filtro de agrupación geo-temporal está activo. El sistema ahora fusiona automáticamente reportes similares en tiempo real.
                            </p>
                            <div className="grid grid-cols-3 gap-4 bg-emerald-950/30 p-4 rounded-xl border border-emerald-500/20">
                                <div>
                                    <p className="text-xs text-emerald-400 uppercase font-bold">Duplicados Evitados</p>
                                    <p className="text-2xl font-black text-white">12</p>
                                </div>
                                <div>
                                    <p className="text-xs text-emerald-400 uppercase font-bold">Carga de Moderación</p>
                                    <p className="text-2xl font-black text-white">-18%</p>
                                </div>
                                <div>
                                    <p className="text-xs text-emerald-400 uppercase font-bold">Estado</p>
                                    <p className="text-sm font-bold text-white flex items-center gap-1 mt-1">
                                        <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                                        Monitoreando
                                    </p>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <>
                            <h3 className="text-xl font-bold text-teal-50 mb-2">Diagnóstico del Sistema IA</h3>
                            <p className="text-slate-300 text-sm leading-relaxed mb-4">
                                "He analizado los últimos 500 reportes. He notado que el <strong className="text-white">20% de las incidencias de 'Agua' son duplicadas</strong> en un rango de 24 horas. Esto está saturando la cola de moderación humana."
                            </p>
                            
                            <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                                <p className="text-xs font-bold text-teal-400 uppercase tracking-widest mb-2 flex items-center gap-2">
                                    <span className="material-symbols-outlined text-sm">lightbulb</span>
                                    Sugerencia de Corrección
                                </p>
                                <p className="text-sm font-medium text-slate-200">
                                    Implementar filtro de agrupación: Si un usuario reporta una avería en un <span className="text-white font-bold">radio de 50m</span> de un reporte existente (con antigüedad menor a <span className="text-white font-bold">4 horas</span>), adherirse al reporte existente automáticamente en lugar de crear uno nuevo.
                                </p>
                                
                                <div className="mt-4 flex gap-3">
                                    <button 
                                        onClick={handleApplyCorrection}
                                        disabled={optimizationState === 'processing'}
                                        className={`bg-teal-600 hover:bg-teal-500 text-white px-5 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-2 shadow-lg shadow-teal-900/50 ${optimizationState === 'processing' ? 'opacity-80 cursor-wait' : ''}`}
                                    >
                                        {optimizationState === 'processing' ? (
                                            <>
                                                <span className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                                                Reconfigurando Modelo...
                                            </>
                                        ) : (
                                            <>
                                                <span className="material-symbols-outlined text-sm">build</span>
                                                Aplicar Corrección
                                            </>
                                        )}
                                    </button>
                                    <button 
                                        disabled={optimizationState === 'processing'}
                                        className="bg-transparent border border-slate-500 text-slate-300 hover:bg-white/5 px-4 py-2 rounded-lg text-xs font-bold transition-colors"
                                    >
                                        Ignorar Alerta
                                    </button>
                                </div>
                            </div>
                        </>
                    )}
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