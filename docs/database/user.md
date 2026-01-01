# User Schema Documentation

## Tổng quan

Schema `User` đại diện cho **tài khoản đăng nhập hệ thống** trong dự án HRM.  
Mỗi `User` có thể:
- Liên kết với **Employee** (nhân viên thực)
- Hoặc tồn tại độc lập như **system account** (admin, service account)

---

## 1. Các trường dữ liệu

### 1.1 email

- **Kiểu:** `String`
- **Bắt buộc:** ✅
- **Unique:** ✅
- **Chuẩn hoá:** lowercase, trim

**Mục đích:**
- Định danh duy nhất user trong hệ thống
- Dùng để đăng nhập

**Lưu ý:**
- Không phân biệt hoa thường
- Không cho phép trùng email

---

### 1.2 passwordHash

- **Kiểu:** `String`
- **Bắt buộc:** ✅
- **Không trả về API**

**Mục đích:**
- Lưu mật khẩu đã được hash (bcrypt)
- Đảm bảo an toàn bảo mật

**Lưu ý:**
- Không bao giờ lưu plaintext password
- Bị loại khỏi response JSON

---

### 1.3 role

- **Kiểu:** `String`
- **Enum:**
  - `admin`
  - `hr_manager`
  - `manager`
  - `employee`
- **Default:** `employee`

**Mục đích:**
- Phân quyền truy cập hệ thống

**Ý nghĩa từng role:**

| Role | Quyền |
|---|---|
| admin | Toàn quyền hệ thống |
| hr_manager | Quản lý nhân sự |
| manager | Quản lý phòng ban |
| employee | Nhân viên thông thường |

---

### 1.4 employeeId

- **Kiểu:** `ObjectId`
- **Ref:** `Employee`
- **Unique:** ✅
- **Nullable:** ✅

**Mục đích:**
- Liên kết tài khoản với hồ sơ nhân viên

**Trường hợp sử dụng:**
- `NULL` → system account (admin, HR)
- Có giá trị → tài khoản nhân viên

**Ràng buộc:**
- 1 Employee chỉ có **1 User**
- Cho phép NULL nhiều lần (`sparse: true`)

---

### 1.5 isActive

- **Kiểu:** `Boolean`
- **Default:** `true`

**Mục đích:**
- Kích hoạt / vô hiệu hóa tài khoản
- Dùng cho:
  - Khóa tài khoản
  - Nhân viên nghỉ việc

---

### 1.6 lastLogin

- **Kiểu:** `Date`
- **Nullable:** ✅

**Mục đích:**
- Lưu lần đăng nhập gần nhất
- Phục vụ audit, security

---

### 1.7 createdAt

- **Kiểu:** `Date`
- **Tự động sinh**

**Mục đích:**
- Thời điểm tạo tài khoản

---

### 1.8 updatedAt

- **Kiểu:** `Date`
- **Tự động cập nhật**

**Mục đích:**
- Theo dõi lần cập nhật cuối

---

## 2. Hành vi đặc biệt

### 2.1 Ẩn password khi trả API

```ts
userSchema.set("toJSON", {
  transform(_, ret) {
    delete ret.passwordHash;
    return ret;
  }
});
