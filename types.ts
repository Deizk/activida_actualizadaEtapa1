export enum UserRole {
  CITIZEN = 'citizen',
  LEADER = 'leader',
  ADMIN = 'admin',
  AUDITOR = 'auditor'
}

export enum IncidentStatus {
  PENDING = 'Pendiente',
  IN_PROGRESS = 'En Proceso',
  RESOLVED = 'Resuelto'
}

export enum IncidentPriority {
  LOW = 'Baja',
  MEDIUM = 'Media',
  HIGH = 'Alta'
}

export interface Incident {
  id: string;
  category: string;
  description: string;
  status: IncidentStatus;
  priority: IncidentPriority;
  aiJustification: string;
  lat: number;
  lng: number;
  timestamp: string;
  imageUrl?: string;
}

export type ProposalCategory = 'infraestructura' | 'reforma' | 'recursos' | 'salud' | 'comercio';

export interface Proposal {
  id: string;
  title: string;
  description: string;
  category: ProposalCategory;
  budget?: string;
  votesFor: number;
  votesAgainst: number;
  endDate: string;
  status: 'active' | 'closed';
}

export interface VoteRecord {
  id: string;
  proposalId: string;
  proposalTitle: string;
  vote: 'for' | 'against';
  justification: string;
  timestamp: string;
  category: ProposalCategory;
}

export interface Product {
  id: string;
  name: string;
  price: number;
  allowsBarter: boolean;
  seller: string;
  storeId: string; // Link to store
  category: string;
  image: string;
}

export interface UserProfileData {
  name: string;
  cedula: string;
  age: number;
  email: string;
  phone: string;
  profession: string;
  currentTrade: string; // Oficio actual
  skills: string[];
  bio: string; // Resumen curricular breve
  communityReputation: number; // 1-100
  medicalSummary: {
    bloodType: string;
    allergies: string[];
    chronicConditions: string[]; // Non-invasive list
    mobilityIssue: boolean;
  };
}

export interface Store {
  id: string;
  name: string;
  owner: string; // Deprecated in UI but kept for ID ref
  ownerProfile: UserProfileData; // Full profile linkage
  category: string;
  rating: number;
  image: string;
}

export interface CartItem extends Product {
  quantity: number;
}

export interface KPI {
  label: string;
  value: string;
  change: string; // e.g. "+5%"
  trend: 'up' | 'down' | 'neutral';
}

export interface ServiceStatusItem {
  id: string;
  name: string;
  icon: string;
  status: 'optimal' | 'warning' | 'critical';
  message: string;
  lastUpdate: string;
}

export interface BulletinItem {
  id: string;
  title: string;
  content: string;
  date: string;
  type: 'info' | 'alert' | 'event';
}

export interface HighlightItem {
  id: string;
  title: string;
  subtitle: string;
  image: string;
  tag: string;
  actionLabel: string;
}

export type VolunteerType = 'limpieza' | 'infraestructura' | 'pintura' | 'educacion' | 'logistica';

export interface VolunteerTask {
  id: string;
  title: string;
  description: string;
  type: VolunteerType;
  date: string;
  time: string;
  location: string;
  participants: number;
  maxParticipants: number;
  status: 'open' | 'full' | 'completed';
  image?: string;
  leader: {
    name: string;
    role: string;
    avatar: string; // initials
    reputation: number;
  };
}

// --- NEW TYPES FOR PROFILE & CENSUS ---

export interface FamilyMember {
  id: string;
  name: string;
  relation: 'Jefe/a' | 'Pareja' | 'Hijo/a' | 'Padre/Madre' | 'Otro';
  age: number;
  cedula?: string;
  condition?: 'Ninguna' | 'Embarazada' | 'Discapacidad' | 'Cama' | 'Enfermedad Crónica';
  occupation: string;
}

export interface HousingConditions {
  type: 'Casa' | 'Apartamento' | 'Anexo' | 'Rancho';
  ownership: 'Propia' | 'Alquilada' | 'Invadida' | 'Prestada';
  roof: 'Platabanda' | 'Zinc' | 'Teja' | 'Asbesto';
  floor: 'Cerámica' | 'Cemento' | 'Tierra';
  rooms: number;
}

export interface BasicNeeds {
  water: 'Tubería' | 'Cisterna' | 'Pozo';
  gas: 'Bombona' | 'Directo';
  electricity: 'Estable' | 'Irregular';
  internet: boolean;
  foodBag: boolean; // CLAP or similar
}

export interface CensusData {
  familyId: string;
  address: string;
  members: FamilyMember[];
  housing: HousingConditions;
  needs: BasicNeeds;
  lastUpdated: string;
}

export interface AppNotification {
  id: string;
  type: 'system' | 'community' | 'alert' | 'personal';
  title: string;
  message: string;
  time: string;
  read: boolean;
  priority?: boolean;
}

// --- MINOR PROFILES ---
export interface MinorProfile {
  id: string;
  guardianId: string; // Link to parent
  name: string;
  dateOfBirth: string;
  age: number;
  gender: 'M' | 'F';
  bloodType: string;
  allergies: string[];
  conditions: string[];
  disability: boolean;
  disabilityDetail?: string;
  birthCertificateVerified: boolean; // Document proof
  medicalRecordId?: string; // Link to Central Health Registry
  emergencyContact: {
    name: string;
    relation: string;
    phone: string;
  };
}