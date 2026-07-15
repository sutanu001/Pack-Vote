"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  Palmtree,
  Mountain,
  Building2,
  Compass,
  Landmark,
  Leaf,
  Users,
  Plus,
  Link2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { useAppStore } from "@/lib/store";

const generateInviteCode = () =>
  Math.random().toString(36).substring(2, 8).toUpperCase();

const DESTINATION_CATEGORIES = [
  { id: "beach", label: "Beach", icon: Palmtree, gradient: "from-cyan-400 to-blue-500" },
  { id: "mountain", label: "Mountain", icon: Mountain, gradient: "from-emerald-400 to-green-600" },
  { id: "city", label: "City", icon: Building2, gradient: "from-violet-400 to-purple-600" },
  { id: "adventure", label: "Adventure", icon: Compass, gradient: "from-orange-400 to-red-500" },
  { id: "cultural", label: "Cultural", icon: Landmark, gradient: "from-amber-400 to-yellow-600" },
  { id: "nature", label: "Nature", icon: Leaf, gradient: "from-lime-400 to-emerald-600" },
];

const BUDGET_OPTIONS = [
  { label: "Under $500", value: "Under $500" },
  { label: "$500 - $1,000", value: "$500 - $1,000" },
  { label: "$1,000 - $2,000", value: "$1,000 - $2,000" },
  { label: "$2,000 - $3,000", value: "$2,000 - $3,000" },
  { label: "$3,000+", value: "$3,000+" },
];

const STEP_TITLES = ["Trip Basics", "When & Budget", "Add Participants"];

export default function CreateTripScreen() {
  const [step, setStep] = useState(1);
  const [participantInput, setParticipantInput] = useState("");
  const [participants, setParticipants] = useState<string[]>([]);
  const [generatedInvite, setGeneratedInvite] = useState<{ code: string; link: string } | null>(null);

  const { createTripForm, setCreateTripForm, addTrip, navigate, goBack } =
    useAppStore();

  const totalSteps = 3;

  const goNext = () => {
    if (step < totalSteps) {
      setStep(step + 1);
    } else {
      handleSubmit();
    }
  };

  const goPrev = () => {
    if (step > 1) {
      setStep(step - 1);
    } else {
      goBack();
    }
  };

  const addParticipant = () => {
    const name = participantInput.trim();
    if (name && !participants.includes(name)) {
      setParticipants([...participants, name]);
      setParticipantInput("");
    }
  };

  const removeParticipant = (name: string) => {
    setParticipants(participants.filter((p) => p !== name));
  };

  const getInitials = (name: string) =>
    name
      .split(" ")
      .map((w) => w[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);

  const handleSubmit = () => {
    const inviteCode = generateInviteCode();
    const tripId = `trip-${Date.now()}`;

    const trip = {
      id: tripId,
      name: createTripForm.name || "Untitled Trip",
      description: createTripForm.description || undefined,
      startDate: createTripForm.startDate || undefined,
      endDate: createTripForm.endDate || undefined,
      budget: createTripForm.budget || undefined,
      destinationType: createTripForm.destinationType || undefined,
      status: "planning" as const,
      inviteCode,
      createdAt: new Date().toISOString(),
      memberCount: participants.length + 1,
      surveyCompleted: 0,
      totalMembers: participants.length + 1,
    };

    addTrip(trip);
    toast.success('Trip created!', {
      description: `"${trip.name}" — share code: ${inviteCode}`,
    });
    navigate("trip-detail", { tripId });
  };

  const canContinue = () => {
    if (step === 1) return createTripForm.name.trim() !== "" && createTripForm.destinationType !== "";
    if (step === 2) return true;
    return true;
  };

  return (
    <div className="screen-container animate-slide-up px-4 pb-28">
      {/* Header */}
      <div className="flex items-center gap-3 pt-4 pb-2">
        <Button
          variant="ghost"
          size="icon"
          className="rounded-full h-10 w-10"
          onClick={goPrev}
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h1 className="text-lg font-bold flex-1">Create Trip</h1>
      </div>

      {/* Step Indicator */}
      <div className="flex items-center justify-center gap-2 py-4">
        {Array.from({ length: totalSteps }).map((_, i) => (
          <div key={i} className="flex items-center gap-2">
            <div
              className={cn(
                "h-2.5 rounded-full transition-all duration-300",
                i + 1 <= step
                  ? "w-8 gradient-purple"
                  : "w-2.5 bg-purple-200"
              )}
            />
            {i < totalSteps - 1 && (
              <div
                className={cn(
                  "h-0.5 w-6 rounded-full transition-all duration-300",
                  i + 1 < step ? "bg-purple-500" : "bg-purple-200"
                )}
              />
            )}
          </div>
        ))}
        <span className="text-xs text-muted-foreground ml-3 font-medium">
          {step}/{totalSteps}
        </span>
      </div>

      {/* Step Title */}
      <motion.h2
        key={`title-${step}`}
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-2xl font-bold mb-6"
      >
        {STEP_TITLES[step - 1]}
      </motion.h2>

      {/* Step Content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={step}
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -30 }}
          transition={{ duration: 0.25 }}
        >
          {/* Step 1: Trip Basics */}
          {step === 1 && (
            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-muted-foreground">
                  Trip Name
                </label>
                <Input
                  placeholder="e.g., Summer Beach Getaway"
                  value={createTripForm.name}
                  onChange={(e) =>
                    setCreateTripForm({ name: e.target.value })
                  }
                  className="rounded-xl h-12 bg-white border-purple-200 focus:border-purple-500"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-muted-foreground">
                  Description
                </label>
                <Textarea
                  placeholder="What's this trip about?"
                  value={createTripForm.description}
                  onChange={(e) =>
                    setCreateTripForm({ description: e.target.value })
                  }
                  className="rounded-xl min-h-[100px] bg-white border-purple-200 focus:border-purple-500 resize-none"
                />
              </div>

              <div className="space-y-3">
                <label className="text-sm font-medium text-muted-foreground">
                  Destination Type
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {DESTINATION_CATEGORIES.map((cat) => {
                    const Icon = cat.icon;
                    const isSelected =
                      createTripForm.destinationType === cat.id;
                    return (
                      <motion.button
                        key={cat.id}
                        whileTap={{ scale: 0.95 }}
                        onClick={() =>
                          setCreateTripForm({ destinationType: cat.id })
                        }
                        className={cn(
                          "relative overflow-hidden rounded-2xl p-4 flex flex-col items-center gap-2 transition-all border-2",
                          isSelected
                            ? "border-purple-500 shadow-lg shadow-purple-200"
                            : "border-transparent glass-card"
                        )}
                      >
                        <div
                          className={cn(
                            "w-12 h-12 rounded-xl flex items-center justify-center bg-gradient-to-br text-white",
                            cat.gradient
                          )}
                        >
                          <Icon className="h-6 w-6" />
                        </div>
                        <span className="text-sm font-semibold">{cat.label}</span>
                        {isSelected && (
                          <motion.div
                            layoutId="category-select"
                            className="absolute inset-0 bg-purple-500/10 rounded-2xl"
                            transition={{
                              type: "spring",
                              bounce: 0.2,
                              duration: 0.4,
                            }}
                          />
                        )}
                      </motion.button>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* Step 2: When & Budget */}
          {step === 2 && (
            <div className="space-y-6">
              <div className="space-y-3">
                <label className="text-sm font-medium text-muted-foreground">
                  Travel Dates
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <span className="text-xs text-muted-foreground">
                      Start Date
                    </span>
                    <Input
                      type="date"
                      value={createTripForm.startDate}
                      onChange={(e) =>
                        setCreateTripForm({ startDate: e.target.value })
                      }
                      className="rounded-xl h-12 bg-white border-purple-200 focus:border-purple-500"
                    />
                  </div>
                  <div className="space-y-1">
                    <span className="text-xs text-muted-foreground">
                      End Date
                    </span>
                    <Input
                      type="date"
                      value={createTripForm.endDate}
                      onChange={(e) =>
                        setCreateTripForm({ endDate: e.target.value })
                      }
                      className="rounded-xl h-12 bg-white border-purple-200 focus:border-purple-500"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <label className="text-sm font-medium text-muted-foreground">
                  Budget Per Person
                </label>
                <div className="space-y-2">
                  {BUDGET_OPTIONS.map((opt) => {
                    const isSelected =
                      createTripForm.budget === opt.value;
                    return (
                      <motion.button
                        key={opt.value}
                        whileTap={{ scale: 0.98 }}
                        onClick={() =>
                          setCreateTripForm({ budget: opt.value })
                        }
                        className={cn(
                          "w-full rounded-2xl px-4 py-3.5 text-left text-sm font-medium transition-all border-2",
                          isSelected
                            ? "gradient-purple text-white border-purple-500 shadow-lg shadow-purple-200"
                            : "glass-card border-transparent text-foreground hover:border-purple-200"
                        )}
                      >
                        {opt.label}
                      </motion.button>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Participants */}
          {step === 3 && (
            <div className="space-y-6">
              <div className="space-y-3">
                <label className="text-sm font-medium text-muted-foreground">
                  Add Travel Buddies
                </label>
                <div className="flex gap-2">
                  <Input
                    placeholder="Enter a name..."
                    value={participantInput}
                    onChange={(e) => setParticipantInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        addParticipant();
                      }
                    }}
                    className="rounded-xl h-12 bg-white border-purple-200 focus:border-purple-500 flex-1"
                  />
                  <Button
                    onClick={addParticipant}
                    className="rounded-full h-12 w-12 p-0 gradient-purple text-white shadow-lg shadow-purple-200 shrink-0"
                  >
                    <Plus className="h-5 w-5" />
                  </Button>
                </div>
              </div>

              {/* Creator */}
              <div className="flex items-center gap-3 glass-card-purple rounded-2xl p-3">
                <div className="w-10 h-10 rounded-full gradient-purple flex items-center justify-center text-white text-sm font-bold shrink-0">
                  Y
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold truncate">You (Creator)</p>
                  <p className="text-xs text-muted-foreground">Organizer</p>
                </div>
                <span className="text-xs font-medium text-purple-600 bg-purple-100 px-2 py-1 rounded-full">
                  Owner
                </span>
              </div>

              {/* Participants List */}
              {participants.length > 0 && (
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">
                    {participants.length} participant{participants.length > 1 ? "s" : ""} added
                  </p>
                  <AnimatePresence>
                    {participants.map((name, idx) => (
                      <motion.div
                        key={name}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20, height: 0 }}
                        className="flex items-center gap-3 glass-card rounded-2xl p-3"
                      >
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-400 to-violet-600 flex items-center justify-center text-white text-sm font-bold shrink-0">
                          {getInitials(name)}
                        </div>
                        <p className="text-sm font-medium flex-1 truncate">
                          {name}
                        </p>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 rounded-full text-muted-foreground hover:text-rose-500 shrink-0"
                          onClick={() => removeParticipant(name)}
                        >
                          <span className="text-lg leading-none">&times;</span>
                        </Button>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              )}

              {participants.length === 0 && (
                <div className="text-center py-8">
                  <Users className="h-12 w-12 text-purple-200 mx-auto mb-3" />
                  <p className="text-sm text-muted-foreground">
                    Add your travel buddies to start planning together
                  </p>
                </div>
              )}

              {/* Generate Invite Link */}
              <Button
                variant="outline"
                className="w-full rounded-2xl h-12 border-purple-200 text-purple-700 hover:bg-purple-50 gap-2"
                onClick={() => {
                  const code = generateInviteCode();
                  const link = `${typeof window !== 'undefined' ? window.location.origin : 'https://packvote.app'}/join/${code}`;
                  setGeneratedInvite({ code, link });
                  navigator.clipboard?.writeText(link).then(() => {
                    toast.success('Invite link copied! 🎉', {
                      description: `Share this with your group: ${code}`,
                    });
                  }).catch(() => {
                    toast.success('Invite link generated! 🎉', {
                      description: `Code: ${code} — share it with your group`,
                    });
                  });
                }}
              >
                <Link2 className="h-4 w-4" />
                {generatedInvite ? 'Regenerate Invite Link' : 'Generate Invite Link'}
              </Button>

              {/* Generated Invite Display */}
              {generatedInvite && (
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.97 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  className="glass-card-purple rounded-2xl p-4 space-y-3"
                >
                  <div className="flex items-center gap-2 mb-1">
                    <div className="w-8 h-8 rounded-full gradient-purple flex items-center justify-center">
                      <Link2 className="h-4 w-4 text-white" />
                    </div>
                    <p className="text-sm font-bold text-purple-800">Invite Link Ready!</p>
                  </div>

                  <div className="bg-white/80 rounded-xl p-3 border border-purple-100">
                    <p className="text-[10px] text-muted-foreground mb-1 font-medium">INVITE LINK</p>
                    <p className="text-xs font-mono text-purple-700 break-all leading-relaxed">{generatedInvite.link}</p>
                  </div>

                  <div className="flex gap-2">
                    <div className="flex-1 bg-white/80 rounded-xl p-3 border border-purple-100">
                      <p className="text-[10px] text-muted-foreground mb-1 font-medium">INVITE CODE</p>
                      <p className="text-lg font-bold tracking-widest text-purple-700">{generatedInvite.code}</p>
                    </div>
                    <Button
                      variant="ghost"
                      className="self-end rounded-xl h-10 text-xs text-purple-600 hover:bg-purple-100 gap-1.5"
                      onClick={() => {
                        navigator.clipboard?.writeText(generatedInvite.link);
                        toast.success('Link copied again! 📋');
                      }}
                    >
                      📋 Copy
                    </Button>
                  </div>

                  <p className="text-[11px] text-muted-foreground">
                    Share this link or code with your travel buddies so they can join the trip!
                  </p>
                </motion.div>
              )}
            </div>
          )}
        </motion.div>
      </AnimatePresence>

      {/* Bottom Button */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-[#f8f7ff] via-[#f8f7ff] to-transparent safe-bottom">
        <Button
          onClick={goNext}
          disabled={!canContinue()}
          className={cn(
            "w-full h-12 rounded-full font-semibold text-base transition-all",
            "gradient-purple text-white shadow-lg shadow-purple-300/30",
            "disabled:opacity-40 disabled:shadow-none"
          )}
        >
          {step === totalSteps ? "Create Trip" : "Continue"}
        </Button>
      </div>
    </div>
  );
}