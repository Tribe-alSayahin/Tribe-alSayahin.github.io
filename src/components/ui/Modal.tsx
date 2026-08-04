'use client';

import React, { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'motion/react';
import { X } from 'lucide-react';
import { fadeIn, scaleIn } from '../../lib/motion-presets';

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  ariaLabel?: string;
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
}

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  ariaLabel,
  children,
  size = 'md',
}) => {
  const modalRef = useRef<HTMLDivElement>(null);
  const [portalRoot, setPortalRoot] = useState<HTMLElement | null>(null);

  useEffect(() => {
    setPortalRoot(document.body);
  }, []);

  // 1. Close on Escape key press
  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden'; // Lock background scroll
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      if (isOpen) document.body.style.overflow = previousOverflow;
    };
  }, [isOpen, onClose]);

  // 2. Simple Focus Trap: focus close button or dialog container on open
  useEffect(() => {
    if (isOpen && modalRef.current) {
      // Find all focusable elements
      const focusableElements = modalRef.current.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      if (focusableElements.length > 0) {
        (focusableElements[0] as HTMLElement).focus();
      } else {
        modalRef.current.focus();
      }

      // Handle tab looping
      const handleTabKey = (e: KeyboardEvent) => {
        if (e.key !== 'Tab') return;

        const focusables = modalRef.current?.querySelectorAll(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        ) || [];

        if (focusables.length === 0) return;

        const firstEl = focusables[0] as HTMLElement;
        const lastEl = focusables[focusables.length - 1] as HTMLElement;

        if (e.shiftKey) {
          if (document.activeElement === firstEl) {
            lastEl.focus();
            e.preventDefault();
          }
        } else {
          if (document.activeElement === lastEl) {
            firstEl.focus();
            e.preventDefault();
          }
        }
      };

      window.addEventListener('keydown', handleTabKey);
      return () => {
        window.removeEventListener('keydown', handleTabKey);
      };
    }
  }, [isOpen, portalRoot]);

  const sizeClasses = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-4xl',
    full: 'max-w-[95vw] h-[90vh]',
  };

  if (!portalRoot) return null;

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop blur & overlay */}
          <motion.div
            {...fadeIn}
            onClick={onClose}
            className="fixed inset-0 bg-ink/80 backdrop-blur-md cursor-pointer"
            aria-hidden="true"
          />

          {/* Modal Container */}
          <motion.div
            ref={modalRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby={title ? 'modal-title' : undefined}
            aria-label={title ? undefined : ariaLabel}
            tabIndex={-1}
            {...scaleIn}
            className={`relative min-h-0 max-h-[calc(100dvh-2rem)] w-full ${sizeClasses[size]} bg-ink-2 border border-brass/25 rounded-2xl shadow-glow-md flex flex-col overflow-hidden z-10 text-right focus:outline-none`}
          >
            {/* Header */}
            <div className="flex shrink-0 items-center justify-between border-b border-brass/10 bg-ink-2/80 px-5 py-4 sm:px-6">
              <button
                onClick={onClose}
                className="inline-flex min-h-11 min-w-11 items-center justify-center rounded-full text-sand-dim hover:text-brass-lt hover:bg-brass/10 transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brass"
                aria-label="إغلاق النافذة"
              >
                <X className="w-5 h-5" />
              </button>
              {title && (
                <h3 id="modal-title" className="text-lg font-serif font-bold text-sand">
                  {title}
                </h3>
              )}
            </div>

            {/* Scrollable Content */}
            <div className="min-h-0 flex-1 overflow-y-auto p-4 text-sand-dim text-sm leading-relaxed font-sans sm:p-6">
              {children}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>,
    portalRoot,
  );
};
