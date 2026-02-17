import { useAuth } from '../context/AuthContext';
import { LogOut, Menu, X } from 'lucide-react';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  return (
    <nav className="bg-green-700 text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center space-x-2">
            <div className="text-2xl font-bold">CropTracker</div>
          </Link>

          {user ? (
            <>
              <div className="hidden md:flex items-center space-x-6">
                <Link to="/admin/dashboard" className="hover:text-green-100 transition">
                  Dashboard
                </Link>
                <span className="text-sm">{user.name}</span>
                <button
                  onClick={handleLogout}
                  className="flex items-center space-x-1 bg-green-600 hover:bg-green-800 px-4 py-2 rounded-lg transition"
                >
                  <LogOut size={18} />
                  <span>Logout</span>
                </button>
              </div>

              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden"
              >
                {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </>
          ) : (
            <Link
              to="/admin/login"
              className="bg-green-600 hover:bg-green-800 px-4 py-2 rounded-lg transition"
            >
              Admin Login
            </Link>
          )}
        </div>

        {mobileMenuOpen && user && (
          <div className="md:hidden pb-4 space-y-2">
            <Link to="/admin/dashboard" className="block hover:text-green-100 py-2">
              Dashboard
            </Link>
            <button
              onClick={handleLogout}
              className="w-full text-left block hover:text-green-100 py-2"
            >
              Logout
            </button>
          </div>
        )}
      </div>
    </nav>
  );
}
