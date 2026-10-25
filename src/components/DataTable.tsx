import React, { useState, useMemo } from 'react';
import { 
  Trophy, 
  AlertCircle, 
  Search, 
  ChevronLeft, 
  ChevronRight, 
  ArrowUpDown, 
  ExternalLink,
  Flame,
  CheckCircle2,
  Clock,
  Briefcase
} from 'lucide-react';
import { MediaRecord, AdminRecord, ScenarioTab } from '../types/dashboard';
import { formatVND, formatNumber, formatPercentRaw } from '../utils/formatters';

interface DataTableProps {
  currentTab: ScenarioTab;
  mediaRecords: MediaRecord[];
  adminRecords: AdminRecord[];
}

export const DataTable: React.FC<DataTableProps> = ({
  currentTab,
  mediaRecords,
  adminRecords
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [sortField, setSortField] = useState<string>('views');
  const [sortAsc, setSortAsc] = useState<boolean>(false);
  const pageSize = 8;

  // Sorting and pagination for Media
  const sortedMedia = useMemo(() => {
    return [...mediaRecords].sort((a, b) => {
      let valA: any = (a as any)[sortField];
      let valB: any = (b as any)[sortField];
      if (typeof valA === 'string') {
        return sortAsc ? valA.localeCompare(valB) : valB.localeCompare(valA);
      }
      return sortAsc ? (valA - valB) : (valB - valA);
    });
  }, [mediaRecords, sortField, sortAsc]);

  // Top 5 Media Performers
  const top5Media = useMemo(() => {
    return [...mediaRecords]
      .sort((a, b) => (b.views * 0.4 + b.revenue * 0.6) - (a.views * 0.4 + a.revenue * 0.6))
      .slice(0, 5);
  }, [mediaRecords]);

  // Sorting and pagination for Admin
  const sortedAdmin = useMemo(() => {
    return [...adminRecords].sort((a, b) => {
      let valA: any = (a as any)[sortField];
      let valB: any = (b as any)[sortField];
      if (typeof valA === 'string') {
        return sortAsc ? valA.localeCompare(valB) : valB.localeCompare(valA);
      }
      return sortAsc ? (valA - valB) : (valB - valA);
    });
  }, [adminRecords, sortField, sortAsc]);

  // Urgent Admin Tasks (High Risk / Overdue)
  const urgentTasks = useMemo(() => {
    return adminRecords
      .filter(r => r.capDoRuiRo === 'Rủi ro Cao (Cần xử lý)' || r.trangThai === 'Quá hạn xử lý' || r.slaRate < 0.75)
      .slice(0, 5);
  }, [adminRecords]);

  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortAsc(!sortAsc);
    } else {
      setSortField(field);
      setSortAsc(false);
    }
  };

  const totalPages = Math.ceil((currentTab === 'media' ? sortedMedia.length : sortedAdmin.length) / pageSize) || 1;
  const paginatedMedia = sortedMedia.slice((currentPage - 1) * pageSize, currentPage * pageSize);
  const paginatedAdmin = sortedAdmin.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  return (
    <div className="bg-white/95 dark:bg-slate-900/95 rounded-2xl border border-slate-200/90 dark:border-slate-800 shadow-glass overflow-hidden flex flex-col h-full">
      
      {/* Top Section: Highlight Top 5 or Urgent Tasks */}
      <div className="p-4 bg-slate-50/80 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-800">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            {currentTab === 'media' ? (
              <div className="p-2 rounded-xl bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400">
                <Trophy className="w-4 h-4" />
              </div>
            ) : (
              <div className="p-2 rounded-xl bg-red-50 dark:bg-red-950/60 text-red-600 dark:text-red-400">
                <AlertCircle className="w-4 h-4" />
              </div>
            )}
            <div>
              <h3 className="text-xs font-bold text-slate-800 dark:text-slate-100 uppercase tracking-tight">
                {currentTab === 'media' 
                  ? 'Top 5 Sản Phẩm Xuất Sắc Nhất (Views & Doanh Thu Cao Nhất)' 
                  : 'Nhiệm Vụ Quá Hạn & Rủi Ro Cao (Cần Lãnh Đạo Chỉ Đạo Ngay)'}
              </h3>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                {currentTab === 'media' 
                  ? 'Mô hình nội dung mẫu để nhân rộng cho các ban khác' 
                  : 'Danh sách các điểm nghẽn vi phạm SLA hoặc chậm tiến độ'}
              </p>
            </div>
          </div>
        </div>

        {/* Top 5 Cards Horizontal or mini list */}
        <div className="grid grid-cols-1 sm:grid-cols-5 gap-2">
          {currentTab === 'media' ? (
            top5Media.map((item, idx) => (
              <div key={item.maSP} className="p-2.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-xs flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between text-[11px] mb-1">
                    <span className="font-extrabold text-amber-600 flex items-center gap-1">
                      <Flame className="w-3 h-3 fill-amber-500" /> #{idx + 1}
                    </span>
                    <span className="text-[10px] text-slate-400 font-mono">{item.maSP}</span>
                  </div>
                  <strong className="text-xs font-bold text-slate-800 dark:text-slate-100 line-clamp-1">
                    {item.chuyenMuc}
                  </strong>
                  <span className="text-[10px] text-slate-500 dark:text-slate-400 block truncate">
                    {item.nenTang} • {item.tacGia}
                  </span>
                </div>
                <div className="mt-2 pt-1 border-t border-slate-100 dark:border-slate-700/60 flex justify-between items-center text-[10px]">
                  <span className="font-semibold text-teal-600 dark:text-teal-400">{formatNumber(item.views, true)}</span>
                  <span className="font-semibold text-emerald-600">{formatVND(item.revenue, true)}</span>
                </div>
              </div>
            ))
          ) : (
            urgentTasks.map((task) => (
              <div key={task.maNV} className="p-2.5 rounded-xl bg-white dark:bg-slate-800 border border-red-200 dark:border-red-900/50 shadow-xs flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between text-[11px] mb-1">
                    <span className="font-mono text-red-600 font-bold">{task.maNV}</span>
                    <span className="text-[9px] px-1.5 py-0.2 rounded bg-red-100 dark:bg-red-900/50 text-red-700 dark:text-red-300 font-bold">
                      {task.trangThai}
                    </span>
                  </div>
                  <strong className="text-xs font-bold text-slate-800 dark:text-slate-100 line-clamp-1">
                    {task.nhomNghiepVu}
                  </strong>
                  <span className="text-[10px] text-slate-500 dark:text-slate-400 block truncate">
                    {task.canBo} ({task.phongBan.replace('Phòng ', '').substring(0, 15)}...)
                  </span>
                </div>
                <div className="mt-2 pt-1 border-t border-slate-100 dark:border-slate-700/60 flex justify-between items-center text-[10px]">
                  <span className="text-red-600 font-semibold">SLA: {formatPercentRaw(task.slaRate)}</span>
                  <span className="text-slate-500">{task.gioCong}h</span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Main Table */}
      <div className="flex-1 overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-100/70 dark:bg-slate-800/80 text-slate-600 dark:text-slate-300 border-b border-slate-200 dark:border-slate-700 font-semibold uppercase tracking-wider text-[10px]">
            {currentTab === 'media' ? (
              <tr>
                <th className="py-2.5 px-3">Mã SP</th>
                <th className="py-2.5 px-3">Thời gian</th>
                <th className="py-2.5 px-3">Ban Chuyên Môn</th>
                <th className="py-2.5 px-3">Nền Tảng / Định Dạng</th>
                <th className="py-2.5 px-3">Mức Độ AI</th>
                <th className="py-2.5 px-3 cursor-pointer hover:text-teal-600" onClick={() => handleSort('views')}>
                  <div className="flex items-center gap-1">Lượt Xem <ArrowUpDown className="w-3 h-3" /></div>
                </th>
                <th className="py-2.5 px-3 cursor-pointer hover:text-teal-600" onClick={() => handleSort('revenue')}>
                  <div className="flex items-center gap-1">Doanh Thu <ArrowUpDown className="w-3 h-3" /></div>
                </th>
                <th className="py-2.5 px-3 cursor-pointer hover:text-teal-600" onClick={() => handleSort('roi')}>
                  <div className="flex items-center gap-1">ROI (%) <ArrowUpDown className="w-3 h-3" /></div>
                </th>
                <th className="py-2.5 px-3">Đánh Giá KPI</th>
              </tr>
            ) : (
              <tr>
                <th className="py-2.5 px-3">Mã NV</th>
                <th className="py-2.5 px-3">Thời gian</th>
                <th className="py-2.5 px-3">Phòng Ban / Cán Bộ</th>
                <th className="py-2.5 px-3">Nhóm Nghiệp Vụ</th>
                <th className="py-2.5 px-3">Phương Thức Số Hóa</th>
                <th className="py-2.5 px-3 cursor-pointer hover:text-teal-600" onClick={() => handleSort('tongHoSo')}>
                  <div className="flex items-center gap-1">Tổng Hồ Sơ <ArrowUpDown className="w-3 h-3" /></div>
                </th>
                <th className="py-2.5 px-3 cursor-pointer hover:text-teal-600" onClick={() => handleSort('slaRate')}>
                  <div className="flex items-center gap-1">SLA Đúng Hạn <ArrowUpDown className="w-3 h-3" /></div>
                </th>
                <th className="py-2.5 px-3 cursor-pointer hover:text-teal-600" onClick={() => handleSort('thucTeGiaiNgan')}>
                  <div className="flex items-center gap-1">Giải Ngân <ArrowUpDown className="w-3 h-3" /></div>
                </th>
                <th className="py-2.5 px-3">Cấp Độ Rủi Ro</th>
              </tr>
            )}
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
            {currentTab === 'media' ? (
              paginatedMedia.map((item) => (
                <tr key={item.maSP} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors">
                  <td className="py-2.5 px-3 font-mono font-semibold text-slate-700 dark:text-slate-300">{item.maSP}</td>
                  <td className="py-2.5 px-3 text-slate-500">{item.thang.replace('/2026', '')}</td>
                  <td className="py-2.5 px-3">
                    <span className="font-medium text-slate-800 dark:text-slate-200 block">{item.banChuyenMon}</span>
                    <span className="text-[10px] text-slate-400">{item.tacGia}</span>
                  </td>
                  <td className="py-2.5 px-3">
                    <span className="font-semibold text-teal-700 dark:text-teal-300 block">{item.nenTang}</span>
                    <span className="text-[10px] text-slate-500">{item.dinhDang}</span>
                  </td>
                  <td className="py-2.5 px-3">
                    <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                      {item.mucDoAI}
                    </span>
                  </td>
                  <td className="py-2.5 px-3 font-bold text-slate-800 dark:text-slate-100">{formatNumber(item.views)}</td>
                  <td className="py-2.5 px-3 font-bold text-emerald-600 dark:text-emerald-400">{formatVND(item.revenue)}</td>
                  <td className="py-2.5 px-3 font-bold text-amber-600 dark:text-amber-400">+{((item.roi * 100).toFixed(1))}%</td>
                  <td className="py-2.5 px-3">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      item.kpiStatus === 'Vượt KPI'
                        ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300'
                        : item.kpiStatus === 'Đạt KPI'
                        ? 'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300'
                        : 'bg-red-100 text-red-800 dark:bg-red-950/60 dark:text-red-300'
                    }`}>
                      {item.kpiStatus}
                    </span>
                  </td>
                </tr>
              ))
            ) : (
              paginatedAdmin.map((item) => (
                <tr key={item.maNV} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors">
                  <td className="py-2.5 px-3 font-mono font-semibold text-slate-700 dark:text-slate-300">{item.maNV}</td>
                  <td className="py-2.5 px-3 text-slate-500">{item.thang.replace('/2026', '')}</td>
                  <td className="py-2.5 px-3">
                    <span className="font-medium text-slate-800 dark:text-slate-200 block truncate max-w-[150px]">{item.phongBan}</span>
                    <span className="text-[10px] text-slate-400">{item.canBo}</span>
                  </td>
                  <td className="py-2.5 px-3 font-medium text-slate-700 dark:text-slate-300 truncate max-w-[180px]">{item.nhomNghiepVu}</td>
                  <td className="py-2.5 px-3">
                    <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                      {item.phuongThucXuLy}
                    </span>
                  </td>
                  <td className="py-2.5 px-3 font-bold text-slate-800 dark:text-slate-100">{item.tongHoSo}</td>
                  <td className="py-2.5 px-3 font-bold">
                    <span className={item.slaRate >= 0.9 ? 'text-emerald-600' : (item.slaRate >= 0.8 ? 'text-amber-600' : 'text-red-600')}>
                      {formatPercentRaw(item.slaRate)}
                    </span>
                  </td>
                  <td className="py-2.5 px-3 font-bold text-emerald-600 dark:text-emerald-400">{formatVND(item.thucTeGiaiNgan)}</td>
                  <td className="py-2.5 px-3">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      item.capDoRuiRo === 'An toàn / Tốt'
                        ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300'
                        : item.capDoRuiRo === 'Rủi ro Trung bình'
                        ? 'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300'
                        : 'bg-red-100 text-red-800 dark:bg-red-950/60 dark:text-red-300'
                    }`}>
                      {item.capDoRuiRo}
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      <div className="p-3 bg-slate-50 dark:bg-slate-800/60 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs">
        <span className="text-slate-500 dark:text-slate-400">
          Trang <strong className="text-slate-800 dark:text-slate-200">{currentPage}</strong> / {totalPages} (Tổng: {currentTab === 'media' ? sortedMedia.length : sortedAdmin.length} bản ghi)
        </span>

        <div className="flex items-center gap-1.5">
          <button
            onClick={() => setCurrentPage(p => Math.max(p - 1, 1))}
            disabled={currentPage === 1}
            className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-700 text-slate-600 dark:text-slate-300 disabled:opacity-40 hover:bg-slate-50 dark:hover:bg-slate-600"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages))}
            disabled={currentPage === totalPages}
            className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-700 text-slate-600 dark:text-slate-300 disabled:opacity-40 hover:bg-slate-50 dark:hover:bg-slate-600"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

    </div>
  );
};
