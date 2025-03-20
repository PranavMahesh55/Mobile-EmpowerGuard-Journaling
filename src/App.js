import React, { useState } from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import Home from './pages/Home';
import Journal from './pages/Journal';
import Dashboard from './pages/Dashboard';
import Profile from './pages/Profile';
import Login from './pages/Login';

function App() {
  const [username, setUsername] = useState('');

  return (
    <div>
      { !username ? (
          <Login setUsername={setUsername} />
      ) : (
        <>
          <header style={styles.header}>
            <div style={styles.logoContainer}>
              <h1 style={styles.logo}>EmpowerGuard Journaling</h1>
            </div>
            <nav style={styles.nav}>
              <Link to="/" style={styles.navLink}>Home</Link>
              <Link to="/journal" style={styles.navLink}>Journal</Link>
              <Link to="/dashboard" style={styles.navLink}>Dashboard</Link>
              <Link to="/profile" style={styles.navLink}>Profile</Link>
            </nav>
          </header>
          <main style={styles.main}>
            <Routes>
              <Route path="/" element={<Home username={username} />} />
              <Route path="/journal" element={<Journal username={username} />} />
              <Route path="/dashboard" element={<Dashboard username={username} />} />
              <Route path="/profile" element={<Profile username={username} />} />
            </Routes>
          </main>
        </>
      )}
    </div>
  );
}

const styles = {
  header: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '20px 40px',
    backgroundColor: '#1976d2',
    color: '#fff',
    boxShadow: '0 2px 8px rgba(0,0,0,0.2)'
  },
  logoContainer: {
    flex: 1
  },
  logo: {
    margin: 0,
    fontSize: '28px',
    fontWeight: 'bold'
  },
  nav: {
    display: 'flex',
    gap: '20px'
  },
  navLink: {
    color: '#fff',
    textDecoration: 'none',
    fontSize: '18px',
    fontWeight: '500'
  },
  main: {
    padding: '20px'
  }
};

export default App;