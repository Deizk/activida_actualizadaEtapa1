import React from 'react';

const SYSTEM_LOGS = [
  { id: 1, version: 'v1.2.4', date: '2023-10-25', type: 'fix', title: 'Corrección en Geolocalización', desc: 'Se calibró el margen de error del GPS en reportes móviles.' },
  { id: 2, version: 'v1.2.3', date: '2023-10-20', type: 'feature', title: 'Módulo de Salud Beta', desc: 'Despliegue inicial del registro de historias médicas y farmacia.' },
  { id: 3, version: 'v1.2.0', date: '2023-10-15', type: 'ai_update', title: 'Reentrenamiento Modelo NLP', desc: 'Mejora del 15% en la detección de urgencias en textos cortos.' },
];

const AI_MODELS = [
  { name: 'Clasificador de Incidencias', status: 'active', accuracy: '94.2%', lastTrain: '15 Oct 2023', version: '2.4.0' },
  { name: 'Priorizador de Emergencias', status: 'active', accuracy: '98.5%', lastTrain: '20 Oct 2023', version: '1.8.1' },
  { name: 'Detector de Anomalías (Fraude)', status: 'training', accuracy: '82.0%', lastTrain: 'En proceso...', version: '0.9.0-beta' },
];

export const AiRegistry: React.FC = () => {
  return (
    <div className="flex flex-col h-full bg-slate-50 dark:bg-slate-900 transition-colors duration-300 animate-fade-in-up">
      <header className="bg-white dark:bg-slate-800 border-b border-gray-200 dark:border-slate-700 px-8 py-6">
        <div className="flex items-center gap-3">
             <div className="w-10 h-10 rounded-lg bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
                <span className="material-symbols-outlined text-2xl">fact_check</span>
             </div>
             <div>
                <h2 className="text-2xl font-bold text-slate-800 dark:text-white">Registro IA & Protocolos</h2>
                <p className="text-slate-500 dark:text-slate-400 text-sm">Bitácora técnica de actualizaciones y modelos</p>
             </div>
        </div>
      </header>

      <div className="flex-1 overflow-auto p-8 grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Left: Platform Changelog */}
        <section>
            <h3 className="font-bold text-slate-800 dark:text-white mb-4 flex items-center gap-2">
                <span className="material-symbols-outlined text-slate-400">history</span>
                Historial de Versiones
            </h3>
            <div className="space-y-4">
                {SYSTEM_LOGS.map(log => (
                    <div key={log.id} className="bg-white dark:bg-slate-800 p-5 rounded-xl border border-gray-200 dark:border-slate-700 shadow-sm relative overflow-hidden">
                        <div className={`absolute left-0 top-0 bottom-0 w-1 ${
                            log.type === 'fix' ? 'bg-orange-400' : log.type === 'feature' ? 'bg-green-500' : 'bg-purple-500'
                        }`}></div>
                        <div className="flex justify-between items-start mb-2">
                            <div className="flex items-center gap-2">
                                <span className="font-mono text-xs font-bold bg-slate-100 dark:bg-slate-700 px-2 py-1 rounded text-slate-600 dark:text-slate-300">{log.version}</span>
                                <span className="text-xs text-slate-400">{log.date}</span>
                            </div>
                            <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded ${
                                log.type === 'fix' ? 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400' : 
                                log.type === 'feature' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' : 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400'
                            }`}>
                                {log.type === 'ai_update' ? 'IA Update' : log.type}
                            </span>
                        </div>
                        <h4 className="font-bold text-slate-800 dark:text-white mb-1">{log.title}</h4>
                        <p className="text-sm text-slate-500 dark:text-slate-400">{log.desc}</p>
                    </div>
                ))}
            </div>
        </section>

        {/* Right: AI Health Monitor */}
        <section>
            <h3 className="font-bold text-slate-800 dark:text-white mb-4 flex items-center gap-2">
                <span className="material-symbols-outlined text-indigo-500">smart_toy</span>
                Estado de Modelos IA
            </h3>
            <div className="bg-slate-900 text-slate-300 rounded-xl p-6 shadow-lg font-mono text-sm relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4 opacity-20">
                    <span className="material-symbols-outlined text-6xl">memory</span>
                </div>
                
                <div className="space-y-6 relative z-10">
                    {AI_MODELS.map((model, idx) => (
                        <div key={idx} className="border-b border-slate-700 pb-4 last:border-0 last:pb-0">
                            <div className="flex justify-between items-center mb-2">
                                <span className="text-white font-bold">{model.name}</span>
                                <span className={`w-2 h-2 rounded-full ${model.status === 'active' ? 'bg-green-500 animate-pulse' : 'bg-yellow-500'}`}></span>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <p className="text-xs text-slate-500 uppercase">Precisión</p>
                                    <p className="text-green-400">{model.accuracy}</p>
                                </div>
                                <div>
                                    <p className="text-xs text-slate-500 uppercase">Versión</p>
                                    <p className="text-indigo-400">{model.version}</p>
                                </div>
                                <div className="col-span-2">
                                    <p className="text-xs text-slate-500 uppercase">Último Entrenamiento</p>
                                    <p>{model.lastTrain}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
                
                <div className="mt-6 pt-4 border-t border-slate-700 text-center">
                    <button className="text-xs bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded transition-colors">
                        Iniciar Diagnóstico Completo
                    </button>
                </div>
            </div>
        </section>

      </div>
    </div>
  );
};