'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Trophy, Medal, Star, Sparkles, RotateCcw, Share2, PartyPopper, MapPin, DollarSign, Calendar } from 'lucide-react';
import { useAppStore } from '@/lib/store';
import { Button } from '@/components/ui/button';
import { GlassCard } from '@/components/packvote/shared/GlassCard';
import { cn } from '@/lib/utils';

export function ResultsScreen() {
  const { destinations, goBack, navigate } = useAppStore();

  const sorted = [...destinations].sort((a, b) => (b.score || 0) - (a.score || 0));
  const winner = sorted[0];
  const runners = sorted.slice(1);

  if (!winner) {
    return (
      <div className="screen-container flex items-center justify-center">
        <p className="text-muted-foreground">No results available</p>
      </div>
    );
  }

  return (
    <div className="screen-container animate-slide-up px-4 pt-4 pb-20">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <Button variant="ghost" size="icon" className="rounded-full h-10 w-10" onClick={goBack}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h1 className="text-lg font-bold flex-1">Voting Results</h1>
        <Button variant="ghost" size="icon" className="rounded-full h-10 w-10">
          <Share2 className="h-5 w-5 text-purple-600" />
        </Button>
      </div>

      {/* Winner */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ type: 'spring', bounce: 0.3, duration: 0.6 }}
      >
        <div className="relative rounded-2xl overflow-hidden mb-6">
          <div className="relative h-56 overflow-hidden">
            <img src={winner.imageUrl} alt={winner.name} className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-purple-900/80 via-purple-900/30 to-transparent" />

            {/* Floating decorations */}
            <motion.div
              animate={{ y: [-5, 5, -5], rotate: [0, 10, 0] }}
              transition={{ repeat: Infinity, duration: 3 }}
              className="absolute top-4 right-4 text-4xl"
            >
              <PartyPopper className="w-8 h-8 text-amber-400" />
            </motion.div>
            <motion.div
              animate={{ y: [5, -5, 5], rotate: [0, -10, 0] }}
              transition={{ repeat: Infinity, duration: 3.5 }}
              className="absolute top-4 right-16 text-3xl"
            >
              ✨
            </motion.div>

            {/* Winner Badge */}
            <div className="absolute top-4 left-4">
              <div className="flex items-center gap-1.5 bg-amber-400 text-amber-900 px-3 py-1.5 rounded-full text-xs font-bold shadow-lg">
                <Trophy className="w-4 h-4" />
                WINNER
              </div>
            </div>

            {/* Winner Info */}
            <div className="absolute bottom-4 left-4 right-4">
              <h2 className="text-white text-2xl font-bold">{winner.name}</h2>
              <div className="flex items-center gap-3 mt-1.5 text-white/90 text-xs">
                <span className="flex items-center gap-1">
                  <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                  {winner.rating}
                </span>
                <span className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5" />
                  {winner.country}
                </span>
                <span className="flex items-center gap-1">
                  <DollarSign className="w-3.5 h-3.5" />
                  {winner.estimatedCost}
                </span>
              </div>
            </div>
          </div>

          {/* Score Bar */}
          <div className="bg-white p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-semibold">AI Match Score</span>
              <span className="text-sm font-bold text-purple-700">{Math.round(winner.score * 100)}%</span>
            </div>
            <div className="h-2.5 bg-purple-100 rounded-full overflow-hidden">
              <motion.div
                className="h-full gradient-purple rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${winner.score * 100}%` }}
                transition={{ duration: 1, ease: 'easeOut', delay: 0.3 }}
              />
            </div>
          </div>
        </div>
      </motion.div>

      {/* Action Buttons */}
      <div className="flex gap-3 mb-6">
        <Button
          onClick={() => navigate('trip-detail')}
          className="flex-1 h-11 rounded-full gradient-purple text-white font-semibold shadow-lg shadow-purple-300/30"
        >
          <Sparkles className="w-4 h-4 mr-2" />
          Confirm Destination
        </Button>
        <Button variant="outline" className="h-11 rounded-full border-purple-200 text-purple-700 px-4">
          <RotateCcw className="w-4 h-4" />
        </Button>
      </div>

      {/* AI Analysis */}
      <GlassCard variant="gradient" className="mb-6">
        <div className="flex items-center gap-2 mb-2">
          <Sparkles className="w-4 h-4 text-purple-600" />
          <h3 className="text-sm font-semibold">AI Consensus Analysis</h3>
        </div>
        <p className="text-xs text-muted-foreground leading-relaxed">
          {winner.name} emerged as the clear group favorite based on survey preferences. 
          Key factors that drove the consensus include alignment with the group&apos;s budget range 
          ({winner.estimatedCost}), strong match with preferred activities, and optimal travel 
          timing. The destination received top rankings from {Math.ceil(destinations.length * 0.7)} out of 
          {destinations.length} voters in the first-choice position.
        </p>
      </GlassCard>

      {/* Runner-ups */}
      <h3 className="text-sm font-semibold mb-3">Full Rankings</h3>
      <div className="space-y-3">
        {runners.map((dest, i) => {
          const rank = i + 2;
          return (
            <motion.div
              key={dest.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 + i * 0.1 }}
            >
              <GlassCard className="flex items-center gap-3 p-3">
                <div className={cn(
                  'w-8 h-8 rounded-full flex items-center justify-center shrink-0 text-lg',
                  rank === 2 ? 'bg-gray-200' : rank === 3 ? 'bg-amber-100' : 'bg-purple-50'
                )}>
                  {rank === 2 ? '🥈' : rank === 3 ? '🥉' : `#${rank}`}
                </div>
                <div className="w-12 h-12 rounded-lg overflow-hidden shrink-0">
                  <img src={dest.imageUrl} alt={dest.name} className="w-full h-full object-cover" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold truncate">{dest.name}</p>
                  <p className="text-xs text-muted-foreground">{dest.country}</p>
                </div>
                <div className="text-right shrink-0">
                  <p className="text-sm font-bold text-purple-700">{Math.round(dest.score * 100)}%</p>
                  <p className="text-[10px] text-muted-foreground">match</p>
                </div>
              </GlassCard>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}