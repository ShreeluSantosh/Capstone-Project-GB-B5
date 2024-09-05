// src/components/ThreatFeeds.js
import React, { useState, useEffect } from 'react';

const ThreatFeeds = () => {
  const [feeds, setFeeds] = useState([]);

  useEffect(() => {
    // Fetch threat feeds
    fetch('/api/threat-feeds')
      .then(response => response.json())
      .then(data => setFeeds(data));
  }, []);

  return (
    <div>
      <h2>Threat Feeds</h2>
      <ul>
        {feeds.map(feed => (
          <li key={feed.id}>{feed.title}</li>
        ))}
      </ul>
    </div>
  );
};

export default ThreatFeeds;
