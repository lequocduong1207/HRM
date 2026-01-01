# Attendance Schema Documentation

## Tổng quan

Schema `Attendance` dùng để lưu trữ **dữ liệu chấm công theo ngày** của nhân viên.  
Mỗi document tương ứng với **1 nhân viên – 1 ngày làm việc**.

---

## 1. Các trường dữ liệu

### 1.1 attendanceId

- **Kiểu:** `Number`
- **Unique:** ✅
- **Index:** ✅
- **Nullable:** ✅ (`sparse: true`)

**Mục đích:**
- ID chấm công dạng số (phục vụ đồng bộ hệ thống cũ / báo cáo)
- Không bắt buộc vì MongoDB đã có `_id`

**Lưu ý:**
- Có thể auto-increment bằng counter collection nếu cần

---

### 1.2 employeeId

- **Kiểu:** `ObjectId`
- **Ref:** `Employee`
- **Bắt buộc:** ✅

**Mục đích:**
- Liên kết dữ liệu chấm công với nhân viên
- Mỗi bản ghi thuộc về **1 Employee**

---

### 1.3 date

- **Kiểu:** `Date`
- **Bắt buộc:** ✅

**Mục đích:**
- Ngày chấm công (YYYY-MM-DD)
- Dùng làm khóa logic cho mỗi ngày làm việc

**Best practice:**
- Normalize về `00:00:00` để tránh lệch timezone

---

### 1.4 checkIn

- **Kiểu:** `Date`
- **Nullable:** ✅

**Mục đích:**
- Thời điểm nhân viên check-in
- Có thể null nếu:
  - Nghỉ phép
  - Quên check-in

---

### 1.5 checkOut

- **Kiểu:** `Date`
- **Nullable:** ✅

**Mục đích:**
- Thời điểm nhân viên check-out
- Có thể null nếu:
  - Quên check-out
  - Làm việc chưa kết thúc

---

### 1.6 isLate

- **Kiểu:** `Boolean`
- **Default:** `false`

**Mục đích:**
- Đánh dấu nhân viên đi làm muộn
- Thường được set tự động dựa trên giờ check-in

---

### 1.7 isEarlyLeave

- **Kiểu:** `Boolean`
- **Default:** `false`

**Mục đích:**
- Đánh dấu nhân viên về sớm
- Set tự động dựa trên giờ check-out

---

### 1.8 notes

- **Kiểu:** `String`
- **Trim:** ✅
- **Nullable:** ✅

**Mục đích:**
- Ghi chú thủ công của HR / Manager
- Ví dụ:
  - “Quên check-in”
  - “Đi công tác”

---

### 1.9 createdAt

- **Kiểu:** `Date`
- **Tự động sinh**

**Mục đích:**
- Thời điểm tạo bản ghi chấm công
- Phục vụ audit / log hệ thống

---

## 2. Timestamp configuration

```ts
timestamps: {
  createdAt: true,
  updatedAt: false
}
