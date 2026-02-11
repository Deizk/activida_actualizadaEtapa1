import React, { useState } from 'react';
import { MOCK_PRODUCTS, MOCK_STORES } from '../constants';
import { Product, UserProfileData } from '../types';

interface MarketplaceProps {
  onAddToCart: (product: Product) => void;
  onViewProfile?: (profile: UserProfileData) => void;
}

export const Marketplace: React.FC<MarketplaceProps> = ({ onAddToCart, onViewProfile }) => {
  const [activeTab, setActiveTab] = useState<'products' | 'stores'>('products');
  const [selectedStore, setSelectedStore] = useState<string | null>(null);

  // Filter products based on selected store if in "stores" mode
  const displayedProducts = activeTab === 'stores' && selectedStore 
    ? MOCK_PRODUCTS.filter(p => p.storeId === selectedStore)
    : MOCK_PRODUCTS;

  // Get selected store object
  const currentStore = selectedStore ? MOCK_STORES.find(s => s.id === selectedStore) : null;
  const entrepreneur = currentStore?.ownerProfile;

  const handleContact = () => {
    if (entrepreneur) {
        alert(`Iniciando chat seguro P2P con ${entrepreneur.name}...\n\n(Simulación: Redirigiendo a módulo de mensajería)`);
    }
  };

  const handleViewFullProfile = () => {
    if (entrepreneur && onViewProfile) {
        onViewProfile(entrepreneur);
    }
  };

  return (
    <div className="flex flex-col h-full bg-slate-50 dark:bg-slate-900 transition-colors duration-300 animate-fade-in-up">
      
      {/* Header with Search and Tabs */}
      <div className="bg-white dark:bg-slate-800 p-6 pb-2 shadow-sm border-b border-gray-100 dark:border-slate-700 sticky top-0 z-10">
        <div className="flex justify-between items-center mb-4">
            <div>
                <h2 className="text-2xl font-bold text-slate-800 dark:text-white">Mercado Comunal</h2>
                <p className="text-slate-500 dark:text-slate-400 text-sm">Compra, vende y trueque local</p>
            </div>
        </div>

        {/* Search Bar */}
        <div className="relative mb-4">
            <span className="material-symbols-outlined absolute left-3 top-3 text-slate-400">search</span>
            <input 
                type="text" 
                placeholder={activeTab === 'products' ? "Buscar productos..." : "Buscar emprendedores..."}
                className="w-full bg-gray-50 dark:bg-slate-700/50 border border-gray-200 dark:border-slate-600 rounded-xl py-2.5 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-brand-blue dark:focus:ring-sky-500 text-slate-700 dark:text-slate-200"
            />
        </div>

        {/* Tab Switcher */}
        <div className="flex p-1 bg-gray-100 dark:bg-slate-700/50 rounded-lg">
            <button 
                onClick={() => { setActiveTab('products'); setSelectedStore(null); }}
                className={`flex-1 py-2 text-sm font-bold rounded-md transition-all ${activeTab === 'products' ? 'bg-white dark:bg-slate-600 shadow-sm text-slate-800 dark:text-white' : 'text-slate-500 dark:text-slate-400'}`}
            >
                Catálogo General
            </button>
            <button 
                onClick={() => setActiveTab('stores')}
                className={`flex-1 py-2 text-sm font-bold rounded-md transition-all ${activeTab === 'stores' ? 'bg-white dark:bg-slate-600 shadow-sm text-slate-800 dark:text-white' : 'text-slate-500 dark:text-slate-400'}`}
            >
                Emprendedores
            </button>
        </div>
      </div>

      <div className="flex-1 overflow-auto p-4 pb-24 md:pb-4">
        
        {/* VIEW: STORES LIST */}
        {activeTab === 'stores' && !selectedStore && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {MOCK_STORES.map(store => (
                    <div 
                        key={store.id} 
                        onClick={() => setSelectedStore(store.id)}
                        className="bg-white dark:bg-slate-800 rounded-xl p-4 border border-gray-100 dark:border-slate-700 shadow-sm hover:shadow-md transition-all cursor-pointer flex items-center gap-4 group"
                    >
                        <div className="w-16 h-16 rounded-full bg-gray-200 dark:bg-slate-700 overflow-hidden shrink-0 border-2 border-transparent group-hover:border-brand-blue transition-colors">
                            <img src={store.image} alt={store.name} className="w-full h-full object-cover" />
                        </div>
                        <div className="flex-1">
                            <h3 className="font-bold text-slate-800 dark:text-white">{store.name}</h3>
                            <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">{store.owner}</p>
                            <div className="flex items-center gap-2">
                                <span className="text-[10px] bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-300 px-2 py-0.5 rounded font-bold uppercase">{store.category}</span>
                                <div className="flex items-center text-yellow-400 text-xs">
                                    <span className="material-symbols-outlined text-sm filled">star</span>
                                    <span className="ml-0.5 text-slate-600 dark:text-slate-300 font-bold">{store.rating}</span>
                                </div>
                            </div>
                        </div>
                        <span className="material-symbols-outlined text-slate-300 group-hover:text-brand-blue group-hover:translate-x-1 transition-all">chevron_right</span>
                    </div>
                ))}
            </div>
        )}

        {/* VIEW: PRODUCTS GRID (Or Store Detail with Entrepreneur Profile) */}
        {(activeTab === 'products' || selectedStore) && (
            <div>
                {/* Back Button and Entrepreneur Profile */}
                {selectedStore && currentStore && entrepreneur && (
                    <div className="mb-6 animate-fade-in-down">
                        <button onClick={() => setSelectedStore(null)} className="flex items-center gap-1 text-sm font-bold text-slate-500 dark:text-slate-400 mb-4 hover:text-brand-blue transition-colors">
                            <span className="material-symbols-outlined text-lg">arrow_back</span>
                            Volver a Emprendedores
                        </button>
                        
                        {/* ENTREPRENEUR PROFILE CARD */}
                        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-md overflow-hidden border border-gray-100 dark:border-slate-700 mb-6">
                            {/* Banner & Avatar */}
                            <div className="h-24 bg-gradient-to-r from-brand-blue to-cyan-500 dark:from-sky-800 dark:to-cyan-900"></div>
                            <div className="px-6 relative pb-6">
                                <div className="absolute -top-10 left-6">
                                    <div className="w-20 h-20 rounded-2xl bg-white dark:bg-slate-700 p-1 shadow-lg">
                                        <img src={currentStore.image} alt={currentStore.name} className="w-full h-full object-cover rounded-xl" />
                                    </div>
                                </div>
                                <div className="ml-24 pt-2">
                                    <h2 className="text-xl font-bold text-slate-800 dark:text-white leading-tight flex items-center gap-1">
                                        {entrepreneur.name}
                                        <span className="material-symbols-outlined text-brand-blue text-lg" title="Verificado">verified</span>
                                    </h2>
                                    <p className="text-xs text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wide">{entrepreneur.currentTrade} • {currentStore.name}</p>
                                </div>
                                
                                {/* Bio Section */}
                                <div className="mt-6">
                                    <p className="text-sm text-slate-600 dark:text-slate-300 italic mb-4 bg-gray-50 dark:bg-slate-700/50 p-3 rounded-lg border-l-4 border-brand-blue">
                                        "{entrepreneur.bio}"
                                    </p>
                                    
                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                                        <div className="bg-blue-50 dark:bg-blue-900/10 p-2 rounded-lg text-center">
                                            <span className="block text-lg font-black text-brand-blue dark:text-sky-400">{entrepreneur.communityReputation}%</span>
                                            <span className="text-[10px] uppercase font-bold text-slate-500 dark:text-slate-400">Reputación</span>
                                        </div>
                                        <div className="bg-yellow-50 dark:bg-yellow-900/10 p-2 rounded-lg text-center">
                                            <span className="block text-lg font-black text-yellow-600 dark:text-yellow-400">{currentStore.rating}</span>
                                            <span className="text-[10px] uppercase font-bold text-slate-500 dark:text-slate-400">Valoración</span>
                                        </div>
                                        <div className="col-span-2 flex flex-wrap gap-1 content-center">
                                            {entrepreneur.skills.map(skill => (
                                                <span key={skill} className="text-[10px] bg-gray-100 dark:bg-slate-700 px-2 py-1 rounded-full text-slate-600 dark:text-slate-300 font-bold">
                                                    {skill}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                    
                                    <div className="flex gap-3">
                                        <button 
                                            onClick={handleContact}
                                            className="flex-1 bg-brand-blue hover:bg-sky-600 text-white py-2 rounded-lg text-sm font-bold shadow-lg shadow-brand-blue/30 transition-colors"
                                        >
                                            Contactar
                                        </button>
                                        <button 
                                            onClick={handleViewFullProfile}
                                            className="flex-1 bg-white hover:bg-gray-50 dark:bg-slate-700 dark:hover:bg-slate-600 border border-gray-200 dark:border-slate-600 text-slate-700 dark:text-slate-200 py-2 rounded-lg text-sm font-bold transition-colors"
                                        >
                                            Ver Perfil Completo
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <h3 className="font-bold text-slate-800 dark:text-white mb-2 flex items-center gap-2">
                            <span className="material-symbols-outlined text-brand-orange">storefront</span>
                            Catálogo Disponible
                        </h3>
                    </div>
                )}

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {displayedProducts.map((prod) => (
                    <div key={prod.id} className="bg-white dark:bg-slate-800 rounded-xl overflow-hidden border border-gray-100 dark:border-slate-700 shadow-sm hover:shadow-md transition-all group flex flex-col h-full">
                        <div className="relative aspect-square bg-gray-100 dark:bg-slate-700">
                        <img src={prod.image} alt={prod.name} className="w-full h-full object-cover" />
                        {prod.allowsBarter && (
                            <div className="absolute top-2 left-2 bg-brand-green/90 backdrop-blur-sm text-white text-[10px] font-bold px-2 py-1 rounded-full flex items-center gap-1">
                            <span className="material-symbols-outlined text-[12px]">sync_alt</span>
                            TRUEQUE
                            </div>
                        )}
                        </div>
                        
                        <div className="p-3 flex flex-col flex-1">
                            <p className="text-[10px] text-brand-blue dark:text-sky-400 font-bold uppercase tracking-wide mb-1">{prod.category}</p>
                            <h3 className="font-bold text-slate-800 dark:text-white text-sm mb-1 leading-tight flex-1">{prod.name}</h3>
                            <p className="text-xs text-slate-500 dark:text-slate-400 mb-3 truncate">{prod.seller}</p>
                            
                            <div className="flex items-center justify-between mt-auto">
                                <span className="font-bold text-lg text-slate-900 dark:text-white">${prod.price.toFixed(2)}</span>
                                <button 
                                    onClick={() => onAddToCart(prod)}
                                    className="bg-brand-blue/10 dark:bg-sky-500/10 p-2 rounded-full text-brand-blue dark:text-sky-400 hover:bg-brand-blue hover:text-white dark:hover:bg-sky-500 dark:hover:text-white transition-all active:scale-90"
                                >
                                    <span className="material-symbols-outlined text-xl">add_shopping_cart</span>
                                </button>
                            </div>
                        </div>
                    </div>
                    ))}
                </div>
                
                {displayedProducts.length === 0 && (
                     <div className="flex flex-col items-center justify-center py-12 text-slate-400">
                        <span className="material-symbols-outlined text-4xl mb-2">inventory_2</span>
                        <p className="text-sm">No se encontraron productos.</p>
                     </div>
                )}
            </div>
        )}
      </div>

      {/* Info Banner */}
      <div className="bg-blue-50 dark:bg-slate-800 border-t border-blue-100 dark:border-slate-700 p-3 text-center text-xs text-blue-700 dark:text-blue-300">
        <span className="font-bold">Nota:</span> La plataforma no maneja dinero directo. Los pagos se acuerdan directamente con el vendedor.
      </div>
    </div>
  );
};