// src/components/Lookup.js
import React, { useState } from 'react';
import { fetchCVEData, fetchIoCData } from '../utils/api';
import './Lookup.css';

const Lookup = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSearch = async () => {
    if (!query) return;
    setLoading(true);
    setError(null);

    try {
      let data = null;

      if (query.startsWith("CVE-")) {
        data = await fetchCVEData(query);
      } else {
        const apiKey = process.env.REACT_APP_VIRUSTOTAL_API_KEY;
        data = await fetchIoCData(query, apiKey);
      }

      setResults(data);
    } catch (err) {
      setError("Failed to retrieve data. Please try again.");
      console.error("Error fetching data:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="lookup-container">
      {/* Left panel */}
      <div className="lookup-sidebar">
        <h2>Threat Intelligence Lookup</h2>
        <p>Look up a CVE, IP address, hash, or domain here</p>
        {/* Add more statistics or options here */}
        <div className="lookup-search">
          <input
            type="text"
            placeholder="Enter CVE ID, IP, hash, or domain"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <button onClick={handleSearch}>Search</button>
        </div>
      </div>

      {/* Right panel */}
      <div className="lookup-results">
        {loading && <p>Loading...</p>}
        {error && <p className="error">{error}</p>}
        {results ? (
          <div>
            <h3>Results</h3>
            <pre>{JSON.stringify(results, null, 2)}</pre>
          </div>
        ) : (
          <p>Search for a CVE or domain to view results.</p>
        )}
      </div>
    </div>
  );
};

export default Lookup;
