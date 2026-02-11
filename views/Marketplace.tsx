import React, { useState, useEffect } from 'react';
import { MOCK_PRODUCTS, MOCK_STORES } from '../constants';
import { Product, Store, UserProfileData, CartItem } from '../types';
import { CartView } from './CartView';

interface MarketplaceProps {
  onAddToCart: (product: Product) => void;
  onViewProfile?: (profile: UserProfileData) => void;
  
  // Cart Props passed down
  cartItems: CartItem[];
  onUpdateQuantity: (id: string, delta: number) => void;
  onRemoveFromCart: (id: string) => void;
  onCheckout: () => void;
}

const MARKET_CATEGORIES = ['Todas', 'Alimentos', 'Tecnología', 'Servicios', 'Ropa', 'Hogar', 'Salud'];

export const Marketplace: React.FC<MarketplaceProps> = ({ 
    onAddToCart, 
    onViewProfile,
    cartItems,
    onUpdateQuantity,
    onRemoveFromCart,
    onCheckout
}) => {
  const [activeTab, setActiveTab] = useState<'products' | 'stores' | 'cart'>('products');
  const [selectedStore, setSelectedStore] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState('Todas');

  // --- GLOBAL MARKET STATE (Simulated Database) ---
  const [allStores, setAllStores] = useState<Store[]>(MOCK_STORES);
  const [allProducts, setAllProducts] = useState<Product[]>(MOCK_PRODUCTS);

  // Filter products logic
  const displayedProducts = allProducts.filter(p => {
      // 1. Filter by Store (if a store is selected)
      const matchesStore = selectedStore ? p.storeId === selectedStore : true;
      
      // 2. Filter by Category (if not 'Todas')
      const matchesCategory = selectedCategory === 'Todas' ? true : p.category === selectedCategory;

      return matchesStore && matchesCategory;
  });

  // Get selected store object
  const currentStore = selectedStore ? allStores.find(s => s.id === selectedStore) : null;
  const entrepreneur = currentStore?.ownerProfile;

  const handleContact = () => {
    if (entrepreneur && entrepreneur.phone) {
        // Clean phone number (remove dashes, spaces, parens)
        let cleanPhone = entrepreneur.phone.replace(/\D/g, '');
        
        // Add country code if missing (Assuming Venezuela +58 for prototype)
        if (cleanPhone.startsWith('0')) {
            cleanPhone = '58' + cleanPhone.substring(1);
        }

        const message = `Hola ${entrepreneur.name}, vi su emprendimiento "${currentStore?.name}" en la App Comunal y estoy interesado en sus productos.`;
        const whatsappUrl = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`;
        
        window.open(whatsappUrl, '_blank');
    } else {
        alert("Este emprendedor no tiene un número de contacto válido registrado.");
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

        {activeTab !== 'cart' && (
            <div className="relative mb-4">
                <span className="material-symbols-outlined absolute left-3 top-3 text-slate-400">search</span>
                <input 
                    type="text" 
                    placeholder={activeTab === 'products' ? "Buscar productos..." : "Buscar emprendedores..."}
                    className="w-full bg-gray-50 dark:bg-slate-700/50 border border-gray-200 dark:border-slate-600 rounded-xl py-2.5 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-brand-blue dark:focus:ring-sky-500 text-slate-700 dark:text-slate-200"
                />
            </div>
        )}

        {/* Tab Switcher */}
        <div className="flex p-1 bg-gray-100 dark:bg-slate-700/50 rounded-lg overflow-x-auto mb-3">
            <button 
                onClick={() => { setActiveTab('products'); setSelectedStore(null); setSelectedCategory('Todas'); }}
                className={`flex-1 py-2 px-2 text-xs md:text-sm font-bold rounded-md transition-all whitespace-nowrap ${activeTab === 'products' ? 'bg-white dark:bg-slate-600 shadow-sm text-slate-800 dark:text-white' : 'text-slate-500 dark:text-slate-400'}`}
            >
                Catálogo
            </button>
            <button 
                onClick={() => setActiveTab('stores')}
                className={`flex-1 py-2 px-2 text-xs md:text-sm font-bold rounded-md transition-all whitespace-nowrap ${activeTab === 'stores' ? 'bg-white dark:bg-slate-600 shadow-sm text-slate-800 dark:text-white' : 'text-slate-500 dark:text-slate-400'}`}
            >
                Emprendedores
            </button>
            <button 
                onClick={() => setActiveTab('cart')}
                className={`flex-1 py-2 px-2 text-xs md:text-sm font-bold rounded-md transition-all whitespace-nowrap flex items-center justify-center gap-1 ${activeTab === 'cart' ? 'bg-brand-blue text-white shadow-sm' : 'text-brand-blue dark:text-sky-400'}`}
            >
                <span className="material-symbols-outlined text-sm">shopping_cart</span>
                Carrito ({cartItems.reduce((acc, item) => acc + item.quantity, 0)})
            </button>
        </div>

        {/* Category Filters (Only in Products Tab) */}
        {activeTab === 'products' && (
            <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                {MARKET_CATEGORIES.map(cat => (
                    <button
                        key={cat}
                        onClick={() => setSelectedCategory(cat)}
                        className={`px-3 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-colors border ${
                            selectedCategory === cat
                            ? 'bg-brand-blue border-brand-blue text-white'
                            : 'bg-white dark:bg-slate-800 border-gray-200 dark:border-slate-600 text-slate-600 dark:text-slate-300'
                        }`}
                    >
                        {cat}
                    </button>
                ))}
            </div>
        )}
      </div>

      <div className="flex-1 overflow-auto p-4 pb-24 md:pb-4">
        
        {/* VIEW: CART */}
        {activeTab === 'cart' && (
            <CartView 
                items={cartItems}
                onUpdateQuantity={onUpdateQuantity}
                onRemove={onRemoveFromCart}
                onCheckout={onCheckout}
            />
        )}
        
        {/* VIEW: STORES LIST */}
        {activeTab === 'stores' && !selectedStore && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 animate-fade-in-up">
                {allStores.map(store => (
                    <div 
                        key={store.id} 
                        onClick={() => setSelectedStore(store.id)}
                        className="bg-white dark:bg-slate-800 rounded-xl p-4 border border-gray-100 dark:border-slate-700 shadow-sm hover:shadow-md transition-all cursor-pointer flex items-center gap-4 group"
                    >
                        <div className="w-16 h-16 rounded-xl bg-gray-200 dark:bg-slate-700 overflow-hidden shrink-0 border-2 border-transparent group-hover:border-brand-blue transition-colors">
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
                                    <div className="w-20 h-20 rounded-2xl bg-white dark:bg-slate-700 p-1 shadow-lg overflow-hidden">
                                        <img src={currentStore.image} alt={currentStore.name} className="w-full h-full object-cover rounded-xl" />
                                    </div>
                                </div>
                                <div className="ml-24 pt-2">
                                    <h2 className="text-xl font-bold text-slate-800 dark:text-white leading-tight flex items-center gap-1">
                                        {currentStore.name}
                                        <span className="material-symbols-outlined text-brand-blue text-lg" title="Verificado">verified</span>
                                    </h2>
                                    <p className="text-xs text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wide">{entrepreneur.name} • {currentStore.category}</p>
                                </div>
                                
                                {/* Entrepreneurship Details (Location & Payment) */}
                                <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
                                     <div className="flex items-start gap-2 bg-gray-50 dark:bg-slate-700/50 p-2 rounded-lg">
                                        <span className="material-symbols-outlined text-slate-400 text-lg mt-0.5">location_on</span>
                                        <div>
                                            <p className="text-[10px] font-bold uppercase text-slate-500 dark:text-slate-400">Ubicación</p>
                                            <p className="text-sm font-bold text-slate-700 dark:text-slate-200">{currentStore.location}</p>
                                        </div>
                                     </div>
                                     <div className="flex items-start gap-2 bg-gray-50 dark:bg-slate-700/50 p-2 rounded-lg">
                                        <span className="material-symbols-outlined text-slate-400 text-lg mt-0.5">payments</span>
                                        <div>
                                            <p className="text-[10px] font-bold uppercase text-slate-500 dark:text-slate-400">Métodos de Pago</p>
                                            <div className="flex flex-wrap gap-1 mt-0.5">
                                                {currentStore.paymentMethods.map(pm => (
                                                    <span key={pm} className="text-[10px] bg-white dark:bg-slate-600 px-1.5 rounded border border-gray-200 dark:border-slate-500 text-slate-600 dark:text-slate-300">{pm}</span>
                                                ))}
                                            </div>
                                        </div>
                                     </div>
                                </div>

                                {/* Bio Section */}
                                <div className="mt-2">
                                    <p className="text-sm text-slate-600 dark:text-slate-300 italic mb-4 bg-gray-50 dark:bg-slate-700/50 p-3 rounded-lg border-l-4 border-brand-blue">
                                        "{currentStore.description || entrepreneur.bio}"
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
                                            className="flex-1 bg-green-600 hover:bg-green-700 text-white py-2 rounded-lg text-sm font-bold shadow-lg shadow-green-500/30 transition-colors flex items-center justify-center gap-2"
                                        >
                                            <span className="material-symbols-outlined text-lg">chat</span>
                                            WhatsApp
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

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 animate-fade-in-up">
                    {displayedProducts.map((prod) => (
                    <div key={prod.id} className="bg-white dark:bg-slate-800 rounded-xl overflow-hidden border border-gray-100 dark:border-slate-700 shadow-sm hover:shadow-md transition-all group flex flex-col h-full relative">
                        {/* Stock Badge Overlay */}
                        <div className="absolute top-2 right-2 z-10">
                            {prod.stock === 0 ? (
                                <span className="bg-red-500 text-white text-[10px] font-bold px-2 py-1 rounded-lg shadow-sm">
                                    AGOTADO
                                </span>
                            ) : prod.stock < 5 ? (
                                <span className="bg-orange-500 text-white text-[10px] font-bold px-2 py-1 rounded-lg shadow-sm">
                                    ¡POCOS!
                                </span>
                            ) : null}
                        </div>

                        <div className="relative aspect-square bg-gray-100 dark:bg-slate-700">
                            <img src={prod.image} alt={prod.name} className={`w-full h-full object-cover transition-opacity ${prod.stock === 0 ? 'opacity-50 grayscale' : ''}`} />
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
                            {prod.description && <p className="text-[10px] text-slate-400 mb-2 line-clamp-1">{prod.description}</p>}
                            <p className="text-xs text-slate-500 dark:text-slate-400 mb-3 truncate">{prod.seller}</p>
                            
                            <div className="flex items-center justify-between mt-auto">
                                <span className="font-bold text-lg text-slate-900 dark:text-white">${prod.price.toFixed(2)}</span>
                                <button 
                                    onClick={() => onAddToCart(prod)}
                                    disabled={prod.stock === 0}
                                    className={`p-2 rounded-full transition-all active:scale-90 ${
                                        prod.stock === 0 
                                        ? 'bg-gray-100 dark:bg-slate-700 text-gray-400 cursor-not-allowed' 
                                        : 'bg-brand-blue/10 dark:bg-sky-500/10 text-brand-blue dark:text-sky-400 hover:bg-brand-blue hover:text-white dark:hover:bg-sky-500 dark:hover:text-white'
                                    }`}
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
                        <p className="text-sm">No se encontraron productos en esta categoría.</p>
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