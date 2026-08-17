import { type ReactNode } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

interface ModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  subtitle?: string;
  children: ReactNode;
  footer?: ReactNode;
  size?: 'sm' | 'md' | 'lg';
}

const sizeMap = { sm: 'max-w-md', md: 'max-w-lg', lg: 'max-w-2xl' };

export default function Modal({ open, onClose, title, subtitle, children, footer, size = 'md' }: ModalProps) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 grid place-items-center p-4 bg-ink-900/40"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 16 }}
            transition={{ type: 'spring', stiffness: 350, damping: 28 }}
            onClick={(e) => e.stopPropagation()}
            className={`w-full ${sizeMap[size]} bg-white rounded-xl shadow-card border border-gray-100 max-h-[90vh] flex flex-col`}
          >
            <div className="flex items-start justify-between p-6 pb-4 border-b border-gray-100">
              <div>
                <h3 className="font-display font-bold text-lg text-ink-900">{title}</h3>
                {subtitle && <p className="text-sm text-ink-600 mt-0.5">{subtitle}</p>}
              </div>
              <button onClick={onClose} className="grid place-items-center h-10 w-10 rounded-lg text-ink-600 hover:bg-gray-50 transition-colors flex-shrink-0" aria-label="Close">
                <X size={18} />
              </button>
            </div>
            <div className="p-6 overflow-y-auto scrollbar-none flex-1">{children}</div>
            {footer && <div className="p-6 pt-4 border-t border-gray-100 flex gap-3 justify-end">{footer}</div>}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
