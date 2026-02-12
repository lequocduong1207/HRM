import { Outlet } from 'react-router';
import { SidebarProvider, useSidebar } from '../context/SidebarContext';
import EmployeeSidebar from './EmployeeSidebar';
import EmployeeHeader from './EmployeeHeader';
import Backdrop from './Backdrop';

const EmployeeLayoutContent: React.FC = () => {
  const { isExpanded, isHovered, isMobileOpen } = useSidebar();

  return (
    <div className="min-h-screen xl:flex">
      <div>
        <EmployeeSidebar />
        <Backdrop />
      </div>
      <div
        className={`flex-1 transition-all duration-300 ease-in-out ${
          isExpanded || isHovered ? 'lg:ml-[290px]' : 'lg:ml-[90px]'
        } ${isMobileOpen ? 'ml-0' : ''}`}
      >
        <EmployeeHeader />
        <div className="p-4 mx-auto max-w-(--breakpoint-2xl) md:p-6">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

/**
 * EmployeeLayout
 * Layout for employee-only pages
 */
const EmployeeLayout: React.FC = () => {
  return (
    <SidebarProvider>
      <EmployeeLayoutContent />
    </SidebarProvider>
  );
};

export default EmployeeLayout;
