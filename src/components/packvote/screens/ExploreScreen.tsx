'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Star, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useAppStore } from '@/lib/store';

interface ExploreDest {
  id: string;
  name: string;
  country: string;
  image: string;
  rating: number;
  matchScore: number;
  cost: string;
  category: string;
}

const ALL_DESTINATIONS: ExploreDest[] = [
  { id: 'ed1', name: 'Bali, Indonesia', country: 'Indonesia', image: '/destinations/beach.jpg', rating: 4.8, matchScore: 95, cost: '$900 - $1,400', category: 'beach' },
  { id: 'ed2', name: 'Phuket, Thailand', country: 'Thailand', image: '/destinations/coast.jpg', rating: 4.6, matchScore: 88, cost: '$700 - $1,200', category: 'beach' },
  { id: 'ed3', name: 'Swiss Alps', country: 'Switzerland', image: '/destinations/mountain.jpg', rating: 4.9, matchScore: 92, cost: '$1,500 - $2,500', category: 'mountain' },
  { id: 'ed4', name: 'Tokyo, Japan', country: 'Japan', image: '/destinations/city.jpg', rating: 4.7, matchScore: 85, cost: '$2,000 - $3,500', category: 'city' },
  { id: 'ed5', name: 'Machu Picchu', country: 'Peru', image: '/destinations/cultural.jpg', rating: 4.8, matchScore: 78, cost: '$1,200 - $2,000', category: 'cultural' },
  { id: 'ed6', name: 'Costa Rica', country: 'Costa Rica', image: '/destinations/adventure.jpg', rating: 4.5, matchScore: 82, cost: '$800 - $1,500', category: 'adventure' },
  { id: 'ed7', name: 'Amalfi Coast', country: 'Italy', image: '/destinations/coast.jpg', rating: 4.9, matchScore: 90, cost: '$1,800 - $3,000', category: 'beach' },
];

const CATEGORIES = ['All', 'Beach', 'Mountain', 'City', 'Adventure', 'Cultural'];

export function ExploreScreen() {
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const { navigate } = useAppStore();

  const aiPicks = ALL_DESTINATIONS.filter((d) => d.matchScore >= 88).slice(0, 4);

  const filtered = ALL_DESTINATIONS.filter((d) => {
    const matchesSearch = d.name.toLowerCase().includes(search.toLowerCase()) ||
      d.country.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = activeCategory === 'All' || d.category.toLowerCase() === activeCategory.toLowerCase();
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="screen-container animate-slide-up px-4 pt-6">
      {/* Header */}
      <h1 className="text-2xl font-bold mb-4">Explore</h1>

      {/* Search */}
      <div className="relative mb-4">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-purple-400" />
        <Input
          placeholder="Search destinations..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-10 h-11 rounded-xl bg-white border-purple-200 focus:border-purple-500"
        />
      </div>

      {/* AI Picks */}
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-3">
          <Sparkles className="w-4 h-4 text-purple-600" />
          <h2 className="text-sm font-semibold">AI Picks for You</h2>
        </div>
        <div className="flex gap-3 overflow-x-auto no-scrollbar -mx-4 px-4 pb-2">
          {aiPicks.map((dest, i) => (
            <motion.button
              key={dest.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.1 }}
              onClick={() => navigate('trip-detail', { tripId: dest.id })}
              className="min-w-[200px] shrink-0 rounded-2xl overflow-hidden glass-card-purple border border-purple-100/50 active:scale-[0.98] transition-transform"
            >
              <div className="relative h-28 overflow-hidden">
                <img src={dest.image} alt={dest.name} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                <div className="absolute top-2 right-2">
                  <Badge className="bg-purple-600 text-white text-[10px] px-2 py-0.5 rounded-full">
                    {dest.matchScore}% Match
                  </Badge>
                </div>
                <div className="absolute bottom-2 left-2.5 right-2.5">
                  <p className="text-white text-sm font-semibold truncate">{dest.name}</p>
                  <p className="text-white/80 text-[11px]">{dest.country}</p>
                </div>
              </div>
            </motion.button>
          ))}
        </div>
      </div>

      {/* Category Filter */}
      <div className="flex gap-2 overflow-x-auto no-scrollbar -mx-4 px-4 mb-4">
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={cn(
              'shrink-0 px-4 py-2 rounded-full text-xs font-semibold transition-all',
              activeCategory === cat
                ? 'gradient-purple text-white shadow-md shadow-purple-300/30'
                : 'glass-card text-muted-foreground hover:text-foreground'
            )}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Destination Grid */}
      <div className="grid grid-cols-2 gap-3 pb-4">
        {filtered.map((dest, i) => (
          <motion.div
            key={dest.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
          >
            <button
              onClick={() => navigate('trip-detail', { tripId: dest.id })}
              className="w-full text-left rounded-2xl overflow-hidden glass-card-purple border border-purple-100/50 active:scale-[0.97] transition-transform"
            >
              <div className="relative h-28 overflow-hidden">
                <img src={dest.image} alt={dest.name} className="w-full h-full object-cover" />
                <div className="absolute top-2 right-2">
                  <div className="bg-white/90 backdrop-blur-sm rounded-full px-2 py-0.5 flex items-center gap-1">
                    <Star className="w-3 h-3 text-amber-500 fill-amber-500" />
                    <span className="text-[11px] font-semibold">{dest.rating}</span>
                  </div>
                </div>
              </div>
              <div className="p-3">
                <p className="text-sm font-semibold truncate">{dest.name}</p>
                <p className="text-[11px] text-muted-foreground mt-0.5">{dest.country}</p>
                <div className="flex items-center justify-between mt-2">
                  <span className="text-[11px] font-medium text-purple-600">{dest.cost}</span>
                  <span className="text-[10px] text-purple-500 font-semibold bg-purple-50 px-1.5 py-0.5 rounded-full">
                    {dest.matchScore}%
                  </span>
                </div>
              </div>
            </button>
          </motion.div>
        ))}
      </div>
    </div>
  );
}