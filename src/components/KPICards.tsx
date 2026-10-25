import React from 'react';
import { 
  Eye, 
  DollarSign, 
  TrendingUp, 
  Clock, 
  CheckCircle2, 
  AlertTriangle, 
  ArrowUpRight, 
  ArrowDownRight, 
  ShieldAlert, 
  Briefcase, 
  FileText, 
  Sparkles,
  PieChart
} from 'lucide-react';
import { CountUp } from './CountUp';
import { formatVND, formatNumber, formatPercentRaw } from '../utils/formatters';
import { MediaRecord, AdminRecord, ScenarioTab } from '../types/dashboard';

interface KPICardsProps {
  currentTab: ScenarioTab;
  mediaRecords: MediaRecord[];
  adminRecords: AdminRecord[];
  allMediaRecords: MediaRecord[];
  allAdminRecords: AdminRecord[];
}

export const KPICards: React.FC<KPICardsProps> = ({
  currentTab,
  mediaRecords,
  adminRecords
}) => {
  if (currentTab === 'media') {
    const totalViews = mediaRecords.reduce((s, r) => s + r.views, 0);
    const totalRevenue = mediaRecords.reduce((s, r) => s + r.revenue, 0);
    const totalCost = mediaRecords.reduce((s, r) => s + r.cost, 0);
    const totalProfit = totalRevenue - totalCost;
    const overallROI = totalCost > 0 ? (totalProfit / totalCost) : 0;
    const avgRetention = mediaRecords.length > 0 
      ? mediaRecords.reduce((s, r) => s + r.retention, 0) / mediaRecords.length 
      : 0;
    const avgER = mediaRecords.length > 0 
      ? mediaRecords.reduce((s, r) => s + r.er, 0) / mediaRecords.length 
      : 0;

    const vuotCount = mediaRecords.filter(r => r.kpiStatus === 'Vượt KPI').length;
    const datCount = mediaRecords.filter(r => r.kpiStatus === 'Đạt KPI').length;
    const kpiPassRate = mediaRecords.length > 0 ? ((vuotCount + datCount) / mediaRecords.length) : 0;

    // Benchmark targets for 6 months (sum of 5 channels in Sheet 4)
    const kpiViewsTarget = 92_500_000;
    const kpiRevenueTarget = 2_900_000_000;
    const pctViews = Math.min((totalViews / kpiViewsTarget) * 100, 250);
    const pctRev = Math.min((totalRevenue / kpiRevenueTarget) * 100, 250);

    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        
        {/* Card 1: Views */}
        <div className="group relative overflow-hidden rounded-2xl bg-white/90 dark:bg-slate-900/90 p-4 border border-slate-200/90 dark:border-slate-800 shadow-glass hover:shadow-glass-hover hover:-translate-y-1 transition-all duration-300">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-teal-500 to-cyan-500" />
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider">Tổng Lượt Xem (Views)</span>
            <div className="p-2 rounded-xl bg-teal-50 dark:bg-teal-950/50 text-teal-600 dark:text-teal-400 group-hover:scale-110 transition-transform">
              <Eye className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-extrabold text-[#1B365D] dark:text-white tracking-tight">
            <CountUp end={totalViews} formatter={(v) => formatNumber(v, true)} />
          </div>
          <div className="mt-2 flex items-center justify-between text-xs">
            <span className="inline-flex items-center text-emerald-600 dark:text-emerald-400 font-semibold">
              <ArrowUpRight className="w-3.5 h-3.5 mr-0.5" /> +18.4% MoM
            </span>
            <span className="text-slate-400 font-medium">Kế hoạch: {formatNumber(kpiViewsTarget, true)}</span>
          </div>
          {/* Progress bar */}
          <div className="mt-2.5 w-full bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden">
            <div 
              className="bg-gradient-to-r from-teal-500 to-emerald-500 h-full rounded-full transition-all duration-700" 
              style={{ width: `${Math.min(pctViews, 100)}%` }} 
            />
          </div>
        </div>

        {/* Card 2: Revenue */}
        <div className="group relative overflow-hidden rounded-2xl bg-white/90 dark:bg-slate-900/90 p-4 border border-slate-200/90 dark:border-slate-800 shadow-glass hover:shadow-glass-hover hover:-translate-y-1 transition-all duration-300">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-500 to-teal-500" />
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider">Doanh Thu QC & Tài Trợ</span>
            <div className="p-2 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 group-hover:scale-110 transition-transform">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-extrabold text-emerald-700 dark:text-emerald-400 tracking-tight">
            <CountUp end={totalRevenue} formatter={(v) => formatVND(v, true)} />
          </div>
          <div className="mt-2 flex items-center justify-between text-xs">
            <span className="inline-flex items-center text-emerald-600 dark:text-emerald-400 font-semibold">
              <ArrowUpRight className="w-3.5 h-3.5 mr-0.5" /> +22.1% MoM
            </span>
            <span className="text-slate-400 font-medium">Đạt {(pctRev).toFixed(0)}% KPI</span>
          </div>
          <div className="mt-2.5 w-full bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden">
            <div 
              className="bg-gradient-to-r from-emerald-500 to-teal-500 h-full rounded-full transition-all duration-700" 
              style={{ width: `${Math.min(pctRev, 100)}%` }} 
            />
          </div>
        </div>

        {/* Card 3: Chi phí & Lợi nhuận ròng */}
        <div className="group relative overflow-hidden rounded-2xl bg-white/90 dark:bg-slate-900/90 p-4 border border-slate-200/90 dark:border-slate-800 shadow-glass hover:shadow-glass-hover hover:-translate-y-1 transition-all duration-300">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#1B365D] to-indigo-500" />
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider">Chi Phí & Lợi Nhuận</span>
            <div className="p-2 rounded-xl bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 group-hover:scale-110 transition-transform">
              <PieChart className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-extrabold text-indigo-700 dark:text-indigo-300 tracking-tight">
            <CountUp end={totalProfit} formatter={(v) => formatVND(v, true)} />
          </div>
          <div className="mt-2 flex items-center justify-between text-xs">
            <span className="text-slate-500">Chi phí SX:</span>
            <span className="font-semibold text-slate-700 dark:text-slate-300">{formatVND(totalCost, true)}</span>
          </div>
          <div className="mt-2.5 w-full bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden">
            <div 
              className="bg-gradient-to-r from-[#1B365D] to-indigo-500 h-full rounded-full transition-all duration-700" 
              style={{ width: `${Math.min((totalProfit / (totalRevenue || 1)) * 100, 100)}%` }} 
            />
          </div>
        </div>

        {/* Card 4: ROI % */}
        <div className="group relative overflow-hidden rounded-2xl bg-white/90 dark:bg-slate-900/90 p-4 border border-slate-200/90 dark:border-slate-800 shadow-glass hover:shadow-glass-hover hover:-translate-y-1 transition-all duration-300">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-500 to-orange-500" />
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider">Tỷ Suất Lợi Nhuận (ROI)</span>
            <div className="p-2 rounded-xl bg-amber-50 dark:bg-amber-950/50 text-amber-600 dark:text-amber-400 group-hover:scale-110 transition-transform">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-extrabold text-amber-600 dark:text-amber-400 tracking-tight">
            <CountUp end={overallROI * 100} formatter={(v) => `+${v.toFixed(1)}%`} />
          </div>
          <div className="mt-2 flex items-center justify-between text-xs">
            <span className="inline-flex items-center text-emerald-600 dark:text-emerald-400 font-semibold">
              <ArrowUpRight className="w-3.5 h-3.5 mr-0.5" /> Vượt mức chuẩn
            </span>
            <span className="text-slate-400 font-medium">Định mức: +35%</span>
          </div>
          <div className="mt-2.5 w-full bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden">
            <div 
              className="bg-gradient-to-r from-amber-500 to-orange-500 h-full rounded-full transition-all duration-700" 
              style={{ width: '92%' }} 
            />
          </div>
        </div>

        {/* Card 5: Retention & ER */}
        <div className="group relative overflow-hidden rounded-2xl bg-white/90 dark:bg-slate-900/90 p-4 border border-slate-200/90 dark:border-slate-800 shadow-glass hover:shadow-glass-hover hover:-translate-y-1 transition-all duration-300">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-teal-600 to-emerald-600" />
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider">Tỷ Lệ Giữ Chân (Retention)</span>
            <div className="p-2 rounded-xl bg-teal-50 dark:bg-teal-950/50 text-teal-600 dark:text-teal-400 group-hover:scale-110 transition-transform">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-extrabold text-teal-700 dark:text-teal-300 tracking-tight">
            <CountUp end={avgRetention * 100} formatter={(v) => `${v.toFixed(1)}%`} />
          </div>
          <div className="mt-2 flex items-center justify-between text-xs">
            <span className="text-slate-500">Tương tác ER:</span>
            <span className="font-semibold text-slate-700 dark:text-slate-300">{formatPercentRaw(avgER, 2)}</span>
          </div>
          <div className="mt-2.5 w-full bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden">
            <div 
              className="bg-gradient-to-r from-teal-600 to-emerald-600 h-full rounded-full transition-all duration-700" 
              style={{ width: `${Math.min(avgRetention * 100, 100)}%` }} 
            />
          </div>
        </div>

        {/* Card 6: Đánh giá KPI */}
        <div className="group relative overflow-hidden rounded-2xl bg-white/90 dark:bg-slate-900/90 p-4 border border-slate-200/90 dark:border-slate-800 shadow-glass hover:shadow-glass-hover hover:-translate-y-1 transition-all duration-300">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-purple-500 to-pink-500" />
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider">Tỷ Lệ Đạt/Vượt KPI</span>
            <div className="p-2 rounded-xl bg-purple-50 dark:bg-purple-950/50 text-purple-600 dark:text-purple-400 group-hover:scale-110 transition-transform">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-extrabold text-purple-700 dark:text-purple-300 tracking-tight">
            <CountUp end={kpiPassRate * 100} formatter={(v) => `${v.toFixed(1)}%`} />
          </div>
          <div className="mt-2 flex items-center justify-between text-xs">
            <span className="text-emerald-600 dark:text-emerald-400 font-semibold">{vuotCount} Vượt KPI</span>
            <span className="text-amber-600 dark:text-amber-400 font-semibold">{datCount} Đạt</span>
          </div>
          <div className="mt-2.5 w-full bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden">
            <div 
              className="bg-gradient-to-r from-purple-500 to-pink-500 h-full rounded-full transition-all duration-700" 
              style={{ width: `${Math.min(kpiPassRate * 100, 100)}%` }} 
            />
          </div>
        </div>

      </div>
    );
  }

  // Admin & Projects Cards
  const totalDossiers = adminRecords.reduce((s, r) => s + r.tongHoSo, 0);
  const totalOnTime = adminRecords.reduce((s, r) => s + r.hoSoDungHan, 0);
  const slaRate = totalDossiers > 0 ? (totalOnTime / totalDossiers) : 0;
  const totalBudget = adminRecords.reduce((s, r) => s + r.nganSachDuyet, 0);
  const totalDisbursed = adminRecords.reduce((s, r) => s + r.thucTeGiaiNgan, 0);
  const disbursementRate = totalBudget > 0 ? (totalDisbursed / totalBudget) : 0;
  const totalHours = adminRecords.reduce((s, r) => s + r.gioCong, 0);
  const highRiskCount = adminRecords.filter(r => r.capDoRuiRo === 'Rủi ro Cao (Cần xử lý)').length;
  const targetSLA = 0.90; // 90% benchmark

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
      
      {/* Card 1: Dossiers */}
      <div className="group relative overflow-hidden rounded-2xl bg-white/90 dark:bg-slate-900/90 p-4 border border-slate-200/90 dark:border-slate-800 shadow-glass hover:shadow-glass-hover hover:-translate-y-1 transition-all duration-300">
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-teal-500 to-cyan-500" />
        <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 mb-2">
          <span className="text-[11px] font-bold uppercase tracking-wider">Tổng Hồ Sơ Phát Sinh</span>
          <div className="p-2 rounded-xl bg-teal-50 dark:bg-teal-950/50 text-teal-600 dark:text-teal-400 group-hover:scale-110 transition-transform">
            <FileText className="w-4 h-4" />
          </div>
        </div>
        <div className="text-2xl font-extrabold text-[#1B365D] dark:text-white tracking-tight">
          <CountUp end={totalDossiers} formatter={(v) => formatNumber(v)} />
        </div>
        <div className="mt-2 flex items-center justify-between text-xs">
          <span className="text-slate-500">Số nhiệm vụ:</span>
          <span className="font-semibold text-slate-700 dark:text-slate-300">{adminRecords.length} đầu việc</span>
        </div>
        <div className="mt-2.5 w-full bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden">
          <div className="bg-gradient-to-r from-teal-500 to-cyan-500 h-full rounded-full transition-all duration-700" style={{ width: '85%' }} />
        </div>
      </div>

      {/* Card 2: SLA Rate */}
      <div className="group relative overflow-hidden rounded-2xl bg-white/90 dark:bg-slate-900/90 p-4 border border-slate-200/90 dark:border-slate-800 shadow-glass hover:shadow-glass-hover hover:-translate-y-1 transition-all duration-300">
        <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${slaRate >= targetSLA ? 'from-emerald-500 to-teal-500' : 'from-amber-500 to-red-500'}`} />
        <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 mb-2">
          <span className="text-[11px] font-bold uppercase tracking-wider">Tỷ Lệ Đúng Hạn (SLA)</span>
          <div className={`p-2 rounded-xl ${slaRate >= targetSLA ? 'bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600' : 'bg-amber-50 dark:bg-amber-950/50 text-amber-600'} group-hover:scale-110 transition-transform`}>
            <CheckCircle2 className="w-4 h-4" />
          </div>
        </div>
        <div className={`text-2xl font-extrabold tracking-tight ${slaRate >= targetSLA ? 'text-emerald-600 dark:text-emerald-400' : 'text-amber-600 dark:text-amber-400'}`}>
          <CountUp end={slaRate * 100} formatter={(v) => `${v.toFixed(1)}%`} />
        </div>
        <div className="mt-2 flex items-center justify-between text-xs">
          <span className={`inline-flex items-center font-semibold ${slaRate >= targetSLA ? 'text-emerald-600' : 'text-amber-600'}`}>
            {slaRate >= targetSLA ? <ArrowUpRight className="w-3.5 h-3.5 mr-0.5" /> : <ArrowDownRight className="w-3.5 h-3.5 mr-0.5" />}
            {slaRate >= targetSLA ? 'Đạt SLA chuẩn' : 'Dưới chỉ tiêu'}
          </span>
          <span className="text-slate-400 font-medium">Chỉ tiêu: 90%</span>
        </div>
        <div className="mt-2.5 w-full bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden">
          <div 
            className={`h-full rounded-full transition-all duration-700 ${slaRate >= targetSLA ? 'bg-gradient-to-r from-emerald-500 to-teal-500' : 'bg-gradient-to-r from-amber-500 to-red-500'}`}
            style={{ width: `${Math.min(slaRate * 100, 100)}%` }} 
          />
        </div>
      </div>

      {/* Card 3: Approved Budget */}
      <div className="group relative overflow-hidden rounded-2xl bg-white/90 dark:bg-slate-900/90 p-4 border border-slate-200/90 dark:border-slate-800 shadow-glass hover:shadow-glass-hover hover:-translate-y-1 transition-all duration-300">
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#1B365D] to-indigo-500" />
        <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 mb-2">
          <span className="text-[11px] font-bold uppercase tracking-wider">Ngân Sách Được Duyệt</span>
          <div className="p-2 rounded-xl bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 group-hover:scale-110 transition-transform">
            <DollarSign className="w-4 h-4" />
          </div>
        </div>
        <div className="text-2xl font-extrabold text-[#1B365D] dark:text-white tracking-tight">
          <CountUp end={totalBudget} formatter={(v) => formatVND(v, true)} />
        </div>
        <div className="mt-2 flex items-center justify-between text-xs">
          <span className="text-slate-500">Hạn mức cấp:</span>
          <span className="font-semibold text-slate-700 dark:text-slate-300">6 Tháng đầu 2026</span>
        </div>
        <div className="mt-2.5 w-full bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden">
          <div className="bg-gradient-to-r from-[#1B365D] to-indigo-500 h-full rounded-full transition-all duration-700" style={{ width: '100%' }} />
        </div>
      </div>

      {/* Card 4: Actual Disbursed */}
      <div className="group relative overflow-hidden rounded-2xl bg-white/90 dark:bg-slate-900/90 p-4 border border-slate-200/90 dark:border-slate-800 shadow-glass hover:shadow-glass-hover hover:-translate-y-1 transition-all duration-300">
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-500 to-teal-500" />
        <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 mb-2">
          <span className="text-[11px] font-bold uppercase tracking-wider">Thực Tế Đã Giải Ngân</span>
          <div className="p-2 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 group-hover:scale-110 transition-transform">
            <TrendingUp className="w-4 h-4" />
          </div>
        </div>
        <div className="text-2xl font-extrabold text-emerald-600 dark:text-emerald-400 tracking-tight">
          <CountUp end={totalDisbursed} formatter={(v) => formatVND(v, true)} />
        </div>
        <div className="mt-2 flex items-center justify-between text-xs">
          <span className="inline-flex items-center text-emerald-600 font-semibold">
            Tỷ lệ: {formatPercentRaw(disbursementRate)}
          </span>
          <span className="text-slate-400 font-medium">Dư: {formatVND(totalBudget - totalDisbursed, true)}</span>
        </div>
        <div className="mt-2.5 w-full bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden">
          <div 
            className="bg-gradient-to-r from-emerald-500 to-teal-500 h-full rounded-full transition-all duration-700" 
            style={{ width: `${Math.min(disbursementRate * 100, 100)}%` }} 
          />
        </div>
      </div>

      {/* Card 5: Man-hours */}
      <div className="group relative overflow-hidden rounded-2xl bg-white/90 dark:bg-slate-900/90 p-4 border border-slate-200/90 dark:border-slate-800 shadow-glass hover:shadow-glass-hover hover:-translate-y-1 transition-all duration-300">
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 to-indigo-500" />
        <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 mb-2">
          <span className="text-[11px] font-bold uppercase tracking-wider">Tổng Giờ Công Tiêu Hao</span>
          <div className="p-2 rounded-xl bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 group-hover:scale-110 transition-transform">
            <Briefcase className="w-4 h-4" />
          </div>
        </div>
        <div className="text-2xl font-extrabold text-blue-700 dark:text-blue-300 tracking-tight">
          <CountUp end={totalHours} formatter={(v) => `${formatNumber(v)} giờ`} />
        </div>
        <div className="mt-2 flex items-center justify-between text-xs">
          <span className="text-slate-500">Trung bình:</span>
          <span className="font-semibold text-slate-700 dark:text-slate-300">
            {adminRecords.length > 0 ? Math.round(totalHours / adminRecords.length) : 0} giờ/đầu việc
          </span>
        </div>
        <div className="mt-2.5 w-full bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden">
          <div className="bg-gradient-to-r from-blue-500 to-indigo-500 h-full rounded-full transition-all duration-700" style={{ width: '78%' }} />
        </div>
      </div>

      {/* Card 6: Risk Alerts */}
      <div className="group relative overflow-hidden rounded-2xl bg-white/90 dark:bg-slate-900/90 p-4 border border-slate-200/90 dark:border-slate-800 shadow-glass hover:shadow-glass-hover hover:-translate-y-1 transition-all duration-300">
        <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${highRiskCount > 0 ? 'from-red-500 to-amber-500' : 'from-emerald-500 to-teal-500'}`} />
        <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 mb-2">
          <span className="text-[11px] font-bold uppercase tracking-wider">Cảnh Báo Rủi Ro Cao</span>
          <div className={`p-2 rounded-xl ${highRiskCount > 0 ? 'bg-red-50 dark:bg-red-950/50 text-red-600' : 'bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600'} group-hover:scale-110 transition-transform`}>
            <ShieldAlert className="w-4 h-4" />
          </div>
        </div>
        <div className={`text-2xl font-extrabold tracking-tight ${highRiskCount > 0 ? 'text-red-600 dark:text-red-400' : 'text-emerald-600 dark:text-emerald-400'}`}>
          <CountUp end={highRiskCount} formatter={(v) => `${Math.round(v)} nhiệm vụ`} />
        </div>
        <div className="mt-2 flex items-center justify-between text-xs">
          <span className={highRiskCount > 0 ? 'text-red-600 font-semibold' : 'text-emerald-600 font-semibold'}>
            {highRiskCount > 0 ? 'Cần xử lý khẩn cấp' : 'An toàn tuyệt đối'}
          </span>
          <span className="text-slate-400 font-medium">
            {adminRecords.length > 0 ? ((highRiskCount / adminRecords.length) * 100).toFixed(1) : 0}% tổng việc
          </span>
        </div>
        <div className="mt-2.5 w-full bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden">
          <div 
            className={`h-full rounded-full transition-all duration-700 ${highRiskCount > 0 ? 'bg-gradient-to-r from-red-500 to-amber-500' : 'bg-gradient-to-r from-emerald-500 to-teal-500'}`}
            style={{ width: `${Math.min((highRiskCount / (adminRecords.length || 1)) * 300, 100)}%` }} 
          />
        </div>
      </div>

    </div>
  );
};
