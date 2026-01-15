interface ErrorStateProps {
  message: string;
}

/**
 * Reusable Error State Component
 */
export const ErrorState = ({ message }: ErrorStateProps) => {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-red-500">Lỗi: {message}</div>
    </div>
  );
};
