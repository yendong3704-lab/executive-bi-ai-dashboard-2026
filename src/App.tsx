import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import { 
  MediaRecord, 
  AdminRecord, 
  FilterState, 
  MECEInsight, 
  GeminiModelId, 
  ScenarioTab 
} from './types/dashboard';
import { 
  SAMPLE_MEDIA_DATA, 
  SAMPLE_ADMIN_DATA, 
  DEFAULT_MECE_MEDIA, 
  DEFAULT_MECE_ADMIN 
} from './data/sampleData';
import { Header } from './components/Header';
import { FilterBar } from './components/FilterBar';
import { KPICards } from './components/KPICards';
import { ChartsSection } from './components/ChartsSection';
import { MECEAdvisoryCard } from './components/MECEAdvisoryCard';
import { DataTable } from './components/DataTable';
import { APIKeyModal } from './components/APIKeyModal';
import { parseExcelFile, exportToExcel } from './utils/excelParser';
import { 
  generateMECEAdvisory, 
  aggregateMediaData, 
  aggregateAdminData 
} from './utils/geminiService';
import { Sparkles, CheckCircle2, AlertTriangle, Layers, BookOpen } from 'lucide-react';

export default function App() {
  // Theme state
  const [isDark, setIsDark] = useState<boolean>(() => {
    return localStorage.getItem('theme') === 'dark' || 
      window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  // Active Tab Scenario
  const [currentTab, setCurrentTab] = useState<ScenarioTab>('media');

  // Datasets
  const [mediaRecords, setMediaRecords] = useState<MediaRecord[]>(SAMPLE_MEDIA_DATA);
  const [adminRecords, setAdminRecords] = useState<AdminRecord[]>(SAMPLE_ADMIN_DATA);

  // Filters
  const [filter, setFilter] = useState<FilterState>({
    thang: 'Tất cả',
    banHoacPhongBan: 'Tất cả',
    nenTang: 'Tất cả',
    mucDoAI: 'Tất cả',
    trangThaiKPI: 'Tất cả',
    searchQuery: ''
  });

  // AI & Advisory State
  const [apiKey, setApiKey] = useState<string>(() => {
    return localStorage.getItem('gemini_api_key') || (import.meta.env.VITE_GEMINI_API_KEY as string) || '';
  });
  const [selectedModel, setSelectedModel] = useState<GeminiModelId>(() => {
    return (localStorage.getItem('gemini_model') as GeminiModelId) || 'gemini-3.8-flash';
  });
  const [modelUsed, setModelUsed] = useState<string>('gemini-3.8-flash');
  const [tokensEstimated, setTokensEstimated] = useState<number>(() => {
    const saved = localStorage.getItem('gemini_tokens_used');
    return saved ? parseInt(saved, 10) : 1850;
  });
  const [meceInsight, setMeceInsight] = useState<MECEInsight>(DEFAULT_MECE_MEDIA);
  const [isAILoading, setIsAILoading] = useState<boolean>(false);
  const [aiProgressMsg, setAiProgressMsg] = useState<string>('');

  // Modals & Loaders
  const [isAPIModalOpen, setIsAPIModalOpen] = useState<boolean>(false);
  const [isParsingExcel, setIsParsingExcel] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Apply Theme to documentElement
  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDark]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Distinct Filter Options
  const availableMonths = useMemo(() => {
    const set = new Set<string>();
    if (currentTab === 'media') {
      mediaRecords.forEach(r => r.thang && set.add(r.thang));
    } else {
      adminRecords.forEach(r => r.thang && set.add(r.thang));
    }
    return Array.from(set).sort();
  }, [currentTab, mediaRecords, adminRecords]);

  const availableUnits = useMemo(() => {
    const set = new Set<string>();
    if (currentTab === 'media') {
      mediaRecords.forEach(r => r.banChuyenMon && set.add(r.banChuyenMon));
    } else {
      adminRecords.forEach(r => r.phongBan && set.add(r.phongBan));
    }
    return Array.from(set).sort();
  }, [currentTab, mediaRecords, adminRecords]);

  const availablePlatformsOrMethods = useMemo(() => {
    const set = new Set<string>();
    if (currentTab === 'media') {
      mediaRecords.forEach(r => r.nenTang && set.add(r.nenTang));
    } else {
      adminRecords.forEach(r => r.phuongThucXuLy && set.add(r.phuongThucXuLy));
    }
    return Array.from(set).sort();
  }, [currentTab, mediaRecords, adminRecords]);

  const availableAILevels = useMemo(() => {
    const set = new Set<string>();
    mediaRecords.forEach(r => r.mucDoAI && set.add(r.mucDoAI));
    return Array.from(set).sort();
  }, [mediaRecords]);

  const availableStatuses = useMemo(() => {
    if (currentTab === 'media') {
      return ['Vượt KPI', 'Đạt KPI', 'Chưa đạt KPI'];
    }
    return ['An toàn / Tốt', 'Rủi ro Trung bình', 'Rủi ro Cao (Cần xử lý)'];
  }, [currentTab]);

  // Filtering Logic
  const filteredMedia = useMemo(() => {
    return mediaRecords.filter(r => {
      if (filter.thang !== 'Tất cả' && r.thang !== filter.thang) return false;
      if (filter.banHoacPhongBan !== 'Tất cả' && r.banChuyenMon !== filter.banHoacPhongBan) return false;
      if (filter.nenTang !== 'Tất cả' && r.nenTang !== filter.nenTang) return false;
      if (filter.mucDoAI !== 'Tất cả' && r.mucDoAI !== filter.mucDoAI) return false;
      if (filter.trangThaiKPI !== 'Tất cả' && r.kpiStatus !== filter.trangThaiKPI) return false;
      if (filter.searchQuery.trim()) {
        const q = filter.searchQuery.toLowerCase();
        const str = `${r.maSP} ${r.chuyenMuc} ${r.tacGia} ${r.banChuyenMon} ${r.nenTang} ${r.dinhDang}`.toLowerCase();
        if (!str.includes(q)) return false;
      }
      return true;
    });
  }, [mediaRecords, filter]);

  const filteredAdmin = useMemo(() => {
    return adminRecords.filter(r => {
      if (filter.thang !== 'Tất cả' && r.thang !== filter.thang) return false;
      if (filter.banHoacPhongBan !== 'Tất cả' && r.phongBan !== filter.banHoacPhongBan) return false;
      if (filter.nenTang !== 'Tất cả' && r.phuongThucXuLy !== filter.nenTang) return false;
      if (filter.trangThaiKPI !== 'Tất cả' && r.capDoRuiRo !== filter.trangThaiKPI) return false;
      if (filter.searchQuery.trim()) {
        const q = filter.searchQuery.toLowerCase();
        const str = `${r.maNV} ${r.nhomNghiepVu} ${r.canBo} ${r.phongBan} ${r.phuongThucXuLy}`.toLowerCase();
        if (!str.includes(q)) return false;
      }
      return true;
    });
  }, [adminRecords, filter]);

  // AI Advisory Refresh Handler
  const handleTriggerAI = useCallback(async () => {
    setIsAILoading(true);
    setAiProgressMsg('Đang tổng hợp số liệu đã lọc...');

    try {
      let aggregatedData: any = null;
      const filterDesc = `Tab: ${currentTab === 'media' ? 'Báo chí Đa nền tảng' : 'Hành chính Dự án'} | Tháng: ${filter.thang} | Đơn vị: ${filter.banHoacPhongBan}`;

      if (currentTab === 'media') {
        aggregatedData = aggregateMediaData(filteredMedia, filterDesc);
      } else {
        aggregatedData = aggregateAdminData(filteredAdmin, filterDesc);
      }

      setAiProgressMsg(`Đang kích hoạt ${selectedModel} để phân tích MECE...`);

      const result = await generateMECEAdvisory(
        currentTab,
        aggregatedData,
        apiKey,
        selectedModel,
        (msg) => setAiProgressMsg(msg)
      );

      setMeceInsight(result.insight);
      setModelUsed(result.modelUsed);
      if (result.tokensEstimated > 0) {
        const newTotal = tokensEstimated + result.tokensEstimated;
        setTokensEstimated(newTotal);
        localStorage.setItem('gemini_tokens_used', String(newTotal));
      }

      showToast(`Đã cập nhật Báo cáo Tham mưu AI (${result.modelUsed})`);
    } catch (err: any) {
      console.error('AI Advisory generation error:', err);
      showToast('Đã chuyển sang Tham mưu Mẫu do giới hạn kết nối');
    } finally {
      setIsAILoading(false);
    }
  }, [currentTab, filteredMedia, filteredAdmin, filter, apiKey, selectedModel, tokensEstimated]);

  // Tab switch effect: switch default advisory if no custom call yet
  useEffect(() => {
    if (currentTab === 'media') {
      setMeceInsight(DEFAULT_MECE_MEDIA);
      setModelUsed('gemini-3.8-flash (Chuẩn Báo chí)');
    } else {
      setMeceInsight(DEFAULT_MECE_ADMIN);
      setModelUsed('gemini-3.8-flash (Chuẩn Hành chính)');
    }
    // Reset filters on tab switch
    setFilter({
      thang: 'Tất cả',
      banHoacPhongBan: 'Tất cả',
      nenTang: 'Tất cả',
      mucDoAI: 'Tất cả',
      trangThaiKPI: 'Tất cả',
      searchQuery: ''
    });
  }, [currentTab]);

  // Load Sample Data (Amber Button)
  const handleLoadSampleData = () => {
    setMediaRecords(SAMPLE_MEDIA_DATA);
    setAdminRecords(SAMPLE_ADMIN_DATA);
    setFilter({
      thang: 'Tất cả',
      banHoacPhongBan: 'Tất cả',
      nenTang: 'Tất cả',
      mucDoAI: 'Tất cả',
      trangThaiKPI: 'Tất cả',
      searchQuery: ''
    });
    setMeceInsight(currentTab === 'media' ? DEFAULT_MECE_MEDIA : DEFAULT_MECE_ADMIN);

    // Trigger celebration confetti
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 }
      });
    } catch (e) {
      // ignore
    }

    showToast('⚡ Đã nạp thành công 501 bản ghi Đa nền tảng & 181 bản ghi Hành chính H1/2026!');
  };

  // Upload Excel File Handler
  const handleFileUpload = async (file: File) => {
    setIsParsingExcel(true);
    try {
      const buffer = await file.arrayBuffer();
      const result = parseExcelFile(buffer);

      if (result.mediaRecords.length > 0) {
        setMediaRecords(result.mediaRecords);
      }
      if (result.adminRecords.length > 0) {
        setAdminRecords(result.adminRecords);
      }

      showToast(`Đã đọc thành công ${result.mediaRecords.length} SP Đa nền tảng & ${result.adminRecords.length} nhiệm vụ Hành chính từ ${file.name}!`);
    } catch (err: any) {
      console.error('File parsing error:', err);
      alert('Không thể đọc file Excel. Vui lòng kiểm tra định dạng file bài tập!');
    } finally {
      setIsParsingExcel(false);
    }
  };

  // Export Excel Handler
  const handleExportExcel = () => {
    exportToExcel(
      filteredMedia,
      filteredAdmin,
      currentTab,
      `Bao_Cao_${currentTab === 'media' ? 'Da_Nen_Tang' : 'Hanh_Chinh'}_${new Date().toISOString().split('T')[0]}.xlsx`
    );
    showToast('Đã xuất file Excel (.xlsx) thành công!');
  };

  // Save API Key
  const handleSaveApiKey = (newKey: string) => {
    setApiKey(newKey);
    localStorage.setItem('gemini_api_key', newKey);
    showToast(newKey ? 'Đã lưu Gemini API Key!' : 'Đã xóa API Key');
  };

  // Select Model
  const handleSelectModel = (model: GeminiModelId) => {
    setSelectedModel(model);
    localStorage.setItem('gemini_model', model);
    showToast(`Đã chuyển sang mô hình ${model}`);
  };

  // Print Handler
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col font-sans transition-colors duration-200">
      
      {/* Toast Notification */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            className="fixed top-20 right-6 z-50 px-4 py-2.5 rounded-xl bg-[#1B365D] text-white text-xs font-semibold shadow-2xl border border-teal-500/40 flex items-center gap-2"
          >
            <Sparkles className="w-4 h-4 text-teal-400" />
            <span>{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header */}
      <Header
        currentTab={currentTab}
        onTabChange={setCurrentTab}
        isDark={isDark}
        onToggleTheme={() => setIsDark(!isDark)}
        onOpenAPIModal={() => setIsAPIModalOpen(true)}
        apiKey={apiKey}
        selectedModel={selectedModel}
        onPrint={handlePrint}
      />

      {/* Filter Bar */}
      <div className="no-print">
        <FilterBar
          currentTab={currentTab}
          filter={filter}
          onFilterChange={setFilter}
          onLoadSampleData={handleLoadSampleData}
          onFileUpload={handleFileUpload}
          onExportExcel={handleExportExcel}
          totalCount={currentTab === 'media' ? mediaRecords.length : adminRecords.length}
          filteredCount={currentTab === 'media' ? filteredMedia.length : filteredAdmin.length}
          availableMonths={availableMonths}
          availableUnits={availableUnits}
          availablePlatformsOrMethods={availablePlatformsOrMethods}
          availableAILevels={availableAILevels}
          availableStatuses={availableStatuses}
          isParsingExcel={isParsingExcel}
        />
      </div>

      {/* Main Executive Bento Dashboard */}
      <main className="flex-1 max-w-[1720px] w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        
        {/* Scenario Header Info Banner */}
        <motion.div 
          key={currentTab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-2xl bg-gradient-to-r from-teal-500/10 via-navy-800/5 to-amber-500/10 dark:from-teal-950/30 dark:via-slate-900/40 dark:to-amber-950/20 border border-teal-500/20 dark:border-teal-800/40"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-teal-600 text-white flex items-center justify-center font-bold shadow-sm">
              {currentTab === 'media' ? '📺' : '🏢'}
            </div>
            <div>
              <h2 className="text-sm sm:text-base font-extrabold text-[#1B365D] dark:text-white uppercase tracking-tight flex items-center gap-2">
                <span>{currentTab === 'media' ? 'Báo Cáo Hiệu Suất Truyền Thông Đa Nền Tảng (6T/2026)' : 'Theo Dõi Tiến Độ Dự Án, Giải Ngân & Hồ Sơ Hành Chính (6T/2026)'}</span>
                <span className="text-[10px] px-2 py-0.5 rounded-full font-bold bg-teal-500/20 text-teal-800 dark:text-teal-300">
                  {currentTab === 'media' ? '501 Bản Ghi Chuẩn' : '181 Bản Ghi Chuẩn'}
                </span>
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                {currentTab === 'media'
                  ? 'Phân tích đa chiều: Views, ER%, Retention, Chi phí sản xuất, Doanh thu quảng cáo, ROI% và Đòn bẩy AI'
                  : 'Phân tích vận hành: SLA đúng hạn, Ngân sách duyệt, Tỷ lệ giải ngân, Giờ công tiêu hao và Cảnh báo rủi ro'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 self-end sm:self-center">
            <button
              onClick={handleTriggerAI}
              disabled={isAILoading}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-teal-600 to-[#1B365D] hover:from-teal-700 hover:to-[#162e4f] shadow-md shadow-teal-700/20 hover:shadow-glow-teal active:scale-95 transition-all"
            >
              <Sparkles className="w-4 h-4 text-teal-300 animate-pulse" />
              <span>{isAILoading ? 'AI Đang Tham Mưu...' : '✨ AI Tham mưu Điều hành (MECE)'}</span>
            </button>
          </div>
        </motion.div>

        {/* TẦNG 1: 4-6 Thẻ KPI Cards */}
        <motion.section 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          aria-label="KPI Cards Overview"
        >
          <KPICards
            currentTab={currentTab}
            mediaRecords={filteredMedia}
            adminRecords={filteredAdmin}
            allMediaRecords={mediaRecords}
            allAdminRecords={adminRecords}
          />
        </motion.section>

        {/* TẦNG 2: Khối 3 Biểu đồ Recharts */}
        <motion.section 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
          aria-label="Interactive Visualizations"
        >
          <ChartsSection
            currentTab={currentTab}
            mediaRecords={filteredMedia}
            adminRecords={filteredAdmin}
            isDark={isDark}
          />
        </motion.section>

        {/* TẦNG 3: Báo cáo Tham Mưu AI Chuẩn MECE & Bảng Danh Sách Top 5 / Nhiệm Vụ */}
        <motion.section 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.3 }}
          className="grid grid-cols-1 lg:grid-cols-12 gap-5"
          aria-label="MECE Insights and Data Details"
        >
          {/* AI MECE Advisory Card */}
          <div className="lg:col-span-6">
            <MECEAdvisoryCard
              insight={meceInsight}
              isLoading={isAILoading}
              progressMsg={aiProgressMsg}
              onRefresh={handleTriggerAI}
              selectedModel={selectedModel}
              modelUsed={modelUsed}
              onExportExcel={handleExportExcel}
              scenarioTitle={currentTab === 'media' ? 'Báo chí Đa nền tảng' : 'Quản trị Hành chính & Dự án'}
            />
          </div>

          {/* Top 5 / Detailed Table */}
          <div className="lg:col-span-6">
            <DataTable
              currentTab={currentTab}
              mediaRecords={filteredMedia}
              adminRecords={filteredAdmin}
            />
          </div>
        </motion.section>

      </main>

      {/* Footer */}
      <footer className="w-full border-t border-slate-200 dark:border-slate-800 bg-white/70 dark:bg-slate-900/70 py-4 px-4 sm:px-6 lg:px-8 mt-10 transition-colors">
        <div className="max-w-[1720px] mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500 dark:text-slate-400">
          <div className="flex items-center gap-2">
            <span className="font-bold text-[#1B365D] dark:text-white">Executive BI & AI Insights Dashboard 2026</span>
            <span>•</span>
            <span>Phục vụ công tác giảng dạy & thực hành của <strong>Nhà báo Đặng Sinh</strong></span>
          </div>
          <div className="flex items-center gap-3">
            <span className="inline-flex items-center gap-1 text-teal-600 dark:text-teal-400">
              <CheckCircle2 className="w-3.5 h-3.5" /> Chuẩn MECE & Bento Grid
            </span>
            <span>•</span>
            <span>Tích hợp Google Gemini (@google/genai)</span>
          </div>
        </div>
      </footer>

      {/* API Key Modal */}
      <APIKeyModal
        isOpen={isAPIModalOpen}
        onClose={() => setIsAPIModalOpen(false)}
        apiKey={apiKey}
        onSaveApiKey={handleSaveApiKey}
        selectedModel={selectedModel}
        onSelectModel={handleSelectModel}
        tokensEstimated={tokensEstimated}
      />

    </div>
  );
}
