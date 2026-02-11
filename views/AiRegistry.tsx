import React, { useState, useEffect } from 'react';

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
  const [isDiagnosing, setIsDiagnosing] = useState(false);
  const [showDiagnosisModal, setShowDiagnosisModal] = useState(false);
  const [diagnosisStep, setDiagnosisStep] = useState(0);

  const DIAGNOSIS_STEPS = [
      "Inicializando protocolos de prueba...",
      "Verificando integridad de datasets (Hash SHA-256)...",
      "Evaluando latencia de inferencia en nodos borde...",
      "Analizando métricas de sesgo cognitivo...",
      "Compilando reporte de rendimiento..."
  ];

  const handleRunDiagnosis = () => {
      setIsDiagnosing(true);
      setShowDiagnosisModal(true);
      setDiagnosisStep(0);
  };

  useEffect(() => {
      if (isDiagnosing && showDiagnosisModal) {
          if (diagnosisStep < DIAGNOSIS_STEPS.length) {
              const timer = setTimeout(() => {
                  setDiagnosisStep(prev => prev + 1);
              }, 1200); // 1.2s per step
              return () => clearTimeout(timer);
          } else {
              setIsDiagnosing(false);
          }
      }
  }, [isDiagnosing, showDiagnosisModal, diagnosisStep]);

  return (
    <div className="flex flex-col h-full bg-slate-50 dark:bg-slate-900 transition-colors duration-300 animate-fade-in-up relative">
      
      {/* --- DIAGNOSIS MODAL --- */}
      {showDiagnosisModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-sm animate-fade-in-up">
            <div className="bg-slate-900 w-full max-w-lg rounded-2xl shadow-2xl border border-indigo-500/30 overflow-hidden relative">
                {/* Background Grid Animation Effect */}
                <div className="absolute inset-0 bg-[linear-gradient(rgba(19,23,39,0.9)_2px,transparent_2px),linear-gradient(90deg,rgba(19,23,39,0.9)_2px,transparent_2px)] bg-[size:30px_30px] opacity-20 pointer-events-none"></div>
                
                <div className="p-6 relative z-10">
                    <div className="flex justify-between items-center mb-6 border-b border-indigo-500/30 pb-4">
                        <div className="flex items-center gap-3">
                            <span className={`material-symbols-outlined text-2xl ${isDiagnosing ? 'animate-spin text-indigo-400' : 'text-green-400'}`}>
                                {isDiagnosing ? 'settings_suggest' : 'check_circle'}
                            </span>
                            <h3 className="text-xl font-bold text-white font-mono">
                                {isDiagnosing ? 'DIAGNÓSTICO EN CURSO' : 'REPORTE FINALIZADO'}
                            </h3>
                        </div>
                        {!isDiagnosing && (
                            <button onClick={() => setShowDiagnosisModal(false)} className="text-slate-400 hover:text-white">
                                <span className="material-symbols-outlined">close</span>
                            </button>
                        )}
                    </div>

                    <div className="space-y-4 font-mono text-sm mb-6 bg-black/30 p-4 rounded-lg border border-indigo-900/50 h-64 overflow-y-auto">
                        {DIAGNOSIS_STEPS.map((step, idx) => (
                            <div key={idx} className={`flex items-center gap-3 transition-opacity duration-500 ${idx > diagnosisStep ? 'opacity-0' : 'opacity-100'}`}>
                                <span className={`text-xs ${idx < diagnosisStep ? 'text-green-500' : idx === diagnosisStep ? 'text-indigo-400 animate-pulse' : 'text-slate-600'}`}>
                                    {idx < diagnosisStep ? '[OK]' : idx === diagnosisStep ? '>>' : '..'}
                                </span>
                                <span className={idx === diagnosisStep ? 'text-white font-bold' : 'text-slate-400'}>
                                    {step}
                                </span>
                            </div>
                        ))}
                        {!isDiagnosing && (
                             <div className="mt-4 border-t border-dashed border-slate-600 pt-4 animate-fade-in-up">
                                <p className="text-green-400 font-bold mb-1">RESULTADO: ÓPTIMO</p>
                                <p className="text-slate-300 text-xs leading-relaxed">
                                    Todos los modelos operativos dentro de los parámetros nominales. 
                                    Se detectó una leve desviación (0.4%) en el modelo de Detección de Fraude, 
                                    se ha programado una recalibración automática para las 03:00 AM.
                                </p>
                             </div>
                        )}
                    </div>

                    <div className="flex justify-end">
                        <button 
                            onClick={() => setShowDiagnosisModal(false)}
                            disabled={isDiagnosing}
                            className={`px-6 py-2 rounded-lg font-bold text-sm transition-all ${
                                isDiagnosing 
                                ? 'bg-slate-700 text-slate-500 cursor-wait' 
                                : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-500/20'
                            }`}
                        >
                            {isDiagnosing ? 'Procesando...' : 'Cerrar Reporte'}
                        </button>
                    </div>
                </div>
                
                {/* Scanning Line Animation */}
                {isDiagnosing && (
                    <div className="absolute top-0 left-0 w-full h-1 bg-indigo-500 animate-pulse"></div>
                )}
            </div>
        </div>
      )}

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
                    <button 
                        onClick={handleRunDiagnosis}
                        className="text-xs bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded transition-colors flex items-center justify-center gap-2 mx-auto"
                    >
                        <span className="material-symbols-outlined text-sm">bug_report</span>
                        Iniciar Diagnóstico Completo
                    </button>
                </div>
            </div>
        </section>

      </div>
    </div>
  );
};