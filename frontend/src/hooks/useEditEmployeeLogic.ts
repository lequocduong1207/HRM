import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router';
import { employeeService } from '../api/employees.api';
import type { CreateEmployeeRequest } from '../types';
import { getErrorMessage } from '../utils';
import { useDepartments } from './useDepartments';
import { useEmployees } from './useEmployees';
import { useFormData } from './useFormData';
import { useFormSubmit } from './useFormSubmit';
import { useEmployeeValidation } from './useEmployeeValidation';

/**
 * Custom hook for EditEmployee page logic
 * Tách toàn bộ logic của trang EditEmployee để dễ dàng test và tái sử dụng
 */
export function useEditEmployeeLogic() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  
  const initialFormData: Partial<CreateEmployeeRequest> = {
    fullName: '',
    email: '',
    phone: '',
    dob: '',
    gender: '',
    address: '',
    nationalId: '',
    position: '',
    departmentId: '',
    salary: 0,
    hireDate: '',
  };

  const { formData, handleChange, setFormValues } = useFormData(initialFormData);
  const { loading, error, success, startSubmit, submitSuccess, submitError, setError } = useFormSubmit();
  const { departments, fetchDepartments } = useDepartments();
  const { updateEmployee } = useEmployees();
  const { validateEmployeeData } = useEmployeeValidation();
  
  const [loadingData, setLoadingData] = useState(true);

  // Fetch employee data on mount
  useEffect(() => {
    const fetchData = async () => {
      if (!id) {
        setError('ID nhân viên không hợp lệ');
        setLoadingData(false);
        return;
      }

      try {
        setLoadingData(true);
        
        // Fetch employee details
        const response: any = await employeeService.getEmployeeById(id);
        // Handle both direct employee data and wrapped response
        const employee = response.data?.data || response.data || response;
        
        // Pre-fill form with employee data
        setFormValues({
          fullName: employee.fullName,
          email: employee.email,
          phone: employee.phone,
          dob: employee.dob ? new Date(employee.dob).toISOString().split('T')[0] : '',
          gender: employee.gender || '',
          address: employee.address || '',
          nationalId: employee.nationalId || '',
          position: employee.position,
          departmentId: typeof employee.departmentId === 'string' ? employee.departmentId : employee.departmentId._id,
          salary: employee.salary,
          hireDate: new Date(employee.hireDate).toISOString().split('T')[0],
        });
      } catch (err) {
        console.error('Failed to fetch data:', err);
        setError(getErrorMessage(err));
      } finally {
        setLoadingData(false);
      }
    };
    
    fetchData();
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!id) {
      submitError('ID nhân viên không hợp lệ');
      return;
    }
    
    startSubmit();

    try {
      // Validate employee data (isEdit = true)
      const validation = validateEmployeeData(formData, true);
      if (!validation.isValid) {
        throw new Error(validation.error || 'Dữ liệu không hợp lệ');
      }

      // Update employee
      const result = await updateEmployee(id, formData as CreateEmployeeRequest);

      if (!result.success) {
        throw new Error(result.message || 'Không thể cập nhật nhân viên');
      }

      // Refresh departments to update employee count
      await fetchDepartments();

      submitSuccess();
      
      // Redirect after 1.5 seconds
      setTimeout(() => {
        navigate('/employees');
      }, 1500);
    } catch (err: any) {
      submitError(getErrorMessage(err));
    }
  };

  return {
    id,
    formData,
    handleChange,
    departments,
    loading,
    loadingData,
    error,
    success,
    handleSubmit,
    navigate,
  };
}
