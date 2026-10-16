import type { LogEntry, LogLevel } from '../types';

export const createLogEntry = (message: string, level: LogLevel = 'info'): LogEntry => ({
  id: `log-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
  timestamp: new Date(),
  message,
  level,
});

export const logLevelColors: Record<LogLevel, string> = {
  info: 'text-slate-400',
  success: 'text-emerald-400',
  warn: 'text-amber-400',
  error: 'text-rose-400',
};

export const logLevelPrefixes: Record<LogLevel, string> = {
  info: 'ℹ',
  success: '✓',
  warn: '⚠',
  error: '✗',
};
