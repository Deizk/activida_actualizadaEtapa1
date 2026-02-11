
import React, { useState } from 'react';
import { useTheme } from '../ThemeContext';
import { MOCK_USER_PROFILE } from '../constants';

export const Settings: React.FC = () => {
  const { darkMode, toggleDarkMode, fontSize, setFontSize } = useTheme();
  
  // Local state for settings
  const [locationEnabled, setLocationEnabled] = useState(true);
  const [publicProfile, setPublicProfile] = useState(false);
  const [notifications, setNotifications] = useState(true);

  // --- ACCOUNT & SECURITY STATE ---
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
  
  // Modals Management
  const [securityCheckOpen, setSecurityCheckOpen] = useState(false);
  const [pendingAction, setPendingAction] = useState<string | null>(null); // 'email', 'password', '2fa'
  const [activeModal, setActiveModal] = useState<string | null>(null); // 'email', 'password', '2fa_setup'

  // Forms Data
  const [verifyPassword, setVerifyPassword] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [passwordForm, setPasswordForm] = useState({ current: '', new: '', confirm: '' });
  const [twoFactorCode, setTwoFactorCode] = useState('');

  // --- HANDLERS ---

  // 1. Trigger Security Check
  const initiateSensitiveAction = (action: string) => {
      // If toggling 2FA OFF, verify first. If turning ON, go straight to setup.
      if (action === '2fa' && !twoFactorEnabled) {
          setActiveModal('2fa_setup');
          return;
      }
      setPendingAction(action);
      setSecurityCheckOpen(true);
      setVerifyPassword('');
  };

  // 2. Verify Identity
  const handleSecurityVerify = (e: React.FormEvent) => {
      e.preventDefault();
      if (verifyPassword.length > 0) { // Simulate validation
          setSecurityCheckOpen(false);
          
          if (pendingAction === '2fa') {
              setTwoFactorEnabled(false); // Disable 2FA
              alert("Autenticación de dos pasos desactivada.");
          } else if (pendingAction === 'email') {
              setActiveModal('email');
          } else if (pendingAction === 'password') {
              setActiveModal('password');
          }
      } else {
          alert("Contraseña incorrecta");
      }
  };

  // 3. Action Handlers
  const handleEmailChange = (e: React.FormEvent) => {
      e.preventDefault();
      if (newEmail.includes('@')) {
          alert(`Correo de confirmación enviado a ${newEmail}`);
          setActiveModal(null);
          setNewEmail('');
      }
  };

  const handlePasswordChange = (e: React.FormEvent) => {
      e.preventDefault();
      if (passwordForm.new === passwordForm.confirm && passwordForm.new.length >= 6) {
          alert("Contraseña actualizada exitosamente.");
          setActiveModal(null);
          setPasswordForm({ current: '', new: '', confirm: '' });
      } else {
          alert("Las contraseñas no coinciden o son muy cortas.");
      }
  };

  const handle2FASetup = (e: React.FormEvent) => {
      e.preventDefault();
      if (twoFactorCode.length === 6) {
          setTwoFactorEnabled(true);
          setActiveModal(null);
          setTwoFactorCode('');
          alert("2FA Activado correctamente.");
      } else {
          alert("Código inválido.");
      }
  };

  const Toggle = ({ checked, onChange }: { checked: boolean; onChange: () => void }) => (
    <button 
      onClick={onChange}
      className={`w-12 h-6 rounded-full p-1 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-blue dark:focus:ring-offset-slate-800 ${checked ? 'bg-brand-blue' : 'bg-gray-200 dark:bg-slate-700'}`}
    >
      <div className={`w-4 h-4 bg-white rounded-full shadow-sm transform transition-transform duration-300 ${checked ? 'translate-x-6' : 'translate-x-0'}`}></div>
    </button>
  );

  return (
    <div className="p-4 pb-24 md:pb-8 max-w-2xl mx-auto animate-fade-in-up relative">
      
      {/* --- MODALS SECTION --- */}

      {/* 1. Identity Verification Modal */}
      {securityCheckOpen && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in-up">
              <div className="bg-white dark:bg-slate-800 w-full max-w-sm rounded-2xl shadow-2xl border border-gray-100 dark:border-slate-700 p-6">
                  <div className="text-center mb-4">
                      <div className="w-12 h-12 bg-slate-100 dark:bg-slate-700 rounded-full flex items-center justify-center mx-auto mb-2 text-slate-500 dark:text-slate-300">
                          <span className="material-symbols-outlined">lock</span>
                      </div>
                      <h3 className="font-bold text-slate-800 dark:text-white">Validar Identidad</h3>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Por seguridad, confirma tu contraseña actual.</p>
                  </div>
                  <form onSubmit={handleSecurityVerify}>
                      <input 
                          type="password" 
                          value={verifyPassword}
                          onChange={e => setVerifyPassword(e.target.value)}
                          placeholder="Contraseña actual"
                          className="w-full p-3 bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-600 rounded-xl outline-none text-slate-800 dark:text-white mb-4 text-center"
                          autoFocus
                      />
                      <div className="flex gap-2">
                          <button type="button" onClick={() => setSecurityCheckOpen(false)} className="flex-1 py-2 text-slate-500 font-bold hover:bg-gray-100 dark:hover:bg-slate-700 rounded-xl">Cancelar</button>
                          <button type="submit" className="flex-1 py-2 bg-brand-blue text-white font-bold rounded-xl shadow-lg">Confirmar</button>
                      </div>
                  </form>
              </div>
          </div>
      )}

      {/* 2. Change Email Modal */}
      {activeModal === 'email' && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in-up">
              <div className="bg-white dark:bg-slate-800 w-full max-w-sm rounded-2xl shadow-2xl border border-gray-100 dark:border-slate-700 p-6">
                  <h3 className="font-bold text-lg text-slate-800 dark:text-white mb-4">Cambiar Correo</h3>
                  <form onSubmit={handleEmailChange} className="space-y-3">
                      <div>
                          <label className="text-xs font-bold text-slate-500 uppercase">Correo Actual</label>
                          <p className="text-sm font-mono text-slate-800 dark:text-slate-300 bg-gray-100 dark:bg-slate-700 p-2 rounded-lg mt-1">{MOCK_USER_PROFILE.email}</p>
                      </div>
                      <div>
                          <label className="text-xs font-bold text-slate-500 uppercase">Nuevo Correo</label>
                          <input 
                              type="email" 
                              value={newEmail}
                              onChange={e => setNewEmail(e.target.value)}
                              className="w-full p-3 bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-600 rounded-xl outline-none text-slate-800 dark:text-white mt-1"
                              placeholder="nuevo@correo.com"
                              required
                          />
                      </div>
                      <div className="flex gap-2 pt-2">
                          <button type="button" onClick={() => setActiveModal(null)} className="flex-1 py-2 text-slate-500 font-bold hover:bg-gray-100 dark:hover:bg-slate-700 rounded-xl">Cancelar</button>
                          <button type="submit" className="flex-1 py-2 bg-brand-blue text-white font-bold rounded-xl shadow-lg">Actualizar</button>
                      </div>
                  </form>
              </div>
          </div>
      )}

      {/* 3. Change Password Modal */}
      {activeModal === 'password' && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in-up">
              <div className="bg-white dark:bg-slate-800 w-full max-w-sm rounded-2xl shadow-2xl border border-gray-100 dark:border-slate-700 p-6">
                  <h3 className="font-bold text-lg text-slate-800 dark:text-white mb-4">Cambiar Contraseña</h3>
                  <form onSubmit={handlePasswordChange} className="space-y-3">
                      <input 
                          type="password" 
                          placeholder="Nueva Contraseña"
                          value={passwordForm.new}
                          onChange={e => setPasswordForm({...passwordForm, new: e.target.value})}
                          className="w-full p-3 bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-600 rounded-xl outline-none text-slate-800 dark:text-white"
                          required
                      />
                      <input 
                          type="password" 
                          placeholder="Confirmar Nueva Contraseña"
                          value={passwordForm.confirm}
                          onChange={e => setPasswordForm({...passwordForm, confirm: e.target.value})}
                          className="w-full p-3 bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-600 rounded-xl outline-none text-slate-800 dark:text-white"
                          required
                      />
                      <div className="flex gap-2 pt-2">
                          <button type="button" onClick={() => setActiveModal(null)} className="flex-1 py-2 text-slate-500 font-bold hover:bg-gray-100 dark:hover:bg-slate-700 rounded-xl">Cancelar</button>
                          <button type="submit" className="flex-1 py-2 bg-brand-blue text-white font-bold rounded-xl shadow-lg">Guardar</button>
                      </div>
                  </form>
              </div>
          </div>
      )}

      {/* 4. 2FA Setup Modal */}
      {activeModal === '2fa_setup' && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in-up">
              <div className="bg-white dark:bg-slate-800 w-full max-w-sm rounded-2xl shadow-2xl border border-gray-100 dark:border-slate-700 p-6 text-center">
                  <h3 className="font-bold text-lg text-slate-800 dark:text-white mb-2">Configurar 2FA</h3>
                  <p className="text-xs text-slate-500 mb-4">Escanea el código con Google Authenticator</p>
                  
                  <div className="w-40 h-40 bg-white p-2 mx-auto mb-4 border border-gray-200 rounded-xl">
                      {/* Placeholder QR */}
                      <img src="https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=Example2FASecret" alt="QR" className="w-full h-full" />
                  </div>

                  <form onSubmit={handle2FASetup}>
                      <input 
                          type="text" 
                          placeholder="Código de 6 dígitos"
                          value={twoFactorCode}
                          onChange={e => setTwoFactorCode(e.target.value.replace(/\D/g,'').slice(0,6))}
                          className="w-full p-3 bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-600 rounded-xl outline-none text-slate-800 dark:text-white text-center tracking-widest text-xl font-mono mb-4"
                          autoFocus
                      />
                      <div className="flex gap-2">
                          <button type="button" onClick={() => setActiveModal(null)} className="flex-1 py-2 text-slate-500 font-bold hover:bg-gray-100 dark:hover:bg-slate-700 rounded-xl">Cancelar</button>
                          <button type="submit" className="flex-1 py-2 bg-brand-blue text-white font-bold rounded-xl shadow-lg">Verificar</button>
                      </div>
                  </form>
              </div>
          </div>
      )}


      <header className="mb-8">
        <h2 className="text-2xl font-bold text-slate-800 dark:text-white">Configuración</h2>
        <p className="text-slate-500 dark:text-slate-400 text-sm">Gestiona tu cuenta, preferencias y privacidad</p>
      </header>

      {/* --- SECTION: ACCOUNT & SECURITY (NEW) --- */}
      <section className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-700 overflow-hidden mb-6 transition-colors duration-300">
        <div className="p-4 border-b border-gray-50 dark:border-slate-700 bg-gray-50/50 dark:bg-slate-900/30">
          <h3 className="font-bold text-slate-700 dark:text-slate-200 flex items-center gap-2">
            <span className="material-symbols-outlined text-brand-blue dark:text-sky-400">admin_panel_settings</span>
            Cuenta y Seguridad
          </h3>
        </div>
        
        <div className="p-5 space-y-6">
            {/* User Info Card */}
            <div className="flex items-center gap-4 bg-slate-50 dark:bg-slate-700/30 p-3 rounded-xl border border-slate-100 dark:border-slate-700">
                <div className="w-12 h-12 rounded-full bg-brand-blue/10 dark:bg-sky-500/10 flex items-center justify-center text-brand-blue dark:text-sky-400 font-bold text-lg">
                    {MOCK_USER_PROFILE.name.charAt(0)}
                </div>
                <div className="flex-1 overflow-hidden">
                    <p className="font-bold text-slate-800 dark:text-white truncate">{MOCK_USER_PROFILE.name}</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400 truncate">{MOCK_USER_PROFILE.email}</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Change Password */}
                <button 
                    onClick={() => initiateSensitiveAction('password')}
                    className="flex items-center justify-between p-3 border border-gray-200 dark:border-slate-600 rounded-xl hover:bg-gray-50 dark:hover:bg-slate-700/50 transition-colors text-left"
                >
                    <div className="flex items-center gap-3">
                        <span className="material-symbols-outlined text-slate-400">key</span>
                        <div>
                            <p className="text-sm font-bold text-slate-700 dark:text-slate-200">Contraseña</p>
                            <p className="text-[10px] text-slate-500">Último cambio: Hace 3 meses</p>
                        </div>
                    </div>
                    <span className="material-symbols-outlined text-slate-400 text-sm">edit</span>
                </button>

                {/* Change Email */}
                <button 
                    onClick={() => initiateSensitiveAction('email')}
                    className="flex items-center justify-between p-3 border border-gray-200 dark:border-slate-600 rounded-xl hover:bg-gray-50 dark:hover:bg-slate-700/50 transition-colors text-left"
                >
                    <div className="flex items-center gap-3">
                        <span className="material-symbols-outlined text-slate-400">mail</span>
                        <div>
                            <p className="text-sm font-bold text-slate-700 dark:text-slate-200">Correo</p>
                            <p className="text-[10px] text-slate-500">Actualizar dirección vinculada</p>
                        </div>
                    </div>
                    <span className="material-symbols-outlined text-slate-400 text-sm">edit</span>
                </button>
            </div>

            {/* 2FA Toggle */}
            <div className="flex items-center justify-between pt-2 border-t border-gray-100 dark:border-slate-700/50">
                <div className="flex gap-3 items-center">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${twoFactorEnabled ? 'bg-green-100 text-green-600 dark:bg-green-900/20 dark:text-green-400' : 'bg-slate-100 text-slate-400 dark:bg-slate-700'}`}>
                        <span className="material-symbols-outlined">phonelink_lock</span>
                    </div>
                    <div>
                        <p className="font-bold text-slate-800 dark:text-slate-100 text-sm">Autenticación en 2 Pasos</p>
                        <p className="text-xs text-slate-500 dark:text-slate-400">Mayor seguridad al iniciar sesión</p>
                    </div>
                </div>
                <Toggle checked={twoFactorEnabled} onChange={() => initiateSensitiveAction('2fa')} />
            </div>
        </div>
      </section>

      {/* Apariencia */}
      <section className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-700 overflow-hidden mb-6 transition-colors duration-300">
        <div className="p-4 border-b border-gray-50 dark:border-slate-700 bg-gray-50/50 dark:bg-slate-900/30 flex justify-between items-center">
          <h3 className="font-bold text-slate-700 dark:text-slate-200 flex items-center gap-2">
            <span className="material-symbols-outlined text-purple-500">palette</span>
            Apariencia
          </h3>
        </div>
        
        <div className="p-5 space-y-6">
            <div className="flex items-center justify-between">
                <div className="flex gap-3 items-center">
                    <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-700 flex items-center justify-center text-slate-500 dark:text-slate-300">
                        <span className="material-symbols-outlined">dark_mode</span>
                    </div>
                    <div>
                        <p className="font-bold text-slate-800 dark:text-slate-100 text-sm">Modo Oscuro</p>
                        <p className="text-xs text-slate-500 dark:text-slate-400">Interfaz con colores oscuros</p>
                    </div>
                </div>
                <Toggle checked={darkMode} onChange={toggleDarkMode} />
            </div>

            <div className="flex items-center justify-between">
                <div className="flex gap-3 items-center">
                    <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-700 flex items-center justify-center text-slate-500 dark:text-slate-300">
                         <span className="material-symbols-outlined">text_fields</span>
                    </div>
                    <div>
                        <p className="font-bold text-slate-800 dark:text-slate-100 text-sm">Tamaño de Texto</p>
                        <p className="text-xs text-slate-500 dark:text-slate-400">Ajustar legibilidad</p>
                    </div>
                </div>
                <div className="flex bg-gray-100 dark:bg-slate-700 rounded-lg p-1">
                    <button 
                        onClick={() => setFontSize('normal')}
                        className={`px-3 py-1 text-xs font-bold rounded-md transition-all ${fontSize === 'normal' ? 'bg-white dark:bg-slate-600 shadow-sm text-slate-800 dark:text-white' : 'text-slate-400 dark:text-slate-400 hover:text-slate-600 dark:hover:text-slate-300'}`}
                    >
                        Aa
                    </button>
                    <button 
                        onClick={() => setFontSize('large')}
                        className={`px-3 py-1 text-sm font-bold rounded-md transition-all ${fontSize === 'large' ? 'bg-white dark:bg-slate-600 shadow-sm text-slate-800 dark:text-white' : 'text-slate-400 dark:text-slate-400 hover:text-slate-600 dark:hover:text-slate-300'}`}
                    >
                        Aa
                    </button>
                </div>
            </div>
        </div>
      </section>

      {/* Privacidad y Seguridad (Existing settings renamed/kept for location/public profile) */}
      <section className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-700 overflow-hidden mb-6 transition-colors duration-300">
        <div className="p-4 border-b border-gray-50 dark:border-slate-700 bg-gray-50/50 dark:bg-slate-900/30">
          <h3 className="font-bold text-slate-700 dark:text-slate-200 flex items-center gap-2">
            <span className="material-symbols-outlined text-brand-green dark:text-emerald-400">security</span>
            Privacidad de Datos
          </h3>
        </div>
        
        <div className="p-5 space-y-6">
            <div className="flex items-center justify-between">
                <div className="flex gap-3 items-center">
                    <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-700 flex items-center justify-center text-slate-500 dark:text-slate-300">
                         <span className="material-symbols-outlined">location_on</span>
                    </div>
                    <div>
                        <p className="font-bold text-slate-800 dark:text-slate-100 text-sm">Ubicación Anónima</p>
                        <p className="text-xs text-slate-500 dark:text-slate-400 max-w-[200px]">Permitir uso de datos para mapas de calor comunales</p>
                    </div>
                </div>
                <Toggle checked={locationEnabled} onChange={() => setLocationEnabled(!locationEnabled)} />
            </div>
            
            <div className="flex items-center justify-between">
                <div className="flex gap-3 items-center">
                    <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-700 flex items-center justify-center text-slate-500 dark:text-slate-300">
                         <span className="material-symbols-outlined">visibility</span>
                    </div>
                    <div>
                        <p className="font-bold text-slate-800 dark:text-slate-100 text-sm">Perfil Público</p>
                        <p className="text-xs text-slate-500 dark:text-slate-400">Visible en el Marketplace</p>
                    </div>
                </div>
                <Toggle checked={publicProfile} onChange={() => setPublicProfile(!publicProfile)} />
            </div>
        </div>
      </section>

      {/* Notificaciones */}
      <section className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-700 overflow-hidden mb-6 transition-colors duration-300">
        <div className="p-4 border-b border-gray-50 dark:border-slate-700 bg-gray-50/50 dark:bg-slate-900/30">
          <h3 className="font-bold text-slate-700 dark:text-slate-200 flex items-center gap-2">
            <span className="material-symbols-outlined text-brand-orange">notifications</span>
            Notificaciones
          </h3>
        </div>
        <div className="p-5">
             <div className="flex items-center justify-between">
                <div className="flex gap-3 items-center">
                    <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-700 flex items-center justify-center text-slate-500 dark:text-slate-300">
                         <span className="material-symbols-outlined">campaign</span>
                    </div>
                    <div>
                        <p className="font-bold text-slate-800 dark:text-slate-100 text-sm">Alertas Comunales</p>
                        <p className="text-xs text-slate-500 dark:text-slate-400">Novedades y emergencias</p>
                    </div>
                </div>
                <Toggle checked={notifications} onChange={() => setNotifications(!notifications)} />
            </div>
        </div>
      </section>

      {/* Legal */}
       <section className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-700 overflow-hidden transition-colors duration-300">
        <div className="p-4 border-b border-gray-50 dark:border-slate-700 bg-gray-50/50 dark:bg-slate-900/30">
          <h3 className="font-bold text-slate-700 dark:text-slate-200 flex items-center gap-2">
            <span className="material-symbols-outlined text-slate-500 dark:text-slate-400">gavel</span>
            Legal
          </h3>
        </div>
        
        <div className="divide-y divide-gray-50 dark:divide-slate-700">
            <button className="w-full p-4 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors text-left group">
                <span className="text-sm font-medium text-slate-700 dark:text-slate-300 group-hover:text-brand-blue dark:group-hover:text-sky-400 transition-colors">Políticas de Privacidad</span>
                <span className="material-symbols-outlined text-slate-300 dark:text-slate-600 group-hover:text-brand-blue dark:group-hover:text-sky-400">chevron_right</span>
            </button>
             <button className="w-full p-4 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors text-left group">
                <span className="text-sm font-medium text-slate-700 dark:text-slate-300 group-hover:text-brand-blue dark:group-hover:text-sky-400 transition-colors">Términos de Servicio</span>
                <span className="material-symbols-outlined text-slate-300 dark:text-slate-600 group-hover:text-brand-blue dark:group-hover:text-sky-400">chevron_right</span>
            </button>
            <button className="w-full p-4 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors text-left group">
                <span className="text-sm font-medium text-slate-700 dark:text-slate-300 group-hover:text-brand-blue dark:group-hover:text-sky-400 transition-colors">Licencias de Código Abierto</span>
                <span className="material-symbols-outlined text-slate-300 dark:text-slate-600 group-hover:text-brand-blue dark:group-hover:text-sky-400">chevron_right</span>
            </button>
            <div className="p-6 text-center">
                <div className="flex items-center justify-center gap-2 mb-2">
                    <span className="material-symbols-outlined text-slate-300 dark:text-slate-600">code</span>
                    <span className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">Comuna Inteligente</span>
                </div>
                <p className="text-[10px] text-slate-400 dark:text-slate-600">Versión Beta 1.0.0</p>
            </div>
        </div>
      </section>
    </div>
  );
};
