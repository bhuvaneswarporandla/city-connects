import { useState } from 'react';
import { mockDataService } from '../services/mockData';
import './Home.css';

const Home = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState(null);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      const results = mockDataService.searchAll(searchQuery);
      setSearchResults(results);
    }
  };

  const clearSearch = () => {
    setSearchQuery('');
    setSearchResults(null);
  };

  return (
    <div className="home">
      <section className="hero">
        <div className="hero-content">
          <h1>Welcome to City Connects Management</h1>
          <p>Your gateway to efficient city services, infrastructure, and amenities</p>

          <form className="search-form" onSubmit={handleSearch}>
            <input
              type="text"
              placeholder="Search services, infrastructure, amenities..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="search-input"
            />
            <button type="submit" className="search-button">Search</button>
            {searchResults && (
              <button type="button" onClick={clearSearch} className="clear-button">Clear</button>
            )}
          </form>
        </div>
      </section>

      {searchResults ? (
        <section className="search-results">
          <h2>Search Results for "{searchQuery}"</h2>

          {searchResults.services.length > 0 && (
            <div className="results-category">
              <h3>City Services</h3>
              <div className="results-grid">
                {searchResults.services.map(service => (
                  <div key={service.id} className="result-card">
                    <h4>{service.name}</h4>
                    <p className="category">{service.category}</p>
                    <p>{service.description}</p>
                    <p className="location">Location: {service.location}</p>
                    <p className="contact">Contact: {service.contact}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {searchResults.infrastructure.length > 0 && (
            <div className="results-category">
              <h3>Infrastructure</h3>
              <div className="results-grid">
                {searchResults.infrastructure.map(item => (
                  <div key={item.id} className="result-card">
                    <h4>{item.name}</h4>
                    <p className="category">{item.type}</p>
                    <p>{item.description}</p>
                    <p className="location">Location: {item.location}</p>
                    <p className="condition">Condition: {item.condition}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {searchResults.amenities.length > 0 && (
            <div className="results-category">
              <h3>Amenities</h3>
              <div className="results-grid">
                {searchResults.amenities.map(amenity => (
                  <div key={amenity.id} className="result-card">
                    <h4>{amenity.name}</h4>
                    <p className="category">{amenity.category}</p>
                    <p>{amenity.description}</p>
                    <p className="location">Location: {amenity.location}</p>
                    <p className="hours">Hours: {amenity.hours}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {searchResults.services.length === 0 &&
           searchResults.infrastructure.length === 0 &&
           searchResults.amenities.length === 0 && (
            <p className="no-results">No results found for "{searchQuery}"</p>
          )}
        </section>
      ) : (
        <>
          <section className="overview">
            <h2>City Overview</h2>
            <div className="overview-grid">
              <div className="overview-card">
                <h3>City Services</h3>
                <p>Access healthcare, education, and transportation services</p>
                <div className="overview-stats">
                  <span className="stat-number">{mockDataService.getCityServices().length}</span>
                  <span className="stat-label">Active Services</span>
                </div>
              </div>

              <div className="overview-card">
                <h3>Infrastructure</h3>
                <p>Monitor roads, bridges, and utilities maintenance</p>
                <div className="overview-stats">
                  <span className="stat-number">{mockDataService.getInfrastructure().length}</span>
                  <span className="stat-label">Infrastructure Items</span>
                </div>
              </div>

              <div className="overview-card">
                <h3>Amenities</h3>
                <p>Explore parks, libraries, and community centers</p>
                <div className="overview-stats">
                  <span className="stat-number">{mockDataService.getAmenities().length}</span>
                  <span className="stat-label">Available Amenities</span>
                </div>
              </div>
            </div>
          </section>

          <section className="features">
            <h2>Platform Features</h2>
            <div className="features-grid">
              <div className="feature-card">
                <h4>Browse Services</h4>
                <p>Discover city services, infrastructure, and amenities available to you</p>
              </div>

              <div className="feature-card">
                <h4>Report Issues</h4>
                <p>Submit reports about infrastructure problems or service concerns</p>
              </div>

              <div className="feature-card">
                <h4>Track Status</h4>
                <p>Monitor the progress of your submitted reports and feedback</p>
              </div>

              <div className="feature-card">
                <h4>Share Feedback</h4>
                <p>Help improve city services by providing valuable feedback</p>
              </div>
            </div>
          </section>
        </>
      )}
    </div>
  );
};

export default Home;
