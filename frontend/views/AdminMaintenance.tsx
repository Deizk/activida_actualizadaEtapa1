import React, { useState, useEffect } from 'react';

// MOCK DATA
const SERVICE_STATUS = [
    { id: 'api', name: 'API Gateway', status: 'operational', uptime: '99.98%', latency: '45ms' },
    { id: 'db', name: 'PostgreSQL', status: 'operational', uptime: '99.95%', latency: '12ms' },
    { id: 'storage', name: 'Storage', status: 'degraded', uptime: '98.50%', latency: '850ms' },
    { id: 'auth', name: 'Auth Server', status: 'operational', uptime: '100%', latency: '10ms' },
];

const DB_TABLES = [
    { name: 'users', rows: 12450, size: '45 MB' },
    { name: 'incidents', rows: 5320, size: '28 MB' },
    { name: 'votes', rows: 45200, size: '120 MB' },
    { name: 'logs', rows: 150200, size: '450 MB' },
];

const SECURITY_ALERTS = [
    { id: 1, ip: '192.168.1.45', reason: 'Rate Limit', time: '10:45 AM', status: 'Blocked' },
    { id: 2, ip: '10.0.0.12', reason: 'SQL Inj.', time: '09:20 AM', status: 'Blocked' },
    { id: 3, ip: '172.16.0.5', reason: 'Brute Force', time: '08:15 AM', status: 'Flagged' },
];

interface AdminMaintenanceProps {
    currentView: string;
    isExpanded: boolean;
    onToggleExpand: () => void;
    onClose: () => void;
}

export const AdminMaintenance: React.FC<AdminMaintenanceProps> = ({ currentView, isExpanded, onToggleExpand, onClose }) => {
  const [activeTab, setActiveTab] = useState<'context' | 'logs' | 'system'>('context');
  const [fullTab, setFullTab] = useState<'overview' | 'db' | 'security' | 'deploy'>('overview');
  const [logs, setLogs] = useState<any[]>([]);
  const [simulating, setSimulating] = useState(false);
  const [sqlQuery, setSqlQuery] = useState('SELECT * FROM users LIMIT 10;');

  const [metrics, setMetrics] = useState({
      cpu: 42,
      ram: 65,
      storage: 78,
      temperature: 55,
      requests: 840,
      latency: 45,
      disk_io: 120
  });

  const getContextData = () => {
      switch(currentView) {
          case 'home': return [
              { label: 'Cluster Map Load', value: '12ms' },
              { label: 'Active Incidents', value: '14' },
              { label: 'Map Re-renders', value: '4' }
          ];
          case 'emergency': return [
              { label: 'GPS Precision', value: 'High (5m)' },
              { label: 'Socket Conn', value: 'Stable' },
              { label: 'Dispatcher API', value: 'Ready' }
          ];
          default: return [
              { label: 'View ID', value: currentView },
              { label: 'Auth Token', value: 'Valid' },
              { label: 'Memory Usage', value: '42MB' }
          ];
      }
  };

  useEffect(() => {
      const interval = setInterval(() => {
          if (Math.random() > 0.6) {
              const types = ['INFO', 'DEBUG', 'WARN'];
              const modules = ['Render', 'Net', 'Store', 'Auth'];
              const newLog = {
                  id: Date.now(),
                  type: types[Math.floor(Math.random() * types.length)],
                  timestamp: new Date().toLocaleTimeString().split(' ')[0],
                  module: modules[Math.floor(Math.random() * modules.length)],
                  message: `System trace for ${currentView}`
              };
              setLogs(prev => [newLog, ...prev].slice(0, 50));
          }

          setMetrics(prev => ({
              cpu: Math.min(100, Math.max(5, prev.cpu + (Math.random() * 10 - 5))),
              ram: Math.min(100, Math.max(20, prev.ram + (Math.random() * 4 - 2))),
              storage: 78,
              temperature: Math.min(90, Math.max(40, prev.temperature + (Math.random() * 2 - 1))),
              requests: Math.floor(800 + Math.random() * 200),
              latency: Math.floor(40 + Math.random() * 20),
              disk_io: Math.floor(100 + Math.random() * 50)
          }));

      }, 1500);
      return () => clearInterval(interval);
  }, [currentView]);

  const handleClearCache = () => {
      setSimulating(true);
      setTimeout(() => {
          setSimulating(false);
          alert('Cache purged.');
      }, 1000);
  };

  const MetricBar = ({ label, value, colorClass, detail }: { label: string, value: number, colorClass: string, detail?: string }) => (
      <div className="mb-4">
          <div className="flex justify-between items-end mb-1">
              <span className="text-[10px] font-bold text-slate-500 uppercase">{label}</span>
              <div className="text-right">
                  <span className="text-xs font-mono font-bold text-white">{value.toFixed(1)}%</span>
              </div>
          </div>
          <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden">
              <div className={`h-full rounded-full transition-all duration-500 ${colorClass}`} style={{ width: `${value}%` }}></div>
          </div>
      </div>
  );

  const navItems = [
    { id: 'overview', icon: 'dashboard', label: 'System' },
    { id: 'db', icon: 'database', label: 'DB Studio' },
    { id: 'security', icon: 'security', label: 'Security' },
    { id: 'deploy', icon: 'rocket_launch', label: 'Deploy' },
  ];

  const renderMiniView = () => (
    <>
      <header className="bg-slate-950 px-4 py-3 border-b border-slate-800 flex justify-between items-center shrink-0">
        <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
            <span className="font-bold text-white uppercase tracking-wider text-[10px]">DevTools</span>
        </div>
        <div className="flex items-center gap-1">
            <button onClick={onToggleExpand} className="text-slate-400 hover:text-white p-1 rounded hover:bg-slate-800">
                <span className="material-symbols-outlined text-lg">open_in_full</span>
            </button>
            <button onClick={onClose} className="text-slate-400 hover:text-red-400 p-1 rounded hover:bg-slate-800">
                <span className="material-symbols-outlined text-lg">close</span>
            </button>
        </div>
      </header>

      <div className="flex bg-slate-950 border-b border-slate-800 shrink-0">
          {['context', 'logs', 'system'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab as any)}
                className={`flex-1 py-2 text-center border-b-2 transition-colors uppercase font-bold text-[9px] ${
                  activeTab === tab ? 'border-indigo-500 text-white bg-slate-800' : 'border-transparent text-slate-500'
                }`}
              >
                {tab}
              </button>
          ))}
      </div>

      <div className="flex-1 overflow-auto p-3 custom-scrollbar text-[10px]">
        {activeTab === 'context' && (
            <div className="space-y-3">
                <div className="p-3 bg-slate-800/50 rounded border border-slate-700">
                    <h4 className="text-indigo-400 font-bold mb-2 uppercase text-[9px]">Screen Context</h4>
                    <div className="space-y-1">
                        {getContextData().map((item, idx) => (
                            <div key={idx} className="flex justify-between border-b border-slate-700/50 pb-1 last:border-0">
                                <span className="text-slate-500">{item.label}</span>
                                <span className="text-white font-bold">{item.value}</span>
                            </div>
                        ))}
                    </div>
                </div>
                <button onClick={handleClearCache} className="w-full bg-slate-700 text-white py-2 rounded text-[9px] font-bold uppercase">
                    {simulating ? 'Clearing...' : 'Clear Cache'}
                </button>
            </div>
        )}

        {activeTab === 'logs' && (
            <div className="font-mono leading-tight">
                {logs.map((log) => (
                    <div key={log.id} className="flex gap-2 p-0.5 border-b border-slate-800/50">
                        <span className="text-slate-600">[{log.timestamp}]</span>
                        <span className={`font-bold ${log.type === 'ERROR' ? 'text-red-500' : 'text-blue-400'}`}>{log.type}</span>
                        <span className="text-white truncate">{log.message}</span>
                    </div>
                ))}
            </div>
        )}

        {activeTab === 'system' && (
            <div className="space-y-4">
                <div className="bg-slate-800/30 p-2 rounded">
                    <MetricBar label="CPU" value={metrics.cpu} colorClass="bg-blue-500" />
                    <MetricBar label="RAM" value={metrics.ram} colorClass="bg-purple-500" />
                </div>
            </div>
        )}
      </div>
    </>
  );

  const renderFullView = () => (
      <div className="flex flex-col md:flex-row h-full w-full bg-slate-900 text-white font-mono text-[11px] overflow-hidden">
          
          {/* Sidebar (Desktop) / Top Nav (Mobile) */}
          <div className="w-full md:w-64 border-b md:border-b-0 md:border-r border-slate-800 flex flex-col bg-slate-950 shrink-0">
              <div className="p-4 md:p-6 border-b border-slate-800 flex justify-between items-center md:block">
                  <div>
                      <h2 className="text-sm md:text-xl font-black tracking-tight text-white flex items-center gap-2">
                          <span className="material-symbols-outlined text-indigo-500 text-lg md:text-2xl">terminal</span>
                          ENGINEERING
                      </h2>
                      <p className="text-[9px] text-slate-500 font-mono hidden md:block">Production Node: boi-main-01</p>
                  </div>
                  <button onClick={onToggleExpand} className="md:hidden p-2 text-slate-400 bg-slate-800 rounded-lg">
                      <span className="material-symbols-outlined text-sm">close_fullscreen</span>
                  </button>
              </div>
              
              <nav className="flex md:flex-col overflow-x-auto md:overflow-x-visible p-2 md:p-4 gap-1 scrollbar-hide shrink-0">
                  {navItems.map(item => (
                      <button 
                        key={item.id}
                        onClick={() => setFullTab(item.id as any)}
                        className={`flex items-center gap-2 px-3 py-2 md:px-4 md:py-3 rounded-lg font-bold transition-all whitespace-nowrap md:w-full ${
                            fullTab === item.id 
                            ? 'bg-indigo-600 text-white shadow-lg' 
                            : 'text-slate-500 hover:bg-slate-900'
                        }`}
                      >
                          <span className="material-symbols-outlined text-lg">{item.icon}</span>
                          <span className="text-[10px] md:text-xs uppercase">{item.label}</span>
                      </button>
                  ))}
              </nav>

              <div className="hidden md:block p-4 border-t border-slate-800 mt-auto">
                  <button onClick={onToggleExpand} className="flex items-center justify-center gap-2 text-slate-500 hover:text-white w-full py-2 bg-slate-900 rounded-lg transition-colors">
                      <span className="material-symbols-outlined text-sm">close_fullscreen</span>
                      MINIMIZE
                  </button>
              </div>
          </div>

          {/* Main Area */}
          <div className="flex-1 flex flex-col overflow-hidden bg-slate-900">
              <header className="h-12 border-b border-slate-800 flex items-center justify-between px-4 md:px-8 bg-slate-950/50 backdrop-blur shrink-0">
                  <h3 className="text-[10px] md:text-xs font-bold text-slate-400 uppercase tracking-widest">{fullTab}</h3>
                  <div className="flex items-center gap-2 md:gap-4">
                      <span className="hidden sm:flex items-center gap-1 text-[9px] font-mono text-green-400 bg-green-900/20 px-2 py-0.5 rounded border border-green-900/50">
                          <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span>
                          NOMINAL
                      </span>
                      <button onClick={onClose} className="text-slate-500 hover:text-red-500 transition-colors">
                          <span className="material-symbols-outlined text-lg">close</span>
                      </button>
                  </div>
              </header>

              <main className="flex-1 overflow-auto p-4 md:p-8 custom-scrollbar">
                  
                  {fullTab === 'overview' && (
                      <div className="space-y-6 animate-fade-in-up">
                          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
                                  <MetricBar label="CPU Usage" value={metrics.cpu} colorClass="bg-blue-500" />
                                  <div className="flex justify-between text-[9px] text-slate-500 font-mono">
                                      <span>LOAD: 1.24</span>
                                      <span>3.2GHz</span>
                                  </div>
                              </div>
                              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
                                  <MetricBar label="Memory" value={metrics.ram} colorClass="bg-purple-600" />
                                  <div className="flex justify-between text-[9px] text-slate-500 font-mono">
                                      <span>12.4GB FREE</span>
                                      <span>DDR4</span>
                                  </div>
                              </div>
                              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
                                  <div className="text-[10px] text-slate-500 font-bold uppercase mb-2">Request Latency</div>
                                  <div className="text-2xl font-black text-green-400 font-mono">{metrics.latency}ms</div>
                                  <div className="h-1 bg-slate-800 mt-2 rounded-full overflow-hidden">
                                      <div className="h-full bg-green-500" style={{ width: '40%' }}></div>
                                  </div>
                              </div>
                              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
                                  <div className="text-[10px] text-slate-500 font-bold uppercase mb-2">IO Throughput</div>
                                  <div className="text-2xl font-black text-indigo-400 font-mono">{metrics.disk_io}mb/s</div>
                                  <div className="h-1 bg-slate-800 mt-2 rounded-full overflow-hidden">
                                      <div className="h-full bg-indigo-500" style={{ width: '70%' }}></div>
                                  </div>
                              </div>
                          </div>

                          <div className="bg-slate-950 rounded-xl border border-slate-800 overflow-hidden">
                              <div className="p-3 border-b border-slate-800 bg-slate-900/50 flex justify-between items-center">
                                  <h4 className="text-[10px] font-bold text-slate-500 uppercase">Live Trace Log</h4>
                                  <span className="text-[8px] text-green-500 flex items-center gap-1 animate-pulse">STREAMING</span>
                              </div>
                              <div className="h-64 overflow-y-auto font-mono text-[9px] p-2 bg-black/30">
                                  {logs.map(log => (
                                      <div key={log.id} className="flex border-b border-slate-900/50 py-1 hover:bg-white/5">
                                          <span className="w-16 text-slate-600 shrink-0">{log.timestamp}</span>
                                          <span className={`w-12 font-bold shrink-0 ${log.type === 'ERROR' ? 'text-red-500' : 'text-blue-400'}`}>{log.type}</span>
                                          <span className="text-slate-300">{log.message}</span>
                                      </div>
                                  ))}
                              </div>
                          </div>
                      </div>
                  )}

                  {fullTab === 'db' && (
                      <div className="flex flex-col gap-4 animate-fade-in-up h-full">
                          <div className="bg-slate-950 rounded-xl border border-slate-800 p-4 h-1/2 min-h-[200px] flex flex-col">
                              <div className="flex justify-between items-center mb-3">
                                  <span className="text-[10px] font-bold text-slate-500 uppercase">Query Console</span>
                                  <button className="bg-green-600 text-white px-3 py-1 rounded text-[10px] font-bold">EXECUTE</button>
                              </div>
                              <textarea 
                                value={sqlQuery}
                                onChange={e => setSqlQuery(e.target.value)}
                                className="flex-1 bg-black/50 text-green-400 p-3 rounded border border-slate-800 outline-none font-mono text-xs"
                              />
                          </div>
                          <div className="bg-slate-950 rounded-xl border border-slate-800 overflow-x-auto">
                              <table className="w-full text-left min-w-[500px]">
                                  <thead className="bg-slate-900 text-[9px] text-slate-500 uppercase">
                                      <tr><th className="p-3">Table</th><th className="p-3">Rows</th><th className="p-3">Size</th><th className="p-3 text-right">Status</th></tr>
                                  </thead>
                                  <tbody className="divide-y divide-slate-800 text-[10px]">
                                      {DB_TABLES.map(t => (
                                          <tr key={t.name} className="hover:bg-white/5"><td className="p-3 text-blue-400">{t.name}</td><td className="p-3">{t.rows}</td><td className="p-3 text-slate-500">{t.size}</td><td className="p-3 text-right text-green-500 font-bold">READY</td></tr>
                                      ))}
                                  </tbody>
                              </table>
                          </div>
                      </div>
                  )}

                  {fullTab === 'security' && (
                      <div className="space-y-4 animate-fade-in-up">
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                              <div className="bg-red-900/10 border border-red-500/30 p-4 rounded-xl">
                                  <h4 className="text-red-500 font-bold mb-1">FIREWALL ACTIVE</h4>
                                  <p className="text-[10px] text-slate-400">Blocked 14 suspicious IPs in the last hour.</p>
                              </div>
                              <div className="bg-slate-950 border border-slate-800 p-4 rounded-xl">
                                  <h4 className="text-white font-bold mb-1">SSL/TLS 1.3</h4>
                                  <p className="text-[10px] text-slate-400">Certificates valid until Sep 2024.</p>
                              </div>
                          </div>
                          <div className="bg-slate-950 border border-slate-800 rounded-xl overflow-x-auto">
                              <table className="w-full text-left min-w-[400px]">
                                  <thead className="bg-slate-900 text-[9px] text-slate-500 uppercase">
                                      <tr><th className="p-3">Source IP</th><th className="p-3">Event</th><th className="p-3">Action</th></tr>
                                  </thead>
                                  <tbody className="divide-y divide-slate-800 text-[10px]">
                                      {SECURITY_ALERTS.map(a => (
                                          <tr key={a.id} className="hover:bg-red-500/5"><td className="p-3 font-mono">{a.ip}</td><td className="p-3">{a.reason}</td><td className="p-3 text-red-400 font-bold">{a.status}</td></tr>
                                      ))}
                                  </tbody>
                              </table>
                          </div>
                      </div>
                  )}

                  {fullTab === 'deploy' && (
                      <div className="space-y-6 animate-fade-in-up">
                          <div className="bg-slate-950 p-4 md:p-6 rounded-xl border border-slate-800 flex flex-col md:flex-row justify-between items-center gap-4">
                              <div>
                                  <p className="text-[9px] font-bold text-slate-500 uppercase">Current Environment</p>
                                  <h3 className="text-lg font-black text-white">PROD_CLUSTER_0A</h3>
                              </div>
                              <div className="flex gap-2">
                                  <button className="px-4 py-2 bg-slate-800 hover:bg-slate-700 rounded-lg font-bold transition-colors">ROLLBACK</button>
                                  <button className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 rounded-lg font-bold shadow-lg transition-colors">HOT-FIX</button>
                              </div>
                          </div>
                          <div className="bg-slate-950 p-6 rounded-xl border border-slate-800">
                               <div className="flex items-center gap-4 text-green-500 mb-6">
                                   <span className="material-symbols-outlined text-4xl">cloud_done</span>
                                   <div>
                                       <p className="text-xl font-black">All Systems Online</p>
                                       <p className="text-xs opacity-60">Edge propagation completed (14 nodes).</p>
                                   </div>
                               </div>
                               <div className="space-y-2 opacity-50">
                                   <div className="h-1 bg-indigo-500/20 rounded-full w-full"></div>
                                   <div className="h-1 bg-indigo-500/10 rounded-full w-2/3"></div>
                               </div>
                          </div>
                      </div>
                  )}

              </main>
          </div>
      </div>
  );

  return (
    <div className="flex flex-col h-full bg-slate-900 text-slate-300 transition-all duration-300">
      {isExpanded ? renderFullView() : renderMiniView()}
    </div>
  );
};