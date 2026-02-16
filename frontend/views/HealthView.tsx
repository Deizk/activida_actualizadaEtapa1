import React, { useState, useEffect } from 'react';
import { MOCK_USER_PROFILE } from '../constants';
import { UserProfileData, MinorProfile } from '../types';

// Mock Data specific to this view (Local catalogs)
const MOCK_VACCINES = [
  { id: 1, name: 'COVID-19 (Refuerzo)', date: '15/03/2023', status: 'completed' },
  { id: 2, name: 'Influenza Estacional', date: '10/11/2022', status: 'completed' },
  { id: 3, name: 'Toxoide Tetánico', date: 'Pendiente', status: 'pending' },
];

const MOCK_CENTERS = [
  { id: 1, name: 'CDI Banco Obrero', type: 'CDI', status: 'operational', waitTime: '15 min', supplies: 'high' },
  { id: 2, name: 'Ambulatorio Los Bloques', type: 'Ambulatorio', status: 'limited', waitTime: '45 min', supplies: 'low' },
  { id: 3, name: 'Farmacia Popular', type: 'Farmacia', status: 'closed', waitTime: '-', supplies: 'none' },
];

const MOCK_CAMPAIGNS = [
  { 
      id: 1, 
      title: 'Vacunación Polio y Sarampión', 
      date: 'Sáb 20 Oct', 
      target: ['Niños', 'Niñas'], 
      location: 'Plaza Bolívar',
      description: 'Jornada nacional de inmunización para menores de 5 años. Se aplicarán dosis de refuerzo y esquema inicial.',
      requirements: ['Tarjeta de Vacunación', 'Cédula del Representante', 'Niño sano (sin fiebre)'],
      specialists: ['Dr. Pérez (Pediatra)', 'Lic. Marta (Enfermera)']
  },
  { 
      id: 2, 
      title: 'Despistaje de Diabetes', 
      date: 'Dom 21 Oct', 
      target: ['Adultos Mayores', 'Adultos'], 
      location: 'Casa Comunal',
      description: 'Evaluación integral para detección temprana de diabetes e hipertensión. Incluye medición de glicemia capilar y tensión arterial.',
      requirements: ['Ayuno de 8 horas (preferible)', 'Cédula de Identidad'],
      specialists: ['Dra. Gómez (Internista)', 'Nutricionista Carlos Ruiz']
  },
];

interface HealthViewProps {
    minors?: MinorProfile[];
}

export const HealthView: React.FC<HealthViewProps> = ({ minors = [] }) => {
  const [activeTab, setActiveTab] = useState<'record' | 'community'>('record');
  
  // Profile Switching State
  const [selectedProfileId, setSelectedProfileId] = useState<string>('me'); 
  // 'me' is the main user. minor IDs are for minors.

  // --- STATE FOR EDITABLE PROFILE ---
  const [isEditing, setIsEditing] = useState(false);
  const [medicalProfile, setMedicalProfile] = useState<UserProfileData['medicalSummary']>(MOCK_USER_PROFILE.medicalSummary);
  const [currentName, setCurrentName] = useState(MOCK_USER_PROFILE.name);
  const [currentAge, setCurrentAge] = useState(MOCK_USER_PROFILE.age);
  const [currentCedula, setCurrentCedula] = useState(MOCK_USER_PROFILE.cedula);

  // --- STATE FOR CAMPAIGN DETAILS ---
  const [viewingCampaign, setViewingCampaign] = useState<any>(null);

  // Effect to switch displayed data when profile changes
  useEffect(() => {
      if (selectedProfileId === 'me') {
          setMedicalProfile(MOCK_USER_PROFILE.medicalSummary);
          setCurrentName(MOCK_USER_PROFILE.name);
          setCurrentAge(MOCK_USER_PROFILE.age);
          setCurrentCedula(MOCK_USER_PROFILE.cedula);
      } else {
          const minor = minors.find(m => m.id === selectedProfileId);
          if (minor) {
              setMedicalProfile({
                  bloodType: minor.bloodType,
                  height: minor.height || 0,
                  weight: minor.weight || 0,
                  allergies: minor.allergies,
                  chronicConditions: minor.conditions,
                  mobilityIssue: minor.disability,
                  medications: [], // Mock empty for minors or fetch
                  surgeries: [], // Mock empty
                  familyHistory: [], // Mock empty
                  insurance: "Seguro Escolar / Público"
              });
              setCurrentName(minor.name);
              setCurrentAge(minor.age);
              setCurrentCedula(minor.cedula || 'N/A');
          }
      }
  }, [selectedProfileId, minors]);

  // Handlers for Editing Profile
  const handleSaveProfile = (e: React.FormEvent) => {
      e.preventDefault();
      setIsEditing(false);
      // In a real app, this would update the specific profile (minor or user) in the DB
      alert(`Expediente médico de ${currentName} actualizado correctamente.`);
  };

  const calculateBMI = (weight: number, height: number) => {
      if (!height || !weight) return 0;
      const hM = height / 100;
      return (weight / (hM * hM)).toFixed(1);
  };

  const bmi = calculateBMI(medicalProfile.weight, medicalProfile.height);

  return (
    <div className="flex flex-col h-full bg-slate-50 dark:bg-slate-900 transition-colors duration-300 relative">
      
      {/* --- MODAL: EDIT MEDICAL PROFILE --- */}
      {isEditing && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in-up">
              <div className="bg-white dark:bg-slate-800 w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden border border-gray-100 dark:border-slate-700 max-h-[90vh] flex flex-col">
                  <div className="p-4 border-b border-gray-100 dark:border-slate-700 flex justify-between items-center bg-gray-50 dark:bg-slate-700/50">
                      <h3 className="font-bold text-lg text-slate-800 dark:text-white flex items-center gap-2">
                          <span className="material-symbols-outlined text-brand-blue">edit_note</span>
                          Actualizar Expediente ({currentName})
                      </h3>
                      <button onClick={() => setIsEditing(false)} className="p-1 rounded-full hover:bg-gray-200 dark:hover:bg-slate-600">
                          <span className="material-symbols-outlined">close</span>
                      </button>
                  </div>
                  
                  <div className="overflow-y-auto p-6">
                      <form id="medical-form" onSubmit={handleSaveProfile} className="space-y-6">
                          <div className="grid grid-cols-3 gap-4">
                              <div>
                                  <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase mb-1">Sangre</label>
                                  <select 
                                      value={medicalProfile.bloodType}
                                      onChange={e => setMedicalProfile({...medicalProfile, bloodType: e.target.value})}
                                      className="w-full p-2 bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-600 rounded-xl outline-none text-slate-800 dark:text-white"
                                  >
                                      {['O+', 'O-', 'A+', 'A-', 'B+', 'B-', 'AB+', 'AB-'].map(t => (
                                          <option key={t} value={t}>{t}</option>
                                      ))}
                                  </select>
                              </div>
                              <div>
                                  <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase mb-1">Peso (kg)</label>
                                  <input 
                                      type="number"
                                      value={medicalProfile.weight}
                                      onChange={e => setMedicalProfile({...medicalProfile, weight: Number(e.target.value)})}
                                      className="w-full p-2 bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-600 rounded-xl outline-none text-slate-800 dark:text-white"
                                  />
                              </div>
                              <div>
                                  <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase mb-1">Altura (cm)</label>
                                  <input 
                                      type="number"
                                      value={medicalProfile.height}
                                      onChange={e => setMedicalProfile({...medicalProfile, height: Number(e.target.value)})}
                                      className="w-full p-2 bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-600 rounded-xl outline-none text-slate-800 dark:text-white"
                                  />
                              </div>
                          </div>

                          <div className="bg-yellow-50 dark:bg-yellow-900/10 p-3 rounded-lg border border-yellow-100 dark:border-yellow-900/30">
                              <p className="text-xs text-yellow-800 dark:text-yellow-200 font-medium">
                                  Nota: Para modificar condiciones crónicas o alergias graves, acuda al módulo de salud para certificación.
                              </p>
                          </div>
                      </form>
                  </div>

                  <div className="p-4 border-t border-gray-100 dark:border-slate-700 bg-gray-50 dark:bg-slate-800 flex gap-3">
                      <button onClick={() => setIsEditing(false)} className="flex-1 py-3 text-slate-500 font-bold hover:bg-gray-100 dark:hover:bg-slate-700 rounded-xl">Cancelar</button>
                      <button type="submit" form="medical-form" className="flex-1 py-3 bg-brand-blue text-white font-bold rounded-xl shadow-lg hover:bg-blue-700">Guardar Cambios</button>
                  </div>
              </div>
          </div>
      )}

      {/* Header */}
      <div className="bg-white dark:bg-slate-800 px-6 py-6 border-b border-gray-200 dark:border-slate-700">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
          <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-teal-100 dark:bg-teal-900/20 flex items-center justify-center text-teal-600 dark:text-teal-400">
                  <span className="material-symbols-outlined text-3xl">medical_services</span>
              </div>
              <div>
                  <h2 className="text-2xl font-bold text-slate-800 dark:text-white">Salud Integral</h2>
                  <p className="text-sm text-slate-500 dark:text-slate-400">Historia Clínica y Gestión</p>
              </div>
          </div>

          {/* PROFILE SELECTOR (Positioned Next to Header on Desktop) */}
          {activeTab === 'record' && (
            <div className="relative min-w-[240px]">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <span className="material-symbols-outlined text-slate-400">person_search</span>
                </div>
                <select 
                    value={selectedProfileId}
                    onChange={(e) => setSelectedProfileId(e.target.value)}
                    className="w-full appearance-none bg-gray-100 dark:bg-slate-700 border border-gray-200 dark:border-slate-600 text-slate-800 dark:text-white py-2.5 pl-10 pr-10 rounded-xl font-bold text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 shadow-sm"
                >
                    <option value="me">{MOCK_USER_PROFILE.name} (Yo)</option>
                    {minors.map(minor => (
                        <option key={minor.id} value={minor.id}>
                            {minor.name} (Menor)
                        </option>
                    ))}
                </select>
                <div className="absolute right-3 top-2.5 pointer-events-none text-slate-500">
                    <span className="material-symbols-outlined text-xl">expand_more</span>
                </div>
            </div>
          )}
        </div>

        {/* Tabs */}
        <div className="flex p-1 bg-slate-100 dark:bg-slate-700/50 rounded-xl">
          <button
            onClick={() => setActiveTab('record')}
            className={`flex-1 py-2.5 text-sm font-bold rounded-lg transition-all flex items-center justify-center gap-2 ${
              activeTab === 'record'
                ? 'bg-white dark:bg-slate-600 text-teal-600 dark:text-white shadow-sm'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'
            }`}
          >
            <span className="material-symbols-outlined text-lg">folder_shared</span>
            Expediente
          </button>
          <button
            onClick={() => setActiveTab('community')}
            className={`flex-1 py-2.5 text-sm font-bold rounded-lg transition-all flex items-center justify-center gap-2 ${
              activeTab === 'community'
                ? 'bg-white dark:bg-slate-600 text-teal-600 dark:text-white shadow-sm'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'
            }`}
          >
            <span className="material-symbols-outlined text-lg">local_hospital</span>
            Red Comunal
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-auto p-4 md:p-6">
        
        {/* PERSONAL RECORD TAB */}
        {activeTab === 'record' && (
          <div className="space-y-6 animate-fade-in-up">
            
            {/* 1. Vital Summary Card */}
            <section className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-700 overflow-hidden">
               <div className="p-4 bg-teal-600 text-white flex justify-between items-center">
                   <div>
                       <h3 className="font-bold text-lg">{currentName}</h3>
                       <p className="text-xs opacity-80 uppercase tracking-widest">{currentCedula}</p>
                   </div>
                   <button 
                        onClick={() => setIsEditing(true)}
                        className="bg-white/20 hover:bg-white/30 p-2 rounded-lg transition-colors backdrop-blur-sm"
                   >
                       <span className="material-symbols-outlined">edit</span>
                   </button>
               </div>
               
               <div className="grid grid-cols-4 divide-x divide-gray-100 dark:divide-slate-700">
                   <div className="p-4 text-center">
                       <p className="text-[10px] text-slate-400 uppercase font-bold mb-1">Sangre</p>
                       <p className="text-xl font-black text-slate-800 dark:text-white">{medicalProfile.bloodType}</p>
                   </div>
                   <div className="p-4 text-center">
                       <p className="text-[10px] text-slate-400 uppercase font-bold mb-1">Edad</p>
                       <p className="text-xl font-black text-slate-800 dark:text-white">{currentAge}</p>
                   </div>
                   <div className="p-4 text-center">
                       <p className="text-[10px] text-slate-400 uppercase font-bold mb-1">Peso</p>
                       <p className="text-xl font-black text-slate-800 dark:text-white">{medicalProfile.weight > 0 ? medicalProfile.weight : '--'}<span className="text-xs text-slate-400 font-medium">kg</span></p>
                   </div>
                   <div className="p-4 text-center">
                       <p className="text-[10px] text-slate-400 uppercase font-bold mb-1">IMC</p>
                       <p className={`text-xl font-black ${Number(bmi) > 25 ? 'text-orange-500' : 'text-green-500'}`}>{bmi === '0.0' || bmi === 'NaN' ? '--' : bmi}</p>
                   </div>
               </div>
            </section>

            {/* 2. Pathologies & Allergies Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <section className="bg-white dark:bg-slate-800 p-5 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-700">
                    <h3 className="text-sm font-bold text-slate-800 dark:text-white uppercase tracking-wider mb-3 flex items-center gap-2">
                        <span className="material-symbols-outlined text-rose-500">cardiology</span>
                        Condiciones Crónicas
                    </h3>
                    <div className="flex flex-wrap gap-2">
                        {medicalProfile.chronicConditions.length > 0 ? medicalProfile.chronicConditions.map((cond, idx) => (
                            <span key={idx} className="bg-rose-50 dark:bg-rose-900/20 text-rose-700 dark:text-rose-300 px-3 py-1.5 rounded-lg text-sm font-bold border border-rose-100 dark:border-rose-900/30">
                                {cond}
                            </span>
                        )) : <span className="text-sm text-slate-400 italic">Ninguna registrada</span>}
                    </div>
                </section>

                <section className="bg-white dark:bg-slate-800 p-5 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-700">
                    <h3 className="text-sm font-bold text-slate-800 dark:text-white uppercase tracking-wider mb-3 flex items-center gap-2">
                        <span className="material-symbols-outlined text-orange-500">warning</span>
                        Alergias
                    </h3>
                    <div className="flex flex-wrap gap-2">
                        {medicalProfile.allergies.length > 0 ? medicalProfile.allergies.map((alg, idx) => (
                            <span key={idx} className="bg-orange-50 dark:bg-orange-900/20 text-orange-700 dark:text-orange-300 px-3 py-1.5 rounded-lg text-sm font-bold border border-orange-100 dark:border-orange-900/30">
                                {alg}
                            </span>
                        )) : <span className="text-sm text-slate-400 italic">Ninguna registrada</span>}
                    </div>
                </section>
            </div>

            {/* 3. Active Treatments (Medications) */}
            <section className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-700 overflow-hidden">
                <div className="p-4 border-b border-gray-100 dark:border-slate-700 bg-gray-50 dark:bg-slate-700/30 flex justify-between items-center">
                    <h3 className="font-bold text-slate-800 dark:text-white flex items-center gap-2">
                        <span className="material-symbols-outlined text-blue-500">medication</span>
                        Tratamientos Activos
                    </h3>
                    <button className="text-xs font-bold text-brand-blue dark:text-sky-400 hover:underline">Gestionar</button>
                </div>
                <div className="divide-y divide-gray-100 dark:divide-slate-700">
                    {medicalProfile.medications.length > 0 ? medicalProfile.medications.map((med, idx) => (
                        <div key={idx} className="p-4 flex justify-between items-center">
                            <div>
                                <p className="font-bold text-slate-800 dark:text-white">{med.name}</p>
                                <p className="text-xs text-slate-500 dark:text-slate-400">{med.dosage}</p>
                            </div>
                            <div className="text-right bg-blue-50 dark:bg-blue-900/20 px-3 py-1 rounded-lg">
                                <span className="text-xs font-bold text-blue-700 dark:text-blue-300 flex items-center gap-1">
                                    <span className="material-symbols-outlined text-sm">schedule</span>
                                    {med.frequency}
                                </span>
                            </div>
                        </div>
                    )) : (
                        <div className="p-6 text-center text-slate-400">
                            <span className="material-symbols-outlined text-3xl mb-1 opacity-50">healing</span>
                            <p className="text-sm">No hay medicamentos activos registrados para {currentName}.</p>
                        </div>
                    )}
                </div>
            </section>

            {/* 4. Medical History Timeline */}
            <section className="bg-white dark:bg-slate-800 p-5 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-700">
                <h3 className="font-bold text-slate-800 dark:text-white mb-4 flex items-center gap-2">
                    <span className="material-symbols-outlined text-slate-500">history</span>
                    Historial Quirúrgico y Familiar
                </h3>
                
                <div className="space-y-4">
                    {/* Surgeries */}
                    <div>
                        <p className="text-xs font-bold text-slate-400 uppercase mb-2">Cirugías Previas</p>
                        {medicalProfile.surgeries.length > 0 ? (
                            <div className="space-y-2">
                                {medicalProfile.surgeries.map((surg, idx) => (
                                    <div key={idx} className="flex items-center gap-3">
                                        <div className="w-1 h-1 bg-slate-300 rounded-full"></div>
                                        <span className="text-sm font-medium text-slate-700 dark:text-slate-200">{surg.procedure}</span>
                                        <span className="text-xs text-slate-400 border border-slate-200 dark:border-slate-600 px-1.5 rounded">{surg.year}</span>
                                    </div>
                                ))}
                            </div>
                        ) : <p className="text-sm text-slate-400 italic">Sin registros</p>}
                    </div>

                    <div className="border-t border-gray-100 dark:border-slate-700 pt-3">
                        <p className="text-xs font-bold text-slate-400 uppercase mb-2">Antecedentes Familiares</p>
                        {medicalProfile.familyHistory.length > 0 ? (
                            <div className="flex flex-wrap gap-2">
                                {medicalProfile.familyHistory.map((hist, idx) => (
                                    <span key={idx} className="text-xs bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 px-2 py-1 rounded border border-slate-200 dark:border-slate-600">
                                        {hist}
                                    </span>
                                ))}
                            </div>
                        ) : <p className="text-sm text-slate-400 italic">Sin registros</p>}
                    </div>
                </div>
            </section>

            {/* 5. Vaccines (Local Mock) */}
            <section className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-700 overflow-hidden">
                <div className="p-4 bg-purple-50 dark:bg-purple-900/10 border-b border-purple-100 dark:border-purple-900/30">
                    <h3 className="font-bold text-purple-800 dark:text-purple-300 flex items-center gap-2">
                        <span className="material-symbols-outlined">vaccines</span>
                        Esquema de Vacunación
                    </h3>
                </div>
                <div className="divide-y divide-gray-100 dark:divide-slate-700">
                  {MOCK_VACCINES.map(vac => (
                    <div key={vac.id} className="p-4 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${vac.status === 'completed' ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-400'}`}>
                          <span className="material-symbols-outlined text-sm">{vac.status === 'completed' ? 'check' : 'hourglass_empty'}</span>
                        </div>
                        <div>
                          <p className="text-sm font-bold text-slate-800 dark:text-white">{vac.name}</p>
                          <p className="text-xs text-slate-500">Fecha: {vac.date}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
            </section>

          </div>
        )}

        {/* COMMUNITY TAB (Preserved for completeness) */}
        {activeTab === 'community' && (
          <div className="space-y-6 animate-fade-in-up">
            {/* Centers Status */}
            <section>
              <div className="flex justify-between items-center mb-3">
                 <h3 className="font-bold text-slate-800 dark:text-white flex items-center gap-2">
                    <span className="material-symbols-outlined text-brand-blue dark:text-sky-400">local_hospital</span>
                    Centros de Salud
                 </h3>
                 <button className="text-xs font-bold bg-white dark:bg-slate-700 border border-gray-200 dark:border-slate-600 px-3 py-1.5 rounded-lg text-slate-600 dark:text-slate-300 hover:text-brand-blue dark:hover:text-sky-400 transition-colors shadow-sm">
                    Reportar Estado
                 </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {MOCK_CENTERS.map(center => {
                  const statusConfig = {
                    operational: { color: 'green', text: 'Operativo', icon: 'check_circle' },
                    limited: { color: 'orange', text: 'Limitado', icon: 'info' },
                    closed: { color: 'red', text: 'Cerrado', icon: 'cancel' }
                  }[center.status as 'operational' | 'limited' | 'closed'];

                  return (
                    <div key={center.id} className="bg-white dark:bg-slate-800 p-4 rounded-xl border border-gray-100 dark:border-slate-700 shadow-sm relative overflow-hidden group">
                      <div className={`absolute top-0 left-0 w-1 h-full bg-${statusConfig.color}-500`}></div>
                      <div className="flex justify-between items-start mb-2 pl-3">
                        <h4 className="font-bold text-slate-800 dark:text-white">{center.name}</h4>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full bg-${statusConfig.color}-100 dark:bg-${statusConfig.color}-900/30 text-${statusConfig.color}-700 dark:text-${statusConfig.color}-400 flex items-center gap-1`}>
                          <span className="material-symbols-outlined text-[10px]">{statusConfig.icon}</span>
                          {statusConfig.text}
                        </span>
                      </div>
                      <div className="pl-3 space-y-1">
                        <p className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-2">
                           <span className="material-symbols-outlined text-sm">schedule</span>
                           Espera aprox: <span className="font-semibold text-slate-700 dark:text-slate-200">{center.waitTime}</span>
                        </p>
                        <p className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-2">
                           <span className="material-symbols-outlined text-sm">inventory_2</span>
                           Insumos: 
                           <span className={`font-semibold ${center.supplies === 'high' ? 'text-green-600' : center.supplies === 'low' ? 'text-orange-600' : 'text-red-600'}`}>
                              {center.supplies === 'high' ? 'Abastecido' : center.supplies === 'low' ? 'Escasos' : 'Crítico'}
                           </span>
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>

            {/* Campaigns (Jornadas) */}
            <section>
              <h3 className="font-bold text-slate-800 dark:text-white mb-3 flex items-center gap-2">
                <span className="material-symbols-outlined text-purple-500">campaign</span>
                Jornadas de Salud
              </h3>
              <div className="space-y-3">
                {MOCK_CAMPAIGNS.map(camp => (
                  <div key={camp.id} className="bg-white dark:bg-slate-800 p-4 rounded-xl border border-gray-100 dark:border-slate-700 shadow-sm hover:shadow-md transition-all flex flex-col md:flex-row gap-4 md:items-center">
                    <div className="bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400 w-16 h-16 rounded-xl flex flex-col items-center justify-center shrink-0 font-bold leading-none border border-purple-100 dark:border-purple-900/30">
                        <span className="text-xl">{camp.date.split(' ')[1]}</span>
                        <span className="text-[10px] uppercase">{camp.date.split(' ')[2]}</span>
                    </div>
                    
                    <div className="flex-1">
                        <div className="flex flex-wrap gap-2 mb-1">
                            {camp.target.map(t => (
                                <span key={t} className="text-[10px] font-bold uppercase bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-300 px-2 py-0.5 rounded">
                                    {t}
                                </span>
                            ))}
                        </div>
                        <h4 className="font-bold text-slate-800 dark:text-white text-lg">{camp.title}</h4>
                        <p className="text-sm text-slate-500 dark:text-slate-400 flex items-center gap-1 mt-1">
                            <span className="material-symbols-outlined text-sm">location_on</span>
                            {camp.location}
                        </p>
                    </div>

                    <button 
                        onClick={() => setViewingCampaign(camp)}
                        className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg text-sm font-bold transition-colors shadow-sm shadow-purple-500/20"
                    >
                        Ver Detalles
                    </button>
                  </div>
                ))}
              </div>
            </section>
          </div>
        )}
      </div>
    </div>
  );
};