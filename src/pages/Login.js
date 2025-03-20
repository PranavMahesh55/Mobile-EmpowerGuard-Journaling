import React, { useState } from 'react';

const Login = ({ setUsername }) => {
  const [input, setInput] = useState('');

  const handleLogin = (e) => {
    e.preventDefault();
    if(input.trim()){
      setUsername(input.trim());
    }
  };

  return (
    <div style={styles.container}>
      <h2>Login to EmpowerGuard Journaling</h2>
      <form onSubmit={handleLogin} style={styles.form}>
        <input 
          type="text" 
          placeholder="Enter your username" 
          value={input} 
          onChange={(e) => setInput(e.target.value)}
          style={styles.input}
        />
        <button type="submit" style={styles.button}>Login</button>
      </form>
    </div>
  );
};

const styles = {
  container: {
    display: 'flex', 
    flexDirection: 'column', 
    alignItems: 'center', 
    marginTop: '50px'
  },
  form: {
    display: 'flex', 
    flexDirection: 'column', 
    alignItems: 'center'
  },
  input: {
    padding: '10px',
    fontSize: '16px',
    marginBottom: '20px',
    width: '300px'
  },
  button: {
    padding: '10px 20px',
    fontSize: '16px',
    cursor: 'pointer'
  }
};

export default Login;