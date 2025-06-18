import React, { useState } from 'react';
import './AuthUI.css';

export default function AuthUI() {
  const [isSlidLeft, setIsSlidLeft] = useState(false);

  const toggleSlide = () => {
    setIsSlidLeft(!isSlidLeft);
  };

  return (
    <div className="auth-ui">
      <div className="auth-container">
        <div
          className="auth-slider"
          id="auth-slider"
          style={{ transform: isSlidLeft ? 'translateX(-451px)' : 'translateX(0)' }}
        >
          <div className="auth-box auth-left">
            <div className="auth-form-section">
              <div className="auth-form-box">
                <h2>Login</h2>
                <form method="POST">
                  <input type="hidden" name="form_type" value="login" />
                  <div className="auth-input-group">
                    <input type="email" name="email" placeholder="Email" required />
                    <span className="auth-icon">📧</span>
                  </div>
                  <div className="auth-input-group">
                    <input type="password" name="password" placeholder="Password" required />
                    <span className="auth-icon">🔒</span>
                  </div>
                  <button className="auth-action-btn">Login</button>
                  <p className="auth-error">{/* Error will be shown here if needed */}</p>
                </form>
                <p className="auth-social-text">or login with social platforms</p>
                <div className="auth-social-icons">
                  <a href="#"><img src="https://img.icons8.com/ios-filled/50/000000/google-logo.png" alt="Google" /></a>
                  <a href="#"><img src="https://img.icons8.com/ios-filled/50/000000/facebook-new.png" alt="Facebook" /></a>
                  <a href="#"><img src="https://img.icons8.com/ios-filled/50/000000/github.png" alt="GitHub" /></a>
                  <a href="#"><img src="https://img.icons8.com/ios-filled/50/000000/linkedin.png" alt="LinkedIn" /></a>
                </div>
              </div>
            </div>
          </div>

          <div className="auth-box auth-middle">
            <div className={`auth-panel-section ${isSlidLeft ? 'slide-active' : ''}`}>
              <h2>{isSlidLeft ? 'Welcome Back!' : 'Hello, Welcome!'}</h2>
              <p>{isSlidLeft ? 'Already have an account?' : "Don't have an account?"}</p>
              <button onClick={toggleSlide}>{isSlidLeft ? 'Login' : 'Register'}</button>
            </div>
          </div>

          <div className="auth-box auth-right">
            <div className="auth-form-box">
              <h2>Register</h2>
              <form method="POST">
                <input type="hidden" name="form_type" value="register" />
                <input type="hidden" name="created_at" value={new Date().toISOString().slice(0, 19).replace('T', ' ')} />

                <div className="auth-input-group">
                  <input type="text" name="name" placeholder="Full Name" required />
                  <span className="auth-icon">👤</span>
                </div>
                <div className="auth-input-group">
                  <input type="email" name="email" placeholder="Email" required />
                  <span className="auth-icon">📧</span>
                </div>
                <div className="auth-input-group">
                  <input type="password" name="password" placeholder="Password" required />
                  <span className="auth-icon">🔒</span>
                </div>
                <div className="auth-input-group">
                  <input type="text" name="address" placeholder="Address" required />
                  <span className="auth-icon">🏠</span>
                </div>
                <div className="auth-input-group">
                  <input
                    type="tel"
                    name="phone"
                    placeholder="Phone Number"
                    required
                    pattern="[0-9]{7,15}"
                  />
                  <span className="auth-icon">📞</span>
                </div>
                <button className="auth-action-btn" type="submit">Register</button>
                <p className="auth-error">{/* Registration error message here */}</p>
                <p className="auth-social-text">or register with social platforms</p>
                <div className="auth-social-icons">
                  <a href="#"><img src="https://img.icons8.com/ios-filled/50/000000/google-logo.png" alt="Google" /></a>
                  <a href="#"><img src="https://img.icons8.com/ios-filled/50/000000/facebook-new.png" alt="Facebook" /></a>
                  <a href="#"><img src="https://img.icons8.com/ios-filled/50/000000/github.png" alt="GitHub" /></a>
                  <a href="#"><img src="https://img.icons8.com/ios-filled/50/000000/linkedin.png" alt="LinkedIn" /></a>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
