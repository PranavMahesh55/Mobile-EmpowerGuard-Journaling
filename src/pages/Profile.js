import React, { useState, useEffect } from 'react';

const Profile = ({ username }) => {
  // Load saved profile from localStorage (if any) or initialize default
  const getInitialProfile = () => {
    const storedProfile = localStorage.getItem('profile');
    if (storedProfile) {
      return JSON.parse(storedProfile);
    } else {
      return {
        name: username,
        bio: '',
        email: '',
        theme: 'light'
      };
    }
  };

  const [profileInfo, setProfileInfo] = useState(getInitialProfile());

  useEffect(() => {
    // When component mounts, update state with localStorage data
    setProfileInfo(getInitialProfile());
  }, []);

  const handleChange = (e) => {
    setProfileInfo({ ...profileInfo, [e.target.name]: e.target.value });
  };

  const handleSave = () => {
    // Save profile data to localStorage
    localStorage.setItem('profile', JSON.stringify(profileInfo));
    console.log("Saved profile:", profileInfo);
    alert("Profile saved!");
  };

  return (
    <div style={styles.container}>
      <h2>Profile</h2>
      <div style={styles.profileSection}>
        <label>Name:</label>
        <input 
          type="text" 
          name="name" 
          value={profileInfo.name} 
          onChange={handleChange} 
          style={styles.input}
        />
      </div>
      <div style={styles.profileSection}>
        <label>Bio:</label>
        <textarea 
          name="bio" 
          value={profileInfo.bio} 
          onChange={handleChange} 
          style={styles.textarea}
        />
      </div>
      <div style={styles.profileSection}>
        <label>Email:</label>
        <input 
          type="email" 
          name="email" 
          value={profileInfo.email} 
          onChange={handleChange} 
          style={styles.input}
        />
      </div>
      <button onClick={handleSave} style={styles.button}>Save Profile</button>
    </div>
  );
};

const styles = {
  container: {
    padding: '20px'
  },
  profileSection: {
    marginBottom: '15px'
  },
  input: {
    width: '100%',
    padding: '10px',
    marginTop: '5px'
  },
  textarea: {
    width: '100%',
    height: '100px',
    padding: '10px',
    marginTop: '5px'
  },
  select: {
    width: '100%',
    padding: '10px',
    marginTop: '5px'
  },
  button: {
    padding: '10px 20px',
    backgroundColor: '#1976d2',
    color: '#fff',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer'
  }
};

export default Profile;