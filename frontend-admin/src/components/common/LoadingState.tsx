interface LoadingStateProps {
  message?: string;
}

/**
 * Reusable Loading State Component
 */
export const LoadingState = ({ message = "Đang tải..." }: LoadingStateProps) => {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-gray-500 dark:text-gray-400">{message}</div>
    </div>
  );
};
