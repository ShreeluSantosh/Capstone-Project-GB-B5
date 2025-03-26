import React, { useEffect, useState } from 'react';
import { useAuth } from "react-oidc-context";
import Header from './components/Header';
import Org from './components/org';
import Kaspersky from './components/kaspersky';
import APTDashboard from './components/APTDashboard';
import Tweets from './components/Tweets';  
import Lookup from './components/Lookup';
import UserProfile from './components/UserProfile';
import './App.css';

function App() {
  const [activeTab, setActiveTab] = useState('ThreatMap');
  const [isLoading, setIsLoading] = useState(true);
  const auth = useAuth();

  useEffect(() => {
    if (auth.isAuthenticated) {
      console.log('User authenticated:', auth.user?.profile);
    }
    const timer = setTimeout(() => setIsLoading(false), 1000);
    return () => clearTimeout(timer);
  }, [auth.isAuthenticated, auth.user]);

  const handleSignIn = async () => {
    try {
      setIsLoading(true);
      await auth.signinRedirect({
        redirect_uri: "https://tweetbeacon-demo.vercel.app/",
        extraQueryParams: {
          client_id: "1u03g2n0diall88giqu2dmpt73",
          response_type: "code",
          scope: "email openid phone"
        }
      });
    } catch (err) {
      console.error('Sign-in error:', err);
      setIsLoading(false);
      const loginUrl = new URL('https://us-east-1gorfjmvhw.auth.us-east-1.amazoncognito.com/login');
      loginUrl.searchParams.append('client_id', '1u03g2n0diall88giqu2dmpt73');
      loginUrl.searchParams.append('response_type', 'code');
      loginUrl.searchParams.append('scope', 'email openid phone');
      loginUrl.searchParams.append('redirect_uri', 'https://tweetbeacon-demo.vercel.app/');
      window.location.href = loginUrl.toString();
    }
  };

  const TABS = [
    { id: 'ThreatMap', label: 'Threat Map', component: Kaspersky },
    { id: 'Feed', label: 'Feed', component: Tweets },
    { id: 'APTGroups', label: 'APT Groups', component: APTDashboard },
    { id: 'OrganizationActivity', label: 'Organization Activity', component: Org },
    { id: 'Lookup', label: 'Lookup', component: Lookup },
    { id: 'Profile', label: 'Profile', component: UserProfile }
  ];

  if (isLoading || auth.isLoading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading TweetBeacon...</p>
      </div>
    );
  }

  if (auth.error) {
    return (
      <div className="error-container">
        <h2>Authentication Error</h2>
        <p>{auth.error.message}</p>
        <div className="error-actions">
          <button onClick={handleSignIn}>Try Again</button>
          <button onClick={() => {
            auth.removeUser();
            window.location.href = "https://tweetbeacon-demo.vercel.app/";
          }}>Clear Session</button>
        </div>
      </div>
    );
  }

  if (!auth.isAuthenticated) {
    return (
      <div className="login-container">
        <div className="login-content">
          <h1>TweetBeacon</h1>
          <p>Cyber Threat Intelligence Dashboard</p>
          <button 
            className="login-button" 
            onClick={handleSignIn}
          >
            Sign in with AWS
          </button>
        </div>
      </div>
    );
  }

  const ActiveComponent = TABS.find(tab => tab.id === activeTab)?.component || TABS[0].component;

  return (
    <div className="App">
      <Header />
      <div className="main-container">
        <nav className="tabs">
          {TABS.map(tab => (
            <button
              key={tab.id}
              className={`tab ${activeTab === tab.id ? 'active' : ''}`}
              onClick={() => setActiveTab(tab.id)}
            >
              {tab.label}
            </button>
          ))}
        </nav>
        <main className="content-area">
          <ActiveComponent />
        </main>
      </div>
    </div>
  );
}

export default App;
