'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Bell,
  Users,
  Vote,
  CalendarCheck,
  MapPin,
  ChevronRight,
  Plus,
  ClipboardList,
  MessageSquare,
  CheckCircle2,
  Sparkles,
  UserPlus,
  Clock,
  Sun,
  Moon,
  Sunrise,
} from 'lucide-react';
import { useAppStore } from '@/lib/store';
import { cn } from '@/lib/utils';
import { GlassCard } from '@/components/packvote/shared/GlassCard';
import { ProgressRing } from '@/components/packvote/shared/ProgressRing';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Progress } from '@/components/ui/progress';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from '@/components/ui/sheet';
import { toast } from 'sonner';
import type { TripStatus } from '@/lib/types';

const STATUS_CONFIG: Record<TripStatus, { label: string; color: string; bg: string; progress: number }> = {
  planning: { label: 'Planning', color: 'text-purple-700', bg: 'bg-purple-100', progress: 20 },
  surveying: { label: 'Surveying', color: 'text-sky-600', bg: 'bg-sky-100', progress: 45 },
  voting: { label: 'Voting', color: 'text-amber-600', bg: 'bg-amber-100', progress: 65 },
  confirmed: { label: 'Confirmed', color: 'text-emerald-600', bg: 'bg-emerald-100', progress: 90 },
  completed: { label: 'Completed', color: 'text-gray-500', bg: 'bg-gray-100', progress: 100 },
};

const AVATAR_COLORS = [
  'bg-purple-500',
  'bg-rose-400',
  'bg-amber-400',
  'bg-emerald-500',
  'bg-sky-400',
  'bg-fuchsia-500',
  'bg-teal-400',
  'bg-orange-400',
];

const MOCK_NOTIFICATIONS = [
  {
    id: 'n1',
    icon: CheckCircle2,
    iconColor: 'text-emerald-500',
    iconBg: 'bg-emerald-100',
    title: 'Sarah completed the survey',
    subtitle: 'Summer Beach Getaway',
    time: '2m ago',
  },
  {
    id: 'n2',
    icon: Vote,
    iconColor: 'text-amber-500',
    iconBg: 'bg-amber-100',
    title: 'Mike voted on destinations',
    subtitle: 'Bali, Indonesia ranked #1',
    time: '15m ago',
  },
  {
    id: 'n3',
    icon: Sparkles,
    iconColor: 'text-purple-500',
    iconBg: 'bg-purple-100',
    title: 'New AI suggestions ready',
    subtitle: '3 destinations matched for your group',
    time: '1h ago',
  },
  {
    id: 'n4',
    icon: UserPlus,
    iconColor: 'text-sky-500',
    iconBg: 'bg-sky-100',
    title: 'Emma joined Mountain Retreat',
    subtitle: 'Your trip now has 3 members',
    time: '3h ago',
  },
];

const MOCK_ACTIVITY = [
  {
    id: 'a1',
    userName: 'Sarah Kim',
    action: 'completed the survey for',
    target: 'Summer Beach Getaway',
    time: '2m ago',
    type: 'survey' as const,
  },
  {
    id: 'a2',
    userName: 'Mike Johnson',
    action: 'voted on destinations in',
    target: 'Summer Beach Getaway',
    time: '15m ago',
    type: 'vote' as const,
  },
  {
    id: 'a3',
    userName: 'Emma Wilson',
    action: 'joined the trip',
    target: 'Mountain Retreat',
    time: '3h ago',
    type: 'join' as const,
  },
  {
    id: 'a4',
    userName: 'David Lee',
    action: 'completed the survey for',
    target: 'Summer Beach Getaway',
    time: '5h ago',
    type: 'survey' as const,
  },
  {
    id: 'a5',
    userName: 'Lisa Wang',
    action: 'was invited to',
    target: 'Japan Adventure',
    time: '1d ago',
    type: 'join' as const,
  },
];

function getInitials(name: string) {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

function getAvatarColor(index: number) {
  return AVATAR_COLORS[index % AVATAR_COLORS.length];
}

const staggerContainer = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.08, delayChildren: 0.1 },
  },
};

const staggerItem = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.35, ease: 'easeOut' } },
};

function MemberAvatarStack({ memberCount }: { memberCount: number }) {
  const { members } = useAppStore();
  const displayMembers = members.slice(0, 3);
  const extraCount = Math.max(0, memberCount - 3);

  return (
    <div className="flex items-center">
      <div className="flex -space-x-2">
        {displayMembers.map((member, i) => (
          <div
            key={member.id}
            className={cn(
              'w-6 h-6 rounded-full flex items-center justify-center text-[9px] font-bold text-white border-2 border-white shadow-sm',
              getAvatarColor(i)
            )}
            title={member.userName}
          >
            {getInitials(member.userName)}
          </div>
        ))}
      </div>
      {extraCount > 0 && (
        <span className="ml-1.5 text-[10px] font-semibold text-purple-600 bg-purple-50 px-1.5 py-0.5 rounded-full">
          +{extraCount}
        </span>
      )}
    </div>
  );
}

function ActivityIcon({ type }: { type: 'survey' | 'vote' | 'join' }) {
  if (type === 'survey') {
    return (
      <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center shrink-0">
        <CheckCircle2 className="w-4 h-4 text-emerald-500" />
      </div>
    );
  }
  if (type === 'vote') {
    return (
      <div className="w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center shrink-0">
        <Vote className="w-4 h-4 text-amber-500" />
      </div>
    );
  }
  return (
    <div className="w-8 h-8 rounded-full bg-sky-100 flex items-center justify-center shrink-0">
      <UserPlus className="w-4 h-4 text-sky-500" />
    </div>
  );
}

export function HomeScreen() {
  const { currentUser, trips, navigate, notificationCount, members } = useAppStore();
  const [notifOpen, setNotifOpen] = useState(false);

  const activeTrips = trips.filter((t) => t.status !== 'completed').length;
  const pendingVotes = trips.filter((t) => t.status === 'voting').length;
  const firstVotingTrip = trips.find((t) => t.status === 'voting');
  const firstSurveyingTrip = trips.find((t) => t.status === 'surveying');

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 6) return { text: 'Good night', Emoji: Moon };
    if (hour < 12) return { text: 'Good morning', Emoji: Sunrise };
    if (hour < 17) return { text: 'Good afternoon', Emoji: Sun };
    return { text: 'Good evening', Emoji: Moon };
  };

  const { text: greetingText, Emoji: GreetingEmoji } = getGreeting();

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return '';
    return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const quickActions = [
    {
      label: 'Create Trip',
      icon: Plus,
      color: 'bg-purple-500 hover:bg-purple-600 active:bg-purple-700',
      onClick: () => navigate('create-trip'),
    },
    {
      label: 'Take Survey',
      icon: ClipboardList,
      color: 'bg-emerald-500 hover:bg-emerald-600 active:bg-emerald-700',
      onClick: () => {
        if (firstSurveyingTrip) {
          navigate('survey', { tripId: firstSurveyingTrip.id });
        } else {
          toast.info('No surveys available right now');
        }
      },
    },
    {
      label: 'Vote Now',
      icon: Vote,
      color: 'bg-amber-500 hover:bg-amber-600 active:bg-amber-700',
      badge: pendingVotes > 0 ? pendingVotes : undefined,
      onClick: () => {
        if (firstVotingTrip) {
          navigate('voting', { tripId: firstVotingTrip.id });
        } else {
          toast.info('No active votes right now');
        }
      },
    },
    {
      label: 'AI Chat',
      icon: MessageSquare,
      color: 'bg-sky-500 hover:bg-sky-600 active:bg-sky-700',
      onClick: () => {
        if (trips.length > 0) {
          navigate('chat', { tripId: trips[0].id });
        } else {
          toast.info('Create a trip first to start chatting');
        }
      },
    },
  ];

  return (
    <div className="screen-container animate-slide-up px-4 pt-6 pb-8">
      {/* Animated gradient mesh background behind header */}
      <div className="absolute top-0 left-0 right-0 h-52 -z-10 overflow-hidden">
        <div className="absolute -top-20 -left-20 w-64 h-64 bg-purple-200/40 rounded-full blur-3xl animate-pulse" />
        <div className="absolute top-4 right-0 w-48 h-48 bg-fuchsia-200/30 rounded-full blur-3xl animate-pulse [animation-delay:1s]" />
        <div className="absolute -top-10 left-1/2 w-56 h-56 bg-violet-200/25 rounded-full blur-3xl animate-pulse [animation-delay:2s]" />
      </div>

      {/* Header */}
      <motion.div
        className="flex items-center justify-between mb-6 relative"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <div>
          <p className="text-sm text-muted-foreground flex items-center gap-1.5">
            <GreetingEmoji className="w-4 h-4 text-amber-500" />
            {greetingText},
          </p>
          <h1 className="text-2xl font-bold text-gradient">{currentUser.name.split(' ')[0]}</h1>
        </div>
        <button
          onClick={() => setNotifOpen(true)}
          className="relative p-2.5 rounded-full glass-card hover:scale-105 active:scale-95 transition-transform duration-150"
          aria-label="Notifications"
        >
          <Bell className="w-5 h-5 text-purple-700" />
          {notificationCount > 0 && (
            <motion.span
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="absolute -top-0.5 -right-0.5 w-5 h-5 bg-rose-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center ring-2 ring-white"
            >
              {notificationCount}
            </motion.span>
          )}
        </button>
      </motion.div>

      {/* Notification Sheet */}
      <Sheet open={notifOpen} onOpenChange={setNotifOpen}>
        <SheetContent side="bottom" className="rounded-t-2xl max-h-[70vh]">
          <SheetHeader>
            <SheetTitle className="text-lg text-purple-900">Notifications</SheetTitle>
            <SheetDescription>Stay updated with your travel group</SheetDescription>
          </SheetHeader>
          <div className="px-4 pb-6 overflow-y-auto max-h-[55vh] no-scrollbar space-y-2">
            {MOCK_NOTIFICATIONS.map((notif, index) => {
              const IconComponent = notif.icon;
              return (
                <motion.div
                  key={notif.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.08, duration: 0.3 }}
                  className={cn(
                    'flex items-start gap-3 p-3 rounded-xl transition-colors duration-150',
                    'hover:bg-purple-50/80 active:bg-purple-100/80 cursor-pointer'
                  )}
                >
                  <div className={cn('w-9 h-9 rounded-full flex items-center justify-center shrink-0', notif.iconBg)}>
                    <IconComponent className={cn('w-4.5 h-4.5', notif.iconColor)} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground leading-tight">{notif.title}</p>
                    <p className="text-xs text-muted-foreground mt-0.5 truncate">{notif.subtitle}</p>
                  </div>
                  <div className="flex items-center gap-1 text-[11px] text-muted-foreground shrink-0">
                    <Clock className="w-3 h-3" />
                    {notif.time}
                  </div>
                </motion.div>
              );
            })}
            <Separator className="my-2" />
            <button
              className="w-full text-center text-sm text-purple-600 font-medium py-2 hover:text-purple-700 active:text-purple-800 transition-colors"
              onClick={() => {
                toast.info('All notifications marked as read');
                setNotifOpen(false);
              }}
            >
              Mark all as read
            </button>
          </div>
        </SheetContent>
      </Sheet>

      {/* Stats Row */}
      <motion.div
        className="grid grid-cols-3 gap-3 mb-6"
        variants={staggerContainer}
        initial="hidden"
        animate="show"
      >
        <motion.div variants={staggerItem}>
          <GlassCard variant="purple" className="text-center p-3 hover:scale-[1.03] active:scale-[0.97] transition-transform duration-150 cursor-default">
            <p className="text-2xl font-bold text-purple-700">{activeTrips}</p>
            <p className="text-[11px] text-muted-foreground mt-0.5">Active Trips</p>
          </GlassCard>
        </motion.div>
        <motion.div variants={staggerItem}>
          <GlassCard variant="purple" className="text-center p-3 hover:scale-[1.03] active:scale-[0.97] transition-transform duration-150 cursor-default">
            <p className="text-2xl font-bold text-amber-500">{pendingVotes}</p>
            <p className="text-[11px] text-muted-foreground mt-0.5">Pending Votes</p>
          </GlassCard>
        </motion.div>
        <motion.div variants={staggerItem}>
          <GlassCard variant="purple" className="text-center p-3 hover:scale-[1.03] active:scale-[0.97] transition-transform duration-150 cursor-default">
            <p className="text-2xl font-bold text-emerald-500">{trips.length}</p>
            <p className="text-[11px] text-muted-foreground mt-0.5">Trips Planned</p>
          </GlassCard>
        </motion.div>
      </motion.div>

      {/* Quick Actions Row */}
      <motion.div
        className="flex justify-between mb-6 px-2"
        variants={staggerContainer}
        initial="hidden"
        animate="show"
      >
        {quickActions.map((action) => {
          const IconComp = action.icon;
          return (
            <motion.button
              key={action.label}
              variants={staggerItem}
              onClick={action.onClick}
              className="flex flex-col items-center gap-1.5 group relative"
            >
              <div className={cn('w-14 h-14 rounded-full flex items-center justify-center shadow-lg transition-all duration-150 group-hover:shadow-xl group-active:scale-90', action.color)}>
                <IconComp className="w-6 h-6 text-white" />
                {action.badge && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-rose-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center ring-2 ring-white">
                    {action.badge}
                  </span>
                )}
              </div>
              <span className="text-[11px] font-medium text-muted-foreground group-hover:text-foreground transition-colors">
                {action.label}
              </span>
            </motion.button>
          );
        })}
      </motion.div>

      {/* Your Trips Section */}
      <motion.div
        className="flex items-center justify-between mb-3"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
      >
        <h2 className="text-lg font-semibold text-foreground">Your Trips</h2>
        <button className="text-sm text-purple-700 font-medium hover:text-purple-800 active:text-purple-900 transition-colors">
          See all
        </button>
      </motion.div>

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
              transition={{ delay: 0.4 + index * 0.1, duration: 0.4 }}
              className="min-w-[280px] shrink-0"
            >
              <button
                onClick={() => navigate('trip-detail', { tripId: trip.id })}
                className="w-full text-left rounded-2xl overflow-hidden glass-card-purple border border-purple-100/50 active:scale-[0.98] transition-transform duration-150 hover:shadow-lg"
              >
                {/* Cover Image with gradient overlay */}
                <div className="relative h-32 w-full bg-gradient-to-br from-purple-200 to-sky-100 overflow-hidden">
                  {trip.coverImage && (
                    <img
                      src={trip.coverImage}
                      alt={trip.name}
                      className="w-full h-full object-cover"
                    />
                  )}
                  {/* Gradient overlay for text readability */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-black/10" />

                  <div className="absolute top-2.5 left-2.5 z-10">
                    <span
                      className={cn(
                        'inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-semibold backdrop-blur-sm',
                        statusCfg.bg,
                        statusCfg.color
                      )}
                    >
                      {statusCfg.label}
                    </span>
                  </div>

                  {/* Tap to vote pill for voting-status cards */}
                  {trip.status === 'voting' && (
                    <div className="absolute top-2.5 left-1/2 -translate-x-1/2 z-10">
                      <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-[11px] font-semibold bg-white/90 text-amber-600 shadow-sm backdrop-blur-sm">
                        <Vote className="w-3 h-3" />
                        tap to vote
                      </span>
                    </div>
                  )}

                  <div className="absolute top-2.5 right-2.5 z-10">
                    <ProgressRing
                      progress={surveyProgress}
                      size={36}
                      strokeWidth={3}
                      color={statusCfg.progress > 60 ? '#10b981' : '#7c3aed'}
                    />
                  </div>

                  {/* Member Avatar Stack on cover image */}
                  <div className="absolute bottom-2.5 right-2.5 z-10">
                    <MemberAvatarStack memberCount={trip.memberCount} />
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

                  {/* Mini survey progress bar */}
                  <div className="mt-3 space-y-1">
                    <div className="flex items-center justify-between text-[10px]">
                      <span className="text-muted-foreground">Survey progress</span>
                      <span className="font-medium text-purple-600">
                        {trip.surveyCompleted}/{trip.totalMembers}
                      </span>
                    </div>
                    <Progress
                      value={surveyProgress}
                      className="h-1.5 bg-purple-100"
                    />
                  </div>
                </div>
              </button>
            </motion.div>
          );
        })}
      </div>

      {/* Recent Activity Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7, duration: 0.4 }}
      >
        <div className="flex items-center justify-between mb-3 mt-2">
          <h2 className="text-lg font-semibold text-foreground">Recent Activity</h2>
          <button className="text-sm text-purple-700 font-medium hover:text-purple-800 active:text-purple-900 transition-colors">
            View all
          </button>
        </div>

        <div className="space-y-0 relative">
          {/* Timeline line */}
          <div className="absolute left-[19px] top-3 bottom-3 w-px bg-purple-100" />

          {MOCK_ACTIVITY.map((activity, index) => {
            const memberIndex = members.findIndex((m) => m.userName === activity.userName);
            const colorIdx = memberIndex >= 0 ? memberIndex : index;

            return (
              <motion.div
                key={activity.id}
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.8 + index * 0.1, duration: 0.35 }}
                className="flex items-start gap-3 py-2.5 relative group cursor-default"
              >
                {/* Avatar + timeline dot */}
                <div className="relative z-10 shrink-0">
                  <div
                    className={cn(
                      'w-9 h-9 rounded-full flex items-center justify-center text-[10px] font-bold text-white ring-2 ring-white shadow-sm',
                      getAvatarColor(colorIdx)
                    )}
                  >
                    {getInitials(activity.userName)}
                  </div>
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0 pt-0.5">
                  <p className="text-sm text-foreground leading-snug">
                    <span className="font-semibold">{activity.userName}</span>{' '}
                    <span className="text-muted-foreground">{activity.action}</span>{' '}
                    <span className="font-medium text-purple-700">{activity.target}</span>
                  </p>
                  <p className="text-[11px] text-muted-foreground mt-0.5 flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {activity.time}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </motion.div>

      {/* Vote CTA for active voting trips */}
      {pendingVotes > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2, duration: 0.4 }}
          className="mt-6"
        >
          <GlassCard
            variant="gradient"
            className="flex items-center gap-3 hover:scale-[1.01] active:scale-[0.99] transition-transform duration-150 cursor-pointer"
            onClick={() => {
              if (firstVotingTrip) {
                navigate('voting', { tripId: firstVotingTrip.id });
              }
            }}
          >
            <div className="w-10 h-10 rounded-full gradient-purple flex items-center justify-center shrink-0">
              <Vote className="w-5 h-5 text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-foreground">
                Vote on your trips!
                <Badge className="ml-2 bg-amber-500 text-white border-0 text-[10px] px-1.5 py-0">
                  {pendingVotes}
                </Badge>
              </p>
              <p className="text-xs text-muted-foreground">Help your group decide the destination</p>
            </div>
            <ChevronRight className="w-4 h-4 text-purple-400 shrink-0" />
          </GlassCard>
        </motion.div>
      )}
    </div>
  );
}