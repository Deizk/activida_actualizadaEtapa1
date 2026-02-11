import React, { useState, useEffect } from 'react';
import { Layout } from './components/Layout';
import { MobileHome } from './views/MobileHome';
import { ReportForm } from './views/ReportForm';
import { Voting } from './views/Voting';
import { VotingHistory } from './views/VotingHistory';
import { Marketplace } from './views/Marketplace';
import { CartView } from './views/CartView';
import { P2PCheckout } from './views/P2PCheckout';
import { WebDashboard } from './views/WebDashboard';
import { Auth } from './views/Auth';
import { Settings } from './views/Settings';
import { AiDecision } from './views/AiDecision';
import { EmergencyMode } from './views/EmergencyMode';
import { HealthView } from './views/HealthView';
import { AiRegistry } from './views/AiRegistry';
import { ImpactView } from './views/ImpactView';
import { VolunteerTasks } from './views/VolunteerTasks';
import { UserProfile } from './views/UserProfile';
import { CensusView } from './views/CensusView';
import { MinorProfilesView } from './views/MinorProfilesView'; // Import New View
import { ThemeProvider } from './ThemeContext';
import { CartItem, Product, VoteRecord, Proposal, UserProfileData } from './types';
import { MOCK_VOTE_HISTORY } from './constants';

function AppContent() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [activeTab, setActiveTab] = useState('home');
  const [isDesktop, setIsDesktop] = useState(window.innerWidth >= 768);
  
  // Navigation History for Profile Views
  const [previousTab, setPreviousTab] = useState('home');
  const [selectedPublicProfile, setSelectedPublicProfile] = useState<UserProfileData | null>(null);

  // Cart State
  const [cart, setCart] = useState<CartItem[]>([]);
  
  // Voting History State
  const [voteHistory, setVoteHistory] = useState<VoteRecord[]>(MOCK_VOTE_HISTORY);

  useEffect(() => {
    const handleResize = () => {
      const desktop = window.innerWidth >= 768;
      setIsDesktop(desktop);
    };

    window.addEventListener('resize', handleResize);
    handleResize();

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleLogin = () => {
    setIsAuthenticated(true);
  };

  // Profile Navigation
  const handleViewProfile = (profile: UserProfileData) => {
      setPreviousTab(activeTab);
      setSelectedPublicProfile(profile);
      setActiveTab('public_profile');
  };

  // Cart Functions
  const addToCart = (product: Product) => {
    setCart(prev => {
        const existing = prev.find(item => item.id === product.id);
        if (existing) {
            return prev.map(item => item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item);
        }
        return [...prev, { ...product, quantity: 1 }];
    });
  };

  const removeFromCart = (id: string) => {
    setCart(prev => prev.filter(item => item.id !== id));
  };

  const updateQuantity = (id: string, delta: number) => {
    setCart(prev => prev.map(item => {
        if (item.id === id) {
            const newQty = Math.max(1, item.quantity + delta);
            return { ...item, quantity: newQty };
        }
        return item;
    }));
  };

  // Voting Function
  const handleVoteSubmit = (proposal: Proposal, vote: 'for' | 'against', justification: string) => {
    const newRecord: VoteRecord = {
      id: `V-${Date.now()}`,
      proposalId: proposal.id,
      proposalTitle: proposal.title,
      category: proposal.category,
      vote: vote,
      justification: justification,
      timestamp: new Date().toISOString().split('T')[0]
    };
    
    setVoteHistory(prev => [newRecord, ...prev]);
    // In a real app, this would also update the active proposals list to remove the voted one or mark it as voted.
    setActiveTab('voting_history'); // Auto redirect to history to see the result
  };

  const renderContent = () => {
    switch (activeTab) {
      // Principal
      case 'home':
        return <MobileHome />;
      
      // Incidencias & IA
      case 'ai_decision':
        return <AiDecision />;
      case 'report':
        return <ReportForm />;
      case 'emergency':
        return <EmergencyMode />;

      // Bienestar Social
      case 'health':
        return <HealthView />;

      // Gobernanza
      case 'dashboard':
        return <WebDashboard />;
      case 'ai_registry':
        return <AiRegistry />;
      case 'impact':
        return <ImpactView />;

      // Mercado
      case 'market_home':
        return <Marketplace onAddToCart={addToCart} onViewProfile={handleViewProfile} />;
      case 'cart':
        return <CartView 
            items={cart} 
            onUpdateQuantity={updateQuantity} 
            onRemove={removeFromCart} 
            onCheckout={() => setActiveTab('p2p_checkout')} 
        />;
      case 'p2p_checkout':
        return <P2PCheckout items={cart} onFinish={() => { setCart([]); setActiveTab('home'); }} />;

      // Democracia
      case 'voting_active':
        return <Voting onVoteSubmit={handleVoteSubmit} />;
      case 'voting_history':
        return <VotingHistory history={voteHistory} />;

      // Voluntariado
      case 'tasks':
        return <VolunteerTasks onViewProfile={handleViewProfile} />;

      // Usuario
      case 'profile':
        return <UserProfile />;
      case 'minors': // New Route
        return <MinorProfilesView />;
      case 'public_profile':
        return <UserProfile user={selectedPublicProfile} onBack={() => setActiveTab(previousTab)} />;
      case 'census':
        return <CensusView onViewProfile={handleViewProfile} />;
      case 'settings':
        return <Settings />;
      
      case 'logout':
        setIsAuthenticated(false);
        setActiveTab('home');
        return null;

      default:
        return <MobileHome />;
    }
  };

  if (!isAuthenticated) {
    return <Auth onLogin={handleLogin} />;
  }

  // Calculate total items for badge
  const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <Layout activeTab={activeTab} setActiveTab={setActiveTab} cartItemCount={cartCount}>
      {renderContent()}
    </Layout>
  );
}

// Simple placeholder for views not yet fully implemented in the prototype
const PlaceholderView = ({ title, icon }: { title: string, icon: string }) => (
  <div className="flex items-center justify-center h-full bg-slate-50 dark:bg-slate-900 text-slate-400 dark:text-slate-500 font-bold">
    <div className="text-center">
      <div className="w-20 h-20 bg-white dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm">
        <span className="material-symbols-outlined text-4xl">{icon}</span>
      </div>
      <p className="text-xl text-slate-600 dark:text-slate-300">{title}</p>
      <p className="text-sm font-normal mt-2 opacity-70">Próximamente en la Beta</p>
    </div>
  </div>
);

export default function App() {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
}