import React from 'react';

interface NotificationsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const NotificationsModal: React.FC<NotificationsModalProps> = ({
  isOpen,
  onClose,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-md rounded-[28px] p-6 card-shadow border border-[#EBE7DF] relative max-h-[85vh] overflow-y-auto">
        <div className="flex items-center justify-between border-b border-[#EBE7DF] pb-4 mb-4">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#7B8B6F]">notifications</span>
            <h2 className="font-serif text-xl font-bold text-[#5A5A40]">
              Notificaciones
            </h2>
          </div>
          <button
            onClick={onClose}
            className="text-[#8D8D7E] hover:text-[#5A5A40] p-1 rounded-full hover:bg-[#F1EFE7]"
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        <div className="py-10 text-center space-y-3">
          <span className="material-symbols-outlined text-4xl text-[#A3A395] block">
            notifications_off
          </span>
          <p className="font-body text-sm text-[#8D8D7E]">
            No tienes notificaciones por el momento.
          </p>
        </div>

        <div className="mt-2 pt-4 border-t border-[#EBE7DF] flex justify-end">
          <button
            onClick={onClose}
            className="w-full py-2.5 bg-[#F1EFE7] hover:bg-[#EBE7DF] text-[#5A5A40] font-mono text-xs font-bold rounded-xl transition-colors border border-[#EBE7DF]"
          >
            Entendido
          </button>
        </div>
      </div>
    </div>
  );
};