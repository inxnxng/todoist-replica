'use client';

import { X } from 'lucide-react';
import { useEffect, useState } from 'react';

interface ConfirmDialogProps {
  isOpen: boolean;
  title: string;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
  confirmText?: string;
  cancelText?: string;
}

export default function ConfirmDialog({
  isOpen,
  title,
  message,
  onConfirm,
  onCancel,
  confirmText = '확인',
  cancelText = '취소',
}: ConfirmDialogProps) {
  const [show, setShow] = useState(isOpen);

  useEffect(() => {
    setShow(isOpen);
  }, [isOpen]);

  if (!show) return null;

  return (
    <div className="animate-in fade-in fixed inset-0 z-50 flex items-center justify-center bg-black/20 p-4 backdrop-blur-sm duration-200">
      <div className="animate-in zoom-in-95 w-full max-w-sm overflow-hidden rounded-xl border border-gray-100 bg-white shadow-xl duration-200 dark:border-gray-700 dark:bg-[#282828]">
        <div className="p-5">
          <div className="mb-2 flex items-center justify-between">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white">
              {title}
            </h3>
            <button
              onClick={onCancel}
              className="text-gray-400 transition-colors hover:text-gray-600 dark:hover:text-gray-300"
            >
              <X size={20} />
            </button>
          </div>
          <p className="text-sm leading-relaxed text-gray-500 dark:text-gray-400">
            {message}
          </p>
        </div>

        <div className="flex items-center justify-end gap-2 border-t border-gray-100 bg-gray-50 p-4 dark:border-gray-700 dark:bg-[#1f1f1f]">
          <button
            onClick={onCancel}
            className="rounded-lg px-4 py-2 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-200 dark:text-gray-300 dark:hover:bg-gray-700"
          >
            {cancelText}
          </button>
          <button
            onClick={onConfirm}
            className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white shadow-sm transition-colors hover:bg-primary-hover"
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}
