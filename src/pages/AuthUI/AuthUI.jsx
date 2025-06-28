import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // <-- Import this
import './AuthUI.css';

const AuthUI = () => {
  const [isSlidLeft, setIsSlidLeft] = useState(false);
  const navigate = useNavigate(); // <-- Add this

  const toggleSlide = () => setIsSlidLeft(prev => !prev);

  // Register form state and status
  const [registerData, setRegisterData] = useState({
    fullName: '',
    email: '',
    password: '',
    phone: ''
  });
  const [registerStatus, setRegisterStatus] = useState({
    message: '',
    success: null
  });

  // Login form state and status
  const [loginData, setLoginData] = useState({
    email: '',
    password: ''
  });
  const [loginStatus, setLoginStatus] = useState({
    message: '',
    success: null
  });

  // Register handler (same as before)
  const onRegister = async e => {
    e.preventDefault();
    setRegisterStatus({ message: '', success: null });

    const { fullName, email, password, phone } = registerData;

    try {
      const res = await fetch('http://localhost:3001/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fullName, email, password, phone })
      });

      const data = await res.json();

      if (res.ok) {
        setRegisterStatus({ message: '✅ Registered successfully!', success: true });
        setRegisterData({ fullName: '', email: '', password: '', phone: '' });
        setTimeout(() => toggleSlide(), 1200); 
      } else {
        setRegisterStatus({ message: data.msg || '❌ Registration failed', success: false });
      }
    } catch (err) {
      setRegisterStatus({ message: '❌ Server error', success: false });
    }
  };

  // Login handler with JWT
  const onLogin = async e => {
    e.preventDefault();
    setLoginStatus({ message: '', success: null });

    const { email, password } = loginData;

    try {
      const res = await fetch('http://localhost:3001/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      const data = await res.json();

      if (res.ok) {
  setLoginStatus({ message: '✅ Login successful!', success: true });

  localStorage.setItem('token', data.token);  // store JWT token
  localStorage.setItem('user', JSON.stringify(data.user)); // ✅ store full user object

  window.dispatchEvent(new Event('storageChanged'));
  setLoginData({ email: '', password: '' });

  setTimeout(() => navigate('/play'), 1000); // <-- Redirect after 1s
}
else {
        setLoginStatus({ message: data.msg || '❌ Login failed', success: false });
      }
    } catch (err) {
      setLoginStatus({ message: '❌ Server error', success: false });
    }
  };



  return (
    <div className="auth-container">
      <div
        className="auth-slider"
        style={{ transform: isSlidLeft ? 'translateX(-451px)' : 'translateX(0)' }}
      >
        {/* Login Box */}
        <div className="box left">
          <div className="auth-form-box">
            <h2>Login</h2>

            {loginStatus.message && (
              <p
                style={{
                  color: loginStatus.success ? 'green' : 'red',
                  fontSize: '14px',
                  marginBottom: '8px'
                }}
              >
                {loginStatus.message}
              </p>
            )}

            <form onSubmit={onLogin}>
              <div className="auth-input-group">
                <input
                  type="email"
                  placeholder="Email"
                  required
                  value={loginData.email}
                  onChange={e => setLoginData({ ...loginData, email: e.target.value })}
                />
                <span className="icon">📧</span>
              </div>
              <div className="auth-input-group">
                <input
                  type="password"
                  placeholder="Password"
                  required
                  value={loginData.password}
                  onChange={e => setLoginData({ ...loginData, password: e.target.value })}
                />
                <span className="icon">🔒</span>
              </div>
              <button className="auth-action-btn">Login</button>
            </form>
          </div>
        </div>

        {/* Middle Panel */}
        <div className="box_middle">
          <div className={`panel-section${isSlidLeft ? ' slide-active' : ''}`}>
            <h2>Hello, Welcome!</h2>
            <p>{isSlidLeft ? 'Already have an account?' : "Don't have an account?"}</p>
            <button onClick={toggleSlide}>
              {isSlidLeft ? 'Login' : 'Register'}
            </button>
          </div>
        </div>

        {/* Register Box */}
        <div className="box right">
          <div className="auth-form-box">
            <h2>Register</h2>
            {registerStatus.message && (
              <p
                style={{
                  color: registerStatus.success ? 'green' : 'red',
                  fontSize: '14px',
                  marginBottom: '8px'
                }}
              >
                {registerStatus.message}
              </p>
            )}
            <form onSubmit={onRegister}>
              <div className="auth-input-group">
                <input
                  type="text"
                  placeholder="Name"
                  required
                  value={registerData.fullName}
                  onChange={e => setRegisterData({ ...registerData, fullName: e.target.value })}
                />
                <span className="icon">👤</span>
              </div>
              <div className="auth-input-group">
                <input
                  type="email"
                  placeholder="Email"
                  required
                  value={registerData.email}
                  onChange={e => setRegisterData({ ...registerData, email: e.target.value })}
                />
                <span className="icon">📧</span>
              </div>
              <div className="auth-input-group">
                <input
                  type="password"
                  placeholder="Password"
                  required
                  value={registerData.password}
                  onChange={e => setRegisterData({ ...registerData, password: e.target.value })}
                />
                <span className="icon">🔒</span>
              </div>
              <div className="auth-input-group">
                <input
                  type="tel"
                  placeholder="Phone Number"
                  required
                  pattern="[0-9]{7,15}"
                  value={registerData.phone}
                  onChange={e => setRegisterData({ ...registerData, phone: e.target.value })}
                />
                <span className="icon">📞</span>
              </div>
              <button className="action-btn">Register</button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthUI;
