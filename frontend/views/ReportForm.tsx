import React, { useState } from 'react';
import { CATEGORIES } from '../constants';

export const ReportForm: React.FC = () => {
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');
  const [isAnonymous, setIsAnonymous] = useState(false);
  
  // Mock AI states
  const [isAiAnalyzing, setIsAiAnalyzing] = useState(false);
  const [aiPriority, setAiPriority] = useState<string | null>(null);

  // Mock AI Analysis
  const handleDescriptionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const val = e.target.value;
    setDescription(val);
    
    if (val.length > 20 && !aiPriority) {
      setIsAiAnalyzing(true);
      setTimeout(() => {
        setAiPriority('Alta');
        setIsAiAnalyzing(false);
      }, 1500);
    }
  };

  return (
    <div className="p-4 max-w-lg mx-auto pb-24 md:pb-4 animate-fade-in-up">
      <div className="mb-6 flex justify-between items-end">
        <div>
            <h2 className="text-2xl font-bold text-slate-800 dark:text-white">Nuevo Reporte</h2>
            <p className="text-sm text-slate-500 dark:text-slate-400">Ayúdanos a mejorar la comunidad</p>
        </div>
        
        {/* Anonymous Toggle - Visual Feedback */}
        <div className={`flex flex-col items-center transition-all duration-300 ${isAnonymous ? 'opacity-100' : 'opacity-60'}`}>
            <div className={`w-12 h-12 rounded-full border-2 flex items-center justify-center mb-1 transition-colors duration-300 ${isAnonymous ? 'bg-slate-800 border-slate-600 text-white' : 'bg-brand-blue/10 border-brand-blue/30 text-brand-blue'}`}>
                <span className="material-symbols-outlined text-2xl">
                    {isAnonymous ? 'visibility_off' : 'account_circle'}
                </span>
            </div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                {isAnonymous ? 'Anónimo' : 'Público'}
            </span>
        </div>
      </div>
      
      <form className="space-y-6">
        
        {/* Privacy Control */}
        <div className="bg-blue-50 dark:bg-slate-800/50 p-4 rounded-xl border border-blue-100 dark:border-slate-700 flex items-center justify-between">
            <div className="pr-4">
                <label className="text-sm font-bold text-slate-700 dark:text-slate-200 block mb-0.5">Modo Privado</label>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-tight">
                    {isAnonymous 
                        ? 'Tu nombre no será visible en el reporte público.' 
                        : 'Tu reporte estará vinculado a tu perfil de usuario.'}
                </p>
            </div>
            <button 
                type="button"
                onClick={() => setIsAnonymous(!isAnonymous)}
                className={`w-12 h-6 rounded-full p-1 transition-colors duration-300 focus:outline-none ${isAnonymous ? 'bg-slate-700' : 'bg-gray-300'}`}
            >
                <div className={`w-4 h-4 bg-white rounded-full shadow-sm transform transition-transform duration-300 ${isAnonymous ? 'translate-x-6' : 'translate-x-0'}`}></div>
            </button>
        </div>

        {/* Category */}
        <div className="space-y-2">
          <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Categoría</label>
          <div className="relative">
            <select 
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full p-4 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl appearance-none focus:ring-2 focus:ring-brand-blue dark:focus:ring-sky-500 outline-none text-slate-800 dark:text-white transition-colors"
            >
              <option value="" disabled className="dark:bg-slate-800">Seleccionar categoría</option>
              {CATEGORIES.map(cat => (
                <option key={cat} value={cat} className="dark:bg-slate-800">{cat}</option>
              ))}
            </select>
            <span className="material-symbols-outlined absolute right-4 top-4 text-slate-400 pointer-events-none">expand_more</span>
          </div>
        </div>

        {/* Location Preview (Static) */}
        <div className="space-y-2">
          <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Ubicación</label>
          <div className="h-32 bg-slate-100 dark:bg-slate-800 rounded-xl flex items-center justify-center border-2 border-dashed border-gray-300 dark:border-slate-600 relative overflow-hidden group cursor-pointer">
             <div className="absolute inset-0 bg-[url('https://picsum.photos/400/200?grayscale')] bg-cover opacity-50 dark:opacity-30 group-hover:scale-105 transition-transform duration-700"></div>
             <button type="button" className="bg-white dark:bg-slate-700 px-4 py-2 rounded-lg shadow-sm font-medium text-sm flex items-center gap-2 z-10 text-slate-700 dark:text-slate-200 border border-transparent dark:border-slate-600 hover:bg-gray-50 dark:hover:bg-slate-600">
                <span className="material-symbols-outlined text-red-500">my_location</span>
                {isAnonymous ? 'Ubicación Aproximada' : 'Ubicación Precisa'}
             </button>
          </div>
        </div>

        {/* Description & AI Feedback */}
        <div className="space-y-2">
          <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Descripción</label>
          <textarea 
            value={description}
            onChange={handleDescriptionChange}
            className="w-full p-4 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-brand-blue dark:focus:ring-sky-500 outline-none min-h-[120px] text-slate-800 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 transition-colors"
            placeholder="Describe el problema detalladamente..."
          />
          
          {/* AI Priority Feedback */}
          <div className={`transition-all duration-500 ease-in-out ${isAiAnalyzing || aiPriority ? 'opacity-100 max-h-24' : 'opacity-0 max-h-0'}`}>
            {isAiAnalyzing ? (
              <div className="flex items-center gap-2 text-sm text-brand-blue dark:text-sky-400 animate-pulse mt-2">
                <span className="material-symbols-outlined text-lg">psychology</span>
                Analizando prioridad y contexto...
              </div>
            ) : aiPriority && (
              <div className="bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-800/50 p-3 rounded-lg flex items-start gap-3 mt-2 animate-fade-in-up">
                <span className="material-symbols-outlined text-red-500 dark:text-red-400 mt-0.5">priority_high</span>
                <div>
                  <p className="text-sm font-bold text-red-700 dark:text-red-400">Prioridad Sugerida: {aiPriority}</p>
                  <p className="text-xs text-red-600 dark:text-red-300">Detectamos palabras clave de riesgo. Se notificará a la cuadrilla de guardia inmediatamente.</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Photo Placeholder */}
        <div className="space-y-2">
          <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Evidencia Fotográfica</label>
          <div className="grid grid-cols-3 gap-2">
            <button type="button" className="aspect-square bg-gray-50 dark:bg-slate-800 border-2 border-dashed border-gray-300 dark:border-slate-600 rounded-xl flex flex-col items-center justify-center text-slate-400 dark:text-slate-500 hover:bg-gray-100 dark:hover:bg-slate-700 hover:border-brand-blue dark:hover:border-sky-500 transition-colors group">
              <span className="material-symbols-outlined text-2xl group-hover:scale-110 transition-transform">add_a_photo</span>
            </button>
          </div>
        </div>

        {/* Submit */}
        <button type="button" className="w-full bg-brand-blue dark:bg-sky-600 text-white font-bold py-4 rounded-xl shadow-lg shadow-brand-blue/30 dark:shadow-sky-900/30 active:scale-[0.98] transition-transform flex items-center justify-center gap-2 hover:bg-blue-700 dark:hover:bg-sky-500">
          <span>{isAnonymous ? 'Enviar Anónimamente' : 'Enviar Reporte'}</span>
          <span className="material-symbols-outlined">send</span>
        </button>
      </form>
    </div>
  );
};