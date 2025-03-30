import React from 'react';
import './Home.css';

const Home = () => {
  return (
    <div className="home-container">
      <div className="outer-card-container">
        <h1>TweetBeacon: A Cyber Threat Intelligence Dashboard</h1>
        <p>
          <strong>Theme:</strong> TweetBeacon features a futuristic cybersecurity aesthetic, with a dark UI, neon highlights, and dynamic data visualizations. It provides an intuitive experience for security professionals to track cyber incidents via Twitter data.
        </p>
      </div>
      
      <div className="outer-card-container">
        <div className="card-container">
          <h2>How It Works</h2>
          <ul>
            <li><strong>Data Collection:</strong> Fetches real-time cybersecurity-related tweets using Twitter’s API.</li>
            <li><strong>Threat Mapping:</strong> Uses geolocation and keyword analysis to display threats on an interactive map.</li>
            <li><strong>Feed Analysis:</strong> Aggregates security alerts, malware reports, and trending threats from cybersecurity researchers.</li>
            <li><strong>Filtering & Search:</strong> Users can filter by specific threat types, locations, or sources.</li>
          </ul>
        </div>
      </div>
      
      <div className="outer-card-container">
        <div className="card-container">  
          <h2>Use Cases</h2>
          <ul>
            <li><strong>SOC Teams & Analysts:</strong> Monitor live threat intelligence feeds.</li>
            <li><strong>Incident Response:</strong> Quickly identify new vulnerabilities, malware campaigns, or attack trends.</li>
            <li><strong>Threat Hunting:</strong> Correlate Twitter reports with internal security alerts.</li>
            <li><strong>Cybersecurity Researchers:</strong> Stay updated on the latest attack vectors and exploits.</li>
          </ul>
        </div>
      </div>
      
      </div>
  );
};

export default Home;