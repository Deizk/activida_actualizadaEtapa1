import React, { useState } from 'react';

// Mock Data specific to this view
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
  { 
      id: 3, 
      title: 'Charla Salud Sexual', 
      date: 'Vie 26 Oct', 
      target: ['Adolescentes'], 
      location: 'Liceo',
      description: 'Conversatorio educativo sobre prevención de ETS y embarazo precoz. Entrega de preservativos y material informativo.',
      requirements: ['Carnet Estudiantil'],
      specialists: ['Psic. Ana Torres', 'Promotores de Salud']
  },
];

export const HealthView: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'personal' | 'community'>('personal');
  
  // --- STATE FOR EDITABLE PROFILE ---
  const [isEditing, setIsEditing] = useState(false);
  const [medicalData, setMedicalData] = useState({
      bloodType: 'O+',
      age: 34,
      weight: 65,
      conditions: [
          { id: 1, name: 'Hipertensión Arterial', type: 'Crónica' },
          { id: 2, name: 'Alergia a Penicilina', type: 'Alergia' },
      ],
      newCondition: ''
  });

  // --- STATE FOR CAMPAIGN DETAILS ---
  const [viewingCampaign, setViewingCampaign] = useState<any>(null);

  // Handlers for Editing Profile
  const handleSaveProfile = (e: React.FormEvent) => {
      e.preventDefault();
      setIsEditing(false);
      // Simulate API call
  };

  const addCondition = () => {
      if (medicalData.newCondition.trim()) {
          const newId = Date.now();
          setMedicalData({
              ...medicalData,
              conditions: [...medicalData.conditions, { id: newId, name: medicalData.newCondition, type: 'Observación' }],
              newCondition: ''
          });
      }
  };

  const removeCondition = (id: number) => {
      setMedicalData({
          ...medicalData,
          conditions: medicalData.conditions.filter(c => c.id !== id)
      });
  };

  return (
    <div className="flex flex-col h-full bg-slate-50 dark:bg-slate-900 transition-colors duration-300 relative">
      
      {/* --- MODAL: EDIT MEDICAL PROFILE --- */}
      {isEditing && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in-up">
              <div className="bg-white dark:bg-slate-800 w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden border border-gray-100 dark:border-slate-700 max-h-[90vh] flex flex-col">
                  <div className="p-4 border-b border-gray-100 dark:border-slate-700 flex justify-between items-center bg-gray-50 dark:bg-slate-700/50">
                      <h3 className="font-bold text-lg text-slate-800 dark:text-white flex items-center gap-2">
                          <span className="material-symbols-outlined text-brand-blue">edit_note</span>
                          Actualizar Datos Médicos
                      </h3>
                      <button onClick={() => setIsEditing(false)} className="p-1 rounded-full hover:bg-gray-200 dark:hover:bg-slate-600">
                          <span className="material-symbols-outlined">close</span>
                      </button>
                  </div>
                  
                  <div className="overflow-y-auto p-6">
                      <form id="medical-form" onSubmit={handleSaveProfile} className="space-y-6">
                          <div className="grid grid-cols-2 gap-4">
                              <div>
                                  <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase mb-1">Tipo de Sangre</label>
                                  <select 
                                      value={medicalData.bloodType}
                                      onChange={e => setMedicalData({...medicalData, bloodType: e.target.value})}
                                      className="w-full p-3 bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-600 rounded-xl outline-none text-slate-800 dark:text-white"
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
                                      value={medicalData.weight}
                                      onChange={e => setMedicalData({...medicalData, weight: Number(e.target.value)})}
                                      className="w-full p-3 bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-600 rounded-xl outline-none text-slate-800 dark:text-white"
                                  />
                              </div>
                          </div>

                          <div>
                              <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase mb-2">Condiciones y Alergias</label>
                              <div className="flex gap-2 mb-3">
                                  <input 
                                      type="text"
                                      value={medicalData.newCondition}
                                      onChange={e => setMedicalData({...medicalData, newCondition: e.target.value})}
                                      placeholder="Añadir condición..."
                                      className="flex-1 p-3 bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-600 rounded-xl outline-none text-slate-800 dark:text-white text-sm"
                                      onKeyDown={(e) => {
                                          if(e.key === 'Enter') {
                                              e.preventDefault();
                                              addCondition();
                                          }
                                      }}
                                  />
                                  <button 
                                      type="button" 
                                      onClick={addCondition}
                                      className="bg-brand-blue text-white p-3 rounded-xl hover:bg-sky-600 transition-colors"
                                  >
                                      <span className="material-symbols-outlined">add</span>
                                  </button>
                              </div>
                              
                              <div className="flex flex-wrap gap-2">
                                  {medicalData.conditions.map(c => (
                                      <span key={c.id} className="flex items-center gap-1 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200 px-3 py-1.5 rounded-lg text-sm border border-slate-200 dark:border-slate-600">
                                          {c.name}
                                          <button 
                                              type="button" 
                                              onClick={() => removeCondition(c.id)}
                                              className="ml-1 text-slate-400 hover:text-red-500 flex items-center"
                                          >
                                              <span className="material-symbols-outlined text-sm">cancel</span>
                                          </button>
                                      </span>
                                  ))}
                              </div>
                          </div>
                      </form>
                  </div>

                  <div className="p-4 border-t border-gray-100 dark:border-slate-700 bg-gray-50 dark:bg-slate-800 flex gap-3">
                      <button onClick={() => setIsEditing(false)} className="flex-1 py-3 text-slate-500 font-bold hover:bg-gray-100 dark:hover:bg-slate-700 rounded-xl">Cancelar</button>
                      <button type="submit" form="medical-form" className="flex-1 py-3 bg-brand-blue text-white font-bold rounded-xl shadow-lg hover:bg-blue-700">Guardar Ficha</button>
                  </div>
              </div>
          </div>
      )}

      {/* --- MODAL: CAMPAIGN DETAILS --- */}
      {viewingCampaign && (
           <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in-up">
              <div className="bg-white dark:bg-slate-800 w-full max-w-md rounded-2xl shadow-2xl overflow-hidden border border-gray-100 dark:border-slate-700 flex flex-col max-h-[90vh]">
                   <div className="relative h-32 bg-purple-600 flex items-center justify-center overflow-hidden">
                        <div className="absolute inset-0 bg-[url('https://picsum.photos/600/300?grayscale')] opacity-20 bg-cover"></div>
                        <div className="relative z-10 text-center text-white px-4">
                            <span className="material-symbols-outlined text-4xl mb-1">campaign</span>
                            <h3 className="font-bold text-lg leading-tight">{viewingCampaign.title}</h3>
                        </div>
                        <button 
                            onClick={() => setViewingCampaign(null)}
                            className="absolute top-2 right-2 bg-black/20 hover:bg-black/40 text-white rounded-full p-1 transition-colors backdrop-blur-sm"
                        >
                            <span className="material-symbols-outlined">close</span>
                        </button>
                   </div>
                   
                   <div className="overflow-y-auto p-6 space-y-5">
                       <div className="flex justify-between items-center text-sm font-bold text-slate-600 dark:text-slate-300 border-b border-gray-100 dark:border-slate-700 pb-3">
                           <div className="flex items-center gap-2">
                               <span className="material-symbols-outlined text-brand-blue">calendar_month</span>
                               {viewingCampaign.date}
                           </div>
                           <div className="flex items-center gap-2">
                               <span className="material-symbols-outlined text-brand-orange">location_on</span>
                               {viewingCampaign.location}
                           </div>
                       </div>

                       <div>
                           <h4 className="text-xs font-bold text-slate-400 uppercase mb-2">Descripción</h4>
                           <p className="text-sm text-slate-800 dark:text-slate-200 leading-relaxed">
                               {viewingCampaign.description}
                           </p>
                       </div>

                       <div>
                           <h4 className="text-xs font-bold text-slate-400 uppercase mb-2">Requisitos</h4>
                           <ul className="space-y-2">
                               {viewingCampaign.requirements.map((req: string, idx: number) => (
                                   <li key={idx} className="flex items-start gap-2 text-sm text-slate-700 dark:text-slate-300">
                                       <span className="material-symbols-outlined text-green-500 text-sm mt-0.5">check_circle</span>
                                       {req}
                                   </li>
                               ))}
                           </ul>
                       </div>

                       <div>
                            <h4 className="text-xs font-bold text-slate-400 uppercase mb-2">Personal Especializado</h4>
                            <div className="flex flex-wrap gap-2">
                                {viewingCampaign.specialists.map((spec: string, idx: number) => (
                                    <span key={idx} className="bg-purple-50 dark:bg-purple-900/20 text-purple-700 dark:text-purple-300 px-2 py-1 rounded text-xs font-bold border border-purple-100 dark:border-purple-800/30">
                                        {spec}
                                    </span>
                                ))}
                            </div>
                       </div>
                   </div>

                   <div className="p-4 bg-gray-50 dark:bg-slate-900 border-t border-gray-100 dark:border-slate-700">
                       <button 
                          className="w-full bg-brand-blue text-white font-bold py-3 rounded-xl shadow-md hover:bg-sky-600 transition-colors flex items-center justify-center gap-2"
                          onClick={() => { alert('¡Te has pre-inscrito exitosamente!'); setViewingCampaign(null); }}
                       >
                           <span className="material-symbols-outlined">how_to_reg</span>
                           Pre-Inscribirme
                       </button>
                   </div>
              </div>
           </div>
      )}

      {/* Header */}
      <div className="bg-white dark:bg-slate-800 px-6 py-6 border-b border-gray-200 dark:border-slate-700">
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-rose-100 dark:bg-rose-900/20 flex items-center justify-center text-rose-600 dark:text-rose-400">
                  <span className="material-symbols-outlined text-3xl">cardiology</span>
              </div>
              <div>
                  <h2 className="text-2xl font-bold text-slate-800 dark:text-white">Salud y Bienestar</h2>
                  <p className="text-sm text-slate-500 dark:text-slate-400">Gestión personal y comunitaria</p>
              </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex p-1 bg-slate-100 dark:bg-slate-700/50 rounded-xl">
          <button
            onClick={() => setActiveTab('personal')}
            className={`flex-1 py-2.5 text-sm font-bold rounded-lg transition-all flex items-center justify-center gap-2 ${
              activeTab === 'personal'
                ? 'bg-white dark:bg-slate-600 text-rose-600 dark:text-white shadow-sm'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'
            }`}
          >
            <span className="material-symbols-outlined text-lg">person</span>
            Mi Ficha Médica
          </button>
          <button
            onClick={() => setActiveTab('community')}
            className={`flex-1 py-2.5 text-sm font-bold rounded-lg transition-all flex items-center justify-center gap-2 ${
              activeTab === 'community'
                ? 'bg-white dark:bg-slate-600 text-rose-600 dark:text-white shadow-sm'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'
            }`}
          >
            <span className="material-symbols-outlined text-lg">groups</span>
            Salud Comunal
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-auto p-4 md:p-6">
        
        {/* PERSONAL TAB */}
        {activeTab === 'personal' && (
          <div className="space-y-6 animate-fade-in-up">
            
            {/* Vitals Card */}
            <section className="bg-gradient-to-br from-rose-500 to-pink-600 rounded-2xl p-6 text-white shadow-lg relative overflow-hidden">
               <div className="absolute top-0 right-0 p-4 opacity-10">
                  <span className="material-symbols-outlined text-9xl -mr-4 -mt-4">medical_services</span>
               </div>
               <div className="flex justify-between items-start relative z-10">
                  <div>
                    <h3 className="text-lg font-bold opacity-90">María González</h3>
                    <p className="text-sm opacity-80">C.I. 12.345.678</p>
                  </div>
                  <button 
                    onClick={() => setIsEditing(true)}
                    className="bg-white/20 hover:bg-white/30 p-2 rounded-lg backdrop-blur-sm transition-colors"
                  >
                    <span className="material-symbols-outlined">edit</span>
                  </button>
               </div>
               
               <div className="grid grid-cols-3 gap-4 mt-6 relative z-10">
                  <div className="bg-white/10 rounded-xl p-3 backdrop-blur-sm">
                    <p className="text-xs font-bold opacity-70 uppercase">Sangre</p>
                    <p className="text-2xl font-bold">{medicalData.bloodType}</p>
                  </div>
                  <div className="bg-white/10 rounded-xl p-3 backdrop-blur-sm">
                    <p className="text-xs font-bold opacity-70 uppercase">Edad</p>
                    <p className="text-2xl font-bold">{medicalData.age} <span className="text-sm font-normal">años</span></p>
                  </div>
                  <div className="bg-white/10 rounded-xl p-3 backdrop-blur-sm">
                    <p className="text-xs font-bold opacity-70 uppercase">Peso</p>
                    <p className="text-2xl font-bold">{medicalData.weight} <span className="text-sm font-normal">kg</span></p>
                  </div>
               </div>
            </section>

            {/* Conditions & Disabilities */}
            <section>
              <h3 className="font-bold text-slate-800 dark:text-white mb-3 flex items-center gap-2">
                <span className="material-symbols-outlined text-rose-500">assignment_late</span>
                Condiciones y Discapacidades
              </h3>
              <div className="bg-white dark:bg-slate-800 rounded-xl border border-gray-100 dark:border-slate-700 shadow-sm p-4">
                 {medicalData.conditions.length > 0 ? (
                   <div className="flex flex-wrap gap-2">
                      {medicalData.conditions.map(cond => (
                        <span key={cond.id} className="bg-rose-50 dark:bg-rose-900/20 text-rose-700 dark:text-rose-300 px-3 py-1.5 rounded-lg text-sm font-medium border border-rose-100 dark:border-rose-900/30 flex items-center gap-2">
                           <span className="w-2 h-2 rounded-full bg-rose-500"></span>
                           {cond.name}
                        </span>
                      ))}
                      <button 
                        onClick={() => setIsEditing(true)}
                        className="border border-dashed border-gray-300 dark:border-slate-600 text-slate-400 dark:text-slate-500 px-3 py-1.5 rounded-lg text-sm flex items-center gap-1 hover:bg-gray-50 dark:hover:bg-slate-700 hover:text-rose-500 transition-colors"
                      >
                        <span className="material-symbols-outlined text-sm">edit</span> Editar
                      </button>
                   </div>
                 ) : (
                   <div className="flex flex-col items-center py-4">
                        <p className="text-slate-500 text-sm mb-2">No hay condiciones registradas.</p>
                        <button 
                            onClick={() => setIsEditing(true)}
                            className="text-brand-blue dark:text-sky-400 text-xs font-bold hover:underline"
                        >
                            Agregar Condición
                        </button>
                   </div>
                 )}
              </div>
            </section>

            {/* Vaccination Control */}
            <section>
               <h3 className="font-bold text-slate-800 dark:text-white mb-3 flex items-center gap-2">
                <span className="material-symbols-outlined text-teal-500">vaccines</span>
                Control de Vacunación
              </h3>
              <div className="bg-white dark:bg-slate-800 rounded-xl border border-gray-100 dark:border-slate-700 shadow-sm overflow-hidden">
                <div className="divide-y divide-gray-50 dark:divide-slate-700">
                  {MOCK_VACCINES.map(vac => (
                    <div key={vac.id} className="p-4 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-slate-700/30 transition-colors">
                      <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${vac.status === 'completed' ? 'bg-teal-100 dark:bg-teal-900/30 text-teal-600 dark:text-teal-400' : 'bg-gray-100 dark:bg-slate-700 text-gray-400'}`}>
                          <span className="material-symbols-outlined text-sm">{vac.status === 'completed' ? 'check' : 'hourglass_empty'}</span>
                        </div>
                        <div>
                          <p className="text-sm font-bold text-slate-800 dark:text-white">{vac.name}</p>
                          <p className="text-xs text-slate-500 dark:text-slate-400">Fecha: {vac.date}</p>
                        </div>
                      </div>
                      <button className="text-gray-400 hover:text-brand-blue dark:hover:text-sky-400">
                        <span className="material-symbols-outlined">more_vert</span>
                      </button>
                    </div>
                  ))}
                </div>
                <div className="p-3 bg-gray-50 dark:bg-slate-800/50 border-t border-gray-100 dark:border-slate-700 text-center">
                   <button 
                        onClick={() => setIsEditing(true)}
                        className="w-full py-2 border border-dashed border-gray-300 dark:border-slate-600 rounded-xl text-slate-500 dark:text-slate-400 text-sm font-medium hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors flex items-center justify-center gap-2"
                    >
                        <span className="material-symbols-outlined text-base">edit_note</span>
                        Actualizar Datos Médicos
                    </button>
                </div>
              </div>
            </section>
          </div>
        )}

        {/* COMMUNITY TAB */}
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