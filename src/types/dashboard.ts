export interface MediaRecord {
  maSP: string;
  ngayXuatBan: string;
  thang: string;
  quy: string;
  banChuyenMon: string;
  tacGia: string;
  nenTang: string;
  dinhDang: string;
  chuyenMuc: string;
  mucDoAI: string;
  views: number;
  interactions: number;
  er: number;
  avgDuration: number;
  retention: number;
  cost: number;
  revenue: number;
  profit: number;
  roi: number;
  kpiStatus: 'Vượt KPI' | 'Đạt KPI' | 'Chưa đạt KPI';
}

export interface AdminRecord {
  maNV: string;
  ngayGiaoViec: string;
  thang: string;
  phongBan: string;
  canBo: string;
  nhomNghiepVu: string;
  mucDoUuTien: string;
  phuongThucXuLy: string;
  tongHoSo: number;
  hoSoDungHan: number;
  slaRate: number;
  nganSachDuyet: number;
  thucTeGiaiNgan: number;
  tyLeGiaiNgan: number;
  chenhLechNganSach: number;
  gioCong: number;
  trangThai: string;
  capDoRuiRo: 'Rủi ro Cao (Cần xử lý)' | 'Rủi ro Trung bình' | 'An toàn / Tốt';
}

export interface KPIChannel {
  maKenh: string;
  nenTang: string;
  kpiViews: number;
  kpiRevenue: number;
  costLimit: number;
  weight: number;
}

export interface KPIDepartment {
  maDonVi: string;
  phongBan: string;
  targetSLA: number;
  budgetLimit: number;
  aiTarget: number;
  leader: string;
}

export interface FilterState {
  thang: string;
  banHoacPhongBan: string;
  nenTang: string;
  mucDoAI: string;
  trangThaiKPI: string;
  searchQuery: string;
}

export interface MECEInsight {
  summary_kpis: {
    title: string;
    key_metrics: Array<{ label: string; value: string; assessment: string }>;
    executive_summary: string;
  };
  hidden_insights: Array<{
    title: string;
    type: 'opportunity' | 'risk' | 'paradox' | 'trend';
    detail: string;
    data_evidence: string;
  }>;
  root_causes: Array<{
    area: string;
    bottleneck: string;
    underlying_driver: string;
    impact: string;
  }>;
  action_recommendations: Array<{
    pillar: string;
    immediate_action: string;
    expected_outcome: string;
    responsible_party: string;
    priority: 'Khẩn cấp' | 'Cao' | 'Trung bình';
  }>;
}

export type GeminiModelId = 
  | 'gemini-3.8-flash' 
  | 'gemini-4-argon' 
  | 'gemini-3.5-flash-lite' 
  | 'gemini-3.1-flash-lite';

export interface AIConfig {
  apiKey: string;
  model: GeminiModelId;
  tokensUsed: number;
}

export type ScenarioTab = 'media' | 'admin';
