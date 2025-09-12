import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from './AuthContext';

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const me = await login(email, password);
      if (me && me.role === 'seller') navigate('/sell');
      else navigate('/');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto">
      <h2 className="text-2xl font-semibold mb-4 text-center">Login</h2>
      {error && <p className="mb-2 text-center" style={{ color: '#b91c1c' }}>{error}</p>}
      <form onSubmit={onSubmit} className="space-y-4">
        <input className="w-full input" placeholder="Email" value={email} onChange={(e)=>setEmail(e.target.value)} type="email" required />
        <input className="w-full input" placeholder="Password" value={password} onChange={(e)=>setPassword(e.target.value)} type="password" required />
        <button disabled={loading} className="w-full btn btn-primary">{loading ? 'Logging in...' : 'Login'}</button>
      </form>
      <div className="mt-4 text-center">
        <span>New here? </span>
        <Link to="/signup" className="btn" style={{ padding: '0.35rem 0.75rem' }}>Create an account</Link>
      </div>
    </div>
  );
};

export default Login;


