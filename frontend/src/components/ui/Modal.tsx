import React, { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { cn } from '@/utils/cn';
import { X } from 'lucide-react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showCloseButton?: boolean;
}

interface ModalHeaderProps {
  children: React.ReactNode;
  onClose?: () => void;
  showCloseButton?: boolean;
}

interface ModalContentProps {
  children: React.ReactNode;
}

interface ModalFooterProps {
  children: React.ReactNode;
}

const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
  size = 'md'
}) => {
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const sizes = {
    sm: 'max-w-md',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl'
  };

  return createPortal(
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-full items-center justify-center p-4">
        {/* Backdrop */}
        <div
          className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
          onClick={onClose}
          aria-hidden="true"
        />
        
        {/* Modal */}
        <div
          className={cn(
            'relative w-full bg-white rounded-lg shadow-xl transform transition-all',
            sizes[size]
          )}
          role="dialog"
          aria-modal="true"
          aria-labelledby={title ? 'modal-title' : undefined}
        >
          {children}
        </div>
      </div>
    </div>,
    document.body
  );
};

const ModalHeader: React.FC<ModalHeaderProps> = ({
  children,
  onClose,
  showCloseButton = true
}) => {
  return (
    <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
      <div className="flex-1">
        {children}
      </div>
      {showCloseButton && onClose && (
        <button
          onClick={onClose}
          className="ml-4 p-1 rounded-md text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
          aria-label="Close modal"
        >
          <X className="h-5 w-5" />
        </button>
      )}
    </div>
  );
};

const ModalContent: React.FC<ModalContentProps> = ({ children }) => {
  return (
    <div className="px-6 py-4">
      {children}
    </div>
  );
};

const ModalFooter: React.FC<ModalFooterProps> = ({ children }) => {
  return (
    <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-gray-200 bg-gray-50">
      {children}
    </div>
  );
};

export { Modal, ModalHeader, ModalContent, ModalFooter };
