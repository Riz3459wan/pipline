import React from 'react';

export type StatusType = 'online' | 'deploying' | 'offline';

interface StatusDotProps {
  status: StatusType;
}

const colors: Record<StatusType, string> = {
  online: 'bg-emerald-400',
  deploying: 'bg-amber-400',
  offline: 'bg-rose-400',
};

export const StatusDot: React.FC<StatusDotProps> = ({ status }) => (
  <span className="relative flex h-3 w-3">
    <span className={`animate-ping absolute inline-flex h-full w-full rounded-full ${colors[status]} opacity-75`} />
    <span className={`relative inline-flex rounded-full h-3 w-3 ${colors[status]}`} />
  </span>
);
