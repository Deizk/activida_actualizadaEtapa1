import React, { useState } from 'react';
import { Proposal, ProposalCategory } from '../types';

interface VotingProps {
  proposals: Proposal[];
  userVotes: Record<string, 'for' | 'against'>;
  onVoteSubmit: (proposal: Proposal, vote: 'for' | 'against', justification: string) => void;
}

export const Voting: React.FC<VotingProps> = ({ proposals, userVotes, onVoteSubmit }) => {
  const [filter, setFilter] = useState<ProposalCategory | 'all'>('all');
  
  const [selectedProposal, setSelectedProposal] = useState<Proposal | null>(null);
  const [voteType, setVoteType] = useState<'for' | 'against' | null>(null);
  const [justification, setJustification] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const activeProposals = proposals.filter(
    p => p.status === 'active' && (filter === 'all' || p.category === filter)
  );

  const handleOpenVote = (proposal: Proposal, type: 'for' | 'against') => {
    setSelectedProposal(proposal);
    setVoteType(type);
    setJustification('');
  };

  const handleConfirmVote = () => {
    if (selectedProposal && voteType && justification.length > 5) {
      setIsSubmitting(true);
      
      setTimeout(() => {
        // Trigger parent handler
        onVoteSubmit(selectedProposal, voteType, justification);

        // Reset UI states
        setIsSubmitting(false);
        setSelectedProposal(null);
        setVoteType(null);
        setJustification('');
      }, 1000);
    }
  };

  const getCategoryIcon = (cat: string) => {
    switch(cat) {
      case 'infraestructura': return 'construction';
      case 'salud': return 'medical_services';
      case 'reforma': return 'gavel';
      case 'recursos': return 'payments';
      default: return 'how_to_vote';
    }
  };

  const getCategoryLabel = (cat: string) => {
    switch(cat) {
      case 'infraestructura': return 'Infraestructura';
      case 'salud': return 'Salud';
      case 'reforma': return 'Reformas';
      case 'recursos': return 'Gestión Recursos';
      default: return 'General';
    }
  };

  return (
    <div className="p-4 pb-24 md:pb-4 max-w-4xl mx-auto animate-fade-in-up relative">
      
      {/* Header & Filter */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-slate-800 dark:text-white mb-2">Votaciones Activas</h2>
        <p className="text-slate-500 dark:text-slate-400 text-sm mb-4">Participa en la toma de decisiones comunales.</p>
        
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
          <button 
             onClick={() => setFilter('all')}
             className={`px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-colors ${filter === 'all' ? 'bg-slate-800 text-white' : 'bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 text-slate-600 dark:text-slate-300'}`}
          >
            Todas
          </button>
          {['infraestructura', 'salud', 'reforma', 'recursos'].map(cat => (
             <button 
                key={cat}
                onClick={() => setFilter(cat as ProposalCategory)}
                className={`px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-colors capitalize ${filter === cat ? 'bg-brand-blue text-white' : 'bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 text-slate-600 dark:text-slate-300'}`}
             >
                {getCategoryLabel(cat)}
             </button>
          ))}
        </div>
      </div>

      {/* Proposals Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {activeProposals.map((prop) => {
          const total = prop.votesFor + prop.votesAgainst;
          const pctFor = total > 0 ? (prop.votesFor / total) * 100 : 0;
          const pctAgainst = total > 0 ? (prop.votesAgainst / total) * 100 : 0;
          
          const myVote = userVotes[prop.id];
          const hasVoted = !!myVote;
          
          return (
            <div key={prop.id} className={`bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border transition-all flex flex-col h-full ${hasVoted ? 'border-brand-green/50 dark:border-brand-green/30 ring-1 ring-brand-green/20' : 'border-gray-100 dark:border-slate-700 hover:shadow-md'}`}>
              <div className="flex justify-between items-start mb-3">
                <span className={`px-2 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider flex items-center gap-1 bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300`}>
                  <span className="material-symbols-outlined text-sm">{getCategoryIcon(prop.category)}</span>
                  {getCategoryLabel(prop.category)}
                </span>
                <span className="text-xs text-brand-orange font-bold flex items-center gap-1">
                  <span className="material-symbols-outlined text-sm">timer</span>
                  Cierra: {prop.endDate}
                </span>
              </div>
              
              <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-2 leading-tight">{prop.title}</h3>
              <p className="text-sm text-slate-600 dark:text-slate-300 mb-4 leading-relaxed flex-1">{prop.description}</p>
              
              {prop.budget && (
                 <div className="mb-4 bg-green-50 dark:bg-green-900/20 p-2 rounded-lg border border-green-100 dark:border-green-800/30">
                    <p className="text-xs text-green-800 dark:text-green-300 font-bold flex items-center gap-2">
                        <span className="material-symbols-outlined text-sm">attach_money</span>
                        Presupuesto Solicitado: <span className="text-lg">{prop.budget}</span>
                    </p>
                 </div>
              )}

              {/* Progress Bar (Anonymous Trend) */}
              <div className="space-y-2 mb-6">
                <div className="flex justify-between text-[10px] font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                   <span>A Favor ({prop.votesFor})</span>
                   <span>En Contra ({prop.votesAgainst})</span>
                </div>
                <div className="h-3 bg-red-100 dark:bg-red-900/30 rounded-full overflow-hidden flex relative">
                  <div style={{ width: `${pctFor}%` }} className="bg-brand-green h-full transition-all duration-1000 ease-out relative"></div>
                </div>
                {hasVoted && (
                    <div className="flex justify-between text-[10px] font-bold pt-1">
                        <span className="text-brand-green">{pctFor.toFixed(1)}%</span>
                        <span className="text-red-500">{pctAgainst.toFixed(1)}%</span>
                    </div>
                )}
              </div>

              <div className="mt-auto">
                {hasVoted ? (
                    <div className={`py-3 rounded-xl border flex flex-col items-center justify-center text-center animate-fade-in-up ${
                        myVote === 'for' 
                            ? 'bg-green-50 dark:bg-green-900/10 border-green-200 dark:border-green-800/30' 
                            : 'bg-red-50 dark:bg-red-900/10 border-red-200 dark:border-red-800/30'
                    }`}>
                        <div className={`flex items-center gap-2 mb-1 ${
                             myVote === 'for' ? 'text-brand-green dark:text-emerald-400' : 'text-red-600 dark:text-red-400'
                        }`}>
                             <span className="material-symbols-outlined">{myVote === 'for' ? 'thumb_up' : 'thumb_down'}</span>
                             <span className="font-bold text-sm">Votaste {myVote === 'for' ? 'A FAVOR' : 'EN CONTRA'}</span>
                        </div>
                        <p className="text-[10px] text-slate-500">Tu voto ha sido registrado correctamente.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-2 gap-3">
                        <button 
                            onClick={() => handleOpenVote(prop, 'for')}
                            className="py-3 bg-brand-green/10 text-brand-green dark:text-emerald-400 dark:bg-emerald-900/20 rounded-xl font-bold hover:bg-brand-green hover:text-white dark:hover:bg-emerald-500 dark:hover:text-white transition-all flex items-center justify-center gap-2 border border-brand-green/20 dark:border-emerald-500/30"
                        >
                        <span className="material-symbols-outlined text-lg">thumb_up</span>
                        A Favor
                        </button>
                        <button 
                            onClick={() => handleOpenVote(prop, 'against')}
                            className="py-3 bg-red-50 text-red-600 dark:text-red-400 dark:bg-red-900/20 rounded-xl font-bold hover:bg-red-500 hover:text-white dark:hover:bg-red-500 dark:hover:text-white transition-all flex items-center justify-center gap-2 border border-red-200 dark:border-red-500/30"
                        >
                        <span className="material-symbols-outlined text-lg">thumb_down</span>
                        En Contra
                        </button>
                    </div>
                )}
              </div>
            </div>
          );
        })}
        
        {activeProposals.length === 0 && (
             <div className="col-span-full py-12 text-center text-slate-400">
                <span className="material-symbols-outlined text-5xl mb-2 opacity-50">ballot</span>
                <p>No hay votaciones activas en esta categoría.</p>
             </div>
        )}
      </div>

      {/* Voting Modal */}
      {selectedProposal && voteType && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in-up">
            <div className="bg-white dark:bg-slate-800 w-full max-w-md rounded-2xl shadow-2xl overflow-hidden">
                <div className={`p-4 text-white flex justify-between items-center ${voteType === 'for' ? 'bg-brand-green' : 'bg-red-500'}`}>
                    <h3 className="font-bold flex items-center gap-2">
                        <span className="material-symbols-outlined">{voteType === 'for' ? 'thumb_up' : 'thumb_down'}</span>
                        Votar {voteType === 'for' ? 'A Favor' : 'En Contra'}
                    </h3>
                    <button onClick={() => setSelectedProposal(null)} className="hover:bg-white/20 rounded-full p-1">
                        <span className="material-symbols-outlined">close</span>
                    </button>
                </div>
                
                <div className="p-6">
                    <h4 className="font-bold text-slate-800 dark:text-white mb-2">{selectedProposal.title}</h4>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">Para garantizar la transparencia, es necesario que justifiques tu voto.</p>
                    
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase mb-2">
                        ¿Por qué votas {voteType === 'for' ? 'a favor' : 'en contra'}?
                    </label>
                    <textarea 
                        value={justification}
                        onChange={(e) => setJustification(e.target.value)}
                        className="w-full p-3 bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-600 rounded-xl text-sm focus:ring-2 focus:ring-brand-blue dark:text-white outline-none min-h-[100px]"
                        placeholder="Escribe tu razón aquí (mínimo 5 caracteres)..."
                    />
                    
                    <div className="mt-6 flex gap-3">
                         <button 
                            onClick={() => setSelectedProposal(null)}
                            className="flex-1 py-3 text-slate-500 dark:text-slate-400 font-bold hover:bg-gray-100 dark:hover:bg-slate-700 rounded-xl"
                         >
                            Cancelar
                         </button>
                         <button 
                            onClick={handleConfirmVote}
                            disabled={justification.length < 5 || isSubmitting}
                            className={`flex-1 py-3 text-white font-bold rounded-xl shadow-lg flex items-center justify-center gap-2 ${
                                isSubmitting 
                                ? 'bg-gray-400 cursor-wait' 
                                : voteType === 'for' ? 'bg-brand-green hover:bg-green-700' : 'bg-red-500 hover:bg-red-600'
                            }`}
                         >
                            {isSubmitting ? 'Registrando...' : 'Confirmar Voto'}
                         </button>
                    </div>
                </div>
            </div>
        </div>
      )}
    </div>
  );
};