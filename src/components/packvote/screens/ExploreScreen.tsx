'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Star, Sparkles, MapPin, DollarSign, Calendar, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent } from '@/components/ui/sheet';

interface ExploreDest {
  id: string;
  name: string;
  country: string;
  image: string;
  rating: number;
  matchScore: number;
  cost: string;
  category: string;
  description: string;
  bestTime: string;
  highlights: string[];
}

const ALL_DESTINATIONS: ExploreDest[] = [
  { id: 'ed1', name: 'Bali, Indonesia', country: 'Indonesia', image: '/destinations/beach.jpg', rating: 4.8, matchScore: 95, cost: '$900 - $1,400', category: 'beach', description: 'Tropical paradise with stunning beaches, ancient temples, lush rice terraces, and vibrant nightlife. Perfect for groups seeking a mix of relaxation and adventure.', bestTime: 'Apr - Oct', highlights: ['Surfing', 'Rice Terraces', 'Temples', 'Beach Clubs'] },
  { id: 'ed2', name: 'Phuket, Thailand', country: 'Thailand', image: '/destinations/coast.jpg', rating: 4.6, matchScore: 88, cost: '$700 - $1,200', category: 'beach', description: 'Thailand\'s largest island offers crystal-clear waters, world-class diving, delicious street food, and bustling night markets. Ideal for budget-conscious groups.', bestTime: 'Nov - Apr', highlights: ['Phi Phi Islands', 'Cooking Class', 'Night Markets', 'Diving'] },
  { id: 'ed3', name: 'Swiss Alps', country: 'Switzerland', image: '/destinations/mountain.jpg', rating: 4.9, matchScore: 92, cost: '$1,500 - $2,500', category: 'mountain', description: 'Majestic peaks, pristine lakes, charming villages, and world-class skiing. The ultimate destination for nature lovers and adventure seekers.', bestTime: 'Jun - Sep', highlights: ['Hiking', 'Skiing', 'Scenic Trains', 'Chocolate'] },
  { id: 'ed4', name: 'Tokyo, Japan', country: 'Japan', image: '/destinations/city.jpg', rating: 4.7, matchScore: 85, cost: '$2,000 - $3,500', category: 'city', description: 'A mesmerizing blend of ultramodern technology and traditional culture. From neon-lit streets to serene temples, Tokyo is an unforgettable experience.', bestTime: 'Mar - May', highlights: ['Sushi', 'Temples', 'Akihabara', 'Cherry Blossoms'] },
  { id: 'ed5', name: 'Machu Picchu', country: 'Peru', image: '/destinations/cultural.jpg', rating: 4.8, matchScore: 78, cost: '$1,200 - $2,000', category: 'cultural', description: 'The ancient Incan citadel perched high in the Andes mountains. A bucket-list destination combining history, adventure, and breathtaking scenery.', bestTime: 'May - Sep', highlights: ['Inca Trail', 'Sacred Valley', 'Cusco', 'Local Cuisine'] },
  { id: 'ed6', name: 'Costa Rica', country: 'Costa Rica', image: '/destinations/adventure.jpg', rating: 4.5, matchScore: 82, cost: '$800 - $1,500', category: 'adventure', description: 'Pura Vida! Zip-line through cloud forests, surf Pacific waves, spot exotic wildlife, and soak in natural hot springs in this eco-paradise.', bestTime: 'Dec - Apr', highlights: ['Zip-lining', 'Surfing', 'Wildlife', 'Hot Springs'] },
  { id: 'ed7', name: 'Amalfi Coast', country: 'Italy', image: '/destinations/coast.jpg', rating: 4.9, matchScore: 90, cost: '$1,800 - $3,000', category: 'beach', description: 'Dramatic cliffside villages, crystal turquoise waters, incredible Italian cuisine, and lemon groves. One of the most scenic coastlines in the world.', bestTime: 'May - Sep', highlights: ['Positano', 'Boat Tours', 'Limoncello', 'Hiking'] },
  { id: 'ed8', name: 'Kyoto, Japan', country: 'Japan', image: '/destinations/cultural.jpg', rating: 4.8, matchScore: 87, cost: '$1,800 - $3,000', category: 'cultural', description: 'Japan\'s cultural heart with thousands of temples, traditional tea houses, bamboo groves, and geisha districts. A serene escape into ancient Japan.', bestTime: 'Mar - May', highlights: ['Fushimi Inari', 'Bamboo Grove', 'Tea Ceremony', 'Geisha'] },
  { id: 'ed9', name: 'Patagonia', country: 'Argentina', image: '/destinations/mountain.jpg', rating: 4.7, matchScore: 75, cost: '$1,500 - $2,500', category: 'adventure', description: 'Raw, untamed wilderness at the end of the world. Towering glaciers, turquoise lakes, and dramatic peaks make this a trekker\'s paradise.', bestTime: 'Oct - Mar', highlights: ['Glaciers', 'Torres del Paine', 'Wildlife', 'Camping'] },
  { id: 'ed10', name: 'Santorini', country: 'Greece', image: '/destinations/beach.jpg', rating: 4.9, matchScore: 93, cost: '$1,500 - $2,800', category: 'beach', description: 'Iconic white-washed buildings perched on volcanic cliffs overlooking the deep blue Aegean Sea. Famous for the most spectacular sunsets on Earth.', bestTime: 'Apr - Oct', highlights: ['Sunsets', 'Wine Tours', 'Caldera Cruise', 'Beaches'] },
];

const CATEGORIES = ['All', 'Beach', 'Mountain', 'City', 'Adventure', 'Cultural'];

export function ExploreScreen() {
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [selectedDest, setSelectedDest] = useState<ExploreDest | null>(null);

  const aiPicks = ALL_DESTINATIONS.filter((d) => d.matchScore >= 88).slice(0, 4);

  const filtered = ALL_DESTINATIONS.filter((d) => {
    const matchesSearch = d.name.toLowerCase().includes(search.toLowerCase()) ||
      d.country.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = activeCategory === 'All' || d.category.toLowerCase() === activeCategory.toLowerCase();
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="screen-container animate-slide-up px-4 pt-6 pb-20">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h1 className="text-2xl font-bold">Explore</h1>
          <p className="text-xs text-muted-foreground mt-0.5">Discover your next adventure</p>
        </div>
        <div className="w-10 h-10 rounded-full gradient-purple-soft flex items-center justify-center">
          <Sparkles className="w-5 h-5 text-purple-600" />
        </div>
      </div>

      {/* Search */}
      <div className="relative mb-5">
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
          <Badge variant="secondary" className="text-[10px] bg-purple-100 text-purple-600 rounded-full ml-auto">
            {aiPicks.length} destinations
          </Badge>
        </div>
        <div className="flex gap-3 overflow-x-auto no-scrollbar -mx-4 px-4 pb-2">
          {aiPicks.map((dest, i) => (
            <motion.button
              key={dest.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.1 }}
              onClick={() => setSelectedDest(dest)}
              className="min-w-[200px] shrink-0 rounded-2xl overflow-hidden glass-card-purple border border-purple-100/50 active:scale-[0.98] transition-transform"
            >
              <div className="relative h-28 overflow-hidden">
                <img src={dest.image} alt={dest.name} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                <div className="absolute top-2 right-2">
                  <Badge className="bg-purple-600/90 backdrop-blur-sm text-white text-[10px] px-2 py-0.5 rounded-full">
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

      {/* Results count */}
      <div className="flex items-center justify-between mb-3">
        <p className="text-xs text-muted-foreground">
          {filtered.length} destination{filtered.length !== 1 ? 's' : ''} found
        </p>
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
              onClick={() => setSelectedDest(dest)}
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
                {dest.matchScore >= 90 && (
                  <div className="absolute top-2 left-2">
                    <Badge className="bg-emerald-500/90 backdrop-blur-sm text-white text-[9px] px-1.5 py-0.5 rounded-full gap-0.5">
                      <Sparkles className="w-2.5 h-2.5" />
                      Top Pick
                    </Badge>
                  </div>
                )}
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

      {filtered.length === 0 && (
        <div className="text-center py-12">
          <Search className="w-12 h-12 text-purple-200 mx-auto mb-3" />
          <p className="text-sm font-medium text-muted-foreground">No destinations found</p>
          <p className="text-xs text-muted-foreground mt-1">Try adjusting your search or filters</p>
        </div>
      )}

      {/* Destination Detail Sheet */}
      <Sheet open={!!selectedDest} onOpenChange={(open) => !open && setSelectedDest(null)}>
        <SheetContent side="bottom" className="max-w-md mx-auto rounded-t-3xl p-0 h-[85vh] overflow-y-auto">
          {selectedDest && (
            <div className="relative">
              {/* Cover Image */}
              <div className="relative h-56 overflow-hidden">
                <img src={selectedDest.image} alt={selectedDest.name} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                <button
                  onClick={() => setSelectedDest(null)}
                  className="absolute top-4 right-4 w-8 h-8 rounded-full bg-black/30 backdrop-blur-sm flex items-center justify-center text-white"
                >
                  <X className="w-4 h-4" />
                </button>
                <div className="absolute bottom-4 left-4 right-4">
                  <h2 className="text-white text-2xl font-bold">{selectedDest.name}</h2>
                  <p className="text-white/80 text-sm">{selectedDest.country}</p>
                </div>
              </div>

              <div className="p-5 space-y-5">
                {/* Quick Stats */}
                <div className="flex gap-3">
                  {[
                    { icon: Star, label: 'Rating', value: selectedDest.rating.toString(), color: 'text-amber-500' },
                    { icon: DollarSign, label: 'Cost', value: selectedDest.cost, color: 'text-purple-600' },
                    { icon: Calendar, label: 'Best Time', value: selectedDest.bestTime, color: 'text-emerald-600' },
                  ].map((stat) => (
                    <div key={stat.label} className="flex-1 rounded-xl glass-card-purple p-3 text-center">
                      <stat.icon className={cn('w-4 h-4 mx-auto mb-1', stat.color)} />
                      <p className="text-xs font-bold truncate">{stat.value}</p>
                      <p className="text-[10px] text-muted-foreground">{stat.label}</p>
                    </div>
                  ))}
                </div>

                {/* Match Score */}
                <div className="rounded-xl gradient-purple-soft p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-semibold flex items-center gap-1.5">
                      <Sparkles className="w-4 h-4 text-purple-600" />
                      AI Match Score
                    </span>
                    <span className="text-lg font-bold text-purple-700">{selectedDest.matchScore}%</span>
                  </div>
                  <div className="h-2 bg-white/50 rounded-full overflow-hidden">
                    <motion.div
                      className="h-full gradient-purple rounded-full"
                      initial={{ width: 0 }}
                      animate={{ width: `${selectedDest.matchScore}%` }}
                      transition={{ duration: 0.8, ease: 'easeOut' }}
                    />
                  </div>
                </div>

                {/* Description */}
                <div>
                  <h3 className="text-sm font-semibold mb-2">About</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{selectedDest.description}</p>
                </div>

                {/* Highlights */}
                <div>
                  <h3 className="text-sm font-semibold mb-2">Highlights</h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedDest.highlights.map((h) => (
                      <span key={h} className="text-xs px-3 py-1.5 rounded-full bg-purple-50 text-purple-600 font-medium">
                        {h}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Action Button */}
                <Button className="w-full h-12 rounded-full gradient-purple text-white font-semibold shadow-lg shadow-purple-300/30 gap-2">
                  <MapPin className="w-4 h-4" />
                  Use for My Trip
                </Button>
              </div>
            </div>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
}