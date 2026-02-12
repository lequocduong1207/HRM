/**
 * Custom hook for employee form validation
 * Tách logic validation để tái sử dụng trong AddEmployee và EditEmployee
 */

export interface EmployeeValidationResult {
  isValid: boolean;
  error: string | null;
}

export function useEmployeeValidation() {
  /**
   * Validate date of birth
   * - Must be in the past
   * - Age must be between 18 and 65
   */
  const validateDateOfBirth = (dateOfBirth: string): string | null => {
    if (!dateOfBirth) return null;
    
    const today = new Date();
    const birthDate = new Date(dateOfBirth);
    
    if (birthDate >= today) {
      return 'Ngày sinh phải nhỏ hơn ngày hiện tại';
    }
    
    const age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    const dayDiff = today.getDate() - birthDate.getDate();
    
    const actualAge = monthDiff < 0 || (monthDiff === 0 && dayDiff < 0) ? age - 1 : age;
    
    if (actualAge < 18) {
      return 'Nhân viên phải từ 18 tuổi trở lên';
    }
    
    if (actualAge > 65) {
      return 'Nhân viên không được vượt quá 65 tuổi';
    }
    
    return null;
  };

  /**
   * Validate hire date
   * - For new employees: must be today or future
   * - For existing employees: can be in the past (when editing)
   */
  const validateHireDate = (hireDate: string, isEdit: boolean = false): string | null => {
    if (!hireDate) return null;
    
    // Khi edit, cho phép ngày vào làm trong quá khứ
    if (isEdit) {
      return null;
    }
    
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Reset time to compare only dates
    
    const hireDateObj = new Date(hireDate);
    hireDateObj.setHours(0, 0, 0, 0);
    
    if (hireDateObj < today) {
      return 'Ngày vào làm phải từ hôm nay trở đi';
    }
    
    return null;
  };

  /**
   * Validate required employee fields
   */
  const validateRequiredFields = (data: {
    fullName?: string;
    email?: string;
    phone?: string;
    departmentId?: string;
    position?: string;
    hireDate?: string;
    salary?: number;
  }): string | null => {
    if (!data.fullName) return 'Họ và tên là bắt buộc';
    if (!data.email) return 'Email là bắt buộc';
    if (!data.phone) return 'Số điện thoại là bắt buộc';
    if (!data.departmentId) return 'Phòng ban là bắt buộc';
    if (!data.position) return 'Chức vụ là bắt buộc';
    if (!data.hireDate) return 'Ngày vào làm là bắt buộc';
    if (data.salary === undefined || data.salary === null || data.salary <= 0) {
      return 'Mức lương phải lớn hơn 0';
    }
    
    return null;
  };

  /**
   * Validate email format
   */
  const validateEmail = (email: string): string | null => {
    if (!email) return null;
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return 'Email không hợp lệ';
    }
    
    return null;
  };

  /**
   * Validate phone number format
   */
  const validatePhone = (phone: string): string | null => {
    if (!phone) return null;
    
    const phoneRegex = /^[0-9]{10,11}$/;
    if (!phoneRegex.test(phone)) {
      return 'Số điện thoại phải có 10-11 chữ số';
    }
    
    return null;
  };

  /**
   * Validate national ID format
   */
  const validateNationalId = (nationalId: string): string | null => {
    if (!nationalId) return null;
    
    if (nationalId.length < 9 || nationalId.length > 12) {
      return 'CMND/CCCD phải có 9-12 chữ số';
    }
    
    return null;
  };

  /**
   * Validate all employee data
   */
  const validateEmployeeData = (
    data: any,
    isEdit: boolean = false
  ): EmployeeValidationResult => {
    // Required fields
    const requiredError = validateRequiredFields(data);
    if (requiredError) {
      return { isValid: false, error: requiredError };
    }

    // Email
    const emailError = validateEmail(data.email);
    if (emailError) {
      return { isValid: false, error: emailError };
    }

    // Phone
    const phoneError = validatePhone(data.phone);
    if (phoneError) {
      return { isValid: false, error: phoneError };
    }

    // Date of birth
    if (data.dob) {
      const dobError = validateDateOfBirth(data.dob);
      if (dobError) {
        return { isValid: false, error: dobError };
      }
    }

    // Hire date
    const hireDateError = validateHireDate(data.hireDate, isEdit);
    if (hireDateError) {
      return { isValid: false, error: hireDateError };
    }

    // National ID
    if (data.nationalId) {
      const nationalIdError = validateNationalId(data.nationalId);
      if (nationalIdError) {
        return { isValid: false, error: nationalIdError };
      }
    }

    return { isValid: true, error: null };
  };

  return {
    validateDateOfBirth,
    validateHireDate,
    validateRequiredFields,
    validateEmail,
    validatePhone,
    validateNationalId,
    validateEmployeeData,
  };
}
