# HỆ THỐNG DASHBOARD BÁO CÁO & THAM MƯU ĐIỀU HÀNH THÔNG MINH 2026
## EXECUTIVE BI & AI INSIGHTS DASHBOARD
> **Dành cho công tác giảng dạy & thực hành của Nhà báo Đặng Sinh**  
> Dành cho Học viên các lớp Báo chí Đa nền tảng, Quản trị Văn phòng & Phân tích Dữ liệu AI

---

## 🌟 1. TỔNG QUAN & MỤC TIÊU CỐT LÕI

Trong kỷ nguyên chuyển đổi số và báo chí đa nền tảng 2026, các cơ quan truyền thông và văn phòng hành chính đang đối mặt với một "nỗi đau" chung: **Quá tải dữ liệu từ các bảng tính Excel hàng trăm dòng khô khan**. Các nhà quản lý, tổng biên tập và thủ trưởng đơn vị thường mất hàng giờ đồng hồ để đọc báo cáo nhưng vẫn khó phát hiện ra các rủi ro tiềm ẩn, nghịch lý phân phối hay điểm nghẽn quy trình.

Ứng dụng **Executive BI & AI Insights Dashboard 2026** được xây dựng với mục tiêu:
1. **Chuyển hóa tức thì**: Đọc trực tiếp file bài tập thực hành `Bai_Tap_Thuc_Hanh_Dashboard_Bao_Cao_2026.xlsx` thành giao diện **One-Page Executive Dashboard** chuẩn Bento Grid hiện đại và trực quan.
2. **Hai kịch bản nghiệp vụ song hành**:
   - **Kịch bản 1: Dashboard Báo chí Đa nền tảng** (501 bản ghi: Lượt xem, Tương tác ER%, Tỷ lệ giữ chân Retention%, Mức độ ứng dụng AI, Chi phí sản xuất, Doanh thu quảng cáo, ROI%, Đánh giá KPI).
   - **Kịch bản 2: Dashboard Hành chính & Dự án** (181 bản ghi: Tổng hồ sơ, Tỷ lệ đúng hạn SLA%, Ngân sách duyệt, Thực tế giải ngân, Giờ công tiêu hao, Phương thức số hóa AI, Cảnh báo rủi ro).
3. **AI Tham mưu Điều hành chuẩn MECE**: Tích hợp mô hình ngôn ngữ lớn Google Gemini (thông qua SDK chính thức `@google/genai`) để tự động đọc số liệu đã lọc, phân tích đa chiều và xuất bản báo cáo tham mưu 3 phần:
   - **Hiện trạng & Điểm sáng**
   - **Nguyên nhân gốc rễ & Điểm nghẽn**
   - **3 Giải pháp điều hành tháng tới**
4. **Trải nghiệm giảng dạy 1-Click**: Tích hợp nút `⚡ Nạp dữ liệu thử nghiệm (Load Sample Data)` nạp ngay 100% dữ liệu mẫu tiếng Việt chuẩn xác để giảng viên và học viên trải nghiệm đầy đủ biểu đồ, bộ lọc và AI mà không bắt buộc phải tải file lên trước.

---

## 🎨 2. THIẾT KẾ GIAO DIỆN & HIỆU ỨNG CHUYỂN ĐỘNG (UI/UX)

- **Phong cách Bento Grid & Glassmorphism**: Bố cục thẻ thông tin dạng lưới Bento tinh tế, đổ bóng mềm, viền kính mờ hiện đại.
- **Bảng màu doanh nghiệp chuẩn mực**:
  - **Xanh Hải quân đậm** (`#1B365D`): Màu chủ đạo quyền uy, chuẩn điều hành.
  - **Xanh Cổ vịt** (`#008080`): Điểm nhấn hiện đại, công nghệ và dữ liệu.
  - **Trắng sứ** (`#F8FAFC`): Nền sáng thanh thoát, dễ đọc trên máy chiếu lớp học.
  - **Vàng đồng cảnh báo** (`#D97706`): Nổi bật các nút hành động quan trọng và cảnh báo.
- **Chế độ Sáng/Tối (Light/Dark Mode)**: Tích hợp nút chuyển đổi mượt mà trên thanh Header.
- **4 Hiệu ứng chuyển động đặc sắc**:
  1. **Fade-in Up**: Hiệu ứng xuất hiện mềm mại từ dưới lên khi chuyển tab hoặc mở trang (`framer-motion`).
  2. **Count-up Number Animation**: Số liệu trên các thẻ KPI (Views, Doanh thu, ROI, SLA) nhảy số tự động từ `0` lên giá trị thực trong `0.8 giây` (sử dụng thuật toán Ease-Out Cubic).
  3. **Hover Scale & Subtle Glow**: Hiệu ứng nổi 3D nhẹ và phát sáng viền khi di chuột vào các thẻ KPI và nút bấm.
  4. **Skeleton Shimmer**: Hiệu ứng khung xương phát sáng kèm thông báo tiến trình từng bước khi đang đọc file Excel hoặc chờ Gemini AI phân tích.
- **Biểu đồ Recharts Responsive**: Tương thích hoàn hảo từ màn hình điện thoại, máy tính xách tay đến màn hình máy chiếu phòng họp hội nghị. Định dạng Tooltip chuẩn tiền tệ Việt Nam Đồng (VNĐ) và phần trăm (%).

---

## 🔍 3. BỐC TÁCH 4 "INSIGHT ẨN" TRONG DỮ LIỆU ĐIỀU HÀNH 2026

Hệ thống được thiết kế để tự động làm sáng tỏ 4 phát hiện dữ liệu quan trọng phục vụ công tác chỉ đạo:

1. **Đòn bẩy kinh tế từ Ứng dụng AI Content**:
   - Nhóm sản phẩm ứng dụng **AI Toàn trình (70%)** và **Hỗ trợ sâu (40%)** có chi phí sản xuất trung bình giảm **~28.4%** (từ 4.85 triệu xuống 3.12 triệu VNĐ/SP).
   - Ngược lại, tỷ lệ giữ chân khán giả (**Retention**) tăng vọt từ 48.6% (nhóm Thủ công) lên **68.2%**, đẩy tỷ suất lợi nhuận **ROI lên +245%**.
2. **Nghịch lý Phân phối (Distribution Paradox)**:
   - **TikTok & Short Video** dẫn đầu tuyệt đối về Lượt xem (Views chiếm 48.5%), nhưng tỷ trọng doanh thu quảng cáo tài trợ trực tiếp chỉ chiếm 18.2%.
   - **YouTube Long-form & Tuyến bài Phóng sự Điều tra / Kinh tế** chỉ chiếm 24% Views nhưng đóng góp tới **58.4% Doanh thu** và mang lại ROI cao nhất (+265%).
3. **Điểm nghẽn Giải ngân Quý 1 & Rủi ro Hồ sơ Giấy**:
   - Ban Quản lý Dự án Đầu tư & Hạ tầng bị chậm giải ngân trong Quý 1 (chỉ đạt 64.2%) do vướng mắc thủ tục thẩm định hồ sơ kỹ thuật, sau đó tăng tốc mạnh từ Tháng 04 (đạt 94.8%).
   - Phương thức **Xử lý Thủ công (Hồ sơ giấy)** có tỷ lệ vi phạm SLA lên đến **34.8%** và ngốn trung bình **112 giờ công/việc**; trong khi đơn vị dùng **AI Agent** đạt SLA **96.4%** với chỉ 38 giờ công.
4. **Đỉnh chu kỳ Tăng trưởng (Seasonal Peaks)**:
   - Lưu lượng truy cập và doanh thu bùng nổ mạnh nhất vào **Tháng 03** (thời điểm sau Tết, nhu cầu kinh tế - việc làm tăng cao) và **Tháng 05** (các tuyến bài chính sách, kinh tế và du lịch hè), chiếm hơn 45% tổng doanh thu nửa đầu năm 2026.

---

## 🤖 4. KIẾN TRÚC AI, PHÂN TẦNG MÔ HÌNH & TỐI ƯU CHI PHÍ TOKEN

Hệ thống tích hợp trực tiếp SDK Google Gen AI thế hệ mới nhất (`@google/genai` v2.31.0):

### 4.1. Phân tầng Mô hình (Model Routing)
- **`gemini-3.8-flash` (Mặc định)**: Cân bằng lý tưởng giữa tốc độ phản hồi siêu tốc (< 1.5 giây) và chất lượng lập luận báo cáo MECE.
- **`gemini-4-argon`**: Lựa chọn khi cần suy luận logic sâu sắc, phân tích chiến lược dài hạn và bóc tách các ma trận nguyên nhân phức tạp.
- **`gemini-3.5-flash-lite` / `gemini-3.1-flash-lite`**: Lựa chọn cho tác vụ phân loại nhanh và chi phí token thấp nhất.
- **Tuyệt đối tuân thủ**: Không sử dụng các mô hình legacy đã bị ngừng hỗ trợ (`gemini-2.0-flash`, `gemini-1.5-*`).

### 4.2. Cơ chế Dự phòng Tự động (Rate Limit Fallback)
Nếu gặp mã lỗi `429` (Rate Limit) hoặc nghẽn mạng từ phía nhà cung cấp:
- Hệ thống tự động chuyển tiếp mượt mà theo chuỗi dự phòng: `gemini-3.8-flash` ➔ `gemini-3.5-flash-lite` ➔ `gemini-3.1-flash-lite` kết hợp cơ chế thử lại trễ số mũ (**Exponential Backoff**).
- Trong trường hợp offline hoặc chưa có API Key, hệ thống tự động kích hoạt **Bản Tham Mưu Mẫu Ngữ Cảnh Hóa (Contextual Expert Fallback)**, đảm bảo **100% không bao giờ gặp lỗi trắng trang** khi giảng viên chấm bài.

### 4.3. Tối ưu Chi phí Token (Token Cost Optimization)
- **Gom nhóm Dữ liệu Client-side (Data Aggregation)**: Thay vì gửi 500 dòng dữ liệu thô (tiêu tốn ~25,000 tokens), trình duyệt tự tổng hợp thành bản ghi JSON súc tích (chỉ gồm tổng số, phân nhóm theo kênh, phòng ban, tháng và mức độ AI) ➔ **Tiết kiệm 90% Input Token**.
- **Đầu ra có cấu trúc (Structured Output JSON Schema)**: Ép mô hình AI trả về chuẩn xác theo Schema `{ summary_kpis, hidden_insights, root_causes, action_recommendations }` ➔ **Tiết kiệm tối đa Output Token** và loại bỏ hoàn toàn lỗi parsing JSON.
- **Bộ nhớ đệm Cục bộ (LocalStorage Cache by Hash)**: Mã hóa băm nội dung dữ liệu lọc; nếu người dùng quay lại cùng điều kiện lọc, hệ thống đọc ngay kết quả từ Cache mà không tốn thêm token nào.

---

## 🔗 5. KẾT NỐI HÀNH ĐỘNG THỰC TẾ (ACTIONABLE INTEGRATIONS)

Không chỉ dừng lại ở việc hiển thị, Dashboard cung cấp chuỗi hành động điều hành tức thì:
- **`📥 Xuất Báo cáo Excel (.xlsx)`**: Xuất toàn bộ dữ liệu đã lọc kèm các cột công thức đã tính ra file Excel tương thích mọi phiên bản.
- **`📄 Bản in / Xuất PDF (A4)`**: Thiết kế CSS chuyên biệt `@media print` giúp in trực tiếp ra khổ giấy A4 sạch đẹp, ẩn toàn bộ nút bấm và thanh cuộn để trình duyệt lãnh đạo.
- **`📋 Sao chép Báo cáo Tham mưu`**: Copy nhanh toàn bộ nhận xét MECE đã định dạng văn bản sang Clipboard để dán vào Zalo, Viber hoặc Telegram.
- **`📅 Tạo lịch họp rà soát KPI (Google Calendar)`**: Tự động điền tiêu đề họp, thời gian gợi ý và tóm tắt hiện trạng mở trên Google Calendar.
- **`✉️ Gửi Email chỉ đạo (Gmail)`**: Mở trình soạn thảo Gmail với tiêu đề và nội dung phân công 3 giải pháp trọng tâm cho các ban chuyên môn.

---

## 🛠️ 6. HƯỚNG DẪN CÀI ĐẶT & CHẠY DỰ ÁN

### Yêu cầu môi trường
- **Node.js**: >= 18.0.0 (khuyên dùng Node 20 hoặc 22)
- **Trình duyệt**: Chrome, Edge, Safari hoặc Firefox phiên bản mới

### Bước 1: Cài đặt thư viện phụ thuộc
```bash
npm install
```

### Bước 2: Chạy môi trường phát triển (Development)
```bash
npm run dev
```
Trình duyệt sẽ mở tại địa chỉ: `http://localhost:5173/`

### Bước 3: Kiểm tra biên dịch & Build Production
```bash
npm run build
```
Hệ thống sẽ chạy kiểm tra TypeScript (`tsc -b`) và đóng gói Vite thành thư mục `dist/` với các chunk tối ưu:
- `vendor-icons.js`: 26 kB
- `vendor-motion.js`: 122 kB
- `vendor-genai.js`: 421 kB
- `vendor-xlsx.js`: 424 kB
- `vendor-charts.js`: 553 kB

### Bước 4: Xem trước bản Build
```bash
npm run preview
```

---

## 🚀 7. TRIỂN KHAI LÊN GITHUB & VERCEL

Dự án đã được cấu hình sẵn sàng 100% để triển khai lên Vercel chỉ với 1 cú click:
1. File `.gitignore` đã chặn nghiêm ngặt `node_modules/`, `dist/`, `.env`, `.env.local` bảo vệ an toàn thông tin cá nhân.
2. File `vercel.json` cấu hình sẵn rewrite định tuyến SPA:
```json
{
  "framework": "vite",
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```
3. Quản lý API Key:
   - Người dùng có thể cấu hình biến môi trường `VITE_GEMINI_API_KEY` trong phần Settings của Vercel.
   - Hoặc người dùng / học viên có thể nhập trực tiếp qua giao diện nút `🔑 Cài đặt API Key & Mô hình` (lưu an toàn trong `localStorage` máy khách).

---

## 👨‍🏫 8. BẢN QUYỀN & HƯỚNG DẪN GIẢNG DẠY
- **Tác giả & Giảng viên**: Nhà báo Đặng Sinh
- **Năm học & Phát hành**: 2026
- **Mục đích**: Giáo trình và công cụ thực hành chuyên sâu dành cho cán bộ quản lý báo chí, biên tập viên đa nền tảng và chuyên viên phân tích dữ liệu hành chính công.
