import React from 'react';
import {
  ResponsiveContainer,
  ComposedChart,
  Bar,
  Line,
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend
} from 'recharts';
import { MediaRecord, AdminRecord, ScenarioTab } from '../types/dashboard';
import { formatVND, formatNumber, formatPercentRaw } from '../utils/formatters';
import { Sparkles, TrendingUp, BarChart2, PieChart as PieIcon, Cpu } from 'lucide-react';

interface ChartsSectionProps {
  currentTab: ScenarioTab;
  mediaRecords: MediaRecord[];
  adminRecords: AdminRecord[];
  isDark: boolean;
}

const COLORS = ['#008080', '#1B365D', '#D97706', '#10B981', '#8B5CF6', '#EC4899'];
const AI_COLORS: Record<string, string> = {
  'Toàn trình (70%)': '#008080',
  'Hỗ trợ sâu (40%)': '#3B82F6',
  'Cơ bản (15%)': '#F59E0B',
  'Thủ công (0%)': '#94A3B8',
  'Tự động hóa bằng AI Agent': '#008080',
  'Phần mềm Quản lý (E-Office)': '#3B82F6',
  'Bán tự động (Excel + Biểu mẫu)': '#F59E0B',
  'Xử lý Thủ công (Hồ sơ giấy)': '#EF4444'
};

export const ChartsSection: React.FC<ChartsSectionProps> = ({
  currentTab,
  mediaRecords,
  adminRecords,
  isDark
}) => {
  const textColor = isDark ? '#94a3b8' : '#64748b';
  const gridColor = isDark ? '#334155' : '#e2e8f0';

  if (currentTab === 'media') {
    // 1. Data for Combo Chart by Platform
    const platformMap: Record<string, { name: string; views: number; cost: number; revenue: number; profit: number }> = {};
    mediaRecords.forEach(r => {
      if (!platformMap[r.nenTang]) {
        platformMap[r.nenTang] = { name: r.nenTang, views: 0, cost: 0, revenue: 0, profit: 0 };
      }
      platformMap[r.nenTang].views += r.views;
      platformMap[r.nenTang].cost += r.cost;
      platformMap[r.nenTang].revenue += r.revenue;
      platformMap[r.nenTang].profit += r.profit;
    });

    const comboData = Object.values(platformMap).map(p => ({
      name: p.name.replace(' (Web)', ''),
      cost: p.cost,
      revenue: p.revenue,
      profit: p.profit,
      roi: p.cost > 0 ? Number(((p.revenue - p.cost) / p.cost * 100).toFixed(1)) : 0,
      views: p.views
    })).sort((a, b) => b.revenue - a.revenue);

    // 2. Data for 6-Month Trend Area Chart
    const monthOrder = [
      'Tháng 01/2026',
      'Tháng 02/2026',
      'Tháng 03/2026',
      'Tháng 04/2026',
      'Tháng 05/2026',
      'Tháng 06/2026'
    ];
    const monthMap: Record<string, { month: string; views: number; revenue: number; cost: number }> = {};
    monthOrder.forEach(m => {
      monthMap[m] = { month: m.replace('/2026', '').replace('Tháng ', 'T'), views: 0, revenue: 0, cost: 0 };
    });

    mediaRecords.forEach(r => {
      if (monthMap[r.thang]) {
        monthMap[r.thang].views += r.views;
        monthMap[r.thang].revenue += r.revenue;
        monthMap[r.thang].cost += r.cost;
      }
    });
    const trendData = Object.values(monthMap);

    // 3. Data for AI Adoption & Efficiency
    const aiMap: Record<string, { count: number; totalCost: number; totalRetention: number; totalRev: number }> = {};
    mediaRecords.forEach(r => {
      if (!aiMap[r.mucDoAI]) {
        aiMap[r.mucDoAI] = { count: 0, totalCost: 0, totalRetention: 0, totalRev: 0 };
      }
      aiMap[r.mucDoAI].count++;
      aiMap[r.mucDoAI].totalCost += r.cost;
      aiMap[r.mucDoAI].totalRetention += r.retention;
      aiMap[r.mucDoAI].totalRev += r.revenue;
    });

    const aiEfficiencyData = Object.entries(aiMap).map(([level, val]) => {
      const avgCost = val.count > 0 ? Math.round(val.totalCost / val.count) : 0;
      const avgRet = val.count > 0 ? Number((val.totalRetention / val.count * 100).toFixed(1)) : 0;
      const roi = val.totalCost > 0 ? Number(((val.totalRev - val.totalCost) / val.totalCost * 100).toFixed(1)) : 0;
      return {
        name: level,
        count: val.count,
        avgCost,
        avgRetention: avgRet,
        roi
      };
    });

    return (
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        
        {/* Chart 1: Combo Bar & Line Chart (Cost vs Revenue vs ROI) */}
        <div className="lg:col-span-7 bg-white/95 dark:bg-slate-900/95 p-5 rounded-2xl border border-slate-200/90 dark:border-slate-800 shadow-glass">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-xl bg-teal-50 dark:bg-teal-950/60 text-teal-600 dark:text-teal-400">
                <BarChart2 className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100 uppercase tracking-tight">
                  So Sánh Chi Phí, Doanh Thu & ROI Theo Nền Tảng
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Phát hiện nghịch lý: Views TikTok vs Doanh thu YouTube & Báo Điện tử
                </p>
              </div>
            </div>
          </div>

          <div className="h-[290px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={comboData} margin={{ top: 10, right: 20, left: 0, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke={gridColor} opacity={0.6} />
                <XAxis dataKey="name" stroke={textColor} fontSize={11} tickLine={false} />
                <YAxis 
                  yAxisId="left" 
                  stroke={textColor} 
                  fontSize={10} 
                  tickFormatter={(v) => formatVND(v, true)}
                  width={65}
                />
                <YAxis 
                  yAxisId="right" 
                  orientation="right" 
                  stroke="#D97706" 
                  fontSize={10} 
                  tickFormatter={(v) => `${v}%`}
                  width={40}
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: isDark ? '#0f172a' : '#ffffff', 
                    borderColor: isDark ? '#334155' : '#cbd5e1',
                    borderRadius: '0.75rem',
                    fontSize: '11px',
                    boxShadow: '0 10px 25px -5px rgba(0,0,0,0.2)'
                  }}
                  formatter={(val: any, name: any) => {
                    if (name === 'ROI (%)') return [`${val}%`, name];
                    return [formatVND(val), name];
                  }}
                />
                <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
                <Bar yAxisId="left" dataKey="revenue" name="Doanh thu (VNĐ)" fill="#008080" radius={[6, 6, 0, 0]} />
                <Bar yAxisId="left" dataKey="cost" name="Chi phí SX (VNĐ)" fill="#1B365D" radius={[6, 6, 0, 0]} />
                <Line yAxisId="right" type="monotone" dataKey="roi" name="ROI (%)" stroke="#D97706" strokeWidth={3} dot={{ r: 4, fill: '#D97706' }} />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 2: 6-Month Trend Area Chart */}
        <div className="lg:col-span-5 bg-white/95 dark:bg-slate-900/95 p-5 rounded-2xl border border-slate-200/90 dark:border-slate-800 shadow-glass">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400">
                <TrendingUp className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100 uppercase tracking-tight">
                  Xu Hướng Tăng Trưởng 6 Tháng (H1/2026)
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Đỉnh chu kỳ bùng nổ Tháng 03 & Tháng 05
                </p>
              </div>
            </div>
          </div>

          <div className="h-[290px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={trendData} margin={{ top: 10, right: 10, left: -10, bottom: 20 }}>
                <defs>
                  <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#008080" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#008080" stopOpacity={0.0}/>
                  </linearGradient>
                  <linearGradient id="colorCost" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#1B365D" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#1B365D" stopOpacity={0.0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke={gridColor} opacity={0.6} />
                <XAxis dataKey="month" stroke={textColor} fontSize={11} tickLine={false} />
                <YAxis stroke={textColor} fontSize={10} tickFormatter={(v) => formatVND(v, true)} width={60} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: isDark ? '#0f172a' : '#ffffff', 
                    borderColor: isDark ? '#334155' : '#cbd5e1',
                    borderRadius: '0.75rem',
                    fontSize: '11px'
                  }}
                  formatter={(val: any, name: any) => [formatVND(val), name]}
                />
                <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
                <Area type="monotone" dataKey="revenue" name="Doanh thu (VNĐ)" stroke="#008080" strokeWidth={2.5} fillOpacity={1} fill="url(#colorRev)" />
                <Area type="monotone" dataKey="cost" name="Chi phí (VNĐ)" stroke="#1B365D" strokeWidth={2} fillOpacity={1} fill="url(#colorCost)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 3: AI Application Efficiency & Cost Comparison */}
        <div className="lg:col-span-12 bg-white/95 dark:bg-slate-900/95 p-5 rounded-2xl border border-slate-200/90 dark:border-slate-800 shadow-glass">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 gap-2">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-xl bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400">
                <Cpu className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100 uppercase tracking-tight">
                  Phân Tích Đòn Bẩy Ứng Dụng AI (Chi Phí TB vs Tỷ Lệ Giữ Chân & ROI)
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  AI Toàn trình (70%) & Hỗ trợ sâu (40%) giúp cắt giảm ~28% chi phí sản xuất nhưng nâng Retention lên 68%
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 text-xs">
              <span className="px-2.5 py-1 rounded-md bg-teal-50 dark:bg-teal-950/40 text-teal-700 dark:text-teal-300 font-semibold border border-teal-200 dark:border-teal-800">
                Toàn trình: Tiết kiệm chi phí + Tối đa ROI
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {aiEfficiencyData.map((item) => (
              <div 
                key={item.name} 
                className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-800/40 hover:shadow-md transition-shadow relative overflow-hidden"
              >
                <div 
                  className="absolute top-0 left-0 right-0 h-1" 
                  style={{ backgroundColor: AI_COLORS[item.name] || '#008080' }} 
                />
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-slate-700 dark:text-slate-200">{item.name}</span>
                  <span className="text-[11px] px-2 py-0.5 rounded-full bg-white dark:bg-slate-700 text-slate-600 dark:text-slate-300 font-medium border border-slate-200 dark:border-slate-600">
                    {item.count} SP
                  </span>
                </div>
                <div className="space-y-1.5 text-xs mt-3">
                  <div className="flex justify-between items-center">
                    <span className="text-slate-500">Chi phí TB/SP:</span>
                    <strong className="text-slate-800 dark:text-slate-100 font-bold">{formatVND(item.avgCost, true)}</strong>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-500">Retention TB:</span>
                    <strong className="text-teal-600 dark:text-teal-400 font-bold">{item.avgRetention}%</strong>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-500">Hiệu quả ROI:</span>
                    <strong className="text-amber-600 dark:text-amber-400 font-bold">+{item.roi}%</strong>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    );
  }

  // Admin & Projects Charts
  // 1. Data for Department SLA & Budget
  const deptMap: Record<string, { name: string; budget: number; disbursed: number; dossiers: number; onTime: number }> = {};
  adminRecords.forEach(r => {
    if (!deptMap[r.phongBan]) {
      deptMap[r.phongBan] = { name: r.phongBan, budget: 0, disbursed: 0, dossiers: 0, onTime: 0 };
    }
    deptMap[r.phongBan].budget += r.nganSachDuyet;
    deptMap[r.phongBan].disbursed += r.thucTeGiaiNgan;
    deptMap[r.phongBan].dossiers += r.tongHoSo;
    deptMap[r.phongBan].onTime += r.hoSoDungHan;
  });

  const deptChartData = Object.values(deptMap).map(d => ({
    name: d.name.replace('Phòng ', '').replace('Trung tâm ', 'TT ').replace('Ban Quản lý Dự án ', 'BQLDA '),
    budget: d.budget,
    disbursed: d.disbursed,
    sla: d.dossiers > 0 ? Number((d.onTime / d.dossiers * 100).toFixed(1)) : 0
  })).sort((a, b) => b.budget - a.budget);

  // 2. Data for Monthly Disbursement & SLA Trend
  const monthOrder = [
    'Tháng 01/2026',
    'Tháng 02/2026',
    'Tháng 03/2026',
    'Tháng 04/2026',
    'Tháng 05/2026',
    'Tháng 06/2026'
  ];
  const adminMonthMap: Record<string, { month: string; disbursed: number; dossiers: number; onTime: number }> = {};
  monthOrder.forEach(m => {
    adminMonthMap[m] = { month: m.replace('/2026', '').replace('Tháng ', 'T'), disbursed: 0, dossiers: 0, onTime: 0 };
  });

  adminRecords.forEach(r => {
    if (adminMonthMap[r.thang]) {
      adminMonthMap[r.thang].disbursed += r.thucTeGiaiNgan;
      adminMonthMap[r.thang].dossiers += r.tongHoSo;
      adminMonthMap[r.thang].onTime += r.hoSoDungHan;
    }
  });

  const adminTrendData = Object.values(adminMonthMap).map(m => ({
    ...m,
    sla: m.dossiers > 0 ? Number((m.onTime / m.dossiers * 100).toFixed(1)) : 0
  }));

  // 3. Data for Processing Method (AI vs Paper vs E-Office)
  const methodMap: Record<string, { count: number; dossiers: number; onTime: number; hours: number }> = {};
  adminRecords.forEach(r => {
    if (!methodMap[r.phuongThucXuLy]) {
      methodMap[r.phuongThucXuLy] = { count: 0, dossiers: 0, onTime: 0, hours: 0 };
    }
    methodMap[r.phuongThucXuLy].count++;
    methodMap[r.phuongThucXuLy].dossiers += r.tongHoSo;
    methodMap[r.phuongThucXuLy].onTime += r.hoSoDungHan;
    methodMap[r.phuongThucXuLy].hours += r.gioCong;
  });

  const methodEfficiencyData = Object.entries(methodMap).map(([m, val]) => ({
    name: m,
    tasks: val.count,
    sla: val.dossiers > 0 ? Number((val.onTime / val.dossiers * 100).toFixed(1)) : 0,
    avgHours: val.count > 0 ? Math.round(val.hours / val.count) : 0
  }));

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
      
      {/* Chart 1: Department Budget vs Disbursement vs SLA */}
      <div className="lg:col-span-7 bg-white/95 dark:bg-slate-900/95 p-5 rounded-2xl border border-slate-200/90 dark:border-slate-800 shadow-glass">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-teal-50 dark:bg-teal-950/60 text-teal-600 dark:text-teal-400">
              <BarChart2 className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100 uppercase tracking-tight">
                Ngân Sách, Thực Tế Giải Ngân & SLA Theo Phòng Ban
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Ban Quản lý Dự án Đầu tư chiếm ngân sách lớn nhất nhưng tỷ lệ giải ngân chậm trong Q1
              </p>
            </div>
          </div>
        </div>

        <div className="h-[290px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={deptChartData} margin={{ top: 10, right: 20, left: 0, bottom: 20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke={gridColor} opacity={0.6} />
              <XAxis dataKey="name" stroke={textColor} fontSize={10} tickLine={false} />
              <YAxis 
                yAxisId="left" 
                stroke={textColor} 
                fontSize={10} 
                tickFormatter={(v) => formatVND(v, true)}
                width={65}
              />
              <YAxis 
                yAxisId="right" 
                orientation="right" 
                stroke="#10B981" 
                fontSize={10} 
                tickFormatter={(v) => `${v}%`}
                width={40}
                domain={[50, 100]}
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: isDark ? '#0f172a' : '#ffffff', 
                  borderColor: isDark ? '#334155' : '#cbd5e1',
                  borderRadius: '0.75rem',
                  fontSize: '11px'
                }}
                formatter={(val: any, name: any) => {
                  if (name === 'Tỷ lệ SLA (%)') return [`${val}%`, name];
                  return [formatVND(val), name];
                }}
              />
              <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
              <Bar yAxisId="left" dataKey="budget" name="Ngân sách duyệt (VNĐ)" fill="#1B365D" radius={[6, 6, 0, 0]} />
              <Bar yAxisId="left" dataKey="disbursed" name="Thực tế giải ngân (VNĐ)" fill="#008080" radius={[6, 6, 0, 0]} />
              <Line yAxisId="right" type="monotone" dataKey="sla" name="Tỷ lệ SLA (%)" stroke="#10B981" strokeWidth={3} dot={{ r: 4, fill: '#10B981' }} />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Chart 2: Monthly Disbursement & SLA Trend */}
      <div className="lg:col-span-5 bg-white/95 dark:bg-slate-900/95 p-5 rounded-2xl border border-slate-200/90 dark:border-slate-800 shadow-glass">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400">
              <TrendingUp className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100 uppercase tracking-tight">
                Tiến Độ Giải Ngân & SLA 6 Tháng (H1/2026)
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Tháo gỡ điểm nghẽn và tăng tốc rõ nét từ Tháng 04
              </p>
            </div>
          </div>
        </div>

        <div className="h-[290px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={adminTrendData} margin={{ top: 10, right: 10, left: -10, bottom: 20 }}>
              <defs>
                <linearGradient id="colorDisb" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#008080" stopOpacity={0.4}/>
                  <stop offset="95%" stopColor="#008080" stopOpacity={0.0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke={gridColor} opacity={0.6} />
              <XAxis dataKey="month" stroke={textColor} fontSize={11} tickLine={false} />
              <YAxis stroke={textColor} fontSize={10} tickFormatter={(v) => formatVND(v, true)} width={60} />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: isDark ? '#0f172a' : '#ffffff', 
                  borderColor: isDark ? '#334155' : '#cbd5e1',
                  borderRadius: '0.75rem',
                  fontSize: '11px'
                }}
                formatter={(val: any, name: any) => [formatVND(val), name]}
              />
              <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
              <Area type="monotone" dataKey="disbursed" name="Giải ngân dự án (VNĐ)" stroke="#008080" strokeWidth={2.5} fillOpacity={1} fill="url(#colorDisb)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Chart 3: Method Comparison (AI Agent vs Paper vs E-Office) */}
      <div className="lg:col-span-12 bg-white/95 dark:bg-slate-900/95 p-5 rounded-2xl border border-slate-200/90 dark:border-slate-800 shadow-glass">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 gap-2">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400">
              <Cpu className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100 uppercase tracking-tight">
                So Sánh Phương Thức Xử Lý (AI Agent vs E-Office vs Hồ Sơ Giấy Thủ Công)
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Xử lý giấy thủ công có tỷ lệ trễ hạn cao nhất (SLA 65.2%) và tiêu hao nhiều giờ công nhất
              </p>
            </div>
          </div>
          <span className="text-xs px-2.5 py-1 rounded-md bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 font-semibold border border-emerald-200 dark:border-emerald-800">
            Tự động hóa AI Agent đạt SLA 96.4%
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {methodEfficiencyData.map((item) => (
            <div 
              key={item.name} 
              className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-800/40 hover:shadow-md transition-shadow relative overflow-hidden"
            >
              <div 
                className="absolute top-0 left-0 right-0 h-1" 
                style={{ backgroundColor: AI_COLORS[item.name] || '#008080' }} 
              />
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-slate-700 dark:text-slate-200 truncate pr-2">{item.name}</span>
                <span className="text-[11px] px-2 py-0.5 rounded-full bg-white dark:bg-slate-700 text-slate-600 dark:text-slate-300 font-medium border border-slate-200 dark:border-slate-600 shrink-0">
                  {item.tasks} việc
                </span>
              </div>
              <div className="space-y-1.5 text-xs mt-3">
                <div className="flex justify-between items-center">
                  <span className="text-slate-500">Tỷ lệ đúng hạn SLA:</span>
                  <strong className={`font-bold ${item.sla >= 90 ? 'text-emerald-600 dark:text-emerald-400' : (item.sla >= 80 ? 'text-amber-600' : 'text-red-600')}`}>
                    {item.sla}%
                  </strong>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-500">Giờ công TB/việc:</span>
                  <strong className="text-slate-800 dark:text-slate-100 font-bold">{item.avgHours} giờ</strong>
                </div>
                <div className="w-full bg-slate-200 dark:bg-slate-700 h-1.5 rounded-full mt-2 overflow-hidden">
                  <div 
                    className="h-full rounded-full" 
                    style={{ 
                      width: `${item.sla}%`, 
                      backgroundColor: item.sla >= 90 ? '#10B981' : (item.sla >= 80 ? '#F59E0B' : '#EF4444') 
                    }} 
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
