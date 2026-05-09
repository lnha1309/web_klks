import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext.jsx';
import { Button } from '@/components/ui/button';
import { LogOut, User } from 'lucide-react';

const Header = () => {
  const location = useLocation();
  const { isAuthenticated, logout, currentUser } = useAuth();
  
  const isActive = (path) => location.pathname === path;
  
  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <Link to="/" className="flex items-center gap-3 font-bold text-xl text-blue-800 hover:opacity-90 transition-opacity">
            <img 
              src="https://horizons-cdn.hostinger.com/e52a1aa9-5e4f-4e0e-b8d5-66d7828f312f/09e147d71efe15bbf0bcd43f8df993b8.png" 
              alt="HUIT Logo" 
              className="h-12 w-auto object-contain"
            />
            <span className="hidden sm:inline-block"> HỆ THỐNG XÁC THỰC THÔNG TIN </span>
          </Link>
          
          <nav className="hidden md:flex items-center gap-8">
            <Link 
              to="/" 
              className={`text-sm font-medium transition-colors duration-200 ${
                isActive('/') 
                  ? 'text-blue-800 border-b-2 border-blue-800 pb-1' 
                  : 'text-gray-600 hover:text-blue-800'
              }`}
            >
              Trang chủ
            </Link>
            <Link 
              to="/checker" 
              className={`text-sm font-medium transition-colors duration-200 ${
                isActive('/checker') 
                  ? 'text-blue-800 border-b-2 border-blue-800 pb-1' 
                  : 'text-gray-600 hover:text-blue-800'
              }`}
            >
              Kiểm tra
            </Link>
            <Link 
              to="/education" 
              className={`text-sm font-medium transition-colors duration-200 ${
                isActive('/education') 
                  ? 'text-blue-800 border-b-2 border-blue-800 pb-1' 
                  : 'text-gray-600 hover:text-blue-800'
              }`}
            >
              Giáo dục
            </Link>
            {isAuthenticated && (
              <Link 
                to="/history" 
                className={`text-sm font-medium transition-colors duration-200 ${
                  isActive('/history') 
                    ? 'text-blue-800 border-b-2 border-blue-800 pb-1' 
                    : 'text-gray-600 hover:text-blue-800'
                }`}
              >
                Lịch sử
              </Link>
            )}
          </nav>
          
          <div className="flex items-center gap-3">
            {!isAuthenticated ? (
              <>
                <Link to="/login">
                  <Button variant="ghost" className="transition-colors duration-200">
                    Đăng nhập
                  </Button>
                </Link>
                <Link to="/signup">
                  <Button className="bg-blue-800 hover:bg-blue-900 transition-colors duration-200 active:scale-[0.98]">
                    Đăng ký
                  </Button>
                </Link>
              </>
            ) : (
              <>
                <div className="flex items-center gap-2 text-sm text-gray-700">
                  <User className="w-4 h-4" />
                  <span className="hidden sm:inline">{currentUser?.fullName}</span>
                </div>
                <Button 
                  onClick={logout} 
                  variant="outline"
                  className="transition-colors duration-200 active:scale-[0.98]"
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Đăng xuất
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
export default Header;
