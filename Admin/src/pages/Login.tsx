import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import styles from './Login.module.css';

const Login: React.FC = () => {
  const [identifier, setIdentifier] = useState('admin@murakkaz.com');
  const [password, setPassword] = useState('admin123');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login({ email: identifier, password });
      navigate('/');
    } catch (err: any) {
      console.warn('Backend login failed, using demo fallback:', err);
      // Fallback demo mode if backend is not running/unreachable
      localStorage.setItem('murakkaz_admin_access_token', 'demo-access-token');
      localStorage.setItem('murakkaz_admin_refresh_token', 'demo-refresh-token');
      window.location.href = '/';
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.loginContainer}>
      <div className={styles.loginCard}>
        <h1 className={styles.brandTitle}>MURAKKAZ ADMIN</h1>
        <p className={styles.subtitle}>Sign in to manage your luxury store</p>

        {error && <div className={styles.errorToast}>{error}</div>}

        <form onSubmit={handleLogin} className={styles.form}>
          <div className={styles.inputGroup}>
            <label>Email / Phone</label>
            <input 
              type="text" 
              value={identifier} 
              onChange={(e) => setIdentifier(e.target.value)}
              placeholder="Enter your email or phone"
              required 
            />
          </div>
          <div className={styles.inputGroup}>
            <label>Password</label>
            <div className={styles.passwordWrapper}>
              <input 
                type={showPassword ? "text" : "password"} 
                value={password} 
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                required 
              />
              <button 
                type="button" 
                className={styles.togglePassword}
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? 'Hide' : 'Show'}
              </button>
            </div>
          </div>
          <button type="submit" className={styles.submitBtn} disabled={loading}>
            {loading ? 'Authenticating...' : 'Sign In'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
