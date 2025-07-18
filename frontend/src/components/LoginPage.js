import React, { useState } from 'react';
import axios from 'axios';

const LoginPage = ({ onLogin }) => {
  const [studentCode, setStudentCode] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
  e.preventDefault();
  try {
    const res = await axios.post('http://localhost:8000/login', {
      id: studentCode,
      password: password
    });
    
    const user = res.data.user;
    onLogin(user); // pass full user object
  } catch (err) {
    if (err.response) {
      setError(err.response.data.detail);
    } else {
      setError('Login failed. Server error.');
    }
  }
};


  return (
    <div className="login-container">
      <form className="login-form" onSubmit={handleSubmit}>
        <h2>Student Login</h2>
        <input
          type="text"
          placeholder="Student ID"
          value={studentCode}
          onChange={(e) => setStudentCode(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        {error && <p className="login-error">{error}</p>}
        <button type="submit">Login</button>
      </form>
    </div>
  );
};

export default LoginPage;
