import React from 'react';
import { NavTab, Player } from '../types';

interface NavigationProps {
  activeTab: NavTab;
  setActiveTab: (tab: NavTab) => void;
  currentUser: Player;
  onOpenNotifications: () => void;
}

export const Navigation: React.FC<NavigationProps> = ({
  activeTab,
  setActiveTab,
  currentUser,
  onOpenNotifications,
}) => {
  return (
    <>
      {/* DESKTOP SIDE NAVIGATION */}
      <aside className="hidden md:flex flex-col p-7 w-68 h-screen sticky top-0 bg-white border-r border-[#EBE7DF] shadow-xs shrink-0 z-40 justify-between">
        <div>
          {/* Brand */}
          <div
            onClick={() => setActiveTab('dashboard')}
            className="flex items-center gap-3 mb-10 cursor-pointer group"
          >
            <div className="w-10 h-10 bg-[#7B8B6F] rounded-full flex items-center justify-center text-white shadow-xs group-hover:scale-105 transition-transform">
              <span className="material-symbols-outlined text-[20px]">sports_soccer</span>
            </div>
            <div className="flex flex-col">
              <span className="font-serif italic text-2xl font-bold tracking-tight text-[#5A5A40]">
                FDLJ
              </span>
              <span className="text-[9px] uppercase font-mono tracking-widest text-[#A3A395] font-bold -mt-1">
                Temporada 2024
              </span>
            </div>
          </div>

          {/* Navigation Items */}
          <nav className="flex flex-col gap-2">
            {[
              { tab: 'dashboard' as NavTab, label: 'Dashboard', icon: 'dashboard' },
              { tab: 'matches' as NavTab, label: 'Partidos', icon: 'sports_soccer' },
              { tab: 'players' as NavTab, label: 'Jugadores', icon: 'groups' },
              { tab: 'rankings' as NavTab, label: 'Rankings', icon: 'leaderboard' },
              { tab: 'profile' as NavTab, label: 'Mi Perfil', icon: 'person' },
            ].map((item) => {
              const isActive = activeTab === item.tab;
              return (
                <button
                  key={item.tab}
                  onClick={() => setActiveTab(item.tab)}
                  className={`w-full flex items-center gap-3.5 px-4 py-3 rounded-2xl text-left transition-all ${
                    isActive
                      ? 'bg-[#5A5A40] text-white shadow-sm font-semibold'
                      : 'text-[#8D8D7E] hover:text-[#5A5A40] hover:bg-[#F9F7F2]'
                  }`}
                >
                  <span
                    className={`material-symbols-outlined text-[20px] ${
                      isActive ? 'fill' : ''
                    }`}
                  >
                    {item.icon}
                  </span>
                  <span className="font-body text-sm font-medium">{item.label}</span>
                </button>
              );
            })}

            {/* Notifications Button on Desktop */}
            <button
              onClick={onOpenNotifications}
              className="w-full flex items-center justify-between px-4 py-3 rounded-2xl text-left text-[#8D8D7E] hover:text-[#5A5A40] hover:bg-[#F9F7F2] transition-colors mt-2"
            >
              <div className="flex items-center gap-3.5">
                <span className="material-symbols-outlined text-[20px]">notifications</span>
                <span className="font-body text-sm font-medium">Notificaciones</span>
              </div>
              <span className="w-2 h-2 rounded-full bg-[#D97B66]"></span>
            </button>
          </nav>
        </div>

        {/* Bottom Section: Profile & Upcoming summary in Natural Tones Card */}
        <div className="space-y-3 pt-4">
          <div
            onClick={() => setActiveTab('profile')}
            className="bg-[#F1EFE7] rounded-[24px] p-4 flex items-center gap-3 cursor-pointer hover:bg-[#EBE7DF] transition-colors border border-[#EBE7DF]"
          >
            <div className="w-11 h-11 rounded-full overflow-hidden border border-[#DCD6C8] shrink-0 bg-[#D2B48C]">
              <img
                src={currentUser.avatar || currentUser.photoHero}
                alt={currentUser.name}
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
            <div className="flex flex-col min-w-0">
              <span className="text-[10px] uppercase tracking-widest text-[#A3A395] font-bold">
                Usuario Activo
              </span>
              <p className="font-serif font-bold text-sm text-[#5A5A40] truncate leading-tight">
                {currentUser.name}
              </p>
              <span className="font-mono text-[11px] text-[#7B8B6F] font-bold mt-0.5">
                Rating {currentUser.rating.toFixed(1)}
              </span>
            </div>
          </div>

          <div className="p-3.5 bg-[#F9F7F2] rounded-2xl border border-[#EBE7DF] text-xs">
            <div className="flex items-center justify-between font-mono text-[#8D8D7E] text-[10px] uppercase font-bold tracking-wider mb-1">
              <span>PRÓXIMO ENCUENTRO</span>
              <span className="text-[#7B8B6F]">J14</span>
            </div>
            <p className="font-serif font-bold text-[#5A5A40]">Jueves 20:30 hrs</p>
            <p className="text-[#8D8D7E] text-[11px]">Cancha 2 • Cancha sintética</p>
          </div>
        </div>
      </aside>

      {/* MOBILE TOP APP BAR */}
      <header className="md:hidden sticky top-0 w-full z-50 bg-[#F9F7F2]/95 backdrop-blur-md border-b border-[#EBE7DF] px-4 py-3.5 flex justify-between items-center transition-all shadow-[0_2px_10px_rgba(90,90,64,0.03)]">
        {/* Leading Avatar */}
        <button
          onClick={() => setActiveTab('profile')}
          className="w-9 h-9 rounded-full overflow-hidden border border-[#EBE7DF] bg-[#D2B48C]"
        >
          <img
            src={currentUser.avatar || currentUser.photoHero}
            alt={currentUser.name}
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
        </button>

        {/* Brand */}
        <button
          onClick={() => setActiveTab('dashboard')}
          className="flex items-center gap-2"
        >
          <div className="w-6 h-6 bg-[#7B8B6F] rounded-full flex items-center justify-center text-white">
            <span className="material-symbols-outlined text-[14px]">sports_soccer</span>
          </div>
          <span className="font-serif italic font-bold text-xl text-[#5A5A40] tracking-tight">
            FDLJ
          </span>
        </button>

        {/* Trailing Icon Notifications */}
        <button
          onClick={onOpenNotifications}
          className="text-[#5A5A40] hover:text-[#7B8B6F] transition-colors relative p-1.5 rounded-full hover:bg-[#F1EFE7]"
        >
          <span className="material-symbols-outlined text-[22px]">notifications</span>
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[#D97B66] rounded-full"></span>
        </button>
      </header>

      {/* MOBILE BOTTOM NAVIGATION BAR */}
      <nav className="md:hidden fixed bottom-0 w-full z-50 bg-white/95 backdrop-blur-md border-t border-[#EBE7DF] shadow-[0_-4px_16px_rgba(90,90,64,0.06)] pb-safe pt-2 px-2 flex justify-around items-center">
        {[
          { tab: 'dashboard' as NavTab, label: 'Dashboard', icon: 'dashboard' },
          { tab: 'matches' as NavTab, label: 'Partidos', icon: 'sports_soccer' },
          { tab: 'players' as NavTab, label: 'Jugadores', icon: 'groups' },
          { tab: 'rankings' as NavTab, label: 'Rankings', icon: 'leaderboard' },
          { tab: 'profile' as NavTab, label: 'Perfil', icon: 'person' },
        ].map((item) => {
          const isActive = activeTab === item.tab;
          return (
            <button
              key={item.tab}
              onClick={() => setActiveTab(item.tab)}
              className={`flex flex-col items-center justify-center px-3 py-1.5 rounded-2xl active:scale-95 duration-200 transition-all ${
                isActive
                  ? 'bg-[#5A5A40] text-white shadow-xs font-semibold'
                  : 'text-[#8D8D7E] hover:text-[#5A5A40]'
              }`}
            >
              <span
                className={`material-symbols-outlined text-[20px] mb-0.5 ${
                  isActive ? 'fill' : ''
                }`}
              >
                {item.icon}
              </span>
              <span className="font-mono text-[10px] font-bold">{item.label}</span>
            </button>
          );
        })}
      </nav>
    </>
  );
};
