import React, { useState } from 'react';
import './components.css';

const Lookup = () => {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState(null);
  const [error, setError] = useState(null);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!query.trim()) return;

    try {
      setLoading(true);
      setError(null);
      const response = await fetch(`https://tweetbeacon-demo.vercel.app/api/lookup?query=${encodeURIComponent(query)}`);
      if (!response.ok) {
        throw new Error('Failed to fetch data');
      }
      const data = await response.json();
      setResults(data);
    } catch (err) {
      setError('Failed to perform lookup. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="component-container">
      <form onSubmit={handleSearch} className="lookup-form">
        <div className="search-group">
          <input
            type="text"
            className="search-bar"
            placeholder="Enter IP, domain, or hash..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <button type="submit" className="button" disabled={loading}>
            {loading ? 'Searching...' : 'Search'}
          </button>
        </div>
      </form>

      {loading && (
        <div className="loading-state">
          <div className="loading-spinner"></div>
          <p>Performing lookup...</p>
        </div>
      )}

      {error && (
        <div className="error-state">
          <h3>Error</h3>
          <p>{error}</p>
          <button onClick={() => setError(null)} className="button">
            Try Again
          </button>
        </div>
      )}

      {results && !loading && !error && (
        <div className="results-container">
          <div className="card">
            <div className="card-header">
              <h3>Lookup Results</h3>
              <span className="tag">{results.type || 'Unknown'}</span>
            </div>
            
            <div className="details-section">
              <h4>Basic Information</h4>
              <table className="results-table">
                <tbody>
                  <tr>
                    <th>Query</th>
                    <td>{query}</td>
                  </tr>
                  <tr>
                    <th>Type</th>
                    <td>{results.type || 'Unknown'}</td>
                  </tr>
                  <tr>
                    <th>Status</th>
                    <td>
                      <span className={`status-tag ${results.malicious ? 'status-danger' : 'status-safe'}`}>
                        {results.malicious ? 'Malicious' : 'Safe'}
                      </span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            {results.details && (
              <div className="details-section">
                <h4>Additional Details</h4>
                <table className="results-table">
                  <tbody>
                    {Object.entries(results.details).map(([key, value]) => (
                      <tr key={key}>
                        <th>{key}</th>
                        <td>{value}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {results.reports && results.reports.length > 0 && (
              <div className="details-section">
                <h4>Related Reports</h4>
                <ul className="reports-list">
                  {results.reports.map((report, index) => (
                    <li key={index} className="report-item">
                      <h5>{report.title}</h5>
                      <p>{report.description}</p>
                      <div className="report-meta">
                        <span>{new Date(report.date).toLocaleDateString()}</span>
                        <a href={report.url} target="_blank" rel="noopener noreferrer" className="button secondary">
                          View Report
                        </a>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div className="card-footer">
              <div className="card-actions">
                <button className="button" onClick={() => window.print()}>
                  Export Results
                </button>
                <button className="button secondary" onClick={() => setResults(null)}>
                  New Search
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Lookup;
