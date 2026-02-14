import React, { useState } from 'react';
import { MOCK_INCIDENTS } from '../constants';
import { Incident, IncidentPriority } from '../types';

export const AiDecision: React.FC = () => {
  // Convert mock to state to allow local manipulation (edit/dispatch)
  const [incidents, setIncidents] = useState<Incident[]>(MOCK_INCIDENTS);
  
  // Modal States
  const [viewingIncident, setViewingIncident] = useState<Incident | null>(null);
  const [editingIncident, setEditingIncident] = useState<Incident | null>(null);
  
  // Dispatch State (Track which IDs have been dispatched locally)
  const [dispatchedIds, setDispatchedIds] = useState<string[]>([]);

  // Filter incidents for display based on current state
  const highPriority = incidents.filter(i => i.priority === IncidentPriority.HIGH);
  const otherPriority = incidents.filter(i => i.priority !== IncidentPriority.HIGH);

  // Handlers
  const handleDispatch = (id: string) => {
    if (dispatchedIds.includes(id)) return;
    
    // Simulate API call
    const confirm = window.confirm("¿Confirmar despacho de unidad de respuesta inmediata?");
    if (confirm) {
        setDispatchedIds([...dispatchedIds, id]);
        // Optional: notification logic here
    }
  };

  const handleSaveEdit = (e: React.FormEvent) => {
      e.preventDefault();
      if (!editingIncident) return;

      setIncidents(prev => prev.map(inc => 
          inc.id === editingIncident.id ? editingIncident : inc
      ));
      setEditingIncident(null);
  };

  return (
    <div className="flex flex-col h-full bg-slate-50 dark:bg-slate-900 transition-colors duration-300 relative">
      
      {/* --- MODAL: EDIT INCIDENT (Urgent) --- */}
      {editingIncident && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in-up">
              <div className="bg-white dark:bg-slate-800 w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden border border-gray-100 dark:border-slate-700">
                  <div className="p-4 border-b border-gray-100 dark:border-slate-700 flex justify-between items-center bg-gray-50 dark:bg-slate-700/50">
                      <h3 className="font-bold text-lg text-slate-800 dark:text-white flex items-center gap-2">
                          <span className="material-symbols-outlined text-brand-blue">edit_note</span>
                          Editar Prioridad IA
                      </h3>
                      <button onClick={() => setEditingIncident(null)} className="p-1 rounded-full hover:bg-gray-200 dark:hover:bg-slate-600">
                          <span className="material-symbols-outlined">close</span>
                      </button>
                  </div>
                  <form onSubmit={handleSaveEdit} className="p-6 space-y-4">
                      <div>
                          <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase mb-1">Categoría</label>
                          <select 
                            value={editingIncident.category}
                            onChange={e => setEditingIncident({...editingIncident, category: e.target.value})}
                            className="w-full p-3 bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-600 rounded-xl outline-none text-slate-800 dark:text-white"
                          >
                              {['Alumbrado Público', 'Agua Potable', 'Aseo Urbano', 'Seguridad', 'Vialidad', 'Gas Doméstico'].map(c => (
                                  <option key={c} value={c}>{c}</option>
                              ))}
                          </select>
                      </div>
                      <div>
                          <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase mb-1">Nivel de Prioridad</label>
                          <div className="flex gap-2">
                              {[IncidentPriority.LOW, IncidentPriority.MEDIUM, IncidentPriority.HIGH].map(p => (
                                  <button
                                    key={p}
                                    type="button"
                                    onClick={() => setEditingIncident({...editingIncident, priority: p})}
                                    className={`flex-1 py-2 rounded-lg text-sm font-bold border transition-colors ${
                                        editingIncident.priority === p 
                                        ? p === IncidentPriority.HIGH ? 'bg-red-500 text-white border-red-500' : 'bg-brand-blue text-white border-brand-blue'
                                        : 'bg-white dark:bg-slate-800 text-slate-500 border-gray-200 dark:border-slate-600'
                                    }`}
                                  >
                                      {p}
                                  </button>
                              ))}
                          </div>
                          <p className="text-[10px] text-slate-400 mt-2">
                              Nota: Cambiar la prioridad moverá la incidencia de lista automáticamente.
                          </p>
                      </div>
                      <div>
                          <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase mb-1">Ajuste de Justificación (Override)</label>
                          <textarea 
                              value={editingIncident.aiJustification}
                              onChange={e => setEditingIncident({...editingIncident, aiJustification: e.target.value})}
                              className="w-full p-3 bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-600 rounded-xl outline-none text-slate-800 dark:text-white text-sm min-h-[80px]"
                          />
                      </div>
                      <div className="pt-2 flex gap-3">
                          <button type="button" onClick={() => setEditingIncident(null)} className="flex-1 py-3 text-slate-500 font-bold hover:bg-gray-100 rounded-xl">Cancelar</button>
                          <button type="submit" className="flex-1 py-3 bg-brand-blue text-white font-bold rounded-xl shadow-lg hover:bg-blue-700">Guardar Cambios</button>
                      </div>
                  </form>
              </div>
          </div>
      )}

      {/* --- MODAL: VIEW DETAILS (General Queue) --- */}
      {viewingIncident && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in-up">
              <div className="bg-white dark:bg-slate-800 w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden border border-gray-100 dark:border-slate-700 max-h-[90vh] flex flex-col">
                  {/* Modal Header */}
                  <div className="p-4 border-b border-gray-100 dark:border-slate-700 flex justify-between items-center sticky top-0 bg-white dark:bg-slate-800 z-10">
                      <div>
                          <h3 className="font-bold text-lg text-slate-800 dark:text-white flex items-center gap-2">
                              <span className="material-symbols-outlined text-slate-500">folder_open</span>
                              Expediente Digital #{viewingIncident.id}
                          </h3>
                          <p className="text-xs text-slate-500">{viewingIncident.timestamp} • {viewingIncident.category}</p>
                      </div>
                      <button onClick={() => setViewingIncident(null)} className="p-1.5 rounded-full hover:bg-gray-100 dark:hover:bg-slate-700">
                          <span className="material-symbols-outlined">close</span>
                      </button>
                  </div>

                  <div className="overflow-y-auto p-6 space-y-6">
                      {/* Map Placeholder */}
                      <div className="w-full h-48 bg-slate-100 dark:bg-slate-700 rounded-xl relative overflow-hidden group">
                           <div className="absolute inset-0 bg-[url('https://picsum.photos/800/400?grayscale')] bg-cover opacity-50"></div>
                           <div className="absolute inset-0 flex items-center justify-center">
                               <div className="w-8 h-8 bg-red-500 rounded-full border-4 border-white dark:border-slate-800 shadow-lg animate-bounce"></div>
                           </div>
                           <div className="absolute bottom-2 right-2 bg-white/80 dark:bg-slate-900/80 px-2 py-1 rounded text-xs font-mono font-bold">
                               Lat: {viewingIncident.lat}, Lng: {viewingIncident.lng}
                           </div>
                      </div>

                      {/* Main Info */}
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                          <div className="md:col-span-2">
                              <h4 className="text-sm font-bold text-slate-500 uppercase mb-2">Descripción del Reporte</h4>
                              <p className="text-slate-800 dark:text-white bg-gray-50 dark:bg-slate-700/30 p-4 rounded-xl border border-gray-100 dark:border-slate-700 text-sm leading-relaxed">
                                  {viewingIncident.description}
                              </p>
                          </div>
                          <div className="space-y-3">
                              <div className="bg-blue-50 dark:bg-blue-900/10 p-3 rounded-xl border border-blue-100 dark:border-blue-900/30">
                                  <p className="text-xs text-blue-600 dark:text-blue-400 font-bold uppercase mb-1">Estado</p>
                                  <p className="font-bold text-slate-800 dark:text-white">{viewingIncident.status}</p>
                              </div>
                              <div className={`p-3 rounded-xl border ${viewingIncident.priority === 'Alta' ? 'bg-red-50 border-red-100 text-red-700' : 'bg-orange-50 border-orange-100 text-orange-700'} dark:bg-slate-700/50 dark:border-slate-600`}>
                                  <p className="text-xs font-bold uppercase mb-1 opacity-70">Prioridad</p>
                                  <p className="font-bold">{viewingIncident.priority}</p>
                              </div>
                          </div>
                      </div>

                      {/* AI Analysis */}
                      <div className="bg-slate-50 dark:bg-slate-900/50 p-4 rounded-xl border border-slate-200 dark:border-slate-700 relative">
                           <span className="absolute -top-3 left-4 bg-brand-blue text-white text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                               <span className="material-symbols-outlined text-[12px]">psychology</span>
                               Análisis IA
                           </span>
                           <p className="text-sm text-slate-600 dark:text-slate-300 mt-2 italic">
                               "{viewingIncident.aiJustification}"
                           </p>
                      </div>
                  </div>

                  <div className="p-4 border-t border-gray-100 dark:border-slate-700 bg-gray-50 dark:bg-slate-800 flex justify-end gap-3">
                      <button className="px-4 py-2 text-slate-500 font-bold text-sm hover:text-slate-700">Archivar</button>
                      <button className="px-4 py-2 bg-brand-blue text-white font-bold text-sm rounded-lg hover:bg-sky-600 shadow-md">Asignar Cuadrilla</button>
                  </div>
              </div>
          </div>
      )}

      {/* Header */}
      <div className="bg-white dark:bg-slate-800 px-6 py-6 border-b border-gray-200 dark:border-slate-700 sticky top-0 z-10">
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
                    <p className="text-xl font-bold text-slate-800 dark:text-white">{incidents.length + 1240}</p>
                </div>
             </div>
        </div>

        {/* High Priority Section */}
        <section>
            <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-4 flex items-center gap-2">
                <span className="material-symbols-outlined text-red-500">priority_high</span>
                Prioridad Urgente (Acción Inmediata)
            </h3>
            
            {highPriority.length === 0 ? (
                <div className="p-8 text-center bg-white dark:bg-slate-800 rounded-2xl border border-dashed border-gray-200 dark:border-slate-700 text-slate-400">
                    <span className="material-symbols-outlined text-4xl mb-2">check_circle</span>
                    <p>No hay incidentes urgentes pendientes.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    {highPriority.map(inc => {
                        const isDispatched = dispatchedIds.includes(inc.id);
                        return (
                            <div key={inc.id} className={`bg-red-50 dark:bg-red-900/10 border border-red-100 dark:border-red-900/30 rounded-2xl p-5 relative overflow-hidden group hover:shadow-md transition-all ${isDispatched ? 'opacity-75' : ''}`}>
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
                                    <button 
                                        onClick={() => handleDispatch(inc.id)}
                                        disabled={isDispatched}
                                        className={`flex-1 py-2 rounded-lg text-sm font-bold shadow-lg transition-all flex items-center justify-center gap-2 ${
                                            isDispatched 
                                            ? 'bg-green-600 text-white cursor-default shadow-green-500/20' 
                                            : 'bg-red-600 hover:bg-red-700 text-white shadow-red-500/20'
                                        }`}
                                    >
                                        {isDispatched ? (
                                            <>
                                                <span className="material-symbols-outlined text-lg">local_shipping</span>
                                                Unidad en Camino
                                            </>
                                        ) : (
                                            <>
                                                <span className="material-symbols-outlined text-lg">send</span>
                                                Despachar Unidad
                                            </>
                                        )}
                                    </button>
                                    <button 
                                        onClick={() => setEditingIncident(inc)}
                                        className="px-3 bg-white dark:bg-slate-700 border border-red-200 dark:border-slate-600 rounded-lg text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-slate-600 transition-colors"
                                    >
                                        <span className="material-symbols-outlined text-xl">edit</span>
                                    </button>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
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
                                        <button 
                                            onClick={() => setViewingIncident(inc)}
                                            className="text-brand-blue dark:text-sky-400 hover:underline font-bold text-xs flex items-center justify-end gap-1 ml-auto"
                                        >
                                            Ver detalles
                                            <span className="material-symbols-outlined text-sm">visibility</span>
                                        </button>
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