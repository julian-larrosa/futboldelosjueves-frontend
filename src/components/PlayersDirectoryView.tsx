import React, { useState } from 'react';
import { Player } from '../types';

interface PlayersDirectoryViewProps {
  players: Player[];
  onSelectPlayer: (playerId: string) => void;
}

export const PlayersDirectoryView: React.FC<PlayersDirectoryViewProps> = ({
  players,
  onSelectPlayer,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPosition, setSelectedPosition] = useState<string>('TODOS');

  const filtered = players.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.roleTitle.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesPos = selectedPosition === 'TODOS' || p.position === selectedPosition;
    return matchesSearch && matchesPos;
  });

  return (
    <div className="space-y-6 pb-12 pt-2">
      {/* Header */}
      <div>
        <h1 className="font-serif text-2xl md:text-3xl font-bold text-[#5A5A40] tracking-tight">
          Directorio de Jugadores
        </h1>
        <p className="font-body text-[#8D8D7E] text-sm mt-0.5">
          Plantel oficial de la Liga FDLJ 2024 ({players.length} fichados)
        </p>
      </div>

      {/* Search & Filter Bar */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-grow">
          <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-[#7B8B6F] text-[20px]">
            search
          </span>
          <input
            type="text"
            placeholder="Buscar por nombre o rol..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-white pl-10 pr-4 py-2.5 rounded-2xl border border-[#EBE7DF] text-sm text-[#4A4A3F] placeholder-[#8D8D7E] focus:outline-none focus:ring-2 focus:ring-[#7B8B6F] card-shadow"
          />
        </div>

        {/* Position Pills */}
        <div className="flex bg-white p-1 rounded-2xl border border-[#EBE7DF] card-shadow overflow-x-auto hide-scrollbar">
          {['TODOS', 'DEL', 'MED', 'DEF', 'POR'].map((pos) => (
            <button
              key={pos}
              onClick={() => setSelectedPosition(pos)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-mono font-bold whitespace-nowrap transition-all ${
                selectedPosition === pos
                  ? 'bg-[#5A5A40] text-white shadow-xs'
                  : 'text-[#8D8D7E] hover:text-[#5A5A40]'
              }`}
            >
              {pos}
            </button>
          ))}
        </div>
      </div>

      {/* Players Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((player) => {
          return (
            <div
              key={player.id}
              onClick={() => onSelectPlayer(player.id)}
              className={`bg-white rounded-[28px] p-5 card-shadow card-hover border border-[#EBE7DF] cursor-pointer flex flex-col justify-between transition-all ${
                player.isCurrentUser ? 'ring-2 ring-[#5A5A40]' : ''
              }`}
            >
              <div>
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="flex items-center gap-3">
                    {player.avatar ? (
                      <img
                        src={player.avatar}
                        alt={player.name}
                        className="w-12 h-12 rounded-full object-cover border border-[#EBE7DF] shrink-0 bg-[#D2B48C]"
                        referrerPolicy="no-referrer"
                      />
                    ) : (
                      <div className="w-12 h-12 rounded-full bg-[#EBE7DF] flex items-center justify-center font-mono font-bold text-sm text-[#5A5A40] shrink-0">
                        {player.name
                          .split(' ')
                          .map((n) => n[0])
                          .join('')
                          .slice(0, 2)}
                      </div>
                    )}
                    <div>
                      <h3 className="font-serif font-bold text-base text-[#5A5A40] leading-tight">
                        {player.name}
                      </h3>
                      <p className="font-mono text-xs text-[#8D8D7E] mt-0.5">
                        {player.roleTitle}
                      </p>
                    </div>
                  </div>

                  {/* OVR Badge */}
                  <div className="bg-[#5A5A40] text-white px-2.5 py-1 rounded-full font-serif font-bold text-sm flex items-center gap-1 shadow-xs">
                    <span className="text-[9px] font-mono opacity-80">OVR</span>
                    <span>{player.ovr.toFixed(1)}</span>
                  </div>
                </div>

                {/* Quick stats chips */}
                <div className="grid grid-cols-3 gap-2 py-3 border-y border-[#EBE7DF] text-center my-3 bg-[#F9F7F2]/60 rounded-2xl">
                  <div>
                    <span className="block font-serif font-bold text-sm text-[#5A5A40]">
                      {player.matchesPlayed}
                    </span>
                    <span className="block font-mono text-[9px] text-[#8D8D7E] uppercase">
                      Partidos
                    </span>
                  </div>
                  <div>
                    <span className="block font-serif font-bold text-sm text-[#7B8B6F]">
                      {player.goals}
                    </span>
                    <span className="block font-mono text-[9px] text-[#8D8D7E] uppercase">
                      Goles
                    </span>
                  </div>
                  <div>
                    <span className="block font-serif font-bold text-sm text-[#5A5A40]">
                      {player.points}
                    </span>
                    <span className="block font-mono text-[9px] text-[#8D8D7E] uppercase">
                      Puntos
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between pt-1">
                <span className="text-[11px] font-mono font-bold text-[#5A5A40] bg-[#F1EFE7] px-2.5 py-0.5 rounded-full border border-[#EBE7DF]">
                  {player.position}
                </span>
                <span className="text-xs font-mono font-bold text-[#7B8B6F] flex items-center gap-1 hover:underline">
                  <span>Ver Atributos</span>
                  <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
