import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useMutation } from '@tanstack/react-query';
import { apiClient } from '../../api/client';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Loader2, ArrowRight, Zap, CheckCircle2, Users, BarChart3 } from 'lucide-react';
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
    <div className="h-screen w-screen flex bg-[#f8fafc] overflow-hidden overscroll-none touch-none">
      {/* Left split: Brand & Graphic */}
      <div
        className="hidden lg:flex lg:w-1/2 relative flex-col justify-between px-12 py-10 overflow-hidden"
        style={{
          backgroundImage: "url('/LOGIN_IMG.png')",
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat'
        }}
      >
        {/* TOP: Logo */}
        <div className="relative z-10">
          <img src="/logo.png" alt="FlowBoard" className="h-10 object-contain" />
        </div>

        {/* MIDDLE: Main Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="relative z-10 max-w-lg"
        >
          <div className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full border border-gray-200/80 bg-white/60 backdrop-blur-md text-sm font-medium text-gray-600 mb-6">
            <Zap size={14} className="text-blue-500" />
            Organize. Prioritize. Achieve.
          </div>

          <h1 className="text-[3.2rem] leading-[1.1] font-black text-gray-900 mb-5 tracking-tight">
            Your tasks.<br />
            Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 via-green-400 to-yellow-500">flow.</span>
          </h1>

          <p className="text-gray-500 text-base max-w-md leading-relaxed mb-8 font-medium">
            FlowBoard is the smart way to organize your tasks, stay focused, and get more done.
          </p>

          <div className="grid grid-cols-3 gap-4">
            <div className="bg-white/80 backdrop-blur-xl rounded-2xl p-4 shadow-sm border border-white/80 flex flex-col items-center text-center hover:-translate-y-1 transition-transform cursor-pointer">
              <div className="w-11 h-11 rounded-full bg-blue-50 flex items-center justify-center text-blue-500 mb-3 border border-blue-100">
                <CheckCircle2 size={22} />
              </div>
              <h3 className="font-bold text-gray-900 text-sm mb-1">Smart Tasks</h3>
              <p className="text-xs text-gray-500 font-medium">Organize easily</p>
            </div>
            <div className="bg-white/80 backdrop-blur-xl rounded-2xl p-4 shadow-sm border border-white/80 flex flex-col items-center text-center hover:-translate-y-1 transition-transform cursor-pointer">
              <div className="w-11 h-11 rounded-full bg-green-50 flex items-center justify-center text-green-500 mb-3 border border-green-100">
                <Users size={22} />
              </div>
              <h3 className="font-bold text-gray-900 text-sm mb-1">Team Collaboration</h3>
              <p className="text-xs text-gray-500 font-medium">Work together</p>
            </div>
            <div className="bg-white/80 backdrop-blur-xl rounded-2xl p-4 shadow-sm border border-white/80 flex flex-col items-center text-center hover:-translate-y-1 transition-transform cursor-pointer">
              <div className="w-11 h-11 rounded-full bg-orange-50 flex items-center justify-center text-orange-400 mb-3 border border-orange-100">
                <BarChart3 size={22} />
              </div>
              <h3 className="font-bold text-gray-900 text-sm mb-1">Track Progress</h3>
              <p className="text-xs text-gray-500 font-medium">Achieve more</p>
            </div>
          </div>
        </motion.div>

        {/* BOTTOM: Social Proof */}
        <div className="relative z-10">
          <div className="inline-flex flex-col bg-white/80 backdrop-blur-xl rounded-2xl p-4 pr-10 shadow-sm border border-white/80">
            <div className="flex items-center gap-3 mb-2">
              <div className="flex -space-x-2">
                <img className="w-8 h-8 rounded-full border-2 border-white" src="https://i.pravatar.cc/100?img=11" alt="User" />
                <img className="w-8 h-8 rounded-full border-2 border-white" src="https://i.pravatar.cc/100?img=5" alt="User" />
                <img className="w-8 h-8 rounded-full border-2 border-white" src="https://i.pravatar.cc/100?img=8" alt="User" />
              </div>
              <div className="text-sm font-bold text-blue-500">+12K</div>
              <div className="text-lg font-black text-orange-500">12K+</div>
            </div>
            <p className="text-xs text-gray-500 font-medium">
              Loved by productive people<br />and growing every day.
            </p>
          </div>
        </div>
      </div>

      {/* Right split: Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center px-4 sm:px-6 lg:px-8 relative z-10 bg-transparent overflow-y-auto">
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="w-full max-w-md bg-white p-7 rounded-[2rem] shadow-xl border border-gray-100/50 relative z-20 my-4"
        >
          <div>
            <h2 className="text-3xl font-bold text-gray-900 tracking-tight">Create an account</h2>
            <p className="mt-2 text-sm text-gray-500">Start managing your tasks today</p>
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
