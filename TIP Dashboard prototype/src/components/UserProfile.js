import React from 'react';
import { useAuth } from 'react-oidc-context';
import './components.css';

const UserProfile = () => {
  const auth = useAuth();

  const handleSignOut = async () => {
    try {
      await auth.removeUser();
      const clientId = "1u03g2n0diall88giqu2dmpt73";
      const logoutUri = "https://tweetbeacon-demo.vercel.app/";
      const cognitoDomain = "https://us-east-1gorfjmvhw.auth.us-east-1.amazoncognito.com";
      window.location.href = `${cognitoDomain}/logout?client_id=${clientId}&logout_uri=${encodeURIComponent(logoutUri)}`;
    } catch (error) {
      console.error('Logout error:', error);
      window.location.href = "https://tweetbeacon-demo.vercel.app/";
    }
  };

  if (!auth.isAuthenticated) {
    return null;
  }

  const userProfile = auth.user?.profile || {};

  return (
    <div className="component-container">
      <div className="profile-card">
        <div className="profile-header">
          <h2>User Profile</h2>
          <button className="button danger" onClick={handleSignOut}>
            Sign Out
          </button>
        </div>

        <div className="profile-content">
          <div className="profile-section">
            <h3>Account Information</h3>
            <table className="profile-table">
              <tbody>
                <tr>
                  <th>Name</th>
                  <td>{userProfile.name || 'Not provided'}</td>
                </tr>
                <tr>
                  <th>Email</th>
                  <td>{userProfile.email || 'Not provided'}</td>
                </tr>
                <tr>
                  <th>Username</th>
                  <td>{userProfile.preferred_username || userProfile.email || 'Not provided'}</td>
                </tr>
                <tr>
                  <th>Email Verified</th>
                  <td>
                    <span className={`status-tag ${userProfile.email_verified ? 'status-safe' : 'status-danger'}`}>
                      {userProfile.email_verified ? 'Yes' : 'No'}
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="profile-section">
            <h3>Session Information</h3>
            <table className="profile-table">
              <tbody>
                <tr>
                  <th>Last Login</th>
                  <td>{new Date(userProfile.auth_time * 1000).toLocaleString()}</td>
                </tr>
                <tr>
                  <th>Session Expires</th>
                  <td>{auth.user?.expires_at ? new Date(auth.user.expires_at * 1000).toLocaleString() : 'Unknown'}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
