import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { loginUser, registerUser, clearError } from '../features/authSlice';
import logo from '../assets/logo.png';
import { toast } from 'react-hot-toast';

const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const { user, loading, error } = useSelector((state) => state.auth);

  const from = location.state?.from?.pathname || '/';

  useEffect(() => {
    if (user) {
      navigate(from, { replace: true });
    }
  }, [user, navigate, from]);

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearError());
    }
  }, [error, dispatch]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isLogin) {
      dispatch(loginUser({ email, password }));
    } else {
      if (!name) return toast.error('Name is required');
      dispatch(registerUser({ name, email, password }));
    }
  };

  const fillDemoUser = () => {
    setEmail('demo@nike.com');
    setPassword('demo123');
    setIsLogin(true);
  };

  const fillAdminUser = () => {
    setEmail('admin@nike.com');
    setPassword('admin123');
    setIsLogin(true);
  };

  return (
    <div className="bg-slate-900 min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
      {/* Dynamic background lighting */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-indigo-600/20 rounded-full blur-3xl pointer-events-none"></div>

      <div className="w-full max-w-md bg-slate-800/80 backdrop-blur-2xl border border-slate-700/80 rounded-3xl p-8 shadow-2xl relative z-10">
        <div className="text-center mb-8">
          <Link to="/" className="inline-block mb-3">
            <img src={logo} alt="Nike Logo" className="w-16 h-auto mx-auto filter brightness-0 invert" />
          </Link>
          <h2 className="text-2xl font-black text-white uppercase tracking-wider">
            {isLogin ? 'Welcome Back' : 'Create Account'}
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            {isLogin ? 'Sign in to access your orders and profile' : 'Join the Nike community today'}
          </p>
        </div>

        {/* Tab Selector */}
        <div className="flex bg-slate-900/80 p-1 rounded-xl mb-6 border border-slate-700">
          <button
            type="button"
            onClick={() => setIsLogin(true)}
            className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all ${
              isLogin ? 'bg-blue-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
            }`}
          >
            Login
          </button>
          <button
            type="button"
            onClick={() => setIsLogin(false)}
            className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all ${
              !isLogin ? 'bg-blue-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
            }`}
          >
            Register
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && (
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Full Name</label>
              <input
                type="text"
                placeholder="John Doe"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-blue-500"
              />
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Email Address</label>
            <input
              type="email"
              placeholder="name@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Password</label>
            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-blue-500"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold py-3.5 rounded-xl shadow-lg hover:shadow-blue-500/30 active:scale-95 transition-all text-sm uppercase tracking-wider mt-4"
          >
            {loading ? 'Processing...' : isLogin ? 'Sign In' : 'Create Account'}
          </button>
        </form>

        {/* Demo Quick Logins */}
        <div className="mt-8 pt-6 border-t border-slate-700/60 text-center">
          <p className="text-xs text-slate-400 mb-3">Quick Demo Access:</p>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={fillDemoUser}
              className="flex-1 bg-slate-700 hover:bg-slate-600 text-slate-200 font-semibold text-xs py-2 px-3 rounded-lg transition-all"
            >
              Demo User
            </button>
            <button
              type="button"
              onClick={fillAdminUser}
              className="flex-1 bg-purple-600/30 hover:bg-purple-600/50 text-purple-200 border border-purple-500/50 font-semibold text-xs py-2 px-3 rounded-lg transition-all"
            >
              Admin Access
            </button>
          </div>
        </div>

        <div className="text-center mt-6">
          <Link to="/" className="text-xs text-slate-400 hover:text-white transition-colors">
            ← Return to Store
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
