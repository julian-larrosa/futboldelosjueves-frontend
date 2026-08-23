import React, { useCallback, useMemo, useState } from 'react';
import { ApiError, attendanceApi, hinchasApi } from '../api';
import type { HinchaResponse } from '../api';
import { useApi } from '../hooks/useApi';
import { LoadingState, ErrorState, EmptyState } from './StateViews';
import { getInitials } from '../utils/format';

interface MatchAttendanceAdminCardProps {
  matchId: number;
  onRefresh?: () => void;
}

export const MatchAttendanceAdminCard: React.FC<MatchAttendanceAdminCardProps> = ({
  matchId,
  onRefresh,
}) => {
  const [selectedHinchaId, setSelectedHinchaId] = useState('');
  const [actionLoading, setActionLoading] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);

  const attendanceFetcher = useCallback(() => attendanceApi.getMatchAttendance(matchId), [matchId]);
  const attendanceQuery = useApi(attendanceFetcher);

  const hinchasFetcher = useCallback(() => hinchasApi.list({ size: 100 }), []);
  const hinchasQuery = useApi(hinchasFetcher);

  const attendees = attendanceQuery.data ?? [];

  const availableHinchas = useMemo(() => {
    const all: HinchaResponse[] = hinchasQuery.data?.content ?? [];
    const attendeeIds = new Set(attendees.map((a) => a.hinchaId));
    return all.filter((h) => !attendeeIds.has(h.id));
  }, [hinchasQuery.data, attendees]);

  const handleRegister = useCallback(async () => {
    if (!selectedHinchaId || actionLoading) return;
    setActionError(null);
    setActionLoading(true);
    try {
      await attendanceApi.registerAttendance(matchId, { hinchaIds: [Number(selectedHinchaId)] });
      setSelectedHinchaId('');
      attendanceQuery.refetch();
      onRefresh?.();
    } catch (err) {
      setActionError(
        err instanceof ApiError ? err.message : 'No se pudo registrar la asistencia.',
      );
    } finally {
      setActionLoading(false);
    }
  }, [matchId, selectedHinchaId, actionLoading, attendanceQuery, onRefresh]);

  const handleRemove = useCallback(
    async (hinchaId: number) => {
      setActionError(null);
      try {
        await attendanceApi.removeAttendance(matchId, hinchaId);
        attendanceQuery.refetch();
        onRefresh?.();
      } catch (err) {
        setActionError(
          err instanceof ApiError ? err.message : 'No se pudo quitar la asistencia.',
        );
      }
    },
    [matchId, attendanceQuery, onRefresh],
  );

  return (
    <div className="bg-white rounded-[28px] p-6 card-shadow border border-[#EBE7DF]">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-5">
        <h3 className="font-serif text-base md:text-lg font-bold text-[#5A5A40] flex items-center gap-2">
          <span className="material-symbols-outlined text-[#7B8B6F]">stadium</span>
          <span>Asistencia de Hinchas</span>
          <span className="font-mono text-xs text-[#8D8D7E] font-normal">
            ({attendees.length} presentes)
          </span>
        </h3>
      </div>

      {attendanceQuery.loading ? (
        <LoadingState label="Cargando asistencia..." />
      ) : attendanceQuery.error ? (
        <ErrorState message={attendanceQuery.error} onRetry={attendanceQuery.refetch} />
      ) : (
        <>
          {/* Registro */}
          <div className="flex flex-col sm:flex-row gap-2 mb-4 p-4 rounded-2xl bg-[#F1EFE7] border border-[#EBE7DF]">
            <select
              value={selectedHinchaId}
              onChange={(e) => setSelectedHinchaId(e.target.value)}
              disabled={hinchasQuery.loading}
              className="grow w-full sm:w-auto bg-white border border-[#EBE7DF] rounded-xl px-4 py-2.5 text-sm font-body text-[#4A4A3F] focus:outline-none focus:ring-2 focus:ring-[#7B8B6F] transition-shadow"
            >
              <option value="">
                {hinchasQuery.loading
                  ? 'Cargando hinchas…'
                  : availableHinchas.length > 0
                    ? 'Seleccionar hincha…'
                    : 'Todos los hinchas ya registrados'}
              </option>
              {availableHinchas.map((h) => (
                <option key={h.id} value={h.id}>
                  {h.apellido}, {h.nombre} (@{h.username})
                </option>
              ))}
            </select>
            <button
              type="button"
              onClick={handleRegister}
              disabled={!selectedHinchaId || actionLoading}
              className="bg-[#7B8B6F] text-white px-5 py-2.5 rounded-xl font-mono text-xs font-bold hover:opacity-90 transition-all flex items-center justify-center gap-2 shadow-xs active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed shrink-0"
            >
              {actionLoading ? (
                <>
                  <span className="w-3.5 h-3.5 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                  <span>Registrando…</span>
                </>
              ) : (
                <>
                  <span className="material-symbols-outlined text-[16px]">how_to_reg</span>
                  <span>Registrar asistencia</span>
                </>
              )}
            </button>
          </div>

          {actionError && (
            <div className="mb-4 bg-[#FFEBE5] border border-[#D97B66]/30 text-[#C2623F] rounded-xl px-4 py-3 text-xs font-mono font-bold flex items-start gap-2">
              <span className="material-symbols-outlined text-[16px] shrink-0">error</span>
              <span>{actionError}</span>
            </div>
          )}

          {/* Lista de asistentes */}
          {attendees.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {attendees.map((a) => (
                <div
                  key={a.id}
                  className="flex items-center justify-between p-3 rounded-2xl border border-[#EBE7DF] bg-[#F9F7F2]/60"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-9 h-9 rounded-full bg-[#EBE7DF] flex items-center justify-center font-mono text-xs font-bold text-[#5A5A40] shrink-0">
                      {getInitials(a.hinchaNombre)}
                    </div>
                    <span className="font-body text-sm font-semibold text-[#4A4A3F] truncate">
                      {a.hinchaNombre}
                    </span>
                  </div>
                  <button
                    onClick={() => handleRemove(a.hinchaId)}
                    className="text-[#C2623F] hover:text-[#A04E2E] p-1.5 rounded-full hover:bg-[#FFEBE5] transition-colors shrink-0"
                    title="Quitar asistencia"
                  >
                    <span className="material-symbols-outlined text-[18px]">person_remove</span>
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <EmptyState message="Ningún hincha registrado para este partido todavía." />
          )}
        </>
      )}
    </div>
  );
};
