import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from './AuthContext';

const Signup = () => {
  const { signup } = useAuth();
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('user');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const me = await signup(name, email, password, undefined, role);
      if (role === 'seller') navigate('/sell'); else navigate('/');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto">
      <h2 className="text-2xl font-semibold mb-4 text-center">Sign Up</h2>
      {error && <p className="mb-2 text-center" style={{ color: '#b91c1c' }}>{error}</p>}
      <form onSubmit={onSubmit} className="space-y-4">
        <input className="w-full input" placeholder="Name" value={name} onChange={(e)=>setName(e.target.value)} required />
        <input className="w-full input" placeholder="Email" value={email} onChange={(e)=>setEmail(e.target.value)} type="email" required />
        <input className="w-full input" placeholder="Password" value={password} onChange={(e)=>setPassword(e.target.value)} type="password" required />
        <select className="w-full input" value={role} onChange={(e)=>setRole(e.target.value)}>
          <option value="user">User</option>
          <option value="seller">Seller</option>
        </select>
        <button disabled={loading} className="w-full btn btn-primary">{loading ? 'Signing up...' : 'Sign Up'}</button>
      </form>
      <div className="mt-4 text-center">
        <span>Already have an account? </span>
        <Link to="/login" className="btn" style={{ padding: '0.35rem 0.75rem' }}>Login</Link>
      </div>
    </div>
  );
};

export default Signup;


