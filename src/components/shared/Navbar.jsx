import { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { FiUser, FiLogOut, FiChevronDown, FiGrid, FiHome } from 'react-icons/fi';

export default function Navbar({ language }) {
  const { user, logout } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef(null);

  const content = {
    en: {
      welcome: 'Welcome',
      profile: 'Profile',
      logout: 'Logout',
      dashboard: 'Dashboard',
      properties: 'Properties',
      login: 'Login',
      register: 'Register'
    },
    ar: {
      welcome: 'مرحباً',
      profile: 'الملف الشخصي',
      logout: 'تسجيل الخروج',
      dashboard: 'لوحة التحكم',
      properties: 'العقارات',
      login: 'تسجيل الدخول',
      register: 'تسجيل'
    }
  };

  const t = content[language];

  useEffect(() => {
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsMenuOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = async () => {
    try {
      setIsMenuOpen(false);
      await logout();
      window.location.href = '/';
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const getMainLink = () => {
    if (!user) return '/';
    return user.type === 'owner' ? '/owner/properties' : '/properties/available';
  };

  return (
    <nav className="bg-white shadow-sm relative z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-12">
          {/* Left side - Logo and main navigation */}
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0 flex items-center">
              <span className="text-base font-bold text-primary">Logo</span>
            </Link>

            {user && (
              <Link
                to={getMainLink()}
                className="ml-4 text-gray-600 hover:text-primary flex items-center gap-2"
              >
                <FiHome size={16} />
                <span className="text-sm">{t.properties}</span>
              </Link>
            )}
          </div>

          {/* Right side - User menu or auth links */}
          <div className="flex items-center">
            {user ? (
              <div className="relative" ref={menuRef}>
                <button
                  onClick={() => setIsMenuOpen(!isMenuOpen)}
                  className="flex items-center gap-2 px-2 py-1.5 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div className="w-7 h-7 rounded-full bg-gray-100 flex items-center justify-center">
                    <FiUser className="text-gray-600 text-sm" />
                  </div>
                  <div className="flex items-center gap-1">
                    <span className={`hidden sm:inline text-sm ${language === 'ar' ? 'font-arabic' : ''}`}>
                      {user.full_name}
                    </span>
                    <FiChevronDown size={16} 
                      className={`transition-transform duration-200 ${
                        isMenuOpen ? 'rotate-180' : ''
                      }`}
                    />
                  </div>
                </button>

                {isMenuOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg py-2 border border-gray-100">
                    <div className="px-4 py-2 border-b border-gray-100">
                      <p className="text-sm text-gray-500">{t.welcome}</p>
                      <p className="text-sm font-medium truncate">{user.full_name}</p>
                    </div>

                    <div className="py-1">
                      <Link
                        to={`/${user.type}/profile`}
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        <FiUser className="text-gray-500" />
                        <span>{t.profile}</span>
                      </Link>

                      <Link
                        to={`/${user.type}/dashboard`}
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        <FiGrid className="text-gray-500" />
                        <span>{t.dashboard}</span>
                      </Link>
                    </div>

                    <div className="border-t border-gray-100 pt-1">
                      <button
                        onClick={handleLogout}
                        className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-50 flex items-center gap-2"
                      >
                        <FiLogOut className="text-red-500" />
                        <span>{t.logout}</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Link
                  to="/login/renter"
                  className="text-gray-600 hover:text-primary px-2 py-1.5 rounded-md text-sm font-medium"
                >
                  {t.login}
                </Link>
                <Link
                  to="/register/renter"
                  className="bg-primary text-white px-3 py-1.5 rounded-md text-sm font-medium hover:bg-primary-hover transition-colors"
                >
                  {t.register}
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
} 