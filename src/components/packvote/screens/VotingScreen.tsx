'use client';

import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { ArrowLeft, GripVertical, Star, MapPin, ChevronUp, ChevronDown, Send, CheckCircle2, Sparkles, Trophy, ArrowRight } from 'lucide-react';
import { useAppStore } from '@/lib/store';
import { Button } from '@/components/ui/button';
import { GlassCard } from '@/components/packvote/shared/GlassCard';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import type { Destination } from '@/lib/types';

// ---- Phase 2: Sortable card for ranking ----

function SortableDestCard({
  dest,
  rank,
  total,
  onMoveUp,
  onMoveDown,
}: {
  dest: Destination;
  rank: number;
  total: number;
  onMoveUp: () => void;
  onMoveDown: () => void;
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: dest.id });
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const rankEmoji = rank === 1 ? '🥇' : rank === 2 ? '🥈' : rank === 3 ? '🥉' : `#${rank}`;

  return (
    <motion.div
      ref={setNodeRef}
      style={style}
      layout
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: rank * 0.05 }}
      className={cn(
        'rounded-2xl overflow-hidden transition-shadow',
        isDragging ? 'shadow-xl shadow-purple-300/40 z-50 scale-[1.02]' : 'shadow-sm',
        rank === 1 && !isDragging && 'ring-2 ring-purple-400 ring-offset-2'
      )}
    >
      <div className="glass-card-purple border border-purple-100/50 p-3 flex items-center gap-3">
        <button
          {...attributes}
          {...listeners}
          className="touch-none p-1.5 text-purple-300 hover:text-purple-500 shrink-0 cursor-grab active:cursor-grabbing rounded-lg hover:bg-purple-100/50 transition-colors"
          aria-label="Drag to reorder"
        >
          <GripVertical className="w-5 h-5" />
        </button>

        <div className={cn(
          'w-10 h-10 rounded-full flex items-center justify-center shrink-0 font-bold text-sm',
          rank === 1 ? 'gradient-purple text-white shadow-md shadow-purple-300/40' :
          rank === 2 ? 'bg-gray-200 text-gray-700' :
          rank === 3 ? 'bg-amber-100 text-amber-700' :
          'bg-purple-50 text-purple-500'
        )}>
          {rank <= 3 ? rankEmoji : rank}
        </div>

        <div className="w-12 h-12 rounded-xl overflow-hidden shrink-0">
          <img src={dest.imageUrl} alt={dest.name} className="w-full h-full object-cover" />
        </div>

        <div className="flex-1 min-w-0">
          <h3 className="text-sm font-bold truncate">{dest.name}</h3>
          <p className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
            <MapPin className="w-3 h-3" /> {dest.country}
          </p>
        </div>

        <div className="flex flex-col gap-1 shrink-0">
          <button
            onClick={onMoveUp}
            disabled={rank === 1}
            className={cn(
              'w-8 h-8 rounded-lg flex items-center justify-center transition-all',
              rank === 1 ? 'text-gray-200 cursor-not-allowed' : 'text-purple-500 hover:bg-purple-100 active:scale-90'
            )}
            aria-label="Move up"
          >
            <ChevronUp className="w-5 h-5" />
          </button>
          <button
            onClick={onMoveDown}
            disabled={rank === total}
            className={cn(
              'w-8 h-8 rounded-lg flex items-center justify-center transition-all',
              rank === total ? 'text-gray-200 cursor-not-allowed' : 'text-purple-500 hover:bg-purple-100 active:scale-90'
            )}
            aria-label="Move down"
          >
            <ChevronDown className="w-5 h-5" />
          </button>
        </div>
      </div>
    </motion.div>
  );
}

// ---- Main Voting Screen ----

export function VotingScreen() {
  const { destinations, votes, setVote, submitVotes, votingCompleted, navigate, goBack } = useAppStore();

  // Phase: "pick" = tap to select your #1, "rank" = fine-tune the full ranking
  const [phase, setPhase] = useState<'pick' | 'rank'>('pick');
  const [selectedId, setSelectedId] = useState<string | null>(null);

  // For ranking phase — order built from user's pick
  const [localOrder, setLocalOrder] = useState<string[]>([]);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const handlePick = (destId: string) => {
    setSelectedId(destId);
    toast.success(`${destinations.find(d => d.id === destId)?.name} selected as #1! 🎉`, { duration: 2000 });
  };

  const proceedToRank = () => {
    if (!selectedId) return;
    // Put picked destination first, randomize the rest
    const rest = destinations.filter(d => d.id !== selectedId).map(d => d.id);
    // Shuffle the rest so there's no inherent bias
    for (let i = rest.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [rest[i], rest[j]] = [rest[j], rest[i]];
    }
    const order = [selectedId, ...rest];
    setLocalOrder(order);
    order.forEach((id, idx) => setVote(id, idx + 1));
    setPhase('rank');
  };

  const handleDragEnd = useCallback((event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      setLocalOrder((items) => {
        const oldIndex = items.indexOf(active.id as string);
        const newIndex = items.indexOf(over.id as string);
        const newOrder = arrayMove(items, oldIndex, newIndex);
        newOrder.forEach((destId, idx) => {
          setVote(destId, idx + 1);
        });
        return newOrder;
      });
    }
  }, [setVote]);

  const moveItem = useCallback((destId: string, direction: 'up' | 'down') => {
    setLocalOrder((items) => {
      const idx = items.indexOf(destId);
      if (idx === -1) return items;
      const newIdx = direction === 'up' ? idx - 1 : idx + 1;
      if (newIdx < 0 || newIdx >= items.length) return items;
      const newOrder = arrayMove(items, idx, newIdx);
      newOrder.forEach((id, i) => {
        setVote(id, i + 1);
      });
      return newOrder;
    });
  }, [setVote]);

  const handleSubmit = () => {
    localOrder.forEach((destId, idx) => {
      setVote(destId, idx + 1);
    });
    submitVotes();
    const topChoice = destinations.find(d => d.id === localOrder[0]);
    toast.success('Vote submitted! 🎉', {
      description: `Your #1 choice: ${topChoice?.name || 'Unknown'}`,
    });
    navigate('results');
  };

  // ---- Already voted ----
  if (votingCompleted) {
    return (
      <div className="screen-container animate-fade-in flex flex-col items-center justify-center px-4">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', bounce: 0.4 }}
          className="w-20 h-20 rounded-full bg-emerald-100 flex items-center justify-center mb-4"
        >
          <CheckCircle2 className="w-10 h-10 text-emerald-500" />
        </motion.div>
        <h2 className="text-xl font-bold mb-2">Vote Submitted!</h2>
        <p className="text-sm text-muted-foreground text-center mb-6">Your preferences have been recorded</p>
        <Button
          onClick={() => navigate('results')}
          className="h-11 rounded-full gradient-purple text-white px-8 gap-2"
        >
          <Sparkles className="w-4 h-4" />
          View Results
        </Button>
      </div>
    );
  }

  // ================= PHASE 1: Pick your #1 =================
  if (phase === 'pick') {
    return (
      <div className="screen-container animate-slide-up px-4 pt-4 pb-28">
        {/* Header */}
        <div className="flex items-center gap-3 mb-4">
          <Button variant="ghost" size="icon" className="rounded-full h-10 w-10" onClick={goBack}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-lg font-bold flex-1">Vote for Your Destination</h1>
        </div>

        {/* Instructions */}
        <GlassCard variant="gradient" className="mb-5">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-full gradient-purple flex items-center justify-center shrink-0 mt-0.5">
              <Trophy className="w-4 h-4 text-white" />
            </div>
            <div>
              <p className="text-sm font-semibold">Step 1: Choose Your Favorite</p>
              <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">
                Tap on the destination you want to visit most. You&apos;ll be able to rank the rest in the next step.
              </p>
            </div>
          </div>
        </GlassCard>

        {/* Destination Selection Cards */}
        <div className="space-y-3">
          {destinations.map((dest, idx) => {
            const isSelected = selectedId === dest.id;
            return (
              <motion.button
                key={dest.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.08 }}
                onClick={() => handlePick(dest.id)}
                className={cn(
                  'w-full text-left rounded-2xl overflow-hidden transition-all duration-300',
                  isSelected
                    ? 'ring-3 ring-purple-500 ring-offset-2 scale-[1.02] shadow-xl shadow-purple-300/30'
                    : 'hover:shadow-md hover:scale-[1.01]'
                )}
              >
                <div className={cn(
                  'border-2 rounded-2xl p-4 flex items-center gap-4 transition-all',
                  isSelected
                    ? 'border-purple-500 bg-gradient-to-r from-purple-50 to-fuchsia-50'
                    : 'border-purple-100/50 glass-card-purple'
                )}>
                  {/* Selection Indicator */}
                  <div className={cn(
                    'w-7 h-7 rounded-full border-2 flex items-center justify-center shrink-0 transition-all',
                    isSelected
                      ? 'border-purple-500 gradient-purple'
                      : 'border-gray-300'
                  )}>
                    {isSelected && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: 'spring', bounce: 0.5 }}
                      >
                        <CheckCircle2 className="w-5 h-5 text-white" />
                      </motion.div>
                    )}
                  </div>

                  {/* Image */}
                  <div className="w-16 h-16 rounded-xl overflow-hidden shrink-0">
                    <img src={dest.imageUrl} alt={dest.name} className="w-full h-full object-cover" />
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-base truncate">{dest.name}</h3>
                    <p className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
                      <MapPin className="w-3 h-3" /> {dest.country}
                    </p>
                    <div className="flex items-center gap-3 mt-1.5">
                      <span className="flex items-center gap-0.5 text-amber-500">
                        <Star className="w-3.5 h-3.5 fill-amber-500" />
                        <span className="text-xs font-semibold">{dest.rating}</span>
                      </span>
                      <span className="text-[11px] text-purple-600 font-medium bg-purple-50 px-2 py-0.5 rounded-full">
                        {Math.round(dest.score * 100)}% match
                      </span>
                      <span className="text-[11px] text-muted-foreground">
                        {dest.estimatedCost}
                      </span>
                    </div>
                  </div>

                  {/* Selected Badge */}
                  {isSelected && (
                    <motion.span
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      className="text-xs font-bold text-white gradient-purple px-3 py-1.5 rounded-full shrink-0 shadow-md"
                    >
                      #1 Pick
                    </motion.span>
                  )}
                </div>
              </motion.button>
            );
          })}
        </div>

        {/* Continue Button */}
        <div className="fixed bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-[#f8f7ff] via-[#f8f7ff] to-transparent safe-bottom z-30">
          <div className="mx-auto max-w-md">
            <Button
              onClick={proceedToRank}
              disabled={!selectedId}
              className={cn(
                'w-full h-12 rounded-full font-semibold text-base transition-all gap-2',
                selectedId
                  ? 'gradient-purple text-white shadow-lg shadow-purple-300/30'
                  : 'bg-gray-200 text-gray-400 cursor-not-allowed'
              )}
            >
              Continue to Ranking
              <ArrowRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // ================= PHASE 2: Fine-tune ranking =================
  const topChoice = destinations.find(d => d.id === localOrder[0]);

  return (
    <div className="screen-container animate-slide-up px-4 pt-4 pb-28">
      {/* Header */}
      <div className="flex items-center gap-3 mb-4">
        <Button variant="ghost" size="icon" className="rounded-full h-10 w-10" onClick={() => setPhase('pick')}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h1 className="text-lg font-bold flex-1">Rank the Rest</h1>
      </div>

      {/* Instructions */}
      <GlassCard variant="gradient" className="mb-5">
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 rounded-full gradient-purple flex items-center justify-center shrink-0 mt-0.5">
            <Sparkles className="w-4 h-4 text-white" />
          </div>
          <div>
            <p className="text-sm font-semibold">Step 2: Fine-tune Your Ranking</p>
            <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">
              Use the <strong>⬆ ⬇ arrows</strong> or <strong>drag</strong> the grip handle to reorder. Position #1 is your top choice. Or just submit as-is!
            </p>
          </div>
        </div>
      </GlassCard>

      {/* Current #1 Highlight */}
      {topChoice && (
        <motion.div
          key={topChoice.id}
          layout
          className="mb-4 rounded-2xl bg-gradient-to-r from-purple-500 to-fuchsia-500 p-[1px]"
        >
          <div className="bg-white dark:bg-gray-950 rounded-2xl px-4 py-3 flex items-center gap-3">
            <Trophy className="w-5 h-5 text-purple-600 shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="text-[10px] text-muted-foreground font-medium">YOUR #1 PICK</p>
              <p className="text-sm font-bold truncate">{topChoice.name}</p>
            </div>
            <span className="text-xs font-semibold text-purple-600 bg-purple-50 px-2.5 py-1 rounded-full">
              {Math.round(topChoice.score * 100)}% match
            </span>
          </div>
        </motion.div>
      )}

      {/* Sortable List */}
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext items={localOrder} strategy={verticalListSortingStrategy}>
          <div className="space-y-3">
            <AnimatePresence>
              {localOrder.map((destId, idx) => {
                const dest = destinations.find(d => d.id === destId);
                if (!dest) return null;
                return (
                  <SortableDestCard
                    key={dest.id}
                    dest={dest}
                    rank={idx + 1}
                    total={localOrder.length}
                    onMoveUp={() => moveItem(destId, 'up')}
                    onMoveDown={() => moveItem(destId, 'down')}
                  />
                );
              })}
            </AnimatePresence>
          </div>
        </SortableContext>
      </DndContext>

      {/* Submit Button */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-[#f8f7ff] via-[#f8f7ff] to-transparent safe-bottom z-30">
        <div className="mx-auto max-w-md">
          <Button
            onClick={handleSubmit}
            className="w-full h-12 rounded-full font-semibold text-base gradient-purple text-white shadow-lg shadow-purple-300/30 gap-2"
          >
            <Send className="w-4 h-4" />
            Submit Vote
          </Button>
        </div>
      </div>
    </div>
  );
}