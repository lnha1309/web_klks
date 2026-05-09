import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { checkService } from '@/services/checkService';
import { toast } from 'sonner';
import {
  Search,
  FileText,
  Image as ImageIcon,
  AlertTriangle,
  CheckCircle2,
  Brain,
  Lightbulb,
  Sparkles,
  Tag,
  BarChart3,
  Zap,
  BookmarkPlus,
  Shield,
  ShieldAlert,
  ChevronRight,
} from 'lucide-react';

const CheckerPage = () => {
  const [textInput, setTextInput] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState(null);
  const [rawData, setRawData] = useState(null);
  const [activeTab, setActiveTab] = useState('text');

  const handleTextAnalysis = async () => {
    if (!textInput.trim()) {
      toast.error('Vui lòng nhập nội dung cần kiểm tra');
      return;
    }

    setAnalyzing(true);
    setResult(null);

    try {
      const response = await checkService.predictAndSave(textInput);
      if (response.success) {
         setResult({
           trust_level: response.data.predictLabel,
           confidence_score: response.data.confidenceScore,
           detailed_explanation: response.data.explanation,
         });
         toast.success('Đã phân tích và lưu tự động!');
      }
    } catch (error) {
      toast.error('Có lỗi xảy ra khi phân tích. Vui lòng thử lại.');
    } finally {
      setAnalyzing(false);
    }
  };

  const handleImageAnalysis = async () => {
    if (!imageFile) {
      toast.error('Vui lòng chọn hình ảnh cần kiểm tra');
      return;
    }

    setAnalyzing(true);
    setResult(null);

    try {
      const analysisResult = await analyzeImage(imageFile);
      setResult(analysisResult);
      setCurrentCheckData({
        content: imageFile.name,
        type: 'image',
        ...analysisResult,
      });
    } catch (error) {
      toast.error('Có lỗi xảy ra khi phân tích');
    } finally {
      setAnalyzing(false);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        toast.error('Vui lòng chọn file hình ảnh');
        return;
      }
      setImageFile(file);
    }
  };

  const isFake = result?.trust_level === 'Có dấu hiệu giả' || result?.trust_level === 'FAKE';

  return (
    <>
      <Helmet>
        <title>Kiểm tra tin tức - Phát hiện tin giả</title>
        <meta
          name="description"
          content="Kiểm tra văn bản và hình ảnh để phát hiện tin giả bằng AI"
        />
      </Helmet>

      <div className="min-h-screen" style={{ background: 'linear-gradient(135deg, #EFF6FF 0%, #F0F4FF 40%, #F5F3FF 100%)' }}>
        {/* Hero Header */}
        <div
          style={{
            background: 'linear-gradient(135deg, #1E3A8A 0%, #1E40AF 50%, #2563EB 100%)',
            padding: '48px 0 48px',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          {/* Decorative circles */}
          <div style={{
            position: 'absolute', top: '-40px', right: '-40px',
            width: '200px', height: '200px', borderRadius: '50%',
            background: 'rgba(255,255,255,0.05)',
          }} />
          <div style={{
            position: 'absolute', bottom: '-60px', left: '10%',
            width: '300px', height: '300px', borderRadius: '50%',
            background: 'rgba(255,255,255,0.03)',
          }} />

          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="flex items-center justify-center gap-3 mb-4">
              <div style={{
                background: 'rgba(255,255,255,0.15)',
                borderRadius: '14px',
                padding: '10px',
                backdropFilter: 'blur(10px)',
              }}>
                <Shield className="w-7 h-7 text-white" />
              </div>
              <h1 className="text-3xl md:text-4xl font-bold text-white">
                Kiểm tra thông tin
              </h1>
            </div>
            <p className="text-center text-blue-200 text-lg">
              Phân tích văn bản bằng AI để xác minh tính xác thực
            </p>
          </div>
        </div>

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8" style={{ paddingTop: '32px', paddingBottom: '48px' }}>

          {/* Input Card */}
          <div
            style={{
              background: 'rgba(255, 255, 255, 0.85)',
              backdropFilter: 'blur(20px)',
              borderRadius: '20px',
              border: '1px solid rgba(255, 255, 255, 0.6)',
              boxShadow: '0 8px 32px rgba(30, 58, 138, 0.08), 0 1px 2px rgba(0,0,0,0.04)',
              padding: '28px',
              transition: 'box-shadow 0.3s ease',
            }}
          >
            {/* Label with icon */}
            <div className="flex items-center gap-3 mb-5">
              <div
                style={{
                  background: 'linear-gradient(135deg, #EFF6FF, #DBEAFE)',
                  borderRadius: '12px',
                  padding: '10px',
                }}
              >
                <FileText className="w-5 h-5" style={{ color: '#2563EB' }} />
              </div>
              <div>
                <h2 className="text-base font-bold text-gray-900">
                  Nhập nội dung cần kiểm tra
                </h2>
                <p className="text-xs text-gray-500 mt-0.5">
                  Dán hoặc nhập nội dung tin tức để AI phân tích
                </p>
              </div>
            </div>

            {/* Textarea */}
            <div style={{ position: 'relative' }}>
              <textarea
                id="text-input"
                placeholder="Dán hoặc nhập nội dung tin tức tại đây..."
                value={textInput}
                onChange={(e) => setTextInput(e.target.value)}
                rows={6}
                style={{
                  width: '100%',
                  minHeight: '180px',
                  padding: '16px 18px',
                  borderRadius: '14px',
                  border: '1.5px solid #E5E7EB',
                  background: '#F9FAFB',
                  fontSize: '15px',
                  lineHeight: '1.7',
                  color: '#111827',
                  resize: 'vertical',
                  outline: 'none',
                  transition: 'border-color 0.2s, box-shadow 0.2s',
                  fontFamily: 'inherit',
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = '#2563EB';
                  e.target.style.boxShadow = '0 0 0 3px rgba(37, 99, 235, 0.1)';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = '#E5E7EB';
                  e.target.style.boxShadow = 'none';
                }}
              />
              {textInput.length > 0 && (
                <span
                  style={{
                    position: 'absolute',
                    bottom: '12px',
                    right: '14px',
                    fontSize: '12px',
                    color: '#9CA3AF',
                    background: '#F9FAFB',
                    padding: '2px 6px',
                    borderRadius: '4px',
                  }}
                >
                  {textInput.length} ký tự
                </span>
              )}
            </div>

            {/* Analyze Button */}
            <button
              onClick={handleTextAnalysis}
              disabled={analyzing || !textInput.trim()}
              style={{
                width: '100%',
                marginTop: '16px',
                padding: '14px 24px',
                borderRadius: '14px',
                border: 'none',
                background: analyzing || !textInput.trim()
                  ? '#94A3B8'
                  : 'linear-gradient(135deg, #1E40AF 0%, #2563EB 100%)',
                color: 'white',
                fontSize: '16px',
                fontWeight: '600',
                cursor: analyzing || !textInput.trim() ? 'not-allowed' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '10px',
                transition: 'all 0.2s ease',
                boxShadow: analyzing || !textInput.trim()
                  ? 'none'
                  : '0 4px 14px rgba(37, 99, 235, 0.35)',
                transform: 'scale(1)',
              }}
              onMouseDown={(e) => {
                if (!analyzing && textInput.trim()) e.currentTarget.style.transform = 'scale(0.98)';
              }}
              onMouseUp={(e) => { e.currentTarget.style.transform = 'scale(1)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.transform = 'scale(1)'; }}
            >
              {analyzing ? (
                <>
                  <div
                    style={{
                      width: '20px',
                      height: '20px',
                      border: '2.5px solid rgba(255,255,255,0.3)',
                      borderTopColor: 'white',
                      borderRadius: '50%',
                      animation: 'spin 0.8s linear infinite',
                    }}
                  />
                  Đang phân tích...
                </>
              ) : (
                <>
                  <Search className="w-5 h-5" />
                  Phân tích ngay
                </>
              )}
            </button>
          </div>

          {/* Loading State */}
          {analyzing && (
            <div
              style={{
                marginTop: '24px',
                background: 'white',
                borderRadius: '20px',
                padding: '40px',
                textAlign: 'center',
                boxShadow: '0 4px 24px rgba(0,0,0,0.04)',
                animation: 'fadeIn 0.3s ease',
              }}
            >
              <div style={{
                width: '72px', height: '72px',
                margin: '0 auto 20px',
                background: 'linear-gradient(135deg, #EFF6FF, #DBEAFE)',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                animation: 'pulse 1.5s ease-in-out infinite',
              }}>
                <Brain className="w-8 h-8" style={{ color: '#2563EB' }} />
              </div>
              <p style={{ fontSize: '17px', fontWeight: '600', color: '#374151', marginBottom: '6px' }}>
                AI đang phân tích nội dung...
              </p>
              <p style={{ fontSize: '14px', color: '#9CA3AF' }}>
                Vui lòng chờ trong giây lát
              </p>
            </div>
          )}

          {/* Result */}
          {result && !analyzing && (
            <div style={{ marginTop: '24px', animation: 'slideUp 0.4s ease' }}>
              {/* Verdict Card */}
              <div
                style={{
                  background: isFake
                    ? 'linear-gradient(135deg, #FEF2F2, #FEE2E2)'
                    : 'linear-gradient(135deg, #F0FDF4, #DCFCE7)',
                  borderRadius: '20px',
                  padding: '32px',
                  border: `1.5px solid ${isFake ? 'rgba(220, 38, 38, 0.2)' : 'rgba(22, 163, 74, 0.2)'}`,
                  textAlign: 'center',
                  position: 'relative',
                  overflow: 'hidden',
                }}
              >
                {/* Decorative bg */}
                <div style={{
                  position: 'absolute', top: '-30px', right: '-30px',
                  width: '120px', height: '120px', borderRadius: '50%',
                  background: isFake ? 'rgba(220, 38, 38, 0.06)' : 'rgba(22, 163, 74, 0.06)',
                }} />

                <div
                  style={{
                    width: '80px',
                    height: '80px',
                    margin: '0 auto 16px',
                    borderRadius: '50%',
                    background: isFake ? '#FEE2E2' : '#DCFCE7',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: isFake
                      ? '0 8px 24px rgba(220, 38, 38, 0.15)'
                      : '0 8px 24px rgba(22, 163, 74, 0.15)',
                  }}
                >
                  {isFake ? (
                    <ShieldAlert className="w-10 h-10" style={{ color: '#DC2626' }} />
                  ) : (
                    <CheckCircle2 className="w-10 h-10" style={{ color: '#16A34A' }} />
                  )}
                </div>

                <h2
                  style={{
                    fontSize: '28px',
                    fontWeight: '800',
                    color: isFake ? '#DC2626' : '#16A34A',
                    marginBottom: '8px',
                    letterSpacing: '0.5px',
                  }}
                >
                  {isFake ? 'TIN GIẢ' : 'TIN THẬT'}
                </h2>

                <p
                  style={{
                    fontSize: '16px',
                    fontWeight: '600',
                    color: isFake ? 'rgba(220, 38, 38, 0.8)' : 'rgba(22, 163, 74, 0.8)',
                    marginBottom: '20px',
                  }}
                >
                  Độ tin cậy: {result.confidence_score}%
                </p>

                {/* Confidence Bar */}
                <div
                  style={{
                    height: '10px',
                    borderRadius: '5px',
                    background: isFake
                      ? 'rgba(220, 38, 38, 0.12)'
                      : 'rgba(22, 163, 74, 0.12)',
                    overflow: 'hidden',
                    maxWidth: '400px',
                    margin: '0 auto',
                  }}
                >
                  <div
                    style={{
                      height: '100%',
                      width: `${result.confidence_score}%`,
                      borderRadius: '5px',
                      background: isFake
                        ? 'linear-gradient(90deg, #EF4444, #DC2626)'
                        : 'linear-gradient(90deg, #22C55E, #16A34A)',
                      transition: 'width 0.8s ease',
                    }}
                  />
                </div>
              </div>

              {/* Explanation Card */}
              {result.detailed_explanation && (
                <InfoCard
                  icon={<Lightbulb className="w-5 h-5" style={{ color: '#2563EB' }} />}
                  title="Giải thích"
                  style={{ marginTop: '16px' }}
                >
                  <p style={{ fontSize: '14px', color: '#374151', lineHeight: '1.7' }}>
                    {result.detailed_explanation}
                  </p>
                </InfoCard>
              )}

            </div>
          )}
        </div>
      </div>

      {/* CSS Animations */}
      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        @keyframes pulse {
          0%, 100% { transform: scale(1); opacity: 1; }
          50% { transform: scale(1.05); opacity: 0.7; }
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(8px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(16px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </>
  );
};

/* Reusable Info Card */
const InfoCard = ({ icon, title, children, style = {} }) => (
  <div
    style={{
      background: 'white',
      borderRadius: '16px',
      padding: '20px',
      boxShadow: '0 2px 12px rgba(0,0,0,0.04)',
      ...style,
    }}
  >
    <div className="flex items-center gap-2 mb-3">
      {icon}
      <h3 style={{ fontSize: '15px', fontWeight: '700', color: '#111827' }}>{title}</h3>
    </div>
    {children}
  </div>
);

export default CheckerPage;
