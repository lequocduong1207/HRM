import { useState } from 'react';
import { useNavigate } from 'react-router';
import type { CreateEmployeeRequest, UserRole } from '../types';
import { getErrorMessage } from '../utils';
import { useDepartments } from './useDepartments';
import { useEmployees } from './useEmployees';
import { useUsers } from './useUsers';
import { useEmployeeValidation } from './useEmployeeValidation';
import { useFormData } from './useFormData';
import { useFormSubmit } from './useFormSubmit';

export const useAddEmployeeLogic = () => {
  const navigate = useNavigate();
  const { departments, fetchDepartments } = useDepartments();
  const { createEmployee } = useEmployees();
  const { createUser } = useUsers();
  const { validateDateOfBirth, validateHireDate } = useEmployeeValidation();
  
  const { formData, handleChange, resetForm } = useFormData<Partial<CreateEmployeeRequest>>({
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
  });

  const { loading, error, success, setError, startSubmit, submitSuccess, submitError, resetSubmit } = useFormSubmit();
  
  // Account creation states
  const [createAccount, setCreateAccount] = useState(false);
  const [accountData, setAccountData] = useState<{
    password: string;
    confirmPassword: string;
    role: UserRole;
  }>({
    password: '',
    confirmPassword: '',
    role: 'employee'
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    startSubmit();

    try {
      // Validate required fields
      if (!formData.fullName || !formData.email || !formData.phone || 
          !formData.departmentId || !formData.position || !formData.hireDate || !formData.salary) {
        throw new Error('Vui lòng điền đầy đủ các trường bắt buộc');
      }

      // Validate date of birth
      if (formData.dob) {
        const dobError = validateDateOfBirth(formData.dob);
        if (dobError) {
          throw new Error(dobError);
        }
      }

      // Validate hire date - for add employee, it must be from today onwards
      if (formData.hireDate) {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const hireDateObj = new Date(formData.hireDate);
        hireDateObj.setHours(0, 0, 0, 0);
        
        if (hireDateObj < today) {
          throw new Error('Ngày vào làm phải từ hôm nay trở đi');
        }
      }

      // Validate account creation if enabled
      if (createAccount) {
        if (!accountData.password || !accountData.confirmPassword) {
          throw new Error('Vui lòng nhập mật khẩu');
        }
        if (accountData.password !== accountData.confirmPassword) {
          throw new Error('Mật khẩu xác nhận không khớp');
        }
        if (accountData.password.length < 6) {
          throw new Error('Mật khẩu phải có ít nhất 6 ký tự');
        }
      }

      // Step 1: Create employee
      const employeeResult = await createEmployee(formData as CreateEmployeeRequest);

      if (!employeeResult.success) {
        throw new Error(employeeResult.message || 'Không thể tạo nhân viên');
      }

      // Step 2: Create user account if checkbox is checked
      if (createAccount && employeeResult.data) {
        try {
          const userResult = await createUser({
            email: formData.email!,
            password: accountData.password,
            fullName: formData.fullName!,
            role: accountData.role
          });

          if (!userResult.success) {
            // Employee created but user creation failed
            setError(`Nhân viên đã được tạo nhưng tài khoản không thể tạo: ${userResult.message}`);
          }
        } catch (userErr) {
          // Employee created but user creation failed
          setError(`Nhân viên đã được tạo nhưng tài khoản không thể tạo: ${getErrorMessage(userErr)}`);
        }
      }

      submitSuccess();
      
      // Refresh departments để cập nhật số lượng nhân viên
      await fetchDepartments();
      
      // Reset form
      resetForm();
      setAccountData({
        password: '',
        confirmPassword: '',
        role: 'employee'
      });
      setCreateAccount(false);
      
      // Redirect after 2 seconds
      setTimeout(() => {
        navigate('/employees');
      }, 2000);
    } catch (err: any) {
      submitError(getErrorMessage(err));
    }
  };

  return {
    formData,
    handleChange,
    loading,
    error,
    success,
    departments,
    createAccount,
    setCreateAccount,
    accountData,
    setAccountData,
    handleSubmit
  };
};
