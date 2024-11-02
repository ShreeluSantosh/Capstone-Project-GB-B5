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

      // Determine if the query is a CVE ID, IP, hash, or domain
      if (query.startsWith("CVE-")) {
        data = await fetchCVEData(query);
      } else {
        const apiKey = process.env.REACT_APP_VIRUSTOTAL_API_KEY;
        data = await fetchIoCData(query, apiKey); // Make sure to pass the right arguments
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
      <div className="lookup-panel">
        <h2>Threat Intelligence Lookup</h2>
        <div className="lookup-search">
          <input
            type="text"
            placeholder="Enter CVE ID, IP, hash, or domain"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <button onClick={handleSearch}>Search</button>
        </div>
        {loading && <p>Loading...</p>}
        {error && <p className="error">{error}</p>}
      </div>
      <div className="lookup-results">
        {results && (
          <div>
            <h3>Results</h3>
            <pre>{JSON.stringify(results, null, 2)}</pre>
          </div>
        )}
      </div>
    </div>
  );
};

export default Lookup;
