import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import FeedbackModal from '@/components/FeedbackModal.jsx';
import { useAuth } from '@/contexts/AuthContext.jsx';
import { checkService } from '@/services/checkService';
import { Button } from '@/components/ui/button';
import {
  Table, TableBody, TableCell, TableHead,
  TableHeader, TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Trash2, History, MessageSquare, Calendar, BarChart3 } from 'lucide-react';
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

  useEffect(() => { fetchChecks(); }, []);

  const fetchChecks = async () => {
    try {
      const response = await checkService.getHistory();
      if (response.success) setChecks(response.data);
    } catch (error) {
      toast.error('Không thể tải lịch sử: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Bạn có chắc muốn xóa kết quả này?')) return;
    try {
      const response = await checkService.deleteCheck(id);
      if (response.success) {
        setChecks(checks.filter(c => c.id !== id));
        toast.success('Đã xóa kết quả');
      }
    } catch (error) {
      toast.error('Không thể xóa: ' + error.message);
    }
  };

  const getTrustLevelBadge = (level) => {
    if (level === 'Tin cậy cao' || level === 'REAL')
      return <Badge className="bg-green-100 text-green-800 hover:bg-green-100 text-xs">Tin cậy cao</Badge>;
    if (level === 'Có dấu hiệu giả' || level === 'FAKE')
      return <Badge className="bg-red-100 text-red-800 hover:bg-red-100 text-xs">Có dấu hiệu giả</Badge>;
    return <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100 text-xs">Cần xác minh</Badge>;
  };

  const formatDate = (dateString) =>
    new Date(dateString).toLocaleDateString('vi-VN', {
      year: 'numeric', month: '2-digit', day: '2-digit',
      hour: '2-digit', minute: '2-digit',
    });

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

      <div className="min-h-screen bg-gray-50 py-8 sm:py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          {/* Page Header */}
          <div className="mb-6 sm:mb-8">
            <div className="flex items-center gap-3 mb-2">
              <div style={{
                background: 'linear-gradient(135deg,#EFF6FF,#DBEAFE)',
                borderRadius: 12, padding: 10,
              }}>
                <History className="w-5 h-5" style={{ color: '#2563EB' }} />
              </div>
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900">
                Lịch sử kiểm tra
              </h1>
            </div>
            <p className="text-gray-600 text-sm sm:text-base ml-1">
              {checks.length > 0 ? `${checks.length} kết quả đã lưu` : 'Các kết quả kiểm tra đã lưu của bạn'}
            </p>
          </div>

          {checks.length === 0 ? (
            <div className="bg-white rounded-2xl p-10 sm:p-16 text-center shadow-sm border border-gray-200">
              <div style={{
                width: 64, height: 64, margin: '0 auto 16px',
                background: 'linear-gradient(135deg,#EFF6FF,#DBEAFE)',
                borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <History className="w-7 h-7" style={{ color: '#2563EB' }} />
              </div>
              <p className="text-gray-600 mb-4 text-sm sm:text-base">
                Bạn chưa có kết quả kiểm tra nào được lưu
              </p>
              <Button
                onClick={() => window.location.href = '/checker'}
                className="bg-blue-700 hover:bg-blue-800"
              >
                Bắt đầu kiểm tra
              </Button>
            </div>
          ) : (
            <>
              {/* Desktop Table */}
              <div className="hidden md:block bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-40">Ngày</TableHead>
                      <TableHead>Nội dung</TableHead>
                      <TableHead className="w-28 text-center">Điểm tin cậy</TableHead>
                      <TableHead className="w-36 text-center">Kết quả</TableHead>
                      <TableHead className="w-36 text-right">Thao tác</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {checks.map((check) => (
                      <TableRow key={check.id} className="hover:bg-gray-50 transition-colors">
                        <TableCell className="text-sm text-gray-600 whitespace-nowrap">
                          {formatDate(check.createdAt)}
                        </TableCell>
                        <TableCell className="max-w-xs">
                          <p className="truncate text-sm text-gray-800">{check.text}</p>
                        </TableCell>
                        <TableCell className="text-center font-semibold text-sm">
                          {check.confidenceScore}%
                        </TableCell>
                        <TableCell className="text-center">
                          {getTrustLevelBadge(check.predictLabel)}
                        </TableCell>
                        <TableCell className="text-right">
                          <Button
                            variant="ghost" size="sm"
                            onClick={() => openFeedback(check.id)}
                            className="text-blue-600 hover:text-blue-700 hover:bg-blue-50 mr-1 text-xs"
                          >
                            Feedback
                          </Button>
                          <Button
                            variant="ghost" size="sm"
                            onClick={() => handleDelete(check.id)}
                            className="text-red-500 hover:text-red-700 hover:bg-red-50"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              {/* Mobile Cards */}
              <div className="md:hidden space-y-3">
                {checks.map((check) => {
                  const isFake = check.predictLabel === 'Có dấu hiệu giả' || check.predictLabel === 'FAKE';
                  return (
                    <div key={check.id} style={{
                      background: 'white', borderRadius: 16,
                      border: '1px solid #E5E7EB',
                      boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
                      padding: '16px',
                      animation: 'fadeIn 0.3s ease',
                    }}>
                      {/* Result badge + date */}
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
                        {getTrustLevelBadge(check.predictLabel)}
                        <span style={{ fontSize: 11, color: '#9CA3AF', display: 'flex', alignItems: 'center', gap: 4 }}>
                          <Calendar style={{ width: 11, height: 11 }} />
                          {formatDate(check.createdAt)}
                        </span>
                      </div>

                      {/* Text preview */}
                      <p style={{
                        fontSize: 13, color: '#374151', lineHeight: 1.6,
                        display: '-webkit-box', WebkitLineClamp: 3,
                        WebkitBoxOrient: 'vertical', overflow: 'hidden',
                        marginBottom: 12,
                      }}>
                        {check.text}
                      </p>

                      {/* Confidence + actions */}
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <div style={{
                          display: 'flex', alignItems: 'center', gap: 6,
                          background: isFake ? '#FEF2F2' : '#F0FDF4',
                          borderRadius: 8, padding: '4px 10px',
                        }}>
                          <BarChart3 style={{ width: 13, height: 13, color: isFake ? '#DC2626' : '#16A34A' }} />
                          <span style={{ fontSize: 12, fontWeight: 600, color: isFake ? '#DC2626' : '#16A34A' }}>
                            {check.confidenceScore}% tin cậy
                          </span>
                        </div>
                        <div style={{ display: 'flex', gap: 6 }}>
                          <button
                            onClick={() => openFeedback(check.id)}
                            style={{
                              display: 'flex', alignItems: 'center', gap: 4,
                              fontSize: 12, fontWeight: 600, color: '#2563EB',
                              background: '#EFF6FF', border: 'none',
                              borderRadius: 8, padding: '6px 10px', cursor: 'pointer',
                            }}
                          >
                            <MessageSquare style={{ width: 13, height: 13 }} />
                            Feedback
                          </button>
                          <button
                            onClick={() => handleDelete(check.id)}
                            style={{
                              display: 'flex', alignItems: 'center',
                              background: '#FEF2F2', border: 'none',
                              borderRadius: 8, padding: '6px 8px', cursor: 'pointer',
                            }}
                          >
                            <Trash2 style={{ width: 13, height: 13, color: '#DC2626' }} />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </>
          )}
        </div>
      </div>

      <FeedbackModal
        isOpen={feedbackModalOpen}
        onClose={() => setFeedbackModalOpen(false)}
        checkId={selectedCheckId}
      />

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(8px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </>
  );
};

export default MyHistoryPage;