import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../api';

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({ username: '', email: '', password: '', role: 'general' });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    const endpoint = isLogin ? '/auth/login' : '/auth/register';
    
    try {
      const { data } = await API.post(endpoint, formData);
      localStorage.setItem('userInfo', JSON.stringify(data));
      navigate('/feed');
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong');
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 px-4">
      <div className="w-full max-w-md rounded-xl bg-white p-8 shadow-md">
        <h2 className="mb-6 text-center text-3xl font-bold text-gray-800">
          {isLogin ? 'Sign In to TrafficAlert' : 'Create an Account'}
        </h2>
        
        {error && <div className="mb-4 rounded bg-red-100 p-3 text-sm text-red-700">{error}</div>}

        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && (
            <div>
              <label className="block text-sm font-medium text-gray-700">Username</label>
              <input type="text" required className="mt-1 w-full rounded border p-2 focus:outline-blue-500"
                onChange={(e) => setFormData({ ...formData, username: e.target.value })} />
            </div>
          )}
          <div>
            <label className="block text-sm font-medium text-gray-700">Email Address</label>
            <input type="email" required className="mt-1 w-full rounded border p-2 focus:outline-blue-500"
              onChange={(e) => setFormData({ ...formData, email: e.target.value })} />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Password</label>
            <input type="password" required className="mt-1 w-full rounded border p-2 focus:outline-blue-500"
              onChange={(e) => setFormData({ ...formData, password: e.target.value })} />
          </div>
          
          {!isLogin && (
            <div>
              <label className="block text-sm font-medium text-gray-700">Account Role</label>
              <select className="mt-1 w-full rounded border p-2 focus:outline-blue-500 bg-white"
                value={formData.role} onChange={(e) => setFormData({ ...formData, role: e.target.value })}>
                <option value="general">General User</option>
                <option value="moderator">Moderator</option>
                <option value="authority">Authority Body</option>
              </select>
            </div>
          )}

          <button type="submit" className="w-full rounded bg-blue-600 p-2 font-semibold text-white hover:bg-blue-700 transition">
            {isLogin ? 'Login' : 'Register'}
          </button>
        </form>

        <p className="mt-4 text-center text-sm text-gray-600">
          {isLogin ? "Don't have an account?" : "Already have an account?"}{' '}
          <button onClick={() => setIsLogin(!isLogin)} className="text-blue-600 font-medium hover:underline">
            {isLogin ? 'Sign Up' : 'Log In'}
          </button>
        </p>
      </div>
    </div>
  );
};

export default Auth;