import React, { useEffect } from 'react';
import axios from 'axios';

const Login = ({ setUser }) => {
  useEffect(() => {
    // Load Telegram Login Widget
    const script = document.createElement('script');
    script.src = 'https://telegram.org/js/telegram-widget.js?7';
    script.setAttribute('data-telegram-login', 'Krizzdrivebot'); // Replace with your bot username
    script.setAttribute('data-size', 'large');
    script.setAttribute('data-userpic', 'false');
    script.setAttribute('data-onauth', 'onTelegramAuth(user)');
    script.setAttribute('data-request-access', 'write');
    script.async = true;

    document.getElementById('telegram-login').appendChild(script);

    // Global function for Telegram auth callback
    window.onTelegramAuth = async (userData) => {
      try {
        const response = await axios.post('http://localhost:8000/auth/telegram', userData);
        const { user } = response.data;
        setUser(user);
        localStorage.setItem('user', JSON.stringify(user));
      } catch (error) {
        console.error('Authentication failed:', error);
      }
    };
  }, [setUser]);

  return (
    <div className="login-container">
      <div className="login-box">
        <h1>Cloud Box</h1>
        <p>Login with your Telegram account to access your cloud storage</p>
        <div id="telegram-login"></div>
      </div>
    </div>
  );
};

export default Login; 