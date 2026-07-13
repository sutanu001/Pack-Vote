'use client';

import { motion } from 'framer-motion';
import { Bell, Plus, Users, Vote, CalendarCheck, MapPin, ChevronRight } from 'lucide-react';
import { useAppStore } from '@/lib/store';
import { GlassCard } from '@/components/packvote/shared/GlassCard';
import { ProgressRing } from '@/components/packvote/shared/ProgressRing';
import { cn } from '@/lib/utils';
import type { TripStatus } from '@/lib/types';

const STATUS_CONFIG: Record<TripStatus, { label: string; color: string; bg: string; progress: number }> = {
  planning: { label: 'Planning', color: 'text-purple-700', bg: 'bg-purple-100', progress: 20 },
  surveying: { label: 'Surveying', color: 'text-sky-600', bg: 'bg-sky-100', progress: 45 },
  voting: { label: 'Voting', color: 'text-amber-600', bg: 'bg-amber-100', progress: 65 },
  confirmed: { label: 'Confirmed', color: 'text-emerald-600', bg: 'bg-emerald-100', progress: 90 },
  completed: { label: 'Completed', color: 'text-gray-500', bg: 'bg-gray-100', progress: 100 },
};

export function HomeScreen() {
  const { currentUser, trips, navigate, notificationCount } = useAppStore();

  const activeTrips = trips.filter((t) => t.status !== 'completed').length;
  const pendingVotes = trips.filter((t) => t.status === 'voting').length;

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return '';
    return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  return (
    <div className="screen-container animate-slide-up px-4 pt-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <p className="text-sm text-muted-foreground">{getGreeting()},</p>
          <h1 className="text-2xl font-bold text-gradient">{currentUser.name.split(' ')[0]}</h1>
        </div>
        <button
          className="relative p-2.5 rounded-full glass-card"
          aria-label="Notifications"
        >
          <Bell className="w-5 h-5 text-purple-700" />
          {notificationCount > 0 && (
            <motion.span
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-rose-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center"
            >
              {notificationCount}
            </motion.span>
          )}
        </button>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        <GlassCard variant="purple" className="text-center p-3">
          <p className="text-2xl font-bold text-purple-700">{activeTrips}</p>
          <p className="text-[11px] text-muted-foreground mt-0.5">Active Trips</p>
        </GlassCard>
        <GlassCard variant="purple" className="text-center p-3">
          <p className="text-2xl font-bold text-amber-500">{pendingVotes}</p>
          <p className="text-[11px] text-muted-foreground mt-0.5">Pending Votes</p>
        </GlassCard>
        <GlassCard variant="purple" className="text-center p-3">
          <p className="text-2xl font-bold text-emerald-500">{trips.length}</p>
          <p className="text-[11px] text-muted-foreground mt-0.5">Trips Planned</p>
        </GlassCard>
      </div>

      {/* Your Trips Section */}
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-lg font-semibold text-foreground">Your Trips</h2>
        <button className="text-sm text-purple-700 font-medium">See all</button>
      </div>

      {/* Trip Cards - Horizontal Scroll */}
      <div className="flex gap-3 overflow-x-auto no-scrollbar -mx-4 px-4 pb-4">
        {trips.map((trip, index) => {
          const statusCfg = STATUS_CONFIG[trip.status];
          const surveyProgress = trip.totalMembers > 0
            ? (trip.surveyCompleted / trip.totalMembers) * 100
            : 0;

          return (
            <motion.div
              key={trip.id}
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1, duration: 0.4 }}
              className="min-w-[280px] shrink-0"
            >
              <button
                onClick={() => navigate('trip-detail', { tripId: trip.id })}
                className="w-full text-left rounded-2xl overflow-hidden glass-card-purple border border-purple-100/50 active:scale-[0.98] transition-transform"
              >
                {/* Cover Image */}
                <div className="relative h-32 w-full bg-gradient-to-br from-purple-200 to-sky-100 overflow-hidden">
                  {trip.coverImage && (
                    <img
                      src={trip.coverImage}
                      alt={trip.name}
                      className="w-full h-full object-cover"
                    />
                  )}
                  <div className="absolute top-2.5 left-2.5">
                    <span
                      className={cn(
                        'inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-semibold',
                        statusCfg.bg,
                        statusCfg.color
                      )}
                    >
                      {statusCfg.label}
                    </span>
                  </div>
                  <div className="absolute top-2.5 right-2.5">
                    <ProgressRing
                      progress={surveyProgress}
                      size={36}
                      strokeWidth={3}
                      color={statusCfg.progress > 60 ? '#10b981' : '#7c3aed'}
                    />
                  </div>
                </div>

                {/* Trip Info */}
                <div className="p-3.5">
                  <h3 className="font-semibold text-sm text-foreground truncate">{trip.name}</h3>
                  {trip.description && (
                    <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1">{trip.description}</p>
                  )}

                  <div className="flex items-center gap-3 mt-2.5 text-xs text-muted-foreground">
                    <span className="inline-flex items-center gap-1">
                      <Users className="w-3.5 h-3.5" />
                      {trip.memberCount}
                    </span>
                    {(trip.startDate || trip.endDate) && (
                      <span className="inline-flex items-center gap-1">
                        <CalendarCheck className="w-3.5 h-3.5" />
                        {formatDate(trip.startDate)} – {formatDate(trip.endDate)}
                      </span>
                    )}
                  </div>

                  {trip.budget && (
                    <div className="flex items-center gap-1 mt-1.5 text-xs text-purple-600 font-medium">
                      <MapPin className="w-3.5 h-3.5" />
                      {trip.budget}
                    </div>
                  )}
                </div>
              </button>
            </motion.div>
          );
        })}
      </div>

      {/* Quick Actions */}
      {trips.filter((t) => t.status === 'voting').length > 0 && (
        <GlassCard variant="gradient" className="mt-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-full gradient-purple flex items-center justify-center shrink-0">
            <Vote className="w-5 h-5 text-white" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-foreground">Vote on your trips!</p>
            <p className="text-xs text-muted-foreground">Help your group decide the destination</p>
          </div>
          <ChevronRight className="w-4 h-4 text-purple-400 shrink-0" />
        </GlassCard>
      )}

      {/* FAB */}
      <motion.button
        onClick={() => navigate('create-trip')}
        whileTap={{ scale: 0.9 }}
        className="fixed bottom-24 right-4 w-14 h-14 rounded-full gradient-purple shadow-lg shadow-purple-500/30 flex items-center justify-center z-30 max-w-md"
        aria-label="Create new trip"
      >
        <Plus className="w-6 h-6 text-white" />
      </motion.button>
    </div>
  );
}