import { useState } from 'react';
import PropTypes from 'prop-types';
import { HiHome, HiUserGroup } from 'react-icons/hi';
import { BiCategory } from 'react-icons/bi';
import { FaMapMarkedAlt } from 'react-icons/fa';
import logo from '../assets/logo-nav.jpg';

function Navbar({ language, setLanguage }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navItems = {
    en: [
      { text: 'Home', icon: <HiHome className="text-xl" />, path: '/' },
      { text: 'Categories', icon: <BiCategory className="text-xl" />, path: '/categories' },
      { text: 'Map', icon: <FaMapMarkedAlt className="text-xl" />, path: '/map' },
      { text: 'Customer Service', icon: <HiUserGroup className="text-xl" />, path: '/service' },
    ],
    ar: [
      { text: 'الرئيسية', icon: <HiHome className="text-xl" />, path: '/' },
      { text: 'التصنيفات', icon: <BiCategory className="text-xl" />, path: '/categories' },
      { text: 'الخريطة', icon: <FaMapMarkedAlt className="text-xl" />, path: '/map' },
      { text: 'خدمة العملاء', icon: <HiUserGroup className="text-xl" />, path: '/service' },
    ]
  };

  const getInitials = () => {
    return language === 'en' ? 'AA' : 'أح';
  };

  return (
    <nav className="bg-white shadow-md relative">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-20">
          {/* Mobile Menu Button - adjusted positioning */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-gray-100 z-20"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              {isMenuOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>

          {/* Language Toggle - adjusted for mobile */}
          <div className="flex items-center ml-auto md:ml-0 mr-4 md:mr-0">
            <div className="flex items-center space-x-2 border rounded-lg overflow-hidden">
              <button
                onClick={() => setLanguage('en')}
                className={`px-3 py-1 ${
                  language === 'en' 
                    ? 'bg-primary text-white' 
                    : 'bg-white text-gray-700 hover:bg-gray-100'
                } transition-colors`}
              >
                EN
              </button>
              <button
                onClick={() => setLanguage('ar')}
                className={`px-3 py-1 ${
                  language === 'ar' 
                    ? 'bg-primary text-white' 
                    : 'bg-white text-gray-700 hover:bg-gray-100'
                } transition-colors`}
              >
                AR
              </button>
            </div>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navItems[language].map((item, index) => (
              <a
                key={index}
                href={item.path}
                className="flex items-center gap-2 text-gray-700 hover:text-primary transition-colors"
              >
                {item.icon}
                <span className={`${language === 'ar' ? 'font-arabic' : ''}`}>
                  {item.text}
                </span>
              </a>
            ))}
          </div>

          {/* Logo */}
          <a href="/" className="flex-shrink-0">
            <img 
              src={logo} 
              alt="Logo" 
              className="h-14 md:h-16 w-auto"
            />
          </a>
        </div>

        {/* Mobile Menu - adjusted positioning */}
        <div
          className={`${
            isMenuOpen ? 'block' : 'hidden'
          } md:hidden absolute left-0 right-0 top-full bg-white shadow-lg z-50`}
        >
          <div className="px-4 py-3 space-y-4">
            {/* Mobile Navigation Links */}
            {navItems[language].map((item, index) => (
              <a
                key={index}
                href={item.path}
                className="flex items-center gap-3 py-2 text-gray-700 hover:text-primary transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                {item.icon}
                <span className={`${language === 'ar' ? 'font-arabic' : ''}`}>
                  {item.text}
                </span>
              </a>
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
}

Navbar.propTypes = {
  language: PropTypes.oneOf(['en', 'ar']).isRequired,
  setLanguage: PropTypes.func.isRequired
};

export default Navbar;