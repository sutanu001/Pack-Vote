import { create } from "zustand";
import type {
  Screen,
  Trip,
  Destination,
  TripMember,
  SurveyQuestion,
  ChatMessage,
  VoteEntry,
  ItineraryItem,
  NavigationState,
  User,
} from "./types";

// ============================================================
// Mock Data
// ============================================================

const MOCK_USER: User = {
  id: "user-1",
  name: "Alex Chen",
  email: "alex@packvote.com",
  avatar: undefined,
};

const MOCK_TRIPS: Trip[] = [
  {
    id: "trip-1",
    name: "Summer Beach Getaway",
    description: "A relaxing beach vacation with the squad",
    startDate: "2025-08-15",
    endDate: "2025-08-22",
    budget: "$800 - $1500",
    destinationType: "beach",
    status: "voting",
    coverImage: "/destinations/beach.jpg",
    inviteCode: "BEACH2025",
    createdAt: "2025-01-10T10:00:00Z",
    memberCount: 6,
    surveyCompleted: 5,
    totalMembers: 6,
  },
  {
    id: "trip-2",
    name: "Japan Adventure",
    description: "Explore the culture, food, and tech of Japan",
    startDate: "2025-10-01",
    endDate: "2025-10-14",
    budget: "$2000 - $3500",
    destinationType: "city",
    status: "surveying",
    coverImage: "/destinations/city.jpg",
    inviteCode: "JPNADV2025",
    createdAt: "2025-01-15T14:00:00Z",
    memberCount: 4,
    surveyCompleted: 2,
    totalMembers: 4,
  },
  {
    id: "trip-3",
    name: "Mountain Retreat",
    description: "Hiking and nature in the Swiss Alps",
    startDate: "2025-12-20",
    endDate: "2025-12-28",
    budget: "$1500 - $2500",
    destinationType: "mountain",
    status: "planning",
    coverImage: "/destinations/mountain.jpg",
    inviteCode: "MTNRET25",
    createdAt: "2025-01-20T09:00:00Z",
    memberCount: 3,
    surveyCompleted: 0,
    totalMembers: 3,
  },
];

const MOCK_DESTINATIONS: Destination[] = [
  {
    id: "dest-1",
    name: "Bali, Indonesia",
    country: "Indonesia",
    description:
      "Tropical paradise with stunning beaches, ancient temples, lush rice terraces, and vibrant nightlife. Perfect for groups seeking a mix of relaxation and adventure.",
    imageUrl: "/destinations/beach.jpg",
    highlights: ["Surfing at Uluwatu", "Rice terrace trekking", "Temple visits", "Beach clubs", "Snorkeling"],
    estimatedCost: "$900 - $1,400",
    bestTimeToVisit: "April - October",
    rating: 4.8,
    aiReasoning:
      "Bali perfectly matches your group's preference for beach destinations within the $800-1500 budget. All 5 survey respondents highlighted warm weather and beach activities as top priorities. The destination offers great group accommodation options and a vibrant social scene.",
    score: 0.95,
  },
  {
    id: "dest-2",
    name: "Phuket, Thailand",
    country: "Thailand",
    description:
      "Thailand's largest island offers crystal-clear waters, world-class diving, delicious street food, and bustling night markets. Ideal for budget-conscious groups.",
    imageUrl: "/destinations/coast.jpg",
    highlights: ["Phi Phi Islands", "Thai cooking class", "Night markets", "Scuba diving", "Temples"],
    estimatedCost: "$700 - $1,200",
    bestTimeToVisit: "November - April",
    rating: 4.6,
    aiReasoning:
      "Phuket is a strong match for your budget range and beach preferences. The cost of living is very favorable, stretching your budget further. Multiple survey respondents mentioned interest in local cuisine and cultural experiences.",
    score: 0.88,
  },
  {
    id: "dest-3",
    name: "Tulum, Mexico",
    country: "Mexico",
    description:
      "Bohemian beach town with Mayan ruins, cenotes, and Caribbean coastline. A perfect blend of culture, nature, and relaxation for groups.",
    imageUrl: "/destinations/adventure.jpg",
    highlights: ["Cenote swimming", "Mayan ruins", "Boutique hotels", "Yoga retreats", "Tacos & margaritas"],
    estimatedCost: "$1,000 - $1,600",
    bestTimeToVisit: "December - April",
    rating: 4.5,
    aiReasoning:
      "Tulum offers the unique combination of beach and cultural experiences your group is looking for. The cenotes provide adventure activities while the beaches offer relaxation. Fits your budget range well.",
    score: 0.82,
  },
  {
    id: "dest-4",
    name: "Zanzibar, Tanzania",
    country: "Tanzania",
    description:
      "Exotic island with pristine white-sand beaches, historic Stone Town, spice plantations, and some of the world's best diving spots.",
    imageUrl: "/destinations/beach.jpg",
    highlights: ["Spice tours", "Stone Town", "Snorkeling at Mnemba", "Sunset dhow cruise", "Jozani Forest"],
    estimatedCost: "$800 - $1,300",
    bestTimeToVisit: "June - October",
    rating: 4.4,
    aiReasoning:
      "Zanzibar offers a unique off-the-beaten-path beach experience. Great for groups looking for something different from typical tourist destinations. Rich cultural history and excellent value for money.",
    score: 0.76,
  },
];

const MOCK_MEMBERS: TripMember[] = [
  { id: "tm-1", userId: "user-1", userName: "Alex Chen", role: "creator", surveyCompleted: true, hasVoted: false },
  { id: "tm-2", userId: "user-2", userName: "Sarah Kim", role: "member", surveyCompleted: true, hasVoted: true },
  { id: "tm-3", userId: "user-3", userName: "Mike Johnson", role: "member", surveyCompleted: true, hasVoted: true },
  { id: "tm-4", userId: "user-4", userName: "Emma Wilson", role: "member", surveyCompleted: true, hasVoted: false },
  { id: "tm-5", userId: "user-5", userName: "David Lee", role: "member", surveyCompleted: true, hasVoted: true },
  { id: "tm-6", userId: "user-6", userName: "Lisa Wang", role: "member", surveyCompleted: false, hasVoted: false },
];

const MOCK_SURVEY_QUESTIONS: SurveyQuestion[] = [
  {
    id: "q1",
    question: "What type of destination do you prefer?",
    type: "single",
    options: ["Beach / Tropical", "Mountain / Nature", "City / Urban", "Adventure / Outdoors", "Cultural / Historical"],
    required: true,
  },
  {
    id: "q2",
    question: "What's your ideal budget per person?",
    type: "single",
    options: ["Under $500", "$500 - $1,000", "$1,000 - $2,000", "$2,000 - $3,000", "$3,000+"],
    required: true,
  },
  {
    id: "q3",
    question: "What activities interest you most? (Select all that apply)",
    type: "multi",
    options: ["Relaxation / Spa", "Water Sports", "Hiking / Trekking", "Sightseeing", "Food & Dining", "Nightlife", "Shopping", "Photography"],
    required: true,
  },
  {
    id: "q4",
    question: "How important is budget-friendliness?",
    type: "slider",
    min: 1,
    max: 5,
    required: true,
  },
  {
    id: "q5",
    question: "What's your preferred travel pace?",
    type: "single",
    options: ["Relaxed & Chill", "Moderate Mix", "Action-Packed"],
    required: true,
  },
  {
    id: "q6",
    question: "Any specific requirements or preferences?",
    type: "text",
    required: false,
  },
];

const MOCK_CHAT_MESSAGES: ChatMessage[] = [
  {
    id: "msg-1",
    content: "Hey PackBot! We're planning a beach trip for 6 people in August. What do you suggest?",
    role: "user",
    createdAt: "2025-01-15T10:00:00Z",
    userName: "Alex Chen",
  },
  {
    id: "msg-2",
    content:
      "Based on your group's preferences for a beach getaway in August with a budget of $800-1500 per person, I'd recommend considering **Bali, Indonesia** as your top choice! Here's why:\n\n🏖️ **Perfect weather** - August is dry season in Bali\n💰 **Budget-friendly** - Great value for accommodation and activities\n Islanders **Group activities** - Surfing lessons, temple visits, rice terraces\n🍽️ **Food scene** - Amazing local cuisine at affordable prices\n\nWould you like me to suggest a 7-day itinerary?",
    role: "assistant",
    createdAt: "2025-01-15T10:00:05Z",
  },
  {
    id: "msg-3",
    content: "Yes! Can you also compare it with Phuket?",
    role: "user",
    createdAt: "2025-01-15T10:01:00Z",
    userName: "Alex Chen",
  },
  {
    id: "msg-4",
    content:
      "Great question! Here's a quick comparison:\n\n| | **Bali** | **Phuket** |\n|---|---|---|\n| **Cost** | $900-1,400 | $700-1,200 |\n| **Weather (Aug)** | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ |\n| **Beaches** | ⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ |\n| **Culture** | ⭐⭐⭐⭐⭐ | ⭐⭐⭐ |\n| **Nightlife** | ⭐⭐⭐ | ⭐⭐⭐⭐⭐ |\n| **Food** | ⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ |\n\nPhuket is slightly cheaper and has better beaches, but Bali wins on culture and August weather. Both are excellent choices!",
    role: "assistant",
    createdAt: "2025-01-15T10:01:05Z",
  },
];

const MOCK_ITINERARY: ItineraryItem[] = [
  { id: "it-1", title: "Arrive in Bali", description: "Airport pickup, check into villa", day: 1, time: "14:00", location: "Ngurah Rai Airport", category: "transport", isCompleted: false },
  { id: "it-2", title: "Villa Check-in & Welcome Dinner", description: "Settle in, group dinner at local Warung", day: 1, time: "19:00", location: "Seminyak", category: "food", isCompleted: false },
  { id: "it-3", title: "Surf Lesson at Kuta Beach", description: "Group surf lesson with instructor", day: 2, time: "08:00", location: "Kuta Beach", category: "activity", isCompleted: false },
  { id: "it-4", title: "Tanah Lot Temple Sunset", description: "Visit the iconic sea temple", day: 2, time: "16:00", location: "Tabanan", category: "activity", isCompleted: false },
  { id: "it-5", title: "Ubud Rice Terraces Trek", description: "Tegallalang rice terrace guided walk", day: 3, time: "07:00", location: "Ubud", category: "activity", isCompleted: false },
  { id: "it-6", title: "Monkey Forest & Art Market", description: "Explore sacred monkey forest and shop", day: 3, time: "14:00", location: "Ubud", category: "activity", isCompleted: false },
  { id: "it-7", title: "Nusa Penida Day Trip", description: "Speedboat to Nusa Penida, Kelingking Beach", day: 4, time: "07:00", location: "Nusa Penida", category: "activity", isCompleted: false },
  { id: "it-8", title: "Beach Club Day", description: "Relax at Potato Head or Finns", day: 5, time: "11:00", location: "Seminyak", category: "activity", isCompleted: false },
  { id: "it-9", title: "Cooking Class", description: "Balinese cooking class with market tour", day: 6, time: "09:00", location: "Ubud", category: "food", isCompleted: false },
  { id: "it-10", title: "Departure", description: "Final breakfast and airport transfer", day: 7, time: "10:00", location: "Bali", category: "transport", isCompleted: false },
];

// ============================================================
// Store Definition
// ============================================================

interface AppState {
  // User
  currentUser: User;

  // Navigation
  nav: NavigationState;
  navigate: (screen: Screen, params?: Record<string, unknown>) => void;
  goBack: () => void;

  // Trips
  trips: Trip[];
  currentTrip: Trip | null;
  addTrip: (trip: Trip) => void;
  updateTrip: (id: string, updates: Partial<Trip>) => void;
  setCurrentTrip: (id: string | null) => void;

  // Destinations
  destinations: Destination[];
  setDestinations: (destinations: Destination[]) => void;

  // Members
  members: TripMember[];
  setMembers: (members: TripMember[]) => void;

  // Survey
  surveyQuestions: SurveyQuestion[];
  surveyResponses: Record<string, string | string[] | number>;
  setSurveyResponse: (questionId: string, answer: string | string[] | number) => void;
  submitSurvey: () => void;

  // Voting
  votes: VoteEntry[];
  setVote: (destinationId: string, rank: number) => void;
  submitVotes: () => void;
  votingCompleted: boolean;

  // Chat
  chatMessages: ChatMessage[];
  addChatMessage: (message: ChatMessage) => void;
  isChatLoading: boolean;
  setChatLoading: (loading: boolean) => void;

  // Itinerary
  itinerary: ItineraryItem[];
  toggleItineraryItem: (id: string) => void;
  setItinerary: (items: ItineraryItem[]) => void;

  // Create trip form
  createTripForm: {
    name: string;
    description: string;
    startDate: string;
    endDate: string;
    budget: string;
    destinationType: string;
    participantNames: string;
  };
  setCreateTripForm: (form: Partial<AppState["createTripForm"]>) => void;

  // Notifications
  notificationCount: number;
}

export const useAppStore = create<AppState>((set, get) => ({
  // User
  currentUser: MOCK_USER,

  // Navigation
  nav: { currentScreen: "home", previousScreen: null, tripId: null, screenParams: {} },
  navigate: (screen, params = {}) =>
    set((state) => ({
      nav: {
        currentScreen: screen,
        previousScreen: state.nav.currentScreen,
        tripId: params.tripId ?? state.nav.tripId,
        screenParams: params,
      },
    })),
  goBack: () =>
    set((state) => ({
      nav: {
        ...state.nav,
        currentScreen: state.nav.previousScreen ?? "home",
        previousScreen: null,
      },
    })),

  // Trips
  trips: MOCK_TRIPS,
  currentTrip: null,
  addTrip: (trip) => set((state) => ({ trips: [trip, ...state.trips] })),
  updateTrip: (id, updates) =>
    set((state) => ({
      trips: state.trips.map((t) => (t.id === id ? { ...t, ...updates } : t)),
      currentTrip: state.currentTrip?.id === id ? { ...state.currentTrip, ...updates } : state.currentTrip,
    })),
  setCurrentTrip: (id) =>
    set((state) => ({
      currentTrip: id ? state.trips.find((t) => t.id === id) ?? null : null,
      members: id ? MOCK_MEMBERS : [],
      destinations: id ? MOCK_DESTINATIONS : [],
      votes: [],
      itinerary: id ? MOCK_ITINERARY : [],
      surveyResponses: {},
      chatMessages: MOCK_CHAT_MESSAGES,
    })),

  // Destinations
  destinations: [],
  setDestinations: (destinations) => set({ destinations }),

  // Members
  members: [],
  setMembers: (members) => set({ members }),

  // Survey
  surveyQuestions: MOCK_SURVEY_QUESTIONS,
  surveyResponses: {},
  setSurveyResponse: (questionId, answer) =>
    set((state) => ({
      surveyResponses: { ...state.surveyResponses, [questionId]: answer },
    })),
  submitSurvey: () =>
    set((state) => {
      const tripId = state.nav.tripId;
      if (!tripId) return state;
      return {
        trips: state.trips.map((t) =>
          t.id === tripId ? { ...t, surveyCompleted: t.surveyCompleted + 1 } : t
        ),
        currentTrip: state.currentTrip
          ? { ...state.currentTrip, surveyCompleted: state.currentTrip.surveyCompleted + 1 }
          : null,
      };
    }),

  // Voting
  votes: [],
  setVote: (destinationId, rank) =>
    set((state) => {
      const newVotes = state.votes.filter((v) => v.destinationId !== destinationId);
      newVotes.push({ destinationId, rank });
      newVotes.sort((a, b) => a.rank - b.rank);
      return { votes: newVotes };
    }),
  submitVotes: () => set({ votingCompleted: true }),
  votingCompleted: false,

  // Chat
  chatMessages: [],
  addChatMessage: (message) =>
    set((state) => ({ chatMessages: [...state.chatMessages, message] })),
  isChatLoading: false,
  setChatLoading: (loading) => set({ isChatLoading: loading }),

  // Itinerary
  itinerary: [],
  toggleItineraryItem: (id) =>
    set((state) => ({
      itinerary: state.itinerary.map((item) =>
        item.id === id ? { ...item, isCompleted: !item.isCompleted } : item
      ),
    })),
  setItinerary: (items) => set({ itinerary: items }),

  // Create trip form
  createTripForm: {
    name: "",
    description: "",
    startDate: "",
    endDate: "",
    budget: "",
    destinationType: "",
    participantNames: "",
  },
  setCreateTripForm: (form) =>
    set((state) => ({
      createTripForm: { ...state.createTripForm, ...form },
    })),

  // Notifications
  notificationCount: 3,
}));