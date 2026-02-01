'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Icon from '@/components/ui/AppIcon';

interface LoginFormProps {
  onSuccess?: () => void;
}

interface FormData {
  email: string;
  password: string;
  rememberMe: boolean;
}

interface FormErrors {
  email?: string;
  password?: string;
  general?: string;
}

const LoginForm = ({ onSuccess }: LoginFormProps) => {
  const router = useRouter();
  const [isHydrated, setIsHydrated] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    email: '',
    password: '',
    rememberMe: false,
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  const mockCredentials = {
    admin: { email: 'admin@nextgentask.com', password: 'Admin@2026', role: 'Admin' },
    bibhuti: { email: 'bibhuti@nextgentask.com', password: 'Bibhuti@2026', role: 'Admin' },
    manager: { email: 'manager@nextgentask.com', password: 'Manager@2026', role: 'Manager' },
    associate: { email: 'associate@nextgentask.com', password: 'Associate@2026', role: 'Associate' },
  };

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleInputChange = (field: keyof FormData, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    
    if (field === 'email' && typeof value === 'string') {
      if (value && !validateEmail(value)) {
        setErrors((prev) => ({ ...prev, email: 'Please enter a valid email address' }));
      } else {
        setErrors((prev) => ({ ...prev, email: undefined }));
      }
    }
    
    if (errors.general) {
      setErrors((prev) => ({ ...prev, general: undefined }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const newErrors: FormErrors = {};
    
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!validateEmail(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    
    if (!formData.password) {
      newErrors.password = 'Password is required';
    }
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    
    setIsLoading(true);
    
    await new Promise((resolve) => setTimeout(resolve, 1000));
    
    const validCredential = Object.values(mockCredentials).find(
      (cred) => cred.email === formData.email && cred.password === formData.password
    );
    
    if (validCredential) {
      // Always store role and user name for current session (needed for navigation)
      if (isHydrated) {
        localStorage.setItem('userRole', validCredential.role);
        
        // Extract user name from email (part before @)
        const userName = formData.email.split('@')[0];
        // Capitalize first letter
        const formattedName = userName.charAt(0).toUpperCase() + userName.slice(1);
        localStorage.setItem('userName', formattedName);
        
        // Only store email if remember me is checked
        if (formData.rememberMe) {
          localStorage.setItem('userEmail', formData.email);
        }
      }
      
      onSuccess?.();
      router.push('/dashboard');
    } else {
      setErrors({
        general: 'Invalid credentials. Please use: admin@nextgentask.com / Admin@2026, manager@nextgentask.com / Manager@2026, or associate@nextgentask.com / Associate@2026',
      });
    }
    
    setIsLoading(false);
  };

  if (!isHydrated) {
    return (
      <div className="w-full max-w-md mx-auto">
        <div className="bg-card rounded-lg shadow-elevation-3 p-8 border border-border">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-muted rounded w-3/4"></div>
            <div className="space-y-4">
              <div className="h-12 bg-muted rounded"></div>
              <div className="h-12 bg-muted rounded"></div>
              <div className="h-12 bg-muted rounded"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-sm mx-auto">
      <div className="bg-card rounded-2xl shadow-2xl p-8 border border-border relative overflow-hidden">
        {/* Decorative gradient background */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-primary/5 to-accent/5 rounded-full blur-3xl -z-10"></div>
        
        <div className="mb-6 text-center relative">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-primary to-accent rounded-2xl mb-4 shadow-lg">
            <Icon name="LockClosedIcon" size={28} variant="solid" className="text-primary-foreground" />
          </div>
          <h1 className="text-2xl font-heading font-bold text-foreground mb-2">Welcome Back</h1>
          <p className="text-sm text-muted-foreground font-caption">Sign in to access your workspace</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {errors.general && (
            <div className="bg-error/10 border border-error rounded-md p-4 flex items-start gap-3">
              <Icon name="ExclamationTriangleIcon" size={20} variant="solid" className="text-error flex-shrink-0 mt-0.5" />
              <p className="text-sm text-error font-caption">{errors.general}</p>
            </div>
          )}

          <div>
            <label htmlFor="email" className="block text-sm font-caption font-medium text-foreground mb-2">
              Email Address
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Icon name="EnvelopeIcon" size={20} variant="outline" className="text-muted-foreground" />
              </div>
              <input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                className={`w-full pl-10 pr-4 py-3 bg-background border rounded-md font-caption text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring transition-smooth ${
                  errors.email ? 'border-error' : 'border-border'
                }`}
                placeholder="you@example.com"
                disabled={isLoading}
              />
            </div>
            {errors.email && (
              <p className="mt-1 text-xs text-error font-caption">{errors.email}</p>
            )}
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-caption font-medium text-foreground mb-2">
              Password
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Icon name="KeyIcon" size={20} variant="outline" className="text-muted-foreground" />
              </div>
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                value={formData.password}
                onChange={(e) => handleInputChange('password', e.target.value)}
                className={`w-full pl-10 pr-12 py-3 bg-background border rounded-md font-caption text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring transition-smooth ${
                  errors.password ? 'border-error' : 'border-border'
                }`}
                placeholder="Enter your password"
                disabled={isLoading}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
                disabled={isLoading}
              >
                <Icon
                  name={showPassword ? 'EyeSlashIcon' : 'EyeIcon'}
                  size={20}
                  variant="outline"
                  className="text-muted-foreground hover:text-foreground transition-smooth"
                />
              </button>
            </div>
            {errors.password && (
              <p className="mt-1 text-xs text-error font-caption">{errors.password}</p>
            )}
          </div>

          <div className="flex items-center justify-between">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.rememberMe}
                onChange={(e) => handleInputChange('rememberMe', e.target.checked)}
                className="w-4 h-4 rounded border-border text-primary focus:ring-2 focus:ring-ring transition-smooth"
                disabled={isLoading}
              />
              <span className="text-sm font-caption text-foreground">Remember me</span>
            </label>
            <button
              type="button"
              className="text-sm font-caption text-primary hover:text-primary/80 transition-smooth"
              disabled={isLoading}
            >
              Forgot Password?
            </button>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-gradient-to-r from-primary to-accent text-primary-foreground py-3 rounded-xl font-caption font-semibold text-base hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-ring transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 transform hover:scale-[1.02]"
          >
            {isLoading ? (
              <>
                <Icon name="ArrowPathIcon" size={20} variant="outline" className="animate-spin" />
                <span>Signing In...</span>
              </>
            ) : (
              <>
                <Icon name="ArrowRightIcon" size={20} variant="outline" />
                <span>Sign In</span>
              </>
            )}
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-sm font-caption text-muted-foreground">
            Don't have an account?{' '}
            <button className="text-primary hover:text-primary/80 font-semibold transition-smooth">
              Sign Up
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;