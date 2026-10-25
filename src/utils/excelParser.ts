import * as XLSX from 'xlsx';
import { MediaRecord, AdminRecord, KPIChannel, KPIDepartment } from '../types/dashboard';

interface ParsedWorkbookResult {
  mediaRecords: MediaRecord[];
  adminRecords: AdminRecord[];
  kpiChannels?: KPIChannel[];
  kpiDepartments?: KPIDepartment[];
}

function formatDate(val: any): string {
  if (!val) return '';
  if (val instanceof Date) {
    return val.toISOString().split('T')[0];
  }
  if (typeof val === 'number') {
    // Excel serial date
    const d = new Date((val - (25567 + 2)) * 86400 * 1000);
    return isNaN(d.getTime()) ? String(val) : d.toISOString().split('T')[0];
  }
  return String(val).trim();
}

export function parseExcelFile(arrayBuffer: ArrayBuffer): ParsedWorkbookResult {
  const wb = XLSX.read(arrayBuffer, { type: 'array', cellDates: true });
  
  let mediaRecords: MediaRecord[] = [];
  let adminRecords: AdminRecord[] = [];
  let kpiChannels: KPIChannel[] = [];
  let kpiDepartments: KPIDepartment[] = [];

  // 1. Find and parse Media Sheet
  const mediaSheetName = wb.SheetNames.find(n => 
    n.includes('DA_NEN_TANG') || n.toLowerCase().includes('đa nền tảng') || n.toLowerCase().includes('media') || n === '2_DATA_DA_NEN_TANG'
  );

  if (mediaSheetName) {
    const sheet = wb.Sheets[mediaSheetName];
    const rawRows: any[][] = XLSX.utils.sheet_to_json(sheet, { header: 1, raw: false, dateNF: 'yyyy-mm-dd' });
    
    // Find header row containing 'Mã SP' or 'Nền tảng'
    let headerRowIdx = -1;
    for (let i = 0; i < Math.min(rawRows.length, 10); i++) {
      const row = rawRows[i] || [];
      const rowStr = row.map(c => String(c || '').toLowerCase()).join(' ');
      if (rowStr.includes('mã sp') || (rowStr.includes('nền tảng') && rowStr.includes('lượt xem'))) {
        headerRowIdx = i;
        break;
      }
    }

    if (headerRowIdx !== -1) {
      const headers = rawRows[headerRowIdx].map(h => String(h || '').trim());
      
      const getColIdx = (aliases: string[]) => {
        return headers.findIndex(h => aliases.some(a => h.toLowerCase().includes(a.toLowerCase())));
      };

      const cMaSP = getColIdx(['Mã SP', 'Ma SP', 'ID']);
      const cNgay = getColIdx(['Ngày xuất bản', 'Ngay xuat ban', 'Ngày']);
      const cThang = getColIdx(['Tháng', 'Thang']);
      const cQuy = getColIdx(['Quý', 'Quy']);
      const cBan = getColIdx(['Ban Chuyên môn', 'Ban Chuyen mon', 'Phòng ban', 'Ban']);
      const cTacGia = getColIdx(['Tác giả', 'Tac gia', 'Nhóm SX']);
      const cNenTang = getColIdx(['Nền tảng phát hành', 'Nen tang', 'Nền tảng']);
      const cDinhDang = getColIdx(['Định dạng', 'Dinh dang', 'Format']);
      const cChuyenMuc = getColIdx(['Chuyên mục', 'Chuyen muc']);
      const cMucDoAI = getColIdx(['Mức độ ứng dụng AI', 'Muc do ung dung AI', 'AI']);
      const cViews = getColIdx(['Lượt xem', 'Views', 'Luot xem']);
      const cInteractions = getColIdx(['Tương tác', 'Interactions', 'Tuong tac']);
      const cDuration = getColIdx(['Thời lượng', 'Thoi luong']);
      const cRetention = getColIdx(['giữ chân', 'Retention']);
      const cCost = getColIdx(['Chi phí sản xuất', 'Chi phi', 'Cost']);
      const cRevenue = getColIdx(['Doanh thu', 'Revenue']);

      for (let r = headerRowIdx + 1; r < rawRows.length; r++) {
        const row = rawRows[r];
        if (!row || row.length === 0 || !row[cMaSP !== -1 ? cMaSP : 0]) continue;

        const maSP = String(row[cMaSP !== -1 ? cMaSP : 0] || '').trim();
        if (!maSP || maSP.toLowerCase().includes('tổng') || maSP.toLowerCase().includes('bộ dữ liệu')) continue;

        const ngayXuatBan = formatDate(row[cNgay !== -1 ? cNgay : 1]);
        const thang = String(row[cThang !== -1 ? cThang : 2] || '').trim();
        const quy = String(row[cQuy !== -1 ? cQuy : 3] || '').trim();
        const banChuyenMon = String(row[cBan !== -1 ? cBan : 4] || '').trim();
        const tacGia = String(row[cTacGia !== -1 ? cTacGia : 5] || '').trim();
        const nenTang = String(row[cNenTang !== -1 ? cNenTang : 6] || '').trim();
        const dinhDang = String(row[cDinhDang !== -1 ? cDinhDang : 7] || '').trim();
        const chuyenMuc = String(row[cChuyenMuc !== -1 ? cChuyenMuc : 8] || '').trim();
        const mucDoAI = String(row[cMucDoAI !== -1 ? cMucDoAI : 9] || '').trim();

        const parseNum = (v: any) => {
          if (!v) return 0;
          const clean = String(v).replace(/[^0-9.-]/g, '');
          const n = parseFloat(clean);
          return isNaN(n) ? 0 : n;
        };

        const views = parseNum(row[cViews !== -1 ? cViews : 10]);
        const interactions = parseNum(row[cInteractions !== -1 ? cInteractions : 11]);
        const avgDuration = parseNum(row[cDuration !== -1 ? cDuration : 13]);
        
        let retention = parseNum(row[cRetention !== -1 ? cRetention : 14]);
        if (retention > 1) retention = retention / 100;

        const cost = parseNum(row[cCost !== -1 ? cCost : 15]);
        const revenue = parseNum(row[cRevenue !== -1 ? cRevenue : 16]);

        const er = views > 0 ? Number((interactions / views).toFixed(4)) : 0;
        const profit = revenue - cost;
        const roi = cost > 0 ? Number(((revenue - cost) / cost).toFixed(4)) : 0;

        let kpiStatus: 'Vượt KPI' | 'Đạt KPI' | 'Chưa đạt KPI' = 'Chưa đạt KPI';
        if (views >= 50000 && roi >= 0.35) {
          kpiStatus = 'Vượt KPI';
        } else if (views >= 20000 && roi >= 0) {
          kpiStatus = 'Đạt KPI';
        }

        mediaRecords.push({
          maSP,
          ngayXuatBan,
          thang,
          quy,
          banChuyenMon,
          tacGia,
          nenTang,
          dinhDang,
          chuyenMuc,
          mucDoAI,
          views,
          interactions,
          er,
          avgDuration,
          retention,
          cost,
          revenue,
          profit,
          roi,
          kpiStatus
        });
      }
    }
  }

  // 2. Find and parse Admin/Project Sheet
  const adminSheetName = wb.SheetNames.find(n => 
    n.includes('HANH_CHINH') || n.toLowerCase().includes('hành chính') || n.toLowerCase().includes('admin') || n === '3_DATA_HANH_CHINH_DU_AN'
  );

  if (adminSheetName) {
    const sheet = wb.Sheets[adminSheetName];
    const rawRows: any[][] = XLSX.utils.sheet_to_json(sheet, { header: 1, raw: false, dateNF: 'yyyy-mm-dd' });

    let headerRowIdx = -1;
    for (let i = 0; i < Math.min(rawRows.length, 10); i++) {
      const row = rawRows[i] || [];
      const rowStr = row.map(c => String(c || '').toLowerCase()).join(' ');
      if (rowStr.includes('mã nhiệm vụ') || (rowStr.includes('hồ sơ') && rowStr.includes('ngân sách'))) {
        headerRowIdx = i;
        break;
      }
    }

    if (headerRowIdx !== -1) {
      const headers = rawRows[headerRowIdx].map(h => String(h || '').trim());
      
      const getColIdx = (aliases: string[]) => {
        return headers.findIndex(h => aliases.some(a => h.toLowerCase().includes(a.toLowerCase())));
      };

      const cMaNV = getColIdx(['Mã Nhiệm vụ', 'Ma Nhiem vu', 'Mã']);
      const cNgay = getColIdx(['Ngày giao việc', 'Ngay giao', 'Ngày']);
      const cThang = getColIdx(['Tháng', 'Thang']);
      const cPhongBan = getColIdx(['Phòng ban', 'Đơn vị chủ trì', 'Phong ban']);
      const cCanBo = getColIdx(['Cán bộ', 'Phụ trách']);
      const cNhomNV = getColIdx(['Nhóm Nghiệp vụ', 'Nghiep vu']);
      const cUuTien = getColIdx(['Mức độ ưu tiên', 'Uu tien']);
      const cPhuongThuc = getColIdx(['Phương thức xử lý', 'Số hóa', 'AI']);
      const cTongHS = getColIdx(['Tổng Hồ sơ', 'Tong ho so']);
      const cHSDungHan = getColIdx(['đúng hạn', 'dung han']);
      const cNganSach = getColIdx(['Ngân sách được duyệt', 'Ngan sach']);
      const cGiaiNgan = getColIdx(['giải ngân', 'giai ngan']);
      const cGioCong = getColIdx(['giờ công', 'gio cong']);
      const cTrangThai = getColIdx(['Trạng thái', 'Trang thai']);

      for (let r = headerRowIdx + 1; r < rawRows.length; r++) {
        const row = rawRows[r];
        if (!row || row.length === 0 || !row[cMaNV !== -1 ? cMaNV : 0]) continue;

        const maNV = String(row[cMaNV !== -1 ? cMaNV : 0] || '').trim();
        if (!maNV || maNV.toLowerCase().includes('tổng') || maNV.toLowerCase().includes('bộ dữ liệu')) continue;

        const parseNum = (v: any) => {
          if (!v) return 0;
          const clean = String(v).replace(/[^0-9.-]/g, '');
          const n = parseFloat(clean);
          return isNaN(n) ? 0 : n;
        };

        const tongHoSo = parseNum(row[cTongHS !== -1 ? cTongHS : 8]);
        const hoSoDungHan = parseNum(row[cHSDungHan !== -1 ? cHSDungHan : 9]);
        const nganSachDuyet = parseNum(row[cNganSach !== -1 ? cNganSach : 11]);
        const thucTeGiaiNgan = parseNum(row[cGiaiNgan !== -1 ? cGiaiNgan : 12]);
        const gioCong = parseNum(row[cGioCong !== -1 ? cGioCong : 15]);
        const trangThai = String(row[cTrangThai !== -1 ? cTrangThai : 16] || 'Đang thực hiện').trim();

        const slaRate = tongHoSo > 0 ? Number((hoSoDungHan / tongHoSo).toFixed(4)) : 0;
        const tyLeGiaiNgan = nganSachDuyet > 0 ? Number((thucTeGiaiNgan / nganSachDuyet).toFixed(4)) : 0;
        const chenhLechNganSach = nganSachDuyet - thucTeGiaiNgan;

        let capDoRuiRo: 'Rủi ro Cao (Cần xử lý)' | 'Rủi ro Trung bình' | 'An toàn / Tốt' = 'An toàn / Tốt';
        if (slaRate < 0.75 || tyLeGiaiNgan > 1.0 || trangThai === 'Quá hạn xử lý') {
          capDoRuiRo = 'Rủi ro Cao (Cần xử lý)';
        } else if (slaRate < 0.88) {
          capDoRuiRo = 'Rủi ro Trung bình';
        }

        adminRecords.push({
          maNV,
          ngayGiaoViec: formatDate(row[cNgay !== -1 ? cNgay : 1]),
          thang: String(row[cThang !== -1 ? cThang : 2] || '').trim(),
          phongBan: String(row[cPhongBan !== -1 ? cPhongBan : 3] || '').trim(),
          canBo: String(row[cCanBo !== -1 ? cCanBo : 4] || '').trim(),
          nhomNghiepVu: String(row[cNhomNV !== -1 ? cNhomNV : 5] || '').trim(),
          mucDoUuTien: String(row[cUuTien !== -1 ? cUuTien : 6] || '').trim(),
          phuongThucXuLy: String(row[cPhuongThuc !== -1 ? cPhuongThuc : 7] || '').trim(),
          tongHoSo,
          hoSoDungHan,
          slaRate,
          nganSachDuyet,
          thucTeGiaiNgan,
          tyLeGiaiNgan,
          chenhLechNganSach,
          gioCong,
          trangThai,
          capDoRuiRo
        });
      }
    }
  }

  return { mediaRecords, adminRecords, kpiChannels, kpiDepartments };
}

// Export Filtered Data & Summaries back to Excel (.xlsx)
export function exportToExcel(
  mediaData: MediaRecord[],
  adminData: AdminRecord[],
  currentTab: 'media' | 'admin',
  filename = 'Bao_Cao_Dieu_Hanh_2026.xlsx'
) {
  const wb = XLSX.utils.book_new();

  if (currentTab === 'media' && mediaData.length > 0) {
    const formattedMedia = mediaData.map(item => ({
      'Mã SP': item.maSP,
      'Ngày xuất bản': item.ngayXuatBan,
      'Tháng': item.thang,
      'Quý': item.quy,
      'Ban Chuyên môn': item.banChuyenMon,
      'Tác giả': item.tacGia,
      'Nền tảng': item.nenTang,
      'Định dạng': item.dinhDang,
      'Chuyên mục': item.chuyenMuc,
      'Mức độ AI': item.mucDoAI,
      'Lượt xem': item.views,
      'Tương tác': item.interactions,
      'Tỷ lệ tương tác (ER)': `${(item.er * 100).toFixed(2)}%`,
      'Thời lượng TB (s)': item.avgDuration,
      'Tỷ lệ giữ chân': `${(item.retention * 100).toFixed(1)}%`,
      'Chi phí SX (VNĐ)': item.cost,
      'Doanh thu (VNĐ)': item.revenue,
      'Lợi nhuận (VNĐ)': item.profit,
      'ROI (%)': `${(item.roi * 100).toFixed(1)}%`,
      'Đánh giá KPI': item.kpiStatus
    }));

    const ws = XLSX.utils.json_to_sheet(formattedMedia);
    XLSX.utils.book_append_sheet(wb, ws, 'DATA_DA_NEN_TANG');
  } else if (currentTab === 'admin' && adminData.length > 0) {
    const formattedAdmin = adminData.map(item => ({
      'Mã Nhiệm vụ': item.maNV,
      'Ngày giao': item.ngayGiaoViec,
      'Tháng': item.thang,
      'Phòng ban chủ trì': item.phongBan,
      'Cán bộ phụ trách': item.canBo,
      'Nhóm nghiệp vụ': item.nhomNghiepVu,
      'Ưu tiên': item.mucDoUuTien,
      'Phương thức xử lý': item.phuongThucXuLy,
      'Tổng hồ sơ': item.tongHoSo,
      'Hồ sơ đúng hạn': item.hoSoDungHan,
      'Tỷ lệ SLA (%)': `${(item.slaRate * 100).toFixed(1)}%`,
      'Ngân sách duyệt (VNĐ)': item.nganSachDuyet,
      'Thực tế giải ngân (VNĐ)': item.thucTeGiaiNgan,
      'Tỷ lệ giải ngân (%)': `${(item.tyLeGiaiNgan * 100).toFixed(1)}%`,
      'Chênh lệch ngân sách (VNĐ)': item.chenhLechNganSach,
      'Số giờ công': item.gioCong,
      'Trạng thái tiến độ': item.trangThai,
      'Cấp độ rủi ro': item.capDoRuiRo
    }));

    const ws = XLSX.utils.json_to_sheet(formattedAdmin);
    XLSX.utils.book_append_sheet(wb, ws, 'DATA_HANH_CHINH');
  }

  XLSX.writeFile(wb, filename);
}
