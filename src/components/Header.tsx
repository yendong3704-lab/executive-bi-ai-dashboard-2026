import React from 'react';
import { 
  BarChart3, 
  Sparkles, 
  Key, 
  Printer, 
  Sun, 
  Moon, 
  Tv, 
  Building2, 
  CheckCircle2, 
  Cpu
} from 'lucide-react';
import { ScenarioTab, GeminiModelId } from '../types/dashboard';

interface HeaderProps {
  currentTab: ScenarioTab;
  onTabChange: (tab: ScenarioTab) => void;
  isDark: boolean;
  onToggleTheme: () => void;
  onOpenAPIModal: () => void;
  apiKey: string;
  selectedModel: GeminiModelId;
  onPrint: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentTab,
  onTabChange,
  isDark,
  onToggleTheme,
  onOpenAPIModal,
  apiKey,
  selectedModel,
  onPrint
}) => {
  const hasKey = Boolean(apiKey && apiKey.trim().length > 5);

  return (
    <header className="sticky top-0 z-40 w-full backdrop-blur-md bg-white/85 dark:bg-slate-900/85 border-b border-slate-200 dark:border-slate-800 shadow-sm transition-colors duration-200">
      <div className="max-w-[1720px] mx-auto px-4 sm:px-6 lg:px-8 py-3.5">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          
          {/* Logo & Title */}
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-[#1B365D] to-[#008080] flex items-center justify-center text-white shadow-md shadow-navy-900/15 ring-2 ring-teal-500/30">
              <BarChart3 className="w-6 h-6 text-teal-200" />
            </div>
            <div>
              <div className="flex items-center gap-2.5 flex-wrap">
                <h1 className="text-lg sm:text-xl font-extrabold tracking-tight text-[#1B365D] dark:text-white uppercase">
                  Hệ Thống Dashboard Báo Cáo & Tham Mưu Điều Hành Thông Minh 2026
                </h1>
                <span className="px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wider rounded-full bg-teal-500/10 text-teal-700 dark:text-teal-300 border border-teal-500/20">
                  Executive BI & AI Insights
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 flex items-center gap-2">
                <span>Giảng viên hướng dẫn: <strong className="text-slate-700 dark:text-slate-200">Nhà báo Đặng Sinh</strong></span>
                <span className="text-slate-300 dark:text-slate-600">•</span>
                <span className="inline-flex items-center gap-1 text-teal-600 dark:text-teal-400">
                  <Sparkles className="w-3 h-3" /> Chuẩn MECE 2026
                </span>
              </p>
            </div>
          </div>

          {/* Center Tabs: Scenario Switcher */}
          <div className="flex items-center p-1 bg-slate-100 dark:bg-slate-800/80 rounded-xl border border-slate-200 dark:border-slate-700/60 self-start lg:self-center shadow-inner">
            <button
              onClick={() => onTabChange('media')}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200 ${
                currentTab === 'media'
                  ? 'bg-gradient-to-r from-[#1B365D] to-[#008080] text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Tv className="w-4 h-4" />
              <span>Dashboard Báo chí Đa nền tảng</span>
            </button>
            <button
              onClick={() => onTabChange('admin')}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200 ${
                currentTab === 'admin'
                  ? 'bg-gradient-to-r from-[#1B365D] to-[#008080] text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Building2 className="w-4 h-4" />
              <span>Dashboard Hành chính & Dự án</span>
            </button>
          </div>

          {/* Right Action Tools */}
          <div className="flex items-center gap-2.5 self-end lg:self-center">
            
            {/* API Key & Model Config Button */}
            <button
              onClick={onOpenAPIModal}
              title="Cài đặt API Key & Mô hình AI"
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium border transition-all duration-150 ${
                hasKey
                  ? 'bg-teal-50 dark:bg-teal-950/40 text-teal-700 dark:text-teal-300 border-teal-200 dark:border-teal-800 hover:bg-teal-100 dark:hover:bg-teal-900/40'
                  : 'bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-800 hover:bg-amber-100 dark:hover:bg-amber-900/40'
              }`}
            >
              <Key className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">
                {hasKey ? 'Gemini AI Sẵn sàng' : 'Cài đặt API Key'}
              </span>
              <span className="inline-flex items-center px-1.5 py-0.2 rounded text-[10px] font-mono font-semibold bg-white/70 dark:bg-slate-800/80 border border-slate-200/50 dark:border-slate-700/50">
                <Cpu className="w-2.5 h-2.5 mr-1 text-teal-600 dark:text-teal-400" />
                {selectedModel.replace('gemini-', '')}
              </span>
              {hasKey && <CheckCircle2 className="w-3 h-3 text-emerald-500" />}
            </button>

            {/* Print / Export PDF A4 */}
            <button
              onClick={onPrint}
              title="Xuất Bản in / PDF A4 Chuẩn Báo Cáo"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors shadow-xs"
            >
              <Printer className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400" />
              <span className="hidden sm:inline">Bản in / PDF</span>
            </button>

            {/* Light / Dark Mode Toggle */}
            <button
              onClick={onToggleTheme}
              title={isDark ? 'Chuyển sang chế độ Sáng' : 'Chuyển sang chế độ Tối'}
              aria-label="Toggle theme"
              className="p-1.5 rounded-lg text-slate-600 dark:text-slate-300 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors shadow-xs"
            >
              {isDark ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-600" />}
            </button>

          </div>
        </div>
      </div>
    </header>
  );
};
