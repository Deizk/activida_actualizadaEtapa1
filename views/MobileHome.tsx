import React, { useState } from 'react';
import { MOCK_INCIDENTS, MOCK_SERVICES, MOCK_BULLETIN, MOCK_HIGHLIGHTS, MOCK_NOTIFICATIONS, MOCK_USER_PROFILE } from '../constants';

export const MobileHome: React.FC = () => {
  const [showMicroPanel, setShowMicroPanel] = useState(false);
  const [panelTab, setPanelTab] = useState<'notifications' | 'profile'>('notifications');

  const togglePanel = (tab: 'notifications' | 'profile') => {
    if (showMicroPanel && panelTab === tab) {
      setShowMicroPanel(false);
    } else {
      setPanelTab(tab);
      setShowMicroPanel(true);
    }
  };

  const unreadCount = MOCK_NOTIFICATIONS.filter(n => !n.read).length;

  return (
    <div className="flex flex-col min-h-full bg-gray-50 dark:bg-slate-900 pb-24 transition-colors duration-300 relative">
      
      {/* 1. Enhanced Header with Interaction */}
      <header className="bg-white dark:bg-slate-800 px-5 pt-6 pb-2 sticky top-0 z-40 shadow-sm/50 backdrop-blur-md bg-white/95 dark:bg-slate-800/95 transition-colors duration-300">
        <div className="flex justify-between items-center mb-1">
          <div>
            <h2 className="text-xl font-extrabold text-slate-800 dark:text-white tracking-tight">Banco Obrero</h2>
            <p className="text-xs font-semibold text-brand-green dark:text-emerald-400 uppercase tracking-wider">Comuna Inteligente</p>
          </div>
          <div className="flex items-center gap-3">
             <button 
                onClick={() => togglePanel('notifications')}
                className={`p-2 relative rounded-full transition-colors ${panelTab === 'notifications' && showMicroPanel ? 'bg-brand-blue text-white' : 'bg-gray-50 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-gray-100 dark:hover:bg-slate-600'}`}
             >
                <span className="material-symbols-outlined text-xl">notifications</span>
                {unreadCount > 0 && (
                   <span className="absolute top-1.5 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white dark:border-slate-800"></span>
                )}
             </button>
             <button 
                onClick={() => togglePanel('profile')}
                className={`w-9 h-9 rounded-full border flex items-center justify-center font-bold text-sm transition-all ${panelTab === 'profile' && showMicroPanel ? 'bg-brand-blue border-brand-blue text-white ring-2 ring-brand-blue/30' : 'bg-brand-blue/10 dark:bg-sky-500/10 border-brand-blue/20 dark:border-sky-500/20 text-brand-blue dark:text-sky-400'}`}
             >
                MG
             </button>
          </div>
        </div>
      </header>

      {/* MICRO PANEL OVERLAY */}
      {showMicroPanel && (
        <>
          <div className="fixed inset-0 z-30 bg-black/20 backdrop-blur-[1px]" onClick={() => setShowMicroPanel(false)}></div>
          <div className="absolute top-20 left-4 right-4 z-40 bg-white dark:bg-slate-800 rounded-2xl shadow-2xl border border-gray-100 dark:border-slate-700 overflow-hidden animate-fade-in-down origin-top">
             
             {/* Panel Tabs */}
             <div className="flex border-b border-gray-100 dark:border-slate-700">
                <button 
                   onClick={() => setPanelTab('notifications')}
                   className={`flex-1 py-3 text-sm font-bold transition-colors border-b-2 ${panelTab === 'notifications' ? 'text-brand-blue dark:text-sky-400 border-brand-blue dark:border-sky-400 bg-blue-50/50 dark:bg-slate-700/50' : 'text-slate-500 border-transparent hover:bg-gray-50 dark:hover:bg-slate-700'}`}
                >
                   Notificaciones
                </button>
                <button 
                   onClick={() => setPanelTab('profile')}
                   className={`flex-1 py-3 text-sm font-bold transition-colors border-b-2 ${panelTab === 'profile' ? 'text-brand-blue dark:text-sky-400 border-brand-blue dark:border-sky-400 bg-blue-50/50 dark:bg-slate-700/50' : 'text-slate-500 border-transparent hover:bg-gray-50 dark:hover:bg-slate-700'}`}
                >
                   Mi Resumen
                </button>
             </div>

             {/* Panel Content: Notifications */}
             {panelTab === 'notifications' && (
                <div className="max-h-[60vh] overflow-y-auto p-2">
                   {MOCK_NOTIFICATIONS.length > 0 ? (
                      <div className="space-y-1">
                         {MOCK_NOTIFICATIONS.map(notif => (
                            <div key={notif.id} className={`p-3 rounded-xl flex gap-3 ${notif.read ? 'bg-transparent opacity-70' : 'bg-blue-50 dark:bg-slate-700/40'}`}>
                               <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                                  notif.type === 'alert' ? 'bg-red-100 text-red-600' :
                                  notif.type === 'community' ? 'bg-green-100 text-green-600' :
                                  'bg-slate-100 text-slate-600'
                               }`}>
                                  <span className="material-symbols-outlined text-base">
                                     {notif.type === 'alert' ? 'warning' : notif.type === 'community' ? 'groups' : 'info'}
                                  </span>
                               </div>
                               <div className="flex-1">
                                  <div className="flex justify-between items-start">
                                     <h4 className="text-sm font-bold text-slate-800 dark:text-white leading-tight">{notif.title}</h4>
                                     <span className="text-[10px] text-slate-400 whitespace-nowrap ml-2">{notif.time}</span>
                                  </div>
                                  <p className="text-xs text-slate-600 dark:text-slate-300 mt-0.5 leading-snug">{notif.message}</p>
                               </div>
                            </div>
                         ))}
                      </div>
                   ) : (
                      <div className="p-8 text-center text-slate-400">
                         <p>No tienes notificaciones nuevas</p>
                      </div>
                   )}
                   <div className="mt-2 text-center border-t border-gray-50 dark:border-slate-700 pt-2">
                      <button className="text-xs font-bold text-brand-blue dark:text-sky-400">Ajustar Preferencias</button>
                   </div>
                </div>
             )}

             {/* Panel Content: Mini Profile */}
             {panelTab === 'profile' && (
                <div className="p-4 bg-gradient-to-b from-white to-gray-50 dark:from-slate-800 dark:to-slate-900">
                   <div className="flex items-center gap-4 mb-4">
                      <div className="w-16 h-16 rounded-2xl bg-slate-200 dark:bg-slate-700 flex items-center justify-center text-2xl font-bold text-slate-500 dark:text-slate-400 shadow-inner">
                         MG
                      </div>
                      <div>
                         <h3 className="font-bold text-slate-800 dark:text-white text-lg">{MOCK_USER_PROFILE.name}</h3>
                         <p className="text-xs font-mono text-slate-500 bg-slate-100 dark:bg-slate-700 px-2 py-0.5 rounded inline-block">{MOCK_USER_PROFILE.cedula}</p>
                         <p className="text-xs text-brand-blue dark:text-sky-400 font-bold mt-1">{MOCK_USER_PROFILE.profession}</p>
                      </div>
                   </div>

                   {/* Quick Stats Grid */}
                   <div className="grid grid-cols-2 gap-3 mb-4">
                      <div className="bg-white dark:bg-slate-700 p-3 rounded-xl border border-gray-100 dark:border-slate-600 text-center shadow-sm">
                         <span className="block text-2xl font-black text-brand-blue dark:text-sky-400">{MOCK_USER_PROFILE.communityReputation}</span>
                         <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">Reputación</span>
                      </div>
                      <div className="bg-white dark:bg-slate-700 p-3 rounded-xl border border-gray-100 dark:border-slate-600 text-center flex flex-col items-center justify-center shadow-sm cursor-pointer hover:bg-gray-50 dark:hover:bg-slate-600 transition-colors">
                         <span className="material-symbols-outlined text-3xl text-slate-800 dark:text-white mb-1">qr_code_2</span>
                         <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">ID Digital</span>
                      </div>
                   </div>

                   {/* Quick Actions List */}
                   <div className="space-y-1">
                      <button className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-white dark:hover:bg-slate-700 transition-colors text-left group">
                         <span className="material-symbols-outlined text-slate-400 group-hover:text-brand-blue">badge</span>
                         <div className="flex-1">
                            <p className="text-sm font-bold text-slate-700 dark:text-slate-200">Mis Roles</p>
                            <p className="text-[10px] text-slate-400">Líder de Calle, Vocero</p>
                         </div>
                         <span className="material-symbols-outlined text-slate-300 text-sm">chevron_right</span>
                      </button>
                      <button className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-white dark:hover:bg-slate-700 transition-colors text-left group">
                         <span className="material-symbols-outlined text-slate-400 group-hover:text-brand-green">share_location</span>
                         <div className="flex-1">
                            <p className="text-sm font-bold text-slate-700 dark:text-slate-200">Ubicación</p>
                            <p className="text-[10px] text-green-600 font-bold">Activa (Modo Seguro)</p>
                         </div>
                         <span className="w-8 h-4 bg-green-500 rounded-full relative">
                            <span className="absolute right-0.5 top-0.5 w-3 h-3 bg-white rounded-full shadow-sm"></span>
                         </span>
                      </button>
                   </div>
                </div>
             )}
          </div>
        </>
      )}

      <div className="flex-1 overflow-y-auto">
        
        {/* 2. Highlights Zone (Carrusel de Destacados) */}
        <section className="mt-4 pl-5">
          <div className="flex justify-between items-center pr-5 mb-3">
             <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1">
                <span className="material-symbols-outlined text-brand-orange text-lg">star</span>
                Destacados
             </h3>
          </div>
          <div className="flex gap-4 overflow-x-auto pb-4 pr-5 scrollbar-hide snap-x">
            {MOCK_HIGHLIGHTS.map((item) => (
              <div key={item.id} className="min-w-[260px] h-[140px] rounded-2xl relative overflow-hidden shadow-lg shadow-gray-200 dark:shadow-slate-950 snap-center group">
                <img src={item.image} alt={item.title} className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
                <div className="absolute top-3 left-3 bg-white/20 backdrop-blur-md border border-white/30 text-white text-[10px] font-bold px-2 py-1 rounded-lg">
                  {item.tag}
                </div>
                <div className="absolute bottom-3 left-3 right-3 text-white">
                  <h4 className="font-bold text-sm leading-tight mb-0.5">{item.title}</h4>
                  <p className="text-[10px] opacity-90 mb-2">{item.subtitle}</p>
                  <button className="text-[10px] font-bold bg-white text-slate-900 px-3 py-1 rounded-full flex items-center gap-1 hover:bg-brand-orange hover:text-white transition-colors">
                    {item.actionLabel}
                    <span className="material-symbols-outlined text-[10px]">arrow_forward</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 3. Services Monitor (Monitor de Servicios) */}
        <section className="px-5 mt-2">
          <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200 mb-3 flex items-center gap-2">
            <span className="material-symbols-outlined text-brand-blue dark:text-sky-400">speed</span>
            Monitor de Servicios
          </h3>
          <div className="grid grid-cols-2 gap-3">
            {MOCK_SERVICES.map((service) => {
              const statusColors = {
                optimal: 'bg-green-50 dark:bg-green-900/10 border-green-200 dark:border-green-800 text-green-700 dark:text-green-400',
                warning: 'bg-orange-50 dark:bg-orange-900/10 border-orange-200 dark:border-orange-800 text-orange-700 dark:text-orange-400',
                critical: 'bg-red-50 dark:bg-red-900/10 border-red-200 dark:border-red-800 text-red-700 dark:text-red-400'
              };
              const iconColors = {
                optimal: 'text-green-600 dark:text-green-400',
                warning: 'text-orange-500 dark:text-orange-400',
                critical: 'text-red-500 dark:text-red-400'
              };
              const dotColors = {
                optimal: 'bg-green-500',
                warning: 'bg-orange-500',
                critical: 'bg-red-500'
              };

              return (
                <div key={service.id} className={`p-3 rounded-xl border ${statusColors[service.status]} relative overflow-hidden transition-all active:scale-[0.98]`}>
                  <div className="flex justify-between items-start mb-2">
                    <span className={`material-symbols-outlined ${iconColors[service.status]}`}>{service.icon}</span>
                    <div className={`w-2.5 h-2.5 rounded-full ${dotColors[service.status]} animate-pulse`}></div>
                  </div>
                  <h4 className="font-bold text-sm text-slate-800 dark:text-slate-200">{service.name}</h4>
                  <p className="text-[10px] font-medium opacity-80 mt-0.5 line-clamp-1">{service.message}</p>
                  <p className="text-[9px] mt-2 opacity-60">Act: {service.lastUpdate}</p>
                </div>
              );
            })}
          </div>
        </section>

        {/* 4. Bulletin Board (Cartelera Informativa) */}
        <section className="px-5 mt-6">
          <div className="bg-gradient-to-br from-brand-blue to-[#084b85] dark:from-sky-700 dark:to-brand-blue rounded-2xl p-5 text-white shadow-lg shadow-brand-blue/20 dark:shadow-none relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-10">
              <span className="material-symbols-outlined text-8xl transform rotate-12">campaign</span>
            </div>
            
            <h3 className="font-bold text-lg mb-4 flex items-center gap-2 relative z-10">
              <span className="material-symbols-outlined">campaign</span>
              Cartelera Comunal
            </h3>

            <div className="space-y-3 relative z-10">
              {MOCK_BULLETIN.map((news) => (
                <div key={news.id} className="bg-white/10 backdrop-blur-sm border border-white/10 p-3 rounded-xl flex gap-3 items-start">
                   <div className={`shrink-0 w-10 h-10 rounded-lg flex items-center justify-center font-bold text-xs flex-col leading-none ${
                     news.type === 'alert' ? 'bg-red-500 text-white' : 'bg-white text-brand-blue'
                   }`}>
                      <span>{news.date.split(' ')[1]}</span>
                      <span className="text-[10px] opacity-80">{news.date.split(' ')[0]}</span>
                   </div>
                   <div>
                      <h4 className="font-bold text-sm text-white leading-tight mb-1">{news.title}</h4>
                      <p className="text-xs text-blue-100 leading-snug">{news.content}</p>
                   </div>
                </div>
              ))}
            </div>
            <button className="w-full mt-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg text-xs font-bold transition-colors">
              Ver todas las noticias
            </button>
          </div>
        </section>

        {/* 5. Incidents Summary & Map Preview */}
        <section className="px-5 mt-6 mb-4">
           <div className="flex justify-between items-center mb-3">
              <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200 flex items-center gap-2">
                <span className="material-symbols-outlined text-red-500">report_problem</span>
                Incidencias Recientes
              </h3>
              <button className="text-xs text-brand-blue dark:text-sky-400 font-bold">Ver Mapa</button>
           </div>
           
           <div className="bg-white dark:bg-slate-800 p-1 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-700 transition-colors duration-300">
              {/* Mini Map Visual */}
              <div className="h-32 bg-slate-100 dark:bg-slate-700 rounded-xl relative overflow-hidden mb-1">
                 <div className="absolute inset-0 bg-[url('https://picsum.photos/800/400?grayscale')] bg-cover opacity-60 dark:opacity-30"></div>
                 {/* CSS Dots for incidents */}
                 <div className="absolute top-1/2 left-1/3 w-3 h-3 bg-red-500 rounded-full border-2 border-white dark:border-slate-800 shadow-md animate-bounce"></div>
                 <div className="absolute top-1/3 left-2/3 w-3 h-3 bg-brand-blue dark:bg-sky-500 rounded-full border-2 border-white dark:border-slate-800 shadow-md"></div>
                 <div className="absolute bottom-4 right-4 bg-white/90 dark:bg-slate-900/90 backdrop-blur px-2 py-1 rounded text-[10px] font-bold shadow-sm dark:text-white">
                    {MOCK_INCIDENTS.length} activas hoy
                 </div>
              </div>

              {/* Quick List */}
              <div className="divide-y divide-gray-50 dark:divide-slate-700">
                {MOCK_INCIDENTS.slice(0, 3).map((inc) => (
                  <div key={inc.id} className="flex gap-3 p-3 hover:bg-gray-50 dark:hover:bg-slate-700/50 transition-colors rounded-lg">
                     <div className={`shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                       inc.priority === 'Alta' ? 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400' : 'bg-blue-100 dark:bg-sky-900/30 text-brand-blue dark:text-sky-400'
                     }`}>
                        <span className="material-symbols-outlined text-base">
                          {inc.category.includes('Alumbrado') ? 'lightbulb' : 'delete'}
                        </span>
                     </div>
                     <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-start">
                           <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200 truncate">{inc.category}</h4>
                           <span className="text-[10px] text-slate-400 dark:text-slate-500">{inc.timestamp}</span>
                        </div>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">{inc.description}</p>
                        {inc.priority === 'Alta' && (
                          <div className="flex items-center gap-1 mt-1 text-[9px] text-red-600 dark:text-red-400 font-bold">
                            <span className="material-symbols-outlined text-[10px]">smart_toy</span>
                            Priorizado por IA
                          </div>
                        )}
                     </div>
                  </div>
                ))}
              </div>
           </div>
        </section>
      </div>
    </div>
  );
};