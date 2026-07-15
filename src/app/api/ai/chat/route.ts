import { NextRequest, NextResponse } from "next/server";

// ============================================================
// Smart Local AI Response Engine for PackBot
// Uses intent detection + trip context to generate rich responses
// No external API dependency required
// ============================================================

interface TripContext {
  name: string;
  description: string;
  dates: string;
  budget: string;
  destinationType: string;
  status: string;
  members: { name: string; role: string; surveyDone: boolean; hasVoted: boolean }[];
  destinations: {
    name: string;
    country: string;
    cost: string;
    score: number;
    rating: number;
    highlights: string[];
    bestTime: string;
    aiReasoning: string;
  }[];
  itinerary: { day: number; title: string; time: string; location: string; category: string }[];
}

// ---- Mock Trip Context Maps ----

const TRIP_CONTEXTS: Record<string, TripContext> = {
  "trip-1": {
    name: "Summer Beach Getaway",
    description: "A relaxing beach vacation with the squad",
    dates: "Aug 15 – Aug 22, 2025",
    budget: "$800 – $1,500 per person",
    destinationType: "beach",
    status: "voting",
    members: [
      { name: "Alex Chen", role: "creator", surveyDone: true, hasVoted: false },
      { name: "Sarah Kim", role: "member", surveyDone: true, hasVoted: true },
      { name: "Mike Johnson", role: "member", surveyDone: true, hasVoted: true },
      { name: "Emma Wilson", role: "member", surveyDone: true, hasVoted: false },
      { name: "David Lee", role: "member", surveyDone: true, hasVoted: true },
      { name: "Lisa Wang", role: "member", surveyDone: false, hasVoted: false },
    ],
    destinations: [
      {
        name: "Bali",
        country: "Indonesia",
        cost: "$900 – $1,400",
        score: 0.95,
        rating: 4.8,
        highlights: ["Surfing at Uluwatu", "Rice terrace trekking", "Temple visits", "Beach clubs", "Snorkeling"],
        bestTime: "April – October",
        aiReasoning: "Best match for beach + budget. Dry season in August. Excellent group villa options.",
      },
      {
        name: "Phuket",
        country: "Thailand",
        cost: "$700 – $1,200",
        score: 0.88,
        rating: 4.6,
        highlights: ["Phi Phi Islands", "Thai cooking class", "Night markets", "Scuba diving", "Temples"],
        bestTime: "November – April",
        aiReasoning: "Cheapest option. Best beaches & nightlife. August is monsoon season though.",
      },
      {
        name: "Tulum",
        country: "Mexico",
        cost: "$1,000 – $1,600",
        score: 0.82,
        rating: 4.5,
        highlights: ["Cenote swimming", "Mayan ruins", "Boutique hotels", "Yoga retreats", "Tacos & margaritas"],
        bestTime: "December – April",
        aiReasoning: "Great culture + beach combo. August is hot & humid with hurricane risk.",
      },
      {
        name: "Zanzibar",
        country: "Tanzania",
        cost: "$800 – $1,300",
        score: 0.76,
        rating: 4.4,
        highlights: ["Spice tours", "Stone Town", "Snorkeling at Mnemba", "Sunset dhow cruise", "Jozani Forest"],
        bestTime: "June – October",
        aiReasoning: "Unique off-the-beaten-path option. Great August weather. Rich cultural history.",
      },
    ],
    itinerary: [
      { day: 1, title: "Arrive in Bali", time: "14:00", location: "Ngurah Rai Airport", category: "transport" },
      { day: 1, title: "Welcome Dinner", time: "19:00", location: "Seminyak", category: "food" },
      { day: 2, title: "Surf Lesson at Kuta", time: "08:00", location: "Kuta Beach", category: "activity" },
      { day: 2, title: "Tanah Lot Sunset", time: "16:00", location: "Tabanan", category: "activity" },
      { day: 3, title: "Ubud Rice Terraces", time: "07:00", location: "Ubud", category: "activity" },
      { day: 3, title: "Monkey Forest & Art Market", time: "14:00", location: "Ubud", category: "activity" },
      { day: 4, title: "Nusa Penida Day Trip", time: "07:00", location: "Nusa Penida", category: "activity" },
      { day: 5, title: "Beach Club Day", time: "11:00", location: "Seminyak", category: "activity" },
      { day: 6, title: "Cooking Class", time: "09:00", location: "Ubud", category: "food" },
      { day: 7, title: "Departure", time: "10:00", location: "Bali", category: "transport" },
    ],
  },
  "trip-2": {
    name: "Japan Adventure",
    description: "Explore the culture, food, and tech of Japan",
    dates: "Oct 1 – Oct 14, 2025",
    budget: "$2,000 – $3,500 per person",
    destinationType: "city",
    status: "surveying",
    members: [
      { name: "Alex Chen", role: "creator", surveyDone: true, hasVoted: false },
      { name: "Sarah Kim", role: "member", surveyDone: true, hasVoted: false },
      { name: "Mike Johnson", role: "member", surveyDone: false, hasVoted: false },
      { name: "Emma Wilson", role: "member", surveyDone: false, hasVoted: false },
    ],
    destinations: [],
    itinerary: [],
  },
  "trip-3": {
    name: "Mountain Retreat",
    description: "Hiking and nature in the Swiss Alps",
    dates: "Dec 20 – Dec 28, 2025",
    budget: "$1,500 – $2,500 per person",
    destinationType: "mountain",
    status: "planning",
    members: [
      { name: "Alex Chen", role: "creator", surveyDone: false, hasVoted: false },
      { name: "Sarah Kim", role: "member", surveyDone: false, hasVoted: false },
      { name: "Mike Johnson", role: "member", surveyDone: false, hasVoted: false },
    ],
    destinations: [],
    itinerary: [],
  },
};

// ---- Mistral AI Integration ----

export async function POST(req: NextRequest) {
  try {
    const { message, tripId, history } = await req.json();

    if (!message) {
      return NextResponse.json({ error: "Message is required" }, { status: 400 });
    }

    const ctx = tripId ? TRIP_CONTEXTS[tripId] || null : null;

    let systemPrompt = `You are PackBot, an AI travel planning co-pilot and buddy for the app Pack Vote.
You should act like a warm, engaging, and highly intelligent human friend who is helping a group plan their perfect trip.
Use emojis naturally, be conversational, and be extremely helpful.
You can format your responses using markdown for readability (bullet points, bold text, etc).
Always keep your answers concise unless a detailed itinerary or comparison is explicitly requested.

`;

    if (ctx) {
      systemPrompt += `Here is the context of the trip they are currently viewing:
Trip Name: ${ctx.name}
Description: ${ctx.description}
Dates: ${ctx.dates}
Budget: ${ctx.budget}
Destination Type: ${ctx.destinationType}
Trip Status: ${ctx.status}

Members:
${ctx.members.map((m: any) => `- ${m.name} (${m.role}): Survey Done? ${m.surveyDone ? 'Yes' : 'No'}, Voted? ${m.hasVoted ? 'Yes' : 'No'}`).join('\n')}

Destinations Proposed:
${ctx.destinations.length > 0 ? ctx.destinations.map((d: any) => `- ${d.name}, ${d.country} (Cost: ${d.cost}, Match Score: ${Math.round(d.score * 100)}%, Highlights: ${d.highlights.join(', ')})`).join('\n') : "None yet."}

Itinerary Items:
${ctx.itinerary.length > 0 ? ctx.itinerary.map((i: any) => `Day ${i.day}: ${i.time} - ${i.title} at ${i.location}`).join('\n') : "None yet."}

Please use this context to answer their questions intelligently and helpfully. Do not expose this raw structured data directly, but weave it into your natural conversation.`;
    } else {
      systemPrompt += `Currently, the user has not opened a specific trip. Ask them to open a trip from the Home screen if they want trip-specific advice!`;
    }

    const apiKey = process.env.MISTRAL_API_KEY;
    if (!apiKey) {
      throw new Error("MISTRAL_API_KEY is not set in environment variables.");
    }

    const messages = [{ role: "system", content: systemPrompt }];
    
    if (history && Array.isArray(history)) {
      messages.push(...history);
    }
    
    messages.push({ role: "user", content: message });

    const response = await fetch("https://api.mistral.ai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: "mistral-small-latest",
        messages: messages,
      })
    });

    if (!response.ok) {
      const errText = await response.text();
      console.error("Mistral API Error:", errText);
      throw new Error(`Mistral API Error: ${response.status}`);
    }

    const data = await response.json();
    const reply = data.choices[0].message.content;

    return NextResponse.json({
      reply,
      model: "mistral-small-latest",
      provider: "mistral",
      intent: "general",
    });
  } catch (error) {
    console.error("PackBot AI Chat error:", error);
    return NextResponse.json(
      { reply: "Oops, I'm having trouble connecting right now. Please try again! 🙏", error: String(error) },
      { status: 500 }
    );
  }
}
