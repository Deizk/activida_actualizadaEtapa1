import React, { useState, useMemo } from 'react';
import { MOCK_INCIDENTS, MOCK_HIGHLIGHTS, MOCK_NOTIFICATIONS, MOCK_BULLETIN } from '../constants';
import { Incident, IncidentStatus, IncidentPriority } from '../types';

export const MobileHome: React.FC = () => {
  const [showNotifications, setShowNotifications] = useState(false);
  
  // Map State
  const [selectedCluster, setSelectedCluster] = useState<{ points: any[], top: number, left: number } | null>(null);
  const [mapFilter, setMapFilter] = useState<'all' | 'agua' | 'luz' | 'gas'>('all');

  // Services Monitor State
  const [serviceTab, setServiceTab] = useState<'luz' | 'gas' | 'aseo'>('luz');

  const toggleNotifications = () => {
    setShowNotifications(!showNotifications);
  };

  const unreadCount = MOCK_NOTIFICATIONS.filter(n => !n.read).length;

  // Mock Data for New Widgets
  const WEATHER = { temp: 28, condition: 'Soleado', humidity: '65%', icon: 'wb_sunny' };
  const BCV_RATE = { value: 45.84, trend: 'up', lastUpdate: '1:00 PM' };

  // --- DETAILED SERVICES DATA ---
  const ELECTRICITY_STATUS = [
      { id: 1, sector: 'Bloques 1-10', status: 'active', condition: 'Estable', voltage: '110v' },
      { id: 2, sector: 'Veredas del Norte', status: 'inactive', condition: 'Sin Luz', voltage: '0v', cause: 'Racionamiento' },
      { id: 3, sector: 'Calle Principal', status: 'warning', condition: 'Fluctuante', voltage: '95v', cause: 'Bajo Voltaje' },
  ];

  const GAS_STATUS = [
      { id: 1, sector: 'Bloques', action: 'Llenado', status: 'waiting_return', detail: 'Cilindros en planta', date: 'Retorno: Viernes PM' },
      { id: 2, sector: 'Casas Bajas', action: 'Recolección', status: 'collecting', detail: 'Camión recibiendo vacíos', date: 'Hoy hasta 12:00 PM' },
      { id: 3, sector: 'Sector Comercial', action: 'Abastecido', status: 'completed', detail: 'Ciclo completado', date: 'Próx: 15 Días' },
  ];

  const WASTE_STATUS = [
      { id: 1, route: 'Ruta 1 (Av. Bolívar)', status: 'completed', time: 'Pasó a las 7:30 AM' },
      { id: 2, route: 'Ruta 2 (Interna)', status: 'pending', time: 'Esperando unidad (Jueves)' },
      { id: 3, route: 'Ruta 3 (Comercios)', status: 'delayed', time: 'Retraso por avería' },
  ];

  // --- MAP LOGIC ---

  // 1. Augmented Data (Adding dummy points to demo clustering)
  const mapIncidents = useMemo(() => {
    const dummies: Incident[] = [
       { id: 'D1', category: 'Agua Potable', description: 'Fuga tubería matriz', status: IncidentStatus.PENDING, priority: IncidentPriority.HIGH, aiJustification: 'Urgente', lat: 0, lng: 0, timestamp: 'Hace 5m' },
       { id: 'D2', category: 'Agua Potable', description: 'Baja presión calle 2', status: IncidentStatus.PENDING, priority: IncidentPriority.MEDIUM, aiJustification: 'Recurrente', lat: 0, lng: 0, timestamp: 'Hace 15m' },
       { id: 'D3', category: 'Alumbrado Público', description: 'Poste en corto', status: IncidentStatus.IN_PROGRESS, priority: IncidentPriority.HIGH, aiJustification: 'Riesgo', lat: 0, lng: 0, timestamp: 'Hace 1h' },
       { id: 'D4', category: 'Gas Doméstico', description: 'Sin gas vereda 4', status: IncidentStatus.PENDING, priority: IncidentPriority.MEDIUM, aiJustification: '', lat: 0, lng: 0, timestamp: 'Hace 3h' },
       { id: 'D5', category: 'Aseo Urbano', description: 'Basura acumulada', status: IncidentStatus.PENDING, priority: IncidentPriority.LOW, aiJustification: '', lat: 0, lng: 0, timestamp: 'Ayer' },
       { id: 'D6', category: 'Vialidad', description: 'Hueco peligroso', status: IncidentStatus.PENDING, priority: IncidentPriority.MEDIUM, aiJustification: '', lat: 0, lng: 0, timestamp: 'Hace 2d' },
    ];
    return [...MOCK_INCIDENTS, ...dummies];
  }, []);

  // 2. Filter
  const filteredIncidents = useMemo(() => {
      return mapIncidents.filter(inc => {
          if (mapFilter === 'all') return true;
          const cat = inc.category.toLowerCase();
          if (mapFilter === 'agua') return cat.includes('agua') || cat.includes('tubería');
          if (mapFilter === 'luz') return cat.includes('luz') || cat.includes('alumbrado') || cat.includes('electricidad');
          if (mapFilter === 'gas') return cat.includes('gas');
          return false;
      });
  }, [mapIncidents, mapFilter]);

  // 3. Clustering Calculation
  const clusters = useMemo(() => {
    // First, assign deterministic positions to all points
    const points = filteredIncidents.map(inc => {
        const hash = inc.id.split('').reduce((a, c) => a + c.charCodeAt(0), 0);
        let top, left;
        
        // Force clustering for D1, D2, D3 for demo purposes
        if (['D1', 'D2', 'D3'].includes(inc.id)) {
             const offset = parseInt(inc.id.replace('D', '')) * 3;
             top = 45 + (offset % 5);
             left = 50 + (offset % 5);
        } else {
             // Random scattering
             top = (hash * 13) % 60 + 20;
             left = (hash * 17) % 70 + 15;
        }

        return { ...inc, top, left };
    });

    // Simple distance-based clustering
    const result: { points: typeof points, top: number, left: number, id: string }[] = [];
    const THRESHOLD = 12; // % distance to cluster

    points.forEach(p => {
        const match = result.find(c => {
             const dist = Math.sqrt(Math.pow(c.top - p.top, 2) + Math.pow(c.left - p.left, 2));
             return dist < THRESHOLD;
        });

        if (match) {
            match.points.push(p);
            // Recalculate center
            match.top = match.points.reduce((s, i) => s + i.top, 0) / match.points.length;
            match.left = match.points.reduce((s, i) => s + i.left, 0) / match.points.length;
        } else {
            result.push({ points: [p], top: p.top, left: p.left, id: `cluster-${p.id}` });
        }
    });

    return result;
  }, [filteredIncidents]);

  return (
    <div className="flex flex-col min-h-full bg-gray-50 dark:bg-slate-900 pb-24 transition-colors duration-300 relative">
      
      {/* 1. Header */}
      <header className="bg-white dark:bg-slate-800 px-5 pt-6 pb-2 sticky top-0 z-40 shadow-sm/50 backdrop-blur-md bg-white/95 dark:bg-slate-800/95 transition-colors duration-300">
        <div className="flex justify-between items-center mb-1">
          <div>
            <h2 className="text-xl font-extrabold text-slate-800 dark:text-white tracking-tight">Banco Obrero</h2>
            <p className="text-xs font-semibold text-brand-green dark:text-emerald-400 uppercase tracking-wider">Comuna Inteligente</p>
          </div>
          <div className="flex items-center gap-3">
             <button 
                onClick={toggleNotifications}
                className={`p-2 relative rounded-full transition-colors ${showNotifications ? 'bg-brand-blue text-white' : 'bg-gray-50 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-gray-100 dark:hover:bg-slate-600'}`}
             >
                <span className="material-symbols-outlined text-xl">notifications</span>
                {unreadCount > 0 && (
                   <span className="absolute top-1.5 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white dark:border-slate-800"></span>
                )}
             </button>
          </div>
        </div>
      </header>

      {/* NOTIFICATIONS PANEL OVERLAY */}
      {showNotifications && (
        <>
          <div className="fixed inset-0 z-30 bg-black/20 backdrop-blur-[1px]" onClick={() => setShowNotifications(false)}></div>
          <div className="absolute top-20 left-4 right-4 z-40 bg-white dark:bg-slate-800 rounded-2xl shadow-2xl border border-gray-100 dark:border-slate-700 overflow-hidden animate-fade-in-down origin-top">
             <div className="flex justify-between items-center p-3 border-b border-gray-100 dark:border-slate-700 bg-gray-50/50 dark:bg-slate-700/30">
                <h3 className="text-sm font-bold text-slate-700 dark:text-slate-200">Notificaciones</h3>
                <button onClick={() => setShowNotifications(false)} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
                    <span className="material-symbols-outlined text-lg">close</span>
                </button>
             </div>
             
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
             </div>
          </div>
        </>
      )}

      <div className="flex-1 overflow-y-auto">
        
        {/* 2. Info Bar (Weather & BCV) */}
        <section className="px-5 mt-4">
            <div className="grid grid-cols-2 gap-3">
                <div className="bg-gradient-to-br from-sky-400 to-blue-500 rounded-xl p-3 text-white shadow-lg shadow-blue-500/20 flex items-center justify-between">
                    <div>
                        <div className="flex items-center gap-1">
                            <span className="material-symbols-outlined text-yellow-300 text-2xl drop-shadow-sm">{WEATHER.icon}</span>
                            <span className="text-2xl font-bold">{WEATHER.temp}°</span>
                        </div>
                        <p className="text-[10px] font-medium opacity-90">{WEATHER.condition} • H: {WEATHER.humidity}</p>
                    </div>
                </div>
                <div className="bg-white dark:bg-slate-800 rounded-xl p-3 border border-gray-100 dark:border-slate-700 shadow-sm flex flex-col justify-center relative overflow-hidden">
                    <div className="flex justify-between items-start mb-1">
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-wide">Tasa BCV</span>
                        <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/0/06/Flag_of_Venezuela.svg/2560px-Flag_of_Venezuela.svg.png" alt="VE" className="w-4 h-3 rounded-sm shadow-sm opacity-80" />
                    </div>
                    <div className="flex items-end gap-1">
                        <span className="text-xl font-black text-slate-800 dark:text-white">{BCV_RATE.value}</span>
                        <span className="text-[10px] font-bold text-slate-500 mb-1">Bs/USD</span>
                    </div>
                     <div className={`absolute bottom-2 right-2 flex items-center text-[10px] font-bold ${BCV_RATE.trend === 'up' ? 'text-red-500' : 'text-green-500'}`}>
                        <span className="material-symbols-outlined text-sm">{BCV_RATE.trend === 'up' ? 'trending_up' : 'trending_down'}</span>
                     </div>
                </div>
            </div>
        </section>

        {/* 3. Enhanced Interactive Map Section */}
        <section className="px-5 mt-6">
            <div className="flex justify-between items-center mb-3">
              <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200 flex items-center gap-2">
                <span className="material-symbols-outlined text-brand-blue dark:text-sky-400">map</span>
                Mapa Comunal
              </h3>
              <div className="flex bg-gray-100 dark:bg-slate-800 rounded-lg p-0.5">
                  {(['all', 'agua', 'luz'] as const).map(f => (
                      <button 
                        key={f}
                        onClick={() => { setMapFilter(f); setSelectedCluster(null); }}
                        className={`px-2 py-0.5 text-[10px] font-bold uppercase rounded-md transition-all ${mapFilter === f ? 'bg-white dark:bg-slate-600 shadow-sm text-slate-800 dark:text-white' : 'text-slate-400'}`}
                      >
                          {f === 'all' ? 'Todo' : f}
                      </button>
                  ))}
              </div>
           </div>

           <div className="relative w-full h-56 bg-slate-200 dark:bg-slate-800 rounded-2xl overflow-hidden shadow-inner border border-gray-200 dark:border-slate-700 group">
               {/* Map Background */}
               <div className="absolute inset-0 bg-[url('https://picsum.photos/800/600?grayscale')] bg-cover opacity-30 dark:opacity-20 transition-transform duration-1000 group-hover:scale-105"></div>
               
               {/* Clusters & Markers */}
               {clusters.map((cluster) => {
                   const isSelected = selectedCluster?.id === cluster.id;
                   const isSingle = cluster.points.length === 1;
                   const firstPoint = cluster.points[0];

                   // Determine visual style based on content
                   let bgColor = 'bg-brand-blue';
                   let icon = 'place';
                   
                   // Check category if single, or dominant category if cluster (simplified here)
                   if (isSingle) {
                       const cat = firstPoint.category.toLowerCase();
                       if (cat.includes('alumbrado') || cat.includes('luz')) { bgColor = 'bg-yellow-500'; icon = 'lightbulb'; }
                       else if (cat.includes('agua') || cat.includes('tubería')) { bgColor = 'bg-blue-500'; icon = 'water_drop'; }
                       else if (cat.includes('gas')) { bgColor = 'bg-orange-500'; icon = 'propane'; }
                       else { bgColor = 'bg-red-500'; icon = 'report_problem'; }
                   } else {
                       bgColor = 'bg-slate-800 dark:bg-slate-600';
                   }

                   return (
                       <button
                          key={cluster.id}
                          onClick={(e) => { e.stopPropagation(); setSelectedCluster(cluster); }}
                          style={{ top: `${cluster.top}%`, left: `${cluster.left}%` }}
                          className={`absolute group/pin -ml-4 -mt-4 flex items-center justify-center text-white shadow-lg transition-all transform duration-300
                            ${isSelected ? 'z-30 scale-125' : 'z-20 hover:scale-110'}
                            ${isSingle ? `w-8 h-8 rounded-full ${bgColor}` : `w-10 h-10 rounded-full ${bgColor} border-2 border-white dark:border-slate-700`}
                          `}
                       >
                           {isSingle ? (
                               <span className="material-symbols-outlined text-sm">{icon}</span>
                           ) : (
                               <span className="text-xs font-bold">{cluster.points.length}</span>
                           )}

                           {/* Tooltip on Hover */}
                           <div className="absolute bottom-full mb-2 hidden group-hover/pin:block whitespace-nowrap bg-slate-800 text-white text-[10px] px-2 py-1 rounded-md shadow-lg pointer-events-none z-50">
                               {isSingle ? firstPoint.category : `${cluster.points.length} incidencias`}
                               <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-1 border-4 border-transparent border-t-slate-800"></div>
                           </div>

                           {/* Selection Ring */}
                           {isSelected && <div className="absolute inset-0 rounded-full ring-4 ring-white/50 dark:ring-slate-500/50 animate-pulse"></div>}
                       </button>
                   );
               })}

               {/* Popup Card for Selection */}
               {selectedCluster && (
                   <div className="absolute bottom-3 left-3 right-3 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md rounded-xl shadow-xl border border-gray-100 dark:border-slate-700 animate-fade-in-up z-30 flex flex-col max-h-40">
                       
                       <div className="flex justify-between items-center p-3 border-b border-gray-100 dark:border-slate-700">
                           <div className="flex items-center gap-2">
                               <div className={`w-2 h-2 rounded-full ${selectedCluster.points.length > 1 ? 'bg-slate-800 dark:bg-slate-400' : 'bg-red-500'}`}></div>
                               <h4 className="text-xs font-bold text-slate-800 dark:text-white uppercase">
                                   {selectedCluster.points.length > 1 ? `${selectedCluster.points.length} Incidencias en zona` : 'Detalle de Incidencia'}
                               </h4>
                           </div>
                           <button onClick={(e) => { e.stopPropagation(); setSelectedCluster(null); }} className="text-slate-400 hover:text-slate-600">
                               <span className="material-symbols-outlined text-base">close</span>
                           </button>
                       </div>

                       <div className="overflow-y-auto p-3 space-y-3">
                           {selectedCluster.points.map((pt, idx) => (
                               <div key={idx} className="flex gap-3 items-start">
                                    <div className="mt-0.5">
                                        {pt.category.includes('Agua') && <span className="material-symbols-outlined text-blue-500 text-base">water_drop</span>}
                                        {pt.category.includes('Alumbrado') && <span className="material-symbols-outlined text-yellow-500 text-base">lightbulb</span>}
                                        {!pt.category.includes('Agua') && !pt.category.includes('Alumbrado') && <span className="material-symbols-outlined text-red-500 text-base">report_problem</span>}
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex justify-between">
                                            <p className="text-xs font-bold text-slate-800 dark:text-white">{pt.category}</p>
                                            <span className="text-[10px] text-slate-400">{pt.timestamp}</span>
                                        </div>
                                        <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-2">{pt.description}</p>
                                        <div className="flex gap-2 mt-1">
                                            <span className={`text-[9px] font-bold px-1.5 rounded border ${pt.priority === 'Alta' ? 'text-red-600 border-red-200 bg-red-50' : 'text-slate-500 border-slate-200'}`}>{pt.priority}</span>
                                            {pt.aiJustification && <span className="text-[9px] text-brand-blue flex items-center gap-0.5"><span className="material-symbols-outlined text-[10px]">smart_toy</span> IA</span>}
                                        </div>
                                    </div>
                               </div>
                           ))}
                       </div>
                   </div>
               )}
               
               <div className="absolute top-2 right-2 bg-white/80 dark:bg-black/50 px-2 py-1 rounded text-[8px] font-mono text-slate-600 dark:text-slate-300 pointer-events-none backdrop-blur-sm">
                   Live Map
               </div>
           </div>
        </section>

        {/* 4. Detailed Services Monitor (Replaces simple summary) */}
        <section className="px-5 mt-6">
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-700 overflow-hidden">
              <div className="p-4 border-b border-gray-100 dark:border-slate-700 bg-gray-50/50 dark:bg-slate-900/30">
                  <div className="flex justify-between items-center mb-3">
                      <h3 className="font-bold text-slate-800 dark:text-white flex items-center gap-2">
                          <span className="material-symbols-outlined text-brand-blue dark:text-sky-400">admin_panel_settings</span>
                          Monitor de Servicios
                      </h3>
                      <span className="text-[10px] bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 px-2 py-0.5 rounded-full font-bold">En Tiempo Real</span>
                  </div>
                  
                  {/* Service Tabs */}
                  <div className="flex bg-gray-200 dark:bg-slate-700 rounded-lg p-1">
                      <button 
                          onClick={() => setServiceTab('luz')}
                          className={`flex-1 py-1.5 rounded-md text-xs font-bold transition-all flex items-center justify-center gap-1 ${serviceTab === 'luz' ? 'bg-white dark:bg-slate-600 text-yellow-600 dark:text-yellow-400 shadow-sm' : 'text-slate-500 dark:text-slate-400'}`}
                      >
                          <span className="material-symbols-outlined text-sm">bolt</span>
                          Luz
                      </button>
                      <button 
                          onClick={() => setServiceTab('gas')}
                          className={`flex-1 py-1.5 rounded-md text-xs font-bold transition-all flex items-center justify-center gap-1 ${serviceTab === 'gas' ? 'bg-white dark:bg-slate-600 text-orange-600 dark:text-orange-400 shadow-sm' : 'text-slate-500 dark:text-slate-400'}`}
                      >
                          <span className="material-symbols-outlined text-sm">propane</span>
                          Gas
                      </button>
                      <button 
                          onClick={() => setServiceTab('aseo')}
                          className={`flex-1 py-1.5 rounded-md text-xs font-bold transition-all flex items-center justify-center gap-1 ${serviceTab === 'aseo' ? 'bg-white dark:bg-slate-600 text-blue-600 dark:text-blue-400 shadow-sm' : 'text-slate-500 dark:text-slate-400'}`}
                      >
                          <span className="material-symbols-outlined text-sm">delete</span>
                          Aseo
                      </button>
                  </div>
              </div>

              {/* Service Content */}
              <div className="p-4 min-h-[180px]">
                  {serviceTab === 'luz' && (
                      <div className="space-y-3 animate-fade-in-up">
                          {ELECTRICITY_STATUS.map(item => (
                              <div key={item.id} className="flex items-center justify-between p-3 border border-gray-100 dark:border-slate-700 rounded-xl bg-gray-50 dark:bg-slate-700/30">
                                  <div className="flex items-center gap-3">
                                      <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                                          item.status === 'active' ? 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400' : 
                                          item.status === 'warning' ? 'bg-yellow-100 text-yellow-600 dark:bg-yellow-900/30 dark:text-yellow-400' :
                                          'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400'
                                      }`}>
                                          <span className="material-symbols-outlined text-sm">bolt</span>
                                      </div>
                                      <div>
                                          <p className="text-sm font-bold text-slate-800 dark:text-white">{item.sector}</p>
                                          <p className="text-xs text-slate-500 dark:text-slate-400">{item.condition} {item.voltage !== '0v' ? `• ${item.voltage}` : ''}</p>
                                      </div>
                                  </div>
                                  {item.status !== 'active' && (
                                      <span className="text-[10px] bg-white dark:bg-slate-800 px-2 py-1 rounded border border-gray-200 dark:border-slate-600 text-slate-600 dark:text-slate-300 font-medium">
                                          {item.cause}
                                      </span>
                                  )}
                              </div>
                          ))}
                      </div>
                  )}

                  {serviceTab === 'gas' && (
                      <div className="space-y-3 animate-fade-in-up">
                          {GAS_STATUS.map(item => (
                              <div key={item.id} className="p-3 border border-gray-100 dark:border-slate-700 rounded-xl bg-gray-50 dark:bg-slate-700/30">
                                  <div className="flex justify-between items-start mb-2">
                                      <div>
                                          <p className="text-sm font-bold text-slate-800 dark:text-white">{item.sector}</p>
                                          <p className="text-xs text-slate-500 dark:text-slate-400">{item.action}</p>
                                      </div>
                                      <span className={`text-[10px] font-bold px-2 py-1 rounded uppercase ${
                                          item.status === 'completed' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300' :
                                          item.status === 'collecting' ? 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300' :
                                          'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300'
                                      }`}>
                                          {item.status === 'completed' ? 'Listo' : item.status === 'collecting' ? 'Activo' : 'Espera'}
                                      </span>
                                  </div>
                                  <div className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-300 bg-white dark:bg-slate-800 p-2 rounded-lg">
                                      <span className="material-symbols-outlined text-sm text-brand-orange">schedule</span>
                                      {item.date}
                                  </div>
                              </div>
                          ))}
                      </div>
                  )}

                  {serviceTab === 'aseo' && (
                      <div className="space-y-3 animate-fade-in-up">
                          {WASTE_STATUS.map(item => (
                              <div key={item.id} className="flex items-center justify-between p-3 border border-gray-100 dark:border-slate-700 rounded-xl bg-gray-50 dark:bg-slate-700/30">
                                  <div className="flex items-center gap-3">
                                      <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                                          item.status === 'completed' ? 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400' : 
                                          item.status === 'pending' ? 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400' :
                                          'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400'
                                      }`}>
                                          <span className="material-symbols-outlined text-sm">{item.status === 'completed' ? 'check_circle' : item.status === 'pending' ? 'hourglass_empty' : 'warning'}</span>
                                      </div>
                                      <div>
                                          <p className="text-sm font-bold text-slate-800 dark:text-white">{item.route}</p>
                                          <p className="text-xs text-slate-500 dark:text-slate-400">{item.time}</p>
                                      </div>
                                  </div>
                              </div>
                          ))}
                      </div>
                  )}
              </div>
          </div>
        </section>

        {/* 5. Highlights */}
        <section className="mt-6 pl-5">
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

        {/* 6. Bulletin Board */}
        <section className="px-5 mt-2 mb-4">
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
          </div>
        </section>
      </div>
    </div>
  );
};