# Pack Vote ✈️

> **An AI-powered group travel planning application designed to make coordinating trips with friends effortless and fun.**



Planning group travel often devolves into chaotic group chats, lost links, and endless arguments over budgets and destinations. **Pack Vote** solves this by providing a centralized, mobile-first web application where groups can propose ideas, collect preferences, and democratically decide on their next adventure—all guided by an intelligent AI travel buddy.

---

## ✨ Core Features & User Flow

### 1. 📊 Smart Group Surveys
Before choosing a destination, it's critical to know everyone's constraints. Pack Vote allows the trip creator to send out surveys to collect:
- Budget constraints (e.g., "$800 - $1500")
- Travel date availability
- Preferred destination types (Beach, Mountain, City, Adventure)
- Specific highlights (Nightlife, History, Relaxation)

### 2. 🤖 AI Travel Buddy (Powered by Mistral AI)
Instead of manually researching locations that fit everyone's criteria, our integrated **Mistral AI assistant** analyzes the survey data and does the heavy lifting:
- **Tailored Recommendations:** Generates destination options complete with cost estimates, best times to visit, and a calculated "Match Score" based on group preferences.
- **Context-Aware Chat:** A conversational UI where users can ask the AI questions like *"Can you give me a budget breakdown?"* or *"Which destination has the best weather in August?"* The AI responds dynamically using the specific context of your trip.

### 3. 🗳️ Rank-Choice Voting
Once destinations are proposed, the group votes using an intuitive drag-and-drop interface. 
- **Fair Decisions:** Rank-choice voting ensures the destination with the broadest appeal wins, even if it wasn't everyone's #1 choice.
- **Real-time Status:** Track who has voted and who still needs a nudge.

### 4. 🗺️ Interactive Itineraries
After a destination is confirmed, the app generates a day-by-day itinerary template that the group can modify, ensuring everyone knows the plan.

---


## 🛠️ Technical Architecture

This project was built to demonstrate proficiency in modern, full-stack React development, focusing on type safety, performance, and beautiful UI/UX.

### Frontend
- **Framework:** [Next.js 16](https://nextjs.org/) (App Router) & [React 19](https://react.dev/)
- **Language:** TypeScript for end-to-end type safety.
- **Styling:** [Tailwind CSS v4](https://tailwindcss.com/) combined with [shadcn/ui](https://ui.shadcn.com/) components.
- **Animations:** [Framer Motion](https://www.framer.com/motion/) is used extensively for layout transitions, staggered list appearances, and micro-interactions.
- **State Management:** [Zustand](https://github.com/pmndrs/zustand) for lightweight, predictable global state.
- **Drag & Drop:** `dnd-kit` for the complex rank-choice voting interactions.

### Backend & Data
- **API Routes:** Next.js Serverless Route Handlers (`/api/ai/chat`).
- **Database:** SQLite (dev) designed to scale to PostgreSQL in production.
- **ORM:** [Prisma](https://www.prisma.io/) handles database modeling and migrations.
- **AI Integration:** [Mistral AI API](https://mistral.ai/) (`mistral-small-latest`) invoked securely on the backend, utilizing custom system prompts injected with live application state.

---

## 📂 Project Structure

\`\`\`text
pack-vote/
├── prisma/                 # Database schema and migrations
│   └── schema.prisma       # 8 relational models defining the business logic
├── public/                 # Static assets and AI-generated destination images
├── src/
│   ├── app/                # Next.js App Router pages and API routes
│   │   ├── api/ai/chat/    # Mistral AI backend integration
│   │   └── page.tsx        # Main application shell with AnimatePresence
│   ├── components/         # Reusable UI components
│   │   ├── packvote/       # Feature-specific components (Screens, BottomNav)
│   │   └── ui/             # shadcn/ui generic primitives
│   ├── hooks/              # Custom React hooks
│   └── lib/                # Utility functions, Zustand store, and types
└── tailwind.config.ts      # Custom glassmorphism utilities & animations
\`\`\`

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18+)
- `bun` (recommended) or `npm`

### Installation

1. **Clone the repository**
   \`\`\`bash
   git clone https://github.com/yourusername/pack-vote.git
   cd pack-vote
   \`\`\`

2. **Install dependencies**
   \`\`\`bash
   bun install
   \`\`\`

3. **Set up the database**
   \`\`\`bash
   npx prisma db push
   npx prisma generate
   \`\`\`

4. **Configure Environment Variables**
   Create a \`.env\` file in the root directory and add your Mistral API key (required for the AI Chat feature):
   \`\`\`env
   DATABASE_URL=file:./db/custom.db
   MISTRAL_API_KEY=your_mistral_api_key_here
   \`\`\`

5. **Start the development server**
   \`\`\`bash
   bun run dev
   \`\`\`

6. Open [http://localhost:3000](http://localhost:3000) in your browser to see the application!

---

## 🧠 Lessons Learned & Challenges

- **Managing Complex State:** Orchestrating the state of a trip across 5 distinct phases (planning → surveying → recommending → voting → confirmed) required careful Zustand store design to ensure UI components reacted predictably to phase changes.
- **Prompt Engineering:** Injecting the relational trip data (members, survey status, budget) into the Mistral system prompt required converting JSON arrays into natural language readable formats so the AI could respond organically.
- **Mobile-First UX:** Emulating a native app feel on the web involved utilizing a strict `max-w-md` layout container, custom scrollbars, and Bottom Sheet dialogs (`vaul`) instead of traditional modals.

## 🔮 Future Roadmap

- [ ] **Authentication:** Wire up NextAuth.js for persistent user sessions.
- [ ] **WebSockets:** Implement real-time collaboration so votes and chat messages appear instantly for all users.
- [ ] **SMS Integration:** Use Twilio to send automated survey links and vote nudges directly to users' phones.
- [ ] **PWA Support:** Add service workers and a web app manifest for offline capabilities and home-screen installation.

---
*Designed and built with ❤️ by [Your Name]*
