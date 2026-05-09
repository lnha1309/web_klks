import React from 'react';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import FeatureCard from '@/components/FeatureCard.jsx';
import { Search, Image, BookOpen, History, Shield, Zap } from 'lucide-react';

const HomePage = () => {
  return (
    <>
      <Helmet>
        <title>Phát hiện tin giả - HUIT</title>
        <meta name="description" content="Công cụ phát hiện tin giả giúp bạn xác minh thông tin và bảo vệ mình khỏi tin tức sai lệch" />
      </Helmet>
      
      <div className="min-h-screen flex flex-col">
        {/* Hero Section */}
        <section 
          className="relative min-h-[650px] flex items-center justify-center bg-cover bg-center"
          style={{
            backgroundImage: `linear-gradient(rgba(30, 58, 138, 0.9), rgba(30, 58, 138, 0.85)), url(https://images.unsplash.com/photo-1654588830920-92085849e384)`,
          }}
        >
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
            <div className="flex justify-center mb-8">
              <div className="inline-flex items-center justify-center p-4 bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 shadow-2xl">
                <img 
                  src="https://horizons-cdn.hostinger.com/e52a1aa9-5e4f-4e0e-b8d5-66d7828f312f/09e147d71efe15bbf0bcd43f8df993b8.png" 
                  alt="HUIT Logo" 
                  className="h-16 md:h-24 w-auto object-contain drop-shadow-md"
                />
              </div>
            </div>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight" style={{letterSpacing: '-0.02em'}}>
              Phát hiện tin giả<br></br>
              Bảo vệ thông tin của bạn
            </h1>
            <p className="text-lg md:text-xl text-blue-100 mb-10 max-w-2xl mx-auto leading-relaxed">
              Sử dụng công nghệ phân tích thông minh để xác minh tin tức, hình ảnh và bảo vệ bạn khỏi thông tin sai lệch trên không gian mạng.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/checker">
                <Button 
                  size="lg" 
                  className="bg-white text-blue-800 hover:bg-gray-100 text-lg px-8 py-6 transition-all duration-200 active:scale-[0.98] shadow-lg"
                >
                  Bắt đầu kiểm tra ngay
                </Button>
              </Link>
              <Link to="/education">
                <Button 
                  size="lg" 
                  variant="outline"
                  className="bg-transparent text-white border-white/30 hover:bg-white/10 text-lg px-8 py-6 transition-all duration-200 active:scale-[0.98]"
                >
                  Tìm hiểu thêm
                </Button>
              </Link>
            </div>
          </div>
        </section>
        
        {/* Features Section */}
        <section className="py-24 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Tính năng chính
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Công cụ toàn diện giúp bạn xác minh thông tin một cách nhanh chóng và chính xác
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <FeatureCard 
                icon={Search}
                title="Kiểm tra văn bản"
                description="Phân tích nội dung văn bản và URL để phát hiện các dấu hiệu của tin giả, ngôn ngữ cảm tính và thiếu nguồn tin đáng tin cậy"
              />
              {/* <FeatureCard 
                icon={Image}
                title="Kiểm tra hình ảnh"
                description="Xác minh tính xác thực của hình ảnh, phát hiện chỉnh sửa và kiểm tra nguồn gốc để tránh thông tin sai lệch"
              /> */}
              <FeatureCard 
                icon={Zap}
                title="Phân tích nhanh"
                description="Nhận kết quả phân tích chi tiết trong vài giây với điểm tin cậy và giải thích rõ ràng"
              />
              <FeatureCard 
                icon={History}
                title="Lưu lịch sử"
                description="Lưu trữ các kết quả kiểm tra để xem lại sau và theo dõi các thông tin đã xác minh"
              />
              {/* <FeatureCard 
                icon={BookOpen}
                title="Tài liệu giáo dục"
                description="Học cách nhận biết tin giả với hướng dẫn chi tiết và ví dụ thực tế từ chuyên gia"
              />
              <FeatureCard 
                icon={Shield}
                title="Bảo mật thông tin"
                description="Dữ liệu của bạn được bảo vệ an toàn với mã hóa và quyền riêng tư được đảm bảo"
              /> */}
            </div>
          </div>
        </section>
        
        {/* CTA Section */}
        <section className="py-24 bg-gray-50 border-t border-gray-100">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Sẵn sàng bảo vệ bản thân?
            </h2>
            <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
              Bắt đầu xác minh thông tin ngay hôm nay và tránh xa tin giả
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/checker">
                <Button 
                  size="lg" 
                  className="bg-blue-800 hover:bg-blue-900 text-white px-8 transition-colors duration-200 active:scale-[0.98] shadow-md"
                >
                  Kiểm tra ngay
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </div>
    </>
  );
};
export default HomePage;
