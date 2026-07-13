'use client';

import { motion } from 'framer-motion';
import { Home, Compass, Plus, CheckSquare2, User } from 'lucide-react';
import { useAppStore } from '@/lib/store';
import type { Screen } from '@/lib/types';
import { cn } from '@/lib/utils';

interface NavItem {
  screen: Screen;
  label: string;
  icon: React.ElementType;
}

const NAV_ITEMS: NavItem[] = [
  { screen: 'home', label: 'Home', icon: Home },
  { screen: 'explore', label: 'Explore', icon: Compass },
  { screen: 'create-trip', label: 'Create', icon: Plus },
  { screen: 'voting', label: 'Vote', icon: CheckSquare2 },
  { screen: 'profile', label: 'Profile', icon: User },
];

const HIDDEN_SCREENS: Screen[] = ['trip-detail', 'results', 'survey', 'chat', 'itinerary', 'create-trip'];

export function BottomNav() {
  const { nav, navigate, trips } = useAppStore();
  const showNav = !HIDDEN_SCREENS.includes(nav.currentScreen) || nav.currentScreen === 'create-trip';
  const hasVotingTrip = trips.some((t) => t.status === 'voting');

  if (!showNav) return null;

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 safe-bottom">
      <div className="mx-auto max-w-md">
        <div className="glass-card border-t border-purple-100/50 px-2 pt-2 pb-1">
          <div className="flex items-center justify-around">
            {NAV_ITEMS.map((item) => {
              const isActive = nav.currentScreen === item.screen;
              const isCreate = item.screen === 'create-trip';
              const isDisabled = item.screen === 'voting' && !hasVotingTrip;
              const Icon = item.icon;

              if (isCreate) {
                return (
                  <motion.button
                    key={item.screen}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => navigate(item.screen)}
                    className="relative -mt-6 flex flex-col items-center"
                    aria-label={item.label}
                  >
                    <div className="w-14 h-14 rounded-full gradient-purple shadow-lg shadow-purple-500/40 flex items-center justify-center">
                      <Plus className="w-7 h-7 text-white" />
                    </div>
                  </motion.button>
                );
              }

              return (
                <button
                  key={item.screen}
                  onClick={() => !isDisabled && navigate(item.screen)}
                  className={cn(
                    'flex flex-col items-center gap-0.5 py-1.5 px-3 relative transition-colors',
                    isDisabled && 'opacity-30 cursor-not-allowed'
                  )}
                  aria-label={item.label}
                >
                  <Icon
                    className={cn(
                      'w-5 h-5 transition-colors',
                      isActive ? 'text-purple-700' : 'text-gray-400'
                    )}
                  />
                  <span
                    className={cn(
                      'text-[10px] font-medium transition-colors',
                      isActive ? 'text-purple-700' : 'text-gray-400'
                    )}
                  >
                    {item.label}
                  </span>
                  {isActive && (
                    <motion.div
                      layoutId="nav-indicator"
                      className="absolute -bottom-1.5 w-1 h-1 rounded-full bg-purple-700"
                      transition={{ type: 'spring', bounce: 0.2, duration: 0.4 }}
                    />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </nav>
  );
}