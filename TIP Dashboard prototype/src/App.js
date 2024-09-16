// src/App.js
import React, { useState } from 'react';
import Header from './components/Header';
import Org from './components/org';
import Kaspersky from './components/kaspersky';
import APTDashboard from './components/APTDashboard';
import Tweets from './components/Tweets';  // Import the new component
import './App.css';

function App() {
  const [activeTab, setActiveTab] = useState('ThreatMap'); // State to manage the active tab

  const renderContent = () => {
    if (activeTab === 'ThreatMap') {
      return <Kaspersky />;
    } else if (activeTab === 'APTGroups') {
      return <APTDashboard />;
    } else if (activeTab === 'Feed') {  // Add condition for OTXPulses
      return <Tweets />;
    } else if (activeTab === 'OrganizationActivity') {  // Add condition for OTXPulses
      return <Org />;
    }
  };

  return (
    <div className="App">
      <Header />
      <div className="tabs">
        <div 
          className={`tab ${activeTab === 'ThreatMap' ? 'active' : ''}`} 
          onClick={() => setActiveTab('ThreatMap')}
        >
          Threat Map
        </div>
        <div 
          className={`tab ${activeTab === 'Feed' ? 'active' : ''}`} 
          onClick={() => setActiveTab('Feed')}
        >
          Feed
        </div>
        <div 
          className={`tab ${activeTab === 'APTGroups' ? 'active' : ''}`} 
          onClick={() => setActiveTab('APTGroups')}
        >
          APT Groups
        </div>
        <div 
          className={`tab ${activeTab === 'OrganizationActivity' ? 'active' : ''}`} 
          onClick={() => setActiveTab('OrganizationActivity')}
        >
          Organization Activity
        </div>
      </div>
      <main>
        {renderContent()}
      </main>
    </div>
  );
}

export default App;
