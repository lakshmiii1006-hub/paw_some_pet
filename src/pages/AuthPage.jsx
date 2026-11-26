
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const API_BASE = import.meta.env.VITE_API_URL || 'https://paw-some-pet.onrender.com';
const API_URL = `${API_BASE}/api/auth`;


function AuthPage() {
  const navigate = useNavigate();

  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'adopter'
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError('');
    setSuccess('');
    setLoading(true);

    try {
      const endpoint = isLogin ? '/login' : '/register';

      const body = isLogin
        ? {
            email: formData.email,
            password: formData.password
          }
        : formData;

      const response = await fetch(`${API_URL}${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(body)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Something went wrong');
      }

      if (isLogin) {
        sessionStorage.setItem('authToken', data.token);
        sessionStorage.setItem('authUser', JSON.stringify(data.user));
        window.dispatchEvent(new Event('auth-change'));

        if (data.user.role === 'admin') {
          sessionStorage.setItem('adminToken', data.token);
          navigate('/admin');
        } else {
          navigate('/');
        }
      } else {
        setSuccess('Registration successful! Please log in.');
        setIsLogin(true);

        setFormData((previous) => ({
          ...previous,
          name: '',
          password: ''
        }));
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-5">

      <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl p-8">

        <div className="text-center mb-7">
          <div className="text-5xl mb-3">🐾</div>

          <h1 className="text-3xl font-black text-slate-900">
            PawsomeAdapt
          </h1>

          <p className="text-slate-500 mt-2">
            {isLogin
              ? 'Welcome back! Login to continue.'
              : 'Join our community of pet lovers.'}
          </p>
        </div>

        <div className="flex bg-slate-100 rounded-xl p-1 mb-6">
          <button
            type="button"
            onClick={() => {
              setIsLogin(true);
              setError('');
              setSuccess('');
            }}
            className={`flex-1 py-2 rounded-lg font-semibold ${
              isLogin
                ? 'bg-white shadow text-slate-900'
                : 'text-slate-500'
            }`}
          >
            Login
          </button>

          <button
            type="button"
            onClick={() => {
              setIsLogin(false);
              setError('');
              setSuccess('');
            }}
            className={`flex-1 py-2 rounded-lg font-semibold ${
              !isLogin
                ? 'bg-white shadow text-slate-900'
                : 'text-slate-500'
            }`}
          >
            Register
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">

          {!isLogin && (
            <>
              <div>
                <label className="block text-sm font-semibold mb-2">
                  Full Name
                </label>

                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Enter your name"
                  required
                  className="w-full border border-slate-300 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2">
                  Register As
                </label>

                <select
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  className="w-full border border-slate-300 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="adopter">Pet Adopter</option>
                  <option value="owner">Pet Owner</option>
                  <option value="rescuer">Rescuer</option>
                  <option value="shelter">Animal Shelter</option>
                </select>
              </div>
            </>
          )}

          <div>
            <label className="block text-sm font-semibold mb-2">
              Email Address
            </label>

            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email"
              required
              className="w-full border border-slate-300 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold mb-2">
              Password
            </label>

            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter your password"
              minLength={8}
              required
              className="w-full border border-slate-300 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          {error && (
            <p className="text-red-600 text-sm">{error}</p>
          )}

          {success && (
            <p className="text-green-600 text-sm">{success}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 rounded-xl transition disabled:opacity-50"
          >
            {loading
              ? 'Please wait...'
              : isLogin
                ? 'Login'
                : 'Create Account'}
          </button>

        </form>

        <p className="text-center text-sm text-slate-500 mt-6">
          By continuing, you agree to help make pet adoption better. ❤️
        </p>

      </div>
    </div>
  );
}

export default AuthPage;
