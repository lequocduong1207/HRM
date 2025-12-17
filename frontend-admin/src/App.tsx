import { BrowserRouter as Router, Routes, Route } from "react-router";
import SignIn from "./pages/AuthPages/SignIn";
import NotFound from "./pages/OtherPage/NotFound";
import UserProfiles from "./pages/UserProfiles";
import Videos from "./pages/UiElements/Videos";
import Images from "./pages/UiElements/Images";
import Alerts from "./pages/UiElements/Alerts";
import Badges from "./pages/UiElements/Badges";
import Avatars from "./pages/UiElements/Avatars";
import Buttons from "./pages/UiElements/Buttons";
import LineChart from "./pages/Charts/LineChart";
import BarChart from "./pages/Charts/BarChart";
import Calendar from "./pages/Calendar";
import BasicTables from "./pages/Tables/BasicTables";
import FormElements from "./pages/Forms/FormElements";
import Blank from "./pages/Blank";
import AppLayout from "./layout/AppLayout";
import { ScrollToTop } from "./components/common/ScrollToTop";
import Home from "./pages/Dashboard/Home";
import { AuthProvider } from "./context/AuthContext";
import AdminRoute from "./components/auth/AdminRoute";

// HRM Pages
import EmployeeList from "./pages/Employees/EmployeeList";
import AddEmployee from "./pages/Employees/AddEmployee";
import DepartmentList from "./pages/Employees/DepartmentList";
import AttendanceList from "./pages/Attendance/AttendanceList";
import AttendanceHistory from "./pages/Attendance/AttendanceHistory";
import LeaveRequest from "./pages/Leave/LeaveRequest";
import LeaveApproval from "./pages/Leave/LeaveApproval";
import ReportsOverview from "./pages/Reports/ReportsOverview";
import UserManagement from "./pages/Settings/UserManagement";

// Recruitment Pages
import JobPostings from "./pages/Recruitment/JobPostings";
import CandidateList from "./pages/Recruitment/CandidateList";
import InterviewSchedule from "./pages/Recruitment/InterviewSchedule";
import RecruitmentReports from "./pages/Recruitment/RecruitmentReports";

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <ScrollToTop />
        <Routes>
          {/* ADMIN ONLY - Protected Routes */}
          <Route element={
            <AdminRoute>
              <AppLayout />
            </AdminRoute>
          }>
            <Route index path="/" element={<Home />} />

            {/* Employee Management */}
            <Route path="/employees" element={<EmployeeList />} />
            <Route path="/employees/add" element={<AddEmployee />} />
            <Route path="/departments" element={<DepartmentList />} />

            {/* Attendance */}
            <Route path="/attendance" element={<AttendanceList />} />
            <Route path="/attendance/history" element={<AttendanceHistory />} />

            {/* Leave Management */}
            <Route path="/leave" element={<LeaveRequest />} />
            <Route path="/leave/approval" element={<LeaveApproval />} />
            <Route path="/leave/history" element={<AttendanceHistory />} />

            {/* Recruitment */}
            <Route path="/recruitment/jobs" element={<JobPostings />} />
            <Route path="/recruitment/candidates" element={<CandidateList />} />
            <Route path="/recruitment/interviews" element={<InterviewSchedule />} />
            <Route path="/recruitment/reports" element={<RecruitmentReports />} />

            {/* Reports */}
            <Route path="/reports/attendance" element={<ReportsOverview />} />
            <Route path="/reports/employee" element={<ReportsOverview />} />
            <Route path="/reports/overview" element={<ReportsOverview />} />

            {/* Settings */}
            <Route path="/users" element={<UserManagement />} />
            <Route path="/settings" element={<UserManagement />} />

            {/* Others Page */}
            <Route path="/profile" element={<UserProfiles />} />
            <Route path="/calendar" element={<Calendar />} />
            <Route path="/blank" element={<Blank />} />

            {/* Forms */}
            <Route path="/form-elements" element={<FormElements />} />

            {/* Tables */}
            <Route path="/basic-tables" element={<BasicTables />} />

            {/* Ui Elements */}
            <Route path="/alerts" element={<Alerts />} />
            <Route path="/avatars" element={<Avatars />} />
            <Route path="/badge" element={<Badges />} />
            <Route path="/buttons" element={<Buttons />} />
            <Route path="/images" element={<Images />} />
            <Route path="/videos" element={<Videos />} />

            {/* Charts */}
            <Route path="/line-chart" element={<LineChart />} />
            <Route path="/bar-chart" element={<BarChart />} />
          </Route>

          {/* Public Routes - CHỈ CÓ SIGNIN */}
          <Route path="/signin" element={<SignIn />} />

          {/* Fallback Route */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}