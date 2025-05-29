import React, { useState, FormEventHandler } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import { Eye, EyeOff, Mail, Lock, AlertCircle, Loader2 } from 'lucide-react';
import PageTransitionWrapper from '@/Components/PageTransitionWrapper';
import SuccessAnimation from '@/Components/SuccessAnimation';

interface LoginProps {
  status?: string;
  canResetPassword?: boolean;
}

interface LoginData {
  email: string;
  password: string;
  remember: boolean;
}

const Login: React.FC<LoginProps> = ({ status, canResetPassword }) => {
  const [showPassword, setShowPassword] = useState(false);
  
  const { data, setData, post, processing, errors, reset } = useForm<LoginData>({
    email: '',
    password: '',
    remember: false,
  });
  const [showSuccess, setShowSuccess] = useState(false);

  const submit: FormEventHandler = (e) => {
    e.preventDefault();

    post(route('login'), {
      onFinish: () => reset('password'),
    });
  };

  return (
    <>
      <Head title="Log in" />
      <PageTransitionWrapper>
        {showSuccess && <SuccessAnimation />}
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          {/* Header */}
          <div className="text-center">
            <div className="flex justify-center">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                <Lock className="w-8 h-8 text-white" />
              </div>
            </div>
            <h2 className="mt-6 text-3xl font-bold text-gray-900">
              Welcome back
            </h2>
            <p className="mt-2 text-sm text-gray-600">
              Sign in to your account to continue
            </p>
          </div>

          {/* Login Form */}
          <div className="bg-white py-8 px-6 shadow-xl rounded-2xl border border-gray-100">
            {/* Status Message */}
            {status && (
              <div className="flex items-center space-x-2 p-3 bg-green-50 border border-green-200 rounded-lg mb-6">
                <div className="w-5 h-5 rounded-full bg-green-500 flex items-center justify-center">
                  <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
                <p className="text-sm text-green-700">{status}</p>
              </div>
            )}

            <div className="space-y-6" onSubmit={submit}>
              {/* Email Field */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  Email address
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
                    onChange={(e) => setData('email', e.target.value)}
                    className={`block w-full pl-10 pr-3 py-3 border rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                      errors.email ? 'border-red-300' : 'border-gray-300'
                    }`}
                    placeholder="Enter your email"
                  />
                </div>
                {errors.email && (
                  <div className="flex items-center space-x-2 mt-2">
                    <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0" />
                    <p className="text-sm text-red-600">{errors.email}</p>
                  </div>
                )}
              </div>

              {/* Password Field */}
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
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
                    autoComplete="current-password"
                    required
                    value={data.password}
                    onChange={(e) => setData('password', e.target.value)}
                    className={`block w-full pl-10 pr-12 py-3 border rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                      errors.password ? 'border-red-300' : 'border-gray-300'
                    }`}
                    placeholder="Enter your password"
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                    ) : (
                      <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                    )}
                  </button>
                </div>
                {errors.password && (
                  <div className="flex items-center space-x-2 mt-2">
                    <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0" />
                    <p className="text-sm text-red-600">{errors.password}</p>
                  </div>
                )}
              </div>

              {/* Remember Me & Forgot Password */}
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <input
                    id="remember"
                    name="remember"
                    type="checkbox"
                    checked={data.remember}
                    onChange={(e) => setData('remember', e.target.checked)}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label htmlFor="remember" className="ml-2 block text-sm text-gray-700">
                    Remember me
                  </label>
                </div>

                {canResetPassword && (
                  <div className="text-sm">
                    <Link
                      href={route('password.request')}
                      className="font-medium text-blue-600 hover:text-blue-500 transition-colors"
                    >
                      Forgot password?
                    </Link>
                  </div>
                )}
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={processing}
                onClick={submit}
                className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-xl"
              >
                {processing && (
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                )}
                {processing ? 'Signing in...' : 'Sign in'}
              </button>
            </div>

            {/* Register Link */}
            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">
                Don't have an account?{' '}
                <Link
                  href={route('register')}
                  className="font-medium text-blue-600 hover:text-blue-500 transition-colors"
                >
                  Sign up here
                </Link>
              </p>
            </div>
          </div>

          {/* Footer */}
          <div className="text-center text-xs text-gray-500">
            <p>
              Protected by industry-standard security protocols
            </p>
          </div>
        </div>
      </div>
      </PageTransitionWrapper>
    </>
  );
};

export default Login;