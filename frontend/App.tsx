import React, { useState, useEffect } from 'react';
import { Layout } from './components/Layout';
import { MobileHome } from './views/MobileHome';
import { ReportForm } from './views/ReportForm';
import { Voting } from './views/Voting';
import { VotingHistory } from './views/VotingHistory';
import { Marketplace } from './views/Marketplace';
import { MyBusiness } from './views/MyBusiness'; 
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
import { MinorProfilesView } from './views/MinorProfilesView';
// AdminMaintenance is now integrated into Layout
import { ThemeProvider } from './ThemeContext';
import { CartItem, Product, VoteRecord, Proposal, UserProfileData, MinorProfile } from './types';
import { MOCK_VOTE_HISTORY, MOCK_PROPOSALS, MOCK_USER_PROFILE, MOCK_MINORS } from './constants';

function AppContent() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [activeTab, setActiveTab] = useState('home');
  const [isDesktop, setIsDesktop] = useState(window.innerWidth >= 768);
  
  // Navigation History for Profile Views
  const [previousTab, setPreviousTab] = useState('home');
  const [selectedPublicProfile, setSelectedPublicProfile] = useState<UserProfileData | null>(null);

  // Cart State
  const [cart, setCart] = useState<CartItem[]>([]);
  
  // Voting State (Lifted for persistence)
  const [proposals, setProposals] = useState<Proposal[]>(MOCK_PROPOSALS);
  const [userVotes, setUserVotes] = useState<Record<string, 'for' | 'against'>>({});
  const [voteHistory, setVoteHistory] = useState<VoteRecord[]>(MOCK_VOTE_HISTORY);

  // Minor Profiles State (Lifted for global access)
  const [minors, setMinors] = useState<MinorProfile[]>(MOCK_MINORS);

  // Emergency State
  const [emergencyMinor, setEmergencyMinor] = useState<MinorProfile | null>(null);

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

  // Emergency Navigation
  const handleTriggerEmergency = (minor?: MinorProfile) => {
      if (minor) {
          setEmergencyMinor(minor);
      } else {
          setEmergencyMinor(null);
      }
      setActiveTab('emergency');
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
    // 1. Update History
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

    // 2. Update Proposal Counts (Real-time feedback)
    setProposals(prev => prev.map(p => {
        if (p.id === proposal.id) {
             return {
                ...p,
                votesFor: vote === 'for' ? p.votesFor + 1 : p.votesFor,
                votesAgainst: vote === 'against' ? p.votesAgainst + 1 : p.votesAgainst
             };
        }
        return p;
    }));

    // 3. Mark as voted locally (Persistence)
    setUserVotes(prev => ({
        ...prev,
        [proposal.id]: vote
    }));
  };

  const renderContent = () => {
    switch (activeTab) {
      // Principal
      case 'home':
        return <MobileHome onNavigate={setActiveTab} />;
      
      // Incidencias & IA
      case 'ai_decision':
        return <AiDecision />;
      case 'report':
        return <ReportForm />;
      case 'emergency':
        return <EmergencyMode linkedMinor={emergencyMinor} />;

      // Bienestar Social
      case 'health':
        return <HealthView minors={minors} />;

      // Gobernanza
      case 'dashboard':
        return <WebDashboard />;
      case 'ai_registry':
        return <AiRegistry />;
      case 'impact':
        return <ImpactView />;

      // Mercado
      case 'market_home':
        return <Marketplace 
            onAddToCart={addToCart} 
            onViewProfile={handleViewProfile}
            cartItems={cart}
            onUpdateQuantity={updateQuantity}
            onRemoveFromCart={removeFromCart}
            onCheckout={() => setActiveTab('p2p_checkout')}
        />;
      case 'my_business':
        return <MyBusiness />;
      case 'p2p_checkout':
        return <P2PCheckout items={cart} onFinish={() => { setCart([]); setActiveTab('home'); }} />;

      // Democracia
      case 'voting_active':
        return <Voting 
            proposals={proposals} 
            userVotes={userVotes} 
            onVoteSubmit={handleVoteSubmit} 
        />;
      case 'voting_history':
        return <VotingHistory history={voteHistory} />;

      // Voluntariado
      case 'tasks':
        return <VolunteerTasks onViewProfile={handleViewProfile} />;

      // Usuario
      case 'profile':
        return <UserProfile minors={minors} />;
      case 'minors': 
        return <MinorProfilesView minors={minors} setMinors={setMinors} onEmergency={handleTriggerEmergency} />;
      case 'public_profile':
        return <UserProfile user={selectedPublicProfile} onBack={() => setActiveTab(previousTab)} />;
      case 'census':
        return <CensusView onViewProfile={handleViewProfile} minors={minors} />;
      case 'settings':
        return <Settings />;
      
      case 'logout':
        setIsAuthenticated(false);
        setActiveTab('home');
        return null;

      default:
        return <MobileHome onNavigate={setActiveTab} />;
    }
  };

  if (!isAuthenticated) {
    return <Auth onLogin={handleLogin} />;
  }

  // Calculate total items for badge
  const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <Layout activeTab={activeTab} setActiveTab={setActiveTab} cartItemCount={cartCount} user={MOCK_USER_PROFILE}>
      {renderContent()}
    </Layout>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
}