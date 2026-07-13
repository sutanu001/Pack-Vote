'use client';

import { useEffect, useState } from 'react';
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
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setMounted(true); }, []);

  // Load trip data when navigating to trip-detail
  useEffect(() => {
    if (nav.currentScreen === 'trip-detail' && nav.tripId) {
      setCurrentTrip(nav.tripId);
    }
  }, [nav.currentScreen, nav.tripId, setCurrentTrip]);

  // When navigating to voting, ensure trip is loaded
  useEffect(() => {
    if ((nav.currentScreen === 'voting' || nav.currentScreen === 'survey' || nav.currentScreen === 'chat') && nav.tripId) {
      setCurrentTrip(nav.tripId);
    }
  }, [nav.currentScreen, nav.tripId, setCurrentTrip]);

  const ScreenComponent = SCREEN_MAP[nav.currentScreen];
  const showBottomNav = !['trip-detail', 'results', 'survey', 'chat', 'itinerary', 'voting'].includes(nav.currentScreen);

  return (
    <main className="relative min-h-dvh overflow-hidden">
      <AnimatePresence mode="wait">
        <motion.div
          key={nav.currentScreen}
          initial={mounted ? { opacity: 0, x: 10 } : false}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -10 }}
          transition={{ duration: 0.2 }}
        >
          {ScreenComponent && <ScreenComponent />}
        </motion.div>
      </AnimatePresence>

      {/* Bottom Navigation */}
      {showBottomNav && (
        <motion.div
          initial={mounted ? { y: 80 } : false}
          animate={{ y: 0 }}
          exit={{ y: 80 }}
          transition={{ type: 'spring', bounce: 0.1, duration: 0.4 }}
        >
          <BottomNav />
        </motion.div>
      )}
    </main>
  );
}