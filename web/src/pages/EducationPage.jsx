import React from 'react';
import { Helmet } from 'react-helmet';
import { Accordion } from '@/components/ui/accordion';
import EducationCard from '@/components/EducationCard.jsx';

const EducationPage = () => {
  return (
    <>
      <Helmet>
        <title>Cách nhận biết tin giả - Phát hiện tin giả</title>
        <meta name="description" content="Học cách nhận biết và phòng tránh tin giả với hướng dẫn chi tiết" />
      </Helmet>
      
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Cách nhận biết tin giả
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Trang bị kiến thức để bảo vệ bản thân khỏi thông tin sai lệch
            </p>
          </div>
          
          <Accordion type="single" collapsible className="w-full">
            <EducationCard 
              value="item-1"
              title="Dấu hiệu nhận biết tin giả"
              content={
                <div className="space-y-3">
                  <p><strong>1. Tiêu đề giật gân:</strong> Tiêu đề quá cảm tính, sử dụng chữ in hoa quá mức, hoặc có nhiều dấu chấm than.</p>
                  <p><strong>2. Thiếu nguồn tin:</strong> Không có tác giả rõ ràng, không trích dẫn nguồn, hoặc nguồn không đáng tin cậy.</p>
                  <p><strong>3. Ngôn ngữ cảm tính:</strong> Sử dụng ngôn từ kích động, thiên vị, hoặc gây chia rẽ.</p>
                  <p><strong>4. Hình ảnh chỉnh sửa:</strong> Hình ảnh bị cắt ghép, chỉnh sửa, hoặc sử dụng sai ngữ cảnh.</p>
                  <p><strong>5. Thông tin lỗi thời:</strong> Tin tức cũ được đăng lại như tin mới.</p>
                </div>
              }
            />
            
            <EducationCard 
              value="item-2"
              title="Kỹ thuật xác minh thông tin"
              content={
                <div className="space-y-3">
                  <p><strong>1. Kiểm tra nguồn gốc:</strong> Tìm hiểu về trang web, tác giả, và lịch sử xuất bản của họ.</p>
                  <p><strong>2. Tìm kiếm chéo:</strong> Tìm kiếm cùng thông tin trên nhiều nguồn tin uy tín khác nhau.</p>
                  <p><strong>3. Kiểm tra ngày tháng:</strong> Xác nhận thời gian xuất bản và đảm bảo thông tin còn hiện hành.</p>
                  <p><strong>4. Tìm kiếm hình ảnh ngược:</strong> Sử dụng Google Images hoặc TinEye để kiểm tra nguồn gốc hình ảnh.</p>
                  <p><strong>5. Đọc toàn bộ bài viết:</strong> Không chỉ đọc tiêu đề, hãy đọc kỹ nội dung để hiểu đầy đủ.</p>
                </div>
              }
            />
            
            <EducationCard 
              value="item-3"
              title="Ví dụ thực tế"
              content={
                <div className="space-y-3">
                  <p><strong>Ví dụ 1 - Tiêu đề giật gân:</strong> "CHẤN ĐỘNG!!! Phát hiện bí mật kinh hoàng!!!" - Đây là dấu hiệu rõ ràng của tin giả với việc lạm dụng chữ in hoa và dấu chấm than.</p>
                  <p><strong>Ví dụ 2 - Hình ảnh sai ngữ cảnh:</strong> Hình ảnh từ sự kiện năm 2015 được sử dụng cho tin tức năm 2026 mà không ghi rõ nguồn gốc.</p>
                  <p><strong>Ví dụ 3 - Thiếu nguồn tin:</strong> Bài viết tuyên bố "Các chuyên gia cho biết..." nhưng không nêu tên chuyên gia hoặc tổ chức cụ thể.</p>
                </div>
              }
            />
            
            <EducationCard 
              value="item-4"
              title="Nguồn tin đáng tin cậy"
              content={
                <div className="space-y-3">
                  <p><strong>Báo chí chính thống:</strong> Các tờ báo lớn có uy tín, đã hoạt động lâu năm và có quy trình biên tập chặt chẽ.</p>
                  <p><strong>Tổ chức quốc tế:</strong> WHO, UNESCO, UN và các tổ chức uy tín khác.</p>
                  <p><strong>Trang web chính phủ:</strong> Thông tin từ các cơ quan nhà nước chính thức (.gov.vn).</p>
                  <p><strong>Tổ chức kiểm chứng:</strong> Các trang fact-checking như AFP Fact Check, Reuters Fact Check.</p>
                  <p><strong>Chuyên gia được xác minh:</strong> Ý kiến từ các chuyên gia có bằng cấp và kinh nghiệm được công nhận.</p>
                </div>
              }
            />
          </Accordion>
          
          <div className="mt-12 bg-blue-50 border border-blue-200 rounded-xl p-6">
            <h3 className="font-semibold text-lg text-blue-900 mb-3">
              Lời khuyên quan trọng
            </h3>
            <ul className="space-y-2 text-sm text-blue-800">
              <li>• Luôn nghi ngờ thông tin gây sốc hoặc quá tốt để có thể tin được</li>
              <li>• Không chia sẻ thông tin chưa được xác minh</li>
              <li>• Kiểm tra kỹ trước khi tin tưởng và hành động</li>
              <li>• Giáo dục người thân về cách nhận biết tin giả</li>
            </ul>
          </div>
        </div>
      </div>
    </>
  );
};

export default EducationPage;