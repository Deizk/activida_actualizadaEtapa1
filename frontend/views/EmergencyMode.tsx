import React, { useState, useEffect, useRef } from 'react';
import { MinorProfile } from '../types';

interface EmergencyModeProps {
  linkedMinor?: MinorProfile | null;
}

// Configuration for specific service responses
const SERVICE_RESPONSES: Record<string, { title: string, message: string, color: string, icon: string, instruction: string, phone: string }> = {
    police: {
        title: 'POLICÍA EN CAMINO',
        message: 'Hemos notificado al Cuadrante de Paz más cercano. Su ubicación está siendo rastreada.',
        color: 'bg-blue-700',
        icon: 'local_police',
        instruction: 'Manténgase en un lugar seguro. No confronte a extraños.',
        phone: '911'
    },
    fire: {
        title: 'BOMBEROS ALERTADOS',
        message: 'La central de bomberos ha recibido su señal. Tiempo estimado de respuesta: 8-12 min.',
        color: 'bg-red-700',
        icon: 'fire_truck',
        instruction: 'Aléjese del humo. No use ascensores. Ayude a otros si es seguro.',
        phone: '911'
    },
    health: {
        title: 'AMBULANCIA SOLICITADA',
        message: 'Personal médico de guardia ha sido alertado con su ficha técnica.',
        color: 'bg-slate-50', // Special styling for health
        icon: 'medical_services',
        instruction: 'Despeje el acceso. Tenga a mano documentos de identidad del paciente.',
        phone: '171'
    },
    civil: {
        title: 'PROTECCIÓN CIVIL',
        message: 'Equipo de rescate y gestión de riesgos activado para su sector.',
        color: 'bg-orange-600',
        icon: 'health_and_safety',
        instruction: 'Diríjase al punto de concentración más cercano definido por la comuna.',
        phone: '0800-7248451'
    }
};

export const EmergencyMode: React.FC<EmergencyModeProps> = ({ linkedMinor }) => {
  const [sosActive, setSosActive] = useState(false);
  const [countdown, setCountdown] = useState(5);
  const [selectedService, setSelectedService] = useState<string | null>(null);
  
  // Location Logic
  const [gpsStatus, setGpsStatus] = useState<'idle' | 'searching' | 'locked'>('idle');
  const [coords, setCoords] = useState<{lat: number, lng: number} | null>(null);

  // New State for Active Alert Screen
  const [activeAlert, setActiveAlert] = useState<string | null>(null);

  // --- SWIPE TO CALL LOGIC ---
  const sliderRef = useRef<HTMLDivElement>(null);
  const [dragX, setDragX] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [callTriggered, setCallTriggered] = useState(false);

  useEffect(() => {
    let timer: number;
    if (sosActive) {
        if (countdown > 0) {
            timer = window.setTimeout(() => setCountdown(c => c - 1), 1000);
        } else {
            if (selectedService) {
                setActiveAlert(selectedService);
            }
            setSosActive(false);
            setCountdown(5);
        }
    }
    return () => clearTimeout(timer);
  }, [sosActive, countdown, selectedService]);

  // Simulate GPS Lock during countdown
  useEffect(() => {
      if (sosActive && gpsStatus === 'idle') {
          setGpsStatus('searching');
          const gpsTimer = setTimeout(() => {
              setCoords({
                  lat: 10.4806 + (Math.random() * 0.001), 
                  lng: -66.9036 + (Math.random() * 0.001)
              });
              setGpsStatus('locked');
          }, 2500);
          return () => clearTimeout(gpsTimer);
      }
  }, [sosActive, gpsStatus]);

  const toggleSos = () => {
    if (sosActive) {
        setSosActive(false);
        setCountdown(5);
        setGpsStatus('idle');
        setCoords(null);
        return;
    }
    if (!selectedService) return; 
    setSosActive(true);
    setCountdown(5);
  };

  const handleCloseAlert = () => {
      setActiveAlert(null);
      setSelectedService(null);
      setGpsStatus('idle');
      setCoords(null);
      setDragX(0);
      setCallTriggered(false);
  };

  const handleServiceSelect = (id: string) => {
    if (sosActive) return; 
    setSelectedService(prev => prev === id ? null : id);
  };

  // --- SLIDER EVENT HANDLERS ---
  const handleDragStart = () => {
      if (callTriggered) return;
      setIsDragging(true);
  };

  const handleDragMove = (e: React.MouseEvent | React.TouchEvent) => {
      if (!isDragging || !sliderRef.current || callTriggered) return;

      const sliderWidth = sliderRef.current.clientWidth;
      const handleWidth = 56; 
      const maxDrag = sliderWidth - handleWidth - 8;

      let clientX;
      if ('touches' in e) {
          clientX = e.touches[0].clientX;
      } else {
          clientX = (e as React.MouseEvent).clientX;
      }

      const rect = sliderRef.current.getBoundingClientRect();
      const offsetX = clientX - rect.left - (handleWidth / 2);
      const newX = Math.max(0, Math.min(maxDrag, offsetX));
      setDragX(newX);
  };

  const handleDragEnd = () => {
      if (!isDragging || !sliderRef.current) return;
      setIsDragging(false);

      const sliderWidth = sliderRef.current.clientWidth;
      const handleWidth = 56; 
      const maxDrag = sliderWidth - handleWidth - 8;
      
      if (dragX > maxDrag * 0.85) {
          setCallTriggered(true);
          setDragX(maxDrag);
          if (activeAlert && SERVICE_RESPONSES[activeAlert]) {
              window.location.href = `tel:${SERVICE_RESPONSES[activeAlert].phone}`;
          }
      } else {
          setDragX(0);
      }
  };

  const EmergencyButton = ({ id, label, icon, colorClass, subText }: { id: string, label: string, icon: string, colorClass: string, subText: string }) => {
    const isSelected = selectedService === id;
    const isDimmed = selectedService !== null && !isSelected;

    return (
        <button 
            onClick={() => handleServiceSelect(id)}
            className={`${colorClass} relative overflow-hidden rounded-[2rem] p-5 flex flex-col items-center justify-center text-white shadow-lg transition-all duration-300 group h-36 w-full
            ${isSelected ? 'ring-4 ring-white/50 scale-105 z-10 opacity-100 shadow-2xl' : ''}
            ${isDimmed ? 'opacity-30 grayscale scale-95' : 'hover:scale-[1.02]'}
            `}
        >
            {isSelected && (
                <div className="absolute top-2 right-2 bg-white text-slate-900 rounded-full p-1 z-20 shadow-md">
                    <span className="material-symbols-outlined text-sm font-black">check</span>
                </div>
            )}
            <span className="material-symbols-outlined text-4xl mb-2 relative z-10">{icon}</span>
            <span className="text-lg font-black tracking-tight relative z-10 leading-none">{label}</span>
            <span className="text-[9px] font-black opacity-80 uppercase tracking-widest mt-1 relative z-10">{subText}</span>
        </button>
    );
  };

  // --- RENDER ACTIVE ALERT SCREEN ---
  if (activeAlert && SERVICE_RESPONSES[activeAlert]) {
      const response = SERVICE_RESPONSES[activeAlert];
      const isHealth = activeAlert === 'health';

      return (
          <div className={`fixed inset-0 z-[100] ${response.color} flex flex-col animate-fade-in-up overflow-hidden`}>
              {/* Background Pulse Effect */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div className={`w-[180vw] h-[180vw] rounded-full border-[20px] ${isHealth ? 'border-red-500/5' : 'border-white/5'} animate-ping opacity-20`}></div>
                  <div className={`w-[140vw] h-[140vw] rounded-full border-[10px] ${isHealth ? 'border-red-500/10' : 'border-white/10'} animate-ping opacity-30`} style={{ animationDelay: '0.5s' }}></div>
              </div>

              <div className="flex-1 flex flex-col items-center justify-center p-6 text-center relative z-10">
                  <div className={`w-28 h-28 md:w-32 md:h-32 rounded-full flex items-center justify-center mb-6 shadow-2xl animate-bounce-short ${isHealth ? 'bg-red-600 text-white' : 'bg-white text-slate-900'}`}>
                      <span className="material-symbols-outlined text-6xl md:text-7xl">{response.icon}</span>
                  </div>
                  
                  <h1 className={`text-3xl md:text-4xl font-black mb-3 tracking-tighter uppercase leading-none ${isHealth ? 'text-slate-900' : 'text-white'}`}>
                      {response.title}
                  </h1>
                  
                  <p className={`text-base md:text-lg font-bold mb-8 leading-snug px-4 ${isHealth ? 'text-slate-600' : 'text-white/90'}`}>
                      {response.message}
                  </p>

                  <div className={`w-full max-w-sm rounded-[1.5rem] p-5 mb-8 text-left border ${isHealth ? 'bg-white border-slate-200 shadow-lg' : 'bg-black/20 border-white/20 backdrop-blur-md'}`}>
                      <div className="flex items-center gap-2 mb-2">
                        <span className={`material-symbols-outlined text-lg ${isHealth ? 'text-red-500' : 'text-white'}`}>info</span>
                        <p className={`text-[10px] font-black uppercase tracking-widest ${isHealth ? 'text-slate-400' : 'text-white/60'}`}>Instrucción Vital</p>
                      </div>
                      <p className={`text-sm md:text-base font-black leading-tight ${isHealth ? 'text-slate-800' : 'text-white'}`}>
                          {response.instruction}
                      </p>
                  </div>

                  {coords && (
                      <div className={`flex items-center gap-2 text-xs font-mono font-black py-1.5 px-3 rounded-full ${isHealth ? 'bg-slate-100 text-slate-500' : 'bg-black/20 text-white/70 border border-white/10'}`}>
                          <span className="material-symbols-outlined text-sm">my_location</span>
                          GPS: {coords.lat.toFixed(5)}, {coords.lng.toFixed(5)}
                      </div>
                  )}
                  
                  {linkedMinor && (
                      <div className="mt-4 px-4 py-1.5 rounded-full bg-yellow-400 text-slate-900 text-[10px] font-black uppercase tracking-wider animate-pulse shadow-lg">
                          Incidencia Menor: {linkedMinor.name}
                      </div>
                  )}
              </div>

              {/* FOOTER ACTIONS - Fixed at bottom for safe operation */}
              <div className={`p-6 pb-10 border-t backdrop-blur-md ${isHealth ? 'bg-white/80 border-slate-200' : 'bg-black/40 border-white/10'}`}>
                  
                  {/* SWIPE TO CALL SLIDER */}
                  <div 
                    ref={sliderRef}
                    className={`relative w-full h-16 rounded-full mb-6 overflow-hidden flex items-center shadow-inner transition-colors ${
                        callTriggered 
                        ? 'bg-green-500' 
                        : isHealth ? 'bg-slate-100' : 'bg-white/10'
                    }`}
                    onMouseMove={handleDragMove}
                    onMouseUp={handleDragEnd}
                    onMouseLeave={handleDragEnd}
                    onTouchMove={handleDragMove}
                    onTouchEnd={handleDragEnd}
                  >
                      {/* Background Hint */}
                      <div className={`absolute inset-0 flex items-center justify-center pointer-events-none transition-opacity duration-300 ${isDragging || callTriggered ? 'opacity-0' : 'opacity-100'}`}>
                          <span className={`text-[10px] font-black uppercase tracking-[0.2em] flex items-center gap-2 ${
                              isHealth ? 'text-slate-400' : 'text-white/60'
                          }`}>
                              Desliza para llamar <span className="material-symbols-outlined text-sm animate-pulse">arrow_forward</span>
                          </span>
                      </div>

                      {/* Success Signal */}
                      <div className={`absolute inset-0 flex items-center justify-center pointer-events-none transition-opacity duration-300 ${callTriggered ? 'opacity-100' : 'opacity-0'}`}>
                          <span className="text-white font-black uppercase tracking-widest flex items-center gap-2">
                              <span className="material-symbols-outlined animate-bounce">call</span> Llamando...
                          </span>
                      </div>

                      {/* The Handle */}
                      <div 
                        className={`absolute top-1 left-1 w-14 h-14 bg-white rounded-full shadow-2xl flex items-center justify-center text-green-600 cursor-grab active:cursor-grabbing z-20 ${
                            !isDragging ? 'transition-all duration-300 ease-out' : ''
                        }`}
                        style={{ transform: `translateX(${dragX}px)` }}
                        onMouseDown={handleDragStart}
                        onTouchStart={handleDragStart}
                      >
                          <span className="material-symbols-outlined text-3xl">call</span>
                      </div>
                  </div>

                  <button 
                      onClick={handleCloseAlert}
                      className={`w-full py-3 rounded-2xl font-black text-xs uppercase tracking-widest transition-all ${
                          isHealth 
                          ? 'text-slate-400 hover:bg-slate-50 active:bg-slate-100' 
                          : 'text-white/60 hover:text-white active:bg-white/10'
                      }`}
                  >
                      Anular Alerta / Falsa Alarma
                  </button>
              </div>
          </div>
      );
  }

  return (
    <div className="h-full flex flex-col bg-slate-900 text-white relative overflow-hidden transition-colors duration-500">
      <div className={`absolute inset-0 bg-red-600/10 pointer-events-none transition-opacity duration-1000 ${selectedService ? 'opacity-100' : 'opacity-0'}`}></div>

      <header className="p-8 pb-4 text-center relative z-10 animate-fade-in-down">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-[2rem] bg-red-500/20 border-2 border-red-500/50 mb-4 shadow-[0_0_30px_rgba(239,68,68,0.2)]">
            <span className="material-symbols-outlined text-4xl text-red-500 animate-pulse">e911_emergency</span>
        </div>
        <h2 className="text-3xl font-black text-white tracking-tighter uppercase leading-none">Modo Emergencia</h2>
        <p className="text-red-200/60 text-xs font-bold mt-2 uppercase tracking-widest">Protocolo de Asistencia Comunal</p>
      </header>

      <div className="flex-1 px-6 pb-6 overflow-y-auto custom-scrollbar">
        
        {linkedMinor && (
            <div className="mb-8 bg-red-600/20 border border-red-500/30 p-4 rounded-[1.5rem] flex items-center gap-4 animate-fade-in-up">
                <div className="w-12 h-12 rounded-2xl bg-white text-red-600 flex items-center justify-center font-black text-xl shrink-0 shadow-lg">
                    {linkedMinor.name.charAt(0)}
                </div>
                <div className="flex-1">
                    <p className="text-[10px] font-black text-red-300 uppercase tracking-widest">Alerta para Menor</p>
                    <p className="font-black text-white text-lg leading-tight truncate">{linkedMinor.name}</p>
                </div>
                <span className="material-symbols-outlined text-red-400 text-3xl">child_care</span>
            </div>
        )}
        
        {/* SOS Central Button */}
        <div className="mb-10 flex justify-center">
            <button 
                onClick={toggleSos}
                disabled={!selectedService && !sosActive}
                className={`w-52 h-52 md:w-56 md:h-56 rounded-full border-[10px] flex flex-col items-center justify-center transition-all duration-500 relative overflow-hidden active:scale-95 ${
                    sosActive 
                    ? 'bg-white border-red-600 shadow-[0_0_100px_rgba(239,68,68,0.6)]' 
                    : selectedService
                        ? 'bg-gradient-to-b from-red-600 to-red-800 border-red-500 shadow-[0_0_60px_rgba(239,68,68,0.3)] cursor-pointer hover:shadow-[0_0_80px_rgba(239,68,68,0.5)]'
                        : 'bg-slate-800 border-slate-700 opacity-40 cursor-not-allowed grayscale'
                }`}
            >
                {sosActive ? (
                    <>
                        <span className="text-7xl font-black text-red-600 z-10 tracking-tighter">{countdown}</span>
                        <div className="flex flex-col items-center mt-1 z-10">
                            <span className="text-[10px] font-black text-red-800 uppercase tracking-widest border-2 border-red-100 px-3 py-0.5 rounded-full bg-red-50/50">Cancelar</span>
                        </div>
                        <div className="absolute inset-0 bg-red-100 animate-pulse opacity-10 rounded-full"></div>
                    </>
                ) : (
                    <>
                        <span className={`text-5xl font-black tracking-tighter ${selectedService ? 'text-white' : 'text-slate-500'}`}>SOS</span>
                        <span className={`text-[9px] font-black uppercase mt-1 tracking-widest ${selectedService ? 'text-red-100' : 'text-slate-600'}`}>
                            {selectedService ? 'Mantener Tocado' : 'Elija Servicio'}
                        </span>
                        <span className={`material-symbols-outlined text-3xl mt-2 ${selectedService ? 'text-white/40 animate-bounce' : 'text-slate-700'}`}>
                            {selectedService ? 'fingerprint' : 'touch_app'}
                        </span>
                    </>
                )}
            </button>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-2 gap-4 max-w-md mx-auto">
            <EmergencyButton 
                id="police"
                label="Policía" 
                icon="local_police" 
                colorClass="bg-blue-800/80 border border-blue-600"
                subText="Orden Público"
            />
            <EmergencyButton 
                id="fire"
                label="Bomberos" 
                icon="fire_truck" 
                colorClass="bg-red-800/80 border border-red-600"
                subText="Siniestros"
            />
            <EmergencyButton 
                id="health"
                label="Salud" 
                icon="ambulance" 
                colorClass="bg-white !text-slate-900 border border-slate-200"
                subText="Paramédicos"
            />
            <EmergencyButton 
                id="civil"
                label="Rescate" 
                icon="health_and_safety" 
                colorClass="bg-orange-600/80 border border-orange-500"
                subText="Riesgos"
            />
        </div>

        {/* Status Indicator */}
        <div className="mt-8 text-center h-8 flex items-center justify-center">
            {selectedService ? (
                <div className="flex items-center gap-2 bg-red-500/10 px-4 py-2 rounded-full border border-red-500/20 animate-fade-in-up">
                    <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                    <p className="text-xs font-black text-red-300 uppercase tracking-widest">
                        Destino: <span className="text-white">{selectedService === 'police' ? 'Policía' : selectedService === 'fire' ? 'Bomberos' : selectedService === 'health' ? 'Salud' : 'Protección Civil'}</span>
                    </p>
                </div>
            ) : (
                <p className="text-[10px] font-black text-slate-600 uppercase tracking-[0.2em]">Selección Requerida</p>
            )}
        </div>
      </div>

      {/* Persistent GPS Info */}
      <div className="bg-black/40 backdrop-blur-md p-4 flex justify-between items-center border-t border-white/5">
          <div className="flex items-center gap-2">
              <span className={`material-symbols-outlined text-sm ${gpsStatus === 'locked' ? 'text-green-500' : 'text-yellow-500 animate-spin'}`}>
                  {gpsStatus === 'locked' ? 'location_on' : 'satellite_alt'}
              </span>
              <span className="text-[10px] font-black uppercase tracking-widest text-white/60">
                  {gpsStatus === 'locked' ? 'GPS Enlazado' : 'Buscando Satélite...'}
              </span>
          </div>
          <div className="text-[9px] font-mono text-white/40">
              UAV_NODE_BOI_PROD
          </div>
      </div>
    </div>
  );
};