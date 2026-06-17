import { useState, useContext, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { User, Mail, Lock, UserPlus, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';

const Signup = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('student');
  const [isLoading, setIsLoading] = useState(false);

  const { signup, user } = useContext(AuthContext);
  const navigate = useNavigate();

  // If already logged in, redirect based on role
  useEffect(() => {
    if (user) {
      if (user.role === 'admin') {
        navigate('/admin');
      } else {
        navigate('/student');
      }
    }
  }, [user, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name || !email || !password || !role) {
      toast.error('All fields are required');
      return;
    }

    if (password.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }

    try {
      setIsLoading(true);
      const res = await signup(name, email, password, role);
      setIsLoading(false);

      if (res.success) {
        toast.success(`Account created as ${role}!`);
      } else {
        toast.error(res.message);
      }
    } catch (err) {
      setIsLoading(false);
      toast.error('An unexpected error occurred');
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4 premium-bg relative overflow-hidden transition-colors duration-300">
      
      {/* Floating gradient blur blobs */}
      <div className="absolute top-12 left-12 w-[350px] h-[350px] bg-blue-400/15 dark:bg-blue-600/20 rounded-full blur-[110px] animate-float-1 pointer-events-none"></div>
      <div className="absolute top-1/3 right-12 w-[400px] h-[400px] bg-purple-400/15 dark:bg-purple-600/20 rounded-full blur-[120px] animate-float-2 pointer-events-none"></div>
      <div className="absolute bottom-12 left-1/3 w-[300px] h-[300px] bg-indigo-400/12 dark:bg-indigo-600/15 rounded-full blur-[90px] animate-float-3 pointer-events-none"></div>
      <div className="absolute bottom-1/3 right-1/4 w-[250px] h-[250px] bg-pink-400/10 dark:bg-pink-600/12 rounded-full blur-[80px] animate-float-4 pointer-events-none"></div>

      {/* Main Glass Card */}
      <div className="glass-card w-full max-w-md p-8 md:p-10 rounded-2xl shadow-2xl relative z-10 transition-shadow duration-300">
        
        {/* Branding & Title */}
        <div className="text-center mb-8">
          <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight mb-2">
            Create Account
          </h2>
          <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">
            Sign up to manage and view assignments
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          
          {/* Full Name */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 block">
              Full Name
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-450 dark:text-slate-500">
                <User size={18} />
              </div>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="John Doe"
                className="glass-input w-full pl-10 pr-4 py-2.5 rounded-xl text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none transition-all font-medium text-sm"
              />
            </div>
          </div>

          {/* Email Address */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 block">
              Email Address
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-450 dark:text-slate-500">
                <Mail size={18} />
              </div>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="john@example.com"
                className="glass-input w-full pl-10 pr-4 py-2.5 rounded-xl text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none transition-all font-medium text-sm"
              />
            </div>
          </div>

          {/* Password */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 block">
              Password
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-450 dark:text-slate-500">
                <Lock size={18} />
              </div>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="•••••••• (min 6 chars)"
                className="glass-input w-full pl-10 pr-4 py-2.5 rounded-xl text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none transition-all font-medium text-sm"
              />
            </div>
          </div>

          {/* Account Role Dropdown */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 block">
              Join As
            </label>
            <div className="grid grid-cols-2 gap-4">
              <label className={`flex items-center justify-center gap-2 py-3 px-4 rounded-xl border text-sm font-semibold cursor-pointer transition-all ${
                role === 'student'
                  ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white border-transparent shadow-[0_0_12px_rgba(99,102,241,0.25)] scale-102'
                  : 'glass border-white/20 dark:border-slate-800/80 text-slate-500 dark:text-slate-400 hover:bg-white/20 dark:hover:bg-slate-800/50'
              }`}>
                <input
                  type="radio"
                  name="role"
                  value="student"
                  checked={role === 'student'}
                  onChange={() => setRole('student')}
                  className="sr-only"
                />
                🎓 Student
              </label>

              <label className={`flex items-center justify-center gap-2 py-3 px-4 rounded-xl border text-sm font-semibold cursor-pointer transition-all ${
                role === 'admin'
                  ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white border-transparent shadow-[0_0_12px_rgba(99,102,241,0.25)] scale-102'
                  : 'glass border-white/20 dark:border-slate-800/80 text-slate-500 dark:text-slate-400 hover:bg-white/20 dark:hover:bg-slate-800/50'
              }`}>
                <input
                  type="radio"
                  name="role"
                  value="admin"
                  checked={role === 'admin'}
                  onChange={() => setRole('admin')}
                  className="sr-only"
                />
                🛡️ Admin
              </label>
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={isLoading}
            className="btn-glow w-full flex items-center justify-center gap-2 py-3.5 mt-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold rounded-xl shadow-lg shadow-blue-500/10 hover:shadow-blue-500/20 transition-all duration-300 active:scale-[0.99] disabled:opacity-50 disabled:scale-100 disabled:pointer-events-none cursor-pointer uppercase tracking-wider text-xs"
          >
            {isLoading ? (
              <Loader2 size={18} className="animate-spin" />
            ) : (
              <>
                <UserPlus size={18} />
                Create Account
              </>
            )}
          </button>

        </form>

        {/* Footer Navigation */}
        <div className="text-center mt-6 text-sm text-slate-500 dark:text-slate-400">
          Already have an account?{' '}
          <Link 
            to="/login" 
            className="text-blue-600 dark:text-blue-450 hover:underline font-semibold transition-all"
          >
            Sign in here
          </Link>
        </div>

      </div>
    </div>
  );
};

export default Signup;
