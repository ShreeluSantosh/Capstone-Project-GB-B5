import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Papa from 'papaparse'; // Library to parse CSV data
import './Loader.css'; // Ensure this path is correct
import './Tweets.css'; // Create this file for custom styles

const CSV_URL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vTmQnHL_SUh0YtYT8ULA74isNtVSZbjV0eBrg4Z41k60QxVnaw-2xzpijn_8UJf7zNJ3VjRXZfp77uH/pub?gid=0&single=true&output=csv'; // Replace with your actual CSV file URL

const Tweets = () => {
  const [tweets, setTweets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchTweets = async () => {
      setLoading(true);

      try {
        // Fetch CSV data
        const response = await axios.get(CSV_URL);
        // Parse CSV data
        Papa.parse(response.data, {
          header: true,
          skipEmptyLines: true,
          complete: (results) => {
            // Set parsed data to state
            setTweets(results.data);
            setLoading(false);
          },
          error: (parseError) => {
            setError(`Parsing Error: ${parseError.message}`);
            setLoading(false);
          }
        });
      } catch (fetchError) {
        setError(`Fetch Error: ${fetchError.message}`);
        setLoading(false);
      }
    };

    fetchTweets();
  }, []);

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const handleSearchSubmit = (event) => {
    event.preventDefault();
    // Trigger re-render to filter tweets
  };

  // Filter and sort tweets
  const filteredTweets = tweets.filter(tweet =>
    tweet.tweet && tweet.tweet.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const sortedTweets = filteredTweets.slice().sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

  // Count tweets by user_account and sort by tweet count in descending order
  const tweetCountsByUser = Object.entries(filteredTweets.reduce((acc, tweet) => {
    acc[tweet.user_account] = (acc[tweet.user_account] || 0) + 1;
    return acc;
  }, {})).sort((a, b) => b[1] - a[1]);

  if (loading) {
    return (
      <div className="loader-wrapper">
        <h2>Loading Tweets...</h2>
        <div className="loader"></div>
      </div>
    );
  }

  if (error) return <div>{error}</div>;

  return (
    <div className="container">
      <div className="panel left-panel">
        <h2>Statistics</h2>
        <p><strong>Total Tweets:</strong> {filteredTweets.length}</p>
        <h3>Tweets by User Account</h3>
        <ul>
          {tweetCountsByUser.map(([user, count]) => (
            <li key={user}>{user}: {count}</li>
          ))}
        </ul>
      </div>
      <div className="panel right-panel">
        <h2>Tweets</h2>
        <form onSubmit={handleSearchSubmit}>
          <input
            type="text"
            value={searchQuery}
            onChange={handleSearchChange}
            placeholder="Search..."
          />
          <button type="submit">Search</button>
        </form>
        <div className="tweets-list">
          {sortedTweets.length === 0 ? (
            <p>No tweets found.</p>
          ) : (
            sortedTweets.map((tweet, index) => (
              <div key={index} className="tweet-box">
                <p><strong>Tweet:</strong> {tweet.tweet || 'No content available'}</p>
                <p><strong>Timestamp:</strong> {tweet.timestamp ? new Date(tweet.timestamp).toLocaleString() : 'Unknown'}</p>
                <p><strong>Account:</strong> {tweet.user_account || 'Anonymous'}</p>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Tweets;