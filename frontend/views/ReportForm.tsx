import React, { useState, useEffect } from 'react';

const CATEGORIES_CONFIG = [
  { id: 'Alumbrado Público', icon: 'lightbulb', color: 'text-yellow-500', bg: 'bg-yellow-50 dark:bg-yellow-900/20', border: 'border-yellow-200 dark:border-yellow-800' },
  { id: 'Agua Potable', icon: 'water_drop', color: 'text-blue-500', bg: 'bg-blue-50 dark:bg-blue-900/20', border: 'border-blue-200 dark:border-blue-800' },
  { id: 'Aseo Urbano', icon: 'delete', color: 'text-green-500', bg: 'bg-green-50 dark:bg-green-900/20', border: 'border-green-200 dark:border-green-800' },
  { id: 'Seguridad', icon: 'local_police', color: 'text-indigo-500', bg: 'bg-indigo-50 dark:bg-indigo-900/20', border: 'border-indigo-200 dark:border-indigo-800' },
  { id: 'Vialidad', icon: 'edit_road', color: 'text-slate-500', bg: 'bg-slate-100 dark:bg-slate-700', border: 'border-slate-200 dark:border-slate-600' },
  { id: 'Gas Doméstico', icon: 'propane', color: 'text-orange-500', bg: 'bg-orange-50 dark:bg-orange-900/20', border: 'border-orange-200 dark:border-orange-800' },
];

export const ReportForm: React.FC = () => {
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');
  const [referencePoint, setReferencePoint] = useState('');
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  
  // Location States
  const [isLocating, setIsLocating] = useState(false);
  const [locationDetected, setLocationDetected] = useState(false);

  // AI States
  const [isAiAnalyzing, setIsAiAnalyzing] = useState(false);
  const [aiPriority, setAiPriority] = useState<string | null>(null);

  // Simulate Location Logic
  const handleLocate = () => {
      setIsLocating(true);
      setTimeout(() => {
          setIsLocating(false);
          setLocationDetected(true);
      }, 1500);
  };

  // Simulate Image Upload
  const handleImageSelect = () => {
      // Mock uploading an image
      setImagePreview('https://picsum.photos/400/300?random=' + Date.now());
  };

  // Mock AI Analysis
  useEffect(() => {
      if (description.length > 10) {
          setIsAiAnalyzing(true);
          const timer = setTimeout(() => {
              setIsAiAnalyzing(false);
              // Simple keyword detection for demo
              const lower = description.toLowerCase();
              if (lower.includes('fuego') || lower.includes('robo') || lower.includes('herido') || lower.includes('cable') || lower.includes('tiro')) {
                  setAiPriority('Alta');
              } else if (lower.includes('hueco') || lower.includes('basura') || lower.includes('agua')) {
                  setAiPriority('Media');
              } else {
                  setAiPriority('Baja');
              }
          }, 800);
          return () => clearTimeout(timer);
      } else {
          setAiPriority(null);
      }
  }, [description]);

  return (
    <div className="flex flex-col h-full bg-slate-50 dark:bg-slate-900 transition-colors duration-300 animate-fade-in-up">
      
      {/* Header Compacto */}
      <div className="bg-white dark:bg-slate-800 px-6 py-4 border-b border-gray-200 dark:border-slate-700 sticky top-0 z-20 shadow-sm shrink-0 flex items-center justify-between">
        <div>
            <h2 className="text-xl font-bold text-slate-800 dark:text-white flex items-center gap-2">
                <span className="material-symbols-outlined text-brand-blue dark:text-sky-400">add_circle</span>
                Nuevo Reporte
            </h2>
        </div>
        
        {/* Toggle Anónimo Compacto */}
        <button
            onClick={() => setIsAnonymous(!isAnonymous)}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold transition-all border ${
                isAnonymous 
                ? 'bg-slate-800 border-slate-700 text-white shadow-md' 
                : 'bg-white dark:bg-slate-700 border-gray-200 dark:border-slate-600 text-slate-500 dark:text-slate-300 hover:border-slate-300'
            }`}
        >
            <span className="material-symbols-outlined text-base">
                {isAnonymous ? 'visibility_off' : 'public'}
            </span>
            {isAnonymous ? 'Anónimo' : 'Público'}
        </button>
      </div>
      
      <div className="flex-1 overflow-auto p-4 md:p-6 w-full">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start max-w-6xl mx-auto">
            
            {/* LEFT COLUMN: VISUAL CONTEXT (Categories & Map) */}
            <div className="lg:col-span-7 space-y-6">
                
                {/* 1. Category Grid */}
                <section className="bg-white dark:bg-slate-800 p-5 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-700">
                    <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4 flex items-center gap-2">
                        <span className="w-5 h-5 rounded-full bg-slate-100 dark:bg-slate-700 flex items-center justify-center text-xs">1</span>
                        Tipo de Incidencia
                    </h3>
                    <div className="grid grid-cols-3 gap-3">
                        {CATEGORIES_CONFIG.map((cat) => (
                            <button
                                key={cat.id}
                                type="button"
                                onClick={() => setCategory(cat.id)}
                                className={`relative flex flex-col items-center justify-center p-3 rounded-xl border transition-all duration-200 h-24 group ${
                                    category === cat.id 
                                    ? `${cat.bg} ${cat.border} ring-1 ring-offset-0 ring-brand-blue dark:ring-offset-slate-900 shadow-md` 
                                    : 'bg-white dark:bg-slate-800 border-gray-100 dark:border-slate-700 hover:border-gray-200 dark:hover:border-slate-600 hover:shadow-sm'
                                }`}
                            >
                                <span className={`material-symbols-outlined text-2xl mb-2 transition-transform duration-300 group-hover:scale-110 ${cat.color}`}>{cat.icon}</span>
                                <span className="text-[10px] font-bold text-slate-700 dark:text-slate-300 text-center leading-tight">{cat.id}</span>
                                {category === cat.id && (
                                    <div className="absolute top-2 right-2 w-2 h-2 bg-brand-blue rounded-full"></div>
                                )}
                            </button>
                        ))}
                    </div>
                </section>

                {/* 2. Location Card */}
                <section className="bg-white dark:bg-slate-800 p-5 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-700">
                    <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4 flex items-center gap-2">
                        <span className="w-5 h-5 rounded-full bg-slate-100 dark:bg-slate-700 flex items-center justify-center text-xs">2</span>
                        Ubicación
                    </h3>
                    <div className="relative h-40 rounded-xl overflow-hidden bg-slate-100 dark:bg-slate-700 mb-3 group cursor-pointer border border-gray-200 dark:border-slate-600" onClick={handleLocate}>
                        <div className="absolute inset-0 bg-[url('https://picsum.photos/800/400?grayscale')] bg-cover opacity-60 group-hover:opacity-80 transition-opacity duration-500"></div>
                        
                        <div className="absolute inset-0 flex items-center justify-center backdrop-blur-[1px] group-hover:backdrop-blur-none transition-all">
                            {isLocating ? (
                                <div className="flex flex-col items-center animate-pulse">
                                    <div className="w-12 h-12 bg-white/90 rounded-full flex items-center justify-center shadow-lg">
                                        <span className="material-symbols-outlined text-2xl text-brand-blue animate-spin">my_location</span>
                                    </div>
                                    <span className="text-[10px] font-bold text-slate-800 bg-white/90 px-3 py-1 rounded-full mt-2 shadow-sm">Buscando GPS...</span>
                                </div>
                            ) : locationDetected ? (
                                <div className="flex flex-col items-center animate-bounce-short">
                                    <span className="material-symbols-outlined text-4xl text-red-500 drop-shadow-xl">location_on</span>
                                </div>
                            ) : (
                                <div className="bg-white/90 dark:bg-slate-800/90 text-slate-700 dark:text-white px-4 py-2 rounded-xl shadow-lg font-bold text-xs flex items-center gap-2 hover:scale-105 transition-transform backdrop-blur-md border border-white/20">
                                    <span className="material-symbols-outlined text-brand-blue">near_me</span>
                                    Usar ubicación actual
                                </div>
                            )}
                        </div>
                        
                        {locationDetected && (
                            <div className="absolute bottom-2 right-2 bg-green-500 text-white text-[10px] font-bold px-2 py-1 rounded-lg shadow-sm flex items-center gap-1 animate-fade-in-up">
                                <span className="material-symbols-outlined text-xs">check</span>
                                GPS: 10.48, -66.90
                            </div>
                        )}
                    </div>
                    
                    <div className="flex items-center gap-2 bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-600 rounded-xl px-4 py-3 focus-within:ring-2 focus-within:ring-brand-blue transition-all">
                        <span className="material-symbols-outlined text-slate-400">push_pin</span>
                        <input 
                            type="text" 
                            placeholder="Punto de referencia (Ej. Frente al kiosco azul)"
                            value={referencePoint}
                            onChange={(e) => setReferencePoint(e.target.value)}
                            className="bg-transparent w-full outline-none text-sm text-slate-700 dark:text-slate-200 placeholder:text-slate-400 font-medium"
                        />
                    </div>
                </section>
            </div>

            {/* RIGHT COLUMN: DETAILS & ACTION */}
            <div className="lg:col-span-5 space-y-6">
                
                {/* 3. Description & AI (Reduced Size) */}
                <section className="bg-white dark:bg-slate-800 p-5 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-700">
                    <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4 flex items-center gap-2">
                        <span className="w-5 h-5 rounded-full bg-slate-100 dark:bg-slate-700 flex items-center justify-center text-xs">3</span>
                        Detalles
                    </h3>
                    
                    <div className={`relative rounded-xl transition-all duration-300 overflow-hidden border ${
                        aiPriority === 'Alta' 
                        ? 'border-red-200 dark:border-red-900/50 bg-red-50/50 dark:bg-red-900/10' 
                        : 'border-gray-200 dark:border-slate-600 bg-white dark:bg-slate-900'
                    }`}>
                        <textarea 
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            className="w-full p-4 bg-transparent outline-none text-slate-800 dark:text-white placeholder:text-slate-400 text-sm resize-none h-32 md:h-40"
                            placeholder="Describe el problema. Nuestra IA analizará la prioridad automáticamente..."
                        />
                        
                        {/* AI Feedback Bar (Compact) */}
                        <div className="px-3 py-2 border-t border-gray-100 dark:border-slate-700/50 bg-gray-50/80 dark:bg-slate-800/80 flex justify-between items-center h-10 backdrop-blur-sm">
                            {isAiAnalyzing ? (
                                <div className="flex items-center gap-2 text-[10px] font-bold text-brand-blue animate-pulse">
                                    <span className="material-symbols-outlined text-sm">psychology</span>
                                    Analizando...
                                </div>
                            ) : aiPriority ? (
                                <div className={`flex items-center gap-1.5 text-[10px] font-bold px-2 py-0.5 rounded-md transition-all animate-fade-in-up ${
                                    aiPriority === 'Alta' ? 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300' :
                                    aiPriority === 'Media' ? 'bg-orange-100 text-orange-700 dark:bg-orange-900/40 dark:text-orange-300' :
                                    'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300'
                                }`}>
                                    <span className="material-symbols-outlined text-xs">
                                        {aiPriority === 'Alta' ? 'priority_high' : aiPriority === 'Media' ? 'warning' : 'low_priority'}
                                    </span>
                                    IA: {aiPriority}
                                </div>
                            ) : (
                                <span className="text-[10px] text-slate-400 flex items-center gap-1">
                                    <span className="material-symbols-outlined text-xs">smart_toy</span>
                                    IA Standby
                                </span>
                            )}
                            <span className="text-[9px] text-slate-400 font-mono font-bold">{description.length}/500</span>
                        </div>
                    </div>
                </section>

                {/* 4. Evidence (Compact) */}
                <section className="bg-white dark:bg-slate-800 p-5 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-700">
                    <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4 flex items-center gap-2">
                        <span className="w-5 h-5 rounded-full bg-slate-100 dark:bg-slate-700 flex items-center justify-center text-xs">4</span>
                        Evidencia (Opcional)
                    </h3>
                    {imagePreview ? (
                        <div className="relative rounded-xl overflow-hidden group shadow-sm h-32 bg-slate-900">
                            <img src={imagePreview} alt="Evidence" className="w-full h-full object-cover opacity-90" />
                            <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-sm">
                                <button 
                                    onClick={() => setImagePreview(null)}
                                    className="bg-red-500 text-white px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1 hover:bg-red-600 transition-colors shadow-lg"
                                >
                                    <span className="material-symbols-outlined text-sm">delete</span>
                                    Borrar
                                </button>
                            </div>
                        </div>
                    ) : (
                        <button 
                            type="button"
                            onClick={handleImageSelect}
                            className="w-full h-24 bg-gray-50 dark:bg-slate-900 border-2 border-dashed border-gray-200 dark:border-slate-700 rounded-xl flex flex-col items-center justify-center text-slate-400 hover:bg-blue-50 dark:hover:bg-slate-800 hover:border-brand-blue dark:hover:border-sky-500 hover:text-brand-blue dark:hover:text-sky-400 transition-all group"
                        >
                            <span className="material-symbols-outlined text-2xl mb-1 group-hover:scale-110 transition-transform">add_a_photo</span>
                            <span className="text-[10px] font-bold">Subir Foto</span>
                        </button>
                    )}
                </section>

                {/* Submit Action */}
                <div className="pt-2">
                    <button 
                        type="button" 
                        className={`w-full text-white font-bold py-4 rounded-xl shadow-lg active:scale-[0.98] transition-all flex items-center justify-center gap-3 hover:shadow-xl ${
                            isAnonymous 
                            ? 'bg-slate-800 hover:bg-slate-700 shadow-slate-500/20 border border-slate-600' 
                            : 'bg-gradient-to-r from-brand-blue to-blue-600 dark:from-sky-600 dark:to-brand-blue shadow-blue-500/30'
                        }`}
                    >
                        <span>
                            {isAnonymous ? 'Enviar Anónimo' : 'Enviar Reporte'}
                        </span>
                        <span className="material-symbols-outlined text-lg">
                            {isAnonymous ? 'send_and_archive' : 'send'}
                        </span>
                    </button>
                    <p className="text-[10px] text-center text-slate-400 mt-3">
                        Al enviar, confirmas que la información es verídica.
                    </p>
                </div>
            </div>
        </div>

      </div>
    </div>
  );
};