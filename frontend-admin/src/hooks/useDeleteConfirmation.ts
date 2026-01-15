import { useState, useCallback } from 'react';

/**
 * Custom hook for delete confirmation modal
 * @returns Modal state and handlers
 */
export const useDeleteConfirmation = <T>() => {
  const [showModal, setShowModal] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<T | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const openModal = useCallback((item: T) => {
    setItemToDelete(item);
    setShowModal(true);
  }, []);

  const closeModal = useCallback(() => {
    setShowModal(false);
    setItemToDelete(null);
  }, []);

  const handleDelete = useCallback(
    async (deleteFunction: (item: T) => Promise<{ success: boolean; message?: string }>) => {
      if (!itemToDelete) return;

      try {
        setIsDeleting(true);
        const result = await deleteFunction(itemToDelete);

        if (result.success) {
          closeModal();
          return { success: true };
        } else {
          return { success: false, message: result.message };
        }
      } catch (error) {
        return { success: false, message: String(error) };
      } finally {
        setIsDeleting(false);
      }
    },
    [itemToDelete, closeModal]
  );

  return {
    showModal,
    itemToDelete,
    isDeleting,
    openModal,
    closeModal,
    handleDelete,
  };
};
