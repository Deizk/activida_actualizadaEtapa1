import React, { useState, useMemo } from 'react';
import { CartItem } from '../types';
import { MOCK_STORES } from '../constants';

interface P2PCheckoutProps {
  items: CartItem[];
  onFinish: () => void;
}

export const P2PCheckout: React.FC<P2PCheckoutProps> = ({ items, onFinish }) => {
  const total = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  
  // Find the seller/store associated with these items (assuming single seller cart for MVP)
  const sellerStore = useMemo(() => {
      if (items.length === 0) return null;
      // Match by store ID or Name if ID not present in cart item directly (Mock usually has IDs)
      return MOCK_STORES.find(s => s.id === items[0].storeId || s.name === items[0].seller);
  }, [items]);

  const [messages, setMessages] = useState([
    { id: 1, sender: 'system', text: `Orden #${Math.floor(Math.random() * 9000) + 1000} Creada. Esperando confirmación del vendedor.` },
    { id: 2, sender: 'seller', text: '¡Hola! Gracias por tu pedido. Por favor confirma tu método de pago.' },
  ]);
  const [inputText, setInputText] = useState('');
  const [status, setStatus] = useState<'pending' | 'paid' | 'completed'>('pending');
  const [showUpload, setShowUpload] = useState(false);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('');

  const handleSend = () => {
    if (!inputText.trim()) return;
    setMessages([...messages, { id: Date.now(), sender: 'me', text: inputText }]);
    setInputText('');
  };

  const handlePaymentProof = () => {
    if (!selectedPaymentMethod) {
        alert("Por favor selecciona el método de pago utilizado.");
        return;
    }
    setShowUpload(false);
    setMessages([...messages, { 
        id: Date.now(), 
        sender: 'system', 
        text: `📸 Comprobante de pago (${selectedPaymentMethod}) enviado. Esperando validación.` 
    }]);
    setStatus('paid');
    
    // Simulate seller confirmation
    setTimeout(() => {
        setMessages(prev => [...prev, { id: Date.now() + 1, sender: 'system', text: '✅ Pago verificado por el vendedor. ¡Transacción Exitosa!' }]);
        setStatus('completed');
    }, 3000);
  };

  return (
    <div className="flex flex-col h-full bg-slate-100 dark:bg-slate-900 animate-fade-in-up">
       
       {/* P2P Header */}
       <header className="bg-slate-800 text-white p-4 flex items-center justify-between shadow-md">
           <div className="flex items-center gap-3">
               <div className="w-10 h-10 rounded-full bg-slate-700 flex items-center justify-center border border-slate-600">
                  <span className="material-symbols-outlined text-green-400">lock</span>
               </div>
               <div>
                   <h2 className="font-bold text-sm">Intercambio Seguro P2P</h2>
                   <p className="text-xs text-slate-300">Orden Activa • {items[0]?.seller}</p>
               </div>
           </div>
           <button onClick={onFinish} className="p-2 hover:bg-slate-700 rounded-full">
               <span className="material-symbols-outlined">close</span>
           </button>
       </header>

       {/* Main Content Split */}
       <div className="flex-1 overflow-hidden flex flex-col md:flex-row">
           
           {/* Order Summary (Collapsible or Side) */}
           <div className="bg-white dark:bg-slate-800 p-4 border-b md:border-b-0 md:border-r border-gray-200 dark:border-slate-700 md:w-80 overflow-y-auto">
               <h3 className="font-bold text-slate-700 dark:text-slate-200 mb-4">Resumen del Pedido</h3>
               <div className="space-y-3 mb-4">
                   {items.map(item => (
                       <div key={item.id} className="flex justify-between text-sm">
                           <span className="text-slate-600 dark:text-slate-400">{item.quantity}x {item.name}</span>
                           <span className="font-medium text-slate-800 dark:text-white">${(item.price * item.quantity).toFixed(2)}</span>
                       </div>
                   ))}
               </div>
               <div className="border-t border-gray-100 dark:border-slate-700 pt-3 flex justify-between items-center mb-6">
                   <span className="font-bold text-slate-800 dark:text-white">Total a Pagar</span>
                   <span className="text-xl font-black text-brand-green dark:text-emerald-400">${total.toFixed(2)}</span>
               </div>
               
               {/* Accepted Payment Methods */}
               <div className="bg-blue-50 dark:bg-blue-900/10 p-4 rounded-xl border border-blue-100 dark:border-blue-900/30">
                    <h4 className="text-xs font-bold text-blue-700 dark:text-blue-300 uppercase mb-2 flex items-center gap-2">
                        <span className="material-symbols-outlined text-sm">payments</span>
                        Métodos Aceptados
                    </h4>
                    {sellerStore && sellerStore.paymentMethods && sellerStore.paymentMethods.length > 0 ? (
                        <div className="flex flex-wrap gap-2">
                            {sellerStore.paymentMethods.map(method => (
                                <span key={method} className="text-[10px] bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 px-2 py-1 rounded border border-blue-200 dark:border-slate-600 font-bold shadow-sm">
                                    {method}
                                </span>
                            ))}
                        </div>
                    ) : (
                        <p className="text-xs text-slate-500 italic">Consultar por chat</p>
                    )}
               </div>

               <div className="mt-4 bg-yellow-50 dark:bg-yellow-900/20 p-3 rounded-lg border border-yellow-100 dark:border-yellow-900/30">
                   <p className="text-xs text-yellow-800 dark:text-yellow-200 font-medium flex gap-2">
                       <span className="material-symbols-outlined text-sm">info</span>
                       No liberes el pago hasta confirmar disponibilidad con el vendedor.
                   </p>
               </div>
           </div>

           {/* Chat Area */}
           <div className="flex-1 flex flex-col relative bg-slate-100 dark:bg-slate-900">
               
               <div className="flex-1 overflow-y-auto p-4 space-y-4">
                   {messages.map(msg => (
                       <div key={msg.id} className={`flex ${msg.sender === 'me' ? 'justify-end' : 'justify-start'}`}>
                           {msg.sender === 'system' ? (
                               <div className="w-full flex justify-center my-2">
                                   <span className="bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300 text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wide flex items-center gap-1">
                                       <span className="material-symbols-outlined text-sm">info</span>
                                       {msg.text}
                                   </span>
                               </div>
                           ) : (
                               <div className={`max-w-[80%] rounded-2xl p-3 text-sm shadow-sm ${
                                   msg.sender === 'me' 
                                   ? 'bg-brand-blue text-white rounded-br-none' 
                                   : 'bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 rounded-bl-none border border-gray-100 dark:border-slate-700'
                               }`}>
                                   {msg.text}
                               </div>
                           )}
                       </div>
                   ))}
               </div>

               {/* Action Bar */}
               <div className="bg-white dark:bg-slate-800 p-3 border-t border-gray-200 dark:border-slate-700 pb-20 md:pb-3">
                   {status === 'pending' && (
                       <div className="flex gap-2 mb-3 overflow-x-auto pb-1">
                           <button 
                                onClick={() => setShowUpload(true)}
                                className="flex items-center gap-2 bg-slate-100 dark:bg-slate-700 px-3 py-2 rounded-lg text-xs font-bold text-slate-600 dark:text-slate-300 whitespace-nowrap hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors"
                            >
                               <span className="material-symbols-outlined text-base">receipt_long</span>
                               Notificar Pago
                           </button>
                           <button className="flex items-center gap-2 bg-slate-100 dark:bg-slate-700 px-3 py-2 rounded-lg text-xs font-bold text-slate-600 dark:text-slate-300 whitespace-nowrap hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors">
                               <span className="material-symbols-outlined text-base">account_balance_wallet</span>
                               Datos Bancarios
                           </button>
                       </div>
                   )}

                   {showUpload && (
                        <div className="absolute bottom-20 left-4 right-4 bg-white dark:bg-slate-800 rounded-xl shadow-2xl p-4 border border-gray-200 dark:border-slate-600 animate-fade-in-up">
                            <div className="flex justify-between items-center mb-3">
                                <h4 className="font-bold text-slate-800 dark:text-white">Reportar Pago</h4>
                                <button onClick={() => setShowUpload(false)} className="text-slate-400">
                                    <span className="material-symbols-outlined">close</span>
                                </button>
                            </div>
                            
                            <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase mb-2">Método Utilizado</label>
                            <div className="flex flex-wrap gap-2 mb-4">
                                {sellerStore?.paymentMethods.map(method => (
                                    <button
                                        key={method}
                                        onClick={() => setSelectedPaymentMethod(method)}
                                        className={`px-3 py-2 rounded-lg text-xs font-bold border transition-all ${
                                            selectedPaymentMethod === method 
                                            ? 'bg-brand-blue text-white border-brand-blue' 
                                            : 'bg-white dark:bg-slate-700 text-slate-600 dark:text-slate-300 border-gray-200 dark:border-slate-500'
                                        }`}
                                    >
                                        {method}
                                    </button>
                                ))}
                            </div>

                            <div className="border-2 border-dashed border-gray-300 dark:border-slate-600 rounded-lg p-6 flex flex-col items-center justify-center text-slate-400 mb-3 cursor-pointer hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors">
                                <span className="material-symbols-outlined text-3xl">add_a_photo</span>
                                <span className="text-xs mt-1">Adjuntar Captura</span>
                            </div>
                            <button 
                                onClick={handlePaymentProof} 
                                disabled={!selectedPaymentMethod}
                                className={`w-full py-2 rounded-lg font-bold transition-colors ${
                                    selectedPaymentMethod ? 'bg-brand-green text-white hover:bg-emerald-600' : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                }`}
                            >
                                Enviar Comprobante
                            </button>
                        </div>
                   )}

                   <div className="flex gap-2">
                       <input 
                          type="text" 
                          value={inputText}
                          onChange={(e) => setInputText(e.target.value)}
                          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                          placeholder="Escribe un mensaje..."
                          className="flex-1 bg-gray-100 dark:bg-slate-700 rounded-full px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-brand-blue text-slate-800 dark:text-white"
                       />
                       <button onClick={handleSend} className="bg-brand-blue text-white p-2 rounded-full shadow-lg hover:bg-sky-600 transition-colors">
                           <span className="material-symbols-outlined">send</span>
                       </button>
                   </div>
               </div>
           </div>
       </div>
    </div>
  );
};