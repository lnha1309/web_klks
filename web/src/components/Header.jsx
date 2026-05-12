import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext.jsx';
import { Button } from '@/components/ui/button';
import { LogOut, User, Menu, X, Shield } from 'lucide-react';

const Header = () => {
  const location = useLocation();
  const { isAuthenticated, logout, currentUser } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isActive = (path) => location.pathname === path;

  const navLinks = [
    { to: '/', label: 'Trang chủ' },
    { to: '/checker', label: 'Kiểm tra' },
    { to: '/education', label: 'Giáo dục' },
    ...(isAuthenticated ? [{ to: '/history', label: 'Lịch sử' }] : []),
  ];

  const handleLinkClick = () => setMobileMenuOpen(false);

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">

          {/* Logo */}
          <Link
            to="/"
            className="flex items-center gap-2 font-bold text-blue-800 hover:opacity-90 transition-opacity flex-shrink-0"
          >
            <img
              src="https://horizons-cdn.hostinger.com/e52a1aa9-5e4f-4e0e-b8d5-66d7828f312f/09e147d71efe15bbf0bcd43f8df993b8.png"
              alt="HUIT Logo"
              className="h-10 md:h-12 w-auto object-contain"
            />
            <span className="hidden sm:inline-block text-sm md:text-base leading-tight">
              HỆ THỐNG XÁC THỰC THÔNG TIN
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-6 lg:gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className={`text-sm font-medium transition-colors duration-200 ${
                  isActive(link.to)
                    ? 'text-blue-800 border-b-2 border-blue-800 pb-1'
                    : 'text-gray-600 hover:text-blue-800'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Desktop Auth */}
          <div className="hidden md:flex items-center gap-3">
            {!isAuthenticated ? (
              <>
                <Link to="/login">
                  <Button variant="ghost" className="transition-colors duration-200 text-sm">
                    Đăng nhập
                  </Button>
                </Link>
                <Link to="/signup">
                  <Button className="bg-blue-800 hover:bg-blue-900 transition-colors duration-200 active:scale-[0.98] text-sm">
                    Đăng ký
                  </Button>
                </Link>
              </>
            ) : (
              <>
                <div className="flex items-center gap-2 text-sm text-gray-700">
                  <User className="w-4 h-4 flex-shrink-0" />
                  <span className="hidden lg:inline max-w-[140px] truncate">{currentUser?.fullName}</span>
                </div>
                <Button
                  onClick={logout}
                  variant="outline"
                  className="transition-colors duration-200 active:scale-[0.98] text-sm"
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Đăng xuất
                </Button>
              </>
            )}
          </div>

          {/* Mobile: hamburger */}
          <button
            className="md:hidden p-2 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Dropdown Menu */}
      <div
        className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${
          mobileMenuOpen ? 'max-h-[400px] opacity-100' : 'max-h-0 opacity-0'
        }`}
        style={{ background: 'white', borderTop: mobileMenuOpen ? '1px solid #e5e7eb' : 'none' }}
      >
        <div className="px-4 py-3 space-y-1">
          {navLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              onClick={handleLinkClick}
              className={`flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-medium transition-colors ${
                isActive(link.to)
                  ? 'bg-blue-50 text-blue-800'
                  : 'text-gray-700 hover:bg-gray-50 hover:text-blue-800'
              }`}
            >
              {link.label}
              {isActive(link.to) && (
                <span className="ml-auto w-2 h-2 rounded-full bg-blue-800" />
              )}
            </Link>
          ))}

          {/* Mobile Auth */}
          <div className="pt-3 mt-2 border-t border-gray-100 space-y-2">
            {!isAuthenticated ? (
              <>
                <Link to="/login" onClick={handleLinkClick}>
                  <button className="w-full text-left px-3 py-3 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
                    Đăng nhập
                  </button>
                </Link>
                <Link to="/signup" onClick={handleLinkClick}>
                  <button className="w-full px-3 py-3 rounded-xl text-sm font-semibold text-white bg-blue-800 hover:bg-blue-900 transition-colors text-center block">
                    Đăng ký
                  </button>
                </Link>
              </>
            ) : (
              <div className="space-y-2">
                <div className="flex items-center gap-2 px-3 py-2 text-sm text-gray-600">
                  <User className="w-4 h-4 flex-shrink-0" />
                  <span className="font-medium truncate">{currentUser?.fullName}</span>
                </div>
                <button
                  onClick={() => { logout(); handleLinkClick(); }}
                  className="w-full flex items-center gap-2 px-3 py-3 rounded-xl text-sm font-medium text-red-600 hover:bg-red-50 transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  Đăng xuất
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
