import React, { useState, FormEventHandler } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { UserPlus, Mail, Lock, AlertCircle, Loader2, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { RegisterCredentials } from '@/types';
import PageTransitionWrapper from '@/Components/PageTransitionWrapper';
import SuccessAnimation from '@/Components/SuccessAnimation';

const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i = 1) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.6, ease: 'easeOut' },
  }),
};

const Register: React.FC = () => {
  const { register, isLoading, isAuthenticated } = useAuth();
  const [data, setData] = useState<RegisterCredentials>({
    name: '',
    email: '',
    password: '',
    password_confirmation: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showSuccess, setShowSuccess] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Redirect jika sudah login
  React.useEffect(() => {
    if (isAuthenticated) {
      router.visit('/dashboard', { replace: true });
    }
  }, [isAuthenticated]);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    // Validasi nama
    if (!data.name.trim()) {
      newErrors.name = 'Name is required';
    } else if (data.name.trim().length < 2) {
      newErrors.name = 'Name must be at least 2 characters';
    }

    // Validasi email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!data.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!emailRegex.test(data.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    // Validasi password
    if (!data.password) {
      newErrors.password = 'Password is required';
    } else if (data.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    }

    // Validasi konfirmasi password
    if (!data.password_confirmation) {
      newErrors.password_confirmation = 'Password confirmation is required';
    } else if (data.password !== data.password_confirmation) {
      newErrors.password_confirmation = 'Passwords do not match';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field: keyof RegisterCredentials, value: string) => {
    setData(prev => ({ ...prev, [field]: value }));
    
    // Clear error untuk field yang sedang diubah
    if (errors[field]) {
      setErrors(prev => {
        const updated = { ...prev };
        delete updated[field];
        return updated;
      });
    }

    // Real-time validation untuk password confirmation
    if (field === 'password_confirmation' || field === 'password') {
      if (field === 'password_confirmation' && data.password && value !== data.password) {
        setErrors(prev => ({ ...prev, password_confirmation: 'Passwords do not match' }));
      } else if (field === 'password' && data.password_confirmation && value !== data.password_confirmation) {
        setErrors(prev => ({ ...prev, password_confirmation: 'Passwords do not match' }));
      }
    }
  };

  const submit: FormEventHandler = async (e) => {
    e.preventDefault();
    
    // Clear previous errors
    setErrors({});

    // Validate form
    if (!validateForm()) {
      return;
    }

    try {
      const response = await register(data);
      
      if (response.success) {
        setShowSuccess(true);
        
        // Show success animation for a moment, then redirect
        setTimeout(() => {
          router.visit('/dashboard', { replace: true });
        }, 2000);
      }
    } catch (error: any) {
      console.error('Registration error:', error);
      
      // Handle validation errors from server
      if (error.errors) {
        setErrors(error.errors);
      } else if (error.message) {
        setErrors({ general: error.message });
      } else {
        setErrors({ general: 'Registration failed. Please try again.' });
      }
    }
  };

  const togglePasswordVisibility = (field: 'password' | 'confirm') => {
    if (field === 'password') {
      setShowPassword(!showPassword);
    } else {
      setShowConfirmPassword(!showConfirmPassword);
    }
  };

  return (
    <>
      <Head title="Register" />
      <PageTransitionWrapper>
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 to-blue-50 py-12 px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={{
              hidden: {},
              visible: {},
            }}
            className="max-w-md w-full space-y-8"
          >
            <motion.div variants={fadeInUp} custom={0}>
              <div className="text-center">
                <div className="flex justify-center">
                  <div className="w-16 h-16 bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
                    <UserPlus className="w-8 h-8 text-white" />
                  </div>
                </div>
                <h2 className="mt-6 text-3xl font-bold text-gray-900">Create an account</h2>
                <p className="mt-2 text-sm text-gray-600">Start your journey with us today</p>
              </div>
            </motion.div>

            {showSuccess && <SuccessAnimation />}

            <motion.div
              variants={fadeInUp}
              custom={1}
              className="bg-white py-8 px-6 shadow-xl rounded-2xl border border-gray-100"
            >
              {errors.general && (
                <motion.div
                  className="flex items-center space-x-2 p-3 bg-red-50 border border-red-200 rounded-lg mb-6"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
                  <p className="text-sm text-red-700">{errors.general}</p>
                </motion.div>
              )}

              <form className="space-y-6" onSubmit={submit} noValidate>
                {/* Name Field */}
                <motion.div variants={fadeInUp} custom={2}>
                  <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="name">
                    Full Name
                  </label>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    autoComplete="name"
                    required
                    value={data.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    placeholder="Enter your full name"
                    className={`block w-full px-4 py-3 border rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                      errors.name ? 'border-red-300 bg-red-50' : 'border-gray-300'
                    }`}
                  />
                  {errors.name && (
                    <motion.p
                      className="text-sm text-red-600 mt-2 flex items-center gap-1"
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <AlertCircle className="w-4 h-4 flex-shrink-0" /> {errors.name}
                    </motion.p>
                  )}
                </motion.div>

                {/* Email Field */}
                <motion.div variants={fadeInUp} custom={3}>
                  <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="email">
                    Email Address
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Mail className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      autoComplete="email"
                      required
                      value={data.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      placeholder="you@example.com"
                      className={`block w-full pl-10 pr-4 py-3 border rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                        errors.email ? 'border-red-300 bg-red-50' : 'border-gray-300'
                      }`}
                    />
                  </div>
                  {errors.email && (
                    <motion.p
                      className="text-sm text-red-600 mt-2 flex items-center gap-1"
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <AlertCircle className="w-4 h-4 flex-shrink-0" /> {errors.email}
                    </motion.p>
                  )}
                </motion.div>

                {/* Password Field */}
                <motion.div variants={fadeInUp} custom={4}>
                  <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="password">
                    Password
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Lock className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      id="password"
                      name="password"
                      type={showPassword ? 'text' : 'password'}
                      autoComplete="new-password"
                      required
                      value={data.password}
                      onChange={(e) => handleInputChange('password', e.target.value)}
                      placeholder="Enter password (min. 8 characters)"
                      className={`block w-full pl-10 pr-12 py-3 border rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                        errors.password ? 'border-red-300 bg-red-50' : 'border-gray-300'
                      }`}
                    />
                    <button
                      type="button"
                      className="absolute inset-y-0 right-0 pr-3 flex items-center"
                      onClick={() => togglePasswordVisibility('password')}
                    >
                      {showPassword ? (
                        <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                      ) : (
                        <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                      )}
                    </button>
                  </div>
                  {errors.password && (
                    <motion.p
                      className="text-sm text-red-600 mt-2 flex items-center gap-1"
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <AlertCircle className="w-4 h-4 flex-shrink-0" /> {errors.password}
                    </motion.p>
                  )}
                </motion.div>

                {/* Password Confirmation Field */}
                <motion.div variants={fadeInUp} custom={5}>
                  <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="password_confirmation">
                    Confirm Password
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Lock className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      id="password_confirmation"
                      name="password_confirmation"
                      type={showConfirmPassword ? 'text' : 'password'}
                      autoComplete="new-password"
                      required
                      value={data.password_confirmation}
                      onChange={(e) => handleInputChange('password_confirmation', e.target.value)}
                      placeholder="Re-enter your password"
                      className={`block w-full pl-10 pr-12 py-3 border rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                        errors.password_confirmation ? 'border-red-300 bg-red-50' : 'border-gray-300'
                      }`}
                    />
                    <button
                      type="button"
                      className="absolute inset-y-0 right-0 pr-3 flex items-center"
                      onClick={() => togglePasswordVisibility('confirm')}
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                      ) : (
                        <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                      )}
                    </button>
                  </div>
                  {errors.password_confirmation && (
                    <motion.p
                      className="text-sm text-red-600 mt-2 flex items-center gap-1"
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <AlertCircle className="w-4 h-4 flex-shrink-0" /> {errors.password_confirmation}
                    </motion.p>
                  )}
                </motion.div>

                {/* Submit Button */}
                <motion.div variants={fadeInUp} custom={6}>
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full flex justify-center items-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg transition-all transform hover:scale-[1.02] active:scale-[0.98]"
                  >
                    {isLoading && <Loader2 className="w-5 h-5 mr-2 animate-spin" />}
                    {isLoading ? 'Creating account...' : 'Create Account'}
                  </button>
                </motion.div>
              </form>

              <motion.div
                variants={fadeInUp}
                custom={7}
                className="mt-6 text-center text-sm text-gray-600"
              >
                Already have an account?{' '}
                <Link 
                  href="/login" 
                  className="font-medium text-blue-600 hover:text-blue-500 transition-colors"
                >
                  Sign in
                </Link>
              </motion.div>
            </motion.div>

            <motion.div
              variants={fadeInUp}
              custom={8}
              className="text-center text-xs text-gray-500"
            >
              By creating an account, you agree to our{' '}
              <Link href="/terms" className="text-blue-600 hover:text-blue-500">
                Terms of Service
              </Link>{' '}
              and{' '}
              <Link href="/privacy" className="text-blue-600 hover:text-blue-500">
                Privacy Policy
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </PageTransitionWrapper>
    </>
  );
};

export default Register;