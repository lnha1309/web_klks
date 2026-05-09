import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import FeedbackModal from '@/components/FeedbackModal.jsx';
import { useAuth } from '@/contexts/AuthContext.jsx';
import { checkService } from '@/services/checkService';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import LoadingSpinner from '@/components/LoadingSpinner.jsx';

const MyHistoryPage = () => {
  const { currentUser } = useAuth();
  const [checks, setChecks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [feedbackModalOpen, setFeedbackModalOpen] = useState(false);
  const [selectedCheckId, setSelectedCheckId] = useState(null);
  
  const openFeedback = (checkId) => {
    setSelectedCheckId(checkId);
    setFeedbackModalOpen(true);
  };
  
  useEffect(() => {
    fetchChecks();
  }, []);
  
  const fetchChecks = async () => {
    try {
      const response = await checkService.getHistory();
      if (response.success) {
        setChecks(response.data);
      }
    } catch (error) {
      toast.error('Không thể tải lịch sử: ' + error.message);
    } finally {
      setLoading(false);
    }
  };
  
  const handleDelete = async (id) => {
    if (!window.confirm('Bạn có chắc muốn xóa kết quả này?')) {
      return;
    }
    
    try {
      const response = await checkService.deleteCheck(id);
      if (response.success) {
        setChecks(checks.filter(check => check.id !== id));
        toast.success('Đã xóa kết quả');
      }
    } catch (error) {
      toast.error('Không thể xóa: ' + error.message);
    }
  };
  
  const getTrustLevelBadge = (level) => {
    if (level === 'Tin cậy cao' || level === 'REAL') {
      return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Tin cậy cao</Badge>;
    }
    if (level === 'Có dấu hiệu giả' || level === 'FAKE') {
      return <Badge className="bg-red-100 text-red-800 hover:bg-red-100">Có dấu hiệu giả</Badge>;
    }
    return <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">Cần xác minh</Badge>;
  };
  
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };
  
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <LoadingSpinner text="Đang tải lịch sử..." />
      </div>
    );
  }
  
  return (
    <>
      <Helmet>
        <title>Lịch sử kiểm tra - Phát hiện tin giả</title>
        <meta name="description" content="Xem lại các kết quả kiểm tra đã lưu" />
      </Helmet>
      
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
              Lịch sử kiểm tra
            </h1>
            <p className="text-lg text-gray-600">
              Các kết quả kiểm tra đã lưu của bạn
            </p>
          </div>
          
          {checks.length === 0 ? (
            <div className="bg-white rounded-xl p-12 text-center shadow-sm border border-gray-200">
              <p className="text-gray-600 mb-4">Bạn chưa có kết quả kiểm tra nào được lưu</p>
              <Button 
                onClick={() => window.location.href = '/checker'}
                className="bg-blue-700 hover:bg-blue-800"
              >
                Bắt đầu kiểm tra
              </Button>
            </div>
          ) : (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Ngày</TableHead>
                    <TableHead>Nội dung</TableHead>
                    <TableHead>Loại</TableHead>
                    <TableHead>Điểm tin cậy</TableHead>
                    <TableHead>Kết quả</TableHead>
                    <TableHead className="text-right">Thao tác</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {checks.map((check) => (
                    <TableRow key={check.id}>
                      <TableCell className="text-sm text-gray-600">
                        {formatDate(check.createdAt)}
                      </TableCell>
                      <TableCell className="max-w-xs truncate">
                        {check.text}
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">Văn bản</Badge>
                      </TableCell>
                      <TableCell className="font-semibold">
                        {check.confidenceScore}%
                      </TableCell>
                      <TableCell>
                        {getTrustLevelBadge(check.predictLabel)}
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => openFeedback(check.id)}
                          className="text-blue-600 hover:text-blue-700 hover:bg-blue-50 mr-2"
                        >
                          Feedback
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(check.id)}
                          className="text-red-600 hover:text-red-700 hover:bg-red-50"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </div>
      </div>
      <FeedbackModal
        isOpen={feedbackModalOpen}
        onClose={() => setFeedbackModalOpen(false)}
        checkId={selectedCheckId}
      />
    </>
  );
};

export default MyHistoryPage;