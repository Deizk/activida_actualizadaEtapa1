import React, { useState, useMemo, useEffect } from 'react';
import { MOCK_INCIDENTS, MOCK_HIGHLIGHTS, MOCK_NOTIFICATIONS, MOCK_BULLETIN, MOCK_PRODUCTS } from '../constants';
import { Incident, IncidentStatus, IncidentPriority } from '../types';

interface MobileHomeProps {
  onNavigate: (tab: string) => void;
}

// Widget System Definitions
type WidgetId = 'weather' | 'bcv' | 'report_action' | 'sos_action' | 'map' | 'services' | 'marketplace' | 'bulletin';
type WidgetSize = 'small' | 'wide' | 'large';

interface WidgetConfig {
    id: WidgetId;
    label: string;
    icon: string;
}

interface UserWidget {
    id: WidgetId;
    size: WidgetSize;
}

const ALL_WIDGETS_CONFIG: Record<WidgetId, WidgetConfig> = {
    weather: { id: 'weather', label: 'Clima', icon: 'thermostat' },
    bcv: { id: 'bcv', label: 'Tasa BCV', icon: 'currency_exchange' },
    report_action: { id: 'report_action', label: 'Reportar', icon: 'add_a_photo' },
    sos_action: { id: 'sos_action', label: 'SOS', icon: 'e911_emergency' },
    map: { id: 'map', label: 'Mapa en Vivo', icon: 'map' },
    services: { id: 'services', label: 'Servicios', icon: 'admin_panel_settings' },
    marketplace: { id: 'marketplace', label: 'Mercado', icon: 'storefront' },
    bulletin: { id: 'bulletin', label: 'Cartelera', icon: 'campaign' },
};

// Default Layout
const DEFAULT_LAYOUT: UserWidget[] = [
    { id: 'weather', size: 'small' },
    { id: 'bcv', size: 'small' },
    { id: 'report_action', size: 'small' },
    { id: 'sos_action', size: 'small' },
    { id: 'services', size: 'wide' },
    { id: 'marketplace', size: 'wide' },
    { id: 'map', size: 'large' },
    { id: 'bulletin', size: 'wide' },
];

export const MobileHome: React.FC<MobileHomeProps> = ({ onNavigate }) => {
  const [showNotifications, setShowNotifications] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  
  // Dashboard Layout State (Persistence)
  const [widgets, setWidgets] = useState<UserWidget[]>(() => {
      const saved = localStorage.getItem('boi_tetris_layout_v2');
      return saved ? JSON.parse(saved) : DEFAULT_LAYOUT;
  });

  const [hiddenWidgets, setHiddenWidgets] = useState<WidgetId[]>(() => {
      const saved = localStorage.getItem('boi_tetris_hidden_v2');
      if (saved) return JSON.parse(saved);
      // Calculate diff between default and all available
      const currentIds = DEFAULT_LAYOUT.map(w => w.id);
      return Object.keys(ALL_WIDGETS_CONFIG).filter(id => !currentIds.includes(id as WidgetId)) as WidgetId[];
  });

  // Save layout on change
  useEffect(() => {
      localStorage.setItem('boi_tetris_layout_v2', JSON.stringify(widgets));
      localStorage.setItem('boi_tetris_hidden_v2', JSON.stringify(hiddenWidgets));
  }, [widgets, hiddenWidgets]);

  // --- LOCAL STATE FOR WIDGETS ---
  const [mapFilter, setMapFilter] = useState<'all' | 'agua' | 'luz' | 'gas'>('all');
  
  // Services Widget State (Luz, Agua, Gas)
  const [serviceTab, setServiceTab] = useState<'luz' | 'agua' | 'gas'>('luz');

  const toggleNotifications = () => setShowNotifications(!showNotifications);
  const unreadCount = MOCK_NOTIFICATIONS.filter(n => !n.read).length;

  // Mock Data
  const WEATHER = { temp: 28, condition: 'Soleado', humidity: '65%', icon: 'wb_sunny' };
  const BCV_RATE = { value: 45.84, trend: 'up' };

  // --- SERVICE MOCK DATA ---
  const ELECTRICITY_ZONES = [
      { id: 1, name: 'Bloques 1-5', status: 'active', info: 'Estable 110v' },
      { id: 2, name: 'Calle Principal', status: 'warning', info: 'Fluctuación' },
      { id: 3, name: 'Sector La Cruz', status: 'critical', info: 'Sin servicio' },
      { id: 4, name: 'Veredas Norte', status: 'active', info: 'Estable 110v' },
  ];

  const WATER_ZONES = [
      { id: 1, name: 'Bloques 1-5', status: 'active', info: 'Suministro Alta' },
      { id: 2, name: 'Parte Alta', status: 'waiting', info: 'Turno: Mañana 6PM' },
      { id: 3, name: 'Calle 3', status: 'waiting', info: 'Espera de ciclo' },
  ];

  const GAS_ZONES = [
      { id: 1, name: 'Ruta 1', status: 'active', info: 'Camión en Calle 4' },
      { id: 2, name: 'Gas Directo A', status: 'active', info: 'Suministro OK' },
      { id: 3, name: 'Ruta 2', status: 'finished', info: 'Finalizada hoy' },
  ];

  // --- TETRIS LOGIC ---

  const getNextSize = (current: WidgetSize): WidgetSize => {
      if (current === 'small') return 'wide';
      if (current === 'wide') return 'large';
      return 'small';
  };

  const resizeWidget = (id: WidgetId) => {
      setWidgets(prev => prev.map(w => w.id === id ? { ...w, size: getNextSize(w.size) } : w));
  };

  const moveWidget = (index: number, direction: 'prev' | 'next') => {
      const newLayout = [...widgets];
      const targetIndex = direction === 'prev' ? index - 1 : index + 1;
      
      if (targetIndex >= 0 && targetIndex < newLayout.length) {
          [newLayout[index], newLayout[targetIndex]] = [newLayout[targetIndex], newLayout[index]];
          setWidgets(newLayout);
      }
  };

  const removeWidget = (id: WidgetId) => {
      setWidgets(prev => prev.filter(w => w.id !== id));
      setHiddenWidgets(prev => [...prev, id]);
  };

  const addWidget = (id: WidgetId) => {
      setHiddenWidgets(prev => prev.filter(wid => wid !== id));
      setWidgets(prev => [...prev, { id, size: 'small' }]); 
  };

  const getSizeClasses = (size: WidgetSize) => {
      switch(size) {
          case 'small': return 'col-span-1 row-span-1';
          case 'wide': return 'col-span-2 row-span-1';
          case 'large': return 'col-span-2 row-span-2';
          default: return 'col-span-1 row-span-1';
      }
  };

  // --- WIDGET RENDERERS (Responsive to Size) ---

  const WidgetContainer: React.FC<{ 
      children: React.ReactNode; 
      widget: UserWidget; 
      index: number; 
      config: WidgetConfig; 
  }> = ({ 
      children, 
      widget, 
      index, 
      config 
  }) => (
      <div 
        className={`relative rounded-[1.75rem] md:rounded-3xl overflow-hidden transition-all duration-300 group ${getSizeClasses(widget.size)} ${
            isEditMode 
            ? 'bg-slate-100 dark:bg-slate-800 border-2 border-dashed border-indigo-400 dark:border-indigo-500 scale-[0.96] z-30' 
            : 'bg-white dark:bg-slate-800 border border-white/50 dark:border-slate-700 shadow-lg shadow-slate-200/50 dark:shadow-none hover:shadow-xl'
        }`}
      >
          {/* EDIT CONTROLS */}
          {isEditMode && (
              <div className="absolute inset-0 bg-slate-900/60 z-50 flex flex-col items-center justify-center gap-3 backdrop-blur-sm animate-fade-in-up">
                  <div className="flex gap-2">
                      <button onClick={() => moveWidget(index, 'prev')} disabled={index === 0} className="w-10 h-10 rounded-full bg-white text-slate-800 shadow-lg flex items-center justify-center disabled:opacity-30">
                          <span className="material-symbols-outlined text-xl">arrow_back</span>
                      </button>
                      <button onClick={() => resizeWidget(widget.id)} className="w-12 h-12 rounded-full bg-indigo-600 text-white shadow-xl flex items-center justify-center animate-bounce-short">
                          <span className="material-symbols-outlined text-2xl">
                              {widget.size === 'small' ? 'crop_landscape' : widget.size === 'wide' ? 'crop_square' : 'crop_portrait'}
                          </span>
                      </button>
                      <button onClick={() => moveWidget(index, 'next')} disabled={index === widgets.length - 1} className="w-10 h-10 rounded-full bg-white text-slate-800 shadow-lg flex items-center justify-center disabled:opacity-30">
                          <span className="material-symbols-outlined text-xl">arrow_forward</span>
                      </button>
                  </div>
                  <button onClick={() => removeWidget(widget.id)} className="px-4 py-2 bg-red-500 text-white text-xs font-bold rounded-full shadow-lg flex items-center gap-2">
                      <span className="material-symbols-outlined text-sm">delete</span> Quitar
                  </button>
                  <span className="text-[10px] font-black bg-black/50 text-white px-2 py-0.5 rounded-full uppercase tracking-tighter">
                      {widget.size}
                  </span>
              </div>
          )}
          
          <div className="h-full w-full flex flex-col">
             {children}
          </div>
      </div>
  );

  // 1. INDEPENDENT BUTTONS (Weather, BCV, Report, SOS)
  
  const WeatherWidget = ({ size }: { size: WidgetSize }) => {
      const bgClass = 'bg-gradient-to-br from-sky-400 to-blue-600';
      
      if (size === 'small') {
          return (
              <div className={`h-full flex flex-col items-center justify-center ${bgClass} text-white p-3 text-center relative overflow-hidden`}>
                  <div className="absolute top-0 right-0 p-2 opacity-10">
                      <span className="material-symbols-outlined text-5xl">cloud</span>
                  </div>
                  <span className="material-symbols-outlined text-3xl md:text-4xl mb-1 drop-shadow-md z-10">{WEATHER.icon}</span>
                  <span className="text-2xl md:text-3xl font-black leading-none z-10 tracking-tighter">{WEATHER.temp}°</span>
              </div>
          );
      }
      return (
          <div className={`h-full ${bgClass} text-white p-4 md:p-5 flex flex-col justify-between relative overflow-hidden`}>
              <div className="absolute -right-6 -top-6 text-white/10">
                  <span className="material-symbols-outlined text-8xl md:text-9xl">wb_sunny</span>
              </div>
              <div className="flex items-center gap-3 z-10">
                  <span className="material-symbols-outlined text-4xl text-yellow-300 drop-shadow-lg">{WEATHER.icon}</span>
                  <div>
                      <span className="text-3xl md:text-4xl font-black tracking-tighter">{WEATHER.temp}°</span>
                      <p className="text-xs md:text-sm font-bold opacity-90">{WEATHER.condition}</p>
                  </div>
              </div>
              <div className="flex gap-3 mt-2 text-[9px] md:text-[10px] bg-white/20 backdrop-blur-md rounded-xl p-2 self-start font-black z-10">
                  <span className="flex items-center gap-1"><span className="material-symbols-outlined text-xs">water_drop</span> {WEATHER.humidity}</span>
                  <span className="flex items-center gap-1"><span className="material-symbols-outlined text-xs">air</span> 12km/h</span>
              </div>
          </div>
      );
  };

  const BcvWidget = ({ size }: { size: WidgetSize }) => {
      if (size === 'small') {
          return (
              <div className="h-full flex flex-col items-center justify-center p-3 bg-white dark:bg-slate-800 relative">
                  <div className="absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r from-emerald-500 to-green-600"></div>
                  <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">BCV</p>
                  <p className="text-xl md:text-2xl font-black text-slate-800 dark:text-white tracking-tight">{BCV_RATE.value}</p>
                  <span className={`text-[9px] font-bold flex items-center ${BCV_RATE.trend === 'up' ? 'text-red-500' : 'text-green-500'}`}>
                      {BCV_RATE.trend === 'up' ? '▲ Bs' : '▼ Bs'}
                  </span>
              </div>
          );
      }
      return (
          <div className="h-full flex flex-col justify-center p-4 md:p-5 bg-white dark:bg-slate-800 relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4 opacity-5">
                  <span className="material-symbols-outlined text-7xl">attach_money</span>
              </div>
              <div className="flex justify-between items-end relative z-10">
                  <div>
                      <div className="flex items-center gap-2 mb-1">
                          <div className="w-6 h-6 rounded-full bg-slate-100 dark:bg-slate-700 flex items-center justify-center">
                              <span className="text-[10px] font-bold text-slate-600 dark:text-slate-300">$$</span>
                          </div>
                          <p className="text-[10px] md:text-xs font-black text-slate-500 uppercase tracking-wide">Tasa Oficial</p>
                      </div>
                      <p className="text-3xl md:text-4xl font-black text-slate-900 dark:text-white tracking-tighter">
                          {BCV_RATE.value} <span className="text-xs md:text-sm font-medium text-slate-400">Bs/USD</span>
                      </p>
                  </div>
                  <div className={`text-right ${BCV_RATE.trend === 'up' ? 'text-red-500' : 'text-green-500'}`}>
                      <span className="material-symbols-outlined text-2xl md:text-3xl">{BCV_RATE.trend === 'up' ? 'trending_up' : 'trending_down'}</span>
                  </div>
              </div>
          </div>
      );
  };

  const ReportActionWidget = ({ size }: { size: WidgetSize }) => {
      const isSmall = size === 'small';
      return (
          <button 
            onClick={() => onNavigate('report')}
            className={`h-full w-full relative overflow-hidden group bg-gradient-to-br from-indigo-500 to-purple-600 text-white flex ${isSmall ? 'flex-col items-center justify-center gap-1' : 'items-center justify-between px-5 md:px-6'}`}
          >
              <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <span className={`material-symbols-outlined ${isSmall ? 'text-3xl' : 'text-4xl'} z-10 drop-shadow-md`}>add_a_photo</span>
              <span className={`${isSmall ? 'text-[9px]' : 'text-xs md:text-sm'} font-black z-10 uppercase tracking-wide`}>
                  {isSmall ? 'Reportar' : 'Nuevo Reporte'}
              </span>
          </button>
      );
  };

  const SosActionWidget = ({ size }: { size: WidgetSize }) => {
      const isSmall = size === 'small';
      return (
          <button 
            onClick={() => onNavigate('emergency')}
            className={`h-full w-full relative overflow-hidden group bg-gradient-to-br from-red-500 to-rose-700 text-white flex ${isSmall ? 'flex-col items-center justify-center gap-1' : 'items-center justify-between px-5 md:px-6'}`}
          >
              <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-red-400/30 rounded-full animate-ping opacity-20"></div>
              <span className={`material-symbols-outlined ${isSmall ? 'text-3xl' : 'text-4xl'} z-10 drop-shadow-md`}>e911_emergency</span>
              <span className={`${isSmall ? 'text-[9px]' : 'text-xs md:text-sm'} font-black z-10 uppercase tracking-wide`}>
                  {isSmall ? 'SOS' : 'Emergencia'}
              </span>
          </button>
      );
  };

  const ServicesWidget = ({ size }: { size: WidgetSize }) => {
      const TABS = {
          luz: { color: 'text-yellow-600', bg: 'bg-yellow-500', icon: 'bolt', data: ELECTRICITY_ZONES },
          agua: { color: 'text-blue-600', bg: 'bg-blue-500', icon: 'water_drop', data: WATER_ZONES },
          gas: { color: 'text-orange-600', bg: 'bg-orange-500', icon: 'propane', data: GAS_ZONES }
      };

      const activeConfig = TABS[serviceTab];

      if (size === 'small') {
          return (
              <div className="h-full flex flex-col p-3 md:p-4 justify-center gap-3 bg-slate-50 dark:bg-slate-800">
                  {Object.entries(TABS).map(([key, config]) => (
                      <div key={key} className="flex items-center justify-between">
                          <span className={`material-symbols-outlined text-sm ${config.color} dark:text-white`}>{config.icon}</span>
                          <div className={`w-2.5 h-2.5 rounded-full ${key === 'agua' ? 'bg-red-500 animate-pulse shadow-[0_0_8px_red]' : 'bg-green-500 shadow-[0_0_8px_lime]'}`}></div>
                      </div>
                  ))}
              </div>
          );
      }

      return (
          <div className="h-full flex flex-col p-0 bg-white dark:bg-slate-800">
              <div className="p-3 pb-0 flex gap-1.5 overflow-x-auto scrollbar-hide">
                  {(Object.keys(TABS) as Array<keyof typeof TABS>).map((key) => {
                      const isActive = serviceTab === key;
                      const tabConf = TABS[key];
                      return (
                          <button
                              key={key}
                              onClick={() => setServiceTab(key)}
                              className={`flex-1 py-1.5 px-2 rounded-full text-[9px] md:text-[10px] font-black uppercase transition-all flex items-center justify-center gap-1 ${
                                  isActive 
                                  ? `${tabConf.bg} text-white shadow-md scale-105` 
                                  : 'bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400'
                              }`}
                          >
                              <span className="material-symbols-outlined text-sm">{tabConf.icon}</span>
                              {key}
                          </button>
                      );
                  })}
              </div>

              <div className="flex-1 overflow-y-auto p-3 space-y-2 custom-scrollbar">
                  {activeConfig.data.map((item) => (
                      <div key={item.id} className="flex items-center justify-between p-2.5 md:p-3 rounded-2xl bg-slate-50 dark:bg-slate-700/30 border border-slate-100 dark:border-slate-700">
                          <div className="flex flex-col min-w-0 pr-2">
                              <span className="text-xs font-black text-slate-800 dark:text-white truncate">{item.name}</span>
                              <span className="text-[9px] md:text-[10px] text-slate-500 dark:text-slate-400 truncate">{item.info}</span>
                          </div>
                          <div className={`w-2.5 h-2.5 rounded-full shrink-0 ${
                              item.status === 'active' ? 'bg-green-500 shadow-[0_0_8px_lime]' : 
                              item.status === 'critical' ? 'bg-red-500 shadow-[0_0_8px_red] animate-pulse' : 
                              'bg-yellow-500'
                          }`}></div>
                      </div>
                  ))}
              </div>
          </div>
      );
  };

  const MarketplaceWidget = ({ size }: { size: WidgetSize }) => {
      const topProducts = MOCK_PRODUCTS.slice(0, size === 'large' ? 4 : 2);

      if (size === 'small') {
          return (
              <div className="h-full flex flex-col items-center justify-center p-3 bg-indigo-50 dark:bg-slate-800 text-indigo-600 dark:text-indigo-400">
                  <div className="w-10 h-10 rounded-2xl bg-white dark:bg-slate-700 shadow-sm flex items-center justify-center mb-1">
                      <span className="material-symbols-outlined text-2xl">storefront</span>
                  </div>
                  <span className="text-[9px] font-black uppercase text-center leading-tight tracking-tighter">Mercado<br/>Comunal</span>
              </div>
          );
      }

      return (
          <div className="h-full p-4 bg-white dark:bg-slate-800 flex flex-col">
              <div className="flex justify-between items-center mb-3 shrink-0">
                  <h4 className="text-[10px] md:text-xs font-black text-slate-500 uppercase flex items-center gap-1">
                      <span className="material-symbols-outlined text-sm text-indigo-500">storefront</span>
                      Nuevos Arribos
                  </h4>
                  <button onClick={() => onNavigate('market_home')} className="w-6 h-6 rounded-full bg-slate-100 dark:bg-slate-700 flex items-center justify-center text-slate-500">
                      <span className="material-symbols-outlined text-sm">arrow_forward</span>
                  </button>
              </div>
              <div className="flex gap-3 overflow-x-auto scrollbar-hide flex-1 items-center pb-1">
                  {topProducts.map(prod => (
                      <div key={prod.id} className="min-w-[100px] md:min-w-[110px] w-[48%] bg-white dark:bg-slate-700 rounded-2xl overflow-hidden shadow-sm border border-gray-100 dark:border-slate-600 flex flex-col h-full group">
                          <div className="h-20 md:h-24 relative overflow-hidden">
                              <img src={prod.image} alt={prod.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                              <div className="absolute top-1.5 right-1.5 bg-black/70 backdrop-blur-sm text-white text-[9px] px-1.5 py-0.5 font-black rounded-full">
                                  ${prod.price}
                              </div>
                          </div>
                          <div className="p-2 flex flex-col flex-1 justify-center">
                              <p className="text-[9px] font-black text-slate-800 dark:text-slate-100 truncate leading-tight">{prod.name}</p>
                              <p className="text-[8px] md:text-[9px] text-slate-400 truncate">{prod.seller}</p>
                          </div>
                      </div>
                  ))}
              </div>
          </div>
      );
  };

  const BulletinWidget = ({ size }: { size: WidgetSize }) => {
      const news = MOCK_BULLETIN[0];

      if (size === 'small') {
          return (
              <div className="h-full flex flex-col items-center justify-center p-3 bg-orange-50 dark:bg-slate-800 text-orange-600 dark:text-orange-400 text-center">
                  <span className="material-symbols-outlined text-3xl mb-1 animate-pulse">campaign</span>
                  <span className="text-[9px] font-black uppercase leading-none tracking-tighter">Cartelera<br/>Comunal</span>
              </div>
          );
      }

      return (
          <div className="h-full p-4 md:p-5 bg-gradient-to-br from-orange-50 to-orange-100 dark:from-slate-800 dark:to-slate-900 flex flex-col relative overflow-hidden">
              <div className="absolute -right-4 -top-4 w-24 h-24 bg-orange-500/10 rounded-full blur-xl"></div>
              <div className="relative z-10 flex flex-col h-full justify-between">
                  <div className="flex items-center gap-2 mb-2">
                      <span className="bg-orange-500 text-white text-[8px] md:text-[9px] font-black px-2 py-0.5 rounded-full uppercase">Importante</span>
                      <span className="text-[9px] md:text-[10px] text-slate-500 dark:text-slate-400 font-bold">{news.date}</span>
                  </div>
                  <div className="flex-1 flex flex-col justify-center">
                      <p className="text-xs md:text-sm font-black text-slate-900 dark:text-white leading-tight line-clamp-2">
                          {news.title}
                      </p>
                      <p className="text-[10px] md:text-xs text-slate-600 dark:text-slate-300 mt-2 line-clamp-2 md:line-clamp-3 leading-snug">
                          {news.content}
                      </p>
                  </div>
              </div>
          </div>
      );
  };

  const MapWidget = ({ size }: { size: WidgetSize }) => {
      if (size === 'small') {
          return (
              <div className="h-full w-full relative bg-slate-200 dark:bg-slate-700 flex flex-col items-center justify-center group cursor-pointer overflow-hidden" onClick={() => resizeWidget('map')}>
                  <div className="absolute inset-0 bg-[url('https://picsum.photos/400/400?grayscale')] bg-cover opacity-60"></div>
                  <div className="w-10 h-10 bg-white/90 backdrop-blur-md rounded-2xl flex items-center justify-center text-brand-blue shadow-lg relative z-10 border border-white">
                      <span className="material-symbols-outlined text-xl">map</span>
                  </div>
              </div>
          );
      }

      return (
          <div className="h-full w-full relative group overflow-hidden">
              <div className="absolute inset-0 bg-[url('https://picsum.photos/800/600?grayscale')] bg-cover transition-transform duration-1000 group-hover:scale-105"></div>
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-80"></div>
              
              <div className="absolute top-3 left-3 flex gap-1">
                  {(['all', 'luz'] as const).map(f => (
                      <button 
                        key={f} 
                        onClick={(e) => { e.stopPropagation(); setMapFilter(f); }}
                        className={`text-[8px] md:text-[9px] uppercase font-black px-2 py-1 md:px-3 md:py-1.5 rounded-full backdrop-blur-md border border-white/20 transition-all ${
                            mapFilter === f ? 'bg-brand-blue text-white' : 'bg-white/80 text-slate-800'
                        }`}
                      >
                          {f}
                      </button>
                  ))}
              </div>
              
              <div className="absolute top-1/2 left-1/3 w-6 h-6 -ml-3 -mt-3 flex items-center justify-center">
                  <div className="w-2 h-2 bg-red-500 rounded-full animate-ping absolute"></div>
                  <div className="w-3 h-3 bg-red-500 rounded-full border-2 border-white shadow-lg relative z-10"></div>
              </div>
              
              <div className="absolute bottom-3 left-3 right-3 flex justify-between items-end">
                  <div>
                      <p className="text-white text-[10px] md:text-xs font-black drop-shadow-md">Mapa Comunal</p>
                      <p className="text-white/80 text-[8px] md:text-[9px] font-bold">Tiempo Real</p>
                  </div>
                  <button className="bg-white/20 backdrop-blur-md p-1.5 md:p-2 rounded-full text-white border border-white/20">
                      <span className="material-symbols-outlined text-sm md:text-lg">fullscreen</span>
                  </button>
              </div>
          </div>
      );
  };

  const renderWidget = (widget: UserWidget) => {
      switch(widget.id) {
          case 'weather': return <WeatherWidget size={widget.size} />;
          case 'bcv': return <BcvWidget size={widget.size} />;
          case 'report_action': return <ReportActionWidget size={widget.size} />;
          case 'sos_action': return <SosActionWidget size={widget.size} />;
          case 'map': return <MapWidget size={widget.size} />;
          case 'services': return <ServicesWidget size={widget.size} />;
          case 'marketplace': return <MarketplaceWidget size={widget.size} />;
          case 'bulletin': return <BulletinWidget size={widget.size} />;
          default: return null;
      }
  };

  return (
    <div className="flex flex-col min-h-full bg-slate-50 dark:bg-slate-900 pb-28 md:pb-6 transition-colors duration-300 relative overflow-x-hidden">
      
      {/* Header */}
      <header className="bg-white/95 dark:bg-slate-800/95 backdrop-blur-md px-5 pt-6 pb-4 sticky top-0 z-40 border-b border-gray-100 dark:border-slate-700/50">
        <div className="flex justify-between items-center max-w-7xl mx-auto w-full">
          <div className="animate-fade-in-down">
            <h2 className="text-xl md:text-2xl font-black text-slate-800 dark:text-white tracking-tighter leading-none">Banco Obrero</h2>
            <p className="text-[10px] font-black text-brand-green dark:text-emerald-400 uppercase tracking-[0.15em] mt-1">Comuna Inteligente</p>
          </div>
          <div className="flex items-center gap-2">
             <button 
                onClick={() => setIsEditMode(!isEditMode)}
                className={`w-10 h-10 md:w-11 md:h-11 rounded-2xl transition-all flex items-center justify-center ${isEditMode ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/30 ring-4 ring-indigo-500/10' : 'bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-300'}`}
             >
                <span className="material-symbols-outlined text-xl md:text-2xl">{isEditMode ? 'check' : 'dashboard_customize'}</span>
             </button>
             <button onClick={toggleNotifications} className="w-10 h-10 md:w-11 md:h-11 relative rounded-2xl bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-300 flex items-center justify-center">
                <span className="material-symbols-outlined text-xl md:text-2xl">notifications</span>
                {unreadCount > 0 && <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-red-500 rounded-full border border-white dark:border-slate-700 animate-pulse"></span>}
             </button>
          </div>
        </div>
      </header>

      {/* Edit Mode Banner */}
      {isEditMode && (
          <div className="bg-indigo-600 text-white text-[10px] md:text-xs font-black py-2.5 text-center sticky top-[76px] md:top-[88px] z-30 shadow-lg border-b border-indigo-500/50 uppercase tracking-widest animate-fade-in-down">
              Personalización Activa • Toca y arrastra
          </div>
      )}

      {/* THE TETRIS GRID */}
      <div className={`p-4 md:p-6 grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 md:gap-6 auto-rows-[155px] md:auto-rows-[180px] grid-flow-dense max-w-7xl mx-auto w-full transition-all duration-500 ${isEditMode ? 'bg-indigo-50/30 dark:bg-indigo-950/10 min-h-screen' : ''}`}>
          {widgets.map((widget, idx) => (
              <WidgetContainer key={widget.id} widget={widget} index={idx} config={ALL_WIDGETS_CONFIG[widget.id]}>
                  {renderWidget(widget)}
              </WidgetContainer>
          ))}

          {/* Add Widget Button (Only in Edit Mode) */}
          {isEditMode && hiddenWidgets.length > 0 && (
              <div className="col-span-2 mt-6 pt-6 border-t-2 border-dashed border-slate-200 dark:border-slate-700">
                  <p className="text-[10px] font-black text-slate-400 uppercase mb-4 text-center tracking-widest">Módulos Disponibles</p>
                  <div className="flex flex-wrap gap-2.5 justify-center">
                      {hiddenWidgets.map(id => (
                          <button 
                            key={id} 
                            onClick={() => addWidget(id)}
                            className="flex items-center gap-2 px-4 py-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl shadow-sm text-[10px] font-black text-slate-600 dark:text-slate-300 transition-all hover:border-indigo-400 active:scale-95"
                          >
                              <span className="material-symbols-outlined text-lg">{ALL_WIDGETS_CONFIG[id].icon}</span>
                              {ALL_WIDGETS_CONFIG[id].label}
                              <span className="material-symbols-outlined text-lg text-emerald-500">add_circle</span>
                          </button>
                      ))}
                  </div>
              </div>
          )}
      </div>

      {/* Notifications Overlay (Improved for Mobile & Desktop) */}
      {showNotifications && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm transition-opacity" onClick={() => setShowNotifications(false)}>
            <div 
                className="absolute top-20 right-4 left-4 md:left-auto md:w-96 bg-white dark:bg-slate-800 rounded-[2rem] shadow-2xl p-5 md:p-6 animate-fade-in-up border border-white dark:border-slate-700" 
                onClick={e => e.stopPropagation()}
            >
                <div className="flex justify-between items-center mb-5">
                    <h3 className="font-black text-slate-800 dark:text-white text-lg tracking-tight">Notificaciones</h3>
                    <button onClick={() => setShowNotifications(false)} className="w-8 h-8 rounded-full bg-slate-50 dark:bg-slate-700 flex items-center justify-center text-slate-400">
                        <span className="material-symbols-outlined text-lg">close</span>
                    </button>
                </div>
                <div className="space-y-3 max-h-[60vh] overflow-y-auto custom-scrollbar">
                    {MOCK_NOTIFICATIONS.slice(0,5).map(n => (
                        <div key={n.id} className={`text-sm p-4 rounded-3xl border transition-colors ${n.read ? 'bg-slate-50 dark:bg-slate-700/30 border-slate-100 dark:border-slate-700 opacity-60' : 'bg-white dark:bg-slate-800 border-blue-100 dark:border-blue-900/30 shadow-sm'}`}>
                            <div className="flex justify-between items-start mb-1">
                                <p className="font-black text-slate-800 dark:text-slate-100 leading-tight">{n.title}</p>
                                {!n.read && <span className="w-2 h-2 bg-blue-500 rounded-full shrink-0 mt-1"></span>}
                            </div>
                            <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 leading-snug">{n.message}</p>
                            <p className="text-[9px] font-bold text-slate-300 dark:text-slate-500 mt-2 uppercase">{n.time}</p>
                        </div>
                    ))}
                    {MOCK_NOTIFICATIONS.length === 0 && (
                        <div className="py-10 text-center text-slate-400">
                            <span className="material-symbols-outlined text-4xl mb-2 opacity-20">notifications_off</span>
                            <p className="text-xs font-bold">No hay notificaciones nuevas</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
      )}
    </div>
  );
};