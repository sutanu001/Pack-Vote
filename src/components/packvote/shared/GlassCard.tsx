'use client';

import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  variant?: 'default' | 'purple' | 'gradient';
}

const variantClasses: Record<string, string> = {
  default: 'glass-card',
  purple: 'glass-card-purple',
  gradient: 'gradient-purple-soft',
};

export function GlassCard({ children, className, variant = 'default' }: GlassCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-20px' }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      className={cn('rounded-2xl p-4', variantClasses[variant], className)}
    >
      {children}
    </motion.div>
  );
}