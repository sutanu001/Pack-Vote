'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  ChevronRight,
  Bell,
  Shield,
  Palette,
  Cpu,
  Info,
  LogOut,
  Plane,
  Vote,
  ClipboardList,
  User,
  Moon,
  Sun,
  Globe,
  Compass,
  Users,
  Pencil,
  Check,
  X,
  FileText,
  Lock,
  Sparkles,
  ExternalLink,
  Mountain,
  Palmtree,
  Building2,
} from 'lucide-react';
import { useAppStore } from '@/lib/store';
import { cn } from '@/lib/utils';
import { GlassCard } from '@/components/packvote/shared/GlassCard';
import { ProgressRing } from '@/components/packvote/shared/ProgressRing';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { toast } from 'sonner';

// ============================================================
// Achievement Badge Data
// ============================================================
const ACHIEVEMENTS = [
  { id: 'first-trip', label: 'First Trip', icon: Plane, unlocked: true, color: 'text-purple-600', bg: 'bg-purple-100' },
  { id: 'survey-pro', label: 'Survey Pro', icon: ClipboardList, unlocked: true, color: 'text-amber-600', bg: 'bg-amber-100' },
  { id: 'voter', label: 'Voter', icon: Vote, unlocked: true, color: 'text-emerald-600', bg: 'bg-emerald-100' },
  { id: 'explorer', label: 'Explorer', icon: Compass, unlocked: false, color: 'text-purple-400', bg: 'bg-purple-200' },
  { id: 'group-leader', label: 'Group Leader', icon: Users, unlocked: false, color: 'text-purple-400', bg: 'bg-purple-200' },
  { id: 'world-traveler', label: 'World Traveler', icon: Globe, unlocked: false, color: 'text-purple-400', bg: 'bg-purple-200' },
];

// ============================================================
// Trip type chart data
// ============================================================
const TRIP_TYPE_DATA = [
  { label: 'Beach', value: 1, max: 3, icon: Palmtree },
  { label: 'Mountain', value: 1, max: 3, icon: Mountain },
  { label: 'City', value: 1, max: 3, icon: Building2 },
];

// ============================================================
// Animation variants
// ============================================================
const containerVariants = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.08,
    },
  },
};

const badgeVariants = {
  hidden: { opacity: 0, y: 16, scale: 0.9 },
  show: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.4, ease: 'easeOut' } },
};

const barVariants = {
  hidden: { scaleX: 0 },
  show: (width: number) => ({
    scaleX: width,
    transition: { duration: 0.8, ease: 'easeOut', delay: 0.2 },
  }),
};

// ============================================================
// Section Header
// ============================================================
function SectionHeader({ title, onViewAll }: { title: string; onViewAll?: () => void }) {
  return (
    <div className="flex items-center justify-between mb-3">
      <h2 className="text-sm font-bold text-foreground tracking-tight">{title}</h2>
      {onViewAll && (
        <button
          onClick={onViewAll}
          className="text-xs text-purple-500 hover:text-purple-700 font-medium flex items-center gap-0.5 transition-colors"
        >
          View all
          <ChevronRight className="w-3 h-3" />
        </button>
      )}
    </div>
  );
}

// ============================================================
// Gradient Divider
// ============================================================
function GradientDivider() {
  return (
    <div className="my-5 h-px bg-gradient-to-r from-transparent via-purple-200 to-transparent" />
  );
}

// ============================================================
// Main Component
// ============================================================
export function ProfileScreen() {
  const { currentUser, trips } = useAppStore();

  // Editable profile state
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState(currentUser.name);
  const [editEmail, setEditEmail] = useState(currentUser.email);

  // Settings state
  const [isDarkMode, setIsDarkMode] = useState(() => {
    if (typeof window === 'undefined') return false;
    const saved = localStorage.getItem('theme');
    if (saved === 'dark') return true;
    if (saved === 'light') return false;
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });
  const [pushEnabled, setPushEnabled] = useState(true);
  const [emailEnabled, setEmailEnabled] = useState(true);
  const [smsEnabled, setSmsEnabled] = useState(false);
  const [aiModelPref, setAiModelPref] = useState('auto');
  const [dataPrivacy, setDataPrivacy] = useState(false);

  // Sync dark mode DOM class on mount
  useEffect(() => {
    document.documentElement.classList.toggle('dark', isDarkMode);
  }, [isDarkMode]);

  const initials = currentUser.name
    .split(' ')
    .map((w) => w[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  const displayName = isEditing ? editName : currentUser.name;
  const displayEmail = isEditing ? editEmail : currentUser.email;

  const tripsCreated = trips.length;
  const votesCast = trips.filter((t) => t.status === 'voting').length;
  const surveysCompleted = trips.filter((t) => t.surveyCompleted > 0).length;

  // ---- Handlers ----
  const handleSaveProfile = () => {
    if (!editName.trim()) {
      toast.error('Name cannot be empty');
      return;
    }
    if (!editEmail.trim() || !editEmail.includes('@')) {
      toast.error('Please enter a valid email');
      return;
    }
    setIsEditing(false);
    toast.success('Profile updated', { description: 'Your changes have been saved.' });
  };

  const handleCancelEdit = () => {
    setEditName(currentUser.name);
    setEditEmail(currentUser.email);
    setIsEditing(false);
  };

  const toggleDarkMode = (checked: boolean) => {
    setIsDarkMode(checked);
    document.documentElement.classList.toggle('dark', checked);
    localStorage.setItem('theme', checked ? 'dark' : 'light');
    toast.success(checked ? 'Dark mode enabled' : 'Light mode enabled');
  };

  const handlePushToggle = (checked: boolean) => {
    setPushEnabled(checked);
    toast.success(checked ? 'Push notifications enabled' : 'Push notifications disabled');
  };

  const handleEmailToggle = (checked: boolean) => {
    setEmailEnabled(checked);
    toast.success(checked ? 'Email notifications enabled' : 'Email notifications disabled');
  };

  const handleSmsToggle = (checked: boolean) => {
    setSmsEnabled(checked);
    toast.success(checked ? 'SMS reminders enabled' : 'SMS reminders disabled');
  };

  const handleAiModelChange = (value: string) => {
    setAiModelPref(value);
    const labels: Record<string, string> = {
      auto: 'Auto (Best Available)',
      'glm-4-flash': 'GLM-4 Flash',
      'gpt-4o-mini': 'GPT-4o Mini',
    };
    toast.success(`AI model set to ${labels[value]}`);
  };

  return (
    <div className="screen-container animate-slide-up px-4 pt-6 pb-8">
      {/* ============================== */}
      {/* Profile Header                  */}
      {/* ============================== */}
      <div className="flex flex-col items-center mb-2">
        {/* Avatar with gradient ring */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="relative mb-3"
        >
          <div className="w-22 h-22 rounded-full p-[3px] bg-gradient-to-br from-purple-500 via-fuchsia-500 to-pink-500 shadow-lg shadow-purple-300/40">
            <div className="w-full h-full rounded-full gradient-purple flex items-center justify-center">
              <span className="text-2xl font-bold text-white">{initials}</span>
            </div>
          </div>
          <button
            onClick={() => {
              if (isEditing) {
                handleSaveProfile();
              } else {
                setEditName(currentUser.name);
                setEditEmail(currentUser.email);
                setIsEditing(true);
              }
            }}
            className={cn(
              'absolute -bottom-1 -right-1 w-7 h-7 rounded-full flex items-center justify-center shadow-md transition-colors',
              isEditing
                ? 'bg-emerald-500 hover:bg-emerald-600 text-white'
                : 'bg-white border border-purple-200 text-purple-600 hover:bg-purple-50'
            )}
          >
            {isEditing ? <Check className="w-3.5 h-3.5" /> : <Pencil className="w-3.5 h-3.5" />}
          </button>
        </motion.div>

        {/* Name & Email */}
        {isEditing ? (
          <motion.div
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full max-w-xs space-y-2 mt-1"
          >
            <Input
              value={editName}
              onChange={(e) => setEditName(e.target.value)}
              placeholder="Your name"
              className="text-center text-sm h-8"
              autoFocus
            />
            <Input
              value={editEmail}
              onChange={(e) => setEditEmail(e.target.value)}
              placeholder="Your email"
              className="text-center text-sm h-8"
              type="email"
            />
            <div className="flex justify-center gap-2">
              <Button variant="ghost" size="sm" onClick={handleCancelEdit} className="h-7 text-xs">
                <X className="w-3 h-3 mr-1" />
                Cancel
              </Button>
              <Button size="sm" onClick={handleSaveProfile} className="h-7 text-xs bg-purple-600 hover:bg-purple-700">
                <Check className="w-3 h-3 mr-1" />
                Save
              </Button>
            </div>
          </motion.div>
        ) : (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center">
            <h1 className="text-xl font-bold">{displayName}</h1>
            <p className="text-sm text-muted-foreground mt-0.5">{displayEmail}</p>
            <p className="text-xs text-purple-500 mt-1 flex items-center justify-center gap-1">
              <Sparkles className="w-3 h-3" />
              Member since Jan 2025
            </p>
          </motion.div>
        )}
      </div>

      <GradientDivider />

      {/* ============================== */}
      {/* Travel Stats Chart             */}
      {/* ============================== */}
      <SectionHeader title="Travel Stats" onViewAll={() => {}} />

      {/* Quick stat numbers */}
      <div className="grid grid-cols-3 gap-3 mb-4">
        {[
          { icon: Plane, label: 'Trips', value: tripsCreated, color: 'text-purple-600' },
          { icon: Vote, label: 'Votes', value: votesCast, color: 'text-amber-500' },
          { icon: ClipboardList, label: 'Surveys', value: surveysCompleted, color: 'text-emerald-500' },
        ].map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="text-center p-2 rounded-xl bg-purple-50/60 dark:bg-purple-950/30"
          >
            <stat.icon className={cn('w-4 h-4 mx-auto mb-1', stat.color)} />
            <p className="text-lg font-bold">{stat.value}</p>
            <p className="text-[10px] text-muted-foreground">{stat.label}</p>
          </motion.div>
        ))}
      </div>

      {/* Trips by Type - Horizontal Bar Chart */}
      <GlassCard variant="default" className="mb-1">
        <p className="text-xs font-semibold text-muted-foreground mb-3">Trips by Type</p>
        <div className="space-y-3">
          {TRIP_TYPE_DATA.map((item, i) => {
            const widthPercent = Math.max((item.value / item.max) * 100, 15);
            return (
              <div key={item.label} className="flex items-center gap-3">
                <div className="w-16 flex items-center gap-1.5 shrink-0">
                  <item.icon className="w-3.5 h-3.5 text-purple-500" />
                  <span className="text-xs font-medium text-foreground">{item.label}</span>
                </div>
                <div className="flex-1 h-6 bg-purple-100/70 dark:bg-purple-900/30 rounded-full overflow-hidden relative">
                  <motion.div
                    className="h-full rounded-full bg-gradient-to-r from-purple-500 to-fuchsia-500 relative"
                    custom={widthPercent / 100}
                    variants={barVariants}
                    initial="hidden"
                    animate="show"
                    style={{ transformOrigin: 'left' }}
                    transition={{ delay: i * 0.15 + 0.3 }}
                  >
                    <span className="absolute inset-0 flex items-center justify-end pr-2">
                      <span className="text-[10px] font-bold text-white">{item.value}</span>
                    </span>
                  </motion.div>
                </div>
              </div>
            );
          })}
        </div>
      </GlassCard>

      <GradientDivider />

      {/* ============================== */}
      {/* Travel Achievements            */}
      {/* ============================== */}
      <SectionHeader title="Travel Achievements" onViewAll={() => {}} />

      <motion.div
        className="grid grid-cols-3 gap-3 mb-1"
        variants={containerVariants}
        initial="hidden"
        animate="show"
      >
        {ACHIEVEMENTS.map((badge) => (
          <motion.div
            key={badge.id}
            variants={badgeVariants}
            whileHover={badge.unlocked ? { y: -2, scale: 1.03 } : undefined}
            className={cn(
              'flex flex-col items-center gap-1.5 p-3 rounded-xl border transition-colors',
              badge.unlocked
                ? 'bg-white dark:bg-purple-950/20 border-purple-100 dark:border-purple-800/50 shadow-sm'
                : 'bg-purple-50/40 dark:bg-purple-950/10 border-purple-100/50 dark:border-purple-900/30 opacity-60'
            )}
          >
            <div
              className={cn(
                'w-10 h-10 rounded-full flex items-center justify-center',
                badge.unlocked ? badge.bg : 'bg-gray-100 dark:bg-gray-800'
              )}
            >
              {badge.unlocked ? (
                <badge.icon className={cn('w-5 h-5', badge.color)} />
              ) : (
                <Lock className="w-4 h-4 text-gray-400 dark:text-gray-600" />
              )}
            </div>
            <span
              className={cn(
                'text-[10px] font-semibold text-center leading-tight',
                badge.unlocked ? 'text-foreground' : 'text-muted-foreground'
              )}
            >
              {badge.label}
            </span>
            {!badge.unlocked && (
              <span className="text-[8px] text-purple-400 dark:text-purple-500 font-medium">Locked</span>
            )}
          </motion.div>
        ))}
      </motion.div>

      <GradientDivider />

      {/* ============================== */}
      {/* AI Model Gateway               */}
      {/* ============================== */}
      <SectionHeader title="AI Gateway" onViewAll={() => {}} />

      <GlassCard variant="gradient" className="mb-1">
        <div className="flex items-start gap-3 mb-3">
          <div className="w-10 h-10 rounded-full bg-purple-600 flex items-center justify-center shrink-0 shadow-md shadow-purple-400/30">
            <Cpu className="w-5 h-5 text-white" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-bold text-foreground">AI Model Gateway</p>
            <p className="text-xs text-muted-foreground">Multi-model recommendation engine</p>
          </div>
          <ProgressRing progress={94} size={44} strokeWidth={3} />
        </div>

        {/* Model badges */}
        <div className="flex flex-wrap gap-1.5 mb-3">
          <Badge variant="secondary" className="bg-purple-100 dark:bg-purple-900/40 text-purple-700 dark:text-purple-300 text-[10px] px-2 py-0.5">
            GLM-4 Flash
          </Badge>
          <Badge variant="secondary" className="bg-fuchsia-100 dark:bg-fuchsia-900/40 text-fuchsia-700 dark:text-fuchsia-300 text-[10px] px-2 py-0.5">
            GPT-4o Mini
          </Badge>
          <Badge variant="outline" className="text-[10px] px-2 py-0.5 border-dashed border-purple-200 dark:border-purple-800">
            + more
          </Badge>
        </div>

        {/* Mini stats */}
        <div className="flex items-center gap-4 mb-3">
          <div className="flex items-center gap-1.5">
            <FileText className="w-3.5 h-3.5 text-muted-foreground" />
            <span className="text-xs text-muted-foreground">Requests today:</span>
            <span className="text-xs font-bold text-foreground">47</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            <span className="text-xs text-muted-foreground">Avg latency:</span>
            <span className="text-xs font-bold text-foreground">1.2s</span>
          </div>
        </div>

        {/* View Logs */}
        <Button variant="ghost" size="sm" className="h-7 text-xs text-purple-600 hover:text-purple-800 hover:bg-purple-50 dark:hover:bg-purple-950/40 p-0">
          <ExternalLink className="w-3 h-3 mr-1" />
          View Logs
        </Button>
      </GlassCard>

      <GradientDivider />

      {/* ============================== */}
      {/* Settings                       */}
      {/* ============================== */}
      <div className="space-y-3">
        {/* Account */}
        <GlassCard className="p-0 overflow-hidden">
          <SettingsItem icon={User} label="Account Settings" subtitle="Name, email, phone" />
          <Separator className="mx-4 bg-purple-100/50 dark:bg-purple-800/30" />
          <SettingsItem icon={Globe} label="Language & Region" subtitle="English, Asia/Shanghai" />
        </GlassCard>

        {/* Appearance */}
        <GlassCard className="p-0 overflow-hidden">
          <div className="w-full flex items-center gap-3 p-4">
            <div className="w-8 h-8 rounded-lg bg-purple-100 dark:bg-purple-900/50 flex items-center justify-center shrink-0">
              {isDarkMode ? (
                <Moon className="w-4 h-4 text-purple-600 dark:text-purple-400" />
              ) : (
                <Sun className="w-4 h-4 text-amber-500" />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium">Dark Mode</p>
              <p className="text-xs text-muted-foreground">
                {isDarkMode ? 'Dark theme active' : 'Toggle dark theme'}
              </p>
            </div>
            <Switch checked={isDarkMode} onCheckedChange={toggleDarkMode} />
          </div>
          <Separator className="mx-4 bg-purple-100/50 dark:bg-purple-800/30" />
          <SettingsItem icon={Palette} label="Travel Preferences" subtitle="Budget, style, pace" />
        </GlassCard>

        {/* Notifications */}
        <GlassCard className="p-0 overflow-hidden">
          <div className="w-full flex items-center gap-3 p-4">
            <div className="w-8 h-8 rounded-lg bg-purple-100 dark:bg-purple-900/50 flex items-center justify-center shrink-0">
              <Bell className="w-4 h-4 text-purple-600 dark:text-purple-400" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium">Push Notifications</p>
              <p className="text-xs text-muted-foreground">Trip updates & votes</p>
            </div>
            <Switch checked={pushEnabled} onCheckedChange={handlePushToggle} />
          </div>
          <Separator className="mx-4 bg-purple-100/50 dark:bg-purple-800/30" />
          <div className="w-full flex items-center gap-3 p-4">
            <div className="w-8 h-8 rounded-lg bg-purple-100 dark:bg-purple-900/50 flex items-center justify-center shrink-0">
              <Bell className="w-4 h-4 text-purple-600 dark:text-purple-400" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium">Email Notifications</p>
              <p className="text-xs text-muted-foreground">Surveys & summaries</p>
            </div>
            <Switch checked={emailEnabled} onCheckedChange={handleEmailToggle} />
          </div>
          <Separator className="mx-4 bg-purple-100/50 dark:bg-purple-800/30" />
          <div className="w-full flex items-center gap-3 p-4">
            <div className="w-8 h-8 rounded-lg bg-purple-100 dark:bg-purple-900/50 flex items-center justify-center shrink-0">
              <Bell className="w-4 h-4 text-purple-600 dark:text-purple-400" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium">SMS Reminders</p>
              <p className="text-xs text-muted-foreground">Urgent trip alerts</p>
            </div>
            <Switch checked={smsEnabled} onCheckedChange={handleSmsToggle} />
          </div>
        </GlassCard>

        {/* AI Settings */}
        <GlassCard className="p-0 overflow-hidden">
          <div className="w-full flex items-center gap-3 p-4">
            <div className="w-8 h-8 rounded-lg bg-purple-100 dark:bg-purple-900/50 flex items-center justify-center shrink-0">
              <Cpu className="w-4 h-4 text-purple-600 dark:text-purple-400" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium">AI Model Preference</p>
              <p className="text-xs text-muted-foreground">Choose your preferred model</p>
            </div>
            <Select value={aiModelPref} onValueChange={handleAiModelChange}>
              <SelectTrigger size="sm" className="w-[130px] h-7 text-xs">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="auto" className="text-xs">Auto (Best)</SelectItem>
                <SelectItem value="glm-4-flash" className="text-xs">GLM-4 Flash</SelectItem>
                <SelectItem value="gpt-4o-mini" className="text-xs">GPT-4o Mini</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Separator className="mx-4 bg-purple-100/50 dark:bg-purple-800/30" />
          <div className="w-full flex items-center gap-3 p-4">
            <div className="w-8 h-8 rounded-lg bg-purple-100 dark:bg-purple-900/50 flex items-center justify-center shrink-0">
              <Shield className="w-4 h-4 text-purple-600 dark:text-purple-400" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium">Data Privacy</p>
              <p className="text-xs text-muted-foreground">Opt out of AI training</p>
            </div>
            <Switch
              checked={dataPrivacy}
              onCheckedChange={(checked) => {
                setDataPrivacy(checked);
                toast.success(checked ? 'Data privacy enabled' : 'Data sharing enabled');
              }}
            />
          </div>
        </GlassCard>

        {/* About */}
        <GlassCard className="p-0 overflow-hidden">
          <SettingsItem icon={Info} label="About Pack Vote" subtitle="Version 1.0.0" />
          <Separator className="mx-4 bg-purple-100/50 dark:bg-purple-800/30" />
          <SettingsItem icon={Info} label="Terms of Service" />
          <Separator className="mx-4 bg-purple-100/50 dark:bg-purple-800/30" />
          <SettingsItem icon={Info} label="Privacy Policy" />
        </GlassCard>

        {/* Logout */}
        <button className="w-full rounded-2xl p-4 flex items-center justify-center gap-2 text-rose-500 font-semibold text-sm glass-card hover:bg-rose-50 dark:hover:bg-rose-950/20 transition-colors">
          <LogOut className="w-4 h-4" />
          Sign Out
        </button>
      </div>
    </div>
  );
}

// ============================================================
// Settings Item (reusable)
// ============================================================
function SettingsItem({
  icon: Icon,
  label,
  subtitle,
}: {
  icon: React.ElementType;
  label: string;
  subtitle?: string;
}) {
  return (
    <button className="w-full flex items-center gap-3 p-4 text-left hover:bg-purple-50/50 dark:hover:bg-purple-950/20 transition-colors">
      <div className="w-8 h-8 rounded-lg bg-purple-100 dark:bg-purple-900/50 flex items-center justify-center shrink-0">
        <Icon className="w-4 h-4 text-purple-600 dark:text-purple-400" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium">{label}</p>
        {subtitle && <p className="text-xs text-muted-foreground">{subtitle}</p>}
      </div>
      <ChevronRight className="w-4 h-4 text-gray-300 dark:text-gray-600 shrink-0" />
    </button>
  );
}