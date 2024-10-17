// src/components/ThreatMapIframe.js

import React from 'react';
import './ThreatMapIframe.css'; // Import CSS for styling

const ThreatMapIframe = () => {
  return (
    <div className="iframe-container">
      <iframe
        src="https://securitycenter.sonicwall.com/m/page/worldwide-attacks/"
        title="Radware Live Threat Map"
        className="threat-map-iframe"
      ></iframe>
    </div>
  );
};

export default ThreatMapIframe;
