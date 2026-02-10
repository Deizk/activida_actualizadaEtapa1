import React, { useState } from 'react';

// Mock Data specific to this view
const MOCK_VACCINES = [
  { id: 1, name: 'COVID-19 (Refuerzo)', date: '15/03/2023', status: 'completed' },
  { id: 2, name: 'Influenza Estacional', date: '10/11/2022', status: 'completed' },
  { id: 3, name: 'Toxoide Tetánico', date: 'Pendiente', status: 'pending' },
];

const MOCK_CONDITIONS = [
  { id: 1, name: 'Hipertensión Arterial', type: 'Crónica' },
  { id: 2, name: 'Alergia a Penicilina', type: 'Alergia' },
];

const MOCK_CENTERS = [
  { id: 1, name: 'CDI Banco Obrero', type: 'CDI', status: 'operational', waitTime: '15 min', supplies: 'high' },
  { id: 2, name: 'Ambulatorio Los Bloques', type: 'Ambulatorio', status: 'limited', waitTime: '45 min', supplies: 'low' },
  { id: 3, name: 'Farmacia Popular', type: 'Farmacia', status: 'closed', waitTime: '-', supplies: 'none' },
];

const MOCK_CAMPAIGNS = [
  { id: 1, title: 'Vacunación Polio y Sarampión', date: 'Sáb 20 Oct', target: ['Niños', 'Niñas'], location: 'Plaza Bolívar' },
  { id: 2, title: 'Despistaje de Diabetes', date: 'Dom 21 Oct', target: ['Adultos Mayores', 'Adultos'], location: 'Casa Comunal' },
  { id: 3, title: 'Charla Salud Sexual', date: 'Vie 26 Oct', target: ['Adolescentes'], location: 'Liceo' },
];

export const HealthView: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'personal' | 'community'>('personal');

  return (
    <div className="flex flex-col h-full bg-slate-50 dark:bg-slate-900 transition-colors duration-300">
      
      {/* Header */}
      <div className="bg-white dark:bg-slate-800 px-6 py-6 border-b border-gray-200 dark:border-slate-700">
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-rose-100 dark:bg-rose-900/20 flex items-center justify-center text-rose-600 dark:text-rose-400">
                  <span className="material-symbols-outlined text-3xl">cardiology</span>
              </div>
              <div>
                  <h2 className="text-2xl font-bold text-slate-800 dark:text-white">Salud y Bienestar</h2>
                  <p className="text-sm text-slate-500 dark:text-slate-400">Gestión personal y comunitaria</p>
              </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex p-1 bg-slate-100 dark:bg-slate-700/50 rounded-xl">
          <button
            onClick={() => setActiveTab('personal')}
            className={`flex-1 py-2.5 text-sm font-bold rounded-lg transition-all flex items-center justify-center gap-2 ${
              activeTab === 'personal'
                ? 'bg-white dark:bg-slate-600 text-rose-600 dark:text-white shadow-sm'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'
            }`}
          >
            <span className="material-symbols-outlined text-lg">person</span>
            Mi Ficha Médica
          </button>
          <button
            onClick={() => setActiveTab('community')}
            className={`flex-1 py-2.5 text-sm font-bold rounded-lg transition-all flex items-center justify-center gap-2 ${
              activeTab === 'community'
                ? 'bg-white dark:bg-slate-600 text-rose-600 dark:text-white shadow-sm'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'
            }`}
          >
            <span className="material-symbols-outlined text-lg">groups</span>
            Salud Comunal
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-auto p-4 md:p-6">
        
        {/* PERSONAL TAB */}
        {activeTab === 'personal' && (
          <div className="space-y-6 animate-fade-in-up">
            
            {/* Vitals Card */}
            <section className="bg-gradient-to-br from-rose-500 to-pink-600 rounded-2xl p-6 text-white shadow-lg relative overflow-hidden">
               <div className="absolute top-0 right-0 p-4 opacity-10">
                  <span className="material-symbols-outlined text-9xl -mr-4 -mt-4">medical_services</span>
               </div>
               <div className="flex justify-between items-start relative z-10">
                  <div>
                    <h3 className="text-lg font-bold opacity-90">María González</h3>
                    <p className="text-sm opacity-80">C.I. 12.345.678</p>
                  </div>
                  <button className="bg-white/20 hover:bg-white/30 p-2 rounded-lg backdrop-blur-sm transition-colors">
                    <span className="material-symbols-outlined">edit</span>
                  </button>
               </div>
               
               <div className="grid grid-cols-3 gap-4 mt-6 relative z-10">
                  <div className="bg-white/10 rounded-xl p-3 backdrop-blur-sm">
                    <p className="text-xs font-bold opacity-70 uppercase">Sangre</p>
                    <p className="text-2xl font-bold">O+</p>
                  </div>
                  <div className="bg-white/10 rounded-xl p-3 backdrop-blur-sm">
                    <p className="text-xs font-bold opacity-70 uppercase">Edad</p>
                    <p className="text-2xl font-bold">34 <span className="text-sm font-normal">años</span></p>
                  </div>
                  <div className="bg-white/10 rounded-xl p-3 backdrop-blur-sm">
                    <p className="text-xs font-bold opacity-70 uppercase">Peso</p>
                    <p className="text-2xl font-bold">65 <span className="text-sm font-normal">kg</span></p>
                  </div>
               </div>
            </section>

            {/* Conditions & Disabilities */}
            <section>
              <h3 className="font-bold text-slate-800 dark:text-white mb-3 flex items-center gap-2">
                <span className="material-symbols-outlined text-rose-500">assignment_late</span>
                Condiciones y Discapacidades
              </h3>
              <div className="bg-white dark:bg-slate-800 rounded-xl border border-gray-100 dark:border-slate-700 shadow-sm p-4">
                 {MOCK_CONDITIONS.length > 0 ? (
                   <div className="flex flex-wrap gap-2">
                      {MOCK_CONDITIONS.map(cond => (
                        <span key={cond.id} className="bg-rose-50 dark:bg-rose-900/20 text-rose-700 dark:text-rose-300 px-3 py-1.5 rounded-lg text-sm font-medium border border-rose-100 dark:border-rose-900/30 flex items-center gap-2">
                           <span className="w-2 h-2 rounded-full bg-rose-500"></span>
                           {cond.name}
                        </span>
                      ))}
                      <button className="border border-dashed border-gray-300 dark:border-slate-600 text-slate-400 dark:text-slate-500 px-3 py-1.5 rounded-lg text-sm flex items-center gap-1 hover:bg-gray-50 dark:hover:bg-slate-700 hover:text-rose-500 transition-colors">
                        <span className="material-symbols-outlined text-sm">add</span> Añadir
                      </button>
                   </div>
                 ) : (
                   <p className="text-slate-500 text-sm">No hay condiciones registradas.</p>
                 )}
              </div>
            </section>

            {/* Vaccination Control */}
            <section>
               <h3 className="font-bold text-slate-800 dark:text-white mb-3 flex items-center gap-2">
                <span className="material-symbols-outlined text-teal-500">vaccines</span>
                Control de Vacunación
              </h3>
              <div className="bg-white dark:bg-slate-800 rounded-xl border border-gray-100 dark:border-slate-700 shadow-sm overflow-hidden">
                <div className="divide-y divide-gray-50 dark:divide-slate-700">
                  {MOCK_VACCINES.map(vac => (
                    <div key={vac.id} className="p-4 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-slate-700/30 transition-colors">
                      <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${vac.status === 'completed' ? 'bg-teal-100 dark:bg-teal-900/30 text-teal-600 dark:text-teal-400' : 'bg-gray-100 dark:bg-slate-700 text-gray-400'}`}>
                          <span className="material-symbols-outlined text-sm">{vac.status === 'completed' ? 'check' : 'hourglass_empty'}</span>
                        </div>
                        <div>
                          <p className="text-sm font-bold text-slate-800 dark:text-white">{vac.name}</p>
                          <p className="text-xs text-slate-500 dark:text-slate-400">Fecha: {vac.date}</p>
                        </div>
                      </div>
                      <button className="text-gray-400 hover:text-brand-blue dark:hover:text-sky-400">
                        <span className="material-symbols-outlined">more_vert</span>
                      </button>
                    </div>
                  ))}
                </div>
                <div className="p-3 bg-gray-50 dark:bg-slate-800/50 border-t border-gray-100 dark:border-slate-700 text-center">
                   <button className="text-xs font-bold text-brand-blue dark:text-sky-400 hover:underline">Ver Esquema Nacional de Vacunación</button>
                </div>
              </div>
            </section>
          </div>
        )}

        {/* COMMUNITY TAB */}
        {activeTab === 'community' && (
          <div className="space-y-6 animate-fade-in-up">
            
            {/* Centers Status */}
            <section>
              <div className="flex justify-between items-center mb-3">
                 <h3 className="font-bold text-slate-800 dark:text-white flex items-center gap-2">
                    <span className="material-symbols-outlined text-brand-blue dark:text-sky-400">local_hospital</span>
                    Centros de Salud
                 </h3>
                 <button className="text-xs font-bold bg-white dark:bg-slate-700 border border-gray-200 dark:border-slate-600 px-3 py-1.5 rounded-lg text-slate-600 dark:text-slate-300 hover:text-brand-blue dark:hover:text-sky-400 transition-colors shadow-sm">
                    Reportar Estado
                 </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {MOCK_CENTERS.map(center => {
                  const statusConfig = {
                    operational: { color: 'green', text: 'Operativo', icon: 'check_circle' },
                    limited: { color: 'orange', text: 'Limitado', icon: 'info' },
                    closed: { color: 'red', text: 'Cerrado', icon: 'cancel' }
                  }[center.status as 'operational' | 'limited' | 'closed'];

                  return (
                    <div key={center.id} className="bg-white dark:bg-slate-800 p-4 rounded-xl border border-gray-100 dark:border-slate-700 shadow-sm relative overflow-hidden group">
                      <div className={`absolute top-0 left-0 w-1 h-full bg-${statusConfig.color}-500`}></div>
                      <div className="flex justify-between items-start mb-2 pl-3">
                        <h4 className="font-bold text-slate-800 dark:text-white">{center.name}</h4>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full bg-${statusConfig.color}-100 dark:bg-${statusConfig.color}-900/30 text-${statusConfig.color}-700 dark:text-${statusConfig.color}-400 flex items-center gap-1`}>
                          <span className="material-symbols-outlined text-[10px]">{statusConfig.icon}</span>
                          {statusConfig.text}
                        </span>
                      </div>
                      <div className="pl-3 space-y-1">
                        <p className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-2">
                           <span className="material-symbols-outlined text-sm">schedule</span>
                           Espera aprox: <span className="font-semibold text-slate-700 dark:text-slate-200">{center.waitTime}</span>
                        </p>
                        <p className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-2">
                           <span className="material-symbols-outlined text-sm">inventory_2</span>
                           Insumos: 
                           <span className={`font-semibold ${center.supplies === 'high' ? 'text-green-600' : center.supplies === 'low' ? 'text-orange-600' : 'text-red-600'}`}>
                              {center.supplies === 'high' ? 'Abastecido' : center.supplies === 'low' ? 'Escasos' : 'Crítico'}
                           </span>
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>

            {/* Campaigns (Jornadas) */}
            <section>
              <h3 className="font-bold text-slate-800 dark:text-white mb-3 flex items-center gap-2">
                <span className="material-symbols-outlined text-purple-500">campaign</span>
                Jornadas de Salud
              </h3>
              <div className="space-y-3">
                {MOCK_CAMPAIGNS.map(camp => (
                  <div key={camp.id} className="bg-white dark:bg-slate-800 p-4 rounded-xl border border-gray-100 dark:border-slate-700 shadow-sm hover:shadow-md transition-all flex flex-col md:flex-row gap-4 md:items-center">
                    <div className="bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400 w-16 h-16 rounded-xl flex flex-col items-center justify-center shrink-0 font-bold leading-none border border-purple-100 dark:border-purple-900/30">
                        <span className="text-xl">{camp.date.split(' ')[1]}</span>
                        <span className="text-[10px] uppercase">{camp.date.split(' ')[2]}</span>
                    </div>
                    
                    <div className="flex-1">
                        <div className="flex flex-wrap gap-2 mb-1">
                            {camp.target.map(t => (
                                <span key={t} className="text-[10px] font-bold uppercase bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-300 px-2 py-0.5 rounded">
                                    {t}
                                </span>
                            ))}
                        </div>
                        <h4 className="font-bold text-slate-800 dark:text-white text-lg">{camp.title}</h4>
                        <p className="text-sm text-slate-500 dark:text-slate-400 flex items-center gap-1 mt-1">
                            <span className="material-symbols-outlined text-sm">location_on</span>
                            {camp.location}
                        </p>
                    </div>

                    <button className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg text-sm font-bold transition-colors shadow-sm shadow-purple-500/20">
                        Ver Detalles
                    </button>
                  </div>
                ))}
              </div>
            </section>

          </div>
        )}
      </div>
    </div>
  );
};