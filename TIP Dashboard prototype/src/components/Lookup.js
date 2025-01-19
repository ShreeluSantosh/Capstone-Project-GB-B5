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

      if (query.startsWith('CVE-')) {
        data = await fetchCVEData(query);
      } else {
        const apiKey = process.env.REACT_APP_VIRUSTOTAL_API_KEY;
        data = await fetchIoCData(query, apiKey);
      }

      setResults(data);
    } catch (err) {
      setError('Failed to retrieve data. Please try again.');
      console.error('Error fetching data:', err);
    } finally {
      setLoading(false);
    }
  };

  const renderCVEResults = (data) => {
    if (!data || data.dataType !== 'CVE_RECORD') return null;

    const metadata = data.cveMetadata;
    const cna = data.containers?.cna;
    const description = cna?.descriptions?.[0]?.value || 'No description available.';
    const affectedProducts = cna?.affected?.map((item, index) => (
      <li key={index}>
        <strong>Vendor:</strong> {item.vendor}, <strong>Product:</strong> {item.product}
      </li>
    ));

    return (
      <div>
        <h3>CVE Details</h3>
        <p>
          <strong>CVE ID:</strong> {metadata.cveId}
        </p>
        <p>
          <strong>State:</strong> {metadata.state}
        </p>
        <p>
          <strong>Date Published:</strong> {metadata.datePublished}
        </p>
        <p>
          <strong>Description:</strong> {description}
        </p>
        <h4>Affected Products</h4>
        <ul>{affectedProducts}</ul>
      </div>
    );
  };

  const renderDomainResults = (data) => {
    if (!data || data.type !== 'domain') return null;

    const attributes = data.attributes;
    const dnsRecords = attributes.last_dns_records?.map((record, index) => (
      <li key={index}>
        <strong>Type:</strong> {record.type}, <strong>Value:</strong> {record.value}
        {record.priority && `, Priority: ${record.priority}`}
        {record.ttl && `, TTL: ${record.ttl}`}
      </li>
    ));
    const whois = attributes.whois?.split('\n').map((line, index) => <li key={index}>{line}</li>);

    return (
      <div>
        <h3>Domain Details</h3>
        <p>
          <strong>Domain:</strong> {data.id}
        </p>
        <p>
          <strong>Registrar:</strong> {attributes.registrar}
        </p>
        <p>
          <strong>Reputation:</strong> {attributes.reputation}
        </p>
        <h4>DNS Records</h4>
        <ul>{dnsRecords}</ul>
        <h4>WHOIS Information</h4>
        <ul>{whois}</ul>
        <h4>Popularity Ranks</h4>
        <ul>
          {Object.entries(attributes.popularity_ranks || {}).map(([source, rankData], index) => (
            <li key={index}>
              <strong>{source}:</strong> Rank {rankData.rank}, Timestamp {new Date(rankData.timestamp * 1000).toLocaleString()}
            </li>
          ))}
        </ul>
      </div>
    );
  };

  const renderResults = (data) => {
    if (query.startsWith('CVE-')) {
      return renderCVEResults(data);
    } else if (data?.type === 'domain') {
      return renderDomainResults(data);
    } else {
      //console.log("Fetched data:", data);
      return (
        <div>
          <h3>Lookup Results</h3>
          <pre>{JSON.stringify(data, null, 2)}</pre>
        </div>
      );
    }
  };

  return (
    <div className="lookup-container">
      {/* Left panel */}
      <div className="lookup-sidebar">
        <h2>Threat Intelligence Lookup</h2>
        <p>Look up a CVE, IP address, hash, or domain here</p>
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
        {results ? renderResults(results) : <p>Search for a CVE or domain to view results.</p>}
      </div>
    </div>
  );
};

export default Lookup;

