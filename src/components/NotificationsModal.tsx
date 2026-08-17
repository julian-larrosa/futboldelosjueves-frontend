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

  const notifications = [
    {
      id: 1,
      title: 'Convocatoria Confirmada: Jornada 14',
      message: 'Tu partido está programado para el Jueves a las 20:30 hrs en Cancha 2.',
      time: 'Hace 2 horas',
      icon: 'sports_soccer',
      color: 'text-[#7B8B6F]',
      unread: true,
    },
    {
      id: 2,
      title: '¡Elegido MVP de la Jornada 13!',
      message: 'Felicitaciones, has sido votado Jugador del Partido en la victoria 4-2 de Equipo A.',
      time: 'Ayer',
      icon: 'military_tech',
      color: 'text-[#D2B48C]',
      unread: true,
    },
    {
      id: 3,
      title: 'Votación Abierta: Califica a tu Equipo',
      message: 'Ya puedes enviar tus calificaciones individuales para el último encuentro.',
      time: 'Hace 2 días',
      icon: 'how_to_reg',
      color: 'text-[#5A5A40]',
      unread: false,
    },
  ];

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

        <div className="space-y-3">
          {notifications.map((n) => (
            <div
              key={n.id}
              className={`p-3.5 rounded-2xl border transition-all ${
                n.unread
                  ? 'bg-[#E2E8DC]/40 border-[#7B8B6F]/40'
                  : 'bg-[#F9F7F2]/60 border-[#EBE7DF]'
              }`}
            >
              <div className="flex items-start gap-3">
                <span className={`material-symbols-outlined text-[24px] ${n.color} mt-0.5`}>
                  {n.icon}
                </span>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h3 className="font-serif text-sm font-bold text-[#5A5A40]">
                      {n.title}
                    </h3>
                    {n.unread && (
                      <span className="w-2 h-2 rounded-full bg-[#7B8B6F]"></span>
                    )}
                  </div>
                  <p className="font-body text-xs text-[#4A4A3F] mt-1 leading-relaxed">
                    {n.message}
                  </p>
                  <span className="font-mono text-[10px] text-[#8D8D7E] mt-2 block">
                    {n.time}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 pt-4 border-t border-[#EBE7DF] flex justify-end">
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
