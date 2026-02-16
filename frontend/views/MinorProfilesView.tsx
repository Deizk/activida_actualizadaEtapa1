import React, { useState } from 'react';
import { MOCK_USER_PROFILE } from '../constants';
import { MinorProfile } from '../types';

interface MinorProfilesViewProps {
  onEmergency?: (minor: MinorProfile) => void;
  minors: MinorProfile[];
  setMinors: React.Dispatch<React.SetStateAction<MinorProfile[]>>;
}

export const MinorProfilesView: React.FC<MinorProfilesViewProps> = ({ onEmergency, minors, setMinors }) => {
  const [showForm, setShowForm] = useState(false);
  
  // Editing State
  const [editingId, setEditingId] = useState<string | null>(null);

  // Form State
  const [newName, setNewName] = useState('');
  const [newDob, setNewDob] = useState('');
  const [newCedula, setNewCedula] = useState('');
  const [newPhone, setNewPhone] = useState('');
  const [hasCertificate, setHasCertificate] = useState(false);
  const [newWeight, setNewWeight] = useState('');
  const [newHeight, setNewHeight] = useState('');
  
  // Medical State in Form
  const [hasCondition, setHasCondition] = useState(false);
  const [conditionInput, setConditionInput] = useState('');
  const [conditionsList, setConditionsList] = useState<string[]>([]);
  const [isDisability, setIsDisability] = useState(false);

  const resetForm = () => {
    setNewName('');
    setNewDob('');
    setNewCedula('');
    setNewPhone('');
    setHasCertificate(false);
    setHasCondition(false);
    setConditionInput('');
    setConditionsList([]);
    setIsDisability(false);
    setNewWeight('');
    setNewHeight('');
    setEditingId(null);
  };

  const handleOpenAdd = () => {
      resetForm();
      setShowForm(true);
  };

  const handleOpenEdit = (minor: MinorProfile) => {
      setEditingId(minor.id);
      setNewName(minor.name);
      setNewDob(minor.dateOfBirth);
      setNewCedula(minor.cedula || '');
      setNewPhone(minor.phone || '');
      setNewWeight(minor.weight ? minor.weight.toString() : '');
      setNewHeight(minor.height ? minor.height.toString() : '');
      // Mock check for certificate if editing (assuming existing are verified)
      setHasCertificate(minor.birthCertificateVerified);
      
      const hasConds = minor.conditions.length > 0;
      setHasCondition(hasConds);
      setConditionsList(minor.conditions);
      setConditionInput('');
      setIsDisability(minor.disability);
      
      setShowForm(true);
  };

  const handleAddCondition = (e?: React.MouseEvent | React.KeyboardEvent) => {
    if (e) e.preventDefault();
    if (conditionInput.trim()) {
        if (!conditionsList.includes(conditionInput.trim())) {
            setConditionsList([...conditionsList, conditionInput.trim()]);
        }
        setConditionInput('');
    }
  };

  const handleRemoveCondition = (conditionToRemove: string) => {
      setConditionsList(conditionsList.filter(c => c !== conditionToRemove));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName || !newDob || !newCedula || !newPhone || !hasCertificate) return;

    // Calc Age Mock
    const birthDate = new Date(newDob);
    const ageDiff = Date.now() - birthDate.getTime();
    const ageDate = new Date(ageDiff); 
    const calculatedAge = Math.abs(ageDate.getUTCFullYear() - 1970);

    // Final conditions logic
    const finalConditions = hasCondition ? conditionsList : [];

    // Medical ID logic
    const medicalRecordId = finalConditions.length > 0
        ? `MED-${MOCK_USER_PROFILE.cedula.split('-')[1].substring(0,4)}-${Date.now().toString().substring(9)}`
        : undefined;

    const profileData: MinorProfile = {
        id: editingId || `M-${Date.now()}`,
        guardianId: "1",
        name: newName,
        dateOfBirth: newDob,
        age: calculatedAge,
        cedula: newCedula,
        phone: newPhone,
        gender: "F", // Default for mock
        bloodType: "O+",
        weight: newWeight ? parseFloat(newWeight) : undefined,
        height: newHeight ? parseFloat(newHeight) : undefined,
        allergies: [],
        conditions: finalConditions,
        disability: isDisability,
        medicalRecordId: medicalRecordId,
        birthCertificateVerified: true,
        emergencyContact: {
            name: MOCK_USER_PROFILE.name,
            relation: "Madre/Padre",
            phone: MOCK_USER_PROFILE.phone
        }
    };
    
    if (editingId) {
        // Update existing
        setMinors(prev => prev.map(m => m.id === editingId ? profileData : m));
        alert("Perfil actualizado correctamente.");
    } else {
        // Create new
        setMinors(prev => [...prev, profileData]);
        if (finalConditions.length > 0) {
            alert(`✅ Sincronización Exitosa\n\nLas condiciones médicas han sido vinculadas al Historial Médico Familiar Centralizado.`);
        }
    }

    setShowForm(false);
    resetForm();
  };

  const handleSOS = (minor: MinorProfile) => {
      if (onEmergency) {
          onEmergency(minor);
      } else {
          alert(`🚨 ALERTA SOS ACTIVADA PARA: ${minor.name}`);
      }
  };

  const migrateProfile = (id: string) => {
      alert("Iniciando proceso de migración a perfil ciudadano independiente (Cédula requerida).");
  };

  return (
    <div className="flex flex-col h-full bg-slate-50 dark:bg-slate-900 transition-colors duration-300 animate-fade-in-up pb-20 md:pb-6">
      
      {/* Header */}
      <header className="bg-white dark:bg-slate-800 border-b border-gray-200 dark:border-slate-700 px-6 py-6 sticky top-0 z-10">
        <div className="flex justify-between items-center">
             <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-pink-100 dark:bg-pink-900/20 flex items-center justify-center text-pink-600 dark:text-pink-400">
                    <span className="material-symbols-outlined text-3xl">child_care</span>
                </div>
                <div>
                    <h2 className="text-2xl font-bold text-slate-800 dark:text-white">Menores a Cargo</h2>
                    <p className="text-sm text-slate-500 dark:text-slate-400">Gestión de identidad y salud familiar</p>
                </div>
             </div>
             <button 
                onClick={handleOpenAdd}
                className="bg-brand-blue hover:bg-sky-600 text-white px-3 py-2 rounded-lg shadow-sm transition-colors text-sm font-bold flex items-center gap-2"
             >
                <span className="material-symbols-outlined text-lg">add</span>
                <span className="hidden md:inline">Registrar Menor</span>
             </button>
        </div>
      </header>

      <div className="flex-1 overflow-auto p-4 md:p-6">

        {/* Add/Edit Form Modal Overlay */}
        {showForm && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in-up">
                <div className="bg-white dark:bg-slate-800 w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden border border-gray-100 dark:border-slate-700 max-h-[90vh] overflow-y-auto">
                    <div className="p-4 border-b border-gray-100 dark:border-slate-700 flex justify-between items-center sticky top-0 bg-white dark:bg-slate-800 z-10">
                        <h3 className="font-bold text-lg text-slate-800 dark:text-white">{editingId ? 'Editar Perfil' : 'Nuevo Perfil de Menor'}</h3>
                        <button onClick={() => setShowForm(false)} className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-slate-700">
                            <span className="material-symbols-outlined">close</span>
                        </button>
                    </div>
                    <form onSubmit={handleSubmit} className="p-6 space-y-4">
                        <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg flex items-start gap-3 text-sm text-blue-800 dark:text-blue-300 mb-4">
                            <span className="material-symbols-outlined text-lg mt-0.5">info</span>
                            <p>Este perfil estará vinculado a tu cuenta (Tutor: {MOCK_USER_PROFILE.name}).</p>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4">
                            <div className="col-span-2">
                                <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase mb-1">Nombre Completo</label>
                                <input 
                                    type="text" 
                                    value={newName}
                                    onChange={e => setNewName(e.target.value)}
                                    className="w-full p-3 bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-600 rounded-xl focus:ring-2 focus:ring-brand-blue outline-none text-slate-800 dark:text-white"
                                    placeholder="Ej. Sofía Pérez"
                                    required
                                />
                            </div>

                            <div className="col-span-2 md:col-span-1">
                                <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase mb-1">Cédula de Identidad</label>
                                <input 
                                    type="text" 
                                    value={newCedula}
                                    onChange={e => setNewCedula(e.target.value)}
                                    className="w-full p-3 bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-600 rounded-xl focus:ring-2 focus:ring-brand-blue outline-none text-slate-800 dark:text-white"
                                    placeholder="V-12.345.678"
                                    required
                                />
                            </div>

                             <div className="col-span-2 md:col-span-1">
                                <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase mb-1">Fecha de Nacimiento</label>
                                <input 
                                    type="date" 
                                    value={newDob}
                                    onChange={e => setNewDob(e.target.value)}
                                    className="w-full p-3 bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-600 rounded-xl focus:ring-2 focus:ring-brand-blue outline-none text-slate-800 dark:text-white"
                                    required
                                />
                            </div>

                             <div className="col-span-2">
                                <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase mb-1">Número de Teléfono</label>
                                <input 
                                    type="tel" 
                                    value={newPhone}
                                    onChange={e => setNewPhone(e.target.value)}
                                    className="w-full p-3 bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-600 rounded-xl focus:ring-2 focus:ring-brand-blue outline-none text-slate-800 dark:text-white"
                                    placeholder="0412-5555555"
                                    required
                                />
                                <p className="text-[10px] text-slate-400 mt-1">Si no posee, usar teléfono del representante.</p>
                            </div>

                            <div className="col-span-1">
                                <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase mb-1">Peso (kg)</label>
                                <input 
                                    type="number" 
                                    value={newWeight}
                                    onChange={e => setNewWeight(e.target.value)}
                                    className="w-full p-3 bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-600 rounded-xl focus:ring-2 focus:ring-brand-blue outline-none text-slate-800 dark:text-white"
                                />
                            </div>
                            <div className="col-span-1">
                                <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase mb-1">Altura (cm)</label>
                                <input 
                                    type="number" 
                                    value={newHeight}
                                    onChange={e => setNewHeight(e.target.value)}
                                    className="w-full p-3 bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-600 rounded-xl focus:ring-2 focus:ring-brand-blue outline-none text-slate-800 dark:text-white"
                                />
                            </div>
                        </div>

                        {/* Medical Section */}
                        <div className="border-t border-gray-100 dark:border-slate-700 pt-4">
                            <label className="flex items-center gap-3 p-3 rounded-xl border border-gray-200 dark:border-slate-600 cursor-pointer hover:bg-gray-50 dark:hover:bg-slate-800 transition-colors">
                                <div className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${hasCondition ? 'bg-brand-blue border-brand-blue' : 'border-gray-400'}`}>
                                    {hasCondition && <span className="material-symbols-outlined text-white text-sm">check</span>}
                                </div>
                                <input type="checkbox" className="hidden" checked={hasCondition} onChange={e => setHasCondition(e.target.checked)} />
                                <div className="flex-1">
                                    <span className="font-bold text-sm text-slate-800 dark:text-white block">¿Tiene condición médica?</span>
                                    <span className="text-xs text-slate-500 dark:text-slate-400">Se vinculará al Registro Médico Central</span>
                                </div>
                            </label>

                            {hasCondition && (
                                <div className="mt-3 pl-4 border-l-2 border-brand-blue space-y-3 animate-fade-in-down">
                                    <div>
                                        <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase mb-1">Añadir Condiciones / Enfermedades</label>
                                        <div className="flex gap-2">
                                            <input 
                                                type="text" 
                                                value={conditionInput}
                                                onChange={e => setConditionInput(e.target.value)}
                                                onKeyDown={(e) => e.key === 'Enter' && handleAddCondition(e)}
                                                className="flex-1 p-3 bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-600 rounded-xl focus:ring-2 focus:ring-brand-blue outline-none text-slate-800 dark:text-white"
                                                placeholder="Ej. Asma, Diabetes..."
                                            />
                                            <button 
                                                type="button" 
                                                onClick={handleAddCondition}
                                                className="bg-brand-blue hover:bg-sky-600 text-white p-3 rounded-xl transition-colors"
                                            >
                                                <span className="material-symbols-outlined">add</span>
                                            </button>
                                        </div>
                                        {/* Conditions List */}
                                        <div className="flex flex-wrap gap-2 mt-2">
                                            {conditionsList.length > 0 ? conditionsList.map((cond, idx) => (
                                                <span key={idx} className="bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 px-3 py-1 rounded-full text-sm font-bold border border-blue-100 dark:border-blue-900/30 flex items-center gap-1 animate-fade-in-up">
                                                    {cond}
                                                    <button 
                                                        type="button" 
                                                        onClick={() => handleRemoveCondition(cond)}
                                                        className="hover:text-red-500 transition-colors ml-1"
                                                    >
                                                        <span className="material-symbols-outlined text-sm">close</span>
                                                    </button>
                                                </span>
                                            )) : (
                                                <span className="text-xs text-slate-400 italic py-1">Sin condiciones agregadas</span>
                                            )}
                                        </div>
                                    </div>
                                    <label className="flex items-center gap-2 cursor-pointer mt-2">
                                        <input 
                                            type="checkbox" 
                                            checked={isDisability} 
                                            onChange={e => setIsDisability(e.target.checked)}
                                            className="rounded text-brand-blue focus:ring-brand-blue"
                                        />
                                        <span className="text-sm text-slate-700 dark:text-slate-300">Alguna condición certifica discapacidad</span>
                                    </label>
                                    <p className="text-[10px] text-brand-blue dark:text-sky-400 flex items-center gap-1">
                                        <span className="material-symbols-outlined text-xs">cloud_sync</span>
                                        Sincronizando con Ficha Familiar...
                                    </p>
                                </div>
                            )}
                        </div>

                        {/* Birth Certificate Upload Simulation */}
                        <div className="border-2 border-dashed border-gray-300 dark:border-slate-600 rounded-xl p-6 flex flex-col items-center justify-center text-center hover:bg-gray-50 dark:hover:bg-slate-700/50 transition-colors cursor-pointer" onClick={() => setHasCertificate(true)}>
                            {hasCertificate ? (
                                <div className="text-green-600 flex flex-col items-center animate-fade-in-up">
                                    <span className="material-symbols-outlined text-4xl mb-2">check_circle</span>
                                    <span className="font-bold text-sm">Documento Cargado</span>
                                    <span className="text-xs">partida_nacimiento.pdf</span>
                                </div>
                            ) : (
                                <>
                                    <span className="material-symbols-outlined text-4xl text-slate-400 mb-2">upload_file</span>
                                    <p className="text-sm font-bold text-slate-700 dark:text-slate-300">Cargar Partida de Nacimiento</p>
                                    <p className="text-xs text-slate-500 mt-1">Requisito obligatorio para vincular</p>
                                </>
                            )}
                        </div>

                        <button 
                            type="submit" 
                            disabled={!hasCertificate}
                            className={`w-full py-3 rounded-xl font-bold text-white shadow-lg transition-all ${hasCertificate ? 'bg-brand-blue hover:bg-sky-600' : 'bg-slate-400 cursor-not-allowed'}`}
                        >
                            {editingId ? 'Guardar Cambios' : 'Crear Perfil y Vincular'}
                        </button>
                    </form>
                </div>
            </div>
        )}

        {/* Minors List */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {minors.map(minor => {
                const isAdult = minor.age >= 18;
                return (
                    <div key={minor.id} className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-200 dark:border-slate-700 shadow-sm overflow-hidden flex flex-col">
                        {/* Card Header */}
                        <div className="p-5 flex items-start gap-4 border-b border-gray-50 dark:border-slate-700/50">
                            <div className="w-16 h-16 rounded-2xl bg-slate-100 dark:bg-slate-700 flex items-center justify-center text-2xl font-bold text-slate-500 dark:text-slate-400 shadow-inner">
                                {minor.name.charAt(0)}
                            </div>
                            <div className="flex-1">
                                <div className="flex justify-between items-start">
                                    <h3 className="text-lg font-bold text-slate-800 dark:text-white leading-tight">{minor.name}</h3>
                                    {minor.birthCertificateVerified && (
                                        <span className="material-symbols-outlined text-brand-blue text-lg" title="Documento Verificado">verified_user</span>
                                    )}
                                </div>
                                <div className="flex flex-wrap gap-2 text-sm text-slate-500 dark:text-slate-400 font-medium mt-1">
                                    <span>{minor.age} años</span>
                                    <span>•</span>
                                    <span>{minor.gender === 'F' ? 'Niña' : 'Niño'}</span>
                                    {minor.cedula && (
                                        <>
                                            <span>•</span>
                                            <span className="font-mono">{minor.cedula}</span>
                                        </>
                                    )}
                                </div>
                                {minor.phone && (
                                    <p className="text-xs text-slate-400 mt-1 flex items-center gap-1">
                                        <span className="material-symbols-outlined text-sm">smartphone</span>
                                        {minor.phone}
                                    </p>
                                )}
                                
                                {/* Central Registry Badge */}
                                {minor.medicalRecordId && (
                                    <div className="mt-2 inline-flex items-center gap-1 bg-purple-50 dark:bg-purple-900/20 border border-purple-100 dark:border-purple-900/30 px-2 py-0.5 rounded text-[10px] font-bold text-purple-700 dark:text-purple-300">
                                        <span className="material-symbols-outlined text-xs">folder_shared</span>
                                        Ficha Médica: {minor.medicalRecordId.substring(0,8)}...
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Medical Summary Snippet */}
                        <div className="p-5 grid grid-cols-2 gap-4 flex-1">
                            <div className="bg-rose-50 dark:bg-rose-900/10 p-3 rounded-xl border border-rose-100 dark:border-rose-900/20">
                                <p className="text-[10px] font-bold text-rose-600 dark:text-rose-400 uppercase mb-1">Tipo Sangre</p>
                                <p className="text-lg font-black text-slate-800 dark:text-white">{minor.bloodType}</p>
                            </div>
                            
                            <div className="bg-slate-50 dark:bg-slate-700/30 p-3 rounded-xl border border-slate-100 dark:border-slate-700">
                                <p className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase mb-1">Condiciones</p>
                                {minor.conditions.length > 0 ? (
                                    <div className="flex flex-wrap gap-1">
                                        {minor.conditions.map((c, i) => (
                                            <span key={i} className="text-[10px] bg-white dark:bg-slate-600 px-1.5 rounded border border-gray-200 dark:border-slate-500">{c}</span>
                                        ))}
                                    </div>
                                ) : (
                                    <p className="text-xs text-slate-400 italic">Ninguna registrada</p>
                                )}
                            </div>

                            <div className="col-span-2">
                                <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase mb-2">Contacto de Emergencia</p>
                                <div className="flex items-center gap-2 bg-slate-50 dark:bg-slate-700/30 p-2 rounded-lg">
                                    <span className="material-symbols-outlined text-slate-400">phone_in_talk</span>
                                    <div className="flex-1">
                                        <p className="text-xs font-bold text-slate-700 dark:text-slate-200">{minor.emergencyContact.name}</p>
                                        <p className="text-[10px] text-slate-500">{minor.emergencyContact.relation}</p>
                                    </div>
                                    <a href={`tel:${minor.emergencyContact.phone}`} className="bg-green-500 text-white p-1.5 rounded-full shadow-sm">
                                        <span className="material-symbols-outlined text-sm">call</span>
                                    </a>
                                </div>
                            </div>
                        </div>

                        {/* Actions Footer */}
                        <div className="bg-gray-50 dark:bg-slate-900/50 p-4 border-t border-gray-100 dark:border-slate-700 flex gap-3">
                            {isAdult ? (
                                <button 
                                    onClick={() => migrateProfile(minor.id)}
                                    className="flex-1 bg-slate-800 dark:bg-slate-700 text-white py-2 rounded-lg text-xs font-bold shadow-sm hover:bg-slate-700 dark:hover:bg-slate-600 transition-colors flex items-center justify-center gap-2"
                                >
                                    <span className="material-symbols-outlined text-sm">move_up</span>
                                    Migrar Perfil
                                </button>
                            ) : (
                                <button 
                                    onClick={() => handleSOS(minor)}
                                    className="flex-1 bg-red-600 text-white py-2 rounded-lg text-xs font-bold shadow-lg shadow-red-500/30 hover:bg-red-700 transition-colors flex items-center justify-center gap-2"
                                >
                                    <span className="material-symbols-outlined text-sm">e911_emergency</span>
                                    Reportar SOS
                                </button>
                            )}
                            <button 
                                onClick={() => handleOpenEdit(minor)}
                                className="px-4 border border-gray-300 dark:border-slate-600 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-700 transition-colors"
                            >
                                <span className="material-symbols-outlined text-lg">edit_note</span>
                            </button>
                        </div>
                    </div>
                );
            })}
        </div>

        {minors.length === 0 && (
             <div className="flex flex-col items-center justify-center py-16 text-slate-400 text-center">
                <span className="material-symbols-outlined text-5xl mb-3 opacity-30">family_restroom</span>
                <p className="text-lg font-bold text-slate-600 dark:text-slate-300">No hay menores registrados</p>
                <p className="text-sm max-w-xs mx-auto mb-6">Vincula a tus hijos o representados para gestionar su salud y seguridad.</p>
                <button 
                    onClick={handleOpenAdd}
                    className="text-brand-blue dark:text-sky-400 font-bold hover:underline"
                >
                    Registrar el primero ahora
                </button>
             </div>
        )}
      </div>
    </div>
  );
};