// src/components/KasperskyMap.js
import React from 'react';

const KasperskyMap = () => {
  return (
    <div style={{ width: '55%', height: '500px', overflow: 'hidden', position: 'relative' }}>
      <iframe
        src="https://cybermap.kaspersky.com/en/widget/dynamic/dark"
        width="100%"
        height="100%"
        style={{ border: 'none', position: 'absolute', top: '0', left: '0' }}
        title="Kaspersky Live Cyber Threat Map"
      ></iframe>
    </div>
  );
};

export default KasperskyMap;
