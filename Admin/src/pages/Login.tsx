import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import styles from './Login.module.css';

const Login: React.FC = () => {
  const [identifier, setIdentifier] = useState('admin@murakkaz.com');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanId = (identifier || '').trim();
    const cleanPw = (password || '').trim();
    if (!cleanId || !cleanPw) return;
    setError('');
    setLoading(true);

    try {
      const isEmail = cleanId.includes('@');
      await login({
        email: isEmail ? cleanId.toLowerCase() : undefined,
        phone: !isEmail ? cleanId : undefined,
        password: cleanPw
      });
      navigate('/');
    } catch (err: any) {
      console.error('Admin login error:', err);
      let userFriendlyMessage = 'Invalid administrative credentials. Please try again.';
      if (err.message) {
        try {
          const parsed = JSON.parse(err.message);
          if (parsed.message) {
            userFriendlyMessage = parsed.message;
          }
          if (parsed.errors && Array.isArray(parsed.errors) && parsed.errors.length > 0) {
            userFriendlyMessage = parsed.errors[0].message || userFriendlyMessage;
          }
        } catch {
          userFriendlyMessage = err.message;
        }
      }
      setError(userFriendlyMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.loginContainer}>
      <div className={styles.loginCard}>
        <h1 className={styles.brandTitle}>MURAKKAZ ADMIN</h1>
        <p className={styles.subtitle}>Administrative Backoffice Portal</p>

        {error && <div className={styles.errorToast}>{error}</div>}

        <form onSubmit={handleLogin} className={styles.form}>
          <div className={styles.inputGroup}>
            <label>Admin Email / Phone</label>
            <input 
              type="text" 
              value={identifier} 
              onChange={(e) => setIdentifier(e.target.value)}
              placeholder="e.g. admin@murakkaz.com"
              required 
            />
          </div>
          <div className={styles.inputGroup}>
            <label>Master Password</label>
            <div className={styles.passwordWrapper}>
              <input 
                type={showPassword ? "text" : "password"} 
                value={password} 
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
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
            {loading ? 'Authenticating Admin...' : 'Sign In to Admin Portal'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
