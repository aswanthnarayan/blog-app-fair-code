'use client';

import { useState, useCallback } from 'react';

interface ConfirmationOptions {
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  type?: 'danger' | 'warning' | 'info';
}

export const useConfirmationModal = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [options, setOptions] = useState<ConfirmationOptions>({
    title: '',
    message: '',
  });
  const [onConfirm, setOnConfirm] = useState<(() => void) | null>(null);
  const [loading, setLoading] = useState(false);

  const showConfirmation = useCallback((
    confirmationOptions: ConfirmationOptions,
    confirmCallback: () => void | Promise<void>
  ) => {
    setOptions(confirmationOptions);
    setOnConfirm(() => confirmCallback);
    setIsOpen(true);
  }, []);

  const handleConfirm = useCallback(async () => {
    if (onConfirm) {
      setLoading(true);
      try {
        await onConfirm();
        setIsOpen(false);
      } catch (error) {
        console.error('Confirmation action failed:', error);
        // Keep modal open on error so user can try again
      } finally {
        setLoading(false);
      }
    }
  }, [onConfirm]);

  const handleClose = useCallback(() => {
    if (!loading) {
      setIsOpen(false);
      setOnConfirm(null);
      setLoading(false);
    }
  }, [loading]);

  return {
    isOpen,
    options,
    loading,
    showConfirmation,
    handleConfirm,
    handleClose,
  };
};
