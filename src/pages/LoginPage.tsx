import { useState, FormEvent, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuthStore } from '@/store/authStore';
import { toast } from 'react-hot-toast';
import { Sword, Shield } from 'lucide-react';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { signIn, loading, user, initialized } = useAuthStore();
  const navigate = useNavigate();

  // Redirect if already logged in
  useEffect(() => {
    if (initialized && user) {
      // Check if user needs to create character
      if (user.character.name === 'Hunter' && user.character.level === 1 && user.character.totalXP === 0) {
        navigate('/character', { replace: true });
      } else {
        navigate('/dashboard', { replace: true });
      }
    }
  }, [user, initialized, navigate]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    try {
      await signIn(email, password);
      
      // Get updated user state after sign in
      const updatedUser = useAuthStore.getState().user;
      
      toast.success('Welcome back, Hunter!');
      
      // Wait a moment for state to update, then navigate
      setTimeout(() => {
        if (updatedUser) {
          // Check if user needs to create character
          if (updatedUser.character.name === 'Hunter' && updatedUser.character.level === 1 && updatedUser.character.totalXP === 0) {
            navigate('/character', { replace: true });
          } else {
            navigate('/dashboard', { replace: true });
          }
        } else {
          navigate('/dashboard', { replace: true });
        }
      }, 100);
    } catch (error: any) {
      if (error.message === 'EMAIL_NOT_CONFIRMED') {
        toast.error(
          'Email not confirmed. Please check your email and click the confirmation link to activate your account.',
          { duration: 8000 }
        );
      } else {
        toast.error(error.message || 'Failed to sign in');
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="zen-card p-8 w-full max-w-md relative overflow-hidden"
      >
        {/* Decorative elements */}
        <div className="absolute top-0 left-0 w-20 h-20 border-t-2 border-l-2 border-zen-cyan/50" />
        <div className="absolute bottom-0 right-0 w-20 h-20 border-b-2 border-r-2 border-zen-cyan/50" />
        
        <div className="relative z-10">
          <div className="text-center mb-8">
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 3, repeat: Infinity }}
              className="inline-flex items-center gap-3 mb-4"
            >
              <Sword className="w-8 h-8 text-zen-cyan" />
              <h1 className="zen-title text-3xl">ZEN HABIT TRACKER</h1>
              <Shield className="w-8 h-8 text-zen-cyan" />
            </motion.div>
            <p className="text-gray-400 font-gaming uppercase tracking-wider">
              Level Up Your Life
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-zen-cyan font-gaming text-sm uppercase mb-2">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="zen-input"
                placeholder="hunter@example.com"
                required
              />
            </div>

            <div>
              <label className="block text-zen-cyan font-gaming text-sm uppercase mb-2">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="zen-input"
                placeholder="••••••••"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="zen-button w-full disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Loading...' : 'Enter the Gates'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-gray-400 text-sm">
              New Hunter?{' '}
              <Link
                to="/signup"
                className="text-zen-cyan hover:text-zen-cyan-light font-semibold transition-colors"
              >
                Create Account
              </Link>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

