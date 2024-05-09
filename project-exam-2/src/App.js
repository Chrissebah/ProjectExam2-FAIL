import React, { useState } from 'react';
import './App.css';

function App() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [bio, setBio] = useState('');
  const [error, setError] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);

  const handleLogin = async () => {
    // Login logic remains the same
  };

  const handleRegister = async () => {
    try {
      // Reset error state
      setError(null);

      // Validation
      if (!email.match(/^[a-zA-Z0-9._%+-]+@stud\.noroff\.no$/)) {
        setError('Please enter a valid stud.noroff.no email address.');
        return;
      }

      if (password.length < 8) {
        setError('Password must be at least 8 characters.');
        return;
      }

      if (!username.match(/^[a-zA-Z0-9_]+$/)) {
        setError('Username must not contain punctuation symbols apart from underscore (_).');
        return;
      }

      if (bio.length > 160) {
        setError('Bio must be less than 160 characters.');
        return;
      }

      // Registration
      const response = await fetch('https://v2.api.noroff.dev/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password, username, bio }),
      });

      if (response.ok) {
        // Registration successful, create API key
        const registrationData = await response.json();
        const apiKeyResponse = await fetch('https://v2.api.noroff.dev/auth/create-api-key', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${registrationData.token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({}),
        });

        if (apiKeyResponse.ok) {
          // API key created successfully, proceed with login
          handleLogin();
        } else {
          setError('Failed to create API key.');
        }
      } else {
        setError('Registration failed. Please try again.');
      }
    } catch (error) {
      console.error('Error registering:', error);
      setError('An error occurred. Please try again later.');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsLoggedIn(false);
  };

  const handleSignUpClick = () => {
    setIsSignUp(true);
  };

  return (
    <div className="App">
      <nav className="navbar navbar-expand-lg bg-primary" data-bs-theme="dark">
        <div className="container-fluid">
          <span className="navbar-brand">Holidaze</span>
        </div>
      </nav>
      <header className="App-header">
        {isLoggedIn ? (
          <>
            <h1>Welcome, {email}!</h1>
            <button className="btn btn-primary btn-sm mr-2" onClick={handleLogout}>Logout</button>
          </>
        ) : isSignUp ? (
          <>
            <h1>Sign Up</h1>
            <div className="mb-3">
              <input
                type="email"
                className="form-control"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="mb-3">
              <input
                type="password"
                className="form-control"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <div className="mb-3">
              <input
                type="text"
                className="form-control"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>
            <div className="mb-3">
              <textarea
                className="form-control"
                placeholder="Bio (optional)"
                value={bio}
                onChange={(e) => setBio(e.target.value)}
              />
            </div>
            <button className="btn btn-primary btn-sm" onClick={handleRegister}>Sign Up</button>
            {error && <p className="error">{error}</p>}
          </>
        ) : (
          <>
            <h1>Login</h1>
            <div className="mb-3">
              <input
                type="email"
                className="form-control"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="mb-3">
              <input
                type="password"
                className="form-control"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <button className="btn btn-primary btn-sm me-2" onClick={handleLogin}>Login</button>
            <button className="btn btn-primary btn-sm" onClick={handleSignUpClick}>Sign Up</button>
            {error && <p className="error">{error}</p>}
          </>
        )}
      </header>
      <footer className="App-footer">
        {<p>Copyright © Holidaze | All Rights Reserved.</p>}
      </footer>
    </div>
  );
}

export default App;