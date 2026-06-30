import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useMutation } from '@tanstack/react-query';
import { useAuthStore } from '../../stores/authStore';
import { apiClient } from '../../api/client';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Loader2, ArrowRight, Mail, Lock, CheckCircle2, Users, BarChart3, Zap, Info } from 'lucide-react';
import { cn } from '../../lib/utils';
import { Checkbox } from '../../components/ui/checkbox';

const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  remember: z.boolean().optional(),
});

type LoginForm = z.infer<typeof loginSchema>;

export const Login = () => {
  const setAuth = useAuthStore((state) => state.setAuth);
  const navigate = useNavigate();

  const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
    defaultValues: { remember: true }
  });

  const remember = watch('remember');

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
          <div className="mb-5">
            <h2 className="text-3xl font-black text-gray-900 tracking-tight flex items-center gap-2">
              Welcome back <span className="text-2xl">👋</span>
            </h2>
            <p className="mt-2 text-sm text-gray-500 font-medium">Sign in to continue to FlowBoard</p>
          </div>

          <form className="space-y-5" onSubmit={handleSubmit(onSubmit)}>
            <div>
              <label htmlFor="email" className="block text-sm font-bold text-gray-700 mb-1.5">Email</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-blue-500">
                  <Mail size={18} />
                </div>
                <input
                  id="email"
                  type="email"
                  autoComplete="email"
                  className={cn(
                    "appearance-none relative block w-full pl-10 pr-4 py-3 border border-gray-100 bg-gray-50/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all sm:text-sm text-gray-900 font-medium placeholder:font-normal placeholder:text-gray-400",
                    errors.email && "border-red-500 focus:ring-red-500/20 focus:border-red-500"
                  )}
                  placeholder="youremail@gmail.com"
                  {...register('email')}
                />
              </div>
              {errors.email && <p className="mt-1.5 text-xs text-red-500 font-medium">{errors.email.message}</p>}
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label htmlFor="password" className="block text-sm font-bold text-gray-700">Password</label>
                <Link to="/forgot-password" className="text-xs font-semibold text-blue-500 hover:text-blue-600 transition-colors">Forgot password?</Link>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-blue-500">
                  <Lock size={18} />
                </div>
                <input
                  id="password"
                  type="password"
                  autoComplete="current-password"
                  className={cn(
                    "appearance-none relative block w-full pl-10 pr-4 py-3 border border-gray-100 bg-gray-50/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all sm:text-sm text-gray-900 font-medium placeholder:font-normal placeholder:text-gray-400 tracking-widest",
                    errors.password && "border-red-500 focus:ring-red-500/20 focus:border-red-500"
                  )}
                  placeholder="••••••••"
                  {...register('password')}
                />
              </div>
              {errors.password && <p className="mt-1.5 text-xs text-red-500 font-medium">{errors.password.message}</p>}
            </div>

            <div className="flex items-center justify-between py-2">
              <div className="flex items-center gap-2">
                <Checkbox
                  id="remember"
                  checked={remember}
                  onCheckedChange={(c) => setValue('remember', c === true)}
                  className="rounded flex items-center justify-center data-[state=checked]:bg-blue-500 data-[state=checked]:text-white data-[state=checked]:border-blue-500 border-gray-300"
                />
                <label htmlFor="remember" className="text-xs font-semibold text-gray-500 cursor-pointer">
                  Remember me
                </label>
              </div>
              <div className="flex items-center gap-1 text-xs font-semibold text-gray-400">
                Keep me signed in <Info size={14} className="text-gray-400" />
              </div>
            </div>

            {loginMutation.isError && (
              <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="p-3 rounded-xl bg-red-50 border border-red-100">
                <p className="text-sm text-red-600 font-medium text-center">{loginMutation.error.message}</p>
              </motion.div>
            )}

            <div>
              <motion.button
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                type="submit"
                disabled={loginMutation.isPending}
                className="group relative flex w-full justify-center items-center gap-2 rounded-xl border border-transparent bg-gradient-to-r from-[#5961F9] via-[#A855F7] to-[#F97316] py-3.5 px-4 text-sm font-bold text-white shadow-md shadow-blue-500/20 hover:shadow-lg hover:shadow-blue-500/30 hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-70 transition-all"
              >
                {loginMutation.isPending ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <>Sign In <ArrowRight className="h-4 w-4 opacity-70 group-hover:opacity-100 group-hover:translate-x-1 transition-transform" /></>
                )}
              </motion.button>
            </div>

            <div className="relative mt-8 mb-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-100" />
              </div>
              <div className="relative flex justify-center text-xs">
                <span className="bg-white px-3 text-gray-400 font-medium">or continue with</span>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <button type="button" className="flex items-center justify-center p-2.5 border border-gray-100 bg-gray-50/50 rounded-xl hover:bg-gray-50 transition-colors">
                <svg className="h-5 w-5" viewBox="0 0 24 24">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                </svg>
              </button>
              <button type="button" className="flex items-center justify-center p-2.5 border border-gray-100 bg-gray-50/50 rounded-xl hover:bg-gray-50 transition-colors">
                <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M11.4 11.4H1V1H11.4V11.4Z" fill="#F25022" />
                  <path d="M23 11.4H12.6V1H23V11.4Z" fill="#7FBA00" />
                  <path d="M11.4 23H1V12.6H11.4V23Z" fill="#00A4EF" />
                  <path d="M23 23H12.6V12.6H23V23Z" fill="#FFB900" />
                </svg>
              </button>
              <button type="button" className="flex items-center justify-center p-2.5 border border-gray-100 bg-gray-50/50 rounded-xl hover:bg-gray-50 transition-colors">
                <svg className="h-5 w-5 text-gray-900" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                </svg>
              </button>
            </div>

            <div className="text-center mt-8">
              <p className="text-xs text-gray-500 font-medium">
                Don't have an account?{' '}
                <Link to="/register" className="font-bold text-blue-600 hover:text-blue-500 transition-colors">
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
