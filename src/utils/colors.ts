import type { ElementCategory, CategoryColors } from '../types';

export const CATEGORY_COLORS: Record<ElementCategory, CategoryColors> = {
  'alkali-metal':     { bg: '#fef3c7', border: '#f59e0b', text: '#92400e', glow: '#f59e0b' },
  'alkaline-earth':   { bg: '#fce7f3', border: '#ec4899', text: '#9d174d', glow: '#ec4899' },
  'transition-metal': { bg: '#dbeafe', border: '#3b82f6', text: '#1e40af', glow: '#3b82f6' },
  'post-transition':  { bg: '#e0f2fe', border: '#0ea5e9', text: '#075985', glow: '#0ea5e9' },
  'metalloid':        { bg: '#ede9fe', border: '#8b5cf6', text: '#5b21b6', glow: '#8b5cf6' },
  'nonmetal':         { bg: '#ccfbf1', border: '#14b8a6', text: '#115e59', glow: '#14b8a6' },
  'halogen':          { bg: '#ffe4e6', border: '#f43f5e', text: '#9f1239', glow: '#f43f5e' },
  'noble-gas':        { bg: '#d1fae5', border: '#10b981', text: '#065f46', glow: '#10b981' },
  'lanthanide':       { bg: '#ffedd5', border: '#f97316', text: '#9a3412', glow: '#f97316' },
  'actinide':         { bg: '#fee2e2', border: '#ef4444', text: '#991b1b', glow: '#ef4444' },
  'unknown':          { bg: '#f1f5f9', border: '#94a3b8', text: '#475569', glow: '#94a3b8' },
};

export function getAtomColor(category: ElementCategory): string {
  const map: Record<ElementCategory, string> = {
    'nonmetal':         '#14b8a6',
    'noble-gas':        '#10b981',
    'alkali-metal':     '#f59e0b',
    'alkaline-earth':   '#ec4899',
    'transition-metal': '#3b82f6',
    'post-transition':  '#0ea5e9',
    'metalloid':        '#8b5cf6',
    'halogen':          '#f43f5e',
    'lanthanide':       '#f97316',
    'actinide':         '#ef4444',
    'unknown':          '#94a3b8',
  };
  return map[category] || '#94a3b8';
}
