import React, { useEffect } from 'react';
import { useAuth } from "react-oidc-context";
import Header from './components/Header';
import Org from './components/org';
import Kaspersky from './components/kaspersky';
import APTDashboard from './components/APTDashboard';
import Tweets from './components/Tweets';  
import Lookup from './components/Lookup';
import './App.css';

function App() {
  const [activeTab, setActiveTab] = React.useState('ThreatMap');
  const auth = useAuth();

  useEffect(() => {
    // Handle auth state changes
    if (auth.isAuthenticated) {
      console.log('User authenticated:', auth.user?.profile);
    }
  }, [auth.isAuthenticated, auth.user]);

  const signOutRedirect = async () => {
    try {
      await auth.removeUser(); // Clear local auth state first
      const clientId = "1u03g2n0diall88giqu2dmpt73";
      const logoutUri = "https://tweetbeacon-demo.vercel.app/";
      const cognitoDomain = "https://us-east-1gorfjmvhw.auth.us-east-1.amazoncognito.com";
      window.location.href = `${cognitoDomain}/logout?client_id=${clientId}&logout_uri=${encodeURIComponent(logoutUri)}`;
    } catch (error) {
      console.error('Logout error:', error);
      window.location.href = "https://tweetbeacon-demo.vercel.app/";
    }
  };

  const handleSignIn = async () => {
    try {
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
      const loginUrl = new URL('https://us-east-1gorfjmvhw.auth.us-east-1.amazoncognito.com/login');
      loginUrl.searchParams.append('client_id', '1u03g2n0diall88giqu2dmpt73');
      loginUrl.searchParams.append('response_type', 'code');
      loginUrl.searchParams.append('scope', 'email openid phone');
      loginUrl.searchParams.append('redirect_uri', 'https://tweetbeacon-demo.vercel.app/');
      window.location.href = loginUrl.toString();
    }
  };

  if (auth.isLoading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading authentication...</p>
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
        <h1>TweetBeacon</h1>
        <p>Please sign in to access the dashboard</p>
        <button 
          className="login-button" 
          onClick={handleSignIn}
        >
          Sign in with AWS
        </button>
      </div>
    );
  }

  const renderContent = () => {
    if (activeTab === 'ThreatMap') {
      return <Kaspersky />;
    } else if (activeTab === 'APTGroups') {
      return <APTDashboard />;
    } else if (activeTab === 'Feed') {  
      return <Tweets />;
    } else if (activeTab === 'OrganizationActivity') {  
      return <Org />;
    } else if (activeTab === 'Lookup') { 
      return <Lookup />;
    }
  };

  return (
    <div className="App">
      <Header />
      <div className="user-info">
        <span>Welcome, {auth.user?.profile.email || 'User'}</span>
        <button onClick={signOutRedirect}>Sign out</button>
      </div>
      <div className="tabs">
        <div 
          className={`tab ${activeTab === 'ThreatMap' ? 'active' : ''}`} 
          onClick={() => setActiveTab('ThreatMap')}
        >
          Threat Map
        </div>
        <div 
          className={`tab ${activeTab === 'Feed' ? 'active' : ''}`} 
          onClick={() => setActiveTab('Feed')}
        >
          Feed
        </div>
        <div 
          className={`tab ${activeTab === 'APTGroups' ? 'active' : ''}`} 
          onClick={() => setActiveTab('APTGroups')}
        >
          APT Groups
        </div>
        <div 
          className={`tab ${activeTab === 'OrganizationActivity' ? 'active' : ''}`} 
          onClick={() => setActiveTab('OrganizationActivity')}
        >
          Organization Activity
        </div>
        <div 
          className={`tab ${activeTab === 'Lookup' ? 'active' : ''}`} 
          onClick={() => setActiveTab('Lookup')}
        >
          Lookup
        </div>
      </div>
      {renderContent()}
    </div>
  );
}

export default App;
