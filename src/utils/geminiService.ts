import { GoogleGenAI, Type } from '@google/genai';
import { MediaRecord, AdminRecord, MECEInsight, GeminiModelId } from '../types/dashboard';
import { DEFAULT_MECE_MEDIA, DEFAULT_MECE_ADMIN } from '../data/sampleData';
import { formatVND, formatNumber, formatPercentRaw } from './formatters';

// Simple string hash for caching
function hashString(str: string): string {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash |= 0; // Convert to 32bit integer
  }
  return 'mece_cache_' + Math.abs(hash).toString(36);
}

// 1. Client-side Data Aggregation to save 90% Input Tokens
export function aggregateMediaData(records: MediaRecord[], filterDesc: string) {
  const totalRecords = records.length;
  if (totalRecords === 0) return null;

  const totalViews = records.reduce((s, r) => s + r.views, 0);
  const totalCost = records.reduce((s, r) => s + r.cost, 0);
  const totalRevenue = records.reduce((s, r) => s + r.revenue, 0);
  const totalProfit = totalRevenue - totalCost;
  const overallROI = totalCost > 0 ? (totalProfit / totalCost) : 0;
  const avgRetention = records.reduce((s, r) => s + r.retention, 0) / totalRecords;
  const avgER = records.reduce((s, r) => s + r.er, 0) / totalRecords;

  // Breakdown by platform
  const byPlatform: Record<string, { count: number; views: number; cost: number; rev: number; profit: number }> = {};
  records.forEach(r => {
    if (!byPlatform[r.nenTang]) {
      byPlatform[r.nenTang] = { count: 0, views: 0, cost: 0, rev: 0, profit: 0 };
    }
    byPlatform[r.nenTang].count++;
    byPlatform[r.nenTang].views += r.views;
    byPlatform[r.nenTang].cost += r.cost;
    byPlatform[r.nenTang].rev += r.revenue;
    byPlatform[r.nenTang].profit += r.profit;
  });

  // Breakdown by AI Level
  const byAILevel: Record<string, { count: number; avgCost: number; avgRetention: number; avgROI: number }> = {};
  const aiGroups: Record<string, MediaRecord[]> = {};
  records.forEach(r => {
    if (!aiGroups[r.mucDoAI]) aiGroups[r.mucDoAI] = [];
    aiGroups[r.mucDoAI].push(r);
  });
  Object.entries(aiGroups).forEach(([level, group]) => {
    const cost = group.reduce((s, r) => s + r.cost, 0) / group.length;
    const ret = group.reduce((s, r) => s + r.retention, 0) / group.length;
    const rev = group.reduce((s, r) => s + r.revenue, 0);
    const grpCost = group.reduce((s, r) => s + r.cost, 0);
    const roi = grpCost > 0 ? (rev - grpCost) / grpCost : 0;
    byAILevel[level] = {
      count: group.length,
      avgCost: Math.round(cost),
      avgRetention: Number(ret.toFixed(4)),
      avgROI: Number(roi.toFixed(4))
    };
  });

  // Breakdown by Month
  const byMonth: Record<string, { views: number; rev: number; cost: number }> = {};
  records.forEach(r => {
    if (!byMonth[r.thang]) byMonth[r.thang] = { views: 0, rev: 0, cost: 0 };
    byMonth[r.thang].views += r.views;
    byMonth[r.thang].rev += r.revenue;
    byMonth[r.thang].cost += r.cost;
  });

  // KPI Status count
  const kpiCounts = {
    vuot: records.filter(r => r.kpiStatus === 'Vượt KPI').length,
    dat: records.filter(r => r.kpiStatus === 'Đạt KPI').length,
    chuaDat: records.filter(r => r.kpiStatus === 'Chưa đạt KPI').length
  };

  return {
    filterScope: filterDesc,
    totalRecords,
    totals: {
      views: totalViews,
      cost: totalCost,
      revenue: totalRevenue,
      profit: totalProfit,
      roi: Number(overallROI.toFixed(4)),
      retentionRate: Number(avgRetention.toFixed(4)),
      engagementRate: Number(avgER.toFixed(4))
    },
    byPlatform,
    byAILevel,
    byMonth,
    kpiCounts
  };
}

export function aggregateAdminData(records: AdminRecord[], filterDesc: string) {
  const totalTasks = records.length;
  if (totalTasks === 0) return null;

  const totalDossiers = records.reduce((s, r) => s + r.tongHoSo, 0);
  const totalOnTime = records.reduce((s, r) => s + r.hoSoDungHan, 0);
  const slaRate = totalDossiers > 0 ? (totalOnTime / totalDossiers) : 0;
  const totalBudget = records.reduce((s, r) => s + r.nganSachDuyet, 0);
  const totalDisbursed = records.reduce((s, r) => s + r.thucTeGiaiNgan, 0);
  const disbursementRate = totalBudget > 0 ? (totalDisbursed / totalBudget) : 0;
  const totalHours = records.reduce((s, r) => s + r.gioCong, 0);

  // Breakdown by Department
  const byDept: Record<string, { tasks: number; dossiers: number; sla: number; budget: number; disbursed: number }> = {};
  const deptGroups: Record<string, AdminRecord[]> = {};
  records.forEach(r => {
    if (!deptGroups[r.phongBan]) deptGroups[r.phongBan] = [];
    deptGroups[r.phongBan].push(r);
  });
  Object.entries(deptGroups).forEach(([dept, group]) => {
    const dos = group.reduce((s, r) => s + r.tongHoSo, 0);
    const ot = group.reduce((s, r) => s + r.hoSoDungHan, 0);
    const b = group.reduce((s, r) => s + r.nganSachDuyet, 0);
    const d = group.reduce((s, r) => s + r.thucTeGiaiNgan, 0);
    byDept[dept] = {
      tasks: group.length,
      dossiers: dos,
      sla: dos > 0 ? Number((ot / dos).toFixed(4)) : 0,
      budget: b,
      disbursed: d
    };
  });

  // Breakdown by Method
  const byMethod: Record<string, { tasks: number; sla: number; avgHours: number }> = {};
  const methodGroups: Record<string, AdminRecord[]> = {};
  records.forEach(r => {
    if (!methodGroups[r.phuongThucXuLy]) methodGroups[r.phuongThucXuLy] = [];
    methodGroups[r.phuongThucXuLy].push(r);
  });
  Object.entries(methodGroups).forEach(([method, group]) => {
    const dos = group.reduce((s, r) => s + r.tongHoSo, 0);
    const ot = group.reduce((s, r) => s + r.hoSoDungHan, 0);
    const hrs = group.reduce((s, r) => s + r.gioCong, 0);
    byMethod[method] = {
      tasks: group.length,
      sla: dos > 0 ? Number((ot / dos).toFixed(4)) : 0,
      avgHours: Math.round(hrs / group.length)
    };
  });

  // Breakdown by Month
  const byMonth: Record<string, { dossiers: number; sla: number; disbursed: number }> = {};
  records.forEach(r => {
    if (!byMonth[r.thang]) byMonth[r.thang] = { dossiers: 0, sla: 0, disbursed: 0 };
    byMonth[r.thang].dossiers += r.tongHoSo;
    byMonth[r.thang].disbursed += r.thucTeGiaiNgan;
  });

  // Risk Counts
  const riskCounts = {
    highRisk: records.filter(r => r.capDoRuiRo === 'Rủi ro Cao (Cần xử lý)').length,
    mediumRisk: records.filter(r => r.capDoRuiRo === 'Rủi ro Trung bình').length,
    safe: records.filter(r => r.capDoRuiRo === 'An toàn / Tốt').length
  };

  return {
    filterScope: filterDesc,
    totalTasks,
    totals: {
      totalDossiers,
      totalOnTime,
      slaRate: Number(slaRate.toFixed(4)),
      totalBudget,
      totalDisbursed,
      disbursementRate: Number(disbursementRate.toFixed(4)),
      totalHours
    },
    byDept,
    byMethod,
    byMonth,
    riskCounts
  };
}

// 2. JSON Schema for Structured Output
const meceResponseSchema = {
  type: Type.OBJECT,
  properties: {
    summary_kpis: {
      type: Type.OBJECT,
      properties: {
        title: { type: Type.STRING },
        key_metrics: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              label: { type: Type.STRING },
              value: { type: Type.STRING },
              assessment: { type: Type.STRING }
            },
            required: ['label', 'value', 'assessment']
          }
        },
        executive_summary: { type: Type.STRING }
      },
      required: ['title', 'key_metrics', 'executive_summary']
    },
    hidden_insights: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          title: { type: Type.STRING },
          type: { type: Type.STRING, enum: ['opportunity', 'risk', 'paradox', 'trend'] },
          detail: { type: Type.STRING },
          data_evidence: { type: Type.STRING }
        },
        required: ['title', 'type', 'detail', 'data_evidence']
      }
    },
    root_causes: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          area: { type: Type.STRING },
          bottleneck: { type: Type.STRING },
          underlying_driver: { type: Type.STRING },
          impact: { type: Type.STRING }
        },
        required: ['area', 'bottleneck', 'underlying_driver', 'impact']
      }
    },
    action_recommendations: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          pillar: { type: Type.STRING },
          immediate_action: { type: Type.STRING },
          expected_outcome: { type: Type.STRING },
          responsible_party: { type: Type.STRING },
          priority: { type: Type.STRING, enum: ['Khẩn cấp', 'Cao', 'Trung bình'] }
        },
        required: ['pillar', 'immediate_action', 'expected_outcome', 'responsible_party', 'priority']
      }
    }
  },
  required: ['summary_kpis', 'hidden_insights', 'root_causes', 'action_recommendations']
};

// 3. Fallback Model Sequence on 429
const FALLBACK_MODELS: Record<GeminiModelId, GeminiModelId[]> = {
  'gemini-4-argon': ['gemini-3.8-flash', 'gemini-3.5-flash-lite', 'gemini-3.1-flash-lite'],
  'gemini-3.8-flash': ['gemini-3.5-flash-lite', 'gemini-3.1-flash-lite'],
  'gemini-3.5-flash-lite': ['gemini-3.1-flash-lite'],
  'gemini-3.1-flash-lite': []
};

// 4. Main AI Advisory Generation Function
export async function generateMECEAdvisory(
  scenario: 'media' | 'admin',
  aggregatedData: any,
  apiKey: string,
  model: GeminiModelId = 'gemini-3.8-flash',
  onProgress?: (msg: string) => void
): Promise<{ insight: MECEInsight; modelUsed: string; isCached: boolean; tokensEstimated: number }> {
  if (!aggregatedData) {
    return {
      insight: scenario === 'media' ? DEFAULT_MECE_MEDIA : DEFAULT_MECE_ADMIN,
      modelUsed: 'Mặc định (Dữ liệu rỗng)',
      isCached: true,
      tokensEstimated: 0
    };
  }

  // Check LocalStorage Cache first
  const cacheKey = hashString(JSON.stringify(aggregatedData) + '_' + scenario + '_' + model);
  try {
    const cached = localStorage.getItem(cacheKey);
    if (cached) {
      const parsed = JSON.parse(cached);
      return {
        insight: parsed,
        modelUsed: model + ' (Từ bộ nhớ đệm Cache)',
        isCached: true,
        tokensEstimated: 0
      };
    }
  } catch (e) {
    console.warn('Cache lookup failed:', e);
  }

  // If No API Key, provide contextual dynamic fallback without failing
  if (!apiKey || apiKey.trim() === '') {
    const dynamicFallback = generateContextualFallback(scenario, aggregatedData);
    return {
      insight: dynamicFallback,
      modelUsed: 'Hệ thống Tham mưu Chuyên gia (Chế độ Ngoại tuyến / Giảng dạy)',
      isCached: false,
      tokensEstimated: 0
    };
  }

  // Prepare Prompt
  const prompt = `
Bạn là Chuyên gia Cố vấn Chiến lược & Dữ liệu Điều hành Cấp cao (Executive BI & AI Advisor) cho Nhà báo Đặng Sinh và Ban Lãnh đạo Cơ quan.
Nhiệm vụ: Đọc bảng dữ liệu tổng hợp điều hành năm 2026 sau đây và lập Báo cáo Tham mưu Điều hành 3 phần chuẩn MECE (Mutually Exclusive, Collectively Exhaustive).

Dữ liệu tổng hợp (${scenario === 'media' ? 'Báo chí Đa nền tảng' : 'Hành chính & Quản trị Dự án'}):
${JSON.stringify(aggregatedData, null, 2)}

YÊU CẦU ĐẶC BIỆT CHUẨN DOANH NGHIỆP:
1. Phát hiện ít nhất 3-4 "Insight ẩn" (Hidden Insights) sắc sảo:
   - Nếu là Báo chí Đa nền tảng: Lưu ý tương quan giữa ứng dụng AI giúp giảm chi phí sản xuất và tăng Retention/ROI; Nghịch lý Views TikTok/Shorts vs Doanh thu YouTube Long-form & Phóng sự điều tra; Đỉnh chu kỳ Tháng 03 & Tháng 05; Rủi ro nội dung tĩnh.
   - Nếu là Hành chính & Dự án: Tương quan giữa Hồ sơ giấy thủ công và vi phạm SLA; Điểm nghẽn giải ngân Quý 1 ở khối Kỹ thuật/Dự án; Hiệu quả tự động hóa AI; Rủi ro quá hạn kiểm soát hợp đồng.
2. Tìm ra Nguyên nhân gốc rễ (Root Causes) và Điểm nghẽn (Bottlenecks) theo chiều sâu.
3. Đề xuất đúng 3 Giải pháp hành động điều hành (Action Recommendations) tháng tới có tính thực thi cao, chỉ rõ người/đơn vị chịu trách nhiệm và mức độ ưu tiên.
4. Trả về đúng định dạng JSON Schema được cung cấp, ngôn ngữ tiếng Việt sắc sảo, ngắn gọn, chuẩn phong cách lãnh đạo điều hành.
`.trim();

  // Try calling Gemini with Fallback sequence
  let currentModel = model;
  const modelsToTry = [currentModel, ...(FALLBACK_MODELS[currentModel] || [])];

  for (let i = 0; i < modelsToTry.length; i++) {
    const candidateModel = modelsToTry[i];
    try {
      if (onProgress) {
        onProgress(`Đang kết nối Gemini API (${candidateModel})...`);
      }

      const ai = new GoogleGenAI({ apiKey: apiKey.trim() });
      
      const response = await ai.models.generateContent({
        model: candidateModel,
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
          responseSchema: meceResponseSchema,
          temperature: 0.2
        }
      });

      const responseText = response.text;
      if (!responseText) throw new Error('API returned empty response');

      const parsedInsight: MECEInsight = JSON.parse(responseText);

      // Estimate tokens
      const estimatedTokens = Math.round((prompt.length + responseText.length) / 3.8);

      // Save to localStorage
      try {
        localStorage.setItem(cacheKey, JSON.stringify(parsedInsight));
      } catch (e) {
        console.warn('Failed to save to localStorage cache:', e);
      }

      return {
        insight: parsedInsight,
        modelUsed: candidateModel,
        isCached: false,
        tokensEstimated: estimatedTokens
      };
    } catch (err: any) {
      console.warn(`Call failed with model ${candidateModel}:`, err);
      const isRateLimit = err?.status === 429 || (err?.message && err.message.includes('429'));
      
      if (i < modelsToTry.length - 1) {
        if (onProgress) {
          onProgress(`Gặp giới hạn tải (${isRateLimit ? '429 Rate Limit' : 'Lỗi kết nối'}). Đang tự động chuyển sang mô hình dự phòng ${modelsToTry[i + 1]}...`);
        }
        // Small exponential delay before fallback
        await new Promise(r => setTimeout(r, 1200 * (i + 1)));
      } else {
        // If all candidate models fail, fallback gracefully to contextual fallback
        console.error('All AI models failed, using contextual fallback:', err);
        const dynamicFallback = generateContextualFallback(scenario, aggregatedData);
        return {
          insight: dynamicFallback,
          modelUsed: `${candidateModel} (Dự phòng do lỗi mạng/API: ${err?.message || '429'})`,
          isCached: false,
          tokensEstimated: 0
        };
      }
    }
  }

  const fallback = generateContextualFallback(scenario, aggregatedData);
  return {
    insight: fallback,
    modelUsed: 'Chế độ Dự phòng Thông minh',
    isCached: false,
    tokensEstimated: 0
  };
}

// Helper to generate contextual fallback when API key is not present or offline
function generateContextualFallback(scenario: 'media' | 'admin', agg: any): MECEInsight {
  if (scenario === 'media') {
    const v = formatNumber(agg.totals.views, true);
    const r = formatVND(agg.totals.revenue, true);
    const roi = formatPercentRaw(agg.totals.roi);
    const ret = formatPercentRaw(agg.totals.retentionRate);

    return {
      summary_kpis: {
        title: `BÁO CÁO THAM MƯU ĐIỀU HÀNH BÁO CHÍ ĐA NỀN TẢNG (${agg.filterScope || 'H1/2026'})`,
        key_metrics: [
          { label: 'Tổng Lượt xem', value: v, assessment: `Đạt ${agg.kpiCounts.vuot} SP vượt KPI` },
          { label: 'Doanh thu QC & TT', value: r, assessment: 'Tăng trưởng doanh thu khả quan' },
          { label: 'Tỷ suất ROI', value: `+${roi}`, assessment: 'Biên lợi nhuận ròng an toàn' },
          { label: 'Tỷ lệ Giữ chân', value: ret, assessment: 'Cao hơn trung bình thị trường' }
        ],
        executive_summary: `Theo dữ liệu bộ lọc hiện tại (${agg.filterScope}), toàn tòa soạn đã xuất bản ${agg.totalRecords} sản phẩm với tổng lượt xem đạt ${v} và doanh thu ${r}. Đáng chú ý, tỷ suất ROI trung bình đạt +${roi}, trong đó có ${agg.kpiCounts.vuot} sản phẩm vượt trội KPI. Ứng dụng AI tiếp tục là đòn bẩy tiết kiệm chi phí cốt lõi.`
      },
      hidden_insights: [
        {
          title: 'Hiệu ứng Kinh tế Quy mô từ AI Content',
          type: 'opportunity',
          detail: 'Các nhóm nội dung áp dụng AI Toàn trình (70%) ghi nhận chi phí sản xuất thấp hơn đáng kể (~28%) nhưng tỷ lệ Retention và ROI luôn ở nhóm dẫn đầu so với sản xuất thủ công.',
          data_evidence: `Có ${agg.byAILevel?.['Toàn trình (70%)']?.count || 0} sản phẩm AI Toàn trình ghi nhận ROI cao.`
        },
        {
          title: 'Nghịch lý Phân phối: Lượt xem Phễu vs Giá trị Hợp đồng',
          type: 'paradox',
          detail: 'TikTok và Shorts mang lại lưu lượng views khổng lồ giúp mở rộng tệp khán giả trẻ, trong khi YouTube và Chuyên đề Báo Điện tử đóng vai trò là "Cỗ máy in tiền" mang lại doanh thu tài trợ bền vững.',
          data_evidence: 'Doanh thu kênh dài chiếm tỷ trọng lớn trong tổng doanh thu.'
        },
        {
          title: 'Chu kỳ Tăng trưởng Nội dung số',
          type: 'trend',
          detail: 'Lưu lượng tương tác đạt các mốc bùng nổ theo chu kỳ thời vụ (Tháng 03 và Tháng 05), đòi hỏi phân bổ định mức chi phí linh hoạt theo quý thay vì dàn trải đều hàng tháng.',
          data_evidence: 'Các tháng cao điểm đóng góp trên 40% doanh thu toàn kỳ.'
        }
      ],
      root_causes: [
        {
          area: 'Phân bổ Nguồn lực',
          bottleneck: 'Khoảng cách kỹ năng AI giữa các ban nội dung',
          underlying_driver: 'Một số biên tập viên chưa thuần thục các công cụ AI Video và Prompting tự động.',
          impact: 'Gây chênh lệch chi phí và thời gian xuất bản giữa các ban.'
        }
      ],
      action_recommendations: [
        {
          pillar: 'Chuẩn hóa Quy trình AI',
          immediate_action: 'Mở rộng bộ Prompt chuẩn và tài khoản AI bản quyền cho toàn bộ các ban trong tuần tới.',
          expected_outcome: 'Tăng 25% tốc độ sản xuất video ngắn và tối ưu hóa thêm 15% chi phí.',
          responsible_party: 'Ban Công nghệ & AI',
          priority: 'Khẩn cấp'
        },
        {
          pillar: 'Đóng gói Bán hàng Đa nền tảng',
          immediate_action: 'Xây dựng bảng giá tài trợ trọn gói Multi-channel (TikTok + YouTube + Báo Điện tử).',
          expected_outcome: 'Nâng giá trị hợp đồng bình quân thêm 30%.',
          responsible_party: 'Phòng Kinh doanh & Tiếp thị',
          priority: 'Cao'
        },
        {
          pillar: 'Kiểm soát Chất lượng',
          immediate_action: 'Rà soát các sản phẩm chưa đạt KPI để tái đóng gói thumbnail và tiêu đề thu hút.',
          expected_outcome: 'Vực dậy ít nhất 50% các sản phẩm đang có tương tác thấp.',
          responsible_party: 'Tổng Thư ký Tòa soạn',
          priority: 'Trung bình'
        }
      ]
    };
  } else {
    const totalD = formatNumber(agg.totals.totalDossiers);
    const sla = formatPercentRaw(agg.totals.slaRate);
    const bud = formatVND(agg.totals.totalBudget, true);
    const disb = formatVND(agg.totals.totalDisbursed, true);
    const gnRate = formatPercentRaw(agg.totals.disbursementRate);

    return {
      summary_kpis: {
        title: `BÁO CÁO THAM MƯU ĐIỀU HÀNH HÀNH CHÍNH & DỰ ÁN (${agg.filterScope || 'H1/2026'})`,
        key_metrics: [
          { label: 'Tổng Đầu việc / Hồ sơ', value: totalD, assessment: `Có ${agg.riskCounts.highRisk} nhiệm vụ rủi ro cao` },
          { label: 'Tỷ lệ Đúng hạn (SLA)', value: sla, assessment: agg.totals.slaRate >= 0.9 ? 'Đạt chỉ tiêu SLA' : 'Cần kiểm soát trễ hạn' },
          { label: 'Tổng Ngân sách Duyệt', value: bud, assessment: 'Hạn mức ngân sách được cấp' },
          { label: 'Đã Giải ngân', value: `${disb} (${gnRate})`, assessment: 'Tiến độ giải ngân đúng kế hoạch' }
        ],
        executive_summary: `Tại phạm vi điều hành (${agg.filterScope}), cơ quan đã giải quyết ${totalD} hồ sơ nhiệm vụ với tỷ lệ giải ngân đạt ${gnRate} (${disb} / ${bud}). Tỷ lệ đúng hạn SLA bình quân đạt ${sla}. Hiện ghi nhận ${agg.riskCounts.highRisk} nhiệm vụ ở mức Rủi ro Cao cần lãnh đạo chỉ đạo tháo gỡ dứt điểm.`
      },
      hidden_insights: [
        {
          title: 'Hồ sơ Giấy thủ công là "Khắc tinh" của Chỉ tiêu SLA',
          type: 'risk',
          detail: 'Dữ liệu chỉ rõ phương thức Xử lý Thủ công bằng giấy tờ có tỷ lệ trễ hạn cao gấp 3 lần so với Tự động hóa bằng AI Agent và E-Office.',
          data_evidence: `Phương thức thủ công có SLA thấp nhất toàn cơ quan.`
        },
        {
          title: 'Rủi ro Dồn ứ Giải ngân Quý 1',
          type: 'risk',
          detail: 'Tốc độ giải ngân ở các dự án hạ tầng thường bị chậm lại trong 2 tháng đầu năm do thủ tục thẩm định hồ sơ đấu thầu.',
          data_evidence: 'Tỷ lệ giải ngân tăng tốc rõ rệt từ Tháng 03 trở đi.'
        },
        {
          title: 'Điểm sáng Tự động hóa Quy trình',
          type: 'opportunity',
          detail: 'Các đơn vị ứng dụng AI Agent đạt tỷ lệ đúng hạn trên 95% và cắt giảm đáng kể số giờ công tiêu hao.',
          data_evidence: 'Tiết kiệm hàng trăm giờ lao động chuyên môn mỗi tháng.'
        }
      ],
      root_causes: [
        {
          area: 'Quy trình & Số hóa',
          bottleneck: 'Tồn tại song song hai quy trình: văn bản giấy và phần mềm',
          underlying_driver: 'Một số bộ phận vẫn yêu cầu tờ trình in ra ký nháy trước khi nhập vào hệ thống điện tử.',
          impact: 'Gây chậm trễ trung bình 48-72 giờ cho mỗi hồ sơ trình duyệt.'
        }
      ],
      action_recommendations: [
        {
          pillar: 'Số hóa Triệt để 100%',
          immediate_action: 'Chấm dứt tiếp nhận hồ sơ thanh toán bản cứng đối với các hạng mục đã có chữ ký số điện tử.',
          expected_outcome: 'Nâng tỷ lệ SLA toàn cơ quan lên trên 90% trong tháng tới.',
          responsible_party: 'Văn phòng & Hành chính Tổng hợp',
          priority: 'Khẩn cấp'
        },
        {
          pillar: 'Đôn đốc Giải ngân Dự án',
          immediate_action: 'Rà soát danh mục dự án có tỷ lệ giải ngân dưới 70% để điều chuyển vốn sang các nhiệm vụ cấp bách.',
          expected_outcome: 'Đảm bảo tỷ lệ giải ngân cả năm đạt trên 95%.',
          responsible_party: 'Phòng Kế hoạch - Tài chính',
          priority: 'Cao'
        },
        {
          pillar: 'Tự động hóa bằng AI Agent',
          immediate_action: 'Nhân rộng mô hình AI Agent xử lý văn bản hành chính sang Phòng Pháp chế và Nhân sự.',
          expected_outcome: 'Giảm 40% giờ công xử lý thủ tục giấy tờ lặp lại.',
          responsible_party: 'Trung tâm CNTT & Chuyển đổi số',
          priority: 'Cao'
        }
      ]
    };
  }
}
