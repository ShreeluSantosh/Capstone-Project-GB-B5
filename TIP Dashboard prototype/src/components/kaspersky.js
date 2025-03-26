// src/components/Kaspersky.js
import React, { useState, useEffect } from 'react';
import './components.css';

const API_URL = 'https://tweetbeacon-demo.vercel.app/api/threats';

const Kaspersky = () => {
  const [threats, setThreats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedRegion, setSelectedRegion] = useState('');
  const [selectedThreatType, setSelectedThreatType] = useState('');

  useEffect(() => {
    const fetchThreats = async () => {
      try {
        setLoading(true);
        const response = await fetch(API_URL);
        if (!response.ok) {
          throw new Error('Failed to fetch threat data');
        }
        const data = await response.json();
        setThreats(data);
      } catch (err) {
        setError('Failed to load threat data. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchThreats();
  }, []);

  if (loading) {
    return (
      <div className="loading-state">
        <div className="loading-spinner"></div>
        <p>Loading threat map data...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-state">
        <h3>Error</h3>
        <p>{error}</p>
        <button onClick={() => window.location.reload()}>Retry</button>
      </div>
    );
  }

  const regions = [...new Set(threats.map(threat => threat.region))];
  const threatTypes = [...new Set(threats.map(threat => threat.type))];

  const filteredThreats = threats.filter(threat => {
    const matchesRegion = !selectedRegion || threat.region === selectedRegion;
    const matchesType = !selectedThreatType || threat.type === selectedThreatType;
    return matchesRegion && matchesType;
  });

  return (
    <div className="component-container">
      <div className="filter-group">
        <select
          className="filter-select"
          value={selectedRegion}
          onChange={(e) => setSelectedRegion(e.target.value)}
        >
          <option value="">All Regions</option>
          {regions.map(region => (
            <option key={region} value={region}>{region}</option>
          ))}
        </select>
        <select
          className="filter-select"
          value={selectedThreatType}
          onChange={(e) => setSelectedThreatType(e.target.value)}
        >
          <option value="">All Threat Types</option>
          {threatTypes.map(type => (
            <option key={type} value={type}>{type}</option>
          ))}
        </select>
      </div>

      <div className="grid">
        {filteredThreats.map(threat => (
          <div key={threat.id} className="card">
            <div className="card-header">
              <h3>{threat.name}</h3>
              <span className="tag">{threat.type}</span>
            </div>
            <p>{threat.description}</p>
            <div className="details-section">
              <h4>Location</h4>
              <p>{threat.region}</p>
              <h4>Severity</h4>
              <p className={`severity-${threat.severity.toLowerCase()}`}>
                {threat.severity}
              </p>
            </div>
            <div className="card-footer">
              <span>{new Date(threat.timestamp).toLocaleString()}</span>
              <div className="card-actions">
                <button className="button">View Details</button>
                <button className="button secondary">Track</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Kaspersky;
