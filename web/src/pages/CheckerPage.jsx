import React, { useState, useMemo } from 'react';
import { Helmet } from 'react-helmet';
import { checkService } from '@/services/checkService';
import { toast } from 'sonner';
import {
  Search, FileText, AlertTriangle, CheckCircle2, Brain,
  Lightbulb, Sparkles, Shield, ShieldAlert, Info,
} from 'lucide-react';

// ─── Validation Helpers ─────────────────────────────────────────────────────

const MAX_CHARS = 5000;
const MIN_CHARS = 30;
const OPTIMAL_MIN = 50;
const OPTIMAL_MAX = 300;

const hasVietnameseDiacritics = (text) =>
  /[àáảãạăắằẳẵặâấầẩẫậèéẻẽẹêếềểễệìíỉĩịòóỏõọôốồổỗộơớờởỡợùúủũụưứừửữựỳýỷỹỵđÀÁẢÃẠĂẮẰẲẴẶÂẤẦẨẪẬÈÉẺẼẸÊẾỀỂỄỆÌÍỈĨỊÒÓỎÕỌÔỐỒỔỖỘƠỚỜỞỠỢÙÚỦŨỤƯỨỪỬỮỰỲÝỶỸỴĐ]/.test(text);

const isVietnameseNoDiacritics = (text) => {
  const lc = text.toLowerCase();
  const patterns = ['khong', 'nguoi', 'viet', 'nam', 'bao', 'tin', 'that', 'gia', 'hay', 'duoc', 'nhat', 'cung', 'nhung', 'nhieu', 'truoc', 'trong', 'ngoai', 'chuyen', 'hoat'];
  const matches = patterns.filter(p => lc.includes(p));
  return matches.length >= 2;
};

const isSpamContent = (text) => {
  const trimmed = text.trim();
  if (trimmed.length === 0) return false;
  const letterCount = (trimmed.match(/[a-zA-ZÀ-ỹà-ỹ\u00C0-\u024F\u1E00-\u1EFF]/g) || []).length;
  return letterCount / trimmed.length < 0.35;
};

const isLatinOnly = (text) => {
  const letters = (text.match(/[a-zA-ZÀ-ỹà-ỹ\u00C0-\u024F\u1E00-\u1EFF]/g) || []);
  if (letters.length === 0) return false;
  const latinOnly = (text.match(/[a-zA-Z]/g) || []).length;
  return latinOnly / letters.length > 0.85;
};

// Returns { type: 'error'|'warning'|'info'|'success', message, hint }
const validateInput = (text) => {
  const len = text.trim().length;
  if (len === 0) return null;

  if (isSpamContent(text)) {
    return {
      type: 'error',
      message: 'Nội dung chứa quá nhiều ký tự đặc biệt hoặc không phải văn bản',
      hint: 'Vui lòng nhập nội dung tin tức thực sự để AI phân tích chính xác.',
    };
  }

  if (len < MIN_CHARS) {
    return {
      type: 'warning',
      message: `Nội dung quá ngắn (${len} ký tự) — cần ít nhất ${MIN_CHARS} ký tự`,
      hint: `Dự đoán chính xác nhất trong khoảng ${OPTIMAL_MIN}–${OPTIMAL_MAX} ký tự.`,
    };
  }

  const hasViet = hasVietnameseDiacritics(text);
  const seemsVietNoDia = isVietnameseNoDiacritics(text);
  const latinOnly = isLatinOnly(text);

  if (!hasViet && !seemsVietNoDia && latinOnly) {
    return {
      type: 'warning',
      message: 'Nội dung có vẻ không phải tiếng Việt',
      hint: 'Mô hình AI được huấn luyện trên dữ liệu tiếng Việt — độ chính xác có thể thấp hơn với ngôn ngữ khác.',
    };
  }

  if (!hasViet && seemsVietNoDia) {
    return {
      type: 'warning',
      message: 'Phát hiện tiếng Việt không dấu',
      hint: 'Nhập tiếng Việt có dấu để AI phân tích chính xác hơn.',
    };
  }

  if (len >= OPTIMAL_MIN && len <= OPTIMAL_MAX) {
    return {
      type: 'success',
      message: `Độ dài tối ưu (${len} ký tự) — AI sẽ cho kết quả chính xác nhất`,
      hint: `Vùng tối ưu: ${OPTIMAL_MIN}–${OPTIMAL_MAX} ký tự. Bạn đang trong vùng này! ✨`,
    };
  }

  if (len > OPTIMAL_MAX && len <= MAX_CHARS) {
    return {
      type: 'info',
      message: `Nội dung đầy đủ (${len} ký tự) — AI có đủ dữ liệu để phân tích`,
      hint: `Tốt nhất trong khoảng ${OPTIMAL_MIN}–${OPTIMAL_MAX} ký tự, nhưng nội dung dài vẫn hoạt động tốt.`,
    };
  }

  return null;
};

// ─── Suggestion Box Component ────────────────────────────────────────────────

const SUGGESTION_STYLES = {
  error:   { bg: '#FEF2F2', border: '#FECACA', icon: '#DC2626', text: '#991B1B', subText: '#B91C1C', badgeBg: '#FEE2E2', badgeText: '#DC2626' },
  warning: { bg: '#FFFBEB', border: '#FDE68A', icon: '#D97706', text: '#92400E', subText: '#B45309', badgeBg: '#FEF3C7', badgeText: '#D97706' },
  info:    { bg: '#EFF6FF', border: '#BFDBFE', icon: '#2563EB', text: '#1E40AF', subText: '#3B82F6', badgeBg: '#DBEAFE', badgeText: '#2563EB' },
  success: { bg: '#F0FDF4', border: '#BBF7D0', icon: '#16A34A', text: '#14532D', subText: '#15803D', badgeBg: '#DCFCE7', badgeText: '#16A34A' },
};

const SUGGESTION_ICONS = {
  error:   <AlertTriangle style={{ width: 16, height: 16 }} />,
  warning: <AlertTriangle style={{ width: 16, height: 16 }} />,
  info:    <Info style={{ width: 16, height: 16 }} />,
  success: <CheckCircle2 style={{ width: 16, height: 16 }} />,
};

const SuggestionBox = ({ validation }) => {
  if (!validation) return null;
  const s = SUGGESTION_STYLES[validation.type];
  return (
    <div
      style={{
        marginTop: 10,
        padding: '10px 14px',
        borderRadius: 12,
        background: s.bg,
        border: `1.5px solid ${s.border}`,
        display: 'flex',
        alignItems: 'flex-start',
        gap: 10,
        animation: 'fadeIn 0.2s ease',
      }}
    >
      <span style={{ color: s.icon, marginTop: 1, flexShrink: 0 }}>
        {SUGGESTION_ICONS[validation.type]}
      </span>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
          <span style={{ fontSize: 13, fontWeight: 600, color: s.text }}>
            {validation.message}
          </span>
          <span style={{
            fontSize: 11, fontWeight: 600, padding: '1px 7px',
            borderRadius: 20, background: s.badgeBg, color: s.badgeText,
            flexShrink: 0,
          }}>
            Gợi ý
          </span>
        </div>
        <p style={{ fontSize: 12, color: s.subText, marginTop: 3, lineHeight: 1.5 }}>
          {validation.hint}
        </p>
      </div>
    </div>
  );
};

// ─── Main Page ───────────────────────────────────────────────────────────────

const CheckerPage = () => {
  const [textInput, setTextInput] = useState('');
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState(null);

  const validation = useMemo(() => validateInput(textInput), [textInput]);

  const charCount = textInput.length;
  const charCountColor = charCount > MAX_CHARS * 0.9 ? '#DC2626' : charCount > MAX_CHARS * 0.7 ? '#D97706' : '#9CA3AF';

  const canSubmit = !analyzing && textInput.trim().length >= MIN_CHARS && charCount <= MAX_CHARS && validation?.type !== 'error';

  const handleTextChange = (e) => {
    const val = e.target.value;
    if (val.length <= MAX_CHARS) setTextInput(val);
  };

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

  const isFake = result?.trust_level === 'Có dấu hiệu giả' || result?.trust_level === 'FAKE';

  return (
    <>
      <Helmet>
        <title>Kiểm tra tin tức - Phát hiện tin giả</title>
        <meta name="description" content="Kiểm tra văn bản để phát hiện tin giả bằng AI" />
      </Helmet>

      <div className="min-h-screen" style={{ background: 'linear-gradient(135deg, #EFF6FF 0%, #F0F4FF 40%, #F5F3FF 100%)' }}>

        {/* Hero Header */}
        <div style={{
          background: 'linear-gradient(135deg, #1E3A8A 0%, #1E40AF 50%, #2563EB 100%)',
          padding: '36px 0',
          position: 'relative',
          overflow: 'hidden',
        }}>
          <div style={{ position: 'absolute', top: -40, right: -40, width: 200, height: 200, borderRadius: '50%', background: 'rgba(255,255,255,0.05)' }} />
          <div style={{ position: 'absolute', bottom: -60, left: '10%', width: 300, height: 300, borderRadius: '50%', background: 'rgba(255,255,255,0.03)' }} />
          <div className="max-w-3xl mx-auto px-4 sm:px-6 relative z-10 text-center">
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
              <div style={{ background: 'rgba(255,255,255,0.15)', borderRadius: 14, padding: 10, backdropFilter: 'blur(10px)' }}>
                <Shield className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white">
                Kiểm tra thông tin
              </h1>
            </div>
            <p className="text-blue-200 text-base sm:text-lg">
              Phân tích văn bản bằng AI để xác minh tính xác thực
            </p>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-3xl mx-auto px-4 sm:px-6" style={{ paddingTop: 28, paddingBottom: 48 }}>

          {/* Input Card */}
          <div style={{
            background: 'rgba(255,255,255,0.88)',
            backdropFilter: 'blur(20px)',
            borderRadius: 20,
            border: '1px solid rgba(255,255,255,0.6)',
            boxShadow: '0 8px 32px rgba(30,58,138,0.08)',
            padding: '24px 20px',
          }}>
            {/* Label */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
              <div style={{ background: 'linear-gradient(135deg,#EFF6FF,#DBEAFE)', borderRadius: 12, padding: 10, flexShrink: 0 }}>
                <FileText className="w-5 h-5" style={{ color: '#2563EB' }} />
              </div>
              <div>
                <h2 style={{ fontSize: 15, fontWeight: 700, color: '#111827' }}>Nhập nội dung cần kiểm tra</h2>
                <p style={{ fontSize: 12, color: '#6B7280', marginTop: 2 }}>
                  Dán hoặc nhập nội dung tin tức để AI phân tích
                </p>
              </div>
            </div>

            {/* Optimal range hint */}
            <div style={{
              display: 'flex', alignItems: 'center', gap: 6,
              background: '#F0FDF4', border: '1px solid #BBF7D0',
              borderRadius: 10, padding: '6px 12px', marginBottom: 12,
              flexWrap: 'wrap',
            }}>
              <Sparkles style={{ width: 13, height: 13, color: '#16A34A', flexShrink: 0 }} />
              <span style={{ fontSize: 12, color: '#15803D', fontWeight: 500 }}>
                Dự đoán chính xác nhất trong khoảng
              </span>
              <span style={{
                fontSize: 11, fontWeight: 700, padding: '1px 8px',
                background: '#DCFCE7', color: '#16A34A', borderRadius: 20,
              }}>
                {OPTIMAL_MIN}–{OPTIMAL_MAX} ký tự
              </span>
              <span style={{ fontSize: 12, color: '#6B7280' }}>· Tối đa {MAX_CHARS.toLocaleString()} ký tự</span>
            </div>

            {/* Textarea */}
            <div style={{ position: 'relative' }}>
              <textarea
                id="text-input"
                placeholder="Dán hoặc nhập nội dung tin tức tại đây..."
                value={textInput}
                onChange={handleTextChange}
                rows={6}
                style={{
                  width: '100%',
                  minHeight: 160,
                  padding: '14px 16px',
                  paddingBottom: 36,
                  borderRadius: 14,
                  border: `1.5px solid ${validation?.type === 'error' ? '#FCA5A5' : validation?.type === 'success' ? '#86EFAC' : '#E5E7EB'}`,
                  background: '#F9FAFB',
                  fontSize: 15,
                  lineHeight: 1.7,
                  color: '#111827',
                  resize: 'vertical',
                  outline: 'none',
                  transition: 'border-color 0.2s, box-shadow 0.2s',
                  fontFamily: 'inherit',
                  boxSizing: 'border-box',
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = '#2563EB';
                  e.target.style.boxShadow = '0 0 0 3px rgba(37,99,235,0.1)';
                }}
                onBlur={(e) => {
                  const type = validation?.type;
                  e.target.style.borderColor = type === 'error' ? '#FCA5A5' : type === 'success' ? '#86EFAC' : '#E5E7EB';
                  e.target.style.boxShadow = 'none';
                }}
              />
              {/* Char counter */}
              <span style={{
                position: 'absolute', bottom: 10, right: 12,
                fontSize: 11, color: charCountColor,
                background: '#F9FAFB', padding: '1px 6px', borderRadius: 4,
                fontWeight: charCount > MAX_CHARS * 0.9 ? 600 : 400,
              }}>
                {charCount.toLocaleString()} / {MAX_CHARS.toLocaleString()}
              </span>
            </div>

            {/* Suggestion Box */}
            <SuggestionBox validation={validation} />

            {/* Analyze Button */}
            <button
              onClick={handleTextAnalysis}
              disabled={!canSubmit}
              style={{
                width: '100%',
                marginTop: 14,
                padding: '13px 24px',
                borderRadius: 14,
                border: 'none',
                background: canSubmit
                  ? 'linear-gradient(135deg, #1E40AF 0%, #2563EB 100%)'
                  : '#CBD5E1',
                color: 'white',
                fontSize: 15,
                fontWeight: 600,
                cursor: canSubmit ? 'pointer' : 'not-allowed',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 10,
                transition: 'all 0.2s ease',
                boxShadow: canSubmit ? '0 4px 14px rgba(37,99,235,0.35)' : 'none',
              }}
              onMouseEnter={(e) => { if (canSubmit) e.currentTarget.style.transform = 'translateY(-1px)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; }}
              onMouseDown={(e) => { if (canSubmit) e.currentTarget.style.transform = 'scale(0.98)'; }}
              onMouseUp={(e) => { e.currentTarget.style.transform = 'scale(1)'; }}
            >
              {analyzing ? (
                <>
                  <div style={{
                    width: 18, height: 18,
                    border: '2.5px solid rgba(255,255,255,0.3)',
                    borderTopColor: 'white',
                    borderRadius: '50%',
                    animation: 'spin 0.8s linear infinite',
                  }} />
                  Đang phân tích...
                </>
              ) : (
                <>
                  <Search className="w-5 h-5" />
                  Phân tích ngay
                </>
              )}
            </button>

            {/* Disabled reason hint */}
            {!canSubmit && !analyzing && textInput.length > 0 && validation?.type === 'error' && (
              <p style={{ textAlign: 'center', fontSize: 12, color: '#DC2626', marginTop: 8 }}>
                Vui lòng sửa nội dung trước khi phân tích
              </p>
            )}
            {!canSubmit && !analyzing && textInput.trim().length > 0 && textInput.trim().length < MIN_CHARS && (
              <p style={{ textAlign: 'center', fontSize: 12, color: '#D97706', marginTop: 8 }}>
                Cần thêm {MIN_CHARS - textInput.trim().length} ký tự nữa để phân tích
              </p>
            )}
          </div>

          {/* Loading State */}
          {analyzing && (
            <div style={{
              marginTop: 24, background: 'white', borderRadius: 20,
              padding: '36px 20px', textAlign: 'center',
              boxShadow: '0 4px 24px rgba(0,0,0,0.04)',
              animation: 'fadeIn 0.3s ease',
            }}>
              <div style={{
                width: 64, height: 64, margin: '0 auto 16px',
                background: 'linear-gradient(135deg,#EFF6FF,#DBEAFE)',
                borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
                animation: 'pulse 1.5s ease-in-out infinite',
              }}>
                <Brain className="w-8 h-8" style={{ color: '#2563EB' }} />
              </div>
              <p style={{ fontSize: 16, fontWeight: 600, color: '#374151', marginBottom: 4 }}>
                AI đang phân tích nội dung...
              </p>
              <p style={{ fontSize: 13, color: '#9CA3AF' }}>Vui lòng chờ trong giây lát</p>
            </div>
          )}

          {/* Result */}
          {result && !analyzing && (
            <div style={{ marginTop: 24, animation: 'slideUp 0.4s ease' }}>
              {/* Verdict Card */}
              <div style={{
                background: isFake
                  ? 'linear-gradient(135deg,#FEF2F2,#FEE2E2)'
                  : 'linear-gradient(135deg,#F0FDF4,#DCFCE7)',
                borderRadius: 20,
                padding: '28px 20px',
                border: `1.5px solid ${isFake ? 'rgba(220,38,38,0.2)' : 'rgba(22,163,74,0.2)'}`,
                textAlign: 'center',
                position: 'relative',
                overflow: 'hidden',
              }}>
                <div style={{
                  position: 'absolute', top: -30, right: -30,
                  width: 100, height: 100, borderRadius: '50%',
                  background: isFake ? 'rgba(220,38,38,0.06)' : 'rgba(22,163,74,0.06)',
                }} />

                <div style={{
                  width: 72, height: 72, margin: '0 auto 14px',
                  borderRadius: '50%',
                  background: isFake ? '#FEE2E2' : '#DCFCE7',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  boxShadow: isFake ? '0 8px 24px rgba(220,38,38,0.15)' : '0 8px 24px rgba(22,163,74,0.15)',
                }}>
                  {isFake
                    ? <ShieldAlert className="w-9 h-9" style={{ color: '#DC2626' }} />
                    : <CheckCircle2 className="w-9 h-9" style={{ color: '#16A34A' }} />}
                </div>

                <h2 style={{
                  fontSize: 26, fontWeight: 800,
                  color: isFake ? '#DC2626' : '#16A34A',
                  marginBottom: 6, letterSpacing: '0.5px',
                }}>
                  {isFake ? 'TIN GIẢ' : 'TIN THẬT'}
                </h2>

                <p style={{ fontSize: 15, fontWeight: 600, color: isFake ? 'rgba(220,38,38,0.8)' : 'rgba(22,163,74,0.8)', marginBottom: 16 }}>
                  Độ tin cậy: {result.confidence_score}%
                </p>

                {/* Confidence Bar */}
                <div style={{
                  height: 10, borderRadius: 5,
                  background: isFake ? 'rgba(220,38,38,0.12)' : 'rgba(22,163,74,0.12)',
                  overflow: 'hidden', maxWidth: 360, margin: '0 auto',
                }}>
                  <div style={{
                    height: '100%',
                    width: `${result.confidence_score}%`,
                    borderRadius: 5,
                    background: isFake
                      ? 'linear-gradient(90deg,#EF4444,#DC2626)'
                      : 'linear-gradient(90deg,#22C55E,#16A34A)',
                    transition: 'width 0.8s ease',
                  }} />
                </div>
              </div>

              {/* Explanation Card */}
              {result.detailed_explanation && (
                <div style={{
                  background: 'white', borderRadius: 16,
                  padding: '20px', marginTop: 14,
                  boxShadow: '0 2px 12px rgba(0,0,0,0.04)',
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
                    <Lightbulb className="w-5 h-5" style={{ color: '#2563EB' }} />
                    <h3 style={{ fontSize: 15, fontWeight: 700, color: '#111827' }}>Giải thích</h3>
                  </div>
                  <p style={{ fontSize: 14, color: '#374151', lineHeight: 1.7 }}>
                    {result.detailed_explanation}
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes pulse {
          0%, 100% { transform: scale(1); opacity: 1; }
          50% { transform: scale(1.05); opacity: 0.7; }
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(8px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(16px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </>
  );
};

export default CheckerPage;
