import React, { useState } from 'react';
import { MOCK_VOLUNTEER_TASKS } from '../constants';
import { UserProfileData } from '../types';

interface VolunteerTasksProps {
    onViewProfile?: (profile: UserProfileData) => void;
}

export const VolunteerTasks: React.FC<VolunteerTasksProps> = ({ onViewProfile }) => {
  const [tasks, setTasks] = useState(MOCK_VOLUNTEER_TASKS);
  const [joinedTasks, setJoinedTasks] = useState<string[]>([]);

  const handleJoin = (id: string) => {
    if (joinedTasks.includes(id)) return;

    setTasks(prev => prev.map(t => {
      if (t.id === id && t.participants < t.maxParticipants) {
        return { ...t, participants: t.participants + 1 };
      }
      return t;
    }));
    setJoinedTasks(prev => [...prev, id]);
  };

  const handleLeaderClick = (leader: any) => {
      if (onViewProfile) {
          // Construct a mock full profile from partial leader data
          const fullProfile: UserProfileData = {
              name: leader.name,
              cedula: "V-XX.XXX.XXX", // Hidden
              age: 0,
              email: "contacto@comuna.ve",
              phone: "0412-XXX-XXXX",
              profession: leader.role,
              currentTrade: "Voluntario",
              skills: ["Liderazgo", "Organización", "Trabajo en Equipo"],
              bio: `Líder comunitario activo en ${leader.role}. Coordinando actividades de voluntariado para el bienestar de todos.`,
              communityReputation: leader.reputation,
              medicalSummary: { bloodType: "?", allergies: [], chronicConditions: [], mobilityIssue: false }
          };
          onViewProfile(fullProfile);
      }
  };

  const getTaskIcon = (type: string) => {
    switch(type) {
      case 'limpieza': return 'cleaning_services';
      case 'pintura': return 'format_paint';
      case 'infraestructura': return 'handyman';
      case 'educacion': return 'school';
      default: return 'volunteer_activism';
    }
  };

  const getTypeColor = (type: string) => {
    switch(type) {
      case 'limpieza': return 'text-green-600 bg-green-100 dark:bg-green-900/30 dark:text-green-400';
      case 'pintura': return 'text-purple-600 bg-purple-100 dark:bg-purple-900/30 dark:text-purple-400';
      case 'infraestructura': return 'text-orange-600 bg-orange-100 dark:bg-orange-900/30 dark:text-orange-400';
      default: return 'text-blue-600 bg-blue-100 dark:bg-blue-900/30 dark:text-blue-400';
    }
  };

  return (
    <div className="flex flex-col h-full bg-slate-50 dark:bg-slate-900 transition-colors duration-300 animate-fade-in-up">
      <header className="bg-white dark:bg-slate-800 border-b border-gray-200 dark:border-slate-700 px-6 py-6 sticky top-0 z-10">
        <div className="flex items-center gap-3">
             <div className="w-12 h-12 rounded-xl bg-orange-100 dark:bg-orange-900/20 flex items-center justify-center text-orange-600 dark:text-orange-400">
                <span className="material-symbols-outlined text-3xl">volunteer_activism</span>
             </div>
             <div>
                <h2 className="text-2xl font-bold text-slate-800 dark:text-white">Voluntariado</h2>
                <p className="text-sm text-slate-500 dark:text-slate-400">Manos a la obra por nuestra comunidad</p>
             </div>
        </div>
      </header>

      <div className="flex-1 overflow-auto p-4 md:p-6 space-y-6">
        {tasks.map((task) => {
          const isFull = task.participants >= task.maxParticipants;
          const isJoined = joinedTasks.includes(task.id);
          const progress = (task.participants / task.maxParticipants) * 100;

          return (
            <div key={task.id} className="bg-white dark:bg-slate-800 rounded-2xl overflow-hidden shadow-sm border border-gray-100 dark:border-slate-700 flex flex-col md:flex-row group transition-all hover:shadow-md">
              {/* Image Section */}
              <div className="h-40 md:h-auto md:w-48 bg-gray-200 dark:bg-slate-700 relative overflow-hidden">
                <img src={task.image} alt={task.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                <div className="absolute top-3 left-3">
                   <span className={`px-2 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider flex items-center gap-1 shadow-sm ${getTypeColor(task.type)}`}>
                      <span className="material-symbols-outlined text-sm">{getTaskIcon(task.type)}</span>
                      {task.type}
                   </span>
                </div>
              </div>

              {/* Content Section */}
              <div className="p-5 flex-1 flex flex-col">
                <div className="flex justify-between items-start mb-2">
                   <h3 className="text-lg font-bold text-slate-800 dark:text-white leading-tight">{task.title}</h3>
                   {isJoined && (
                     <span className="shrink-0 bg-green-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                        <span className="material-symbols-outlined text-sm">check</span>
                        INSCRITO
                     </span>
                   )}
                </div>
                
                <p className="text-sm text-slate-500 dark:text-slate-400 mb-4 flex-1">{task.description}</p>
                
                {/* LEADER PROFILE MINI-CARD (CLICKABLE) */}
                <div 
                    onClick={() => handleLeaderClick(task.leader)}
                    className="mb-4 bg-gray-50 dark:bg-slate-700/50 p-3 rounded-xl border border-gray-100 dark:border-slate-600/50 flex items-center gap-3 cursor-pointer hover:bg-gray-100 dark:hover:bg-slate-600 transition-colors group/leader"
                >
                    <div className="w-10 h-10 rounded-full bg-brand-blue/10 dark:bg-sky-500/10 border border-brand-blue/20 dark:border-sky-500/20 flex items-center justify-center text-brand-blue dark:text-sky-400 font-bold text-xs group-hover/leader:scale-110 transition-transform">
                        {task.leader.avatar}
                    </div>
                    <div className="flex-1">
                        <p className="text-[10px] uppercase font-bold text-slate-400 dark:text-slate-500">Líder de Actividad</p>
                        <p className="text-sm font-bold text-slate-800 dark:text-white leading-tight group-hover/leader:text-brand-blue dark:group-hover/leader:text-sky-400 transition-colors">{task.leader.name}</p>
                        <p className="text-[10px] text-slate-500 dark:text-slate-400">{task.leader.role}</p>
                    </div>
                    <div className="text-right flex flex-col items-end gap-1">
                         <div className="flex items-center gap-1 bg-white dark:bg-slate-600 px-2 py-0.5 rounded-lg shadow-sm">
                            <span className="material-symbols-outlined text-brand-blue dark:text-sky-400 text-sm">verified</span>
                            <span className="text-xs font-bold text-slate-700 dark:text-slate-200">{task.leader.reputation}%</span>
                         </div>
                         <span className="text-[10px] text-brand-blue dark:text-sky-400 font-bold opacity-0 group-hover/leader:opacity-100 transition-opacity">Ver Perfil</span>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-y-2 gap-x-4 text-xs font-medium text-slate-600 dark:text-slate-300 mb-4">
                   <div className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-brand-blue dark:text-sky-400 text-lg">calendar_month</span>
                      {task.date}
                   </div>
                   <div className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-brand-blue dark:text-sky-400 text-lg">schedule</span>
                      {task.time}
                   </div>
                   <div className="flex items-center gap-2 col-span-2">
                      <span className="material-symbols-outlined text-brand-orange text-lg">location_on</span>
                      {task.location}
                   </div>
                </div>

                {/* Footer / Action */}
                <div className="mt-auto pt-4 border-t border-gray-100 dark:border-slate-700 flex items-center justify-between gap-4">
                    <div className="flex-1">
                        <div className="flex justify-between text-[10px] font-bold uppercase text-slate-400 mb-1">
                            <span>Participantes</span>
                            <span>{task.participants}/{task.maxParticipants}</span>
                        </div>
                        <div className="h-2 bg-gray-100 dark:bg-slate-700 rounded-full overflow-hidden">
                            <div 
                                className={`h-full rounded-full transition-all duration-500 ${isFull ? 'bg-red-500' : 'bg-brand-green'}`} 
                                style={{ width: `${progress}%` }}
                            ></div>
                        </div>
                    </div>

                    <button 
                        onClick={() => handleJoin(task.id)}
                        disabled={isFull || isJoined}
                        className={`px-6 py-2 rounded-xl font-bold text-sm shadow-lg transition-all active:scale-95 flex items-center gap-2 ${
                            isJoined 
                            ? 'bg-gray-100 dark:bg-slate-700 text-slate-400 cursor-default shadow-none'
                            : isFull 
                                ? 'bg-red-50 dark:bg-red-900/20 text-red-400 cursor-not-allowed shadow-none'
                                : 'bg-brand-blue hover:bg-sky-600 text-white shadow-brand-blue/30'
                        }`}
                    >
                        {isJoined ? 'Registrado' : isFull ? 'Cupos Llenos' : 'Unirme'}
                    </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};