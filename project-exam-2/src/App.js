import React, { useState } from 'react';
import './App.css';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Content from './pages/content';
import Profile from './pages/profile';

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
  
        // Set logged in state
        setIsLoggedIn(true);
  
        // Redirect to profile page or dashboard
        
      } else {
        
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
    // Your register logic
  };
  

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsLoggedIn(false);
  };

  const handleSignUpClick = () => {
    setIsSignUp(true);
  };

  return (
    <Router>
      <div className="App">
        <nav className="navbar navbar-expand-lg bg-primary" data-bs-theme="dark">
          <div className="container-fluid">
            <span className="navbar-brand">Holidaze</span>
            </div>
            <Link to="/content" className="btn btn-secondary me-2">Home</Link>
            <Link to="/profile" className="btn btn-secondary me-2">Profile</Link>
      
        </nav>
        <header className="App-header">
        <Routes>
              <Route path="/" element={
                isLoggedIn ? (
                  <>
                    <h1>Welcome, {email}!</h1>
                    <Link to="/content" className="btn btn-primary btn-sm mr-2 btn-margin">Venues</Link>
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
                      )
                    } />
                    <Route path="/profile" element={<Profile />} />
                    <Route path="/content" element={<Content />} />
                  </Routes>
        </header>
        <footer className="App-footer">
          {<p>Copyright © Holidaze | All Rights Reserved.</p>}
        </footer>
      </div>
    </Router>
  );
}

export default App;