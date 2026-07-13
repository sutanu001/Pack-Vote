// ============================================================
// Pack Vote - Type Definitions
// ============================================================

export type Screen =
  | "home"
  | "explore"
  | "create-trip"
  | "trip-detail"
  | "voting"
  | "results"
  | "survey"
  | "chat"
  | "profile"
  | "itinerary";

export type TripStatus =
  | "planning"
  | "surveying"
  | "voting"
  | "confirmed"
  | "completed";

export type DestinationCategory =
  | "beach"
  | "mountain"
  | "city"
  | "adventure"
  | "cultural"
  | "nature";

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  phone?: string;
}

export interface Trip {
  id: string;
  name: string;
  description?: string;
  startDate?: string;
  endDate?: string;
  budget?: string;
  destinationType?: string;
  status: TripStatus;
  coverImage?: string;
  inviteCode: string;
  createdAt: string;
  memberCount: number;
  surveyCompleted: number;
  totalMembers: number;
  destinations?: Destination[];
  members?: TripMember[];
}

export interface TripMember {
  id: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  role: "creator" | "member";
  surveyCompleted: boolean;
  hasVoted: boolean;
}

export interface Destination {
  id: string;
  name: string;
  country: string;
  description: string;
  imageUrl: string;
  highlights: string[];
  estimatedCost: string;
  bestTimeToVisit: string;
  rating: number;
  aiReasoning: string;
  score: number;
  rank?: number;
}

export interface SurveyQuestion {
  id: string;
  question: string;
  type: "single" | "multi" | "slider" | "text";
  options?: string[];
  min?: number;
  max?: number;
  required: boolean;
}

export interface SurveyResponse {
  questionId: string;
  answer: string | string[] | number;
}

export interface VoteEntry {
  destinationId: string;
  rank: number; // 1 = first choice
}

export interface ChatMessage {
  id: string;
  content: string;
  role: "user" | "assistant";
  createdAt: string;
  userName?: string;
}

export interface ItineraryItem {
  id: string;
  title: string;
  description?: string;
  day: number;
  time?: string;
  location?: string;
  category: "activity" | "food" | "transport" | "accommodation";
  isCompleted: boolean;
}

export interface AIModelConfig {
  provider: string;
  model: string;
  promptVersion: string;
  costPerToken: number;
}

// Screen navigation state
export interface NavigationState {
  currentScreen: Screen;
  previousScreen: Screen | null;
  tripId: string | null;
  screenParams: Record<string, unknown>;
}