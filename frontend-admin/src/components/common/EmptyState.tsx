import { Link } from "react-router";

interface EmptyStateProps {
  title: string;
  description: string;
  icon?: React.ReactNode;
  actionLabel?: string;
  actionTo?: string;
  onAction?: () => void;
}

/**
 * Empty State Component
 * Hiển thị khi không có dữ liệu để hiển thị
 */
export const EmptyState = ({
  title,
  description,
  icon,
  actionLabel,
  actionTo,
  onAction,
}: EmptyStateProps) => {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4">
      {icon && (
        <div className="mb-4 text-gray-400 dark:text-gray-600">
          {icon}
        </div>
      )}
      <h3 className="mb-2 text-lg font-semibold text-gray-900 dark:text-white">
        {title}
      </h3>
      <p className="mb-6 text-center text-sm text-gray-500 dark:text-gray-400 max-w-md">
        {description}
      </p>
    </div>
  );
};
