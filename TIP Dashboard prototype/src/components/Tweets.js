import React, { useState, useEffect } from 'react';
import './components.css';

const API_URL = 'https://tweetbeacon-demo.vercel.app/api/tweets';

const Tweets = () => {
  const [tweets, setTweets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');

  useEffect(() => {
    const fetchTweets = async () => {
      try {
        setLoading(true);
        const response = await fetch(API_URL);
        if (!response.ok) {
          throw new Error('Failed to fetch tweets');
        }
        const data = await response.json();
        setTweets(data);
      } catch (err) {
        setError('Failed to load tweets. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchTweets();
  }, []);

  if (loading) {
    return (
      <div className="loading-state">
        <div className="loading-spinner"></div>
        <p>Loading tweets...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-state">
        <h3>Error</h3>
        <p>{error}</p>
        <button onClick={() => window.location.reload()}>Retry</button>
      </div>
    );
  }

  const categories = [...new Set(tweets.map(tweet => tweet.category))];
  
  const filteredTweets = tweets.filter(tweet => {
    const matchesSearch = tweet.tweet.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         tweet.user_account.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = !selectedCategory || tweet.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="component-container">
      <div className="filter-group">
        <input
          type="text"
          className="search-bar"
          placeholder="Search tweets..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <select
          className="filter-select"
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
        >
          <option value="">All Categories</option>
          {categories.map(category => (
            <option key={category} value={category}>{category}</option>
          ))}
        </select>
      </div>

      <div className="grid">
        {filteredTweets.map(tweet => (
          <div key={tweet.id} className="card">
            <div className="card-header">
              <h3>{tweet.user_account}</h3>
              <span className="tag">{tweet.category}</span>
            </div>
            <p>{tweet.tweet}</p>
            <div className="card-footer">
              <span>{new Date(tweet.timestamp).toLocaleString()}</span>
              <div className="card-actions">
                <button className="button">View Thread</button>
                <button className="button secondary">Share</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Tweets;
