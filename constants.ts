import { BulletinItem, HighlightItem, Incident, IncidentPriority, IncidentStatus, KPI, Product, Proposal, ServiceStatusItem, Store, VoteRecord, VolunteerTask, UserProfileData, CensusData, AppNotification, MinorProfile } from "./types";

export const MOCK_KPIS: KPI[] = [
  { label: "Hogares Conectados", value: "85%", change: "+2%", trend: "up" },
  { label: "Incidencias Abiertas", value: "12", change: "-5", trend: "down" },
  { label: "Tiempo Respuesta", value: "4h", change: "-30m", trend: "up" },
  { label: "Participación Votos", value: "1,240", change: "+150", trend: "up" },
];

export const MOCK_INCIDENTS: Incident[] = [
  {
    id: "INC-001",
    category: "Alumbrado Público",
    description: "Poste de luz caído en Calle 4.",
    status: IncidentStatus.IN_PROGRESS,
    priority: IncidentPriority.HIGH,
    aiJustification: "Riesgo de seguridad eléctrica detectado en zona transitada.",
    lat: 10.4806,
    lng: -66.9036,
    timestamp: "Hace 2h",
  },
  {
    id: "INC-002",
    category: "Aseo Urbano",
    description: "Acumulación de desechos en la esquina del parque.",
    status: IncidentStatus.PENDING,
    priority: IncidentPriority.MEDIUM,
    aiJustification: "Riesgo sanitario moderado. Frecuencia de reporte alta.",
    lat: 10.4810,
    lng: -66.9040,
    timestamp: "Hace 5h",
  }
];

export const MOCK_PROPOSALS: Proposal[] = [
  {
    id: "PROP-101",
    title: "Remodelación Cancha Deportiva Sector B",
    description: "Propuesta para destinar el presupuesto participativo a la mejora de la cancha múltiple, incluyendo techado e iluminación LED.",
    category: 'infraestructura',
    budget: '$4,500',
    votesFor: 450,
    votesAgainst: 120,
    endDate: "2023-11-30",
    status: 'active'
  },
  {
    id: "PROP-103",
    title: "Recursos para Jornada de Salud Visual",
    description: "Solicitud de fondos para la compra de monturas y lentes correctivos para la jornada del próximo mes.",
    category: 'salud',
    budget: '$1,200',
    votesFor: 200,
    votesAgainst: 45,
    endDate: "2023-10-28",
    status: 'active'
  },
  {
    id: "PROP-104",
    title: "Reforma de Normativa de Convivencia",
    description: "Actualización del artículo 5 sobre ruidos molestos y horarios de fiestas en zonas residenciales.",
    category: 'reforma',
    votesFor: 80,
    votesAgainst: 95,
    endDate: "2023-10-25",
    status: 'active'
  },
  {
    id: "PROP-102",
    title: "Jornada de Vacunación Mascotas",
    description: "Organización de jornada veterinaria gratuita este fin de semana.",
    category: 'salud',
    budget: '$300',
    votesFor: 890,
    votesAgainst: 15,
    endDate: "2023-10-15",
    status: 'closed'
  }
];

export const MOCK_VOTE_HISTORY: VoteRecord[] = [
  {
    id: "V-001",
    proposalId: "PROP-102",
    proposalTitle: "Jornada de Vacunación Mascotas",
    vote: "for",
    category: "salud",
    justification: "Es necesario controlar la población animal y prevenir enfermedades en la comunidad.",
    timestamp: "2023-10-10"
  },
  {
    id: "V-002",
    proposalId: "PROP-099",
    proposalTitle: "Pintura Fachadas Bloque 4",
    vote: "against",
    category: "infraestructura",
    justification: "Considero que hay prioridades más urgentes como el agua antes que la estética.",
    timestamp: "2023-09-15"
  }
];

export const MOCK_STORES: Store[] = [
  { 
    id: 'S1', 
    name: 'Cooperativa La Abeja', 
    owner: 'Juana Pérez', 
    category: 'Alimentos', 
    rating: 4.8, 
    image: 'https://picsum.photos/100/100?random=20',
    ownerProfile: {
      name: "Juana Pérez",
      cedula: "V-15.888.999",
      age: 45,
      email: "juana.abeja@comuna.ve",
      phone: "0416-5555555",
      profession: "Ing. Agrónoma",
      currentTrade: "Apicultora Certificada",
      skills: ["Apicultura", "Gestión Cooperativa", "Botánica"],
      bio: "Apicultora con más de 15 años de experiencia. Fundadora de la Cooperativa La Abeja, dedicada a la producción de miel orgánica y derivados naturales. Defensora del medio ambiente.",
      communityReputation: 98,
      medicalSummary: { bloodType: "A+", allergies: [], chronicConditions: [], mobilityIssue: false }
    }
  },
  { 
    id: 'S2', 
    name: 'TecnoServicios', 
    owner: 'Carlos Ruiz', 
    category: 'Tecnología', 
    rating: 4.5, 
    image: 'https://picsum.photos/100/100?random=21',
    ownerProfile: {
      name: "Carlos Ruiz",
      cedula: "V-20.111.222",
      age: 28,
      email: "carlos.tech@comuna.ve",
      phone: "0424-9999999",
      profession: "TSU Informática",
      currentTrade: "Técnico Electrónico",
      skills: ["Reparación Móviles", "Redes", "Soldadura Microelectrónica"],
      bio: "Joven emprendedor apasionado por la tecnología. Ofrezco servicio técnico garantizado y asesoría en compra de equipos. Colaborador en la digitalización de la escuela local.",
      communityReputation: 89,
      medicalSummary: { bloodType: "O-", allergies: ["Polvo"], chronicConditions: [], mobilityIssue: false }
    }
  },
  { 
    id: 'S3', 
    name: 'Panadería Comunal', 
    owner: 'Consejo Comunal', 
    category: 'Alimentos', 
    rating: 4.9, 
    image: 'https://picsum.photos/100/100?random=22',
    ownerProfile: {
      name: "Pedro Castillo (Vocero)",
      cedula: "V-8.555.444",
      age: 55,
      email: "pedro.pan@comuna.ve",
      phone: "0412-1111111",
      profession: "Maestro Panadero",
      currentTrade: "Encargado de Panadería",
      skills: ["Panadería", "Contabilidad Básica", "Gestión de Personal"],
      bio: "Encargado de la Panadería Comunal bajo supervisión del Comité de Economía. Nuestro objetivo es garantizar el pan diario a precio justo para todos los vecinos.",
      communityReputation: 99,
      medicalSummary: { bloodType: "B+", allergies: [], chronicConditions: ["Diabetes"], mobilityIssue: false }
    }
  },
];

export const MOCK_PRODUCTS: Product[] = [
  {
    id: "PROD-1",
    name: "Miel Artesanal (500ml)",
    price: 5.00,
    allowsBarter: true,
    seller: "Cooperativa La Abeja",
    storeId: 'S1',
    category: "Alimentos",
    image: "https://picsum.photos/200/200?random=1"
  },
  {
    id: "PROD-2",
    name: "Jalea Real",
    price: 8.50,
    allowsBarter: false,
    seller: "Cooperativa La Abeja",
    storeId: 'S1',
    category: "Alimentos",
    image: "https://picsum.photos/200/200?random=4"
  },
  {
    id: "PROD-3",
    name: "Reparación de Pantalla",
    price: 15.00,
    allowsBarter: false,
    seller: "TecnoServicios",
    storeId: 'S2',
    category: "Servicios",
    image: "https://picsum.photos/200/200?random=2"
  },
  {
    id: "PROD-4",
    name: "Pan Casero (Canilla)",
    price: 1.50,
    allowsBarter: true,
    seller: "Panadería Comunal",
    storeId: 'S3',
    category: "Alimentos",
    image: "https://picsum.photos/200/200?random=3"
  }
];

export const MOCK_VOLUNTEER_TASKS: VolunteerTask[] = [
  {
    id: 'T-001',
    title: 'Recuperación Cancha Múltiple',
    description: 'Jornada de limpieza profunda, desmalezamiento y pintura de las gradas de la cancha principal.',
    type: 'pintura',
    date: 'Sábado 28 Oct',
    time: '08:00 AM - 02:00 PM',
    location: 'Cancha Sector B',
    participants: 12,
    maxParticipants: 20,
    status: 'open',
    image: 'https://picsum.photos/400/200?random=50',
    leader: {
      name: "Roberto Méndez",
      role: "Vocero de Deportes",
      avatar: "RM",
      reputation: 92
    }
  },
  {
    id: 'T-002',
    title: 'Reparación Alumbrado Calle 3',
    description: 'Apoyo logístico y mano de obra para sustitución de bombillos y fotoceldas (requiere conocimientos básicos).',
    type: 'infraestructura',
    date: 'Domingo 29 Oct',
    time: '09:00 AM - 01:00 PM',
    location: 'Calle 3, Bloque 5',
    participants: 4,
    maxParticipants: 6,
    status: 'open',
    image: 'https://picsum.photos/400/200?random=51',
    leader: {
      name: "Ing. Luisa Ferrer",
      role: "Comité de Servicios",
      avatar: "LF",
      reputation: 96
    }
  },
  {
    id: 'T-003',
    title: 'Limpieza de Quebrada',
    description: 'Recolección de desechos sólidos preventivo antes de las lluvias. Se proveerán guantes y bolsas.',
    type: 'limpieza',
    date: 'Viernes 27 Oct',
    time: '07:00 AM - 11:00 AM',
    location: 'Quebrada Los Aguacates',
    participants: 30,
    maxParticipants: 30,
    status: 'full',
    image: 'https://picsum.photos/400/200?random=52',
    leader: {
      name: "Carlos Ruiz",
      role: "Voluntario Líder",
      avatar: "CR",
      reputation: 89
    }
  }
];

export const CATEGORIES = [
  "Alumbrado Público",
  "Agua Potable",
  "Aseo Urbano",
  "Seguridad",
  "Vialidad",
  "Gas Doméstico"
];

export const MOCK_SERVICES: ServiceStatusItem[] = [
  { id: '1', name: 'Agua', icon: 'water_drop', status: 'optimal', message: 'Suministro normal', lastUpdate: '10:00 AM' },
  { id: '2', name: 'Electricidad', icon: 'bolt', status: 'warning', message: 'Fluctuaciones en Sector C', lastUpdate: '11:30 AM' },
  { id: '3', name: 'Gas', icon: 'propane', status: 'optimal', message: 'Camión en ruta', lastUpdate: '09:00 AM' },
  { id: '4', name: 'Internet', icon: 'wifi', status: 'critical', message: 'Avería masiva Cantv', lastUpdate: '08:15 AM' },
];

export const MOCK_BULLETIN: BulletinItem[] = [
  { id: '1', title: 'Jornada de Salud Visual', content: 'Este sábado en la Casa Comunal, exámenes gratuitos para mayores de 60 años.', date: 'Sáb 15 Oct', type: 'event' },
  { id: '2', title: 'Cierre de Vía Principal', content: 'Por reparación de tubería matriz, el paso estará cerrado 24h.', date: 'Hoy', type: 'alert' },
];

export const MOCK_HIGHLIGHTS: HighlightItem[] = [
  { id: '1', title: 'Feria del Campo', subtitle: 'Verduras frescas a precio solidario', image: 'https://picsum.photos/600/300?random=10', tag: 'Economía', actionLabel: 'Ver Precios' },
  { id: '2', title: 'Torneo de Dominó', subtitle: 'Inscripciones abiertas copa "Banco Obrero"', image: 'https://picsum.photos/600/300?random=11', tag: 'Deportes', actionLabel: 'Inscribirse' },
  { id: '3', title: 'Dulces Caseros', subtitle: 'Promoción 2x1 en tortas de Doña Juana', image: 'https://picsum.photos/600/300?random=12', tag: 'Marketplace', actionLabel: 'Comprar' },
];

export const MOCK_USER_PROFILE: UserProfileData = {
  name: "María González",
  cedula: "V-12.345.678",
  age: 34,
  email: "maria.gonzalez@comuna.ve",
  phone: "0412-1234567",
  profession: "Lcda. Educación",
  currentTrade: "Repostera Artesanal",
  skills: ["Gestión Educativa", "Repostería", "Liderazgo Comunitario", "Organización de Eventos"],
  bio: "Educadora con 10 años de experiencia, actualmente dedicada al emprendimiento de repostería local y activa en la organización de eventos culturales para niños.",
  communityReputation: 95,
  medicalSummary: {
    bloodType: "O+",
    allergies: ["Penicilina"],
    chronicConditions: ["Hipertensión Leve"],
    mobilityIssue: false
  }
};

export const MOCK_CENSUS_DATA: CensusData = {
  familyId: "F-0042",
  address: "Calle 3, Bloque 5, Piso 2, Apto 2-B",
  lastUpdated: "15/09/2023",
  housing: {
    type: "Apartamento",
    ownership: "Propia",
    roof: "Platabanda",
    floor: "Cerámica",
    rooms: 3
  },
  needs: {
    water: "Tubería",
    gas: "Bombona",
    electricity: "Estable",
    internet: true,
    foodBag: true
  },
  members: [
    { id: "1", name: "María González", relation: "Jefe/a", age: 34, occupation: "Educadora/Comerciante", condition: "Ninguna" },
    { id: "2", name: "Pedro Pérez", relation: "Pareja", age: 38, occupation: "Mecánico", condition: "Ninguna" },
    { id: "3", name: "Sofía Pérez", relation: "Hijo/a", age: 8, occupation: "Estudiante", condition: "Ninguna" },
    { id: "4", name: "Carmen Díaz", relation: "Padre/Madre", age: 68, occupation: "Jubilada", condition: "Enfermedad Crónica" }
  ]
};

export const MOCK_NOTIFICATIONS: AppNotification[] = [
  { id: '1', type: 'alert', title: 'Corte de Agua Programado', message: 'Hidrocapital informa parada de mantenimiento por 24h a partir de mañana.', time: 'Hace 30m', read: false, priority: true },
  { id: '2', type: 'community', title: 'Llegada del Gas', message: 'El camión de GLP estará en la Calle 3 a las 2:00 PM.', time: 'Hace 2h', read: false },
  { id: '3', type: 'system', title: 'Reporte Aprobado', message: 'Tu incidencia "Hueco en la vía" ha sido clasificada como ALTA prioridad por la IA.', time: 'Ayer', read: true },
  { id: '4', type: 'personal', title: 'Recordatorio de Votación', message: 'La propuesta de presupuesto participativo cierra en 48 horas.', time: 'Ayer', read: true },
];

export const MOCK_MINORS: MinorProfile[] = [
  {
    id: "M-001",
    guardianId: "1", // Linked to María González
    name: "Sofía Pérez",
    dateOfBirth: "2015-05-15",
    age: 8,
    gender: "F",
    bloodType: "O+",
    allergies: ["Maní"],
    conditions: ["Asma Leve"],
    disability: false,
    birthCertificateVerified: true,
    emergencyContact: {
      name: "María González",
      relation: "Madre",
      phone: "0412-1234567"
    }
  },
  {
    id: "M-002",
    guardianId: "1",
    name: "Luisito Pérez",
    dateOfBirth: "2005-08-20", // 18 years old test
    age: 18,
    gender: "M",
    bloodType: "A+",
    allergies: [],
    conditions: [],
    disability: false,
    birthCertificateVerified: true,
    emergencyContact: {
      name: "Pedro Pérez",
      relation: "Padre",
      phone: "0416-5555555"
    }
  }
];