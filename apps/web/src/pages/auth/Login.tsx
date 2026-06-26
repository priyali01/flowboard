import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useMutation } from '@tanstack/react-query';
import { useAuthStore } from '../../stores/authStore';
import { apiClient } from '../../api/client';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Loader2, ArrowRight } from 'lucide-react';
import { cn } from '../../lib/utils';

const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

type LoginForm = z.infer<typeof loginSchema>;

export const Login = () => {
  const setAuth = useAuthStore((state) => state.setAuth);
  const navigate = useNavigate();

  const { register, handleSubmit, formState: { errors } } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
  });

  const loginMutation = useMutation({
    mutationFn: async (data: LoginForm) => {
      try {
        const { data: resData } = await apiClient.post('/auth/login', data);
        return resData;
      } catch (error: any) {
        throw new Error(error.response?.data?.error || 'Login failed');
      }
    },
    onSuccess: (data) => {
      setAuth(data.user, data.accessToken);
      navigate('/');
    },
  });

  const onSubmit = (data: LoginForm) => {
    loginMutation.mutate(data);
  };

  return (
    <div className="min-h-screen flex w-full bg-[var(--bg-app)]">
      {/* Left split: Brand & Graphic */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-gradient-to-br from-primary-600 to-primary-900 overflow-hidden items-center justify-center">
        <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] mix-blend-overlay" />
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="relative z-10 text-center px-12"
        >
          <h1 className="text-5xl font-bold text-white mb-6 tracking-tight">FlowBoard</h1>
          <p className="text-primary-100 text-lg max-w-md mx-auto leading-relaxed">
            Calm productivity for individuals and teams. The smart way to organize your tasks.
          </p>
        </motion.div>
      </div>

      {/* Right split: Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center px-4 sm:px-6 lg:px-8">
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="w-full max-w-md space-y-8 bg-[var(--bg-surface)] p-8 sm:p-10 rounded-3xl shadow-[var(--shadow)] border border-[var(--border-default)]"
        >
          <div>
            <h2 className="text-3xl font-bold text-[var(--text-primary)] tracking-tight">Welcome back 👋</h2>
            <p className="mt-2 text-sm text-[var(--text-secondary)]">Sign in to your account</p>
          </div>
          
          <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
            <div className="space-y-4">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-[var(--text-primary)] mb-1">Email</label>
                <input
                  id="email"
                  type="email"
                  autoComplete="email"
                  className={cn(
                    "appearance-none relative block w-full px-4 py-3 border border-[var(--border-default)] bg-[var(--bg-subtle)] rounded-xl focus:outline-none focus:ring-2 focus:ring-[var(--border-focus)] focus:border-transparent transition-all sm:text-sm text-[var(--text-primary)]",
                    errors.email && "border-red-500 focus:ring-red-500"
                  )}
                  placeholder="you@example.com"
                  {...register('email')}
                />
                {errors.email && <p className="mt-1.5 text-xs text-red-500 font-medium">{errors.email.message}</p>}
              </div>
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label htmlFor="password" className="block text-sm font-medium text-[var(--text-primary)]">Password</label>
                  <Link to="/forgot-password" className="text-sm font-medium text-primary-600 hover:text-primary-500 transition-colors">Forgot?</Link>
                </div>
                <input
                  id="password"
                  type="password"
                  autoComplete="current-password"
                  className={cn(
                    "appearance-none relative block w-full px-4 py-3 border border-[var(--border-default)] bg-[var(--bg-subtle)] rounded-xl focus:outline-none focus:ring-2 focus:ring-[var(--border-focus)] focus:border-transparent transition-all sm:text-sm text-[var(--text-primary)]",
                    errors.password && "border-red-500 focus:ring-red-500"
                  )}
                  placeholder="••••••••"
                  {...register('password')}
                />
                {errors.password && <p className="mt-1.5 text-xs text-red-500 font-medium">{errors.password.message}</p>}
              </div>
            </div>

            {loginMutation.isError && (
              <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="p-3 rounded-lg bg-red-50 border border-red-200">
                <p className="text-sm text-red-600 font-medium text-center">{loginMutation.error.message}</p>
              </motion.div>
            )}

            <div>
              <motion.button
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                type="submit"
                disabled={loginMutation.isPending}
                className="group relative flex w-full justify-center items-center gap-2 rounded-xl border border-transparent bg-primary-600 py-3 px-4 text-sm font-semibold text-white hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 disabled:opacity-70 transition-all"
              >
                {loginMutation.isPending ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <>Sign In <ArrowRight className="h-4 w-4 opacity-70 group-hover:opacity-100 group-hover:translate-x-1 transition-all" /></>
                )}
              </motion.button>
            </div>
            
            <div className="text-center mt-6">
              <p className="text-sm text-[var(--text-secondary)]">
                Don't have an account?{' '}
                <Link to="/register" className="font-semibold text-primary-600 hover:text-primary-500 transition-colors">
                  Sign up
                </Link>
              </p>
            </div>
          </form>
        </motion.div>
      </div>
    </div>
  );
};
