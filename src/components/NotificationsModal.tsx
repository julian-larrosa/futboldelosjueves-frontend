import React from 'react';
import type { AppNotification } from '../utils/notifications';

interface NotificationsModalProps {
  isOpen: boolean;
  onClose: () => void;
  notifications: AppNotification[];
}

const NOTIFICATION_ICONS: Record<AppNotification['type'], string> = {
  'new-match': 'calendar_month',
};

export const NotificationsModal: React.FC<NotificationsModalProps> = ({
  isOpen,
  onClose,
  notifications,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs anim-fade-in">
      <div className="bg-white w-full max-w-md rounded-[28px] p-6 card-shadow border border-[#EBE7DF] relative max-h-[85vh] flex flex-col anim-scale-in">
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

        <div className="overflow-y-auto grow space-y-2.5 pr-1">
          {notifications.length > 0 ? (
            notifications.map((notification) => (
              <div
                key={notification.id}
                className={`flex items-start gap-3 rounded-2xl border p-3.5 ${
                  notification.read
                    ? 'bg-[#F9F7F2]/60 border-[#EBE7DF]'
                    : 'bg-[#EDF3E9]/70 border-[#7B8B6F]/30'
                }`}
              >
                <div className="w-9 h-9 rounded-full bg-[#F1EFE7] flex items-center justify-center shrink-0 text-[#5A5A40]">
                  <span className="material-symbols-outlined text-[20px]">
                    {NOTIFICATION_ICONS[notification.type] ?? 'circle_notifications'}
                  </span>
                </div>
                <div className="min-w-0">
                  <p className="font-body text-sm font-semibold text-[#4A4A3F] leading-snug">
                    {notification.title}
                  </p>
                  <p className="font-body text-xs text-[#8D8D7E] mt-0.5">{notification.body}</p>
                  <p className="font-mono text-[10px] text-[#A3A395] mt-1">
                    {new Date(notification.createdAt).toLocaleString('es-AR', {
                      day: 'numeric',
                      month: 'short',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </p>
                </div>
              </div>
            ))
          ) : (
            <div className="py-10 text-center space-y-3">
              <span className="material-symbols-outlined text-4xl text-[#A3A395] block">
                notifications_off
              </span>
              <p className="font-body text-sm text-[#8D8D7E]">
                No tienes notificaciones por el momento.
              </p>
            </div>
          )}
        </div>

        <div className="mt-4 pt-4 border-t border-[#EBE7DF] flex justify-end">
          <button
            onClick={onClose}
            className="w-full py-2.5 bg-[#F1EFE7] hover:bg-[#EBE7DF] text-[#5A5A40] font-mono text-xs font-bold rounded-xl transition-all active:scale-[0.98] border border-[#EBE7DF]"
          >
            Entendido
          </button>
        </div>
      </div>
    </div>
  );
};
