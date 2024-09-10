// src/components/OTXPulses.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './Loader.css'; // Ensure this path is correct

const OTX_API_URL = "https://otx.alienvault.com/api/v1/search/pulses";
const API_KEY = 'd74df21a43bfe8794308092f5ef060c887ee7776c333520cfe6ca6d8c30afe9a';

const OTXPulses = () => {
  const [pulses, setPulses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [industry, setIndustry] = useState(''); // State for industry filter
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchPulses = async () => {
      if (!industry) {
        setLoading(false);
        return;
      }

      setLoading(true); // Set loading to true when starting to fetch

      try {
        const response = await axios.get(OTX_API_URL, {
          headers: {
            'X-OTX-API-KEY': API_KEY,
          },
          params: {
            q: industry, // Search by industry
            sort: 'created', // Sort by creation date
            limit: 10, // Limit results per page
            page: 1, // Page number
          },
        });
        const sortedPulses = response.data.results.sort((a, b) => new Date(b.created) - new Date(a.created));
        setPulses(sortedPulses);
      } catch (error) {
        if (error.response) {
          setError(`Error: ${error.response.status} - ${error.response.data}`);
        } else if (error.request) {
          setError('Error: No response received from the server');
        } else {
          setError('Error: ' + error.message);
        }
      } finally {
        setLoading(false); // Set loading to false after fetching
      }
    };

    fetchPulses();
  }, [industry]);

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const handleSearchSubmit = (event) => {
    event.preventDefault();
    setIndustry(searchQuery); // Set the industry to search for
    setSearchQuery(''); // Clear the search input
  };

  if (loading) {
    return (
      <div className="loader-wrapper">
        <h2>Search Threat Intel from Tweets</h2>
        <div className="loader"></div>
      </div>
    );
  }

  if (error) return <div>{error}</div>;

  return (
    <div className="loader-wrapper">
      <h2>Search Threat Intel from Tweets</h2>
      <form onSubmit={handleSearchSubmit}>
        <input
          type="text"
          value={searchQuery}
          onChange={handleSearchChange}
          placeholder="Search..."
        />
        <button type="submit">Search</button>
      </form>
      <div className={loading ? 'hidden' : ''}>
        {pulses.length === 0 ? (
          <p>No tweets found.</p>
        ) : (
          <ul>
            {pulses.slice(0, 10).map((pulse) => ( // Display only the latest 5 pulses
              <li key={pulse.id}>
                <h3>{pulse.name}</h3>
                <p>{pulse.description || 'No description available.'}</p>
                {pulse.references && pulse.references.length > 0 && (
                  <a href={pulse.references[0]} target="_blank" rel="noopener noreferrer">
                    More details
                  </a>
                )}
                <p><strong>Author:</strong> {pulse.author_name}</p>
                <p><strong>Created:</strong> {new Date(pulse.created).toLocaleDateString()}</p>
                <p><strong>Modified:</strong> {new Date(pulse.modified).toLocaleDateString()}</p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default OTXPulses;
