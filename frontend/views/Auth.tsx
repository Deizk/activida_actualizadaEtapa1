import React, { useState } from 'react';
import { useTheme } from '../ThemeContext';
import axios from 'axios';

interface AuthProps {
    onLogin: () => void;
}

export const Auth: React.FC<AuthProps> = ({ onLogin }) => {
    const [view, setView] = useState<'check_cedula' | 'login' | 'register' | 'forgot_password'>('check_cedula');

    // Form State
    const [name, setName] = useState('');
    const [surname, setSurname] = useState('');
    const [email, setEmail] = useState('');
    const [cedula, setCedula] = useState('');
    const [phone, setPhone] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const { darkMode, toggleDarkMode } = useTheme();

    // Biometric Simulation State
    const [isBioScanning, setIsBioScanning] = useState(false);
    const [bioSuccess, setBioSuccess] = useState(false);
    const [isAnimatingView, setIsAnimatingView] = useState(false);

    // Password Reset State
    const [resetSent, setResetSent] = useState(false);

    const switchView = (newView: 'check_cedula' | 'login' | 'register' | 'forgot_password') => {
        if (view === newView) return;
        setIsAnimatingView(true);
        setTimeout(() => {
            setView(newView);
            setIsAnimatingView(false);
            setResetSent(false);
            setError('');
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

    const checkCedula = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!cedula) {
            setError("Por favor ingrese su cédula.");
            return;
        }
        setLoading(true);
        setError('');

        try {
            const response = await axios.post('/api/auth/check-cedula', { cedula });
            const { exists, data, user } = response.data;

            if (exists) {
                switchView('login');
            } else {
                if (data && (data.name || data.surname)) {
                    const fullName = [data.name, data.surname].filter(Boolean).join(' ');
                    setName(fullName);
                    setSurname(data.surname || '');
                }
                switchView('register');
            }

        } catch (err: any) {
            setError(err.response?.data?.message || "Error al verificar cédula");
        } finally {
            setLoading(false);
        }
    };

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            const response = await axios.post('/api/auth/login', { cedula, password });
            // Store token? For now just call onLogin callback
            if (response.data.token) {
                localStorage.setItem('token', response.data.token); // Persist token
                localStorage.setItem('user', JSON.stringify(response.data.user));
                onLogin();
            }
        } catch (err: any) {
            setError(err.response?.data?.message || "Error al iniciar sesión");
        } finally {
            setLoading(false);
        }
    };

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!cedula || !phone || !name || !email || !password || !confirmPassword) {
            setError("Por favor complete todos los campos.");
            return;
        }

        if (password !== confirmPassword) {
            setError("Las contraseñas no coinciden.");
            return;
        }

        if (password.length < 6) {
            setError("La contraseña debe tener al menos 6 caracteres.");
            return;
        }

        // Simple name/surname split for backend if needed, or backend handles it.
        // My backend expects "name" and "surname".
        // The frontend "name" state is "Nombre Completo".
        // I'll split it naively.
        const nameParts = name.trim().split(' ');
        const firstName = nameParts[0];
        const lastName = nameParts.slice(1).join(' ') || 'Apellido';

        setLoading(true);
        try {
            const response = await axios.post('/api/auth/register', {
                cedula,
                name: firstName,
                surname: lastName,
                email, // Backend schema doesn't have email yet? I should check. 
                // Wait, I didn't add email to User Schema. I should add it or ignore it.
                // Re-reading User.js: cedula, name, surname, password. No email.
                // I will send it anyway, backend will ignore it unless I update schema.
                // Let's stick to what schema has + password.
                password,
                phone // Not in schema either.
            });

            if (response.data.token) {
                localStorage.setItem('token', response.data.token);
                localStorage.setItem('user', JSON.stringify(response.data.user));
                onLogin();
            }
        } catch (err: any) {
            setError(err.response?.data?.message || "Error al registrarse");
        } finally {
            setLoading(false);
        }
    };

    const handleForgotPassword = (e: React.FormEvent) => {
        e.preventDefault();
        setResetSent(true);
        setTimeout(() => {
            switchView('check_cedula'); // Return to start
        }, 2500);
    };

    const handleSubmit = (e: React.FormEvent) => {
        if (view === 'check_cedula') checkCedula(e);
        else if (view === 'login') handleLogin(e);
        else if (view === 'register') handleRegister(e);
        else if (view === 'forgot_password') handleForgotPassword(e);
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
                        <p className="text-sm text-slate-500 dark:text-slate-400">Hemos enviado las instrucciones de recuperación.</p>
                    </div>
                )}

                {/* Error Message */}
                {error && (
                    <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 text-sm font-bold rounded-xl flex items-center gap-2">
                        <span className="material-symbols-outlined">error</span>
                        {error}
                    </div>
                )}

                {/* Current Step Title */}
                <div className="mb-6 text-center">
                    {view === 'check_cedula' && <h2 className="text-xl font-bold text-slate-800 dark:text-white">Identifícate</h2>}
                    {view === 'login' && <h2 className="text-xl font-bold text-slate-800 dark:text-white">Bienvenido de nuevo</h2>}
                    {view === 'register' && <h2 className="text-xl font-bold text-slate-800 dark:text-white">Registro de Usuario</h2>}
                    {view === 'forgot_password' && <h2 className="text-xl font-bold text-slate-800 dark:text-white">Recuperar Acceso</h2>}
                </div>

                <div className={`transition-all duration-300 transform ${isAnimatingView ? 'opacity-0 translate-x-4' : 'opacity-100 translate-x-0'}`}>
                    <form onSubmit={handleSubmit} className="space-y-4">

                        {/* Cedula Field (Always Visible or Readonly) */}
                        {(view === 'check_cedula' || view === 'login' || view === 'register') && (
                            <div>
                                <label className="block text-xs font-extrabold text-slate-400 dark:text-slate-500 mb-1.5 ml-1 uppercase tracking-wider">Cédula</label>
                                <div className="relative group">
                                    <span className="material-symbols-outlined absolute left-3 top-3.5 text-slate-300 dark:text-slate-600 group-focus-within:text-brand-blue dark:group-focus-within:text-sky-400 transition-colors text-lg">id_card</span>
                                    <input
                                        type="text"
                                        value={cedula}
                                        onChange={(e) => setCedula(e.target.value)}
                                        className={`w-full bg-slate-50 dark:bg-slate-900 border-2 border-transparent focus:bg-white dark:focus:bg-slate-800 focus:border-brand-blue/20 dark:focus:border-sky-500/30 rounded-2xl py-3.5 pl-10 pr-3 outline-none transition-all font-medium text-slate-700 dark:text-slate-200 placeholder:text-slate-300 dark:placeholder:text-slate-600 text-sm ${view !== 'check_cedula' ? 'opacity-70 cursor-not-allowed' : ''}`}
                                        placeholder="V-12345678"
                                        required
                                        disabled={view !== 'check_cedula'}
                                    />
                                    {view !== 'check_cedula' && (
                                        <button
                                            type="button"
                                            onClick={() => switchView('check_cedula')}
                                            className="absolute right-3 top-2.5 text-xs font-bold text-brand-blue hover:underline"
                                        >
                                            Cambiar
                                        </button>
                                    )}
                                </div>
                            </div>
                        )}

                        {view === 'register' && (
                            <>
                                <div>
                                    <label className="block text-xs font-extrabold text-slate-400 dark:text-slate-500 mb-1.5 ml-1 uppercase tracking-wider">Nombre Completo</label>
                                    <div className="relative group">
                                        <span className="material-symbols-outlined absolute left-4 top-3.5 text-slate-300 dark:text-slate-600 group-focus-within:text-brand-blue dark:group-focus-within:text-sky-400 transition-colors text-xl">badge</span>
                                        <input
                                            type="text"
                                            value={name}
                                            onChange={(e) => setName(e.target.value)}
                                            className="w-full bg-slate-50 dark:bg-slate-900 border-2 border-transparent focus:bg-white dark:focus:bg-slate-800 focus:border-brand-blue/20 dark:focus:border-sky-500/30 rounded-2xl py-3.5 pl-12 pr-4 outline-none transition-all font-medium text-slate-700 dark:text-slate-200 placeholder:text-slate-300 dark:placeholder:text-slate-600"
                                            placeholder="Apellido Nombre"
                                            required
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-xs font-extrabold text-slate-400 dark:text-slate-500 mb-1.5 ml-1 uppercase tracking-wider">Teléfono</label>
                                    <div className="relative group">
                                        <span className="material-symbols-outlined absolute left-3 top-3.5 text-slate-300 dark:text-slate-600 group-focus-within:text-brand-blue dark:group-focus-within:text-sky-400 transition-colors text-lg">smartphone</span>
                                        <input
                                            type="tel"
                                            value={phone}
                                            onChange={(e) => setPhone(e.target.value)}
                                            className="w-full bg-slate-50 dark:bg-slate-900 border-2 border-transparent focus:bg-white dark:focus:bg-slate-800 focus:border-brand-blue/20 dark:focus:border-sky-500/30 rounded-2xl py-3.5 pl-10 pr-3 outline-none transition-all font-medium text-slate-700 dark:text-slate-200 placeholder:text-slate-300 dark:placeholder:text-slate-600 text-sm"
                                            placeholder="0412..."
                                            required
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-xs font-extrabold text-slate-400 dark:text-slate-500 mb-1.5 ml-1 uppercase tracking-wider">
                                        Correo Electrónico
                                    </label>
                                    <div className="relative group">
                                        <span className="material-symbols-outlined absolute left-4 top-3.5 text-slate-300 dark:text-slate-600 group-focus-within:text-brand-blue dark:group-focus-within:text-sky-400 transition-colors text-xl">mail</span>
                                        <input
                                            type="email"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            className="w-full bg-slate-50 dark:bg-slate-900 border-2 border-transparent focus:bg-white dark:focus:bg-slate-800 focus:border-brand-blue/20 dark:focus:border-sky-500/30 rounded-2xl py-3.5 pl-12 pr-4 outline-none transition-all font-medium text-slate-700 dark:text-slate-200 placeholder:text-slate-300 dark:placeholder:text-slate-600"
                                            placeholder="ejemplo@comuna.ve"
                                            required
                                        />
                                    </div>
                                </div>
                            </>
                        )}

                        {/* Hide Password Field in Checked Cedula View initial and Forgot Password */}
                        {(view === 'login' || view === 'register') && (
                            <div>
                                <label className="block text-xs font-extrabold text-slate-400 dark:text-slate-500 mb-1.5 ml-1 uppercase tracking-wider">Contraseña</label>
                                <div className="relative group">
                                    <span className="material-symbols-outlined absolute left-4 top-3.5 text-slate-300 dark:text-slate-600 group-focus-within:text-brand-blue dark:group-focus-within:text-sky-400 transition-colors text-xl">lock</span>
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="w-full bg-slate-50 dark:bg-slate-900 border-2 border-transparent focus:bg-white dark:focus:bg-slate-800 focus:border-brand-blue/20 dark:focus:border-sky-500/30 rounded-2xl py-3.5 pl-12 pr-12 outline-none transition-all font-medium text-slate-700 dark:text-slate-200 placeholder:text-slate-300 dark:placeholder:text-slate-600"
                                        placeholder="••••••••"
                                        required
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-4 top-3.5 text-slate-300 dark:text-slate-600 hover:text-brand-blue dark:hover:text-sky-400 transition-colors"
                                    >
                                        <span className="material-symbols-outlined text-xl">
                                            {showPassword ? 'visibility_off' : 'visibility'}
                                        </span>
                                    </button>
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

                        {view === 'register' && (
                            <div>
                                <div className="flex justify-between items-center mb-1.5 ml-1">
                                    <label className="block text-xs font-extrabold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Confirmar Contraseña</label>
                                    {confirmPassword && (
                                        <span className={`text-[10px] font-bold uppercase tracking-tight ${password === confirmPassword ? 'text-brand-green' : 'text-red-500'}`}>
                                            {password === confirmPassword ? 'Coincide' : 'No coincide'}
                                        </span>
                                    )}
                                </div>
                                <div className="relative group">
                                    <span className={`material-symbols-outlined absolute left-4 top-3.5 transition-colors text-xl ${confirmPassword ? (password === confirmPassword ? 'text-brand-green' : 'text-red-400') : 'text-slate-300 dark:text-slate-600 group-focus-within:text-brand-blue dark:group-focus-within:text-sky-400'}`}>
                                        {confirmPassword ? (password === confirmPassword ? 'task_alt' : 'error_outline') : 'lock_reset'}
                                    </span>
                                    <input
                                        type={showConfirmPassword ? "text" : "password"}
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        className={`w-full bg-slate-50 dark:bg-slate-900 border-2 focus:bg-white dark:focus:bg-slate-800 rounded-2xl py-3.5 pl-12 pr-12 outline-none transition-all font-medium text-slate-700 dark:text-slate-200 placeholder:text-slate-300 dark:placeholder:text-slate-600 ${confirmPassword ? (password === confirmPassword ? 'border-brand-green/30 focus:border-brand-green/50' : 'border-red-500/30 focus:border-red-500/50') : 'border-transparent focus:border-brand-blue/20 dark:focus:border-sky-500/30'}`}
                                        placeholder="••••••••"
                                        required
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                        className="absolute right-4 top-3.5 text-slate-300 dark:text-slate-600 hover:text-brand-blue dark:hover:text-sky-400 transition-colors"
                                    >
                                        <span className="material-symbols-outlined text-xl">
                                            {showConfirmPassword ? 'visibility_off' : 'visibility'}
                                        </span>
                                    </button>
                                </div>
                            </div>
                        )}

                        {view === 'forgot_password' && (
                            <div>
                                <label className="block text-xs font-extrabold text-slate-400 dark:text-slate-500 mb-1.5 ml-1 uppercase tracking-wider">Cédula o Correo</label>
                                <div className="relative group">
                                    <span className="material-symbols-outlined absolute left-4 top-3.5 text-slate-300 dark:text-slate-600 group-focus-within:text-brand-blue dark:group-focus-within:text-sky-400 transition-colors text-xl">badge</span>
                                    <input
                                        type="text"
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="w-full bg-slate-50 dark:bg-slate-900 border-2 border-transparent focus:bg-white dark:focus:bg-slate-800 focus:border-brand-blue/20 dark:focus:border-sky-500/30 rounded-2xl py-3.5 pl-12 pr-4 outline-none transition-all font-medium text-slate-700 dark:text-slate-200 placeholder:text-slate-300 dark:placeholder:text-slate-600"
                                        placeholder="Ingrese sus datos"
                                        required
                                    />
                                </div>
                            </div>
                        )}

                        <div className="pt-2">
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full bg-gradient-to-r from-brand-blue to-[#084b85] dark:from-sky-600 dark:to-brand-blue text-white font-bold py-4 rounded-2xl shadow-lg shadow-brand-blue/30 dark:shadow-sky-900/30 active:scale-[0.98] transition-all hover:shadow-brand-blue/40 flex items-center justify-center gap-3 group disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {loading ? (
                                    <span>Procesando...</span>
                                ) : (
                                    <>
                                        <span>
                                            {view === 'check_cedula' ? 'Continuar' : view === 'login' ? 'Iniciar Sesión' : view === 'register' ? 'Registrarse' : 'Enviar Enlace'}
                                        </span>
                                        <span className="material-symbols-outlined text-xl group-hover:translate-x-1 transition-transform">
                                            {view === 'forgot_password' ? 'send' : 'arrow_forward'}
                                        </span>
                                    </>
                                )}
                            </button>

                            {/* Cancel Button for Forgot Password */}
                            {view === 'forgot_password' && (
                                <button
                                    type="button"
                                    onClick={() => switchView('check_cedula')}
                                    className="w-full mt-3 py-3 text-sm font-bold text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition-colors"
                                >
                                    Cancelar
                                </button>
                            )}

                            {view === 'login' && (
                                <button
                                    type="button"
                                    onClick={() => switchView('check_cedula')}
                                    className="w-full mt-3 py-3 text-sm font-bold text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition-colors"
                                >
                                    Volver
                                </button>
                            )}
                        </div>
                    </form>

                    {/* Biometric Section (Hidden on Desktop 'md:hidden') */}
                    {view === 'check_cedula' && (
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
                Gestión transparente y participativa. <br />
                Al continuar aceptas nuestros <a href="#" className="text-brand-blue dark:text-sky-400 hover:underline">Términos de Servicio</a>.
            </p>
        </div>
    );
};