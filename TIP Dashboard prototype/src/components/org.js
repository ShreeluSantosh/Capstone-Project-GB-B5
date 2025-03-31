import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Papa from 'papaparse'; // Library to parse CSV data
import Loader from './Loader';
import './Loader.css'; // Ensure this path is correct
import './org.css'; // Create this file for custom styles

const CSV_URL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vQdlkufBcHg5rV09H6dFh3Q8uPh_WyTh1LE9L8DBNjxfAvTwMdvBSWJqjRKEi8jrJDHfVazn5jsYVfy/pub?gid=0&single=true&output=csv';

const ActivityDashboard = () => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
  
    useEffect(() => {
      const fetchData = async () => {
        try {
          const response = await axios.get(CSV_URL);
          console.log('CSV Data:', response.data); // Log raw CSV data
          Papa.parse(response.data, {
            header: true,
            skipEmptyLines: true,
            complete: (results) => {
              console.log('Parsed Results:', results.data); // Log parsed data
              setData(results.data);
            },
            error: (parseError) => {
              setError(`Parsing Error: ${parseError.message}`);
            }
          });
        } catch (fetchError) {
          setError(`Fetch Error: ${fetchError.message}`);
        }
      };

      fetchData();

      // Ensure the loader stays visible for exactly 4 seconds
      const timer = setTimeout(() => setLoading(false), 3000);

      return () => clearTimeout(timer); // Cleanup timeout when component unmounts
    }, []);
  
    const handleSearchChange = (event) => {
      setSearchQuery(event.target.value);
    };
  
    const handleSearchSubmit = (event) => {
      event.preventDefault();
      // Trigger re-render to filter activities based on the search query
    };
  
    // Filter and sort data
    const filteredData = data.filter(entry =>
      entry.activity &&
      entry.activity.trim() !== '' &&
      entry.timestamp &&
      entry.username &&
      (
        entry.activity.toLowerCase().includes(searchQuery.toLowerCase()) ||
        entry.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
        new Date(entry.timestamp).toLocaleString().toLowerCase().includes(searchQuery.toLowerCase())
      )
    );
  
    console.log('Filtered Data:', filteredData); // Log filtered data
  
    const sortedData = filteredData.slice().sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
  
    // Count activities by username and sort by activity count in descending order
    const activityCountsByUser = Object.entries(filteredData.reduce((acc, entry) => {
      acc[entry.username] = (acc[entry.username] || 0) + 1;
      return acc;
    }, {})).sort((a, b) => b[1] - a[1]);
  
    if (loading) {
      return <Loader />;
    }

    if (error) return <div>{error}</div>;
  
    return (
      <div className="container">
        <div className="panel left-panel">
          <h2>Statistics</h2>
          <p><strong>Total Activities:</strong> {filteredData.length}</p>
          <h3>Activities by Username</h3>
          <ul>
            {activityCountsByUser.map(([user, count]) => (
              <li key={user}>{user}: {count}</li>
            ))}
          </ul>
        </div>
        <div className="panel right-panel">
          <h2>Activities</h2>
          <form onSubmit={handleSearchSubmit}>
            <input
              type="text"
              value={searchQuery}
              onChange={handleSearchChange}
              placeholder="Search..."
            />
            <button type="submit">Search</button>
          </form>
          <div className="activities-list">
            {sortedData.length === 0 ? (
              <p>No activities found.</p>
            ) : (
              sortedData.map((entry, index) => (
                <div key={index} className="activity-box">
                  <p><strong>Activity:</strong> {entry.activity || 'No content available'}</p>
                  <p><strong>Date & Time:</strong> {entry.timestamp ? new Date(entry.timestamp).toLocaleString() : 'Unknown'}</p>
                  <p><strong>Username:</strong> {entry.username || 'Anonymous'}</p>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    );
  };
  
  export default ActivityDashboard;
