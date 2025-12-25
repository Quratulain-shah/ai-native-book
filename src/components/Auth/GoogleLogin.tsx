import React from 'react';
import { GoogleLogin } from '@react-oauth/google';

const GoogleLoginButton: React.FC = () => {
  const onSuccess = (response: any) => {
    console.log('Login Success:', response);
    // Here you would send the `response.credential` (ID token) to your backend
    // For example: fetch('/api/auth/google/callback', { method: 'POST', body: JSON.stringify({ token: response.credential }) })
  };

  const onFailure = (error: any) => {
    console.log('Login Failed:', error);
  };

  return (
    <div>
      <GoogleLogin
        onSuccess={onSuccess}
        onError={onFailure}
      />
    </div>
  );
};

export default GoogleLoginButton;
