'use client';

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
  Globe,
} from 'lucide-react';
import { useAppStore } from '@/lib/store';
import { GlassCard } from '@/components/packvote/shared/GlassCard';
import { ProgressRing } from '@/components/packvote/shared/ProgressRing';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';

export function ProfileScreen() {
  const { currentUser, trips } = useAppStore();
  const name = currentUser.name;
  const initials = name.split(' ').map((w) => w[0]).join('').toUpperCase().slice(0, 2);

  const tripsCreated = trips.length;
  const votesCast = trips.filter((t) => t.status === 'voting').length;
  const surveysCompleted = trips.filter((t) => t.surveyCompleted > 0).length;

  return (
    <div className="screen-container animate-slide-up px-4 pt-6">
      {/* Profile Header */}
      <div className="flex flex-col items-center mb-6">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="w-20 h-20 rounded-full gradient-purple shadow-lg shadow-purple-300/40 flex items-center justify-center mb-3"
        >
          <span className="text-2xl font-bold text-white">{initials}</span>
        </motion.div>
        <h1 className="text-xl font-bold">{name}</h1>
        <p className="text-sm text-muted-foreground">{currentUser.email}</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        {[
          { icon: Plane, label: 'Trips Created', value: tripsCreated, color: 'text-purple-600' },
          { icon: Vote, label: 'Votes Cast', value: votesCast, color: 'text-amber-500' },
          { icon: ClipboardList, label: 'Surveys', value: surveysCompleted, color: 'text-emerald-500' },
        ].map((stat, i) => (
          <GlassCard key={stat.label} variant="purple" className="text-center p-3">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
            >
              <stat.icon className={`w-5 h-5 mx-auto mb-1 ${stat.color}`} />
              <p className="text-xl font-bold">{stat.value}</p>
              <p className="text-[10px] text-muted-foreground">{stat.label}</p>
            </motion.div>
          </GlassCard>
        ))}
      </div>

      {/* AI Model Performance */}
      <GlassCard variant="gradient" className="mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full gradient-purple flex items-center justify-center shrink-0">
            <Cpu className="w-5 h-5 text-white" />
          </div>
          <div className="flex-1">
            <p className="text-sm font-semibold">AI Model Gateway</p>
            <p className="text-xs text-muted-foreground">Multi-model recommendation engine</p>
          </div>
          <ProgressRing progress={94} size={44} strokeWidth={3} />
        </div>
      </GlassCard>

      {/* Settings Sections */}
      <div className="space-y-3">
        {/* Account */}
        <GlassCard className="p-0 overflow-hidden">
          <SettingsItem icon={User} label="Account Settings" subtitle="Name, email, phone" />
          <Separator className="mx-4 bg-purple-100/50" />
          <SettingsItem icon={Globe} label="Language & Region" subtitle="English, Asia/Shanghai" />
        </GlassCard>

        {/* Preferences */}
        <GlassCard className="p-0 overflow-hidden">
          <SettingsItem icon={Palette} label="Travel Preferences" subtitle="Budget, style, pace" />
          <Separator className="mx-4 bg-purple-100/50" />
          <SettingsItem icon={Moon} label="Dark Mode" subtitle="Toggle dark theme" trailing={<Switch />} />
        </GlassCard>

        {/* Notifications */}
        <GlassCard className="p-0 overflow-hidden">
          <SettingsItem icon={Bell} label="Push Notifications" subtitle="Trip updates & votes" trailing={<Switch defaultChecked />} />
          <Separator className="mx-4 bg-purple-100/50" />
          <SettingsItem icon={Bell} label="Email Notifications" subtitle="Surveys & summaries" trailing={<Switch defaultChecked />} />
          <Separator className="mx-4 bg-purple-100/50" />
          <SettingsItem icon={Bell} label="SMS Reminders" subtitle="Urgent trip alerts" trailing={<Switch />} />
        </GlassCard>

        {/* AI */}
        <GlassCard className="p-0 overflow-hidden">
          <SettingsItem icon={Cpu} label="AI Model Preference" subtitle="Auto (Best Available)" />
          <Separator className="mx-4 bg-purple-100/50" />
          <SettingsItem icon={Shield} label="Data Privacy" subtitle="Opt out of AI training" trailing={<Switch />} />
        </GlassCard>

        {/* About */}
        <GlassCard className="p-0 overflow-hidden">
          <SettingsItem icon={Info} label="About Pack Vote" subtitle="Version 1.0.0" />
          <Separator className="mx-4 bg-purple-100/50" />
          <SettingsItem icon={Info} label="Terms of Service" />
          <Separator className="mx-4 bg-purple-100/50" />
          <SettingsItem icon={Info} label="Privacy Policy" />
        </GlassCard>

        {/* Logout */}
        <button className="w-full rounded-2xl p-4 flex items-center justify-center gap-2 text-rose-500 font-semibold text-sm glass-card hover:bg-rose-50 transition-colors">
          <LogOut className="w-4 h-4" />
          Sign Out
        </button>
      </div>
    </div>
  );
}

function SettingsItem({
  icon: Icon,
  label,
  subtitle,
  trailing,
}: {
  icon: React.ElementType;
  label: string;
  subtitle?: string;
  trailing?: React.ReactNode;
}) {
  return (
    <button className="w-full flex items-center gap-3 p-4 text-left hover:bg-purple-50/50 transition-colors">
      <div className="w-8 h-8 rounded-lg bg-purple-100 flex items-center justify-center shrink-0">
        <Icon className="w-4 h-4 text-purple-600" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium">{label}</p>
        {subtitle && <p className="text-xs text-muted-foreground">{subtitle}</p>}
      </div>
      {trailing || <ChevronRight className="w-4 h-4 text-gray-300 shrink-0" />}
    </button>
  );
}