import React, { useEffect, useState } from 'react';
import './APTDashboard.css';

const API_URL = 'https://tweetbeacon-demo.vercel.app/api/apt-groups';

const fetchAPTData = async () => {
  try {
    const response = await fetch(API_URL);
    if (!response.ok) {
      throw new Error(`Failed to fetch: ${response.statusText}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching APT data:', error);
    return [];
  }
};

const APTDashboard = () => {
  const [aptGroups, setAptGroups] = useState([]);
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCountry, setSelectedCountry] = useState('');
  const [selectedSector, setSelectedSector] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadAPTData = async () => {
      try {
        setLoading(true);
        const data = await fetchAPTData();
        setAptGroups(data);
      } catch (err) {
        setError('Failed to load APT group data. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    loadAPTData();
  }, []);

  const filteredGroups = aptGroups.filter(group => {
    const matchesSearch = group['APT Name'].toLowerCase().includes(searchTerm.toLowerCase()) ||
                         group['Description'].toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCountry = !selectedCountry || group['Country of Origin'] === selectedCountry;
    const matchesSector = !selectedSector || group['Sectors'].includes(selectedSector);
    return matchesSearch && matchesCountry && matchesSector;
  });

  const uniqueCountries = [...new Set(aptGroups.map(group => group['Country of Origin']))].filter(Boolean);
  const uniqueSectors = [...new Set(aptGroups.flatMap(group => group['Sectors'].split(', ')))].filter(Boolean);

  if (loading) {
    return (
      <div className="loading-state">
        <div className="loading-spinner"></div>
        <p>Loading APT group data...</p>
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

  return (
    <div className="apt-dashboard">
      <div className="apt-controls">
        <input
          type="text"
          className="apt-search"
          placeholder="Search APT groups..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <select
          className="apt-filter"
          value={selectedCountry}
          onChange={(e) => setSelectedCountry(e.target.value)}
        >
          <option value="">All Countries</option>
          {uniqueCountries.map(country => (
            <option key={country} value={country}>{country}</option>
          ))}
        </select>
        <select
          className="apt-filter"
          value={selectedSector}
          onChange={(e) => setSelectedSector(e.target.value)}
        >
          <option value="">All Sectors</option>
          {uniqueSectors.map(sector => (
            <option key={sector} value={sector}>{sector}</option>
          ))}
        </select>
      </div>

      <div className="apt-grid">
        {filteredGroups.map(group => (
          <div
            key={group['APT Name']}
            className={`apt-card ${selectedGroup?.['APT Name'] === group['APT Name'] ? 'selected' : ''}`}
            onClick={() => setSelectedGroup(group)}
          >
            <h3>{group['APT Name']}</h3>
            <p>{group['Description']}</p>
            <p>Country: {group['Country of Origin']}</p>
            <div>
              {group['Sectors'].split(', ').map(sector => (
                <span key={sector} className="tag">{sector}</span>
              ))}
            </div>
          </div>
        ))}
      </div>

      {selectedGroup && (
        <div className="apt-details">
          <h2>{selectedGroup['APT Name']}</h2>
          <div className="apt-details-grid">
            <div className="apt-details-section">
              <h4>Description</h4>
              <p>{selectedGroup['Description']}</p>
            </div>
            <div className="apt-details-section">
              <h4>Country of Origin</h4>
              <p>{selectedGroup['Country of Origin']}</p>
            </div>
            <div className="apt-details-section">
              <h4>Targeted Sectors</h4>
              <ul>
                {selectedGroup['Sectors'].split(', ').map(sector => (
                  <li key={sector}>{sector}</li>
                ))}
              </ul>
            </div>
            <div className="apt-details-section">
              <h4>Tools and Techniques</h4>
              <ul>
                {selectedGroup['Tools Used'].split(', ').map(tool => (
                  <li key={tool}>{tool}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default APTDashboard;
