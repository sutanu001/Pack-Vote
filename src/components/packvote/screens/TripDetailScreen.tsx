'use client';

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft, Share2, Users, Calendar, MapPin, DollarSign,
  Sparkles, CheckCircle2, Circle, Clock, ChevronRight,
  Utensils, Car, BedDouble, Camera, Send, MessageSquare,
  Plane, Mail, Plus
} from 'lucide-react';
import { useAppStore } from '@/lib/store';
import { GlassCard } from '@/components/packvote/shared/GlassCard';
import { ProgressRing } from '@/components/packvote/shared/ProgressRing';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import type { TripStatus, ItineraryItem } from '@/lib/types';

const STATUS_STEPS: { label: string; status: TripStatus }[] = [
  { label: 'Create Trip', status: 'planning' },
  { label: 'Preferences', status: 'surveying' },
  { label: 'AI Suggestions', status: 'surveying' },
  { label: 'Group Vote', status: 'voting' },
  { label: 'Confirm', status: 'confirmed' },
];

const STEP_INDEX: Record<TripStatus, number> = {
  planning: 0,
  surveying: 1,
  voting: 3,
  confirmed: 4,
  completed: 4,
};

const ITINERARY_ICONS: Record<ItineraryItem['category'], React.ElementType> = {
  activity: Camera,
  food: Utensils,
  transport: Car,
  accommodation: BedDouble,
};

export function TripDetailScreen() {
  const { nav, currentTrip, goBack, navigate, members, destinations, itinerary, toggleItineraryItem } = useAppStore();
  const [expandedDest, setExpandedDest] = useState<string | null>(null);
  const [selectedDay, setSelectedDay] = useState(1);

  const trip = currentTrip;
  const currentStep = trip ? (STEP_INDEX[trip.status] ?? 0) : 0;
  const days = useMemo(() => {
    const d = new Set(itinerary.map((i) => i.day));
    return Array.from(d).sort((a, b) => a - b);
  }, [itinerary]);

  const dayItems = itinerary.filter((i) => i.day === selectedDay);

  if (!trip) {
    return (
      <div className="screen-container flex items-center justify-center">
        <p className="text-muted-foreground">Trip not found</p>
      </div>
    );
  }

  const handleCopyCode = () => {
    navigator.clipboard?.writeText(trip.inviteCode);
    toast.success('Invite code copied!', {
      description: `Code: ${trip.inviteCode} — share with your group`,
    });
  };

  const formatDate = (d?: string) => {
    if (!d) return '';
    return new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  return (
    <div className="screen-container animate-slide-up pb-20">
      {/* Header */}
      <div className="flex items-center gap-3 px-4 pt-4 pb-2">
        <Button variant="ghost" size="icon" className="rounded-full h-10 w-10" onClick={goBack}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h1 className="text-lg font-bold flex-1 truncate">{trip.name}</h1>
        <Button variant="ghost" size="icon" className="rounded-full h-10 w-10" onClick={handleCopyCode}>
          <Share2 className="h-5 w-5 text-purple-600" />
        </Button>
      </div>

      <Tabs defaultValue="overview" className="w-full">
        <div className="px-4">
          <TabsList className="w-full bg-purple-100/50 rounded-xl h-10 p-1">
            {['Overview', 'Destinations', 'Members', 'Itinerary', 'Chat'].map((tab) => (
              <TabsTrigger
                key={tab}
                value={tab.toLowerCase()}
                className="flex-1 rounded-lg text-xs font-medium data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-purple-700"
              >
                {tab}
              </TabsTrigger>
            ))}
          </TabsList>
        </div>

        {/* OVERVIEW TAB */}
        <TabsContent value="overview" className="mt-4 px-4 space-y-4">
          {/* Cover Image */}
          <div className="relative h-44 rounded-2xl overflow-hidden">
            {trip.coverImage ? (
              <img src={trip.coverImage} alt={trip.name} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full gradient-purple-soft" />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
            <div className="absolute bottom-3 left-3.5 right-3.5">
              <h2 className="text-white font-bold text-lg">{trip.name}</h2>
              {trip.description && <p className="text-white/80 text-xs mt-0.5">{trip.description}</p>}
            </div>
            <div className="absolute top-3 left-3.5">
              <Badge className={cn(
                'text-[10px] font-semibold rounded-full',
                trip.status === 'voting' ? 'bg-amber-400 text-amber-900' :
                trip.status === 'surveying' ? 'bg-sky-400 text-sky-900' :
                trip.status === 'confirmed' ? 'bg-emerald-400 text-emerald-900' :
                'bg-purple-400 text-purple-900'
              )}>
                {trip.status.charAt(0).toUpperCase() + trip.status.slice(1)}
              </Badge>
            </div>
            <div className="absolute top-3 right-3.5">
              <Badge variant="secondary" className="text-[10px] rounded-full bg-white/90 backdrop-blur-sm text-foreground">
                Code: {trip.inviteCode}
              </Badge>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-3 gap-3">
            {[
              { icon: Users, value: trip.memberCount, label: 'Members' },
              { icon: Calendar, value: trip.startDate ? formatDate(trip.startDate) : 'TBD', label: 'Start' },
              { icon: DollarSign, value: trip.budget || 'TBD', label: 'Budget' },
            ].map((s) => (
              <GlassCard key={s.label} variant="purple" className="p-3 text-center">
                <s.icon className="w-4 h-4 mx-auto mb-1 text-purple-500" />
                <p className="text-sm font-bold truncate">{s.value}</p>
                <p className="text-[10px] text-muted-foreground">{s.label}</p>
              </GlassCard>
            ))}
          </div>

          {/* Trip Progress */}
          <GlassCard>
            <p className="text-sm font-semibold mb-3">Trip Progress</p>
            <div className="relative flex items-center justify-between">
              {STATUS_STEPS.map((step, i) => (
                <div key={i} className="flex flex-col items-center relative z-10">
                  {i < currentStep ? (
                    <div className="w-8 h-8 rounded-full bg-emerald-500 flex items-center justify-center">
                      <CheckCircle2 className="w-4 h-4 text-white" />
                    </div>
                  ) : i === currentStep ? (
                    <motion.div
                      animate={{ scale: [1, 1.1, 1] }}
                      transition={{ repeat: Infinity, duration: 2 }}
                      className="w-8 h-8 rounded-full gradient-purple flex items-center justify-center shadow-md shadow-purple-300/50"
                    >
                      <Sparkles className="w-4 h-4 text-white" />
                    </motion.div>
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center">
                      <Circle className="w-4 h-4 text-purple-300" />
                    </div>
                  )}
                  <span className="text-[9px] text-muted-foreground mt-1.5 text-center max-w-[60px] leading-tight">
                    {step.label}
                  </span>
                </div>
              ))}
              {/* Progress line behind */}
              <div className="absolute top-4 left-6 right-6 h-0.5 bg-purple-100 -z-0">
                <motion.div
                  className="h-full gradient-purple rounded-full"
                  initial={{ width: '0%' }}
                  animate={{ width: `${(currentStep / (STATUS_STEPS.length - 1)) * 100}%` }}
                  transition={{ duration: 0.8, ease: 'easeOut' }}
                />
              </div>
            </div>
          </GlassCard>

          {/* Survey Progress */}
          <GlassCard variant="gradient">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold">Survey Collection</p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {trip.surveyCompleted}/{trip.totalMembers} members completed
                </p>
              </div>
              <ProgressRing
                progress={trip.totalMembers > 0 ? (trip.surveyCompleted / trip.totalMembers) * 100 : 0}
                size={52}
                strokeWidth={4}
              />
            </div>
            {trip.status === 'planning' && trip.surveyCompleted < trip.totalMembers && (
              <Button
                onClick={() => {
                  toast.info('Survey reminders sent!', {
                    description: `${trip.totalMembers - trip.surveyCompleted} members will be notified`,
                  });
                }}
                className="w-full mt-3 h-10 rounded-full gradient-purple text-white text-sm"
              >
                <Mail className="w-4 h-4 mr-2" />
                Send Survey Reminders
              </Button>
            )}
          </GlassCard>
        </TabsContent>

        {/* DESTINATIONS TAB */}
        <TabsContent value="destinations" className="mt-4 px-4 space-y-3">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-sm font-semibold">AI-Recommended Destinations</h2>
            <Button
              onClick={() => navigate('voting')}
              className="h-8 rounded-full gradient-purple text-white text-xs px-4"
            >
              Start Voting
            </Button>
          </div>

          {destinations.map((dest, i) => (
            <motion.div
              key={dest.id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
            >
              <GlassCard variant="purple" className="overflow-hidden p-0">
                <div className="flex gap-3 p-3.5">
                  <div className="w-20 h-20 rounded-xl overflow-hidden shrink-0">
                    <img src={dest.imageUrl} alt={dest.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="text-sm font-bold">{dest.name}</h3>
                        <p className="text-xs text-muted-foreground">{dest.country}</p>
                      </div>
                      <Badge className="bg-purple-100 text-purple-700 text-[10px] rounded-full shrink-0">
                        {Math.round(dest.score * 100)}% match
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{dest.description}</p>
                    <p className="text-xs font-semibold text-purple-600 mt-1">{dest.estimatedCost}</p>
                  </div>
                </div>

                {/* Highlights */}
                <div className="px-3.5 pb-2 flex flex-wrap gap-1.5">
                  {dest.highlights.slice(0, 4).map((h) => (
                    <span key={h} className="text-[10px] px-2 py-0.5 rounded-full bg-purple-50 text-purple-600 font-medium">
                      {h}
                    </span>
                  ))}
                </div>

                {/* AI Reasoning (expandable) */}
                <button
                  onClick={() => setExpandedDest(expandedDest === dest.id ? null : dest.id)}
                  className="w-full px-3.5 py-2 text-left border-t border-purple-100/50 hover:bg-purple-50/50 transition-colors"
                >
                  <div className="flex items-center gap-1 text-xs text-purple-600 font-medium">
                    <Sparkles className="w-3 h-3" />
                    AI Reasoning
                    <ChevronRight className={cn(
                      'w-3 h-3 transition-transform',
                      expandedDest === dest.id && 'rotate-90'
                    )} />
                  </div>
                  <AnimatePresence>
                    {expandedDest === dest.id && (
                      <motion.p
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="text-xs text-muted-foreground mt-1.5 leading-relaxed overflow-hidden"
                      >
                        {dest.aiReasoning}
                      </motion.p>
                    )}
                  </AnimatePresence>
                </button>
              </GlassCard>
            </motion.div>
          ))}

          <Button variant="outline" className="w-full rounded-2xl border-purple-200 text-purple-700 h-10">
            <Sparkles className="w-4 h-4 mr-2" />
            Generate New Suggestions
          </Button>
        </TabsContent>

        {/* MEMBERS TAB */}
        <TabsContent value="members" className="mt-4 px-4 space-y-3">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-sm font-semibold">
              Members ({members.length})
            </h2>
            <Button className="h-8 rounded-full gradient-purple text-white text-xs px-4 gap-1">
              <Plus className="w-3 h-3" />
              Add
            </Button>
          </div>

          {members.map((m, i) => (
            <motion.div
              key={m.id}
              initial={{ opacity: 0, x: -15 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.05 }}
            >
              <GlassCard className="flex items-center gap-3 p-3">
                <div className={cn(
                  'w-10 h-10 rounded-full flex items-center justify-center text-white text-sm font-bold shrink-0',
                  i % 3 === 0 ? 'gradient-purple' : i % 3 === 1 ? 'bg-gradient-to-br from-sky-400 to-cyan-500' : 'bg-gradient-to-br from-amber-400 to-orange-500'
                )}>
                  {m.userName.split(' ').map((w) => w[0]).join('').slice(0, 2)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold truncate">{m.userName}</p>
                  <p className="text-xs text-muted-foreground">{m.role === 'creator' ? 'Creator' : 'Member'}</p>
                </div>
                <div className="flex flex-col gap-1 items-end">
                  <span className={cn(
                    'text-[10px] font-medium px-2 py-0.5 rounded-full',
                    m.surveyCompleted ? 'bg-emerald-100 text-emerald-600' : 'bg-amber-100 text-amber-600'
                  )}>
                    {m.surveyCompleted ? '✓ Survey' : '⏳ Survey'}
                  </span>
                  <span className={cn(
                    'text-[10px] font-medium px-2 py-0.5 rounded-full',
                    m.hasVoted ? 'bg-emerald-100 text-emerald-600' : 'bg-gray-100 text-gray-500'
                  )}>
                    {m.hasVoted ? '✓ Voted' : '⏳ Vote'}
                  </span>
                </div>
              </GlassCard>
            </motion.div>
          ))}
        </TabsContent>

        {/* ITINERARY TAB */}
        <TabsContent value="itinerary" className="mt-4 px-4 space-y-3">
          <h2 className="text-sm font-semibold mb-2">Itinerary</h2>

          {/* Day Selector */}
          <div className="flex gap-2 overflow-x-auto no-scrollbar -mx-4 px-4 pb-1">
            {days.map((d) => (
              <button
                key={d}
                onClick={() => setSelectedDay(d)}
                className={cn(
                  'shrink-0 px-4 py-2 rounded-full text-xs font-semibold transition-all',
                  selectedDay === d
                    ? 'gradient-purple text-white shadow-md shadow-purple-300/30'
                    : 'glass-card text-muted-foreground'
                )}
              >
                Day {d}
              </button>
            ))}
          </div>

          {/* Timeline */}
          <div className="relative pl-6 space-y-3">
            <div className="absolute left-[11px] top-2 bottom-2 w-0.5 bg-purple-200" />

            {dayItems.map((item) => {
              const Icon = ITINERARY_ICONS[item.category] || Camera;
              return (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="relative"
                >
                  <button
                    onClick={() => toggleItineraryItem(item.id)}
                    className="absolute left-[-22px] top-3 w-5 h-5 rounded-full border-2 border-purple-300 bg-white flex items-center justify-center z-10"
                  >
                    {item.isCompleted && <CheckCircle2 className="w-4 h-4 text-emerald-500" />}
                  </button>
                  <GlassCard className={cn('p-3 text-left w-full', item.isCompleted && 'opacity-60')}>
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-lg bg-purple-100 flex items-center justify-center shrink-0 mt-0.5">
                        <Icon className="w-4 h-4 text-purple-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          {item.time && (
                            <span className="text-[10px] text-purple-500 font-medium">{item.time}</span>
                          )}
                        </div>
                        <p className={cn('text-sm font-semibold', item.isCompleted && 'line-through')}>
                          {item.title}
                        </p>
                        {item.description && (
                          <p className="text-xs text-muted-foreground mt-0.5">{item.description}</p>
                        )}
                        {item.location && (
                          <p className="text-xs text-purple-500 mt-1 flex items-center gap-1">
                            <MapPin className="w-3 h-3" />
                            {item.location}
                          </p>
                        )}
                      </div>
                    </div>
                  </GlassCard>
                </motion.div>
              );
            })}
          </div>
        </TabsContent>

        {/* CHAT TAB */}
        <TabsContent value="chat" className="mt-4 px-4">
          <GlassCard variant="gradient" className="text-center py-10">
            <div className="w-16 h-16 rounded-full gradient-purple mx-auto mb-4 flex items-center justify-center shadow-lg shadow-purple-300/30">
              <MessageSquare className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-base font-bold mb-1">AI Travel Assistant</h3>
            <p className="text-sm text-muted-foreground mb-4 max-w-[250px] mx-auto">
              Get personalized recommendations, compare destinations, and plan your perfect trip
            </p>
            <Button
              onClick={() => navigate('chat')}
              className="h-10 rounded-full gradient-purple text-white px-6 gap-2"
            >
              <Plane className="w-4 h-4" />
              Open AI Chat
            </Button>
          </GlassCard>
        </TabsContent>
      </Tabs>
    </div>
  );
}