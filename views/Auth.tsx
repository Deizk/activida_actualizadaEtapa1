import React, { useState } from 'react';
import { useTheme } from '../ThemeContext';

interface AuthProps {
  onLogin: () => void;
}

export const Auth: React.FC<AuthProps> = ({ onLogin }) => {
  const [view, setView] = useState<'login' | 'register' | 'forgot_password'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { darkMode, toggleDarkMode } = useTheme();
  
  // Biometric Simulation State
  const [isBioScanning, setIsBioScanning] = useState(false);
  const [bioSuccess, setBioSuccess] = useState(false);
  const [isAnimatingView, setIsAnimatingView] = useState(false);
  
  // Password Reset State
  const [resetSent, setResetSent] = useState(false);

  const switchView = (newView: 'login' | 'register' | 'forgot_password') => {
    if (view === newView) return;
    setIsAnimatingView(true);
    setTimeout(() => {
        setView(newView);
        setIsAnimatingView(false);
        // Reset states when switching
        setResetSent(false); 
    }, 300);
  };

  const handleBiometricAuth = () => {
    setIsBioScanning(true);
    // Simulate scanning delay
    setTimeout(() => {
      setIsBioScanning(false);
      setBioSuccess(true);
      // Simulate success delay
      setTimeout(() => {
        onLogin();
      }, 1000);
    }, 2000);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (view === 'forgot_password') {
        setResetSent(true);
        // Return to login after delay
        setTimeout(() => {
            switchView('login');
        }, 2500);
        return;
    }

    onLogin();
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex flex-col items-center justify-center p-6 relative overflow-hidden transition-colors duration-300">
        
        {/* Dark Mode Toggle Micro-Button */}
        <button 
          onClick={toggleDarkMode}
          className="absolute top-6 right-6 p-2 rounded-full bg-white dark:bg-slate-800 shadow-md text-slate-600 dark:text-slate-300 hover:text-brand-blue dark:hover:text-brand-blue transition-all z-50 border border-gray-100 dark:border-slate-700"
          aria-label="Toggle Dark Mode"
        >
          <span className="material-symbols-outlined text-xl leading-none">
            {darkMode ? 'light_mode' : 'dark_mode'}
          </span>
        </button>

        {/* Animated Background Shapes */}
        <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] bg-brand-blue/5 dark:bg-brand-blue/10 rounded-full blur-3xl animate-pulse-slow"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] bg-brand-green/5 dark:bg-brand-green/10 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: '1s' }}></div>
        
        {/* Brand Header */}
        <div className="text-center mb-8 z-10 relative animate-fade-in-down">
            <div className="relative inline-block mb-6 group">
                <div className="absolute inset-0 bg-gradient-to-tr from-brand-blue to-brand-green rounded-[2rem] blur-lg opacity-30 group-hover:opacity-50 transition-opacity duration-500"></div>
                <div className="relative w-28 h-28 bg-white dark:bg-slate-800 rounded-[2rem] shadow-xl flex items-center justify-center text-brand-blue border border-white/60 dark:border-slate-700 backdrop-blur-sm transform transition-transform duration-500 hover:scale-105 hover:-rotate-2">
                    <span className="material-symbols-outlined text-7xl bg-gradient-to-br from-brand-blue to-brand-green bg-clip-text text-transparent">account_balance</span>
                </div>
            </div>
            <h1 className="text-4xl font-extrabold text-slate-800 dark:text-slate-100 tracking-tight leading-tight">
                Comuna <br />
                <span className="text-brand-blue dark:text-sky-400">Banco Obrero</span>
            </h1>
            <div className="flex items-center justify-center gap-3 mt-3">
                <span className="h-px w-8 bg-gradient-to-r from-transparent to-brand-green/40 dark:to-brand-green/60"></span>
                <p className="text-brand-green dark:text-emerald-400 font-bold tracking-[0.2em] text-xs uppercase">Inteligente</p>
                <span className="h-px w-8 bg-gradient-to-l from-transparent to-brand-green/40 dark:to-brand-green/60"></span>
            </div>
        </div>

        {/* Auth Card */}
        <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl w-full max-w-md rounded-[2.5rem] shadow-[0_20px_40px_-15px_rgba(11,95,165,0.1)] dark:shadow-none p-8 z-10 border border-white/60 dark:border-slate-700 relative overflow-hidden animate-fade-in-up transition-colors duration-300">
        
            {/* Biometric Overlay */}
            {isBioScanning && (
                <div className="absolute inset-0 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md z-50 flex flex-col items-center justify-center transition-all duration-300">
                    <div className="relative mb-6">
                        <span className="material-symbols-outlined text-9xl text-slate-200 dark:text-slate-700">fingerprint</span>
                        <div className="absolute inset-0 border-t-4 border-brand-blue rounded-full w-full h-full animate-spin"></div>
                        <div className="absolute top-0 left-0 w-full h-full bg-brand-blue/20 rounded-full animate-ping opacity-20"></div>
                    </div>
                    <p className="text-slate-600 dark:text-slate-300 font-bold animate-pulse tracking-wide">Verificando Identidad...</p>
                </div>
            )}

            {bioSuccess && (
                <div className="absolute inset-0 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md z-50 flex flex-col items-center justify-center animate-fade-in-up">
                    <div className="w-24 h-24 bg-green-50 dark:bg-green-900/20 rounded-full flex items-center justify-center mb-6 text-brand-green dark:text-emerald-400 shadow-inner">
                        <span className="material-symbols-outlined text-6xl">check_circle</span>
                    </div>
                    <h3 className="text-2xl font-bold text-slate-800 dark:text-white mb-1">¡Bienvenido!</h3>
                    <p className="text-slate-500 dark:text-slate-400 font-medium">Acceso autorizado</p>
                </div>
            )}

            {/* Forgot Password Success Overlay */}
            {resetSent && (
                <div className="absolute inset-0 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md z-50 flex flex-col items-center justify-center animate-fade-in-up text-center p-6">
                    <div className="w-20 h-20 bg-blue-50 dark:bg-blue-900/20 rounded-full flex items-center justify-center mb-4 text-brand-blue dark:text-sky-400 shadow-inner">
                        <span className="material-symbols-outlined text-5xl">mark_email_read</span>
                    </div>
                    <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-2">¡Enlace Enviado!</h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400">Hemos enviado las instrucciones de recuperación a <span className="font-bold text-slate-700 dark:text-slate-300">{email}</span></p>
                </div>
            )}

            {/* Tabs (Only visible in Login/Register) */}
            {view !== 'forgot_password' && (
                <div className="flex mb-8 bg-slate-100/80 dark:bg-slate-900/50 p-1.5 rounded-2xl relative">
                    <button 
                        onClick={() => switchView('login')}
                        className={`flex-1 py-3 text-sm font-bold rounded-xl transition-all duration-300 relative z-10 ${view === 'login' ? 'text-brand-blue dark:text-sky-400 shadow-sm bg-white dark:bg-slate-700' : 'text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300'}`}
                    >
                        Ingresar
                    </button>
                    <button 
                        onClick={() => switchView('register')}
                        className={`flex-1 py-3 text-sm font-bold rounded-xl transition-all duration-300 relative z-10 ${view === 'register' ? 'text-brand-blue dark:text-sky-400 shadow-sm bg-white dark:bg-slate-700' : 'text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300'}`}
                    >
                        Registrarse
                    </button>
                </div>
            )}

            {/* View Title for Forgot Password */}
            {view === 'forgot_password' && (
                <div className="mb-6 text-center">
                    <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-300 mb-3">
                        <span className="material-symbols-outlined text-2xl">lock_reset</span>
                    </div>
                    <h2 className="text-xl font-bold text-slate-800 dark:text-white">Recuperar Acceso</h2>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Ingresa tu correo o cédula registrada</p>
                </div>
            )}

            <div className={`transition-all duration-300 transform ${isAnimatingView ? 'opacity-0 translate-x-4' : 'opacity-100 translate-x-0'}`}>
                <form onSubmit={handleSubmit} className="space-y-5">
                    {view === 'register' && (
                        <div>
                            <label className="block text-xs font-extrabold text-slate-400 dark:text-slate-500 mb-1.5 ml-1 uppercase tracking-wider">Nombre Completo</label>
                            <div className="relative group">
                                <span className="material-symbols-outlined absolute left-4 top-3.5 text-slate-300 dark:text-slate-600 group-focus-within:text-brand-blue dark:group-focus-within:text-sky-400 transition-colors text-xl">badge</span>
                                <input 
                                    type="text" 
                                    className="w-full bg-slate-50 dark:bg-slate-900 border-2 border-transparent focus:bg-white dark:focus:bg-slate-800 focus:border-brand-blue/20 dark:focus:border-sky-500/30 rounded-2xl py-3.5 pl-12 pr-4 outline-none transition-all font-medium text-slate-700 dark:text-slate-200 placeholder:text-slate-300 dark:placeholder:text-slate-600"
                                    placeholder="Ej. María González"
                                    required={view === 'register'}
                                />
                            </div>
                        </div>
                    )}
                
                    <div>
                        <label className="block text-xs font-extrabold text-slate-400 dark:text-slate-500 mb-1.5 ml-1 uppercase tracking-wider">Correo / Cédula</label>
                        <div className="relative group">
                            <span className="material-symbols-outlined absolute left-4 top-3.5 text-slate-300 dark:text-slate-600 group-focus-within:text-brand-blue dark:group-focus-within:text-sky-400 transition-colors text-xl">mail</span>
                            <input 
                                type="text" 
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full bg-slate-50 dark:bg-slate-900 border-2 border-transparent focus:bg-white dark:focus:bg-slate-800 focus:border-brand-blue/20 dark:focus:border-sky-500/30 rounded-2xl py-3.5 pl-12 pr-4 outline-none transition-all font-medium text-slate-700 dark:text-slate-200 placeholder:text-slate-300 dark:placeholder:text-slate-600"
                                placeholder="usuario@comuna.ve"
                                required
                            />
                        </div>
                    </div>

                    {/* Hide Password Field in Forgot Password View */}
                    {view !== 'forgot_password' && (
                        <div>
                            <label className="block text-xs font-extrabold text-slate-400 dark:text-slate-500 mb-1.5 ml-1 uppercase tracking-wider">Contraseña</label>
                            <div className="relative group">
                                <span className="material-symbols-outlined absolute left-4 top-3.5 text-slate-300 dark:text-slate-600 group-focus-within:text-brand-blue dark:group-focus-within:text-sky-400 transition-colors text-xl">lock</span>
                                <input 
                                    type="password" 
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full bg-slate-50 dark:bg-slate-900 border-2 border-transparent focus:bg-white dark:focus:bg-slate-800 focus:border-brand-blue/20 dark:focus:border-sky-500/30 rounded-2xl py-3.5 pl-12 pr-4 outline-none transition-all font-medium text-slate-700 dark:text-slate-200 placeholder:text-slate-300 dark:placeholder:text-slate-600"
                                    placeholder="••••••••"
                                    required={view !== 'forgot_password'}
                                />
                            </div>
                            {view === 'login' && (
                                <div className="flex justify-end mt-2">
                                    <button 
                                        type="button"
                                        onClick={() => switchView('forgot_password')}
                                        className="text-xs font-bold text-brand-blue/80 dark:text-sky-400/80 hover:text-brand-blue dark:hover:text-sky-400 transition-colors"
                                    >
                                        ¿Olvidaste tu clave?
                                    </button>
                                </div>
                            )}
                        </div>
                    )}

                    <div className="pt-2">
                        <button type="submit" className="w-full bg-gradient-to-r from-brand-blue to-[#084b85] dark:from-sky-600 dark:to-brand-blue text-white font-bold py-4 rounded-2xl shadow-lg shadow-brand-blue/30 dark:shadow-sky-900/30 active:scale-[0.98] transition-all hover:shadow-brand-blue/40 flex items-center justify-center gap-3 group">
                            <span>
                                {view === 'login' ? 'Iniciar Sesión' : view === 'register' ? 'Crear Cuenta' : 'Enviar Enlace'}
                            </span>
                            <span className="material-symbols-outlined text-xl group-hover:translate-x-1 transition-transform">
                                {view === 'forgot_password' ? 'send' : 'arrow_forward'}
                            </span>
                        </button>
                        
                        {/* Cancel Button for Forgot Password */}
                        {view === 'forgot_password' && (
                            <button 
                                type="button"
                                onClick={() => switchView('login')}
                                className="w-full mt-3 py-3 text-sm font-bold text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition-colors"
                            >
                                Cancelar
                            </button>
                        )}
                    </div>
                </form>

                {/* Biometric Section (Hidden on Desktop 'md:hidden') */}
                {view === 'login' && (
                <div className="mt-8 md:hidden">
                    <div className="relative flex py-2 items-center mb-4">
                        <div className="flex-grow border-t border-slate-100 dark:border-slate-700"></div>
                        <span className="flex-shrink-0 mx-4 text-slate-300 dark:text-slate-600 text-[10px] font-extrabold uppercase tracking-widest">Métodos Alternativos</span>
                        <div className="flex-grow border-t border-slate-100 dark:border-slate-700"></div>
                    </div>

                    <button 
                        onClick={handleBiometricAuth}
                        className="w-full bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 font-bold py-3.5 rounded-2xl border-2 border-slate-100 dark:border-slate-700 transition-all active:scale-[0.98] flex items-center justify-center gap-3 group hover:border-brand-green/30 hover:text-brand-green dark:hover:text-emerald-400"
                    >
                        <span className="material-symbols-outlined text-2xl group-hover:scale-110 transition-transform text-slate-400 dark:text-slate-500 group-hover:text-brand-green dark:group-hover:text-emerald-400">fingerprint</span>
                        <span>Acceso Biométrico</span>
                    </button>
                </div>
                )}
            </div>
        </div>

        <p className="mt-8 text-center text-xs font-medium text-slate-400 dark:text-slate-500 max-w-xs leading-relaxed animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
            Gestión transparente y participativa. <br/>
            Al continuar aceptas nuestros <a href="#" className="text-brand-blue dark:text-sky-400 hover:underline">Términos de Servicio</a>.
        </p>
    </div>
  );
};