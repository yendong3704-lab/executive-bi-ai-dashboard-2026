import React, { useState } from 'react';
import { 
  Key, 
  Cpu, 
  CheckCircle, 
  AlertCircle, 
  ExternalLink, 
  X, 
  ShieldCheck, 
  Trash2,
  Sparkles,
  Zap
} from 'lucide-react';
import { GeminiModelId } from '../types/dashboard';

interface APIKeyModalProps {
  isOpen: boolean;
  onClose: () => void;
  apiKey: string;
  onSaveApiKey: (key: string) => void;
  selectedModel: GeminiModelId;
  onSelectModel: (model: GeminiModelId) => void;
  tokensEstimated: number;
}

export const APIKeyModal: React.FC<APIKeyModalProps> = ({
  isOpen,
  onClose,
  apiKey,
  onSaveApiKey,
  selectedModel,
  onSelectModel,
  tokensEstimated
}) => {
  const [inputKey, setInputKey] = useState(apiKey);
  const [saveSuccess, setSaveSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSave = () => {
    onSaveApiKey(inputKey.trim());
    setSaveSuccess(true);
    setTimeout(() => {
      setSaveSuccess(false);
      onClose();
    }, 800);
  };

  const handleClear = () => {
    setInputKey('');
    onSaveApiKey('');
  };

  const models: Array<{ id: GeminiModelId; name: string; desc: string; tag: string }> = [
    {
      id: 'gemini-3.8-flash',
      name: 'Gemini 3.8 Flash (Khuyên Dùng Mặc Định)',
      desc: 'Cân bằng hoàn hảo giữa tốc độ phản hồi và năng lực phân tích báo cáo MECE chuyên sâu.',
      tag: 'Chuẩn Điều Hành'
    },
    {
      id: 'gemini-4-argon',
      name: 'Gemini 4 Argon (Chiến Lược Sâu Nhất)',
      desc: 'Mô hình mạnh nhất cho suy luận logic phức tạp, bóc tách điểm nghẽn và hoạch định giải pháp dài hạn.',
      tag: 'Deep Reasoning'
    },
    {
      id: 'gemini-3.5-flash-lite',
      name: 'Gemini 3.5 Flash-Lite (Tốc Độ Siêu Nhanh)',
      desc: 'Tối ưu chi phí Token tối đa, phản hồi tức thì cho các tác vụ phân loại và tóm tắt nhanh.',
      tag: 'Fast & Low Cost'
    },
    {
      id: 'gemini-3.1-flash-lite',
      name: 'Gemini 3.1 Flash-Lite (Dự Phòng Nhẹ)',
      desc: 'Mô hình dự phòng ổn định khi gặp giới hạn tải 429 hoặc kết nối băng thông thấp.',
      tag: 'Fallback Safe'
    }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-xl bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden flex flex-col">
        
        {/* Header */}
        <div className="p-5 bg-gradient-to-r from-[#1B365D] to-[#008080] text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-white/10 backdrop-blur-md">
              <Key className="w-5 h-5 text-teal-300" />
            </div>
            <div>
              <h3 className="text-base font-bold">Cài Đặt API Key & Mô Hình AI</h3>
              <p className="text-xs text-teal-100/80">Cấu hình kết nối Google Gemini API an toàn chuẩn bảo mật</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-white/80 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-5 overflow-y-auto max-h-[80vh] text-xs">
          
          {/* Security Guarantee Note */}
          <div className="p-3.5 rounded-2xl bg-teal-50 dark:bg-teal-950/40 border border-teal-200 dark:border-teal-800/80 text-teal-900 dark:text-teal-200 flex items-start gap-2.5">
            <ShieldCheck className="w-5 h-5 text-teal-600 dark:text-teal-400 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <strong className="font-bold block">Bảo mật API Key tuyệt đối trên trình duyệt</strong>
              <p className="text-[11px] leading-relaxed text-teal-800 dark:text-teal-300">
                Mã API Key được lưu trực tiếp trong <code className="bg-teal-200/50 dark:bg-teal-900/50 px-1 py-0.2 rounded font-mono">localStorage</code> của máy tính bạn hoặc đọc từ biến môi trường. Hệ thống không gửi hay lưu trữ key trên bất kỳ máy chủ trung gian nào.
              </p>
            </div>
          </div>

          {/* API Key Input */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="font-bold text-slate-800 dark:text-slate-200">
                Google Gemini API Key
              </label>
              <a
                href="https://aistudio.google.com/app/apikey"
                target="_blank"
                rel="noreferrer"
                className="text-teal-600 dark:text-teal-400 hover:underline flex items-center gap-1 font-semibold text-[11px]"
              >
                <span>Lấy API Key miễn phí tại Google AI Studio</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>

            <div className="relative">
              <input
                type="password"
                placeholder="AIzaSy..."
                value={inputKey}
                onChange={(e) => setInputKey(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/80 text-slate-900 dark:text-slate-100 font-mono text-xs focus:outline-none focus:ring-2 focus:ring-teal-500/50 focus:border-teal-500"
              />
              {inputKey && (
                <button
                  onClick={handleClear}
                  className="absolute right-2.5 top-2.5 text-slate-400 hover:text-red-500"
                  title="Xóa Key"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
            </div>

            {!inputKey && (
              <p className="text-[11px] text-amber-600 dark:text-amber-400 flex items-center gap-1">
                <AlertCircle className="w-3.5 h-3.5" />
                Nếu để trống, Dashboard vẫn hoạt động 100% với bản Tham Mưu Chuyên Gia Mẫu tích hợp sẵn!
              </p>
            )}
          </div>

          {/* Model Selection */}
          <div className="space-y-2.5">
            <label className="font-bold text-slate-800 dark:text-slate-200 block">
              Lựa Chọn Mô Hình Phân Tầng (Model Routing)
            </label>
            <div className="space-y-2">
              {models.map((m) => (
                <div
                  key={m.id}
                  onClick={() => onSelectModel(m.id)}
                  className={`p-3 rounded-xl border cursor-pointer transition-all ${
                    selectedModel === m.id
                      ? 'border-teal-500 bg-teal-50/50 dark:bg-teal-950/30 ring-1 ring-teal-500'
                      : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                      <Cpu className={`w-3.5 h-3.5 ${selectedModel === m.id ? 'text-teal-600' : 'text-slate-400'}`} />
                      {m.name}
                    </span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      selectedModel === m.id 
                        ? 'bg-teal-100 dark:bg-teal-900 text-teal-800 dark:text-teal-200' 
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-500'
                    }`}>
                      {m.tag}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed pl-5">
                    {m.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Token Counter & Cost Optimization */}
          <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/60 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4 text-amber-500" />
              <div>
                <span className="font-semibold text-slate-700 dark:text-slate-300 block">Ước tính Token Đã Tiêu Thụ</span>
                <span className="text-[10px] text-slate-400">Đã tối ưu 90% nhờ thuật toán Gom nhóm JSON Client-side</span>
              </div>
            </div>
            <span className="text-sm font-mono font-bold text-teal-600 dark:text-teal-400">
              ~{tokensEstimated.toLocaleString('vi-VN')} tokens
            </span>
          </div>

        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 dark:bg-slate-800/80 border-t border-slate-200 dark:border-slate-800 flex items-center justify-end gap-2.5">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
          >
            Đóng
          </button>
          <button
            onClick={handleSave}
            className="flex items-center gap-1.5 px-5 py-2 rounded-xl font-bold text-white bg-gradient-to-r from-teal-600 to-[#1B365D] hover:from-teal-700 hover:to-[#162e4f] active:scale-95 transition-all shadow-md"
          >
            {saveSuccess ? <CheckCircle className="w-4 h-4" /> : <Sparkles className="w-4 h-4" />}
            <span>{saveSuccess ? 'Đã Lưu Thành Công!' : 'Lưu Cài Đặt'}</span>
          </button>
        </div>

      </div>
    </div>
  );
};
