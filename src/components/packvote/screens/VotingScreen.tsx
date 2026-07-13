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
import { ArrowLeft, GripVertical, Star, MapPin, ChevronRight, Send, CheckCircle2, Sparkles, RotateCcw } from 'lucide-react';
import { useAppStore } from '@/lib/store';
import { Button } from '@/components/ui/button';
import { GlassCard } from '@/components/packvote/shared/GlassCard';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import type { Destination } from '@/lib/types';

function SortableDestCard({ dest, rank }: { dest: Destination; rank: number }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: dest.id });
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <motion.div
      ref={setNodeRef}
      style={style}
      layout
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        'rounded-2xl overflow-hidden transition-shadow',
        isDragging ? 'shadow-xl shadow-purple-300/40 z-50' : 'shadow-sm'
      )}
    >
      <div className="glass-card-purple border border-purple-100/50 p-3 flex items-center gap-3">
        {/* Drag Handle */}
        <button
          {...attributes}
          {...listeners}
          className="touch-none p-1 text-purple-300 hover:text-purple-500 shrink-0"
          aria-label="Drag to reorder"
        >
          <GripVertical className="w-5 h-5" />
        </button>

        {/* Rank */}
        <div className={cn(
          'w-9 h-9 rounded-full flex items-center justify-center shrink-0 font-bold text-sm',
          rank === 1 ? 'gradient-purple text-white shadow-md shadow-purple-300/40' :
          rank === 2 ? 'bg-gray-200 text-gray-600' :
          rank === 3 ? 'bg-amber-100 text-amber-700' :
          'bg-purple-50 text-purple-500'
        )}>
          {rank}
        </div>

        {/* Image */}
        <div className="w-14 h-14 rounded-xl overflow-hidden shrink-0">
          <img src={dest.imageUrl} alt={dest.name} className="w-full h-full object-cover" />
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <h3 className="text-sm font-bold truncate">{dest.name}</h3>
          <p className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
            <MapPin className="w-3 h-3" />
            {dest.country}
          </p>
          <div className="flex items-center gap-2 mt-1">
            <span className="flex items-center gap-0.5 text-amber-500">
              <Star className="w-3 h-3 fill-amber-500" />
              <span className="text-[11px] font-semibold">{dest.rating}</span>
            </span>
            <span className="text-[10px] text-purple-600 font-medium bg-purple-50 px-1.5 py-0.5 rounded-full">
              {Math.round(dest.score * 100)}%
            </span>
          </div>
        </div>

        <ChevronRight className="w-4 h-4 text-gray-300 shrink-0" />
      </div>
    </motion.div>
  );
}

export function VotingScreen() {
  const { destinations, votes, setVote, submitVotes, votingCompleted, navigate, goBack } = useAppStore();
  const [localOrder, setLocalOrder] = useState<string[]>(
    () => {
      if (votes.length > 0) {
        return [...votes].sort((a, b) => a.rank - b.rank).map(v => v.destinationId);
      }
      return destinations.map(d => d.id);
    }
  );

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const handleDragEnd = useCallback((event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      setLocalOrder((items) => {
        const oldIndex = items.indexOf(active.id as string);
        const newIndex = items.indexOf(over.id as string);
        const newOrder = arrayMove(items, oldIndex, newIndex);
        // Update votes based on new order
        newOrder.forEach((destId, idx) => {
          setVote(destId, idx + 1);
        });
        return newOrder;
      });
    }
  }, [setVote]);

  const handleSubmit = () => {
    localOrder.forEach((destId, idx) => {
      setVote(destId, idx + 1);
    });
    submitVotes();
    const topChoice = destinations.find(d => d.id === localOrder[0]);
    toast.success('Vote submitted!', {
      description: `Your top choice: ${topChoice?.name || 'Unknown'}`,
    });
    navigate('results');
  };

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

  return (
    <div className="screen-container animate-slide-up px-4 pt-4 pb-24">
      {/* Header */}
      <div className="flex items-center gap-3 mb-4">
        <Button variant="ghost" size="icon" className="rounded-full h-10 w-10" onClick={goBack}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h1 className="text-lg font-bold flex-1">Rank Your Choices</h1>
      </div>

      {/* Instructions */}
      <GlassCard variant="gradient" className="mb-5">
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 rounded-full gradient-purple flex items-center justify-center shrink-0 mt-0.5">
            <Sparkles className="w-4 h-4 text-white" />
          </div>
          <div>
            <p className="text-sm font-semibold">Drag to Rank</p>
            <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">
              Reorder destinations by preference. Position 1 is your top choice. Your group&apos;s rankings will be combined using ranked-choice voting.
            </p>
          </div>
        </div>
      </GlassCard>

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
                return <SortableDestCard key={dest.id} dest={dest} rank={idx + 1} />;
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