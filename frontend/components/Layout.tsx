import React, { useState, useEffect } from 'react';
import { UserRole, UserProfileData } from '../types';
import { AdminMaintenance } from '../views/AdminMaintenance';

interface LayoutProps {
  children: React.ReactNode;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  cartItemCount?: number;
  user?: UserProfileData;
}

// Definition of the Sidebar Menu Structure
const SIDEBAR_GROUPS = [
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
      { id: 'market_home', icon: 'storefront', label: 'Mercado & Carrito', hasBadge: true },
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

export const Layout: React.FC<LayoutProps> = ({ children, activeTab, setActiveTab, cartItemCount = 0, user }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isAdminPanelOpen, setIsAdminPanelOpen] = useState(false);
  const [isAdminExpanded, setIsAdminExpanded] = useState(false);
  
  // State for collapsible groups - accordion behavior (only one active)
  const [expandedGroups, setExpandedGroups] = useState<Record<string, boolean>>({});

  const isAdmin = user?.role === UserRole.ADMIN || user?.role === UserRole.AUDITOR;

  // Initialize/Update expanded state based on activeTab (Accordion logic)
  useEffect(() => {
      const activeGroup = SIDEBAR_GROUPS.find(g => g.items.some(item => item.id === activeTab));
      
      if (activeGroup && activeGroup.title !== 'Principal') {
          setExpandedGroups({ [activeGroup.title]: true });
      } else {
          setExpandedGroups({});
      }
  }, [activeTab]);

  // Handle manual toggle (Accordion behavior: collapses others when opening a new one)
  const toggleGroup = (title: string) => {
      setExpandedGroups(prev => {
          const isCurrentlyExpanded = prev[title];
          if (isCurrentlyExpanded) {
              return {}; // Collapse if already open
          } else {
              return { [title]: true }; // Open only the selected one
          }
      });
  };

  // Simplified Bottom Nav for Mobile
  const mobileNavItems = [
    { id: 'home', icon: 'home', label: 'Inicio' },
    { id: 'market_home', icon: 'storefront', label: 'Mercado' },
    { id: 'menu_trigger', icon: 'grid_view', label: 'Menú', action: () => setIsMobileMenuOpen(true) },
  ];

  const handleMobileNavigation = (id: string) => {
    setActiveTab(id);
    setIsMobileMenuOpen(false);
  };

  // Helper to map roles to requested display names
  const getUserTypeLabel = (role?: UserRole) => {
      if (!role) return 'Visitante';
      switch (role) {
          case UserRole.ADMIN: return 'Usuario Administrativo';
          case UserRole.AUDITOR: return 'Usuario Gubernamental';
          case UserRole.LEADER: return 'Usuario Mantenimiento';
          case UserRole.CITIZEN: default: return 'Usuario Natural';
      }
  };

  return (
    <div className="flex flex-col h-screen w-full bg-gray-50 dark:bg-slate-900 overflow-hidden transition-colors duration-300 relative">
      
      {/* ADMIN FLOATING TOOL (FAB) */}
      {isAdmin && (
        <>
            {!isAdminExpanded && (
                <button
                    onClick={() => setIsAdminPanelOpen(!isAdminPanelOpen)}
                    className={`fixed z-[70] bottom-24 md:bottom-8 right-4 md:right-8 w-14 h-14 rounded-full shadow-2xl flex items-center justify-center transition-all duration-300 border-2 ${
                        isAdminPanelOpen 
                        ? 'bg-slate-900 text-white border-indigo-500 rotate-90' 
                        : 'bg-slate-800 text-slate-400 border-slate-700 hover:text-white hover:scale-110'
                    }`}
                    title="Consola de Ingeniería"
                >
                    <span className="material-symbols-outlined text-2xl">terminal</span>
                </button>
            )}

            {/* Admin Floating Panel */}
            <div 
                className={`fixed z-[65] transition-all duration-500 ease-in-out bg-slate-900 border border-slate-700 overflow-hidden shadow-2xl origin-bottom-right
                ${isAdminPanelOpen ? 'opacity-100 scale-100' : 'opacity-0 scale-0 pointer-events-none'}
                ${isAdminExpanded 
                    ? 'inset-0 rounded-none w-full h-full m-0' 
                    : 'bottom-40 md:bottom-24 right-4 md:right-8 w-80 h-96 rounded-xl'
                }`}
            >
                {isAdminPanelOpen && (
                    <AdminMaintenance 
                        currentView={activeTab} 
                        isExpanded={isAdminExpanded}
                        onToggleExpand={() => setIsAdminExpanded(!isAdminExpanded)}
                        onClose={() => {
                            setIsAdminPanelOpen(false);
                            setIsAdminExpanded(false);
                        }}
                    />
                )}
            </div>
        </>
      )}

      {/* Desktop Sidebar (Visible only on md+) */}
      <div className="hidden md:flex flex-row h-full">
        <aside className="w-64 bg-slate-50 dark:bg-slate-800 border-r border-gray-200 dark:border-slate-700 flex flex-col h-full overflow-hidden transition-colors duration-300">
          <div className="p-5 border-b border-gray-200 dark:border-slate-700 flex-shrink-0 bg-white dark:bg-slate-800">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-brand-blue dark:text-sky-400 text-3xl">account_balance</span>
              <div>
                <h1 className="font-bold text-slate-800 dark:text-white leading-tight">Banco Obrero</h1>
                <p className="text-sm text-brand-green dark:text-emerald-400 font-bold uppercase tracking-widest">Comuna Inteligente</p>
              </div>
            </div>
          </div>

          <nav className="flex-1 overflow-y-auto p-4 scrollbar-hide space-y-1">
            {SIDEBAR_GROUPS.map((group) => {
              const isPrincipal = group.title === 'Principal';
              const isExpanded = expandedGroups[group.title] || isPrincipal;
              
              return (
                <div key={group.title} className="mb-2">
                  {!isPrincipal && (
                    <button
                      onClick={() => toggleGroup(group.title)}
                      className={`w-full flex items-center justify-between px-3 py-3 rounded-xl transition-all duration-200 group/header outline-none border border-transparent ${
                        isExpanded 
                        ? 'bg-white dark:bg-slate-700/80 shadow-sm border-gray-100 dark:border-slate-600' 
                        : 'hover:bg-white/60 dark:hover:bg-slate-700/40'
                      }`}
                    >
                        <div className="flex items-center gap-3">
                            <div className={`w-1 h-4 rounded-full transition-all ${isExpanded ? 'bg-brand-blue dark:bg-sky-400 h-4' : 'bg-slate-300 dark:bg-slate-600 h-2'}`}></div>
                            <h3 className={`text-xs font-extrabold uppercase tracking-wider transition-colors ${
                                isExpanded 
                                ? 'text-brand-blue dark:text-sky-400' 
                                : 'text-slate-500 dark:text-slate-400 group-hover/header:text-slate-700 dark:group-hover/header:text-slate-200'
                            }`}>
                                {group.title}
                            </h3>
                        </div>
                        <span className={`material-symbols-outlined text-lg transition-transform duration-300 ${
                            isExpanded ? 'rotate-180 text-brand-blue dark:text-sky-400' : 'text-slate-400'
                        }`}>
                            expand_more
                        </span>
                    </button>
                  )}
                  
                  <div className={`overflow-hidden transition-all duration-300 ease-in-out ${
                      isExpanded ? 'max-h-[500px] opacity-100 mt-1' : 'max-h-0 opacity-0'
                  }`}>
                    <div className={`${!isPrincipal ? 'pl-2 border-l-2 border-slate-100 dark:border-slate-700 ml-4 space-y-1 py-1' : 'space-y-1'}`}>
                        {group.items.map((item) => (
                            <button
                                key={item.id}
                                onClick={() => setActiveTab(item.id)}
                                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all relative ${
                                activeTab === item.id 
                                    ? item.alert 
                                    ? 'bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 font-bold'
                                    : 'bg-brand-blue dark:bg-sky-600 text-white shadow-md shadow-brand-blue/20 dark:shadow-sky-900/30 font-medium'
                                    : item.danger
                                    ? 'text-red-500 hover:bg-red-50 dark:hover:bg-red-900/10'
                                    : 'text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700/50 hover:text-brand-blue dark:hover:text-sky-300'
                                }`}
                            >
                                <span className={`material-symbols-outlined text-xl ${
                                activeTab === item.id ? '' : 'opacity-70 group-hover:opacity-100'
                                }`}>
                                {item.icon}
                                </span>
                                <span className="text-sm flex-1 text-left truncate">{item.label}</span>
                                {item.id === 'market_home' && cartItemCount > 0 && (
                                    <span className="bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full shadow-sm">
                                        {cartItemCount}
                                    </span>
                                )}
                            </button>
                        ))}
                    </div>
                  </div>
                </div>
              );
            })}
          </nav>
          
          <div className="p-4 border-t border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 flex-shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-brand-blue/10 dark:bg-sky-500/10 border border-brand-blue/20 dark:border-sky-500/20 flex items-center justify-center text-brand-blue dark:text-sky-400 font-bold">
                {user ? user.name.charAt(0) : 'G'}
              </div>
              <div className="overflow-hidden">
                <p className="text-sm font-bold text-slate-800 dark:text-white truncate leading-tight">{user ? user.name : 'Invitado'}</p>
                {user && <p className="text-[10px] font-mono text-slate-500 dark:text-slate-400">{user.cedula}</p>}
                <p className="text-[9px] font-black text-brand-blue dark:text-sky-400 uppercase tracking-wider mt-0.5 truncate">
                    {getUserTypeLabel(user?.role)}
                </p>
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

        {/* Mobile Full Menu Overlay (The Drawer) - REDESIGNED AS ACCORDION */}
        {isMobileMenuOpen && (
          <div className="fixed inset-0 z-[60] bg-gray-50 dark:bg-slate-950 overflow-hidden flex flex-col animate-fade-in-up">
            {/* Mobile Menu Header */}
            <div className="bg-white dark:bg-slate-900 px-6 pt-8 pb-6 border-b border-gray-100 dark:border-slate-800 flex justify-between items-center shrink-0">
               <div>
                  <h2 className="text-2xl font-black text-slate-800 dark:text-white flex items-center gap-2">
                    <span className="material-symbols-outlined text-brand-blue">grid_view</span>
                    Panel de Control
                  </h2>
                  <p className="text-xs text-slate-500 dark:text-slate-400 uppercase tracking-widest font-bold mt-1">Explora la plataforma</p>
               </div>
               <button 
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="w-11 h-11 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-500 dark:text-slate-300 active:scale-90 transition-all"
               >
                  <span className="material-symbols-outlined">close</span>
               </button>
            </div>
            
            {/* Scrollable Accordion Navigation */}
            <nav className="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar">
               {SIDEBAR_GROUPS.map((group) => {
                  const isPrincipal = group.title === 'Principal';
                  const isExpanded = expandedGroups[group.title] || isPrincipal;

                  return (
                    <div key={group.title} className="bg-white dark:bg-slate-900 rounded-3xl border border-gray-100 dark:border-slate-800 overflow-hidden shadow-sm">
                        {/* Group Header Mobile */}
                        {!isPrincipal && (
                            <button 
                                onClick={() => toggleGroup(group.title)}
                                className={`w-full flex items-center justify-between px-5 py-4 transition-all ${isExpanded ? 'bg-slate-50/80 dark:bg-slate-800/50' : ''}`}
                            >
                                <div className="flex items-center gap-3">
                                    <div className={`w-1.5 h-6 rounded-full transition-all duration-500 ${isExpanded ? 'bg-brand-blue dark:bg-sky-400 scale-y-100' : 'bg-slate-200 dark:bg-slate-700 scale-y-50'}`}></div>
                                    <span className={`text-xs font-black uppercase tracking-widest ${isExpanded ? 'text-brand-blue dark:text-sky-400' : 'text-slate-500 dark:text-slate-400'}`}>
                                        {group.title}
                                    </span>
                                </div>
                                <span className={`material-symbols-outlined text-slate-400 transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`}>
                                    expand_more
                                </span>
                            </button>
                        )}

                        {/* Group Content Mobile */}
                        <div className={`overflow-hidden transition-all duration-300 ease-in-out ${isExpanded ? 'max-h-[800px] opacity-100' : 'max-h-0 opacity-0'}`}>
                            <div className="grid grid-cols-1 gap-1 p-2">
                                {group.items.map((item) => (
                                    <button
                                        key={item.id}
                                        onClick={() => handleMobileNavigation(item.id)}
                                        className={`flex items-center gap-4 w-full p-4 rounded-2xl transition-all active:scale-[0.98] ${
                                            activeTab === item.id 
                                            ? 'bg-brand-blue/10 text-brand-blue dark:bg-sky-500/20 dark:text-sky-300 font-bold' 
                                            : item.alert 
                                                ? 'bg-red-50 dark:bg-red-900/10 text-red-600 dark:text-red-400'
                                                : item.danger
                                                    ? 'text-red-500 hover:bg-red-50 dark:hover:bg-red-900/10'
                                                    : 'text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/50'
                                        }`}
                                    >
                                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                                            activeTab === item.id ? 'bg-brand-blue text-white shadow-md' : 'bg-slate-100 dark:bg-slate-800 text-slate-400'
                                        }`}>
                                            <span className={`material-symbols-outlined ${item.alert ? 'animate-pulse' : ''}`}>{item.icon}</span>
                                        </div>
                                        <span className="text-sm font-bold flex-1 text-left">{item.label}</span>
                                        {item.id === 'market_home' && cartItemCount > 0 && (
                                            <span className="bg-red-500 text-white text-[10px] font-black w-6 h-6 flex items-center justify-center rounded-full shadow-lg">
                                                {cartItemCount}
                                            </span>
                                        )}
                                        <span className="material-symbols-outlined text-slate-300 dark:text-slate-700 text-sm">chevron_right</span>
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                  );
               })}
            </nav>

            {/* Mobile User Footer */}
            <div className="bg-white dark:bg-slate-900 p-6 border-t border-gray-100 dark:border-slate-800 shrink-0 pb-10">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-brand-blue/10 dark:bg-sky-500/10 border border-brand-blue/20 dark:border-sky-500/20 flex items-center justify-center text-brand-blue dark:text-sky-400 font-black text-xl">
                            {user?.name.charAt(0)}
                        </div>
                        <div>
                            <p className="font-black text-slate-800 dark:text-white leading-none">{user?.name}</p>
                            {user && <p className="text-[10px] font-mono text-slate-500 dark:text-slate-400 mt-0.5">{user.cedula}</p>}
                            <p className="text-[10px] text-brand-blue dark:text-sky-400 mt-0.5 uppercase tracking-wider font-bold">
                                {getUserTypeLabel(user?.role)}
                            </p>
                        </div>
                    </div>
                    <button 
                        onClick={() => handleMobileNavigation('logout')}
                        className="w-10 h-10 rounded-full bg-red-50 dark:bg-red-900/20 text-red-500 flex items-center justify-center"
                    >
                        <span className="material-symbols-outlined">logout</span>
                    </button>
                </div>
            </div>
          </div>
        )}

        {/* Mobile Bottom Navigation */}
        <nav className="fixed bottom-0 left-0 right-0 bg-white dark:bg-slate-800 border-t border-gray-200 dark:border-slate-700 px-4 py-2 flex justify-around items-center z-50 pb-safe shadow-[0_-5px_10px_rgba(0,0,0,0.02)] transition-colors duration-300">
          {mobileNavItems.map((item) => {
            return (
              <button
                key={item.id}
                onClick={() => {
                  if (item.action) item.action();
                  else setActiveTab(item.id);
                }}
                className={`flex flex-col items-center gap-1 transition-colors relative w-20 ${
                  activeTab === item.id && !isMobileMenuOpen 
                    ? 'text-brand-blue dark:text-sky-400 font-bold' 
                    : item.id === 'menu_trigger' && isMobileMenuOpen
                        ? 'text-brand-blue dark:text-sky-400 font-bold'
                        : 'text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300'
                }`}
              >
                <span className={`material-symbols-outlined ${activeTab === item.id || (item.id === 'menu_trigger' && isMobileMenuOpen) ? 'filled' : ''} text-2xl`}>
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