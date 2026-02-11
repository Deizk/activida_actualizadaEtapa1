import React, { useState, useEffect } from 'react';
import { MinorProfile } from '../types';

interface EmergencyModeProps {
  linkedMinor?: MinorProfile | null;
}

export const EmergencyMode: React.FC<EmergencyModeProps> = ({ linkedMinor }) => {
  const [sosActive, setSosActive] = useState(false);
  const [countdown, setCountdown] = useState(5);
  const [selectedService, setSelectedService] = useState<string | null>(null);

  useEffect(() => {
    let timer: number;
    if (sosActive && countdown > 0) {
      timer = window.setTimeout(() => setCountdown(c => c - 1), 1000);
    } else if (sosActive && countdown === 0) {
      // Trigger actual alert here
      const serviceName = getServiceName(selectedService);
      const subject = linkedMinor ? `ALERTA MÉDICA: ${linkedMinor.name} (ID: ${linkedMinor.medicalRecordId || 'N/A'})` : 'ALERTA PERSONAL';
      
      alert(`¡${subject} enviada a ${serviceName} y contactos de confianza con ubicación en tiempo real!`);
      setSosActive(false);
      setCountdown(5);
      setSelectedService(null);
    }
    return () => clearTimeout(timer);
  }, [sosActive, countdown, selectedService, linkedMinor]);

  const getServiceName = (id: string | null) => {
    switch(id) {
        case 'police': return 'Policía (Cuadrante 4)';
        case 'fire': return 'Bomberos';
        case 'health': return 'Salud (Ambulancia)';
        case 'civil': return 'Protección Civil';
        default: return 'Servicios de Emergencia';
    }
  }

  const toggleSos = () => {
    if (sosActive) {
        setSosActive(false);
        setCountdown(5);
        return;
    }

    if (!selectedService) {
      // Shake effect or alert could go here
      return; 
    }
    
    setSosActive(true);
    setCountdown(5);
  };

  const handleServiceSelect = (id: string) => {
    if (sosActive) return; // Prevent changing while counting down
    setSelectedService(prev => prev === id ? null : id);
  };

  const EmergencyButton = ({ id, label, icon, colorClass, subText }: { id: string, label: string, icon: string, colorClass: string, subText: string }) => {
    const isSelected = selectedService === id;
    const isDimmed = selectedService !== null && !isSelected;

    return (
        <button 
            onClick={() => handleServiceSelect(id)}
            className={`${colorClass} relative overflow-hidden rounded-3xl p-6 flex flex-col items-center justify-center text-white shadow-xl transition-all duration-300 group h-40 w-full
            ${isSelected ? 'ring-4 ring-white scale-105 z-10 opacity-100 shadow-2xl' : ''}
            ${isDimmed ? 'opacity-30 grayscale-[0.8] scale-95' : 'hover:scale-[1.02]'}
            `}
        >
            {isSelected && (
                <div className="absolute top-3 right-3 bg-white text-slate-900 rounded-full p-1 z-20 shadow-sm animate-fade-in-up">
                    <span className="material-symbols-outlined text-lg font-bold">check</span>
                </div>
            )}
            <div className="absolute top-0 right-0 p-4 opacity-20 group-hover:opacity-30 transition-opacity">
                <span className="material-symbols-outlined text-6xl rotate-12">{icon}</span>
            </div>
            <span className="material-symbols-outlined text-4xl mb-2 relative z-10">{icon}</span>
            <span className="text-xl font-extrabold tracking-tight relative z-10">{label}</span>
            <span className="text-[10px] font-medium opacity-90 uppercase tracking-widest mt-1 relative z-10">{subText}</span>
        </button>
    );
  };

  return (
    <div className="h-full flex flex-col bg-slate-900 text-white relative overflow-hidden">
      {/* Background Pulse Effect */}
      <div className={`absolute inset-0 bg-red-900/10 pointer-events-none transition-opacity duration-500 ${selectedService ? 'opacity-100 animate-pulse-slow' : 'opacity-0'}`}></div>

      <header className="p-6 pb-2 text-center relative z-10">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-500/20 border border-red-500/50 mb-4 animate-bounce">
            <span className="material-symbols-outlined text-3xl text-red-500">e911_emergency</span>
        </div>
        <h2 className="text-3xl font-black text-white tracking-tight uppercase">Modo Emergencia</h2>
        <p className="text-red-200 text-sm mt-1">Selecciona un servicio para activar el SOS</p>
      </header>

      <div className="flex-1 px-6 pb-6 overflow-y-auto">
        
        {/* Linked Minor Profile Banner */}
        {linkedMinor && (
            <div className="mb-6 bg-red-600/20 border border-red-500/50 p-3 rounded-xl flex items-center gap-3 animate-fade-in-up">
                <div className="w-10 h-10 rounded-full bg-white text-red-600 flex items-center justify-center font-bold text-lg shrink-0">
                    {linkedMinor.name.charAt(0)}
                </div>
                <div className="flex-1">
                    <p className="text-[10px] font-bold text-red-300 uppercase tracking-wider">Reportando para:</p>
                    <p className="font-bold text-white text-lg leading-none">{linkedMinor.name}</p>
                    {linkedMinor.conditions.length > 0 && (
                        <p className="text-[10px] text-white/80 mt-1">Condición: {linkedMinor.conditions.join(', ')}</p>
                    )}
                </div>
                <span className="material-symbols-outlined text-red-400 text-2xl">medical_services</span>
            </div>
        )}
        
        {/* SOS Big Button */}
        <div className="mb-8 flex justify-center">
            <button 
                onClick={toggleSos}
                disabled={!selectedService && !sosActive}
                className={`w-48 h-48 rounded-full border-8 flex flex-col items-center justify-center transition-all duration-300 relative ${
                    sosActive 
                    ? 'bg-white border-red-600 animate-pulse shadow-[0_0_80px_rgba(239,68,68,0.8)]' 
                    : selectedService
                        ? 'bg-gradient-to-b from-red-600 to-red-800 border-red-500 shadow-[0_0_50px_rgba(239,68,68,0.5)] cursor-pointer hover:scale-105'
                        : 'bg-slate-800 border-slate-700 opacity-50 cursor-not-allowed grayscale'
                }`}
            >
                {sosActive ? (
                    <>
                        <span className="text-6xl font-black text-red-600">{countdown}</span>
                        <span className="text-xs font-bold text-red-800 uppercase mt-1">Cancelar</span>
                    </>
                ) : (
                    <>
                        <span className={`text-4xl font-black tracking-widest ${selectedService ? 'text-white' : 'text-slate-500'}`}>SOS</span>
                        <span className={`text-[10px] font-medium uppercase mt-1 ${selectedService ? 'text-red-200' : 'text-slate-600'}`}>
                            {selectedService ? 'Enviar Alerta' : 'Selecciona Servicio'}
                        </span>
                        <span className={`material-symbols-outlined text-3xl mt-1 ${selectedService ? 'text-white/50' : 'text-slate-600'}`}>touch_app</span>
                    </>
                )}
                
                {/* Ripples when active */}
                {!sosActive && selectedService && (
                    <>
                        <div className="absolute inset-0 rounded-full border border-red-500 animate-ping opacity-20" style={{ animationDuration: '2s' }}></div>
                    </>
                )}
            </button>
        </div>

        {/* Emergency Services Grid */}
        <div className="grid grid-cols-2 gap-4 max-w-lg mx-auto">
            <EmergencyButton 
                id="police"
                label="Policía" 
                icon="local_police" 
                colorClass="bg-blue-700 border border-blue-500"
                subText="Cuadrante 4"
            />
            <EmergencyButton 
                id="fire"
                label="Bomberos" 
                icon="fire_truck" 
                colorClass="bg-red-700 border border-red-500"
                subText="Rescate"
            />
            <EmergencyButton 
                id="health"
                label="Salud" 
                icon="ambulance" 
                colorClass="bg-white !text-slate-900 border border-gray-300" // Override text color for white button
                subText="Ambulancia"
            />
            <EmergencyButton 
                id="civil"
                label="P. Civil" 
                icon="health_and_safety" 
                colorClass="bg-orange-600 border border-orange-400"
                subText="Desastres"
            />
        </div>

        {/* Feedback Message */}
        <div className="mt-6 text-center h-6">
            {selectedService ? (
                <p className="text-sm font-bold text-red-300 animate-fade-in-up">
                    Servicio seleccionado: <span className="text-white uppercase">{getServiceName(selectedService).split('(')[0]}</span>
                </p>
            ) : (
                <p className="text-xs text-slate-500">Toca un botón arriba para habilitar el SOS</p>
            )}
        </div>

        {/* Emergency Contacts List */}
        <div className="mt-6 bg-slate-800/50 rounded-xl p-4 border border-slate-700">
            <h3 className="text-sm font-bold text-slate-300 mb-3 flex items-center gap-2">
                <span className="material-symbols-outlined text-brand-green">connect_without_contact</span>
                Notificar a Contactos
            </h3>
            <div className="flex -space-x-3 overflow-hidden mb-3 pl-2">
                <div className="inline-block h-10 w-10 rounded-full ring-2 ring-slate-900 bg-gray-200 flex items-center justify-center text-slate-800 font-bold text-xs">Mamá</div>
                <div className="inline-block h-10 w-10 rounded-full ring-2 ring-slate-900 bg-gray-300 flex items-center justify-center text-slate-800 font-bold text-xs">Hijo</div>
                <div className="inline-block h-10 w-10 rounded-full ring-2 ring-slate-900 bg-gray-400 flex items-center justify-center text-slate-800 font-bold text-xs">Jefe</div>
                <button className="inline-block h-10 w-10 rounded-full ring-2 ring-slate-900 bg-slate-700 flex items-center justify-center text-slate-400 hover:bg-slate-600 hover:text-white transition-colors">
                    <span className="material-symbols-outlined text-lg">add</span>
                </button>
            </div>
            <p className="text-xs text-slate-500">
                Se enviará un SMS con tu geolocalización
                {linkedMinor ? ` y la ficha médica de ${linkedMinor.name}` : '.'}
            </p>
        </div>
      </div>
    </div>
  );
};