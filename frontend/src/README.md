# Frontend Admin - Project Structure

## 📁 **Cấu trúc thư mục**

```
src/
├── api/                    # API service layer
│   ├── axios.customize.ts  # Axios configuration
│   ├── auth.api.ts         # Authentication APIs
│   ├── employees.api.ts    # Employee APIs
│   ├── departments.api.ts  # Department APIs
│   └── attendances.api.ts  # Attendance APIs
│
├── assets/                 # Static assets
│   └── images/
│       └── brand/          # Brand logos
│
├── components/             # Reusable components
│   ├── auth/              # Auth-related components
│   │   ├── AdminRoute.tsx  # Protected route wrapper
│   │   └── SignInForm.tsx  # Sign in form
│   ├── common/            # Common UI components
│   │   ├── ComponentCard.tsx
│   │   ├── PageBreadCrumb.tsx
│   │   ├── PageMeta.tsx
│   │   ├── ScrollToTop.tsx
│   │   ├── ThemeToggleButton.tsx
│   │   └── GridShape.tsx
│   ├── form/              # Form components
│   │   ├── Form.tsx
│   │   ├── Label.tsx
│   │   ├── Select.tsx
│   │   ├── MultiSelect.tsx
│   │   ├── date-picker.tsx
│   │   ├── input/         # Input components
│   │   └── form-elements/ # Form element examples
│   ├── header/            # Header components
│   │   ├── Header.tsx
│   │   ├── NotificationDropdown.tsx
│   │   └── UserDropdown.tsx
│   └── ui/                # Base UI components
│       ├── alert/
│       ├── avatar/
│       ├── badge/
│       ├── button/
│       ├── dropdown/
│       ├── images/
│       ├── modal/
│       ├── table/
│       └── videos/
│
├── constants/             # Application constants
│   └── index.ts           # API endpoints, routes, configs
│
├── context/               # React Context providers
│   ├── AuthContext.tsx    # Authentication state
│   ├── SidebarContext.tsx # Sidebar state
│   └── ThemeContext.tsx   # Theme (dark/light mode)
│
├── hooks/                 # Custom React hooks
│   ├── useGoBack.ts       # Navigate back hook
│   └── useModal.ts        # Modal state management
│
├── icons/                 # SVG icon components
│   └── index.ts
│
├── layout/                # Layout components
│   ├── AppLayout.tsx      # Main layout wrapper
│   ├── AppHeader.tsx      # Application header
│   ├── AppSidebar.tsx     # Sidebar navigation
│   └── Backdrop.tsx       # Modal backdrop
│
├── pages/                 # Page components
│   ├── AuthPages/         # Authentication pages
│   │   ├── SignIn.tsx
│   │   └── AuthPageLayout.tsx
│   ├── Dashboard/         # Dashboard pages
│   │   └── Home.tsx
│   ├── Employees/         # Employee management
│   │   ├── EmployeeList.tsx
│   │   ├── AddEmployee.tsx
│   │   └── DepartmentList.tsx
│   ├── Attendance/        # Attendance management
│   │   ├── AttendanceList.tsx
│   │   └── AttendanceHistory.tsx
│   ├── Leave/             # Leave management
│   │   ├── LeaveRequest.tsx
│   │   └── LeaveApproval.tsx
│   ├── Settings/          # Settings pages
│   │   └── UserManagement.tsx
│   └── OtherPage/
│       └── NotFound.tsx   # 404 page
│
├── routes/                # Route configuration
│   └── index.tsx          # Centralized route config
│
├── types/                 # TypeScript type definitions
│   └── index.ts           # API types, interfaces
│
├── utils/                 # Utility functions
│   └── index.ts           # Helpers, formatters
│
├── App.tsx                # Root component
├── main.tsx               # Application entry point
├── index.css              # Global styles
├── svg.d.ts               # SVG type declarations
└── vite-env.d.ts          # Vite environment types
```

---

## 🎯 **Design Principles**

### **1. Separation of Concerns**
- **API layer** (`api/`): Tất cả HTTP requests
- **Components** (`components/`): UI components có thể tái sử dụng
- **Pages** (`pages/`): Page-level components
- **Types** (`types/`): TypeScript type definitions
- **Utils** (`utils/`): Helper functions

### **2. Single Responsibility**
- Mỗi file có một nhiệm vụ rõ ràng
- Components nhỏ gọn, dễ test
- API calls tách biệt khỏi UI logic

### **3. Scalability**
- Dễ thêm features mới
- Lazy loading cho performance
- Centralized route configuration

---

## 🔧 **Key Features**

### **1. Centralized Routes** ([routes/index.tsx](routes/index.tsx))
```typescript
import { routes } from './routes';

// Easy to maintain and extend
export const routes: RouteObject[] = [
  // Protected routes
  { path: '/', element: <Home /> },
  { path: '/employees', element: <EmployeeList /> },
  // ...
];
```

### **2. Lazy Loading**
```typescript
const Home = lazy(() => import('../pages/Dashboard/Home'));
// Components load only when needed
```

### **3. Type Safety** ([types/index.ts](types/index.ts))
```typescript
export interface IEmployee {
  _id: string;
  fullName: string;
  email: string;
  // ...
}
```

### **4. Constants Management** ([constants/index.ts](constants/index.ts))
```typescript
export const API_ENDPOINTS = {
  EMPLOYEES: {
    BASE: '/employees',
    BY_ID: (id: string) => `/employees/${id}`,
  },
};

export const ROUTES = {
  EMPLOYEES: '/employees',
  EMPLOYEES_ADD: '/employees/add',
};
```

### **5. Utility Functions** ([utils/index.ts](utils/index.ts))
```typescript
export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
  }).format(amount);
};

export const storage = {
  get: <T>(key: string): T | null => { ... },
  set: <T>(key: string, value: T): void => { ... },
};
```

---

## 🚀 **How to Add New Features**

### **Step 1: Add Types** ([types/index.ts](types/index.ts))
```typescript
export interface INewFeature {
  _id: string;
  name: string;
  // ...
}
```

### **Step 2: Add API** (`api/newfeature.api.ts`)
```typescript
import axios from './axios.customize';
import { INewFeature, ApiResponse } from '../types';

export const getNewFeatures = async (): Promise<ApiResponse<INewFeature[]>> => {
  const response = await axios.get('/new-feature');
  return response.data;
};
```

### **Step 3: Add Page** (`pages/NewFeature/List.tsx`)
```typescript
import { useEffect, useState } from 'react';
import { getNewFeatures } from '../../api/newfeature.api';
import { INewFeature } from '../../types';

export default function NewFeatureList() {
  const [data, setData] = useState<INewFeature[]>([]);
  // ...
}
```

### **Step 4: Add Route** ([routes/index.tsx](routes/index.tsx))
```typescript
const NewFeatureList = lazy(() => import('../pages/NewFeature/List'));

export const routes: RouteObject[] = [
  // ...
  {
    path: '/new-feature',
    element: withSuspense(NewFeatureList),
  },
];
```

### **Step 5: Add Navigation** ([layout/AppSidebar.tsx](layout/AppSidebar.tsx))
```tsx
<NavLink to="/new-feature">New Feature</NavLink>
```

---

## 📋 **Best Practices**

### **1. Component Organization**
```
✅ Good:
components/
  ├── common/          # Shared across app
  ├── form/            # Form-specific
  └── ui/              # Base UI elements

❌ Bad:
components/
  ├── Component1.tsx
  ├── Component2.tsx
  └── ...              # All in one folder
```

### **2. Type Definitions**
```typescript
// ✅ Good: Centralized types
import { IEmployee } from '../types';

// ❌ Bad: Inline types everywhere
interface Employee { ... }
```

### **3. API Calls**
```typescript
// ✅ Good: Separate API layer
import { getEmployees } from '../api/employees.api';

// ❌ Bad: axios calls in components
axios.get('/api/employees');
```

### **4. Constants**
```typescript
// ✅ Good: Centralized constants
import { ROUTES } from '../constants';
navigate(ROUTES.EMPLOYEES);

// ❌ Bad: Magic strings
navigate('/employees');
```

---

## 🧹 **What Was Removed**

### **Deleted Folders:**
- ❌ `pages/UiElements/` - Demo UI components
- ❌ `pages/Charts/` - Demo charts
- ❌ `pages/Forms/` - Demo forms
- ❌ `pages/Tables/` - Demo tables
- ❌ `pages/Recruitment/` - Not implemented yet
- ❌ `pages/Reports/` - Not implemented yet
- ❌ `components/charts/` - Demo chart components
- ❌ `components/tables/` - Demo table components
- ❌ `components/UserProfile/` - Unused profile cards

### **Deleted Files:**
- ❌ `pages/Blank.tsx`
- ❌ `pages/Calendar.tsx`
- ❌ `pages/UserProfiles.tsx`

### **Why Removed:**
- 🎯 **Focus**: Chỉ giữ lại features cần cho HRM
- 📦 **Bundle Size**: Giảm kích thước bundle
- 🧹 **Maintainability**: Dễ maintain hơn
- 🚀 **Scalability**: Thêm features mới dễ dàng

---

## 📈 **Benefits of New Structure**

| Aspect | Before | After |
|--------|--------|-------|
| **Route Config** | Scattered in App.tsx | Centralized in routes/ |
| **Type Safety** | Inline types | Centralized types/ |
| **Bundle Size** | Large (all demos) | Smaller (core only) |
| **Maintainability** | Hard to find files | Clear structure |
| **Scalability** | Difficult to extend | Easy to add features |
| **Performance** | Eager loading | Lazy loading |

---

## 🔗 **Related Documentation**

- [API Documentation](../../backend/README.md)
- [Backend Structure](../../backend/src/README.md)
- [Error Handling](../../docs/ERROR_HANDLING.md)
- [TypeScript Types](./types/index.ts)
- [Constants & Config](./constants/index.ts)

---

## 📞 **Need Help?**

1. Check [types/index.ts](types/index.ts) for data structures
2. Check [constants/index.ts](constants/index.ts) for routes & endpoints
3. Check [utils/index.ts](utils/index.ts) for helper functions
4. Follow the **"How to Add New Features"** guide above

---

**Last Updated:** 2026-01-03  
**Version:** 2.0.0  
**Status:** ✅ Restructured & Ready
