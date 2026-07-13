'use client';

import { useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useAppStore } from '@/lib/store';
import { BottomNav } from '@/components/packvote/BottomNav';
import { HomeScreen } from '@/components/packvote/screens/HomeScreen';
import { ExploreScreen } from '@/components/packvote/screens/ExploreScreen';
import CreateTripScreen from '@/components/packvote/screens/CreateTripScreen';
import { TripDetailScreen } from '@/components/packvote/screens/TripDetailScreen';
import { VotingScreen } from '@/components/packvote/screens/VotingScreen';
import { ResultsScreen } from '@/components/packvote/screens/ResultsScreen';
import { SurveyScreen } from '@/components/packvote/screens/SurveyScreen';
import { ChatScreen } from '@/components/packvote/screens/ChatScreen';
import { ProfileScreen } from '@/components/packvote/screens/ProfileScreen';
import type { Screen } from '@/lib/types';

const SCREEN_MAP: Record<Screen, React.ComponentType> = {
  home: HomeScreen,
  explore: ExploreScreen,
  'create-trip': CreateTripScreen,
  'trip-detail': TripDetailScreen,
  voting: VotingScreen,
  results: ResultsScreen,
  survey: SurveyScreen,
  chat: ChatScreen,
  profile: ProfileScreen,
  itinerary: TripDetailScreen,
};

export default function Page() {
  const { nav, setCurrentTrip } = useAppStore();

  useEffect(() => {
    if (['trip-detail', 'voting', 'survey', 'chat'].includes(nav.currentScreen) && nav.tripId) {
      setCurrentTrip(nav.tripId);
    }
  }, [nav.currentScreen, nav.tripId, setCurrentTrip]);

  const ScreenComponent = SCREEN_MAP[nav.currentScreen];
  const showBottomNav = !['trip-detail', 'results', 'survey', 'chat', 'itinerary', 'voting', 'create-trip'].includes(nav.currentScreen);

  return (
    <main className="relative min-h-dvh overflow-hidden">
      <AnimatePresence mode="wait">
        <motion.div
          key={nav.currentScreen}
          initial={false}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, x: -10 }}
          transition={{ duration: 0.15 }}
        >
          {ScreenComponent && <ScreenComponent />}
        </motion.div>
      </AnimatePresence>

      {showBottomNav && (
        <BottomNav />
      )}
    </main>
  );
}