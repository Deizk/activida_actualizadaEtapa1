import React from 'react';
import { MOCK_USER_PROFILE } from '../constants';

export const UserProfile: React.FC = () => {
  const profile = MOCK_USER_PROFILE;

  return (
    <div className="flex flex-col h-full bg-slate-50 dark:bg-slate-900 transition-colors duration-300 animate-fade-in-up pb-20 md:pb-6">
      
      {/* Header Profile Card */}
      <div className="relative bg-white dark:bg-slate-800 shadow-sm border-b border-gray-100 dark:border-slate-700">
        <div className="h-32 bg-gradient-to-r from-brand-blue to-indigo-600 dark:from-sky-800 dark:to-indigo-900"></div>
        <div className="px-6 pb-6 relative">
            <div className="absolute -top-12 left-6 w-24 h-24 rounded-2xl bg-white dark:bg-slate-700 p-1 shadow-lg">
                 <div className="w-full h-full bg-brand-blue/10 dark:bg-sky-500/10 rounded-xl flex items-center justify-center text-brand-blue dark:text-sky-400 font-bold text-2xl">
                    MG
                 </div>
                 <button className="absolute bottom-0 right-0 bg-white dark:bg-slate-600 p-1.5 rounded-full shadow-md text-slate-500 dark:text-slate-300 hover:text-brand-blue border border-gray-100 dark:border-slate-500">
                    <span className="material-symbols-outlined text-sm">add_a_photo</span>
                 </button>
            </div>
            
            <div className="flex justify-end pt-3 mb-2">
                <button className="flex items-center gap-1 text-xs font-bold bg-gray-100 dark:bg-slate-700 px-3 py-1.5 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-gray-200 dark:hover:bg-slate-600 transition-colors">
                    <span className="material-symbols-outlined text-sm">edit</span>
                    Editar Perfil
                </button>
            </div>

            <div className="mt-2">
                <h2 className="text-2xl font-bold text-slate-800 dark:text-white flex items-center gap-2">
                    {profile.name}
                    <span className="material-symbols-outlined text-brand-blue text-xl" title="Verificado">verified</span>
                </h2>
                <p className="text-sm text-slate-500 dark:text-slate-400 font-mono mb-2">{profile.cedula}</p>
                
                <div className="flex flex-wrap gap-3 text-sm">
                    <div className="flex items-center gap-1 text-slate-700 dark:text-slate-300 bg-slate-50 dark:bg-slate-700/50 px-2 py-1 rounded-md">
                        <span className="material-symbols-outlined text-base">work</span>
                        {profile.profession}
                    </div>
                    <div className="flex items-center gap-1 text-slate-700 dark:text-slate-300 bg-slate-50 dark:bg-slate-700/50 px-2 py-1 rounded-md">
                        <span className="material-symbols-outlined text-base">storefront</span>
                        {profile.currentTrade}
                    </div>
                    <div className="flex items-center gap-1 text-slate-700 dark:text-slate-300 bg-slate-50 dark:bg-slate-700/50 px-2 py-1 rounded-md">
                        <span className="material-symbols-outlined text-base">cake</span>
                        {profile.age} años
                    </div>
                </div>
            </div>
        </div>
      </div>

      <div className="p-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column: Bio & Skills */}
        <div className="lg:col-span-2 space-y-6">
            
            {/* Bio */}
            <section className="bg-white dark:bg-slate-800 p-5 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-700">
                <h3 className="text-sm font-bold text-slate-800 dark:text-white uppercase tracking-wider mb-3 flex items-center gap-2">
                    <span className="material-symbols-outlined text-slate-400">description</span>
                    Resumen Profesional
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                    {profile.bio}
                </p>
            </section>

            {/* Skills */}
            <section className="bg-white dark:bg-slate-800 p-5 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-700">
                <h3 className="text-sm font-bold text-slate-800 dark:text-white uppercase tracking-wider mb-3 flex items-center gap-2">
                    <span className="material-symbols-outlined text-slate-400">psychology</span>
                    Habilidades y Oficios
                </h3>
                <div className="flex flex-wrap gap-2">
                    {profile.skills.map((skill, idx) => (
                        <span key={idx} className="bg-indigo-50 dark:bg-indigo-900/20 text-indigo-700 dark:text-indigo-300 px-3 py-1 rounded-full text-xs font-bold border border-indigo-100 dark:border-indigo-800/30">
                            {skill}
                        </span>
                    ))}
                </div>
            </section>

            {/* Community Stats */}
            <section className="bg-white dark:bg-slate-800 p-5 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-700">
                <h3 className="text-sm font-bold text-slate-800 dark:text-white uppercase tracking-wider mb-4 flex items-center gap-2">
                    <span className="material-symbols-outlined text-slate-400">diversity_3</span>
                    Interacción Comunal
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                     <div className="text-center p-3 bg-gray-50 dark:bg-slate-700/50 rounded-xl">
                        <div className="text-2xl font-black text-brand-blue dark:text-sky-400">{profile.communityReputation}%</div>
                        <div className="text-[10px] text-slate-500 dark:text-slate-400 font-bold uppercase">Reputación</div>
                     </div>
                     <div className="text-center p-3 bg-gray-50 dark:bg-slate-700/50 rounded-xl">
                        <div className="text-2xl font-black text-brand-green dark:text-emerald-400">12</div>
                        <div className="text-[10px] text-slate-500 dark:text-slate-400 font-bold uppercase">Votos</div>
                     </div>
                     <div className="text-center p-3 bg-gray-50 dark:bg-slate-700/50 rounded-xl">
                        <div className="text-2xl font-black text-orange-500">5</div>
                        <div className="text-[10px] text-slate-500 dark:text-slate-400 font-bold uppercase">Reportes</div>
                     </div>
                     <div className="text-center p-3 bg-gray-50 dark:bg-slate-700/50 rounded-xl">
                        <div className="text-2xl font-black text-purple-500">3</div>
                        <div className="text-[10px] text-slate-500 dark:text-slate-400 font-bold uppercase">Voluntariados</div>
                     </div>
                </div>
            </section>
        </div>

        {/* Right Column: Medical Summary */}
        <div className="lg:col-span-1">
             <section className="bg-white dark:bg-slate-800 p-5 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-700 h-full">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-sm font-bold text-slate-800 dark:text-white uppercase tracking-wider flex items-center gap-2">
                        <span className="material-symbols-outlined text-rose-500">medical_services</span>
                        Ficha Médica
                    </h3>
                    <span className="text-[10px] bg-slate-100 dark:bg-slate-700 px-2 py-1 rounded text-slate-500 dark:text-slate-400">
                        Privado
                    </span>
                </div>
                
                <div className="space-y-4">
                    <div className="flex justify-between items-center py-2 border-b border-gray-50 dark:border-slate-700/50">
                        <span className="text-sm text-slate-500 dark:text-slate-400">Tipo de Sangre</span>
                        <span className="font-bold text-slate-800 dark:text-white bg-rose-50 dark:bg-rose-900/20 text-rose-600 dark:text-rose-400 px-2 py-0.5 rounded">{profile.medicalSummary.bloodType}</span>
                    </div>
                    
                    <div>
                        <span className="text-xs text-slate-500 dark:text-slate-400 uppercase font-bold block mb-2">Alergias</span>
                        <div className="flex flex-wrap gap-2">
                            {profile.medicalSummary.allergies.length > 0 ? profile.medicalSummary.allergies.map(a => (
                                <span key={a} className="text-xs bg-orange-50 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400 px-2 py-1 rounded border border-orange-100 dark:border-orange-800/30">
                                    {a}
                                </span>
                            )) : <span className="text-sm text-slate-400">Ninguna registrada</span>}
                        </div>
                    </div>

                    <div>
                        <span className="text-xs text-slate-500 dark:text-slate-400 uppercase font-bold block mb-2">Condiciones Crónicas</span>
                        <div className="flex flex-wrap gap-2">
                            {profile.medicalSummary.chronicConditions.length > 0 ? profile.medicalSummary.chronicConditions.map(c => (
                                <span key={c} className="text-xs bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 px-2 py-1 rounded border border-blue-100 dark:border-blue-800/30">
                                    {c}
                                </span>
                            )) : <span className="text-sm text-slate-400">Ninguna registrada</span>}
                        </div>
                    </div>

                    <div className="pt-4 mt-4 border-t border-gray-100 dark:border-slate-700">
                         <button className="w-full py-2 border border-dashed border-gray-300 dark:border-slate-600 rounded-xl text-slate-500 dark:text-slate-400 text-sm font-medium hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors flex items-center justify-center gap-2">
                            <span className="material-symbols-outlined text-base">edit_note</span>
                            Actualizar Datos Médicos
                         </button>
                    </div>
                </div>
             </section>
        </div>
      </div>
    </div>
  );
};