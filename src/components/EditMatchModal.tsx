import React, { useState } from 'react';
import { Match, MatchScorer, Player } from '../types';

interface EditMatchModalProps {
  isOpen: boolean;
  onClose: () => void;
  match: Match;
  players: Player[];
  onSaveMatch: (updatedMatch: Match) => void;
}

export const EditMatchModal: React.FC<EditMatchModalProps> = ({
  isOpen,
  onClose,
  match,
  players,
  onSaveMatch,
}) => {
  const [teamAScore, setTeamAScore] = useState<number>(match.teamA.score ?? 0);
  const [teamBScore, setTeamBScore] = useState<number>(match.teamB.score ?? 0);
  const [status, setStatus] = useState<'upcoming' | 'finished'>(match.status as any);
  const [mvpName, setMvpName] = useState<string>(match.mvpName || 'Diego Maradona');
  const [scorers, setScorers] = useState<MatchScorer[]>(match.scorers || []);
  const [newScorerPlayerId, setNewScorerPlayerId] = useState(players[0]?.id || '');
  const [newScorerTeam, setNewScorerTeam] = useState<'A' | 'B'>('A');
  const [newScorerGoals, setNewScorerGoals] = useState(1);

  if (!isOpen) return null;

  const handleAddScorer = () => {
    const player = players.find((p) => p.id === newScorerPlayerId);
    if (!player) return;

    setScorers((prev) => [
      ...prev,
      {
        playerId: player.id,
        name: player.name,
        goals: newScorerGoals,
        avatar: player.avatar,
        team: newScorerTeam,
      },
    ]);
  };

  const handleRemoveScorer = (index: number) => {
    setScorers((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const updatedMatch: Match = {
      ...match,
      status,
      teamA: {
        ...match.teamA,
        score: status === 'finished' ? teamAScore : undefined,
      },
      teamB: {
        ...match.teamB,
        score: status === 'finished' ? teamBScore : undefined,
      },
      mvpName,
      scorers,
    };

    onSaveMatch(updatedMatch);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-lg rounded-[28px] p-6 md:p-8 card-shadow border border-[#EBE7DF] relative max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute right-5 top-5 text-[#8D8D7E] hover:text-[#5A5A40] p-1.5 rounded-full hover:bg-[#F1EFE7] transition-colors"
        >
          <span className="material-symbols-outlined">close</span>
        </button>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <div className="flex items-center gap-2 text-[#7B8B6F] mb-1">
              <span className="material-symbols-outlined text-[20px]">edit_document</span>
              <span className="font-mono text-xs font-bold uppercase tracking-wider">
                Panel de Administración
              </span>
            </div>
            <h2 className="font-serif text-2xl font-bold text-[#5A5A40]">
              Editar Resultado / Stats
            </h2>
            <p className="font-body text-[#8D8D7E] text-xs mt-1">
              Jornada {match.jornada} • {match.teamA.name} vs {match.teamB.name}
            </p>
          </div>

          {/* Estado del Partido */}
          <div>
            <label className="block font-mono text-xs font-bold text-[#5A5A40] mb-2 uppercase">
              Estado:
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setStatus('upcoming')}
                className={`py-2 px-4 rounded-xl text-xs font-mono font-bold border transition-all ${
                  status === 'upcoming'
                    ? 'bg-[#5A5A40] text-white border-[#5A5A40]'
                    : 'bg-[#F1EFE7] text-[#8D8D7E] border-[#EBE7DF] hover:bg-[#EBE7DF] hover:text-[#5A5A40]'
                }`}
              >
                Próximo / En Espera
              </button>
              <button
                type="button"
                onClick={() => setStatus('finished')}
                className={`py-2 px-4 rounded-xl text-xs font-mono font-bold border transition-all ${
                  status === 'finished'
                    ? 'bg-[#5A5A40] text-white border-[#5A5A40]'
                    : 'bg-[#F1EFE7] text-[#8D8D7E] border-[#EBE7DF] hover:bg-[#EBE7DF] hover:text-[#5A5A40]'
                }`}
              >
                Finalizado
              </button>
            </div>
          </div>

          {/* Marcador */}
          <div className="grid grid-cols-2 gap-4 bg-[#F9F7F2]/60 p-4 rounded-2xl border border-[#EBE7DF]">
            <div>
              <label className="block font-serif text-xs font-bold text-[#5A5A40] mb-1 truncate">
                {match.teamA.name}
              </label>
              <input
                type="number"
                min="0"
                max="99"
                value={teamAScore}
                onChange={(e) => setTeamAScore(Number(e.target.value))}
                className="w-full bg-white text-xl font-serif font-bold text-center text-[#5A5A40] p-2.5 rounded-xl border border-[#EBE7DF] focus:ring-2 focus:ring-[#7B8B6F]"
              />
            </div>
            <div>
              <label className="block font-serif text-xs font-bold text-[#5A5A40] mb-1 truncate">
                {match.teamB.name}
              </label>
              <input
                type="number"
                min="0"
                max="99"
                value={teamBScore}
                onChange={(e) => setTeamBScore(Number(e.target.value))}
                className="w-full bg-white text-xl font-serif font-bold text-center text-[#5A5A40] p-2.5 rounded-xl border border-[#EBE7DF] focus:ring-2 focus:ring-[#7B8B6F]"
              />
            </div>
          </div>

          {/* MVP Selection */}
          <div>
            <label className="block font-mono text-xs font-bold text-[#5A5A40] mb-1.5 uppercase">
              Jugador del Partido (MVP):
            </label>
            <select
              value={mvpName}
              onChange={(e) => setMvpName(e.target.value)}
              className="w-full bg-[#F1EFE7] text-sm font-semibold text-[#4A4A3F] p-3 rounded-xl border border-[#EBE7DF] focus:ring-2 focus:ring-[#7B8B6F]"
            >
              {players.map((p) => (
                <option key={p.id} value={p.name}>
                  {p.name}
                </option>
              ))}
            </select>
          </div>

          {/* Goleadores List & Add */}
          <div className="space-y-3">
            <label className="block font-mono text-xs font-bold text-[#5A5A40] uppercase">
              Goleadores del Encuentro ({scorers.length}):
            </label>

            <div className="space-y-2 max-h-32 overflow-y-auto">
              {scorers.map((s, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between p-2.5 bg-[#F1EFE7] rounded-xl text-xs font-semibold text-[#4A4A3F] border border-[#EBE7DF]"
                >
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-[16px] text-[#7B8B6F]">
                      sports_soccer
                    </span>
                    <span>{s.name} (Equipo {s.team})</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="font-serif font-bold text-[#5A5A40]">{s.goals} goles</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveScorer(idx)}
                      className="text-[#9A4A4A] hover:opacity-70"
                    >
                      <span className="material-symbols-outlined text-[16px]">delete</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Quick add scorer */}
            <div className="flex flex-col sm:flex-row gap-2 pt-2">
              <select
                value={newScorerPlayerId}
                onChange={(e) => setNewScorerPlayerId(e.target.value)}
                className="flex-grow bg-[#F1EFE7] text-xs font-semibold text-[#4A4A3F] p-2 rounded-xl border border-[#EBE7DF]"
              >
                {players.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name}
                  </option>
                ))}
              </select>

              <select
                value={newScorerTeam}
                onChange={(e) => setNewScorerTeam(e.target.value as any)}
                className="bg-[#F1EFE7] text-xs font-mono font-bold text-[#4A4A3F] p-2 rounded-xl border border-[#EBE7DF]"
              >
                <option value="A">Equipo A</option>
                <option value="B">Equipo B</option>
              </select>

              <input
                type="number"
                min="1"
                max="10"
                value={newScorerGoals}
                onChange={(e) => setNewScorerGoals(Number(e.target.value))}
                className="w-16 bg-[#F1EFE7] text-xs font-bold text-center text-[#4A4A3F] p-2 rounded-xl border border-[#EBE7DF]"
              />

              <button
                type="button"
                onClick={handleAddScorer}
                className="px-3.5 py-2 bg-[#5A5A40] text-white text-xs font-mono font-bold rounded-xl hover:opacity-90 shrink-0 shadow-xs"
              >
                + Añadir
              </button>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-3 pt-3">
            <button
              type="button"
              onClick={onClose}
              className="w-1/3 py-3 rounded-xl font-mono text-xs font-bold text-[#8D8D7E] hover:bg-[#F1EFE7] hover:text-[#5A5A40] transition-colors border border-[#EBE7DF]"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="w-2/3 py-3 rounded-xl font-mono text-xs font-bold bg-[#5A5A40] hover:opacity-90 text-white transition-all shadow-xs flex items-center justify-center gap-2"
            >
              <span className="material-symbols-outlined text-[18px]">save</span>
              <span>Guardar Cambios</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
