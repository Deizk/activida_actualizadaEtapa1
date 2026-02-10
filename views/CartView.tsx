import React from 'react';
import { CartItem } from '../types';

interface CartViewProps {
  items: CartItem[];
  onUpdateQuantity: (id: string, delta: number) => void;
  onRemove: (id: string) => void;
  onCheckout: () => void;
}

export const CartView: React.FC<CartViewProps> = ({ items, onUpdateQuantity, onRemove, onCheckout }) => {
  const total = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-8 text-center animate-fade-in-up">
        <div className="w-24 h-24 bg-gray-100 dark:bg-slate-800 rounded-full flex items-center justify-center mb-4">
           <span className="material-symbols-outlined text-4xl text-slate-400">shopping_cart_off</span>
        </div>
        <h2 className="text-xl font-bold text-slate-800 dark:text-white mb-2">Tu carrito está vacío</h2>
        <p className="text-slate-500 dark:text-slate-400 mb-6 max-w-xs mx-auto">Explora el mercado comunal y apoya a los emprendedores locales.</p>
        <button 
           onClick={() => window.location.hash = '#market'} // Assuming parent handles routing/tab switching back
           className="px-6 py-3 bg-brand-blue dark:bg-sky-600 text-white rounded-xl font-bold shadow-lg shadow-brand-blue/20"
        >
           Ir al Mercado
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-slate-50 dark:bg-slate-900 animate-fade-in-up">
       <header className="bg-white dark:bg-slate-800 p-6 shadow-sm border-b border-gray-100 dark:border-slate-700">
            <h2 className="text-2xl font-bold text-slate-800 dark:text-white">Carrito de Compras</h2>
            <p className="text-slate-500 dark:text-slate-400 text-sm">Revisa tus artículos antes de contactar al vendedor</p>
       </header>

       <div className="flex-1 overflow-auto p-4 space-y-4">
          {items.map(item => (
              <div key={item.id} className="bg-white dark:bg-slate-800 p-4 rounded-xl border border-gray-100 dark:border-slate-700 shadow-sm flex gap-4 items-center">
                  <img src={item.image} alt={item.name} className="w-16 h-16 rounded-lg object-cover bg-gray-100" />
                  
                  <div className="flex-1 min-w-0">
                      <p className="text-[10px] font-bold text-brand-blue dark:text-sky-400 uppercase truncate">{item.seller}</p>
                      <h3 className="font-bold text-slate-800 dark:text-white text-sm truncate">{item.name}</h3>
                      <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">${item.price.toFixed(2)}</p>
                  </div>

                  <div className="flex flex-col items-end gap-2">
                      <div className="flex items-center bg-gray-100 dark:bg-slate-700 rounded-lg p-1">
                          <button 
                             onClick={() => onUpdateQuantity(item.id, -1)}
                             className="w-6 h-6 flex items-center justify-center text-slate-500 hover:text-red-500 transition-colors"
                          >
                             <span className="material-symbols-outlined text-base">remove</span>
                          </button>
                          <span className="w-8 text-center text-sm font-bold text-slate-800 dark:text-white">{item.quantity}</span>
                          <button 
                             onClick={() => onUpdateQuantity(item.id, 1)}
                             className="w-6 h-6 flex items-center justify-center text-slate-500 hover:text-green-500 transition-colors"
                          >
                             <span className="material-symbols-outlined text-base">add</span>
                          </button>
                      </div>
                      <button 
                         onClick={() => onRemove(item.id)}
                         className="text-[10px] text-red-500 hover:underline font-medium"
                      >
                         Eliminar
                      </button>
                  </div>
              </div>
          ))}
       </div>

       {/* Checkout Footer */}
       <div className="bg-white dark:bg-slate-800 p-6 border-t border-gray-100 dark:border-slate-700 pb-24 md:pb-6">
           <div className="flex justify-between items-center mb-4">
               <span className="text-slate-500 dark:text-slate-400">Total Estimado</span>
               <span className="text-2xl font-black text-slate-900 dark:text-white">${total.toFixed(2)}</span>
           </div>
           
           <button 
              onClick={onCheckout}
              className="w-full bg-gradient-to-r from-brand-green to-emerald-600 text-white font-bold py-4 rounded-xl shadow-lg shadow-green-500/30 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
           >
              <span>Concretar Compra (P2P)</span>
              <span className="material-symbols-outlined">chat</span>
           </button>
           <p className="text-[10px] text-center text-slate-400 mt-3">
               Al continuar, entrarás en un chat seguro con el vendedor para gestionar el pago y la entrega.
           </p>
       </div>
    </div>
  );
};