import { useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { AlertTriangle } from 'lucide-react';

interface ConfirmModalProps {
  isOpen: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export function ConfirmModal({
  isOpen,
  title,
  message,
  confirmLabel = 'تأكيد',
  cancelLabel = 'إلغاء',
  onConfirm,
  onCancel,
}: ConfirmModalProps) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onCancel();
      }
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onCancel]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div
          className="fixed inset-0 z-[110] flex items-center justify-center p-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="confirm-modal-title"
        >
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            onClick={onCancel}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative w-full max-w-md rounded-2xl border border-copper/30 bg-ink-2 p-6 shadow-2xl text-right"
          >
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl border border-copper/30 bg-copper/10 flex items-center justify-center shrink-0">
                <AlertTriangle className="w-6 h-6 text-copper-lt" aria-hidden="true" />
              </div>
              <div className="flex-1">
                <h3 id="confirm-modal-title" className="font-ruqaa text-xl text-sand mb-2">
                  {title}
                </h3>
                <p className="text-sm text-sand-dim leading-relaxed">{message}</p>
              </div>
            </div>
            <div className="flex items-center justify-end gap-3 mt-6">
              <button
                onClick={onCancel}
                className="px-4 py-2 rounded-lg border border-sand/25 text-sm font-kufi text-sand-dim hover:bg-sand/10 transition-colors focus-visible:ring-2 focus-visible:ring-brass focus-visible:outline-none"
              >
                {cancelLabel}
              </button>
              <button
                onClick={onConfirm}
                className="px-4 py-2 rounded-lg border border-copper/40 bg-copper/10 text-sm font-kufi text-copper-lt hover:bg-copper/20 transition-colors focus-visible:ring-2 focus-visible:ring-copper focus-visible:outline-none"
              >
                {confirmLabel}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
