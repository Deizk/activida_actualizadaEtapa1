import React, { useState, useEffect } from 'react';
import { MOCK_USER_PROFILE } from '../constants';
import { UserProfileData, MinorProfile } from '../types';

interface UserProfileProps {
  user?: UserProfileData | null;
  minors?: MinorProfile[]; // Add minors prop
  onBack?: () => void;
}

export const UserProfile: React.FC<UserProfileProps> = ({ user, minors = [], onBack }) => {
  // Determine if we are viewing our own profile or someone else's
  const isOwnProfile = !user;
  
  // Local state to manage profile data (simulating DB updates)
  const [localProfile, setLocalProfile] = useState<UserProfileData>(user || MOCK_USER_PROFILE);
  
  // State for Medical Card View Selection (Me vs Minor)
  const [selectedMedicalId, setSelectedMedicalId] = useState<string>('me');
  const [medicalDisplayData, setMedicalDisplayData] = useState(MOCK_USER_PROFILE.medicalSummary);
  
  // Update local state if prop changes (for public profile viewing)
  useEffect(() => {
    if (user) setLocalProfile(user);
  }, [user]);

  // Update Medical Data Display based on selection
  useEffect(() => {
      if (selectedMedicalId === 'me') {
          setMedicalDisplayData(localProfile.medicalSummary);
      } else {
          const minor = minors.find(m => m.id === selectedMedicalId);
          if (minor) {
              setMedicalDisplayData({
                  bloodType: minor.bloodType,
                  height: minor.height || 0,
                  weight: minor.weight || 0,
                  allergies: minor.allergies,
                  chronicConditions: minor.conditions,
                  mobilityIssue: minor.disability,
                  medications: [], 
                  surgeries: [], 
                  familyHistory: [], 
                  insurance: "N/A"
              });
          }
      }
  }, [selectedMedicalId, minors, localProfile]);

  // Form States
  const [editMode, setEditMode] = useState<'general' | 'medical' | null>(null);
  const [formData, setFormData] = useState<UserProfileData>(localProfile);

  // Handlers
  const handleEditOpen = (mode: 'general' | 'medical') => {
    // Only allow editing own profile ('me') for now in this view
    if (selectedMedicalId !== 'me' && mode === 'medical') {
        alert("Para editar los datos de un menor, ve a la sección 'Menores a Cargo'.");
        return;
    }
    setFormData({ ...localProfile }); 
    setEditMode(mode);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setLocalProfile(formData);
    setEditMode(null);
    alert("Datos actualizados correctamente.");
  };

  const handleChange = (field: keyof UserProfileData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleMedicalChange = (field: keyof UserProfileData['medicalSummary'], value: any) => {
    setFormData(prev => ({
        ...prev,
        medicalSummary: {
            ...prev.medicalSummary,
            [field]: value
        }
    }));
  };

  // Helper to handle comma separated lists in forms (skills, allergies, etc)
  const handleArrayChange = (field: 'skills' | 'allergies' | 'chronicConditions', value: string) => {
    const array = value.split(',').map(item => item.trim()).filter(i => i !== '');
    
    if (field === 'skills') {
        handleChange('skills', array);
    } else {
        // Medical arrays
        setFormData(prev => ({
            ...prev,
            medicalSummary: {
                ...prev.medicalSummary,
                [field]: array
            }
        }));
    }
  };

  return (
    <div className="flex flex-col h-full bg-slate-50 dark:bg-slate-900 transition-colors duration-300 animate-fade-in-up pb-20 md:pb-6 relative">
      
      {/* --- MODAL: EDIT GENERAL PROFILE --- */}
      {editMode === 'general' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in-up">
            <div className="bg-white dark:bg-slate-800 w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden border border-gray-100 dark:border-slate-700 max-h-[90vh] flex flex-col">
                <div className="p-4 border-b border-gray-100 dark:border-slate-700 flex justify-between items-center bg-gray-50 dark:bg-slate-700/50">
                    <h3 className="font-bold text-lg text-slate-800 dark:text-white flex items-center gap-2">
                        <span className="material-symbols-outlined text-brand-blue">edit</span>
                        Editar Perfil
                    </h3>
                    <button onClick={() => setEditMode(null)} className="p-1 rounded-full hover:bg-gray-200 dark:hover:bg-slate-600">
                        <span className="material-symbols-outlined">close</span>
                    </button>
                </div>
                <div className="overflow-y-auto p-6">
                    <form id="general-form" onSubmit={handleSave} className="space-y-4">
                        <div>
                            <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase mb-1">Nombre (No editable)</label>
                            <input type="text" value={formData.name} disabled className="w-full p-3 bg-gray-100 dark:bg-slate-900/50 border border-gray-200 dark:border-slate-600 rounded-xl text-slate-500" />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase mb-1">Biografía / Resumen</label>
                            <textarea 
                                value={formData.bio}
                                onChange={(e) => handleChange('bio', e.target.value)}
                                className="w-full p-3 bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-600 rounded-xl outline-none text-slate-800 dark:text-white h-24"
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                             <div>
                                <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase mb-1">Profesión</label>
                                <input 
                                    type="text" 
                                    value={formData.profession}
                                    onChange={(e) => handleChange('profession', e.target.value)}
                                    className="w-full p-3 bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-600 rounded-xl outline-none text-slate-800 dark:text-white"
                                />
                             </div>
                             <div>
                                <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase mb-1">Oficio Actual</label>
                                <input 
                                    type="text" 
                                    value={formData.currentTrade}
                                    onChange={(e) => handleChange('currentTrade', e.target.value)}
                                    className="w-full p-3 bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-600 rounded-xl outline-none text-slate-800 dark:text-white"
                                />
                             </div>
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase mb-1">Teléfono</label>
                            <input 
                                type="tel" 
                                value={formData.phone}
                                onChange={(e) => handleChange('phone', e.target.value)}
                                className="w-full p-3 bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-600 rounded-xl outline-none text-slate-800 dark:text-white"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase mb-1">Habilidades (Separar por comas)</label>
                            <input 
                                type="text" 
                                defaultValue={formData.skills.join(', ')}
                                onBlur={(e) => handleArrayChange('skills', e.target.value)}
                                className="w-full p-3 bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-600 rounded-xl outline-none text-slate-800 dark:text-white"
                                placeholder="Ej. Carpintería, Cocina, Liderazgo"
                            />
                        </div>
                    </form>
                </div>
                <div className="p-4 border-t border-gray-100 dark:border-slate-700 bg-gray-50 dark:bg-slate-800 flex gap-3">
                    <button onClick={() => setEditMode(null)} className="flex-1 py-3 text-slate-500 font-bold hover:bg-gray-100 dark:hover:bg-slate-700 rounded-xl">Cancelar</button>
                    <button type="submit" form="general-form" className="flex-1 py-3 bg-brand-blue text-white font-bold rounded-xl shadow-lg hover:bg-blue-700">Guardar Cambios</button>
                </div>
            </div>
        </div>
      )}

      {/* --- MODAL: EDIT MEDICAL DATA --- */}
      {editMode === 'medical' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in-up">
            <div className="bg-white dark:bg-slate-800 w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden border border-gray-100 dark:border-slate-700 max-h-[90vh] flex flex-col">
                <div className="p-4 border-b border-gray-100 dark:border-slate-700 flex justify-between items-center bg-gray-50 dark:bg-slate-700/50">
                    <h3 className="font-bold text-lg text-slate-800 dark:text-white flex items-center gap-2">
                        <span className="material-symbols-outlined text-rose-500">medical_services</span>
                        Datos Médicos
                    </h3>
                    <button onClick={() => setEditMode(null)} className="p-1 rounded-full hover:bg-gray-200 dark:hover:bg-slate-600">
                        <span className="material-symbols-outlined">close</span>
                    </button>
                </div>
                <div className="overflow-y-auto p-6">
                    <form id="medical-form" onSubmit={handleSave} className="space-y-4">
                        <div className="bg-rose-50 dark:bg-rose-900/20 p-3 rounded-lg border border-rose-100 dark:border-rose-900/30 mb-4">
                            <p className="text-xs text-rose-700 dark:text-rose-300 font-medium flex items-center gap-2">
                                <span className="material-symbols-outlined text-sm">lock</span>
                                Esta información es confidencial y vital para emergencias.
                            </p>
                        </div>
                        
                        <div>
                             <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase mb-1">Tipo de Sangre</label>
                             <select 
                                value={formData.medicalSummary.bloodType}
                                onChange={(e) => handleMedicalChange('bloodType', e.target.value)}
                                className="w-full p-3 bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-600 rounded-xl outline-none text-slate-800 dark:text-white"
                            >
                                {['O+', 'O-', 'A+', 'A-', 'B+', 'B-', 'AB+', 'AB-'].map(t => (
                                    <option key={t} value={t}>{t}</option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase mb-1">Alergias (Separar por comas)</label>
                            <input 
                                type="text" 
                                defaultValue={formData.medicalSummary.allergies.join(', ')}
                                onBlur={(e) => handleArrayChange('allergies', e.target.value)}
                                className="w-full p-3 bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-600 rounded-xl outline-none text-slate-800 dark:text-white"
                                placeholder="Ej. Penicilina, Maní"
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase mb-1">Condiciones Crónicas (Separar por comas)</label>
                            <input 
                                type="text" 
                                defaultValue={formData.medicalSummary.chronicConditions.join(', ')}
                                onBlur={(e) => handleArrayChange('chronicConditions', e.target.value)}
                                className="w-full p-3 bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-600 rounded-xl outline-none text-slate-800 dark:text-white"
                                placeholder="Ej. Hipertensión, Diabetes"
                            />
                        </div>
                        
                        <div className="flex items-center gap-3 p-3 border border-gray-200 dark:border-slate-600 rounded-xl hover:bg-gray-50 dark:hover:bg-slate-700/50 cursor-pointer">
                            <input 
                                type="checkbox" 
                                id="mobility"
                                checked={formData.medicalSummary.mobilityIssue}
                                onChange={(e) => handleMedicalChange('mobilityIssue', e.target.checked)}
                                className="w-5 h-5 text-brand-blue rounded focus:ring-brand-blue"
                            />
                            <label htmlFor="mobility" className="flex-1 cursor-pointer">
                                <span className="block font-bold text-slate-800 dark:text-white text-sm">Movilidad Reducida</span>
                                <span className="text-xs text-slate-500">Requiere asistencia para desplazamiento</span>
                            </label>
                        </div>
                    </form>
                </div>
                <div className="p-4 border-t border-gray-100 dark:border-slate-700 bg-gray-50 dark:bg-slate-800 flex gap-3">
                    <button onClick={() => setEditMode(null)} className="flex-1 py-3 text-slate-500 font-bold hover:bg-gray-100 dark:hover:bg-slate-700 rounded-xl">Cancelar</button>
                    <button type="submit" form="medical-form" className="flex-1 py-3 bg-rose-600 text-white font-bold rounded-xl shadow-lg hover:bg-rose-700">Actualizar Datos</button>
                </div>
            </div>
        </div>
      )}

      {/* Header Profile Card */}
      <div className="relative bg-white dark:bg-slate-800 shadow-sm border-b border-gray-100 dark:border-slate-700">
        
        {/* Navigation / Back Button for Public Profiles */}
        {!isOwnProfile && onBack && (
            <div className="absolute top-4 left-4 z-10">
                <button 
                    onClick={onBack}
                    className="bg-white/90 dark:bg-slate-900/50 backdrop-blur-md p-2 rounded-full text-slate-700 dark:text-white shadow-sm hover:bg-white dark:hover:bg-slate-700 transition-all"
                >
                    <span className="material-symbols-outlined">arrow_back</span>
                </button>
            </div>
        )}

        <div className="h-32 bg-gradient-to-r from-brand-blue to-indigo-600 dark:from-sky-800 dark:to-indigo-900"></div>
        <div className="px-6 pb-6 relative">
            <div className="absolute -top-12 left-6 w-24 h-24 rounded-2xl bg-white dark:bg-slate-700 p-1 shadow-lg">
                 <div className="w-full h-full bg-brand-blue/10 dark:bg-sky-500/10 rounded-xl flex items-center justify-center text-brand-blue dark:text-sky-400 font-bold text-2xl overflow-hidden">
                    {localProfile.name.split(' ').map(n => n[0]).join('').substring(0,2)}
                 </div>
                 {isOwnProfile && (
                    <button className="absolute bottom-0 right-0 bg-white dark:bg-slate-600 p-1.5 rounded-full shadow-md text-slate-500 dark:text-slate-300 hover:text-brand-blue border border-gray-100 dark:border-slate-500">
                        <span className="material-symbols-outlined text-sm">add_a_photo</span>
                    </button>
                 )}
            </div>
            
            <div className="flex justify-end pt-3 mb-2 min-h-[40px]">
                {isOwnProfile ? (
                    <button 
                        onClick={() => handleEditOpen('general')}
                        className="flex items-center gap-1 text-xs font-bold bg-gray-100 dark:bg-slate-700 px-3 py-1.5 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-gray-200 dark:hover:bg-slate-600 transition-colors"
                    >
                        <span className="material-symbols-outlined text-sm">edit</span>
                        Editar Perfil
                    </button>
                ) : (
                    <button 
                        onClick={() => alert(`Iniciando chat con ${localProfile.name}...`)}
                        className="flex items-center gap-1 text-xs font-bold bg-brand-blue text-white px-4 py-2 rounded-lg hover:bg-sky-600 transition-colors shadow-lg shadow-brand-blue/30"
                    >
                        <span className="material-symbols-outlined text-sm">chat</span>
                        Contactar
                    </button>
                )}
            </div>

            <div className="mt-2">
                <h2 className="text-2xl font-bold text-slate-800 dark:text-white flex items-center gap-2">
                    {localProfile.name}
                    <span className="material-symbols-outlined text-brand-blue text-xl" title="Verificado">verified</span>
                </h2>
                <p className="text-sm text-slate-500 dark:text-slate-400 font-mono mb-2">{localProfile.cedula}</p>
                
                <div className="flex flex-wrap gap-3 text-sm">
                    {localProfile.profession && (
                        <div className="flex items-center gap-1 text-slate-700 dark:text-slate-300 bg-slate-50 dark:bg-slate-700/50 px-2 py-1 rounded-md">
                            <span className="material-symbols-outlined text-base">work</span>
                            {localProfile.profession}
                        </div>
                    )}
                    {localProfile.currentTrade && (
                        <div className="flex items-center gap-1 text-slate-700 dark:text-slate-300 bg-slate-50 dark:bg-slate-700/50 px-2 py-1 rounded-md">
                            <span className="material-symbols-outlined text-base">storefront</span>
                            {localProfile.currentTrade}
                        </div>
                    )}
                    {localProfile.age > 0 && (
                        <div className="flex items-center gap-1 text-slate-700 dark:text-slate-300 bg-slate-50 dark:bg-slate-700/50 px-2 py-1 rounded-md">
                            <span className="material-symbols-outlined text-base">cake</span>
                            {localProfile.age} años
                        </div>
                    )}
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
                    {localProfile.bio || "Este usuario no ha añadido una biografía aún."}
                </p>
            </section>

            {/* Skills */}
            <section className="bg-white dark:bg-slate-800 p-5 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-700">
                <h3 className="text-sm font-bold text-slate-800 dark:text-white uppercase tracking-wider mb-3 flex items-center gap-2">
                    <span className="material-symbols-outlined text-slate-400">psychology</span>
                    Habilidades y Oficios
                </h3>
                <div className="flex flex-wrap gap-2">
                    {localProfile.skills && localProfile.skills.length > 0 ? localProfile.skills.map((skill, idx) => (
                        <span key={idx} className="bg-indigo-50 dark:bg-indigo-900/20 text-indigo-700 dark:text-indigo-300 px-3 py-1 rounded-full text-xs font-bold border border-indigo-100 dark:border-indigo-800/30">
                            {skill}
                        </span>
                    )) : (
                        <span className="text-sm text-slate-400">No especificadas</span>
                    )}
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
                        <div className="text-2xl font-black text-brand-blue dark:text-sky-400">{localProfile.communityReputation}%</div>
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
             <section className={`bg-white dark:bg-slate-800 p-5 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-700 h-full flex flex-col`}>
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-sm font-bold text-slate-800 dark:text-white uppercase tracking-wider flex items-center gap-2">
                        <span className="material-symbols-outlined text-rose-500">medical_services</span>
                        Ficha Médica
                    </h3>
                    
                    {/* View Switcher only for Own Profile */}
                    {isOwnProfile && minors.length > 0 ? (
                        <div className="relative">
                            <select 
                                value={selectedMedicalId} 
                                onChange={(e) => setSelectedMedicalId(e.target.value)}
                                className="bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200 text-[10px] font-bold py-1 pl-2 pr-6 rounded-lg outline-none cursor-pointer hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors appearance-none"
                            >
                                <option value="me">Yo</option>
                                {minors.map(m => <option key={m.id} value={m.id}>{m.name.split(' ')[0]}</option>)}
                            </select>
                            <span className="material-symbols-outlined absolute right-1 top-1 text-sm pointer-events-none text-slate-500">expand_more</span>
                        </div>
                    ) : (
                        <span className="text-[10px] bg-slate-100 dark:bg-slate-700 px-2 py-1 rounded text-slate-500 dark:text-slate-400">
                            {isOwnProfile ? 'Privado' : 'Vista Pública'}
                        </span>
                    )}
                </div>
                
                {isOwnProfile ? (
                    <div className="space-y-4">
                        <div className="flex justify-between items-center py-2 border-b border-gray-50 dark:border-slate-700/50">
                            <span className="text-sm text-slate-500 dark:text-slate-400">Tipo de Sangre</span>
                            <span className="font-bold text-slate-800 dark:text-white bg-rose-50 dark:bg-rose-900/20 text-rose-600 dark:text-rose-400 px-2 py-0.5 rounded">{medicalDisplayData.bloodType || '?'}</span>
                        </div>
                        
                        <div>
                            <span className="text-xs text-slate-500 dark:text-slate-400 uppercase font-bold block mb-2">Alergias</span>
                            <div className="flex flex-wrap gap-2">
                                {medicalDisplayData.allergies.length > 0 ? medicalDisplayData.allergies.map(a => (
                                    <span key={a} className="text-xs bg-orange-50 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400 px-2 py-1 rounded border border-orange-100 dark:border-orange-800/30">
                                        {a}
                                    </span>
                                )) : <span className="text-sm text-slate-400">Ninguna registrada</span>}
                            </div>
                        </div>

                        <div>
                            <span className="text-xs text-slate-500 dark:text-slate-400 uppercase font-bold block mb-2">Condiciones Crónicas</span>
                            <div className="flex flex-wrap gap-2">
                                {medicalDisplayData.chronicConditions.length > 0 ? medicalDisplayData.chronicConditions.map(c => (
                                    <span key={c} className="text-xs bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 px-2 py-1 rounded border border-blue-100 dark:border-blue-800/30">
                                        {c}
                                    </span>
                                )) : <span className="text-sm text-slate-400">Ninguna registrada</span>}
                            </div>
                        </div>
                        
                        {medicalDisplayData.mobilityIssue && (
                            <div className="mt-2 bg-yellow-50 dark:bg-yellow-900/10 p-2 rounded-lg border border-yellow-100 dark:border-yellow-800/30 flex items-center gap-2">
                                <span className="material-symbols-outlined text-yellow-600 dark:text-yellow-400">accessible</span>
                                <span className="text-xs font-bold text-yellow-700 dark:text-yellow-300">Movilidad Reducida</span>
                            </div>
                        )}

                        <div className="pt-4 mt-auto border-t border-gray-100 dark:border-slate-700">
                             {selectedMedicalId === 'me' ? (
                                 <button 
                                    onClick={() => handleEditOpen('medical')}
                                    className="w-full py-2 border border-dashed border-gray-300 dark:border-slate-600 rounded-xl text-slate-500 dark:text-slate-400 text-sm font-medium hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors flex items-center justify-center gap-2"
                                 >
                                    <span className="material-symbols-outlined text-base">edit_note</span>
                                    Actualizar Mis Datos
                                 </button>
                             ) : (
                                 <p className="text-xs text-center text-slate-400 italic">
                                     Datos de menor a cargo. Para editar, visita la sección de gestión familiar.
                                 </p>
                             )}
                        </div>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {/* Blood Type - Often public for emergency/community knowledge */}
                        <div className="flex justify-between items-center py-2 border-b border-gray-50 dark:border-slate-700/50">
                            <span className="text-sm text-slate-500 dark:text-slate-400">Tipo de Sangre</span>
                            <span className="font-bold text-slate-800 dark:text-white bg-rose-50 dark:bg-rose-900/20 text-rose-600 dark:text-rose-400 px-2 py-0.5 rounded">
                                {localProfile.medicalSummary.bloodType || '?'}
                            </span>
                        </div>

                        {/* Allergies - Public as requested */}
                        <div>
                            <span className="text-xs text-slate-500 dark:text-slate-400 uppercase font-bold block mb-2">Alergias (Alerta)</span>
                            <div className="flex flex-wrap gap-2">
                                {localProfile.medicalSummary.allergies.length > 0 ? localProfile.medicalSummary.allergies.map(a => (
                                    <span key={a} className="text-xs bg-orange-50 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400 px-2 py-1 rounded border border-orange-100 dark:border-orange-800/30">
                                        {a}
                                    </span>
                                )) : <span className="text-sm text-slate-400">Ninguna conocida</span>}
                            </div>
                        </div>

                        {/* Mobility - Useful for community help */}
                        {localProfile.medicalSummary.mobilityIssue && (
                            <div className="mt-2 bg-yellow-50 dark:bg-yellow-900/10 p-2 rounded-lg border border-yellow-100 dark:border-yellow-800/30 flex items-center gap-2">
                                <span className="material-symbols-outlined text-yellow-600 dark:text-yellow-400">accessible</span>
                                <span className="text-xs font-bold text-yellow-700 dark:text-yellow-300">Movilidad Reducida</span>
                            </div>
                        )}

                        {/* Hidden Sections Placeholder */}
                        <div className="mt-4 p-3 bg-gray-50 dark:bg-slate-700/30 rounded-xl border border-gray-100 dark:border-slate-700 flex items-center gap-3">
                            <span className="material-symbols-outlined text-slate-400">lock</span>
                            <div className="flex-1">
                                <p className="text-xs font-bold text-slate-600 dark:text-slate-300">Historial Detallado</p>
                                <p className="text-[10px] text-slate-500">Condiciones crónicas y medicación restringidas por privacidad.</p>
                            </div>
                        </div>
                    </div>
                )}
             </section>
        </div>
      </div>
    </div>
  );
};