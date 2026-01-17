import { useState, useMemo } from 'react';
import { leaveService } from '../api/leaves.api';
import type { ILeaveRequest } from '../types';
import { useDepartments } from './useDepartments';
import { useEmployees } from './useEmployees';

type LeaveStatus = 'pending' | 'approved' | 'rejected' | 'cancelled' | 'Pending' | 'Approved' | 'Rejected' | 'Cancelled';
type FilterStatus = 'all' | LeaveStatus;

/**
 * Custom hook for LeaveApproval page logic
 * Tách toàn bộ logic của trang LeaveApproval để dễ dàng test và tái sử dụng
 */
export function useLeaveApprovalLogic() {
  const { departments } = useDepartments();
  const { employees } = useEmployees();
  const [leaveRequests, setLeaveRequests] = useState<ILeaveRequest[]>([]);
  const [filterStatus, setFilterStatus] = useState<FilterStatus>('pending');
  const [filterType, setFilterType] = useState<string>('all');
  const [filterDept, setFilterDept] = useState<string>('all');
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const limit = 10;

  // Fetch leave requests
  const fetchLeaveRequests = async () => {
    setFetching(true);
    try {
      const params: any = {
        page,
        limit,
      };
      
      if (filterStatus !== 'all') {
        params.status = filterStatus.charAt(0).toUpperCase() + filterStatus.slice(1);
      }
      
      if (filterType !== 'all') {
        params.leaveType = filterType.charAt(0).toUpperCase() + filterType.slice(1);
      }

      const response = await leaveService.getAllLeaves(params);
      
      if (response.success && response.data) {
        setLeaveRequests(response.data);
        setTotal(response.pagination?.total || 0);
      }
    } catch (error: any) {
      console.error('Error fetching leave requests:', error);
      alert(error.response?.data?.message || 'Không thể tải danh sách đơn nghỉ phép');
    } finally {
      setFetching(false);
    }
  };

  // Statistics
  const stats = useMemo(() => {
    const normalizedRequests = leaveRequests.map(r => ({
      ...r,
      status: r.status.toLowerCase() as LeaveStatus
    }));
    const pending = normalizedRequests.filter(r => r.status === 'pending').length;
    const approved = normalizedRequests.filter(r => r.status === 'approved').length;
    const rejected = normalizedRequests.filter(r => r.status === 'rejected').length;
    return { pending, approved, rejected, total: leaveRequests.length };
  }, [leaveRequests]);

  // Filtered requests
  const filteredRequests = useMemo(() => {
    return leaveRequests.filter(req => {
      const reqStatus = req.status.toLowerCase();
      const matchStatus = filterStatus === 'all' || reqStatus === filterStatus.toLowerCase();
      const matchType = filterType === 'all' || req.leaveType.toLowerCase() === filterType.toLowerCase();
      const empDept = typeof req.employeeId === 'object' && req.employeeId.departmentId;
      const deptId = typeof empDept === 'object' ? empDept._id : empDept;
      const matchDept = filterDept === 'all' || deptId === filterDept;
      return matchStatus && matchType && matchDept;
    });
  }, [leaveRequests, filterStatus, filterType, filterDept]);

  // Helper functions
  const getEmployeeName = (employeeId: any) => {
    return typeof employeeId === 'object' ? employeeId?.fullName : 'N/A';
  };

  const getDepartmentName = (employeeId: any) => {
    if (typeof employeeId === 'object' && employeeId.departmentId) {
      return typeof employeeId.departmentId === 'object' 
        ? employeeId.departmentId.name 
        : employeeId.departmentId;
    }
    return 'N/A';
  };

  const getLeaveTypeName = (type: string) => {
    const types: Record<string, string> = {
      annual: 'Nghỉ phép năm',
      Annual: 'Nghỉ phép năm',
      sick: 'Nghỉ ốm',
      Sick: 'Nghỉ ốm',
      unpaid: 'Nghỉ không lương',
      Unpaid: 'Nghỉ không lương',
      maternity: 'Nghỉ thai sản',
      Maternity: 'Nghỉ thai sản',
      paternity: 'Nghỉ chăm con',
      Paternity: 'Nghỉ chăm con',
      other: 'Khác',
      Other: 'Khác'
    };
    return types[type] || type;
  };

  const formatDateRange = (start: string, end: string) => {
    const startDate = new Date(start);
    const endDate = new Date(end);
    const opts: Intl.DateTimeFormatOptions = { day: '2-digit', month: '2-digit', year: 'numeric' };
    
    if (start === end) {
      return startDate.toLocaleDateString('vi-VN', opts);
    }
    return `${startDate.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit' })} - ${endDate.toLocaleDateString('vi-VN', opts)}`;
  };

  const calculateDays = (start: string, end: string) => {
    const startDate = new Date(start);
    const endDate = new Date(end);
    return Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)) + 1;
  };

  const handleApprove = async (id: string) => {
    if (!confirm('Bạn có chắc muốn duyệt đơn nghỉ phép này?')) return;
    
    setLoading(true);
    try {
      const response = await leaveService.approveOrRejectLeave(id, {
        status: 'Approved'
      });
      
      if (response.success) {
        alert('Đã duyệt đơn nghỉ phép!');
        await fetchLeaveRequests(); // Refresh list
      }
    } catch (error: any) {
      console.error('Error approving leave:', error);
      alert(error.response?.data?.message || 'Có lỗi xảy ra khi duyệt đơn!');
    } finally {
      setLoading(false);
    }
  };

  const handleReject = async (id: string) => {
    const reason = prompt('Nhập lý do từ chối:');
    if (!reason || reason.trim() === '') return;
    
    setLoading(true);
    try {
      const response = await leaveService.approveOrRejectLeave(id, {
        status: 'Rejected',
        rejectionReason: reason
      });
      
      if (response.success) {
        alert('Đã từ chối đơn nghỉ phép!');
        await fetchLeaveRequests(); // Refresh list
      }
    } catch (error: any) {
      console.error('Error rejecting leave:', error);
      alert(error.response?.data?.message || 'Có lỗi xảy ra khi từ chối đơn!');
    } finally {
      setLoading(false);
    }
  };

  return {
    // State
    leaveRequests,
    filterStatus,
    filterType,
    filterDept,
    loading,
    fetching,
    page,
    total,
    limit,
    stats,
    filteredRequests,
    departments,
    
    // Setters
    setFilterStatus,
    setFilterType,
    setFilterDept,
    setPage,
    
    // Functions
    fetchLeaveRequests,
    getEmployeeName,
    getDepartmentName,
    getLeaveTypeName,
    formatDateRange,
    calculateDays,
    handleApprove,
    handleReject,
  };
}
