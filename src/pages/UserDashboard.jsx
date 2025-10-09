import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { mockDataService } from '../services/mockData';
import './UserDashboard.css';

const UserDashboard = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('browse');
  const [services, setServices] = useState([]);
  const [infrastructure, setInfrastructure] = useState([]);
  const [amenities, setAmenities] = useState([]);
  const [reports, setReports] = useState([]);
  const [feedback, setFeedback] = useState([]);
  const [showReportForm, setShowReportForm] = useState(false);
  const [showFeedbackForm, setShowFeedbackForm] = useState(false);

  const [reportForm, setReportForm] = useState({
    category: 'service',
    title: '',
    description: '',
    location: '',
    priority: 'medium'
  });

  const [feedbackForm, setFeedbackForm] = useState({
    subject: '',
    message: '',
    rating: 5
  });

  useEffect(() => {
    loadData();
  }, [user]);

  const loadData = () => {
    setServices(mockDataService.getCityServices());
    setInfrastructure(mockDataService.getInfrastructure());
    setAmenities(mockDataService.getAmenities());
    setReports(mockDataService.getReports(user.id));
    setFeedback(mockDataService.getFeedback(user.id));
  };

  const handleReportSubmit = (e) => {
    e.preventDefault();
    mockDataService.addReport({ ...reportForm, userId: user.id });
    setReportForm({
      category: 'service',
      title: '',
      description: '',
      location: '',
      priority: 'medium'
    });
    setShowReportForm(false);
    loadData();
  };

  const handleFeedbackSubmit = (e) => {
    e.preventDefault();
    mockDataService.addFeedback({ ...feedbackForm, userId: user.id });
    setFeedbackForm({
      subject: '',
      message: '',
      rating: 5
    });
    setShowFeedbackForm(false);
    loadData();
  };

  const getStatusColor = (status) => {
    const colors = {
      pending: '#ff9800',
      in_progress: '#2196F3',
      resolved: '#4CAF50',
      closed: '#9e9e9e',
      new: '#ff9800',
      reviewed: '#2196F3',
      responded: '#4CAF50'
    };
    return colors[status] || '#666';
  };

  return (
    <div className="user-dashboard">
      <div className="dashboard-header">
        <h1>User Dashboard</h1>
        <p>Welcome back, {user.fullName}!</p>
      </div>

      <div className="dashboard-tabs">
        <button
          className={activeTab === 'browse' ? 'tab-button active' : 'tab-button'}
          onClick={() => setActiveTab('browse')}
        >
          Browse
        </button>
        <button
          className={activeTab === 'reports' ? 'tab-button active' : 'tab-button'}
          onClick={() => setActiveTab('reports')}
        >
          My Reports
        </button>
        <button
          className={activeTab === 'feedback' ? 'tab-button active' : 'tab-button'}
          onClick={() => setActiveTab('feedback')}
        >
          My Feedback
        </button>
      </div>

      <div className="dashboard-content">
        {activeTab === 'browse' && (
          <div className="browse-section">
            <div className="section-header">
              <h2>City Services</h2>
            </div>
            <div className="items-grid">
              {services.map(service => (
                <div key={service.id} className="item-card">
                  <h3>{service.name}</h3>
                  <span className="item-badge">{service.category}</span>
                  <p>{service.description}</p>
                  <div className="item-details">
                    <p><strong>Location:</strong> {service.location}</p>
                    <p><strong>Contact:</strong> {service.contact}</p>
                    <p><strong>Status:</strong> <span style={{ color: getStatusColor(service.status) }}>{service.status}</span></p>
                  </div>
                </div>
              ))}
            </div>

            <div className="section-header">
              <h2>Infrastructure</h2>
            </div>
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
                </div>
              ))}
            </div>

            <div className="section-header">
              <h2>Amenities</h2>
            </div>
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
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'reports' && (
          <div className="reports-section">
            <div className="section-header">
              <h2>My Reports</h2>
              <button onClick={() => setShowReportForm(!showReportForm)} className="action-button">
                {showReportForm ? 'Cancel' : 'Submit New Report'}
              </button>
            </div>

            {showReportForm && (
              <form onSubmit={handleReportSubmit} className="form-container">
                <div className="form-group">
                  <label>Category</label>
                  <select
                    value={reportForm.category}
                    onChange={(e) => setReportForm({ ...reportForm, category: e.target.value })}
                  >
                    <option value="service">Service</option>
                    <option value="infrastructure">Infrastructure</option>
                    <option value="amenity">Amenity</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>Title</label>
                  <input
                    type="text"
                    value={reportForm.title}
                    onChange={(e) => setReportForm({ ...reportForm, title: e.target.value })}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Description</label>
                  <textarea
                    value={reportForm.description}
                    onChange={(e) => setReportForm({ ...reportForm, description: e.target.value })}
                    required
                    rows="4"
                  />
                </div>

                <div className="form-group">
                  <label>Location</label>
                  <input
                    type="text"
                    value={reportForm.location}
                    onChange={(e) => setReportForm({ ...reportForm, location: e.target.value })}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Priority</label>
                  <select
                    value={reportForm.priority}
                    onChange={(e) => setReportForm({ ...reportForm, priority: e.target.value })}
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                </div>

                <button type="submit" className="submit-button">Submit Report</button>
              </form>
            )}

            <div className="items-grid">
              {reports.length === 0 ? (
                <p className="empty-message">No reports submitted yet</p>
              ) : (
                reports.map(report => (
                  <div key={report.id} className="item-card">
                    <h3>{report.title}</h3>
                    <span className="item-badge">{report.category}</span>
                    <p>{report.description}</p>
                    <div className="item-details">
                      <p><strong>Location:</strong> {report.location}</p>
                      <p><strong>Priority:</strong> {report.priority}</p>
                      <p>
                        <strong>Status:</strong>{' '}
                        <span style={{ color: getStatusColor(report.status) }}>
                          {report.status}
                        </span>
                      </p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {activeTab === 'feedback' && (
          <div className="feedback-section">
            <div className="section-header">
              <h2>My Feedback</h2>
              <button onClick={() => setShowFeedbackForm(!showFeedbackForm)} className="action-button">
                {showFeedbackForm ? 'Cancel' : 'Submit Feedback'}
              </button>
            </div>

            {showFeedbackForm && (
              <form onSubmit={handleFeedbackSubmit} className="form-container">
                <div className="form-group">
                  <label>Subject</label>
                  <input
                    type="text"
                    value={feedbackForm.subject}
                    onChange={(e) => setFeedbackForm({ ...feedbackForm, subject: e.target.value })}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Message</label>
                  <textarea
                    value={feedbackForm.message}
                    onChange={(e) => setFeedbackForm({ ...feedbackForm, message: e.target.value })}
                    required
                    rows="5"
                  />
                </div>

                <div className="form-group">
                  <label>Rating (1-5)</label>
                  <input
                    type="number"
                    min="1"
                    max="5"
                    value={feedbackForm.rating}
                    onChange={(e) => setFeedbackForm({ ...feedbackForm, rating: parseInt(e.target.value) })}
                  />
                </div>

                <button type="submit" className="submit-button">Submit Feedback</button>
              </form>
            )}

            <div className="items-grid">
              {feedback.length === 0 ? (
                <p className="empty-message">No feedback submitted yet</p>
              ) : (
                feedback.map(item => (
                  <div key={item.id} className="item-card">
                    <h3>{item.subject}</h3>
                    <p>{item.message}</p>
                    <div className="item-details">
                      <p><strong>Rating:</strong> {'★'.repeat(item.rating)}</p>
                      <p>
                        <strong>Status:</strong>{' '}
                        <span style={{ color: getStatusColor(item.status) }}>
                          {item.status}
                        </span>
                      </p>
                      {item.adminResponse && (
                        <div className="admin-response">
                          <strong>Admin Response:</strong>
                          <p>{item.adminResponse}</p>
                        </div>
                      )}
                    </div>
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

export default UserDashboard;
