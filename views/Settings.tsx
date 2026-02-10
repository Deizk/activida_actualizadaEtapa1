import React, { useState } from 'react';
import { useTheme } from '../ThemeContext';

export const Settings: React.FC = () => {
  const { darkMode, toggleDarkMode, fontSize, setFontSize } = useTheme();
  
  // Local state for settings that don't have a global context yet
  const [locationEnabled, setLocationEnabled] = useState(true);
  const [publicProfile, setPublicProfile] = useState(false);
  const [notifications, setNotifications] = useState(true);

  const Toggle = ({ checked, onChange }: { checked: boolean; onChange: () => void }) => (
    <button 
      onClick={onChange}
      className={`w-12 h-6 rounded-full p-1 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-blue dark:focus:ring-offset-slate-800 ${checked ? 'bg-brand-blue' : 'bg-gray-200 dark:bg-slate-700'}`}
    >
      <div className={`w-4 h-4 bg-white rounded-full shadow-sm transform transition-transform duration-300 ${checked ? 'translate-x-6' : 'translate-x-0'}`}></div>
    </button>
  );

  return (
    <div className="p-4 pb-24 md:pb-8 max-w-2xl mx-auto animate-fade-in-up">
      <header className="mb-8">
        <h2 className="text-2xl font-bold text-slate-800 dark:text-white">Configuración</h2>
        <p className="text-slate-500 dark:text-slate-400 text-sm">Gestiona tus preferencias y privacidad</p>
      </header>

      {/* Apariencia */}
      <section className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-700 overflow-hidden mb-6 transition-colors duration-300">
        <div className="p-4 border-b border-gray-50 dark:border-slate-700 bg-gray-50/50 dark:bg-slate-900/30 flex justify-between items-center">
          <h3 className="font-bold text-slate-700 dark:text-slate-200 flex items-center gap-2">
            <span className="material-symbols-outlined text-brand-blue dark:text-sky-400">palette</span>
            Apariencia
          </h3>
        </div>
        
        <div className="p-5 space-y-6">
            <div className="flex items-center justify-between">
                <div className="flex gap-3 items-center">
                    <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-700 flex items-center justify-center text-slate-500 dark:text-slate-300">
                        <span className="material-symbols-outlined">dark_mode</span>
                    </div>
                    <div>
                        <p className="font-bold text-slate-800 dark:text-slate-100 text-sm">Modo Oscuro</p>
                        <p className="text-xs text-slate-500 dark:text-slate-400">Interfaz con colores oscuros</p>
                    </div>
                </div>
                <Toggle checked={darkMode} onChange={toggleDarkMode} />
            </div>

            <div className="flex items-center justify-between">
                <div className="flex gap-3 items-center">
                    <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-700 flex items-center justify-center text-slate-500 dark:text-slate-300">
                         <span className="material-symbols-outlined">text_fields</span>
                    </div>
                    <div>
                        <p className="font-bold text-slate-800 dark:text-slate-100 text-sm">Tamaño de Texto</p>
                        <p className="text-xs text-slate-500 dark:text-slate-400">Ajustar legibilidad</p>
                    </div>
                </div>
                <div className="flex bg-gray-100 dark:bg-slate-700 rounded-lg p-1">
                    <button 
                        onClick={() => setFontSize('normal')}
                        className={`px-3 py-1 text-xs font-bold rounded-md transition-all ${fontSize === 'normal' ? 'bg-white dark:bg-slate-600 shadow-sm text-slate-800 dark:text-white' : 'text-slate-400 dark:text-slate-400 hover:text-slate-600 dark:hover:text-slate-300'}`}
                    >
                        Aa
                    </button>
                    <button 
                        onClick={() => setFontSize('large')}
                        className={`px-3 py-1 text-sm font-bold rounded-md transition-all ${fontSize === 'large' ? 'bg-white dark:bg-slate-600 shadow-sm text-slate-800 dark:text-white' : 'text-slate-400 dark:text-slate-400 hover:text-slate-600 dark:hover:text-slate-300'}`}
                    >
                        Aa
                    </button>
                </div>
            </div>
        </div>
      </section>

      {/* Privacidad y Seguridad */}
      <section className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-700 overflow-hidden mb-6 transition-colors duration-300">
        <div className="p-4 border-b border-gray-50 dark:border-slate-700 bg-gray-50/50 dark:bg-slate-900/30">
          <h3 className="font-bold text-slate-700 dark:text-slate-200 flex items-center gap-2">
            <span className="material-symbols-outlined text-brand-green dark:text-emerald-400">security</span>
            Privacidad
          </h3>
        </div>
        
        <div className="p-5 space-y-6">
            <div className="flex items-center justify-between">
                <div className="flex gap-3 items-center">
                    <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-700 flex items-center justify-center text-slate-500 dark:text-slate-300">
                         <span className="material-symbols-outlined">location_on</span>
                    </div>
                    <div>
                        <p className="font-bold text-slate-800 dark:text-slate-100 text-sm">Ubicación Anónima</p>
                        <p className="text-xs text-slate-500 dark:text-slate-400 max-w-[200px]">Permitir uso de datos para mapas de calor comunales</p>
                    </div>
                </div>
                <Toggle checked={locationEnabled} onChange={() => setLocationEnabled(!locationEnabled)} />
            </div>
            
            <div className="flex items-center justify-between">
                <div className="flex gap-3 items-center">
                    <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-700 flex items-center justify-center text-slate-500 dark:text-slate-300">
                         <span className="material-symbols-outlined">visibility</span>
                    </div>
                    <div>
                        <p className="font-bold text-slate-800 dark:text-slate-100 text-sm">Perfil Público</p>
                        <p className="text-xs text-slate-500 dark:text-slate-400">Visible en el Marketplace</p>
                    </div>
                </div>
                <Toggle checked={publicProfile} onChange={() => setPublicProfile(!publicProfile)} />
            </div>
        </div>
      </section>

      {/* Notificaciones */}
      <section className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-700 overflow-hidden mb-6 transition-colors duration-300">
        <div className="p-4 border-b border-gray-50 dark:border-slate-700 bg-gray-50/50 dark:bg-slate-900/30">
          <h3 className="font-bold text-slate-700 dark:text-slate-200 flex items-center gap-2">
            <span className="material-symbols-outlined text-brand-orange">notifications</span>
            Notificaciones
          </h3>
        </div>
        <div className="p-5">
             <div className="flex items-center justify-between">
                <div className="flex gap-3 items-center">
                    <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-700 flex items-center justify-center text-slate-500 dark:text-slate-300">
                         <span className="material-symbols-outlined">campaign</span>
                    </div>
                    <div>
                        <p className="font-bold text-slate-800 dark:text-slate-100 text-sm">Alertas Comunales</p>
                        <p className="text-xs text-slate-500 dark:text-slate-400">Novedades y emergencias</p>
                    </div>
                </div>
                <Toggle checked={notifications} onChange={() => setNotifications(!notifications)} />
            </div>
        </div>
      </section>

      {/* Legal */}
       <section className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-700 overflow-hidden transition-colors duration-300">
        <div className="p-4 border-b border-gray-50 dark:border-slate-700 bg-gray-50/50 dark:bg-slate-900/30">
          <h3 className="font-bold text-slate-700 dark:text-slate-200 flex items-center gap-2">
            <span className="material-symbols-outlined text-slate-500 dark:text-slate-400">gavel</span>
            Legal
          </h3>
        </div>
        
        <div className="divide-y divide-gray-50 dark:divide-slate-700">
            <button className="w-full p-4 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors text-left group">
                <span className="text-sm font-medium text-slate-700 dark:text-slate-300 group-hover:text-brand-blue dark:group-hover:text-sky-400 transition-colors">Políticas de Privacidad</span>
                <span className="material-symbols-outlined text-slate-300 dark:text-slate-600 group-hover:text-brand-blue dark:group-hover:text-sky-400">chevron_right</span>
            </button>
             <button className="w-full p-4 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors text-left group">
                <span className="text-sm font-medium text-slate-700 dark:text-slate-300 group-hover:text-brand-blue dark:group-hover:text-sky-400 transition-colors">Términos de Servicio</span>
                <span className="material-symbols-outlined text-slate-300 dark:text-slate-600 group-hover:text-brand-blue dark:group-hover:text-sky-400">chevron_right</span>
            </button>
            <button className="w-full p-4 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors text-left group">
                <span className="text-sm font-medium text-slate-700 dark:text-slate-300 group-hover:text-brand-blue dark:group-hover:text-sky-400 transition-colors">Licencias de Código Abierto</span>
                <span className="material-symbols-outlined text-slate-300 dark:text-slate-600 group-hover:text-brand-blue dark:group-hover:text-sky-400">chevron_right</span>
            </button>
            <div className="p-6 text-center">
                <div className="flex items-center justify-center gap-2 mb-2">
                    <span className="material-symbols-outlined text-slate-300 dark:text-slate-600">code</span>
                    <span className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">Comuna Inteligente</span>
                </div>
                <p className="text-[10px] text-slate-400 dark:text-slate-600">Versión Beta 1.0.0</p>
            </div>
        </div>
      </section>
    </div>
  );
};