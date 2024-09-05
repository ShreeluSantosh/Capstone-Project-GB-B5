// src/components/APTDashboard.js
import React, { useEffect, useState } from 'react';
import { fetchAPTData } from '../services/sheetService';
import './APTDashboard.css';

const APTDashboard = () => {
  const [aptGroups, setAptGroups] = useState([]);
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCountry, setSelectedCountry] = useState('');
  const [selectedSector, setSelectedSector] = useState('');

  useEffect(() => {
    const loadAPTData = async () => {
      const data = await fetchAPTData();
      setAptGroups(data);
    };
    loadAPTData();
  }, []);

  const handleGroupClick = (group) => {
    setSelectedGroup(group);
  };

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleCountryChange = (event) => {
    setSelectedCountry(event.target.value);
  };

  const handleSectorChange = (event) => {
    setSelectedSector(event.target.value);
  };

  const countries = [...new Set(aptGroups.map(group => group['Country of Origin']))];
  const sectors = [...new Set(aptGroups.flatMap(group => group['Sectors'].split(', ')))];

  const filteredGroups = aptGroups.filter(group =>
    group['APT Name'].toLowerCase().includes(searchTerm.toLowerCase()) &&
    (selectedCountry === '' || group['Country of Origin'] === selectedCountry) &&
    (selectedSector === '' || group['Sectors'].includes(selectedSector))
  );

  return (
    <div className="apt-dashboard">
      <div className="apt-filters">
        <input
          type="text"
          placeholder="Search APT Groups..."
          value={searchTerm}
          onChange={handleSearchChange}
          className="search-input"
        />
        <select
          value={selectedCountry}
          onChange={handleCountryChange}
          className="filter-select"
        >
          <option value="">All Countries</option>
          {countries.map((country, index) => (
            <option key={index} value={country}>{country}</option>
          ))}
        </select>
        <select
          value={selectedSector}
          onChange={handleSectorChange}
          className="filter-select"
        >
          <option value="">All Sectors</option>
          {sectors.map((sector, index) => (
            <option key={index} value={sector}>{sector}</option>
          ))}
        </select>
      </div>
      <div className="apt-list">
        {filteredGroups.map((group, index) => (
          <div 
            key={index} 
            className={`apt-tab ${selectedGroup === group ? 'selected' : ''}`}
            onClick={() => handleGroupClick(group)}
          >
            {group['APT Name']}
          </div>
        ))}
      </div>
      <div className="apt-details">
        {selectedGroup ? (
          <>
            <h3>{selectedGroup['APT Name']}</h3>
            <p><strong>Country of Origin:</strong> {selectedGroup['Country of Origin']}</p>
            <p><strong>Sectors:</strong> {selectedGroup['Sectors']}</p>
            <p><strong>Motivation:</strong> {selectedGroup['Motivation']}</p>
            <p><strong>Tools Used:</strong> {selectedGroup['Tools Used']}</p>
          </>
        ) : (
          <p>Please select an APT group to see the details.</p>
        )}
      </div>
    </div>
  );
};

export default APTDashboard;
