// src/App.js
import React, { useState } from 'react';
import Header from './components/Header';
import Org from './components/org';
import Kaspersky from './components/kaspersky';
import APTDashboard from './components/APTDashboard';
import Tweets from './components/Tweets';  
import Lookup from './components/Lookup';
import Home from './components/Home'; // Import Home.js
import './App.css';

function App() {
  const [activeTab, setActiveTab] = useState('Home'); // Set default tab to 'Home'

  const renderContent = () => {
    if (activeTab === 'Home') {
      return <Home />;
    } else if (activeTab === 'ThreatMap') {
      return <Kaspersky />;
    } else if (activeTab === 'APTGroups') {
      return <APTDashboard />;
    } else if (activeTab === 'Feed') {  
      return <Tweets />;
    } else if (activeTab === 'OrganizationActivity') {  
      return <Org />;
    } else if (activeTab === 'Lookup') { 
      return <Lookup />;
    }
  };

  return (
    <div className="App">
      <Header />
      <div className="tabs">  
        <div 
          className={`tab ${activeTab === 'Home' ? 'active' : ''}`} 
          onClick={() => setActiveTab('Home')}
        >
          Home
        </div>
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
        <div 
          className={`tab ${activeTab === 'Lookup' ? 'active' : ''}`} 
          onClick={() => setActiveTab('Lookup')}
        >
          Lookup
        </div>
      </div>
      <main>
        {renderContent()}
      </main>
    </div>
  );
}

export default App;