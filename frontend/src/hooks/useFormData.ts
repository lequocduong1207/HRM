import { useState } from 'react';

/**
 * Custom hook for form state management
 * Quản lý state của form một cách tổng quát
 */
export function useFormData<T extends Record<string, any>>(initialData: T) {
  const [formData, setFormData] = useState<T>(initialData);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target;
    
    setFormData(prev => ({
      ...prev,
      [name]: type === 'number' ? (value === '' ? 0 : parseFloat(value)) : value,
    }));
  };

  const setFieldValue = (name: keyof T, value: any) => {
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const resetForm = () => {
    setFormData(initialData);
  };

  const setFormValues = (values: Partial<T>) => {
    setFormData(prev => ({
      ...prev,
      ...values,
    }));
  };

  return {
    formData,
    setFormData,
    handleChange,
    setFieldValue,
    resetForm,
    setFormValues,
  };
}
