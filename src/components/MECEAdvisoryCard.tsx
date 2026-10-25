import React, { useState } from 'react';
import { 
  Sparkles, 
  Copy, 
  Check, 
  Calendar, 
  Mail, 
  Download, 
  Lightbulb, 
  AlertTriangle, 
  TrendingUp, 
  CheckCircle2, 
  Clock, 
  ArrowRight,
  RotateCw,
  Cpu
} from 'lucide-react';
import { MECEInsight, GeminiModelId } from '../types/dashboard';

interface MECEAdvisoryCardProps {
  insight: MECEInsight;
  isLoading: boolean;
  progressMsg?: string;
  onRefresh: () => void;
  selectedModel: GeminiModelId;
  modelUsed: string;
  onExportExcel: () => void;
  scenarioTitle: string;
}

export const MECEAdvisoryCard: React.FC<MECEAdvisoryCardProps> = ({
  insight,
  isLoading,
  progressMsg,
  onRefresh,
  selectedModel,
  modelUsed,
  onExportExcel,
  scenarioTitle
}) => {
  const [copied, setCopied] = useState(false);

  // Copy MECE text to clipboard
  const handleCopy = () => {
    const text = `
=== ${insight.summary_kpis.title} ===
(Báo cáo Tham mưu Điều hành Chuẩn MECE 2026 - Nhà báo Đặng Sinh)

1. HIỆN TRẠNG & ĐIỂM SÁNG:
${insight.summary_kpis.executive_summary}
Chỉ số then chốt:
${insight.summary_kpis.key_metrics.map(m => `- ${m.label}: ${m.value} (${m.assessment})`).join('\n')}

2. CÁC INSIGHT ẨN TRONG DỮ LIỆU:
${insight.hidden_insights.map(h => `* ${h.title}: ${h.detail} (Bằng chứng: ${h.data_evidence})`).join('\n')}

3. NGUYÊN NHÂN GỐC RỄ & ĐIỂM NGHẼN:
${insight.root_causes.map(r => `* [${r.area}] ${r.bottleneck} -> Tác động: ${r.impact}`).join('\n')}

4. 3 GIẢI PHÁP ĐIỀU HÀNH THÁNG TỚI:
${insight.action_recommendations.map((a, i) => `${i + 1}. [${a.priority}] ${a.pillar}: ${a.immediate_action}\n   -> Kết quả kỳ vọng: ${a.expected_outcome}\n   -> Đơn vị chịu trách nhiệm: ${a.responsible_party}`).join('\n')}
    `.trim();

    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Google Calendar Integration
  const handleCreateGoogleCalendarEvent = () => {
    const eventTitle = encodeURIComponent(`[Họp Ban Lãnh Đạo] Rà soát KPI & Tham mưu Điều hành 2026`);
    const details = encodeURIComponent(
      `Cuộc họp Rà soát KPI & Điều hành theo Báo cáo Tham mưu AI (Nhà báo Đặng Sinh).\n\n` +
      `Trọng tâm: \n` +
      `- Xem xét hiện trạng: ${insight.summary_kpis.executive_summary.substring(0, 200)}...\n` +
      `- Tháo gỡ các điểm nghẽn và giao nhiệm vụ 3 giải pháp trọng tâm.`
    );
    const now = new Date();
    // Default meeting tomorrow at 09:00 AM
    const tomorrow = new Date(now.getTime() + 24 * 60 * 60 * 1000);
    const yyyy = tomorrow.getFullYear();
    const mm = String(tomorrow.getMonth() + 1).padStart(2, '0');
    const dd = String(tomorrow.getDate()).padStart(2, '0');
    const dates = `${yyyy}${mm}${dd}T090000/${yyyy}${mm}${dd}T103000`;

    const calUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${eventTitle}&dates=${dates}&details=${details}&location=Phòng Họp Trực tuyến / Trụ sở`;
    window.open(calUrl, '_blank');
  };

  // Gmail Direct Compose Integration
  const handleSendGmail = () => {
    const subject = encodeURIComponent(`[CHỈ ĐẠO ĐIỀU HÀNH] Báo cáo Tham mưu & Chỉ đạo Thực hiện KPI H1/2026`);
    const body = encodeURIComponent(
      `Kính gửi: Các Đơn vị, Ban Chuyên môn và Trưởng bộ phận,\n\n` +
      `Căn cứ dữ liệu điều hành tổng hợp H1/2026, Ban Lãnh đạo gửi tóm tắt Báo cáo Tham mưu MECE và các chỉ đạo trọng tâm:\n\n` +
      `1. ĐÁNH GIÁ CHUNG:\n${insight.summary_kpis.executive_summary}\n\n` +
      `2. CÁC ĐIỂM NGHẼN & INSIGHT CẦN LƯU Ý:\n` +
      insight.hidden_insights.map(h => `• ${h.title}: ${h.detail}`).join('\n') + `\n\n` +
      `3. 3 NHIỆM VỤ ĐIỀU HÀNH BẮT BUỘC THÁNG TỚI:\n` +
      insight.action_recommendations.map((a, i) => `${i + 1}. ${a.pillar}: ${a.immediate_action} (Đơn vị: ${a.responsible_party} - Ưu tiên: ${a.priority})`).join('\n') + `\n\n` +
      `Yêu cầu các đơn vị nghiêm túc triển khai và báo cáo tiến độ vào cuộc họp giao ban tới.\n\n` +
      `Trân trọng,\nBan Lãnh đạo & Tổ Tham mưu Dữ liệu AI`
    );
    const mailUrl = `https://mail.google.com/mail/?view=cm&fs=1&su=${subject}&body=${body}`;
    window.open(mailUrl, '_blank');
  };

  return (
    <div className="bg-white/95 dark:bg-slate-900/95 rounded-2xl border border-slate-200/90 dark:border-slate-800 shadow-glass overflow-hidden flex flex-col h-full">
      
      {/* Top Banner Header */}
      <div className="p-4 sm:p-5 bg-gradient-to-r from-[#1B365D] via-[#162e4f] to-[#008080] text-white flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-white/10 backdrop-blur-md ring-1 ring-white/20">
            <Sparkles className="w-5 h-5 text-teal-300 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="text-base font-extrabold tracking-tight">
                AI Tham Mưu Điều Hành (MECE Insights)
              </h2>
              <span className="px-2 py-0.5 rounded text-[11px] font-mono font-bold bg-teal-400/20 text-teal-200 border border-teal-300/30 flex items-center gap-1">
                <Cpu className="w-3 h-3" />
                {modelUsed || selectedModel}
              </span>
            </div>
            <p className="text-xs text-teal-100/80 mt-0.5">
              Phân tích đa chiều theo cấu trúc MECE: Hiện trạng → Nguyên nhân → Giải pháp
            </p>
          </div>
        </div>

        {/* Re-analyze Button */}
        <button
          onClick={onRefresh}
          disabled={isLoading}
          className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold text-white bg-teal-600 hover:bg-teal-500 active:scale-95 disabled:opacity-60 transition-all shadow-sm shrink-0 self-start sm:self-center"
        >
          <RotateCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
          <span>{isLoading ? 'Đang phân tích...' : '✨ Phân tích lại'}</span>
        </button>
      </div>

      {/* Skeleton Loading State with Step-by-step Shimmer */}
      {isLoading ? (
        <div className="p-6 space-y-4 animate-pulse">
          <div className="flex items-center gap-3 p-3.5 rounded-xl bg-teal-50 dark:bg-teal-950/40 border border-teal-200 dark:border-teal-800 text-teal-800 dark:text-teal-200 text-xs font-medium">
            <RotateCw className="w-4 h-4 animate-spin text-teal-600" />
            <span>{progressMsg || 'Gemini 3.8 Flash đang tổng hợp số liệu và bóc tách các insight ẩn...'}</span>
          </div>

          <div className="h-6 bg-slate-200 dark:bg-slate-800 rounded w-3/4" />
          <div className="space-y-2">
            <div className="h-4 bg-slate-100 dark:bg-slate-800/60 rounded w-full" />
            <div className="h-4 bg-slate-100 dark:bg-slate-800/60 rounded w-5/6" />
            <div className="h-4 bg-slate-100 dark:bg-slate-800/60 rounded w-4/6" />
          </div>

          <div className="grid grid-cols-2 gap-3 pt-2">
            <div className="h-20 bg-slate-100 dark:bg-slate-800/60 rounded-xl" />
            <div className="h-20 bg-slate-100 dark:bg-slate-800/60 rounded-xl" />
          </div>

          <div className="h-24 bg-slate-100 dark:bg-slate-800/60 rounded-xl mt-4" />
        </div>
      ) : (
        <div className="p-5 space-y-6 flex-1 overflow-y-auto">
          
          {/* 1. Tầng 1: Hiện trạng & Tóm tắt điều hành */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <span className="w-6 h-6 rounded-lg bg-[#1B365D] text-white flex items-center justify-center text-xs font-bold">1</span>
              <h3 className="text-xs font-extrabold text-slate-800 dark:text-slate-200 uppercase tracking-wider">
                Hiện Trạng & Đánh Giá Tổng Thể
              </h3>
            </div>

            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed bg-slate-50 dark:bg-slate-800/50 p-3.5 rounded-xl border border-slate-200 dark:border-slate-800">
              {insight.summary_kpis.executive_summary}
            </p>

            {/* Key Metrics Pills */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
              {insight.summary_kpis.key_metrics.map((km, idx) => (
                <div key={idx} className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-700/60 flex items-start justify-between">
                  <div>
                    <span className="text-[11px] text-slate-500 dark:text-slate-400 block">{km.label}</span>
                    <strong className="text-xs sm:text-sm font-bold text-[#1B365D] dark:text-teal-400">{km.value}</strong>
                  </div>
                  <span className="text-[10px] font-semibold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded-full border border-emerald-200 dark:border-emerald-800">
                    {km.assessment}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* 2. Tầng 2: 4 Insight Ẩn Trong Dữ Liệu (Hidden Insights) */}
          <div className="space-y-3 pt-2 border-t border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-2">
              <span className="w-6 h-6 rounded-lg bg-teal-700 text-white flex items-center justify-center text-xs font-bold">2</span>
              <h3 className="text-xs font-extrabold text-slate-800 dark:text-slate-200 uppercase tracking-wider">
                Phát Hiện Insight Ẩn (Data Evidence)
              </h3>
            </div>

            <div className="space-y-2.5">
              {insight.hidden_insights.map((item, idx) => {
                const isRisk = item.type === 'risk';
                const isOpp = item.type === 'opportunity';
                const isParadox = item.type === 'paradox';

                return (
                  <div 
                    key={idx}
                    className={`p-3.5 rounded-xl border text-xs transition-colors ${
                      isRisk 
                        ? 'bg-red-50/50 dark:bg-red-950/20 border-red-200 dark:border-red-900/40' 
                        : isParadox
                        ? 'bg-amber-50/50 dark:bg-amber-950/20 border-amber-200 dark:border-amber-900/40'
                        : 'bg-teal-50/50 dark:bg-teal-950/20 border-teal-200 dark:border-teal-900/40'
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-1.5">
                      {isRisk ? (
                        <AlertTriangle className="w-3.5 h-3.5 text-red-600 dark:text-red-400 shrink-0" />
                      ) : isParadox ? (
                        <Lightbulb className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400 shrink-0" />
                      ) : (
                        <CheckCircle2 className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400 shrink-0" />
                      )}
                      <h4 className="font-bold text-slate-900 dark:text-white">
                        {item.title}
                      </h4>
                      <span className={`ml-auto text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${
                        isRisk ? 'bg-red-100 dark:bg-red-900/40 text-red-700 dark:text-red-300' :
                        isParadox ? 'bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-300' :
                        'bg-teal-100 dark:bg-teal-900/40 text-teal-700 dark:text-teal-300'
                      }`}>
                        {item.type}
                      </span>
                    </div>

                    <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-2">
                      {item.detail}
                    </p>

                    <div className="pt-2 border-t border-slate-200/50 dark:border-slate-700/50 flex items-center gap-1.5 text-[11px] text-slate-500 dark:text-slate-400">
                      <strong className="text-slate-700 dark:text-slate-300 font-semibold">Bằng chứng dữ liệu:</strong>
                      <span>{item.data_evidence}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* 3. Tầng 3: Nguyên nhân gốc rễ (Root Causes) */}
          <div className="space-y-3 pt-2 border-t border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-2">
              <span className="w-6 h-6 rounded-lg bg-amber-600 text-white flex items-center justify-center text-xs font-bold">3</span>
              <h3 className="text-xs font-extrabold text-slate-800 dark:text-slate-200 uppercase tracking-wider">
                Nguyên Nhân Gốc Rễ & Điểm Nghẽn
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {insight.root_causes.map((rc, idx) => (
                <div key={idx} className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700/70 text-xs">
                  <div className="flex items-center gap-1.5 text-amber-700 dark:text-amber-400 font-bold mb-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                    <span>[{rc.area}] {rc.bottleneck}</span>
                  </div>
                  <p className="text-slate-600 dark:text-slate-300 text-[11px] leading-relaxed mb-1.5">
                    <strong>Tác nhân:</strong> {rc.underlying_driver}
                  </p>
                  <p className="text-slate-500 dark:text-slate-400 text-[10px]">
                    <strong>Hệ quả:</strong> {rc.impact}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* 4. Tầng 4: 3 Giải pháp điều hành tháng tới (Action Recommendations) */}
          <div className="space-y-3 pt-2 border-t border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-2">
              <span className="w-6 h-6 rounded-lg bg-emerald-600 text-white flex items-center justify-center text-xs font-bold">4</span>
              <h3 className="text-xs font-extrabold text-slate-800 dark:text-slate-200 uppercase tracking-wider">
                3 Giải Pháp Điều Hành Tháng Tới
              </h3>
            </div>

            <div className="space-y-2.5">
              {insight.action_recommendations.map((action, idx) => (
                <div key={idx} className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 shadow-xs text-xs space-y-1.5">
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="w-5 h-5 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 font-bold flex items-center justify-center text-[10px]">
                        {idx + 1}
                      </span>
                      <strong className="text-slate-900 dark:text-white font-bold">{action.pillar}</strong>
                    </div>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                      action.priority === 'Khẩn cấp' 
                        ? 'bg-red-100 dark:bg-red-950/40 text-red-700 dark:text-red-300 border border-red-200' 
                        : 'bg-emerald-100 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200'
                    }`}>
                      {action.priority}
                    </span>
                  </div>

                  <p className="text-slate-700 dark:text-slate-200 font-medium pl-7">
                    {action.immediate_action}
                  </p>

                  <div className="pl-7 pt-1 flex flex-col sm:flex-row sm:items-center justify-between text-[11px] text-slate-500 dark:text-slate-400 gap-1">
                    <span><strong>Kỳ vọng:</strong> {action.expected_outcome}</span>
                    <span className="text-teal-600 dark:text-teal-400 font-semibold">Phụ trách: {action.responsible_party}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      )}

      {/* Action Toolbar Bottom Buttons */}
      <div className="p-3.5 bg-slate-50 dark:bg-slate-800/60 border-t border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-2 text-xs">
        
        {/* Copy Button */}
        <button
          onClick={handleCopy}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-semibold bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-600 hover:bg-slate-100 dark:hover:bg-slate-600 transition-colors shadow-xs"
        >
          {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
          <span>{copied ? 'Đã sao chép!' : 'Sao chép Báo cáo'}</span>
        </button>

        <div className="flex items-center gap-2">
          {/* Google Calendar Link */}
          <button
            onClick={handleCreateGoogleCalendarEvent}
            title="Tạo lịch họp rà soát KPI trên Google Calendar"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-semibold bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800 hover:bg-blue-100 dark:hover:bg-blue-900/40 transition-colors"
          >
            <Calendar className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
            <span>Lịch họp Google</span>
          </button>

          {/* Gmail Direct Link */}
          <button
            onClick={handleSendGmail}
            title="Soạn thư chỉ đạo gửi Gmail"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-semibold bg-red-50 dark:bg-red-950/40 text-red-700 dark:text-red-300 border border-red-200 dark:border-red-800 hover:bg-red-100 dark:hover:bg-red-900/40 transition-colors"
          >
            <Mail className="w-3.5 h-3.5 text-red-600 dark:text-red-400" />
            <span>Gửi Gmail Chỉ Đạo</span>
          </button>
        </div>

      </div>

    </div>
  );
};
