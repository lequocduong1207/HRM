import { useState } from 'react';

/**
 * Custom hook for managing form submission states
 * Quản lý trạng thái loading, error, success khi submit form
 */
export function useFormSubmit() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const startSubmit = () => {
    setLoading(true);
    setError(null);
    setSuccess(false);
  };

  const submitSuccess = (message?: string) => {
    setLoading(false);
    setSuccess(true);
    if (message) {
      setError(null);
    }
  };

  const submitError = (errorMessage: string) => {
    setLoading(false);
    setError(errorMessage);
    setSuccess(false);
  };

  const resetSubmit = () => {
    setLoading(false);
    setError(null);
    setSuccess(false);
  };

  return {
    loading,
    error,
    success,
    startSubmit,
    submitSuccess,
    submitError,
    resetSubmit,
    setError,
  };
}
