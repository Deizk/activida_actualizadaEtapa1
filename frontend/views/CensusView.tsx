import React from 'react';
import { MOCK_CENSUS_DATA } from '../constants';
import { UserProfileData, FamilyMember, UserRole, MinorProfile } from '../types';

interface CensusViewProps {
  onViewProfile?: (profile: UserProfileData) => void;
  minors?: MinorProfile[];
}

export const CensusView: React.FC<CensusViewProps> = ({ onViewProfile, minors = [] }) => {
  const data = MOCK_CENSUS_DATA;

  // Merge static census members with dynamic minors
  // Avoid duplicates if mocked names clash (simple check by name)
  const mergedMembers: FamilyMember[] = [...data.members];
  
  minors.forEach(minor => {
      // Check if minor already exists in census (by name match for mock simplicity)
      if (!mergedMembers.some(m => m.name === minor.name)) {
          mergedMembers.push({
              id: minor.id,
              name: minor.name,
              relation: 'Hijo/a', // Assuming minor profile is child
              age: minor.age,
              occupation: 'Estudiante',
              condition: minor.disability ? 'Discapacidad' : minor.conditions.length > 0 ? 'Enfermedad Crónica' : 'Ninguna',
              cedula: minor.cedula
          });
      }
  });

  // Helper to count demographics
  const stats = {
    total: mergedMembers.length,
    minors: mergedMembers.filter(m => m.age < 18).length,
    elderly: mergedMembers.filter(m => m.age >= 60).length,
    vulnerable: mergedMembers.filter(m => m.condition !== 'Ninguna').length
  };

  const handleMemberClick = (member: FamilyMember) => {
    if (onViewProfile) {
        // Construct a mock full profile from partial census data
        const fullProfile: UserProfileData = {
            name: member.name,
            cedula: member.cedula || "V-XX.XXX.XXX",
            age: member.age,
            email: "sin_registro@comuna.ve",
            phone: "0412-XXX-XXXX",
            profession: member.occupation,
            currentTrade: member.occupation,
            skills: ["Vecino/a", "Participación Familiar"],
            bio: `Residente de la comunidad. Parentesco registrado: ${member.relation}.`,
            communityReputation: 50, // Default neutral reputation for family members
            role: UserRole.CITIZEN,
            medicalSummary: { 
                bloodType: "?", 
                allergies: [], 
                chronicConditions: member.condition && member.condition !== 'Ninguna' ? [member.condition] : [], 
                mobilityIssue: member.condition === 'Cama' || member.condition === 'Discapacidad',
                height: 0,
                weight: 0,
                medications: [],
                surgeries: [],
                familyHistory: []
            }
        };
        onViewProfile(fullProfile);
    }
  };

  const ServiceIndicator = ({ label, status, icon }: { label: string, status: boolean | string, icon: string }) => {
     let color = 'bg-gray-200 text-gray-500';
     let iconName = 'help';
     
     if (typeof status === 'boolean') {
         color = status ? 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400' : 'bg-red-100 dark:bg-red-900/30 text-red-500 dark:text-red-400';
         iconName = status ? 'check_circle' : 'cancel';
     } else {
         if (['Tubería', 'Directo', 'Estable'].includes(status)) {
             color = 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400';
             iconName = 'check_circle';
         } else if (['Cisterna', 'Bombona'].includes(status)) {
             color = 'bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400';
             iconName = 'warning';
         } else {
            color = 'bg-red-100 dark:bg-red-900/30 text-red-500 dark:text-red-400';
             iconName = 'error';
         }
     }

     return (
         <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-slate-700/50 rounded-lg">
             <div className="flex items-center gap-3">
                 <span className="material-symbols-outlined text-slate-400 dark:text-slate-500">{icon}</span>
                 <span className="text-sm font-bold text-slate-700 dark:text-slate-200">{label}</span>
             </div>
             <div className={`px-2 py-1 rounded text-xs font-bold flex items-center gap-1 ${color}`}>
                 <span className="material-symbols-outlined text-[10px]">{iconName}</span>
                 {typeof status === 'boolean' ? (status ? 'Si' : 'No') : status}
             </div>
         </div>
     );
  };

  return (
    <div className="flex flex-col h-full bg-slate-50 dark:bg-slate-900 transition-colors duration-300 animate-fade-in-up pb-20 md:pb-6">
      <header className="bg-white dark:bg-slate-800 border-b border-gray-200 dark:border-slate-700 px-6 py-6 sticky top-0 z-10">
        <div className="flex justify-between items-start">
             <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-orange-100 dark:bg-orange-900/20 flex items-center justify-center text-orange-600 dark:text-orange-400">
                    <span className="material-symbols-outlined text-3xl">home</span>
                </div>
                <div>
                    <h2 className="text-2xl font-bold text-slate-800 dark:text-white">Censo Comunal</h2>
                    <p className="text-sm text-slate-500 dark:text-slate-400">Ficha del Hogar: <span className="font-mono font-bold text-slate-700 dark:text-slate-300">{data.familyId}</span></p>
                </div>
             </div>
             <button className="bg-brand-blue hover:bg-sky-600 text-white p-2 rounded-lg shadow-sm transition-colors">
                <span className="material-symbols-outlined">edit</span>
             </button>
        </div>
        
        {/* Address Banner */}
        <div className="mt-4 bg-slate-100 dark:bg-slate-700/50 p-3 rounded-lg flex items-start gap-2 text-sm text-slate-600 dark:text-slate-300">
            <span className="material-symbols-outlined text-slate-400 mt-0.5">location_on</span>
            {data.address}
        </div>
      </header>

      <div className="flex-1 overflow-auto p-4 md:p-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Family Nucleus */}
        <section className="bg-white dark:bg-slate-800 p-5 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-700">
             <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-slate-800 dark:text-white flex items-center gap-2">
                    <span className="material-symbols-outlined text-blue-500">diversity_1</span>
                    Núcleo Familiar
                </h3>
                <span className="bg-blue-100 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 px-2 py-0.5 rounded text-xs font-bold">
                    {stats.total} Integrantes
                </span>
             </div>

             <div className="space-y-3">
                {mergedMembers.map(member => (
                    <div 
                        key={member.id} 
                        onClick={() => handleMemberClick(member)}
                        className="flex items-center gap-3 p-3 border border-gray-100 dark:border-slate-700 rounded-xl hover:bg-gray-50 dark:hover:bg-slate-700/50 transition-colors cursor-pointer group active:scale-[0.98]"
                    >
                        <div className="w-10 h-10 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center text-slate-500 dark:text-slate-400 font-bold group-hover:bg-brand-blue/10 dark:group-hover:bg-sky-500/10 group-hover:text-brand-blue dark:group-hover:text-sky-400 transition-colors">
                            {member.name.charAt(0)}
                        </div>
                        <div className="flex-1">
                            <h4 className="font-bold text-slate-800 dark:text-white text-sm group-hover:text-brand-blue dark:group-hover:text-sky-400 transition-colors">{member.name}</h4>
                            <p className="text-xs text-slate-500 dark:text-slate-400">{member.relation} • {member.age} años • {member.occupation}</p>
                        </div>
                        <div className="flex items-center gap-2">
                            {member.condition !== 'Ninguna' && (
                                <span className="bg-red-100 dark:bg-red-900/20 text-red-600 dark:text-red-400 text-[10px] font-bold px-2 py-1 rounded-full uppercase">
                                    {member.condition}
                                </span>
                            )}
                            <span className="material-symbols-outlined text-slate-300 dark:text-slate-600 text-sm opacity-0 group-hover:opacity-100 transition-opacity">chevron_right</span>
                        </div>
                    </div>
                ))}
             </div>

             {/* Demographics Summary */}
             <div className="grid grid-cols-3 gap-2 mt-4 pt-4 border-t border-gray-100 dark:border-slate-700">
                 <div className="text-center">
                    <p className="text-2xl font-black text-slate-700 dark:text-slate-300">{stats.minors}</p>
                    <p className="text-[10px] font-bold uppercase text-slate-400">Menores</p>
                 </div>
                 <div className="text-center border-l border-gray-100 dark:border-slate-700">
                    <p className="text-2xl font-black text-slate-700 dark:text-slate-300">{stats.elderly}</p>
                    <p className="text-[10px] font-bold uppercase text-slate-400">A. Mayor</p>
                 </div>
                 <div className="text-center border-l border-gray-100 dark:border-slate-700">
                    <p className="text-2xl font-black text-red-500">{stats.vulnerable}</p>
                    <p className="text-[10px] font-bold uppercase text-slate-400">Vulnerables</p>
                 </div>
             </div>
        </section>

        {/* Housing & Needs */}
        <div className="space-y-6">
            
            {/* Housing Conditions */}
            <section className="bg-white dark:bg-slate-800 p-5 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-700">
                <h3 className="font-bold text-slate-800 dark:text-white mb-4 flex items-center gap-2">
                    <span className="material-symbols-outlined text-purple-500">deck</span>
                    Condiciones de Vivienda
                </h3>
                <div className="grid grid-cols-2 gap-3">
                    <div className="p-3 bg-purple-50 dark:bg-purple-900/10 rounded-lg">
                        <p className="text-xs text-purple-600 dark:text-purple-300 font-bold uppercase">Tipo</p>
                        <p className="font-bold text-slate-800 dark:text-white">{data.housing.type}</p>
                    </div>
                    <div className="p-3 bg-purple-50 dark:bg-purple-900/10 rounded-lg">
                        <p className="text-xs text-purple-600 dark:text-purple-300 font-bold uppercase">Tenencia</p>
                        <p className="font-bold text-slate-800 dark:text-white">{data.housing.ownership}</p>
                    </div>
                    <div className="p-3 bg-purple-50 dark:bg-purple-900/10 rounded-lg">
                        <p className="text-xs text-purple-600 dark:text-purple-300 font-bold uppercase">Techo</p>
                        <p className="font-bold text-slate-800 dark:text-white">{data.housing.roof}</p>
                    </div>
                    <div className="p-3 bg-purple-50 dark:bg-purple-900/10 rounded-lg">
                        <p className="text-xs text-purple-600 dark:text-purple-300 font-bold uppercase">Piso</p>
                        <p className="font-bold text-slate-800 dark:text-white">{data.housing.floor}</p>
                    </div>
                </div>
            </section>

            {/* Basic Services Check */}
            <section className="bg-white dark:bg-slate-800 p-5 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-700">
                <h3 className="font-bold text-slate-800 dark:text-white mb-4 flex items-center gap-2">
                    <span className="material-symbols-outlined text-teal-500">water_drop</span>
                    Servicios Básicos y Necesidades
                </h3>
                <div className="space-y-2">
                    <ServiceIndicator label="Agua Potable" status={data.needs.water} icon="water_drop" />
                    <ServiceIndicator label="Gas Doméstico" status={data.needs.gas} icon="propane" />
                    <ServiceIndicator label="Electricidad" status={data.needs.electricity} icon="bolt" />
                    <ServiceIndicator label="Bolsa Alimentación" status={data.needs.foodBag} icon="shopping_bag" />
                </div>
            </section>
        </div>

      </div>
    </div>
  );
};