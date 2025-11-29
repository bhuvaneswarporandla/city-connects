// Keys used in localStorage to persist demo state
const STORAGE_KEY = 'city_connects_state_v1';

let users = [
  { id: '1', email: 'admin@smartcity.com', password: 'admin123', role: 'admin', fullName: 'Admin User' },
  { id: '2', email: 'user@smartcity.com', password: 'user123', role: 'user', fullName: 'John Doe' }
];

let cityServices = [
  { id: '1', name: 'City Hospital', category: 'healthcare', description: '24/7 emergency services and general healthcare', location: '123 Health St', contact: '555-0100', status: 'active' },
  { id: '2', name: 'Central Library', category: 'education', description: 'Public library with extensive collection', location: '456 Book Ave', contact: '555-0200', status: 'active' },
  { id: '3', name: 'Metro Transit', category: 'transportation', description: 'City-wide public transportation', location: 'Downtown Hub', contact: '555-0300', status: 'active' }
];

let infrastructure = [
  { id: '1', name: 'Main Bridge', type: 'bridges', description: 'Primary river crossing', location: 'River District', condition: 'good', maintenanceSchedule: 'Quarterly' },
  { id: '2', name: 'Highway 101', type: 'roads', description: 'Main highway through city', location: 'North-South corridor', condition: 'excellent', maintenanceSchedule: 'Annual' },
  { id: '3', name: 'Water Treatment Plant', type: 'utilities', description: 'City water processing facility', location: 'West Side', condition: 'fair', maintenanceSchedule: 'Monthly' }
];

let amenities = [
  { id: '1', name: 'Central Park', category: 'parks', description: 'Large urban park with trails', location: 'City Center', hours: '6 AM - 10 PM', facilities: 'Playground, trails, picnic areas' },
  { id: '2', name: 'Community Center', category: 'community centers', description: 'Recreation and community programs', location: '789 Community Blvd', hours: '8 AM - 8 PM', facilities: 'Gym, meeting rooms, classes' },
  { id: '3', name: 'Public Pool', category: 'recreation', description: 'Olympic-sized swimming pool', location: '321 Swim Lane', hours: '6 AM - 9 PM', facilities: 'Pool, locker rooms, sauna' }
];

let reports = [];
let feedback = [];
let currentUser = null;

// Load persisted state (if present) to keep demo changes across reloads
const loadState = () => {
  try {
    if (typeof localStorage === 'undefined') return;
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return;
    const state = JSON.parse(raw);
    if (state.users) users = state.users;
    if (state.cityServices) cityServices = state.cityServices;
    if (state.infrastructure) infrastructure = state.infrastructure;
    if (state.amenities) amenities = state.amenities;
    if (state.reports) reports = state.reports;
    if (state.feedback) feedback = state.feedback;
    if (state.currentUser) currentUser = state.currentUser;
  } catch (err) {
    // ignore corrupt state and fall back to defaults
    console.warn('Failed to load persisted demo state', err);
  }
};

const saveState = () => {
  try {
    if (typeof localStorage === 'undefined') return;
    const state = { users, cityServices, infrastructure, amenities, reports, feedback, currentUser };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (err) {
    console.warn('Failed to persist demo state', err);
  }
};

// initialize from storage
loadState();

export const mockDataService = {
  login: (email, password) => {
    const user = users.find(u => u.email === email && u.password === password);
    if (user) {
      currentUser = { ...user };
      delete currentUser.password;
      saveState();
      return { success: true, user: currentUser };
    }
    return { success: false, error: 'Invalid credentials' };
  },

  register: (email, password, fullName, role = 'user') => {
    if (users.find(u => u.email === email)) {
      return { success: false, error: 'Email already exists' };
    }
    const newUser = {
      id: Date.now().toString(),
      email,
      password,
      fullName,
      role
    };
    users.push(newUser);
    currentUser = { ...newUser };
    delete currentUser.password;
    saveState();
    return { success: true, user: currentUser };
  },

  // Accept a Google profile-like object ({ email, fullName }) and either
  // return the existing user or create a new one. This helps demo OAuth flows
  // without a backend for a client-only app.
  signInWithGoogle: (profile) => {
    if (!profile || !profile.email) {
      return { success: false, error: 'Invalid Google profile' };
    }

    // If a user already exists with this email, treat it like a login
    const user = users.find(u => u.email === profile.email);
    if (user) {
      currentUser = { ...user };
      delete currentUser.password;
      saveState();
      return { success: true, user: currentUser, created: false };
    }

    // Otherwise create a new user record based on the Google profile
    const newUser = {
      id: Date.now().toString(),
      email: profile.email,
      password: '', // no local password for OAuth-created users in mock
      fullName: profile.fullName || profile.name || '',
      role: 'user'
    };
    users.push(newUser);
    currentUser = { ...newUser };
    delete currentUser.password;
    saveState();
    return { success: true, user: currentUser, created: true };
  },

  logout: () => {
    currentUser = null;
    saveState();
    return { success: true };
  },

  getCurrentUser: () => currentUser,

  getCityServices: () => cityServices,

  addCityService: (service) => {
    const newService = { ...service, id: Date.now().toString() };
    cityServices.push(newService);
    saveState();
    return newService;
  },

  updateCityService: (id, service) => {
    const index = cityServices.findIndex(s => s.id === id);
    if (index !== -1) {
      cityServices[index] = { ...cityServices[index], ...service };
      saveState();
      return cityServices[index];
    }
    return null;
  },

  deleteCityService: (id) => {
    cityServices = cityServices.filter(s => s.id !== id);
    saveState();
    return { success: true };
  },

  getInfrastructure: () => infrastructure,

  addInfrastructure: (item) => {
    const newItem = { ...item, id: Date.now().toString() };
    infrastructure.push(newItem);
    saveState();
    return newItem;
  },

  updateInfrastructure: (id, item) => {
    const index = infrastructure.findIndex(i => i.id === id);
    if (index !== -1) {
      infrastructure[index] = { ...infrastructure[index], ...item };
      saveState();
      return infrastructure[index];
    }
    return null;
  },

  deleteInfrastructure: (id) => {
    infrastructure = infrastructure.filter(i => i.id !== id);
    saveState();
    return { success: true };
  },

  getAmenities: () => amenities,

  addAmenity: (amenity) => {
    const newAmenity = { ...amenity, id: Date.now().toString() };
    amenities.push(newAmenity);
    saveState();
    return newAmenity;
  },

  updateAmenity: (id, amenity) => {
    const index = amenities.findIndex(a => a.id === id);
    if (index !== -1) {
      amenities[index] = { ...amenities[index], ...amenity };
      saveState();
      return amenities[index];
    }
    return null;
  },

  deleteAmenity: (id) => {
    amenities = amenities.filter(a => a.id !== id);
    saveState();
    return { success: true };
  },

  getReports: (userId = null) => {
    // return a fresh shallow copy of reports (and items) so callers get a new
    // reference and React state setters will detect changes after updates
    if (userId) {
      return reports.filter(r => r.userId === userId).map(r => ({ ...r }));
    }
    return reports.map(r => ({ ...r }));
  },

  addReport: (report) => {
    const newReport = {
      ...report,
      id: Date.now().toString(),
      status: 'pending',
      createdAt: new Date().toISOString()
    };
    reports.push(newReport);
    saveState();
    return newReport;
  },

  updateReport: (id, updates) => {
    const index = reports.findIndex(r => r.id === id);
    if (index !== -1) {
      reports[index] = { ...reports[index], ...updates };
      saveState();
      return reports[index];
    }
    return null;
  },

  getFeedback: (userId = null) => {
    if (userId) {
      return feedback.filter(f => f.userId === userId);
    }
    return feedback;
  },

  addFeedback: (feedbackItem) => {
    const newFeedback = {
      ...feedbackItem,
      id: Date.now().toString(),
      status: 'new',
      adminResponse: '',
      createdAt: new Date().toISOString()
    };
    feedback.push(newFeedback);
    saveState();
    return newFeedback;
  },

  updateFeedback: (id, updates) => {
    const index = feedback.findIndex(f => f.id === id);
    if (index !== -1) {
      feedback[index] = { ...feedback[index], ...updates };
      saveState();
      return feedback[index];
    }
    return null;
  },

  searchAll: (query) => {
    const lowerQuery = query.toLowerCase();
    return {
      services: cityServices.filter(s =>
        s.name.toLowerCase().includes(lowerQuery) ||
        s.description.toLowerCase().includes(lowerQuery) ||
        s.category.toLowerCase().includes(lowerQuery)
      ),
      infrastructure: infrastructure.filter(i =>
        i.name.toLowerCase().includes(lowerQuery) ||
        i.description.toLowerCase().includes(lowerQuery) ||
        i.type.toLowerCase().includes(lowerQuery)
      ),
      amenities: amenities.filter(a =>
        a.name.toLowerCase().includes(lowerQuery) ||
        a.description.toLowerCase().includes(lowerQuery) ||
        a.category.toLowerCase().includes(lowerQuery)
      )
    };
  }
};
