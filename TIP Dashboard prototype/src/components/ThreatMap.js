import React from 'react';

const ThreatMapIframe = () => {
  return (
    <iframe
      src="https://securitycenter.sonicwall.com/m/page/worldwide-attacks/"
      style={{ width: '90%', height: '80vh', border: 'none', position: 'relative', top: '2', left: '0' }}
      title="Radware Live Threat Map"
    ></iframe>
  );
};

export default ThreatMapIframe;