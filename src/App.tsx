import React, { useState } from 'react';
import { NavTab, Player, Match, MatchPlayerRating } from './types';
import { toPlayer } from './api';
import { useAuth } from './auth/AuthContext';
import { PLAYERS, MATCHES } from './data/mockData';
import { Navigation } from './components/Navigation';
import { DashboardView } from './components/DashboardView';
import { RankingsView } from './components/RankingsView';
import { ProfileView } from './components/ProfileView';
import { MatchDetailView } from './components/MatchDetailView';
import { MatchesListView } from './components/MatchesListView';
import { PlayersDirectoryView } from './components/PlayersDirectoryView';
import { RateTeammatesModal } from './components/RateTeammatesModal';
import { EditMatchModal } from './components/EditMatchModal';
import { NotificationsModal } from './components/NotificationsModal';
import { LoginScreen } from './components/LoginScreen';

export default function App() {
  const { isAuthenticated, player, isAdmin, logout } = useAuth();
  const [activeTab, setActiveTab] = useState<NavTab>('rankings');
  const [players, setPlayers] = useState<Player[]>(PLAYERS);
  const [matches, setMatches] = useState<Match[]>(MATCHES);

  const sessionPlayer = player ? toPlayer(player) : null;
  const currentUserId = player ? String(player.id) : '';
  const [selectedPlayerId, setSelectedPlayerId] = useState<string>(currentUserId || '');
  const [selectedMatchId, setSelectedMatchId] = useState<string>('match-13-featured');
  const [isViewingSpecificMatch, setIsViewingSpecificMatch] = useState<boolean>(false);

  // Modals state
  const [isRateModalOpen, setIsRateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isNotificationsModalOpen, setIsNotificationsModalOpen] = useState(false);

  const currentUser: Player = sessionPlayer ?? players.find((p) => p.id === currentUserId) ?? players[0];
  const selectedPlayer = players.find((p) => p.id === selectedPlayerId) || currentUser;
  const currentMatch = matches.find((m) => m.id === selectedMatchId) || matches[0];

  if (!isAuthenticated) {
    return <LoginScreen />;
  }

  const handleSelectPlayer = (playerId: string) => {
    setSelectedPlayerId(playerId);
    setActiveTab('profile');
    setIsViewingSpecificMatch(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectMatch = (matchId: string) => {
    setSelectedMatchId(matchId);
    setActiveTab('matches');
    setIsViewingSpecificMatch(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleTabChange = (tab: NavTab) => {
    setActiveTab(tab);
    if (tab === 'profile') {
      setSelectedPlayerId(currentUserId);
    }
    if (tab === 'matches' && !isViewingSpecificMatch) {
      // Keep state or reset
    } else if (tab !== 'matches') {
      setIsViewingSpecificMatch(false);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleLogout = () => {
    logout();
  };

  // Callback to update official ratings
  const handleSubmitRating = (newRating: MatchPlayerRating) => {
    setMatches((prevMatches) =>
      prevMatches.map((m) => {
        if (m.id === selectedMatchId) {
          const existingIdx = m.officialRatings.findIndex((r) => r.playerId === newRating.playerId);
          let updatedRatings = [...m.officialRatings];
          if (existingIdx >= 0) {
            updatedRatings[existingIdx] = newRating;
          } else {
            updatedRatings.push(newRating);
          }
          return {
            ...m,
            officialRatings: updatedRatings,
          };
        }
        return m;
      })
    );

    // Also update player's rating if applicable
    setPlayers((prevPlayers) =>
      prevPlayers.map((p) => {
        if (p.id === newRating.playerId) {
          const newAvg = Number(((p.rating + newRating.global) / 2).toFixed(1));
          return {
            ...p,
            rating: newAvg,
            ovr: newAvg,
            recentFormRatings: [...p.recentFormRatings.slice(1), newRating.global],
          };
        }
        return p;
      })
    );
  };

  const handleSaveMatch = (updatedMatch: Match) => {
    setMatches((prevMatches) =>
      prevMatches.map((m) => (m.id === updatedMatch.id ? updatedMatch : m))
    );
  };

  return (
    <div className="bg-[#F9F7F2] text-[#4A4A3F] font-body min-h-screen flex flex-col md:flex-row antialiased selection:bg-[#7B8B6F] selection:text-white">
      {/* SIDEBAR & APP BARS */}
      <Navigation
        activeTab={activeTab}
        setActiveTab={handleTabChange}
        currentUser={currentUser}
        onLogout={handleLogout}
        onOpenNotifications={() => setIsNotificationsModalOpen(true)}
      />

      {/* MAIN VIEW CONTAINER */}
      <main className="flex-grow flex flex-col relative w-full overflow-x-hidden p-4 md:p-8 lg:p-10 pb-28 md:pb-12 max-w-7xl mx-auto">
        {activeTab === 'dashboard' && (
          <DashboardView
            currentUser={currentUser}
            matches={matches}
            onSelectMatch={handleSelectMatch}
            setActiveTab={handleTabChange}
          />
        )}

        {activeTab === 'rankings' && (
          <RankingsView
            players={players}
            onSelectPlayer={handleSelectPlayer}
          />
        )}

        {activeTab === 'profile' && (
          <ProfileView
            player={selectedPlayer}
            allPlayers={players}
            onSelectPlayer={setSelectedPlayerId}
            onSelectMatch={handleSelectMatch}
          />
        )}

        {activeTab === 'matches' && (
          <>
            {isViewingSpecificMatch ? (
              <div className="space-y-4">
                <button
                  onClick={() => setIsViewingSpecificMatch(false)}
                  className="inline-flex items-center gap-2 text-xs font-mono font-bold text-[#5A5A40] hover:text-[#2D2D24] bg-white px-4 py-2 rounded-xl border border-[#EBE7DF] card-shadow transition-all"
                >
                  <span className="material-symbols-outlined text-[18px]">arrow_back</span>
                  <span>Volver a todos los partidos</span>
                </button>
                <MatchDetailView
                  match={currentMatch}
                  allMatches={matches}
                  isAdmin={isAdmin}
                  onSelectMatch={setSelectedMatchId}
                  onSelectPlayer={handleSelectPlayer}
                  onOpenEditModal={() => setIsEditModalOpen(true)}
                  onOpenRateModal={() => setIsRateModalOpen(true)}
                />
              </div>
            ) : (
              <MatchesListView
                matches={matches}
                onSelectMatch={handleSelectMatch}
              />
            )}
          </>
        )}

        {activeTab === 'players' && (
          <PlayersDirectoryView
            players={players}
            onSelectPlayer={handleSelectPlayer}
          />
        )}
      </main>

      {/* MODALS */}
      <RateTeammatesModal
        isOpen={isRateModalOpen}
        onClose={() => setIsRateModalOpen(false)}
        match={currentMatch}
        players={players}
        onSubmitRating={handleSubmitRating}
      />

      <EditMatchModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        match={currentMatch}
        players={players}
        onSaveMatch={handleSaveMatch}
      />

      <NotificationsModal
        isOpen={isNotificationsModalOpen}
        onClose={() => setIsNotificationsModalOpen(false)}
      />
    </div>
  );
}