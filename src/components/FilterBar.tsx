import React, { useRef, useState } from 'react';
import { 
  UploadCloud, 
  Zap, 
  RotateCcw, 
  Search, 
  FileSpreadsheet, 
  Filter, 
  CheckCircle,
  FileCheck2,
  Calendar,
  Building,
  Layers,
  Sparkles,
  ShieldAlert
} from 'lucide-react';
import { FilterState, ScenarioTab } from '../types/dashboard';

interface FilterBarProps {
  currentTab: ScenarioTab;
  filter: FilterState;
  onFilterChange: (newFilter: FilterState) => void;
  onLoadSampleData: () => void;
  onFileUpload: (file: File) => void;
  onExportExcel: () => void;
  totalCount: number;
  filteredCount: number;
  availableMonths: string[];
  availableUnits: string[];
  availablePlatformsOrMethods: string[];
  availableAILevels: string[];
  availableStatuses: string[];
  isParsingExcel: boolean;
}

export const FilterBar: React.FC<FilterBarProps> = ({
  currentTab,
  filter,
  onFilterChange,
  onLoadSampleData,
  onFileUpload,
  onExportExcel,
  totalCount,
  filteredCount,
  availableMonths,
  availableUnits,
  availablePlatformsOrMethods,
  availableAILevels,
  availableStatuses,
  isParsingExcel
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragOver, setIsDragOver] = useState(false);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      if (file.name.endsWith('.xlsx') || file.name.endsWith('.xls')) {
        onFileUpload(file);
      } else {
        alert('Vui lòng chọn file Excel định dạng .xlsx hoặc .xls');
      }
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      onFileUpload(e.target.files[0]);
    }
  };

  const handleResetFilters = () => {
    onFilterChange({
      thang: 'Tất cả',
      banHoacPhongBan: 'Tất cả',
      nenTang: 'Tất cả',
      mucDoAI: 'Tất cả',
      trangThaiKPI: 'Tất cả',
      searchQuery: ''
    });
  };

  const isFiltered = 
    filter.thang !== 'Tất cả' ||
    filter.banHoacPhongBan !== 'Tất cả' ||
    filter.nenTang !== 'Tất cả' ||
    filter.mucDoAI !== 'Tất cả' ||
    filter.trangThaiKPI !== 'Tất cả' ||
    filter.searchQuery.trim() !== '';

  return (
    <div className="w-full bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 shadow-xs transition-colors">
      <div className="max-w-[1720px] mx-auto px-4 sm:px-6 lg:px-8 py-3.5 space-y-3">
        
        {/* Top Control Bar: Upload Drag & Drop + Load Sample Data + Export Excel */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
          
          {/* Drag & Drop Quick Area & File Upload */}
          <div className="flex items-center gap-3 flex-1">
            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`flex-1 flex items-center justify-between px-3.5 py-2 rounded-xl border-2 border-dashed cursor-pointer transition-all duration-200 ${
                isDragOver
                  ? 'border-teal-500 bg-teal-50/70 dark:bg-teal-950/40 text-teal-700 dark:text-teal-300 scale-[1.005]'
                  : 'border-slate-300 dark:border-slate-700 hover:border-teal-500/70 bg-slate-50/70 dark:bg-slate-800/50 text-slate-600 dark:text-slate-300'
              }`}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept=".xlsx, .xls"
                onChange={handleFileInputChange}
                className="hidden"
              />
              <div className="flex items-center gap-2.5 truncate">
                <UploadCloud className={`w-4 h-4 shrink-0 ${isParsingExcel ? 'animate-bounce text-teal-600' : 'text-slate-400 dark:text-slate-500'}`} />
                <span className="text-xs truncate font-medium">
                  {isParsingExcel 
                    ? 'Đang phân tích cấu trúc file Excel...' 
                    : 'Kéo thả file Excel (Bai_Tap_Thuc_Hanh_Dashboard_Bao_Cao_2026.xlsx) hoặc bấm để chọn'}
                </span>
              </div>
              <span className="hidden sm:inline-flex items-center gap-1 text-[11px] font-semibold text-teal-600 dark:text-teal-400 bg-teal-100/60 dark:bg-teal-900/40 px-2 py-0.5 rounded-md shrink-0">
                <FileCheck2 className="w-3 h-3" /> Auto Detect Sheets
              </span>
            </div>

            {/* Load Sample Data Button (Mandatory Amber Button) */}
            <button
              onClick={onLoadSampleData}
              title="Nạp ngay bộ dữ liệu mẫu chuẩn H1/2026 (501 bản ghi Đa nền tảng & 181 bản ghi Hành chính)"
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-700 hover:to-amber-600 active:scale-95 shadow-md shadow-amber-600/20 hover:shadow-glow-amber transition-all duration-200 shrink-0"
            >
              <Zap className="w-4 h-4 fill-white" />
              <span>⚡ Nạp dữ liệu thử nghiệm (Load Sample Data)</span>
            </button>
          </div>

          {/* Export Excel Button & Counter */}
          <div className="flex items-center gap-2.5 shrink-0 self-end md:self-center">
            <span className="text-xs text-slate-500 dark:text-slate-400 font-medium bg-slate-100 dark:bg-slate-800 px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700">
              Bản ghi: <strong className="text-teal-600 dark:text-teal-400">{filteredCount}</strong> / {totalCount}
            </span>

            <button
              onClick={onExportExcel}
              title="Xuất dữ liệu đã lọc ra file Excel (.xlsx)"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 hover:bg-emerald-100 dark:hover:bg-emerald-900/40 transition-colors"
            >
              <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
              <span>Xuất Excel (.xlsx)</span>
            </button>
          </div>

        </div>

        {/* Bottom Interactive Slicers Bar */}
        <div className="flex flex-wrap items-center gap-2.5 pt-1 border-t border-slate-100 dark:border-slate-800/80">
          
          <div className="flex items-center gap-1 text-slate-400 text-xs font-semibold uppercase tracking-wider mr-1">
            <Filter className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />
            <span className="hidden sm:inline">Bộ lọc:</span>
          </div>

          {/* 1. Month Filter */}
          <div className="flex items-center bg-slate-50 dark:bg-slate-800/90 rounded-lg border border-slate-200 dark:border-slate-700 px-2 py-1 text-xs">
            <Calendar className="w-3.5 h-3.5 text-slate-400 mr-1.5 shrink-0" />
            <select
              value={filter.thang}
              onChange={(e) => onFilterChange({ ...filter, thang: e.target.value })}
              className="bg-transparent border-none text-slate-700 dark:text-slate-200 focus:outline-none cursor-pointer pr-1"
            >
              <option value="Tất cả" className="bg-white dark:bg-slate-800">Tất cả Tháng (6T/2026)</option>
              {availableMonths.map((m) => (
                <option key={m} value={m} className="bg-white dark:bg-slate-800">{m}</option>
              ))}
            </select>
          </div>

          {/* 2. Department / Specialized Unit Filter */}
          <div className="flex items-center bg-slate-50 dark:bg-slate-800/90 rounded-lg border border-slate-200 dark:border-slate-700 px-2 py-1 text-xs">
            <Building className="w-3.5 h-3.5 text-slate-400 mr-1.5 shrink-0" />
            <select
              value={filter.banHoacPhongBan}
              onChange={(e) => onFilterChange({ ...filter, banHoacPhongBan: e.target.value })}
              className="bg-transparent border-none text-slate-700 dark:text-slate-200 focus:outline-none cursor-pointer pr-1 max-w-[190px] truncate"
            >
              <option value="Tất cả" className="bg-white dark:bg-slate-800">
                {currentTab === 'media' ? 'Tất cả Ban Chuyên môn' : 'Tất cả Phòng ban / Đơn vị'}
              </option>
              {availableUnits.map((u) => (
                <option key={u} value={u} className="bg-white dark:bg-slate-800">{u}</option>
              ))}
            </select>
          </div>

          {/* 3. Platform (Media) or Method (Admin) Filter */}
          <div className="flex items-center bg-slate-50 dark:bg-slate-800/90 rounded-lg border border-slate-200 dark:border-slate-700 px-2 py-1 text-xs">
            <Layers className="w-3.5 h-3.5 text-slate-400 mr-1.5 shrink-0" />
            <select
              value={filter.nenTang}
              onChange={(e) => onFilterChange({ ...filter, nenTang: e.target.value })}
              className="bg-transparent border-none text-slate-700 dark:text-slate-200 focus:outline-none cursor-pointer pr-1 max-w-[170px] truncate"
            >
              <option value="Tất cả" className="bg-white dark:bg-slate-800">
                {currentTab === 'media' ? 'Tất cả Nền tảng' : 'Tất cả Phương thức Số hóa'}
              </option>
              {availablePlatformsOrMethods.map((p) => (
                <option key={p} value={p} className="bg-white dark:bg-slate-800">{p}</option>
              ))}
            </select>
          </div>

          {/* 4. AI Application Level Filter */}
          <div className="flex items-center bg-slate-50 dark:bg-slate-800/90 rounded-lg border border-slate-200 dark:border-slate-700 px-2 py-1 text-xs">
            <Sparkles className="w-3.5 h-3.5 text-teal-500 mr-1.5 shrink-0" />
            <select
              value={filter.mucDoAI}
              onChange={(e) => onFilterChange({ ...filter, mucDoAI: e.target.value })}
              className="bg-transparent border-none text-slate-700 dark:text-slate-200 focus:outline-none cursor-pointer pr-1"
            >
              <option value="Tất cả" className="bg-white dark:bg-slate-800">Mức độ AI: Tất cả</option>
              {availableAILevels.map((lvl) => (
                <option key={lvl} value={lvl} className="bg-white dark:bg-slate-800">{lvl}</option>
              ))}
            </select>
          </div>

          {/* 5. KPI / Risk Status Filter */}
          <div className="flex items-center bg-slate-50 dark:bg-slate-800/90 rounded-lg border border-slate-200 dark:border-slate-700 px-2 py-1 text-xs">
            <ShieldAlert className="w-3.5 h-3.5 text-amber-500 mr-1.5 shrink-0" />
            <select
              value={filter.trangThaiKPI}
              onChange={(e) => onFilterChange({ ...filter, trangThaiKPI: e.target.value })}
              className="bg-transparent border-none text-slate-700 dark:text-slate-200 focus:outline-none cursor-pointer pr-1"
            >
              <option value="Tất cả" className="bg-white dark:bg-slate-800">
                {currentTab === 'media' ? 'Đánh giá KPI: Tất cả' : 'Cấp độ Rủi ro: Tất cả'}
              </option>
              {availableStatuses.map((st) => (
                <option key={st} value={st} className="bg-white dark:bg-slate-800">{st}</option>
              ))}
            </select>
          </div>

          {/* 6. Keyword Search Input */}
          <div className="flex items-center bg-slate-50 dark:bg-slate-800/90 rounded-lg border border-slate-200 dark:border-slate-700 px-2.5 py-1 text-xs flex-1 min-w-[160px]">
            <Search className="w-3.5 h-3.5 text-slate-400 mr-1.5 shrink-0" />
            <input
              type="text"
              placeholder={currentTab === 'media' ? 'Tìm theo Mã SP, Tác giả, Chuyên mục...' : 'Tìm theo Mã NV, Cán bộ, Nghiệp vụ...'}
              value={filter.searchQuery}
              onChange={(e) => onFilterChange({ ...filter, searchQuery: e.target.value })}
              className="w-full bg-transparent border-none text-slate-700 dark:text-slate-200 focus:outline-none placeholder-slate-400 text-xs"
            />
          </div>

          {/* Reset Filter Button */}
          {isFiltered && (
            <button
              onClick={handleResetFilters}
              title="Đặt lại bộ lọc về mặc định"
              className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium text-slate-600 dark:text-slate-300 hover:text-red-600 dark:hover:text-red-400 bg-slate-100 dark:bg-slate-800 hover:bg-red-50 dark:hover:bg-red-950/30 border border-slate-200 dark:border-slate-700 transition-colors"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Xóa lọc</span>
            </button>
          )}

        </div>

      </div>
    </div>
  );
};
