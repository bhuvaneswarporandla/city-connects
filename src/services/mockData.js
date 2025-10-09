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

export const mockDataService = {
  login: (email, password) => {
    const user = users.find(u => u.email === email && u.password === password);
    if (user) {
      currentUser = { ...user };
      delete currentUser.password;
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
    return { success: true, user: currentUser };
  },

  logout: () => {
    currentUser = null;
    return { success: true };
  },

  getCurrentUser: () => currentUser,

  getCityServices: () => cityServices,

  addCityService: (service) => {
    const newService = { ...service, id: Date.now().toString() };
    cityServices.push(newService);
    return newService;
  },

  updateCityService: (id, service) => {
    const index = cityServices.findIndex(s => s.id === id);
    if (index !== -1) {
      cityServices[index] = { ...cityServices[index], ...service };
      return cityServices[index];
    }
    return null;
  },

  deleteCityService: (id) => {
    cityServices = cityServices.filter(s => s.id !== id);
    return { success: true };
  },

  getInfrastructure: () => infrastructure,

  addInfrastructure: (item) => {
    const newItem = { ...item, id: Date.now().toString() };
    infrastructure.push(newItem);
    return newItem;
  },

  updateInfrastructure: (id, item) => {
    const index = infrastructure.findIndex(i => i.id === id);
    if (index !== -1) {
      infrastructure[index] = { ...infrastructure[index], ...item };
      return infrastructure[index];
    }
    return null;
  },

  deleteInfrastructure: (id) => {
    infrastructure = infrastructure.filter(i => i.id !== id);
    return { success: true };
  },

  getAmenities: () => amenities,

  addAmenity: (amenity) => {
    const newAmenity = { ...amenity, id: Date.now().toString() };
    amenities.push(newAmenity);
    return newAmenity;
  },

  updateAmenity: (id, amenity) => {
    const index = amenities.findIndex(a => a.id === id);
    if (index !== -1) {
      amenities[index] = { ...amenities[index], ...amenity };
      return amenities[index];
    }
    return null;
  },

  deleteAmenity: (id) => {
    amenities = amenities.filter(a => a.id !== id);
    return { success: true };
  },

  getReports: (userId = null) => {
    if (userId) {
      return reports.filter(r => r.userId === userId);
    }
    return reports;
  },

  addReport: (report) => {
    const newReport = {
      ...report,
      id: Date.now().toString(),
      status: 'pending',
      createdAt: new Date().toISOString()
    };
    reports.push(newReport);
    return newReport;
  },

  updateReport: (id, updates) => {
    const index = reports.findIndex(r => r.id === id);
    if (index !== -1) {
      reports[index] = { ...reports[index], ...updates };
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
    return newFeedback;
  },

  updateFeedback: (id, updates) => {
    const index = feedback.findIndex(f => f.id === id);
    if (index !== -1) {
      feedback[index] = { ...feedback[index], ...updates };
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
