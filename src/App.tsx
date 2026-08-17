import React, { useState } from 'react';
import { NavTab, Player } from './types';
import { toPlayer } from './api';
import { useAuth } from './auth/AuthContext';
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

  const sessionPlayer = player ? toPlayer(player) : null;
  const currentUserId = player ? player.id : 0;

  const [selectedPlayerId, setSelectedPlayerId] = useState<string>(
    player ? String(player.id) : '',
  );
  const [selectedMatchId, setSelectedMatchId] = useState<number | null>(null);
  const [isViewingSpecificMatch, setIsViewingSpecificMatch] = useState<boolean>(false);

  // Modals state
  const [isRateModalOpen, setIsRateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isNotificationsModalOpen, setIsNotificationsModalOpen] = useState(false);

  const currentUser: Player | null = sessionPlayer;

  if (!isAuthenticated || !currentUser) {
    return <LoginScreen />;
  }

  const handleSelectPlayer = (playerId: string) => {
    setSelectedPlayerId(playerId);
    setActiveTab('profile');
    setIsViewingSpecificMatch(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectMatch = (matchId: string) => {
    setSelectedMatchId(Number(matchId));
    setActiveTab('matches');
    setIsViewingSpecificMatch(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleTabChange = (tab: NavTab) => {
    setActiveTab(tab);
    if (tab === 'profile') {
      setSelectedPlayerId(String(currentUserId));
    }
    if (tab === 'matches') {
      setIsViewingSpecificMatch(false);
      setSelectedMatchId(null);
    } else {
      setIsViewingSpecificMatch(false);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleLogout = () => {
    logout();
  };

  const openRateModalForMatch = (matchId: string) => {
    setSelectedMatchId(Number(matchId));
    setIsRateModalOpen(true);
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
            currentPlayerId={currentUserId}
            onSelectMatch={handleSelectMatch}
            onOpenRatingForMatch={openRateModalForMatch}
            setActiveTab={handleTabChange}
          />
        )}

        {activeTab === 'rankings' && (
          <RankingsView
            onSelectPlayer={handleSelectPlayer}
            currentPlayerId={currentUserId}
          />
        )}

        {activeTab === 'profile' && (
          <ProfileView
            playerId={Number(selectedPlayerId) || currentUserId}
            currentPlayerId={currentUserId}
            onSelectPlayer={handleSelectPlayer}
          />
        )}

        {activeTab === 'matches' && (
          <>
            {isViewingSpecificMatch && selectedMatchId !== null ? (
              <div className="space-y-4">
                <button
                  onClick={() => {
                    setIsViewingSpecificMatch(false);
                    setSelectedMatchId(null);
                  }}
                  className="inline-flex items-center gap-2 text-xs font-mono font-bold text-[#5A5A40] hover:text-[#2D2D24] bg-white px-4 py-2 rounded-xl border border-[#EBE7DF] card-shadow transition-all"
                >
                  <span className="material-symbols-outlined text-[18px]">arrow_back</span>
                  <span>Volver a todos los partidos</span>
                </button>
                <MatchDetailView
                  matchId={selectedMatchId}
                  isAdmin={isAdmin}
                  onSelectMatch={handleSelectMatch}
                  onSelectPlayer={handleSelectPlayer}
                  onOpenEditModal={() => setIsEditModalOpen(true)}
                  onOpenRateModal={() => setIsRateModalOpen(true)}
                />
              </div>
            ) : (
              <MatchesListView onSelectMatch={handleSelectMatch} />
            )}
          </>
        )}

        {activeTab === 'players' && (
          <PlayersDirectoryView
            onSelectPlayer={handleSelectPlayer}
            currentPlayerId={currentUserId}
          />
        )}
      </main>

      {/* MODALS */}
      {selectedMatchId !== null && (
        <RateTeammatesModal
          isOpen={isRateModalOpen}
          onClose={() => setIsRateModalOpen(false)}
          matchId={selectedMatchId}
          currentPlayerId={currentUserId}
        />
      )}

      {selectedMatchId !== null && (
        <EditMatchModal
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          matchId={selectedMatchId}
        />
      )}

      <NotificationsModal
        isOpen={isNotificationsModalOpen}
        onClose={() => setIsNotificationsModalOpen(false)}
      />
    </div>
  );
}