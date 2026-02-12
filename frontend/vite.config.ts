import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import svgr from "vite-plugin-svgr";

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    svgr({
      svgrOptions: {
        icon: true,
        // This will transform your SVG to a React component
        exportType: "named",
        namedExport: "ReactComponent",
      },
    }),
  ],
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          // Vendor chunks - split by usage
          'vendor-react': ['react', 'react-dom', 'react-router'],
          'vendor-charts-apex': ['react-apexcharts', 'apexcharts'],
          'vendor-charts-recharts': ['recharts'],
          
          // Page chunks - lazy loaded
          'page-admin-employees': [
            './src/pages/Employees/EmployeeList.tsx',
            './src/pages/Employees/AddEmployee.tsx',
            './src/pages/Employees/EditEmployee.tsx',
          ],
          'page-admin-dashboard': [
            './src/pages/Dashboard/Home.tsx',
          ],
          'page-employee-main': [
            './src/features/employee/dashboard/EmployeeDashboard.tsx',
            './src/features/employee/attendance/CheckIn.tsx',
          ],
        },
      },
    },
    chunkSizeWarningLimit: 600,
  },
});
