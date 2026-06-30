import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useMutation } from '@tanstack/react-query';
import { apiClient } from '../../api/client';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Loader2, ArrowRight } from 'lucide-react';
import { cn } from '../../lib/utils';
import { useState } from 'react';

const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  confirmPassword: z.string()
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type RegisterForm = z.infer<typeof registerSchema>;

export const Register = () => {
  const navigate = useNavigate();
  const [successMsg, setSuccessMsg] = useState('');

  const { register, handleSubmit, formState: { errors } } = useForm<RegisterForm>({
    resolver: zodResolver(registerSchema),
  });

  const registerMutation = useMutation({
    mutationFn: async (data: RegisterForm) => {
      try {
        const { data: resData } = await apiClient.post('/auth/register', {
          name: data.name,
          email: data.email,
          password: data.password
        });
        return resData;
      } catch (error: any) {
        throw new Error(error.response?.data?.error || 'Registration failed');
      }
    },
    onSuccess: () => {
      setSuccessMsg('Account created successfully! Redirecting to login...');
      setTimeout(() => navigate('/login'), 2500);
    },
  });

  const onSubmit = (data: RegisterForm) => {
    registerMutation.mutate(data);
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
            Join thousands of users organizing their work with clarity and speed.
          </p>
        </motion.div>
      </div>

      {/* Right split: Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center px-4 sm:px-6 lg:px-8 py-12">
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="w-full max-w-md space-y-8 bg-[var(--bg-surface)] p-8 sm:p-10 rounded-3xl shadow-[var(--shadow)] border border-[var(--border-default)]"
        >
          <div>
            <h2 className="text-3xl font-bold text-[var(--text-primary)] tracking-tight">Create an account</h2>
            <p className="mt-2 text-sm text-[var(--text-secondary)]">Start managing your tasks today</p>
          </div>
          
          {successMsg ? (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-4 rounded-xl bg-green-50 border border-green-200">
              <p className="text-sm text-green-700 font-medium text-center">{successMsg}</p>
            </motion.div>
          ) : (
            <form className="mt-8 space-y-5" onSubmit={handleSubmit(onSubmit)}>
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-[var(--text-primary)] mb-1">Full Name</label>
                <input
                  id="name"
                  type="text"
                  autoComplete="name"
                  className={cn(
                    "appearance-none relative block w-full px-4 py-3 border border-[var(--border-default)] bg-[var(--bg-subtle)] rounded-xl focus:outline-none focus:ring-2 focus:ring-[var(--border-focus)] focus:border-transparent transition-all sm:text-sm text-[var(--text-primary)]",
                    errors.name && "border-red-500 focus:ring-red-500"
                  )}
                  placeholder="John Doe"
                  {...register('name')}
                />
                {errors.name && <p className="mt-1.5 text-xs text-red-500 font-medium">{errors.name.message}</p>}
              </div>

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
                <label htmlFor="password" className="block text-sm font-medium text-[var(--text-primary)] mb-1">Password</label>
                <input
                  id="password"
                  type="password"
                  autoComplete="new-password"
                  className={cn(
                    "appearance-none relative block w-full px-4 py-3 border border-[var(--border-default)] bg-[var(--bg-subtle)] rounded-xl focus:outline-none focus:ring-2 focus:ring-[var(--border-focus)] focus:border-transparent transition-all sm:text-sm text-[var(--text-primary)]",
                    errors.password && "border-red-500 focus:ring-red-500"
                  )}
                  placeholder="••••••••"
                  {...register('password')}
                />
                {errors.password && <p className="mt-1.5 text-xs text-red-500 font-medium">{errors.password.message}</p>}
              </div>

              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-[var(--text-primary)] mb-1">Confirm Password</label>
                <input
                  id="confirmPassword"
                  type="password"
                  autoComplete="new-password"
                  className={cn(
                    "appearance-none relative block w-full px-4 py-3 border border-[var(--border-default)] bg-[var(--bg-subtle)] rounded-xl focus:outline-none focus:ring-2 focus:ring-[var(--border-focus)] focus:border-transparent transition-all sm:text-sm text-[var(--text-primary)]",
                    errors.confirmPassword && "border-red-500 focus:ring-red-500"
                  )}
                  placeholder="••••••••"
                  {...register('confirmPassword')}
                />
                {errors.confirmPassword && <p className="mt-1.5 text-xs text-red-500 font-medium">{errors.confirmPassword.message}</p>}
              </div>

              {registerMutation.isError && (
                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="p-3 rounded-lg bg-red-50 border border-red-200">
                  <p className="text-sm text-red-600 font-medium text-center">{registerMutation.error.message}</p>
                </motion.div>
              )}

              <div className="pt-2">
                <motion.button
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                  type="submit"
                  disabled={registerMutation.isPending}
                  className="group relative flex w-full justify-center items-center gap-2 rounded-xl border border-transparent bg-gradient-to-r from-[#5961F9] via-[#A855F7] to-[#F97316] text-white hover:opacity-90 py-3 px-4 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 disabled:opacity-70 transition-all"
                >
                  {registerMutation.isPending ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <>Create account <ArrowRight className="h-4 w-4 opacity-70 group-hover:opacity-100 group-hover:translate-x-1 transition-all" /></>
                  )}
                </motion.button>
              </div>
              
              <div className="text-center mt-6">
                <p className="text-sm text-[var(--text-secondary)]">
                  Already have an account?{' '}
                  <Link to="/login" className="font-semibold text-primary-600 hover:text-primary-500 transition-colors">
                    Sign in
                  </Link>
                </p>
              </div>
            </form>
          )}
        </motion.div>
      </div>
    </div>
  );
};
