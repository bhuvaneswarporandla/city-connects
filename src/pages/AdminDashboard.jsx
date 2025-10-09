import { useState, useEffect } from 'react';
import { mockDataService } from '../services/mockData';
import './AdminDashboard.css';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('services');
  const [services, setServices] = useState([]);
  const [infrastructure, setInfrastructure] = useState([]);
  const [amenities, setAmenities] = useState([]);
  const [reports, setReports] = useState([]);
  const [feedback, setFeedback] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingItem, setEditingItem] = useState(null);

  const [serviceForm, setServiceForm] = useState({
    name: '', category: '', description: '', location: '', contact: '', status: 'active'
  });

  const [infrastructureForm, setInfrastructureForm] = useState({
    name: '', type: '', description: '', location: '', condition: 'good', maintenanceSchedule: ''
  });

  const [amenityForm, setAmenityForm] = useState({
    name: '', category: '', description: '', location: '', hours: '', facilities: ''
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    setServices(mockDataService.getCityServices());
    setInfrastructure(mockDataService.getInfrastructure());
    setAmenities(mockDataService.getAmenities());
    setReports(mockDataService.getReports());
    setFeedback(mockDataService.getFeedback());
  };

  const resetForms = () => {
    setServiceForm({ name: '', category: '', description: '', location: '', contact: '', status: 'active' });
    setInfrastructureForm({ name: '', type: '', description: '', location: '', condition: 'good', maintenanceSchedule: '' });
    setAmenityForm({ name: '', category: '', description: '', location: '', hours: '', facilities: '' });
    setEditingItem(null);
    setShowForm(false);
  };

  const handleServiceSubmit = (e) => {
    e.preventDefault();
    if (editingItem) {
      mockDataService.updateCityService(editingItem.id, serviceForm);
    } else {
      mockDataService.addCityService(serviceForm);
    }
    resetForms();
    loadData();
  };

  const handleInfrastructureSubmit = (e) => {
    e.preventDefault();
    if (editingItem) {
      mockDataService.updateInfrastructure(editingItem.id, infrastructureForm);
    } else {
      mockDataService.addInfrastructure(infrastructureForm);
    }
    resetForms();
    loadData();
  };

  const handleAmenitySubmit = (e) => {
    e.preventDefault();
    if (editingItem) {
      mockDataService.updateAmenity(editingItem.id, amenityForm);
    } else {
      mockDataService.addAmenity(amenityForm);
    }
    resetForms();
    loadData();
  };

  const handleEdit = (item, type) => {
    setEditingItem(item);
    setShowForm(true);
    if (type === 'service') {
      setServiceForm(item);
    } else if (type === 'infrastructure') {
      setInfrastructureForm(item);
    } else if (type === 'amenity') {
      setAmenityForm(item);
    }
  };

  const handleDelete = (id, type) => {
    if (window.confirm('Are you sure you want to delete this item?')) {
      if (type === 'service') {
        mockDataService.deleteCityService(id);
      } else if (type === 'infrastructure') {
        mockDataService.deleteInfrastructure(id);
      } else if (type === 'amenity') {
        mockDataService.deleteAmenity(id);
      }
      loadData();
    }
  };

  const handleReportStatusUpdate = (id, status) => {
    mockDataService.updateReport(id, { status });
    loadData();
  };

  const handleFeedbackResponse = (id, response) => {
    mockDataService.updateFeedback(id, { adminResponse: response, status: 'responded' });
    loadData();
  };

  return (
    <div className="admin-dashboard">
      <div className="dashboard-header">
        <h1>Admin Dashboard</h1>
        <p>Manage city services, infrastructure, and amenities</p>
      </div>

      <div className="dashboard-tabs">
        <button
          className={activeTab === 'services' ? 'tab-button active' : 'tab-button'}
          onClick={() => { setActiveTab('services'); resetForms(); }}
        >
          Services
        </button>
        <button
          className={activeTab === 'infrastructure' ? 'tab-button active' : 'tab-button'}
          onClick={() => { setActiveTab('infrastructure'); resetForms(); }}
        >
          Infrastructure
        </button>
        <button
          className={activeTab === 'amenities' ? 'tab-button active' : 'tab-button'}
          onClick={() => { setActiveTab('amenities'); resetForms(); }}
        >
          Amenities
        </button>
        <button
          className={activeTab === 'reports' ? 'tab-button active' : 'tab-button'}
          onClick={() => { setActiveTab('reports'); resetForms(); }}
        >
          Reports ({reports.length})
        </button>
        <button
          className={activeTab === 'feedback' ? 'tab-button active' : 'tab-button'}
          onClick={() => { setActiveTab('feedback'); resetForms(); }}
        >
          Feedback ({feedback.length})
        </button>
      </div>

      <div className="dashboard-content">
        {activeTab === 'services' && (
          <div className="admin-section">
            <div className="section-header">
              <h2>City Services</h2>
              <button onClick={() => setShowForm(!showForm)} className="action-button">
                {showForm ? 'Cancel' : 'Add New Service'}
              </button>
            </div>

            {showForm && (
              <form onSubmit={handleServiceSubmit} className="form-container">
                <div className="form-row">
                  <div className="form-group">
                    <label>Name</label>
                    <input
                      type="text"
                      value={serviceForm.name}
                      onChange={(e) => setServiceForm({ ...serviceForm, name: e.target.value })}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Category</label>
                    <input
                      type="text"
                      value={serviceForm.category}
                      onChange={(e) => setServiceForm({ ...serviceForm, category: e.target.value })}
                      required
                    />
                  </div>
                </div>
                <div className="form-group">
                  <label>Description</label>
                  <textarea
                    value={serviceForm.description}
                    onChange={(e) => setServiceForm({ ...serviceForm, description: e.target.value })}
                    required
                    rows="3"
                  />
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label>Location</label>
                    <input
                      type="text"
                      value={serviceForm.location}
                      onChange={(e) => setServiceForm({ ...serviceForm, location: e.target.value })}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Contact</label>
                    <input
                      type="text"
                      value={serviceForm.contact}
                      onChange={(e) => setServiceForm({ ...serviceForm, contact: e.target.value })}
                      required
                    />
                  </div>
                </div>
                <div className="form-group">
                  <label>Status</label>
                  <select
                    value={serviceForm.status}
                    onChange={(e) => setServiceForm({ ...serviceForm, status: e.target.value })}
                  >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                    <option value="maintenance">Maintenance</option>
                  </select>
                </div>
                <button type="submit" className="submit-button">
                  {editingItem ? 'Update Service' : 'Add Service'}
                </button>
              </form>
            )}

            <div className="items-grid">
              {services.map(service => (
                <div key={service.id} className="item-card">
                  <h3>{service.name}</h3>
                  <span className="item-badge">{service.category}</span>
                  <p>{service.description}</p>
                  <div className="item-details">
                    <p><strong>Location:</strong> {service.location}</p>
                    <p><strong>Contact:</strong> {service.contact}</p>
                    <p><strong>Status:</strong> {service.status}</p>
                  </div>
                  <div className="card-actions">
                    <button onClick={() => handleEdit(service, 'service')} className="edit-button">Edit</button>
                    <button onClick={() => handleDelete(service.id, 'service')} className="delete-button">Delete</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'infrastructure' && (
          <div className="admin-section">
            <div className="section-header">
              <h2>Infrastructure</h2>
              <button onClick={() => setShowForm(!showForm)} className="action-button">
                {showForm ? 'Cancel' : 'Add New Infrastructure'}
              </button>
            </div>

            {showForm && (
              <form onSubmit={handleInfrastructureSubmit} className="form-container">
                <div className="form-row">
                  <div className="form-group">
                    <label>Name</label>
                    <input
                      type="text"
                      value={infrastructureForm.name}
                      onChange={(e) => setInfrastructureForm({ ...infrastructureForm, name: e.target.value })}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Type</label>
                    <input
                      type="text"
                      value={infrastructureForm.type}
                      onChange={(e) => setInfrastructureForm({ ...infrastructureForm, type: e.target.value })}
                      required
                    />
                  </div>
                </div>
                <div className="form-group">
                  <label>Description</label>
                  <textarea
                    value={infrastructureForm.description}
                    onChange={(e) => setInfrastructureForm({ ...infrastructureForm, description: e.target.value })}
                    required
                    rows="3"
                  />
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label>Location</label>
                    <input
                      type="text"
                      value={infrastructureForm.location}
                      onChange={(e) => setInfrastructureForm({ ...infrastructureForm, location: e.target.value })}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Condition</label>
                    <select
                      value={infrastructureForm.condition}
                      onChange={(e) => setInfrastructureForm({ ...infrastructureForm, condition: e.target.value })}
                    >
                      <option value="excellent">Excellent</option>
                      <option value="good">Good</option>
                      <option value="fair">Fair</option>
                      <option value="poor">Poor</option>
                    </select>
                  </div>
                </div>
                <div className="form-group">
                  <label>Maintenance Schedule</label>
                  <input
                    type="text"
                    value={infrastructureForm.maintenanceSchedule}
                    onChange={(e) => setInfrastructureForm({ ...infrastructureForm, maintenanceSchedule: e.target.value })}
                    required
                  />
                </div>
                <button type="submit" className="submit-button">
                  {editingItem ? 'Update Infrastructure' : 'Add Infrastructure'}
                </button>
              </form>
            )}

            <div className="items-grid">
              {infrastructure.map(item => (
                <div key={item.id} className="item-card">
                  <h3>{item.name}</h3>
                  <span className="item-badge">{item.type}</span>
                  <p>{item.description}</p>
                  <div className="item-details">
                    <p><strong>Location:</strong> {item.location}</p>
                    <p><strong>Condition:</strong> {item.condition}</p>
                    <p><strong>Maintenance:</strong> {item.maintenanceSchedule}</p>
                  </div>
                  <div className="card-actions">
                    <button onClick={() => handleEdit(item, 'infrastructure')} className="edit-button">Edit</button>
                    <button onClick={() => handleDelete(item.id, 'infrastructure')} className="delete-button">Delete</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'amenities' && (
          <div className="admin-section">
            <div className="section-header">
              <h2>Amenities</h2>
              <button onClick={() => setShowForm(!showForm)} className="action-button">
                {showForm ? 'Cancel' : 'Add New Amenity'}
              </button>
            </div>

            {showForm && (
              <form onSubmit={handleAmenitySubmit} className="form-container">
                <div className="form-row">
                  <div className="form-group">
                    <label>Name</label>
                    <input
                      type="text"
                      value={amenityForm.name}
                      onChange={(e) => setAmenityForm({ ...amenityForm, name: e.target.value })}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Category</label>
                    <input
                      type="text"
                      value={amenityForm.category}
                      onChange={(e) => setAmenityForm({ ...amenityForm, category: e.target.value })}
                      required
                    />
                  </div>
                </div>
                <div className="form-group">
                  <label>Description</label>
                  <textarea
                    value={amenityForm.description}
                    onChange={(e) => setAmenityForm({ ...amenityForm, description: e.target.value })}
                    required
                    rows="3"
                  />
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label>Location</label>
                    <input
                      type="text"
                      value={amenityForm.location}
                      onChange={(e) => setAmenityForm({ ...amenityForm, location: e.target.value })}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Hours</label>
                    <input
                      type="text"
                      value={amenityForm.hours}
                      onChange={(e) => setAmenityForm({ ...amenityForm, hours: e.target.value })}
                      required
                    />
                  </div>
                </div>
                <div className="form-group">
                  <label>Facilities</label>
                  <textarea
                    value={amenityForm.facilities}
                    onChange={(e) => setAmenityForm({ ...amenityForm, facilities: e.target.value })}
                    required
                    rows="2"
                  />
                </div>
                <button type="submit" className="submit-button">
                  {editingItem ? 'Update Amenity' : 'Add Amenity'}
                </button>
              </form>
            )}

            <div className="items-grid">
              {amenities.map(amenity => (
                <div key={amenity.id} className="item-card">
                  <h3>{amenity.name}</h3>
                  <span className="item-badge">{amenity.category}</span>
                  <p>{amenity.description}</p>
                  <div className="item-details">
                    <p><strong>Location:</strong> {amenity.location}</p>
                    <p><strong>Hours:</strong> {amenity.hours}</p>
                    <p><strong>Facilities:</strong> {amenity.facilities}</p>
                  </div>
                  <div className="card-actions">
                    <button onClick={() => handleEdit(amenity, 'amenity')} className="edit-button">Edit</button>
                    <button onClick={() => handleDelete(amenity.id, 'amenity')} className="delete-button">Delete</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'reports' && (
          <div className="admin-section">
            <div className="section-header">
              <h2>User Reports</h2>
            </div>

            <div className="items-grid">
              {reports.length === 0 ? (
                <p className="empty-message">No reports submitted</p>
              ) : (
                reports.map(report => (
                  <div key={report.id} className="item-card">
                    <h3>{report.title}</h3>
                    <span className="item-badge">{report.category}</span>
                    <p>{report.description}</p>
                    <div className="item-details">
                      <p><strong>Location:</strong> {report.location}</p>
                      <p><strong>Priority:</strong> {report.priority}</p>
                      <p><strong>Status:</strong> {report.status}</p>
                    </div>
                    <div className="status-actions">
                      <label>Update Status:</label>
                      <select
                        value={report.status}
                        onChange={(e) => handleReportStatusUpdate(report.id, e.target.value)}
                        className="status-select"
                      >
                        <option value="pending">Pending</option>
                        <option value="in_progress">In Progress</option>
                        <option value="resolved">Resolved</option>
                        <option value="closed">Closed</option>
                      </select>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {activeTab === 'feedback' && (
          <div className="admin-section">
            <div className="section-header">
              <h2>User Feedback</h2>
            </div>

            <div className="items-grid">
              {feedback.length === 0 ? (
                <p className="empty-message">No feedback submitted</p>
              ) : (
                feedback.map(item => (
                  <div key={item.id} className="item-card">
                    <h3>{item.subject}</h3>
                    <p>{item.message}</p>
                    <div className="item-details">
                      <p><strong>Rating:</strong> {'★'.repeat(item.rating)}</p>
                      <p><strong>Status:</strong> {item.status}</p>
                    </div>
                    {item.adminResponse ? (
                      <div className="admin-response">
                        <strong>Your Response:</strong>
                        <p>{item.adminResponse}</p>
                      </div>
                    ) : (
                      <div className="response-form">
                        <label>Add Response:</label>
                        <textarea
                          id={`response-${item.id}`}
                          rows="3"
                          placeholder="Type your response..."
                        />
                        <button
                          onClick={() => {
                            const response = document.getElementById(`response-${item.id}`).value;
                            if (response.trim()) {
                              handleFeedbackResponse(item.id, response);
                            }
                          }}
                          className="submit-button"
                        >
                          Send Response
                        </button>
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
