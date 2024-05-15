import React, { useState } from 'react';
import './App.css';


function App() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [error, setError] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);

  const handleLogin = async () => {
    try {
      // Reset error state
      setError(null);
  
      // Login data
      const loginData = {
        email,
        password,
      };
  
      // Login request
      const response = await fetch('https://v2.api.noroff.dev/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(loginData),
      });
  
      if (response.ok) {
        // Login successful
        const responseData = await response.json();
        console.log('Login successful:', responseData);
  
        // Store JWT token securely (e.g., in local storage)
        localStorage.setItem('token', responseData.data.accessToken);
  
        // Proceed with further actions (e.g., navigate to dashboard)
      } else {
        // Login failed
        const errorData = await response.json();
        console.error('Login failed:', errorData);
        setError('Login failed. Please check your credentials and try again.');
      }
    } catch (error) {
      console.error('Error logging in:', error);
      setError('An error occurred. Please try again later.');
    }
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
  
      // Registration data
      const registrationData = {
        name: username,
        email,
        password,
        bio: "", 
        avatar: {
          url: "", 
          alt: "" 
        },
        banner: {
          url: "",
          alt: "" 
        },
        venueManager: true
      };
        
      // Registration request
      const response = await fetch('https://v2.api.noroff.dev/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(registrationData),
      });
  
      if (response.ok) {
        // Registration successful
        const responseData = await response.json();
        console.log('Registration successful:', responseData);
  
        // Create API Key
        const apiKeyResponse = await fetch('https://v2.api.noroff.dev/auth/create-api-key', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${responseData.token}`, // Use the token from registration response
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({}),
        });
  
        if (apiKeyResponse.ok) {
          // API Key created successfully
          const apiKeyData = await apiKeyResponse.json();
          console.log('API Key created:', apiKeyData);
  
          // Store JWT token and API key securely (e.g., in local storage)
          localStorage.setItem('token', responseData.token);
          localStorage.setItem('apiKey', apiKeyData.key);
  
          window.location.reload();
        } else {
          // Failed to create API Key
          console.error('Failed to create API key.');
          setError('Registration failed. Please try again.');
        }
      } else {
        // Registration failed
        const errorData = await response.json();
        console.error('Registration failed:', errorData);
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
          <button type="button" className="btn btn-secondary">Home</button>
          <button type="button" className="btn btn-secondary">Profile</button>
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