import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { AuthProvider } from "react-oidc-context";

const cognitoAuthConfig = {
  authority: "https://cognito-idp.us-east-1.amazonaws.com/us-east-1_GorfJMVhW",
  client_id: "1u03g2n0diall88giqu2dmpt73",
  redirect_uri: "https://tweetbeacon-demo.vercel.app/",
  response_type: "code",
  scope: "email openid phone",
  loadUserInfo: true,
  metadata: {
    issuer: "https://cognito-idp.us-east-1.amazonaws.com/us-east-1_GorfJMVhW",
    authorization_endpoint: "https://us-east-1gorfjmvhw.auth.us-east-1.amazoncognito.com/login",
    token_endpoint: "https://us-east-1gorfjmvhw.auth.us-east-1.amazoncognito.com/oauth2/token",
    end_session_endpoint: "https://us-east-1gorfjmvhw.auth.us-east-1.amazoncognito.com/logout",
    userinfo_endpoint: "https://us-east-1gorfjmvhw.auth.us-east-1.amazoncognito.com/oauth2/userInfo"
  }
};

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <AuthProvider {...cognitoAuthConfig}>
      <App />
    </AuthProvider>
  </React.StrictMode>
);
