import React, { useState } from 'react';

const LoginPage = ({ onLogin }) => {
  const [studentCode, setStudentCode] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    // ✅ Validate format
    if (!/^SWH\d{5}$/.test(studentCode)) {
      setError("Student code must start with 'SWH' followed by 5 digits");
      return;
    }

    try {
      const response = await fetch('http://localhost:8000/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ student_code: studentCode, password }),
      });

      if (!response.ok) {
        throw new Error('Invalid student code or password');
      }

      const user = await response.json();
      onLogin(user.student_code);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="login-container">
      <form className="login-form" onSubmit={handleSubmit}>
        <h2>Student Login</h2>
        <input
          type="text"
          placeholder="Student Code (e.g. SWH02300)"
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
