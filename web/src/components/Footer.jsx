import React from 'react';
import { Link } from 'react-router-dom';
import { Shield, Mail, Github, Twitter } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-gray-50 border-t border-gray-200 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <div className="flex items-center gap-2 font-bold text-lg text-blue-700 mb-4">
              <Shield className="w-5 h-5" />
              <span>Phát hiện tin giả</span>
            </div>
            <p className="text-sm text-gray-600 leading-relaxed max-w-prose">
              Công cụ hỗ trợ phát hiện và xác minh thông tin, giúp bạn bảo vệ mình khỏi tin giả và thông tin sai lệch.
            </p>
          </div>
          
          <div>
            <h3 className="font-semibold text-gray-900 mb-4">Liên kết nhanh</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-sm text-gray-600 hover:text-blue-700 transition-colors duration-200">
                  Trang chủ
                </Link>
              </li>
              <li>
                <Link to="/checker" className="text-sm text-gray-600 hover:text-blue-700 transition-colors duration-200">
                  Kiểm tra tin tức
                </Link>
              </li>
              <li>
                <Link to="/education" className="text-sm text-gray-600 hover:text-blue-700 transition-colors duration-200">
                  Giáo dục
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-semibold text-gray-900 mb-4">Liên hệ</h3>
            <div className="flex gap-4">
              <a href="mailto:contact@example.com" className="text-gray-600 hover:text-blue-700 transition-colors duration-200">
                <Mail className="w-5 h-5" />
              </a>
              <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-blue-700 transition-colors duration-200">
                <Github className="w-5 h-5" />
              </a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-blue-700 transition-colors duration-200">
                <Twitter className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>
        
        <div className="border-t border-gray-200 mt-8 pt-8 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-sm text-gray-600">
            © 2026 Phát hiện tin giả. Bảo lưu mọi quyền.
          </p>
          <div className="flex gap-6">
            <span className="text-sm text-gray-600">Chính sách bảo mật</span>
            <span className="text-sm text-gray-600">Điều khoản sử dụng</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;