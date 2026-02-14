import React, { useState, useEffect } from 'react';
import { MOCK_PRODUCTS, MOCK_USER_PROFILE } from '../constants';
import { Product, Store, Order } from '../types';

const MARKET_CATEGORIES = ['Alimentos', 'Tecnología', 'Servicios', 'Ropa', 'Hogar', 'Salud'];
const PAYMENT_OPTIONS = ["Pago Móvil", "Efectivo", "Divisas", "Zelle", "Binance", "Punto de Venta", "Trueque"];

// Mock Orders for P2P System
const MOCK_ORDERS: Order[] = [
    {
        id: 'ORD-1024',
        buyerName: 'Carlos Ruiz',
        items: [{ name: 'Miel Artesanal (500ml)', qty: 2, price: 5.00 }],
        total: 10.00,
        status: 'pending_payment',
        date: '2023-10-25',
    },
    {
        id: 'ORD-1020',
        buyerName: 'Ana Lopez',
        items: [{ name: 'Jalea Real', qty: 1, price: 8.50 }],
        total: 8.50,
        status: 'paid',
        date: '2023-10-24',
        paymentMethod: 'Pago Móvil'
    },
    {
        id: 'ORD-0998',
        buyerName: 'Pedro Castillo',
        items: [{ name: 'Miel Artesanal (500ml)', qty: 5, price: 5.00 }],
        total: 25.00,
        status: 'delivered',
        date: '2023-10-22',
        paymentMethod: 'Divisas'
    }
];

export const MyBusiness: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'inventory' | 'orders'>('dashboard');
  
  // --- ENTREPRENEUR STATES ---
  const [myStore, setMyStore] = useState<Store | null>(null); // Null means no store yet
  const [myProducts, setMyProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>(MOCK_ORDERS);
  
  // Forms States
  const [isEditingStore, setIsEditingStore] = useState(false);
  const [isAddingProduct, setIsAddingProduct] = useState(false);
  
  // Store Form Data
  const [storeForm, setStoreForm] = useState({
      name: '',
      category: 'Alimentos',
      description: '',
      location: '',
      paymentMethods: [] as string[],
      image: '' // URL for the image
  });

  // Product Form Data
  const [productForm, setProductForm] = useState({
      name: '',
      description: '',
      price: '',
      stock: '',
      allowsBarter: false,
      category: 'Alimentos'
  });

  // --- ENTREPRENEUR LOGIC ---

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
          const imageUrl = URL.createObjectURL(file);
          setStoreForm(prev => ({ ...prev, image: imageUrl }));
      }
  };

  const handleCreateStore = (e: React.FormEvent) => {
      e.preventDefault();
      
      const storeId = myStore ? myStore.id : `S-${Date.now()}`;
      const defaultImage = 'https://picsum.photos/100/100?random=99';

      const newStoreData: Store = {
          id: storeId,
          name: storeForm.name,
          description: storeForm.description,
          location: storeForm.location,
          paymentMethods: storeForm.paymentMethods,
          category: storeForm.category,
          owner: MOCK_USER_PROFILE.name,
          ownerProfile: MOCK_USER_PROFILE,
          rating: myStore ? myStore.rating : 5.0,
          image: storeForm.image || defaultImage
      };

      setMyStore(newStoreData);
      setIsEditingStore(false);
      alert(myStore ? "Perfil actualizado correctamente" : "¡Felicidades! Tu perfil de emprendedor ha sido creado.");
  };

  const handleAddProduct = (e: React.FormEvent) => {
      e.preventDefault();
      if (!myStore) return;
      
      const newProduct: Product = {
          id: `P-${Date.now()}`,
          name: productForm.name,
          description: productForm.description,
          price: parseFloat(productForm.price),
          stock: parseInt(productForm.stock) || 0,
          allowsBarter: productForm.allowsBarter,
          seller: myStore.name,
          storeId: myStore.id,
          category: productForm.category,
          image: 'https://picsum.photos/200/200?random=' + Math.floor(Math.random()*100)
      };

      setMyProducts(prev => [...prev, newProduct]);
      setIsAddingProduct(false);
      setProductForm({ name: '', description: '', price: '', stock: '', allowsBarter: false, category: myStore.category }); 
  };

  const togglePaymentMethod = (method: string) => {
      setStoreForm(prev => {
          if (prev.paymentMethods.includes(method)) {
              return { ...prev, paymentMethods: prev.paymentMethods.filter(m => m !== method) };
          }
          return { ...prev, paymentMethods: [...prev.paymentMethods, method] };
      });
  };

  const updateOrderStatus = (orderId: string, newStatus: Order['status']) => {
      setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: newStatus } : o));
  };

  // Pre-fill form when editing existing store
  useEffect(() => {
      if (myStore && isEditingStore) {
          setStoreForm({
              name: myStore.name,
              category: myStore.category,
              description: myStore.description,
              location: myStore.location,
              paymentMethods: myStore.paymentMethods,
              image: myStore.image
          });
      }
  }, [myStore, isEditingStore]);

  return (
    <div className="flex flex-col h-full bg-slate-50 dark:bg-slate-900 transition-colors duration-300 animate-fade-in-up">
      
      <div className="bg-white dark:bg-slate-800 p-6 shadow-sm border-b border-gray-100 dark:border-slate-700 sticky top-0 z-10">
        <h2 className="text-2xl font-bold text-slate-800 dark:text-white flex items-center gap-2">
            <span className="material-symbols-outlined text-brand-blue dark:text-sky-400">store</span>
            Mi Negocio
        </h2>
        <p className="text-slate-500 dark:text-slate-400 text-sm">Gestiona tu emprendimiento y pedidos</p>
      
        {myStore && !isEditingStore && (
            <div className="flex p-1 bg-gray-100 dark:bg-slate-700/50 rounded-lg mt-4">
                <button 
                    onClick={() => setActiveTab('dashboard')}
                    className={`flex-1 py-2 text-xs md:text-sm font-bold rounded-md transition-all ${activeTab === 'dashboard' ? 'bg-white dark:bg-slate-600 shadow-sm text-slate-800 dark:text-white' : 'text-slate-500 dark:text-slate-400'}`}
                >
                    Resumen
                </button>
                <button 
                    onClick={() => setActiveTab('inventory')}
                    className={`flex-1 py-2 text-xs md:text-sm font-bold rounded-md transition-all ${activeTab === 'inventory' ? 'bg-white dark:bg-slate-600 shadow-sm text-slate-800 dark:text-white' : 'text-slate-500 dark:text-slate-400'}`}
                >
                    Inventario
                </button>
                <button 
                    onClick={() => setActiveTab('orders')}
                    className={`flex-1 py-2 text-xs md:text-sm font-bold rounded-md transition-all flex items-center justify-center gap-1 ${activeTab === 'orders' ? 'bg-white dark:bg-slate-600 shadow-sm text-slate-800 dark:text-white' : 'text-slate-500 dark:text-slate-400'}`}
                >
                    Pedidos
                    {orders.filter(o => o.status === 'paid').length > 0 && (
                        <span className="w-2 h-2 rounded-full bg-red-500"></span>
                    )}
                </button>
            </div>
        )}
      </div>

      <div className="flex-1 overflow-auto p-4 pb-24 md:pb-4">
        {!myStore && !isEditingStore ? (
            // NO STORE STATE
            <div className="flex flex-col items-center justify-center py-12 text-center h-full">
                <div className="w-32 h-32 bg-blue-50 dark:bg-blue-900/20 rounded-full flex items-center justify-center mb-6">
                    <span className="material-symbols-outlined text-6xl text-brand-blue dark:text-sky-400">add_business</span>
                </div>
                <h2 className="text-2xl font-bold text-slate-800 dark:text-white mb-2">¡Emprende con nosotros!</h2>
                <p className="text-slate-500 dark:text-slate-400 max-w-sm mb-8">
                    Crea tu perfil de negocio, gestiona tu inventario y ofrece tus productos a toda la comunidad.
                </p>
                <button 
                    onClick={() => setIsEditingStore(true)}
                    className="bg-brand-blue hover:bg-sky-600 text-white px-8 py-3 rounded-xl font-bold shadow-lg shadow-brand-blue/30 transition-all flex items-center gap-2"
                >
                    <span className="material-symbols-outlined">rocket_launch</span>
                    Crear mi Perfil de Emprendedor
                </button>
            </div>
        ) : isEditingStore ? (
            // EDIT/CREATE STORE FORM
            <div className="max-w-lg mx-auto bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-700 overflow-hidden">
                <div className="relative">
                    <div className="h-32 bg-gradient-to-r from-brand-blue to-purple-600 dark:from-sky-800 dark:to-purple-900"></div>
                    <div className="absolute -bottom-10 left-6">
                        <div className="relative group cursor-pointer">
                            <div className="w-24 h-24 rounded-2xl bg-white dark:bg-slate-700 p-1 shadow-lg overflow-hidden">
                                {storeForm.image ? (
                                    <img src={storeForm.image} alt="Preview" className="w-full h-full object-cover rounded-xl" />
                                ) : (
                                    <div className="w-full h-full bg-slate-100 dark:bg-slate-600 rounded-xl flex items-center justify-center text-slate-400">
                                        <span className="material-symbols-outlined text-4xl">add_a_photo</span>
                                    </div>
                                )}
                                <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl">
                                    <span className="material-symbols-outlined text-white text-2xl">edit</span>
                                </div>
                            </div>
                            <input type="file" accept="image/*" onChange={handleImageUpload} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
                        </div>
                    </div>
                    <div className="absolute top-4 right-4 flex gap-2">
                        <button onClick={() => setIsEditingStore(false)} className="bg-black/20 hover:bg-black/40 text-white p-2 rounded-full backdrop-blur-sm transition-colors">
                            <span className="material-symbols-outlined text-sm">close</span>
                        </button>
                    </div>
                </div>

                <form onSubmit={handleCreateStore} className="p-6 pt-14 space-y-5">
                    <h3 className="text-xl font-bold text-slate-800 dark:text-white border-b border-gray-100 dark:border-slate-700 pb-2">
                        {myStore ? 'Editar Perfil de Negocio' : 'Configurar Tienda'}
                    </h3>
                    <div>
                        <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase mb-1">Nombre del Negocio</label>
                        <input required type="text" value={storeForm.name} onChange={e => setStoreForm({...storeForm, name: e.target.value})} className="w-full p-3 bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-600 rounded-xl outline-none text-slate-800 dark:text-white focus:ring-2 focus:ring-brand-blue" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase mb-1">Categoría</label>
                            <select value={storeForm.category} onChange={e => setStoreForm({...storeForm, category: e.target.value})} className="w-full p-3 bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-600 rounded-xl outline-none text-slate-800 dark:text-white">
                                {MARKET_CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                            </select>
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase mb-1">Ubicación</label>
                            <input required type="text" value={storeForm.location} onChange={e => setStoreForm({...storeForm, location: e.target.value})} className="w-full p-3 bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-600 rounded-xl outline-none text-slate-800 dark:text-white" />
                        </div>
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase mb-1">Descripción</label>
                        <textarea required value={storeForm.description} onChange={e => setStoreForm({...storeForm, description: e.target.value})} className="w-full p-3 bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-600 rounded-xl outline-none text-slate-800 dark:text-white min-h-[80px]" />
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase mb-2">Métodos de Pago</label>
                        <div className="flex flex-wrap gap-2">
                            {PAYMENT_OPTIONS.map(method => (
                                <button key={method} type="button" onClick={() => togglePaymentMethod(method)} className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition-all ${storeForm.paymentMethods.includes(method) ? 'bg-brand-blue text-white border-brand-blue' : 'bg-white dark:bg-slate-700 text-slate-600 dark:text-slate-300 border-gray-200 dark:border-slate-600'}`}>{method}</button>
                            ))}
                        </div>
                    </div>
                    <div className="pt-4 flex gap-3">
                        <button type="button" onClick={() => setIsEditingStore(false)} className="flex-1 py-3 text-slate-500 font-bold bg-gray-100 dark:bg-slate-700 rounded-xl">Cancelar</button>
                        <button type="submit" className="flex-1 bg-brand-blue text-white font-bold py-3 rounded-xl shadow-lg hover:bg-blue-700">{myStore ? 'Guardar Cambios' : 'Lanzar Negocio'}</button>
                    </div>
                </form>
            </div>
        ) : (
            // ACTIVE BUSINESS VIEWS
            <div className="space-y-6">
                
                {/* 1. DASHBOARD OVERVIEW */}
                {activeTab === 'dashboard' && (
                    <div className="animate-fade-in-up space-y-6">
                        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-700 relative overflow-hidden">
                            <div className="h-24 bg-gradient-to-r from-brand-blue to-purple-600 dark:from-sky-800 dark:to-purple-900"></div>
                            <div className="px-6 pb-6 relative">
                                <div className="absolute -top-10 left-6">
                                    <div className="w-20 h-20 rounded-xl bg-white dark:bg-slate-700 p-1 shadow-lg overflow-hidden">
                                        <img src={myStore?.image} alt="Logo" className="w-full h-full object-cover rounded-lg" />
                                    </div>
                                </div>
                                <div className="flex justify-end pt-3">
                                    <button onClick={() => setIsEditingStore(true)} className="flex items-center gap-1 text-xs font-bold bg-gray-100 dark:bg-slate-700 px-3 py-1.5 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-gray-200 dark:hover:bg-slate-600 transition-colors">
                                        <span className="material-symbols-outlined text-sm">edit</span>
                                        Editar Perfil
                                    </button>
                                </div>
                                <div className="mt-2">
                                    <h2 className="text-xl font-bold text-slate-800 dark:text-white leading-tight flex items-center gap-2">
                                        {myStore?.name}
                                        <span className="bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-[10px] px-2 py-0.5 rounded-full uppercase tracking-wide">{myStore?.category}</span>
                                    </h2>
                                    <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 flex items-center gap-1">
                                        <span className="material-symbols-outlined text-sm">location_on</span>
                                        {myStore?.location}
                                    </p>
                                </div>
                                <div className="mt-4 pt-4 border-t border-gray-100 dark:border-slate-700 flex gap-6 text-sm">
                                     <div className="text-center">
                                         <span className="block font-black text-slate-800 dark:text-white text-lg">{myProducts.length}</span>
                                         <span className="text-[10px] font-bold text-slate-400 uppercase">Productos</span>
                                     </div>
                                     <div className="text-center">
                                         <span className="block font-black text-slate-800 dark:text-white text-lg">{myStore?.rating}</span>
                                         <span className="text-[10px] font-bold text-slate-400 uppercase">Rating</span>
                                     </div>
                                     <div className="text-center">
                                         <span className="block font-black text-slate-800 dark:text-white text-lg">{orders.length}</span>
                                         <span className="text-[10px] font-bold text-slate-400 uppercase">Ventas</span>
                                     </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* 2. INVENTORY MANAGEMENT */}
                {activeTab === 'inventory' && (
                    <div className="animate-fade-in-up">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-lg font-bold text-slate-800 dark:text-white flex items-center gap-2">
                                <span className="material-symbols-outlined text-brand-blue">inventory_2</span>
                                Inventario
                            </h3>
                            <button onClick={() => setIsAddingProduct(true)} className="bg-brand-blue hover:bg-sky-600 text-white px-3 py-1.5 rounded-lg text-sm font-bold shadow-sm flex items-center gap-1">
                                <span className="material-symbols-outlined text-sm">add</span>
                                Agregar
                            </button>
                        </div>

                        {isAddingProduct && (
                            <div className="bg-white dark:bg-slate-800 p-4 rounded-xl border border-gray-100 dark:border-slate-700 mb-4 animate-fade-in-down">
                                <h4 className="font-bold text-sm mb-3 text-slate-700 dark:text-white">Nuevo Producto</h4>
                                <form onSubmit={handleAddProduct} className="space-y-3">
                                    <div className="grid grid-cols-2 gap-3">
                                        <input required type="text" placeholder="Nombre Producto" value={productForm.name} onChange={e => setProductForm({...productForm, name: e.target.value})} className="w-full p-2 bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-600 rounded-lg text-sm" />
                                        <input required type="number" placeholder="Precio ($)" value={productForm.price} onChange={e => setProductForm({...productForm, price: e.target.value})} className="w-full p-2 bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-600 rounded-lg text-sm" />
                                    </div>
                                    <div className="grid grid-cols-2 gap-3">
                                        <div className="mb-2">
                                            <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase mb-1">Categoría</label>
                                            <select value={productForm.category} onChange={e => setProductForm({...productForm, category: e.target.value})} className="w-full p-2 bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-600 rounded-lg text-sm outline-none text-slate-800 dark:text-white">
                                                {MARKET_CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                                            </select>
                                        </div>
                                        <div className="mb-2">
                                            <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase mb-1">Cantidad Stock</label>
                                            <input required type="number" placeholder="Ej. 10" value={productForm.stock} onChange={e => setProductForm({...productForm, stock: e.target.value})} min="0" className="w-full p-2 bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-600 rounded-lg text-sm" />
                                        </div>
                                    </div>
                                    <textarea required placeholder="Descripción del artículo..." value={productForm.description} onChange={e => setProductForm({...productForm, description: e.target.value})} className="w-full p-2 bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-600 rounded-lg text-sm min-h-[60px]" />
                                    <div className="flex items-center gap-2">
                                        <input type="checkbox" id="barter" checked={productForm.allowsBarter} onChange={e => setProductForm({...productForm, allowsBarter: e.target.checked})} className="rounded text-brand-blue focus:ring-brand-blue" />
                                        <label htmlFor="barter" className="text-sm text-slate-600 dark:text-slate-300">Acepta Trueque</label>
                                    </div>
                                    <div className="flex gap-2 pt-2">
                                        <button type="button" onClick={() => setIsAddingProduct(false)} className="flex-1 py-2 text-slate-500 font-bold bg-gray-100 dark:bg-slate-700 rounded-lg text-sm">Cancelar</button>
                                        <button type="submit" className="flex-1 py-2 bg-brand-green text-white font-bold rounded-lg text-sm">Guardar</button>
                                    </div>
                                </form>
                            </div>
                        )}

                        <div className="space-y-3">
                            {myProducts.length === 0 ? (
                                <div className="text-center py-8 text-slate-400 bg-white dark:bg-slate-800 rounded-xl border border-dashed border-gray-200 dark:border-slate-700">
                                    <p>No tienes productos en inventario.</p>
                                </div>
                            ) : (
                                myProducts.map(prod => (
                                    <div key={prod.id} className="bg-white dark:bg-slate-800 p-3 rounded-xl border border-gray-100 dark:border-slate-700 shadow-sm flex gap-3 items-center">
                                        <img src={prod.image} alt={prod.name} className="w-14 h-14 rounded-lg object-cover bg-gray-100" />
                                        <div className="flex-1 min-w-0">
                                            <h4 className="font-bold text-slate-800 dark:text-white text-sm truncate">{prod.name}</h4>
                                            <div className="flex items-center gap-2 mb-0.5">
                                                <p className="text-xs text-brand-blue dark:text-sky-400 font-bold">{prod.category}</p>
                                                <span className="text-[10px] text-slate-400">•</span>
                                                <p className={`text-xs font-bold ${prod.stock === 0 ? 'text-red-500' : prod.stock < 5 ? 'text-orange-500' : 'text-green-600'}`}>
                                                    {prod.stock === 0 ? 'Agotado' : `Stock: ${prod.stock}`}
                                                </p>
                                            </div>
                                            <p className="font-bold text-slate-800 dark:text-white text-sm mt-1">${prod.price}</p>
                                        </div>
                                        <button onClick={() => setMyProducts(myProducts.filter(p => p.id !== prod.id))} className="p-2 text-slate-400 hover:text-red-500 transition-colors">
                                            <span className="material-symbols-outlined">delete</span>
                                        </button>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                )}

                {/* 3. P2P ORDER MANAGEMENT */}
                {activeTab === 'orders' && (
                    <div className="animate-fade-in-up">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-lg font-bold text-slate-800 dark:text-white flex items-center gap-2">
                                <span className="material-symbols-outlined text-green-600">payments</span>
                                Solicitudes P2P
                            </h3>
                        </div>

                        <div className="space-y-4">
                            {orders.length === 0 ? (
                                <div className="text-center py-12 text-slate-400">
                                    <span className="material-symbols-outlined text-4xl mb-2">inbox</span>
                                    <p>No tienes pedidos activos.</p>
                                </div>
                            ) : (
                                orders.map(order => (
                                    <div key={order.id} className="bg-white dark:bg-slate-800 rounded-xl border border-gray-100 dark:border-slate-700 shadow-sm overflow-hidden">
                                        <div className="p-4 border-b border-gray-100 dark:border-slate-700 flex justify-between items-center">
                                            <div>
                                                <p className="text-[10px] text-slate-400 uppercase font-bold">Orden #{order.id.split('-')[1]}</p>
                                                <p className="text-sm font-bold text-slate-800 dark:text-white">{order.buyerName}</p>
                                            </div>
                                            <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase ${
                                                order.status === 'paid' ? 'bg-red-100 text-red-600' : 
                                                order.status === 'delivered' ? 'bg-green-100 text-green-600' :
                                                'bg-blue-100 text-blue-600'
                                            }`}>
                                                {order.status === 'paid' ? 'Pago Recibido' : order.status === 'delivered' ? 'Entregado' : 'Pendiente'}
                                            </span>
                                        </div>
                                        <div className="p-4 space-y-2">
                                            {order.items.map((item, idx) => (
                                                <div key={idx} className="flex justify-between text-sm text-slate-600 dark:text-slate-300">
                                                    <span>{item.qty}x {item.name}</span>
                                                    <span className="font-bold">${(item.price * item.qty).toFixed(2)}</span>
                                                </div>
                                            ))}
                                            <div className="border-t border-dashed border-gray-200 dark:border-slate-600 pt-2 flex justify-between items-center mt-2">
                                                <span className="text-xs text-slate-500">Total</span>
                                                <span className="text-lg font-black text-brand-green dark:text-emerald-400">${order.total.toFixed(2)}</span>
                                            </div>
                                            {order.status === 'paid' && (
                                                <div className="bg-yellow-50 dark:bg-yellow-900/10 p-2 rounded-lg border border-yellow-100 dark:border-yellow-900/30 text-xs text-yellow-800 dark:text-yellow-200 mt-2 flex items-center gap-2">
                                                    <span className="material-symbols-outlined text-sm">info</span>
                                                    Comprador reportó pago ({order.paymentMethod}). Verifica antes de entregar.
                                                </div>
                                            )}
                                        </div>
                                        <div className="bg-gray-50 dark:bg-slate-900/50 p-3 flex gap-2">
                                            <button className="flex-1 flex items-center justify-center gap-1 bg-white dark:bg-slate-700 border border-gray-200 dark:border-slate-600 py-2 rounded-lg text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-gray-50 dark:hover:bg-slate-600">
                                                <span className="material-symbols-outlined text-base">chat</span>
                                                Chat
                                            </button>
                                            {order.status === 'paid' && (
                                                <button 
                                                    onClick={() => updateOrderStatus(order.id, 'delivered')}
                                                    className="flex-1 flex items-center justify-center gap-1 bg-brand-green text-white py-2 rounded-lg text-xs font-bold hover:bg-emerald-600 shadow-sm"
                                                >
                                                    <span className="material-symbols-outlined text-base">local_shipping</span>
                                                    Confirmar Entrega
                                                </button>
                                            )}
                                            {order.status === 'pending_payment' && (
                                                <button className="flex-1 flex items-center justify-center gap-1 bg-white dark:bg-slate-700 border border-gray-200 dark:border-slate-600 py-2 rounded-lg text-xs font-bold text-slate-400 cursor-not-allowed">
                                                    Esperando Pago...
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                )}
            </div>
        )}
      </div>
    </div>
  );
};
