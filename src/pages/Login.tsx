import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Eye, EyeOff, User, Lock } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

// Hardcoded credentials
const VALID_CREDENTIALS = {
  username: 'admin',
  password: 'password123'
};

// Zod schema for form validation (Deutsch)
const loginSchema = z.object({
  username: z.string().min(1, 'Benutzername ist erforderlich'),
  password: z.string().min(1, 'Passwort ist erforderlich'),
});

type LoginFormData = z.infer<typeof loginSchema>;

interface LoginProps {
  onLogin?: () => void;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { isAuthenticated, login } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  // Check if user is already logged in on component mount
  useEffect(() => {
    if (isAuthenticated) {
      // User is already logged in, redirect or call onLogin
      if (onLogin) {
        onLogin();
      } else {
        navigate('/dashboard'); // Navigate to dashboard or main page
      }
    }
  }, [isAuthenticated, navigate, onLogin]);

  const onSubmit = async (data: LoginFormData) => {
    setIsLoading(true);
    setLoginError('');

    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 500));

    // Check credentials
    if (
      data.username === VALID_CREDENTIALS.username &&
      data.password === VALID_CREDENTIALS.password
    ) {
      // Use auth context to login
      login(data.username);
      
      // Clear form
      reset();
      
      // Call onLogin callback if provided
      if (onLogin) {
        onLogin();
      } else {
        // Navigate to dashboard or main page
        navigate('/dashboard');
      }
    } else {
      setLoginError('Ungültiger Benutzername oder Passwort');
    }

    setIsLoading(false);
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <Card className="shadow-lg">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold text-center">
              Melden Sie sich an
            </CardTitle>
            <CardDescription className="text-center">
              Geben Sie Ihre Zugangsdaten ein, um die Anwendung zu nutzen
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              {loginError && (
                <Alert variant="destructive">
                  <AlertDescription>{loginError}</AlertDescription>
                </Alert>
              )}
              
              <div className="space-y-2">
                <Label htmlFor="username">Benutzername</Label>
                <div className="relative">
                  <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="username"
                    type="text"
                    placeholder="Geben Sie Ihren Benutzernamen ein"
                    className="pl-10"
                    {...register('username')}
                  />
                </div>
                {errors.username && (
                  <p className="text-sm text-red-600">{errors.username.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Passwort</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Geben Sie Ihr Passwort ein"
                    className="pl-10 pr-10"
                    {...register('password')}
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-3 h-4 w-4 text-gray-400 hover:text-gray-600"
                    onClick={togglePasswordVisibility}
                  >
                    {showPassword ? <EyeOff /> : <Eye />}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-sm text-red-600">{errors.password.message}</p>
                )}
              </div>

              <Button
                type="submit"
                className="w-full"
                disabled={isLoading}
              >
                {isLoading ? 'Anmelden...' : 'Anmelden'}
              </Button>
            </form>

            <div className="mt-6 p-4 bg-gray-50 rounded-md">
              <p className="text-sm text-gray-600 text-center">
                <strong>Demo-Zugangsdaten:</strong>
              </p>
              <p className="text-xs text-gray-500 text-center mt-1">
                Benutzername: <code className="bg-white px-1 rounded">admin</code>
              </p>
              <p className="text-xs text-gray-500 text-center">
                Passwort: <code className="bg-white px-1 rounded">password123</code>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Login;

// Utility function to check if user is logged in
export const isUserLoggedIn = (): boolean => {
  return localStorage.getItem('loggedInUser') !== null;
};

// Utility function to get logged in user
export const getLoggedInUser = (): string | null => {
  return localStorage.getItem('loggedInUser');
};

// Utility function to logout user
export const logoutUser = (): void => {
  localStorage.removeItem('loggedInUser');
  localStorage.removeItem('loginTimestamp');
};

// Utility function to get login timestamp
export const getLoginTimestamp = (): string | null => {
  return localStorage.getItem('loginTimestamp');
};
