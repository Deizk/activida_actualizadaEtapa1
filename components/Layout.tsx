import React, { useState } from 'react';

interface LayoutProps {
  children: React.ReactNode;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  cartItemCount?: number; // Prop to show badge count
}

export const Layout: React.FC<LayoutProps> = ({ children, activeTab, setActiveTab, cartItemCount = 0 }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  // Definition of the Sidebar Menu Structure
  const sidebarGroups = [
    {
      title: 'Principal',
      items: [
        { id: 'home', icon: 'home', label: 'Inicio' },
      ]
    },
    {
      title: 'Incidencias & IA',
      items: [
        { id: 'ai_decision', icon: 'psychology', label: 'Decisión IA' },
        { id: 'report', icon: 'add_circle', label: 'Nuevo Reporte' },
        { id: 'emergency', icon: 'e911_emergency', label: 'Modo Emergencia', alert: true },
      ]
    },
    {
      title: 'Bienestar Social',
      items: [
         { id: 'health', icon: 'cardiology', label: 'Salud' },
      ]
    },
    {
      title: 'Gobernanza',
      items: [
        { id: 'dashboard', icon: 'analytics', label: 'Dashboard' },
        { id: 'ai_registry', icon: 'fact_check', label: 'Registro IA' },
        { id: 'impact', icon: 'query_stats', label: 'Impacto' },
      ]
    },
    {
      title: 'Mercado',
      items: [
        { id: 'market_home', icon: 'storefront', label: 'Mercado & Carrito', badge: cartItemCount > 0 ? cartItemCount : undefined },
        { id: 'my_business', icon: 'store', label: 'Mi Negocio' },
      ]
    },
    {
      title: 'Democracia',
      items: [
        { id: 'voting_active', icon: 'how_to_vote', label: 'Votación' },
        { id: 'voting_history', icon: 'history', label: 'Historial' },
      ]
    },
    {
      title: 'Voluntariado',
      items: [
        { id: 'tasks', icon: 'volunteer_activism', label: 'Tareas' },
      ]
    },
    {
      title: 'Usuario',
      items: [
        { id: 'profile', icon: 'person', label: 'Perfil' },
        { id: 'minors', icon: 'child_care', label: 'Menores a Cargo' },
        { id: 'census', icon: 'badge', label: 'Censo' },
        { id: 'settings', icon: 'settings', label: 'Ajustes' },
        { id: 'logout', icon: 'logout', label: 'Salir', danger: true },
      ]
    }
  ];

  // Simplified Bottom Nav for Mobile
  const mobileNavItems = [
    { id: 'home', icon: 'home', label: 'Inicio' },
    { id: 'market_home', icon: 'storefront', label: 'Mercado' },
    { id: 'report', icon: 'add_circle', label: 'Reportar', isFab: true },
    { id: 'my_business', icon: 'store', label: 'Negocio' },
    { id: 'menu_trigger', icon: 'grid_view', label: 'Menú', action: () => setIsMobileMenuOpen(true) },
  ];

  const handleMobileNavigation = (id: string) => {
    setActiveTab(id);
    setIsMobileMenuOpen(false);
  };

  return (
    <div className="flex flex-col h-screen w-full bg-gray-50 dark:bg-slate-900 overflow-hidden transition-colors duration-300">
      {/* Desktop Sidebar (Visible only on md+) */}
      <div className="hidden md:flex flex-row h-full">
        <aside className="w-64 bg-white dark:bg-slate-800 border-r border-gray-200 dark:border-slate-700 flex flex-col h-full overflow-hidden transition-colors duration-300">
          {/* Header Fixed */}
          <div className="p-5 border-b border-gray-100 dark:border-slate-700 flex-shrink-0">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-brand-blue dark:text-sky-400 text-3xl">account_balance</span>
              <div>
                <h1 className="font-bold text-slate-800 dark:text-white leading-tight">Banco Obrero</h1>
                <p className="text-[10px] text-brand-green dark:text-emerald-400 font-bold uppercase tracking-widest">Comuna Inteligente</p>
              </div>
            </div>
          </div>

          {/* Scrollable Navigation */}
          <nav className="flex-1 overflow-y-auto p-4 space-y-6 scrollbar-hide">
            {sidebarGroups.map((group, idx) => (
              <div key={idx}>
                {group.title !== 'Principal' && (
                  <h3 className="px-3 text-[10px] font-extrabold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-2">
                    {group.title}
                  </h3>
                )}
                <div className="space-y-1">
                  {group.items.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => setActiveTab(item.id)}
                      className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all group relative ${
                        activeTab === item.id 
                          ? item.alert 
                            ? 'bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 font-bold'
                            : 'bg-brand-blue dark:bg-sky-600 text-white shadow-lg shadow-brand-blue/20 dark:shadow-sky-900/30 font-medium'
                          : item.danger
                            ? 'text-red-500 hover:bg-red-50 dark:hover:bg-red-900/10'
                            : 'text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700/50 hover:text-brand-blue dark:hover:text-sky-300'
                      }`}
                    >
                      <span className={`material-symbols-outlined text-xl ${
                        activeTab === item.id ? '' : 'opacity-70 group-hover:opacity-100'
                      }`}>
                        {item.icon}
                      </span>
                      <span className="text-sm flex-1 text-left">{item.label}</span>
                      {item.badge && (
                          <span className="bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                              {item.badge}
                          </span>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </nav>
          
          {/* User Profile Footer */}
          <div className="p-4 border-t border-gray-100 dark:border-slate-700 bg-gray-50/50 dark:bg-slate-900/30 flex-shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-brand-blue/10 dark:bg-sky-500/10 border border-brand-blue/20 dark:border-sky-500/20 flex items-center justify-center text-brand-blue dark:text-sky-400 font-bold">
                MG
              </div>
              <div className="overflow-hidden">
                <p className="text-sm font-bold text-slate-800 dark:text-white truncate">María González</p>
                <p className="text-xs text-slate-500 dark:text-slate-400 truncate">Líder de Calle</p>
              </div>
            </div>
          </div>
        </aside>
        
        <main className="flex-1 overflow-auto relative">
          {children}
        </main>
      </div>

      {/* Mobile Layout (Visible on sm/default) */}
      <div className="md:hidden flex flex-col h-full relative">
        <main className="flex-1 overflow-auto pb-20 relative bg-gray-50 dark:bg-slate-900 transition-colors duration-300">
          {children}
        </main>

        {/* Mobile Full Menu Overlay (The Drawer) */}
        {isMobileMenuOpen && (
          <div className="fixed inset-0 z-[60] bg-white dark:bg-slate-900 overflow-y-auto animate-fade-in-up">
            <div className="sticky top-0 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md z-10 px-6 py-4 border-b border-gray-100 dark:border-slate-800 flex justify-between items-center">
               <div>
                  <h2 className="text-2xl font-black text-slate-800 dark:text-white">Menú</h2>
                  <p className="text-xs text-slate-500 dark:text-slate-400 uppercase tracking-widest font-bold">Todas las secciones</p>
               </div>
               <button 
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="w-10 h-10 rounded-full bg-gray-100 dark:bg-slate-800 flex items-center justify-center text-slate-500 dark:text-slate-300 hover:bg-gray-200 dark:hover:bg-slate-700"
               >
                  <span className="material-symbols-outlined">close</span>
               </button>
            </div>
            
            <div className="p-6 pb-24 grid grid-cols-2 gap-4">
               {sidebarGroups.map((group, idx) => (
                  <React.Fragment key={idx}>
                     {group.title !== 'Principal' && (
                        <div className="col-span-2 mt-4 first:mt-0">
                           <h3 className="text-xs font-extrabold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-3 flex items-center gap-2">
                              <span className="h-px w-4 bg-slate-300 dark:bg-slate-600"></span>
                              {group.title}
                           </h3>
                        </div>
                     )}
                     {group.items.map((item) => (
                        <button
                           key={item.id}
                           onClick={() => handleMobileNavigation(item.id)}
                           className={`flex flex-col items-center justify-center p-4 rounded-2xl border transition-all active:scale-95 ${
                              activeTab === item.id 
                              ? 'bg-brand-blue/5 border-brand-blue text-brand-blue dark:bg-sky-500/10 dark:border-sky-500 dark:text-sky-400' 
                              : item.alert 
                                 ? 'bg-red-50 border-red-100 text-red-600 dark:bg-red-900/10 dark:border-red-900/30 dark:text-red-400'
                                 : 'bg-white dark:bg-slate-800 border-gray-100 dark:border-slate-700 text-slate-600 dark:text-slate-300 shadow-sm'
                           }`}
                        >
                           <div className="relative">
                              <span className={`material-symbols-outlined text-3xl mb-2 ${item.alert ? 'animate-pulse' : ''}`}>{item.icon}</span>
                              {item.badge && (
                                 <span className="absolute -top-1 -right-2 bg-red-500 text-white text-[10px] font-bold w-5 h-5 flex items-center justify-center rounded-full border-2 border-white dark:border-slate-800">
                                    {item.badge}
                                 </span>
                              )}
                           </div>
                           <span className="text-xs font-bold text-center">{item.label}</span>
                        </button>
                     ))}
                  </React.Fragment>
               ))}
            </div>
          </div>
        )}

        {/* Mobile Bottom Navigation */}
        <nav className="fixed bottom-0 left-0 right-0 bg-white dark:bg-slate-800 border-t border-gray-200 dark:border-slate-700 px-4 py-2 flex justify-between items-center z-50 pb-safe shadow-[0_-5px_10px_rgba(0,0,0,0.02)] transition-colors duration-300">
          {mobileNavItems.map((item) => {
            if (item.isFab) {
              return (
                <button
                  key={item.id}
                  onClick={() => {
                     if (item.action) item.action();
                     else setActiveTab(item.id);
                  }}
                  className="relative -top-6 bg-gradient-to-tr from-brand-blue to-[#084b85] dark:from-sky-600 dark:to-brand-blue text-white p-4 rounded-full shadow-xl shadow-brand-blue/40 dark:shadow-sky-900/40 transform transition-transform active:scale-95 flex items-center justify-center border-4 border-gray-50 dark:border-slate-900"
                >
                  <span className="material-symbols-outlined text-3xl">add</span>
                </button>
              );
            }
            return (
              <button
                key={item.id}
                onClick={() => {
                  if (item.action) item.action();
                  else setActiveTab(item.id);
                }}
                className={`flex flex-col items-center gap-1 transition-colors relative w-16 ${
                  activeTab === item.id && !isMobileMenuOpen 
                    ? 'text-brand-blue dark:text-sky-400 font-bold' 
                    : item.id === 'menu_trigger' && isMobileMenuOpen
                        ? 'text-brand-blue dark:text-sky-400 font-bold'
                        : 'text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300'
                }`}
              >
                <span className={`material-symbols-outlined ${activeTab === item.id ? 'filled' : ''} text-2xl`}>
                  {item.icon}
                </span>
                <span className="text-[10px]">{item.label}</span>
              </button>
            );
          })}
        </nav>
      </div>
    </div>
  );
};