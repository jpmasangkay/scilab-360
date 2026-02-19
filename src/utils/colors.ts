import type { ElementCategory, CategoryColors } from '../types';

export const CATEGORY_COLORS: Record<ElementCategory, CategoryColors> = {
  'alkali-metal':     { bg: '#3b0764', border: '#a855f7', text: '#d8b4fe', glow: '#a855f7' },
  'alkaline-earth':   { bg: '#4a044e', border: '#e879f9', text: '#f0abfc', glow: '#e879f9' },
  'transition-metal': { bg: '#1e1b4b', border: '#818cf8', text: '#c7d2fe', glow: '#818cf8' },
  'post-transition':  { bg: '#0c1a3e', border: '#38bdf8', text: '#bae6fd', glow: '#38bdf8' },
  'metalloid':        { bg: '#2d1b69', border: '#7c3aed', text: '#ddd6fe', glow: '#7c3aed' },
  'nonmetal':         { bg: '#0c1445', border: '#6366f1', text: '#a5b4fc', glow: '#6366f1' },
  'halogen':          { bg: '#500724', border: '#f43f5e', text: '#fda4af', glow: '#f43f5e' },
  'noble-gas':        { bg: '#042f2e', border: '#2dd4bf', text: '#99f6e4', glow: '#2dd4bf' },
  'lanthanide':       { bg: '#1c1917', border: '#fb923c', text: '#fed7aa', glow: '#fb923c' },
  'actinide':         { bg: '#2d1515', border: '#f87171', text: '#fecaca', glow: '#f87171' },
  'unknown':          { bg: '#1e1b2e', border: '#6b21a8', text: '#c084fc', glow: '#6b21a8' },
};

export function getAtomColor(category: ElementCategory): string {
  const map: Record<ElementCategory, string> = {
    'nonmetal':         '#4338ca',
    'noble-gas':        '#0d9488',
    'alkali-metal':     '#7e22ce',
    'alkaline-earth':   '#a21caf',
    'transition-metal': '#3730a3',
    'post-transition':  '#0369a1',
    'metalloid':        '#5b21b6',
    'halogen':          '#be123c',
    'lanthanide':       '#c2410c',
    'actinide':         '#991b1b',
    'unknown':          '#3b0764',
  };
  return map[category] || '#3b0764';
}
