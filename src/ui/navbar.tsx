import React from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/ui/button';
import { LogOut, User } from 'lucide-react';

interface NavbarProps {
  title?: string;
}

const Navbar: React.FC<NavbarProps> = ({ title = "Schach-Events" }) => {
  const { username, logout, isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return null;
  }

  const handleLogout = () => {
    logout();
    // Optionally redirect to login page
    window.location.href = '/login';
  };

  return (
    <nav className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <h1 className="text-xl font-semibold text-gray-900">{title}</h1>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2 text-gray-700">
              <User className="h-4 w-4" />
              <span className="text-sm font-medium">{username}</span>
            </div>
            
            <Button
              variant="outline"
              size="sm"
              onClick={handleLogout}
              className="flex items-center space-x-2"
            >
              <LogOut className="h-4 w-4" />
              <span>Abmelden</span>
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;