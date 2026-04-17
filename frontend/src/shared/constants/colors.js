/**
 * Centralized color constants for the Captus design system.
 *
 * Why constants instead of inline hex?
 * - Recharts SVG elements cannot read CSS variables (e.g. var(--primary)) in fill/stroke
 * - Having one source of truth makes theme changes a single edit
 * - Semantic naming makes intent clear
 *
 * Keep these in sync with the CSS variables in index.css / tailwind.config
 */

// ─── Chart colors (match --chart-* CSS variables) ────────────────────────────
export const CHART_COLORS = {
  primary: '#3b82f6',    // blue  → --chart-1
  success: '#22c55e',    // green → --chart-2
  warning: '#f59e0b',    // amber → --chart-3
  danger: '#ef4444',     // red   → --chart-4
  purple: '#8b5cf6',     // violet → --chart-5
  muted: '#888888',      // axis/grid lines
  border: '#e5e7eb',     // tooltip border
  tooltipBg: 'white',    // tooltip background
};

// ─── Priority colors (Tailwind classes) ──────────────────────────────────────
export const PRIORITY_CLASSES = {
  Alta: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',
  Media: 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400',
  Baja: 'bg-primary/10 text-primary',
};

// ─── Task status colors ───────────────────────────────────────────────────────
export const TASK_STATUS_COLORS = {
  completed: CHART_COLORS.success,
  pending: CHART_COLORS.warning,
  expired: CHART_COLORS.danger,
};

// ─── Priority chart colors (for pie/bar charts) ───────────────────────────────
export const PRIORITY_CHART_COLORS = {
  Alta: CHART_COLORS.danger,
  Media: CHART_COLORS.warning,
  Baja: CHART_COLORS.success,
};

// ─── Course default color (fallback when no color is set) ─────────────────────
export const COURSE_DEFAULT_COLOR = CHART_COLORS.primary;

// ─── Calendar event type colors ───────────────────────────────────────────────
export const EVENT_TYPE_COLORS = {
  default: { bg: 'bg-muted', hover: 'hover:bg-muted/80', text: 'text-muted-foreground' },
  exam: { bg: 'bg-destructive/20', hover: 'hover:bg-destructive/30', text: 'text-destructive' },
  assignment: { bg: 'bg-primary/20', hover: 'hover:bg-primary/30', text: 'text-primary' },
  reminder: { bg: 'bg-warning/20', hover: 'hover:bg-warning/30', text: 'text-warning' },
};
