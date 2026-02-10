import React from 'react';
import { VoteRecord } from '../types';

interface VotingHistoryProps {
  history: VoteRecord[];
}

export const VotingHistory: React.FC<VotingHistoryProps> = ({ history }) => {
  return (
    <div className="p-4 pb-24 md:pb-4 max-w-4xl mx-auto animate-fade-in-up">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-slate-800 dark:text-white mb-2">Historial de Participación</h2>
        <p className="text-slate-500 dark:text-slate-400 text-sm">Registro inmutable de tus decisiones democráticas.</p>
      </div>

      {history.length === 0 ? (
         <div className="flex flex-col items-center justify-center py-12 text-slate-400 bg-white dark:bg-slate-800 rounded-2xl border border-dashed border-gray-200 dark:border-slate-700">
            <span className="material-symbols-outlined text-4xl mb-2 opacity-50">history_edu</span>
            <p>Aún no has participado en ninguna votación.</p>
         </div>
      ) : (
        <div className="space-y-4">
            {history.map((record) => (
                <div key={record.id} className="bg-white dark:bg-slate-800 rounded-xl p-5 border border-gray-100 dark:border-slate-700 shadow-sm flex flex-col md:flex-row gap-4 relative overflow-hidden group">
                    <div className={`absolute left-0 top-0 bottom-0 w-1 ${record.vote === 'for' ? 'bg-brand-green' : 'bg-red-500'}`}></div>
                    
                    <div className="flex-1">
                        <div className="flex justify-between items-start mb-2">
                             <span className="text-[10px] font-bold uppercase text-slate-400 dark:text-slate-500 tracking-wider flex items-center gap-1">
                                {record.timestamp} • {record.category}
                             </span>
                        </div>
                        <h3 className="font-bold text-slate-800 dark:text-white text-lg mb-1">{record.proposalTitle}</h3>
                        <p className="text-xs text-slate-400 dark:text-slate-500 font-mono mb-3">ID: {record.proposalId}</p>
                        
                        <div className="bg-gray-50 dark:bg-slate-900/50 p-3 rounded-lg border border-gray-100 dark:border-slate-700/50">
                            <p className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase mb-1 flex items-center gap-1">
                                <span className="material-symbols-outlined text-sm">format_quote</span>
                                Tu Justificación
                            </p>
                            <p className="text-sm text-slate-700 dark:text-slate-300 italic">"{record.justification}"</p>
                        </div>
                    </div>

                    <div className="flex items-center md:flex-col justify-between md:justify-center md:border-l md:border-gray-100 md:dark:border-slate-700 md:pl-4 min-w-[100px]">
                         <div className={`flex flex-col items-center justify-center px-4 py-2 rounded-lg font-bold ${
                             record.vote === 'for' 
                             ? 'bg-green-50 text-brand-green dark:bg-green-900/20 dark:text-emerald-400' 
                             : 'bg-red-50 text-red-600 dark:bg-red-900/20 dark:text-red-400'
                         }`}>
                             <span className="material-symbols-outlined text-2xl mb-1">
                                {record.vote === 'for' ? 'thumb_up' : 'thumb_down'}
                             </span>
                             <span className="text-xs uppercase">{record.vote === 'for' ? 'A Favor' : 'En Contra'}</span>
                         </div>
                    </div>
                </div>
            ))}
        </div>
      )}
    </div>
  );
};