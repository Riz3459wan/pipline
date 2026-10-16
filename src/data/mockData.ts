import type { BuildArtifact, Channel } from '../types';

export const MOCK_BUILDS: BuildArtifact[] = [
  { id: 'b1', branch: 'main', commit: 'a1b2c3d', timestamp: new Date(Date.now() - 3600000), label: 'main (a1b2c3d)' },
  { id: 'b2', branch: 'feature/auth-flow', commit: 'e4f5g6h', timestamp: new Date(Date.now() - 7200000), label: 'feature/auth-flow (e4f5g6h)' },
  { id: 'b3', branch: 'fix/payment-gateway', commit: 'i7j8k9l', timestamp: new Date(Date.now() - 10800000), label: 'fix/payment-gateway (i7j8k9l)' },
  { id: 'b4', branch: 'feature/dashboard-v2', commit: 'm0n1o2p', timestamp: new Date(Date.now() - 14400000), label: 'feature/dashboard-v2 (m0n1o2p)' },
  { id: 'b5', branch: 'hotfix/critical-patch', commit: 'q3r4s5t', timestamp: new Date(Date.now() - 18000000), label: 'hotfix/critical-patch (q3r4s5t)' },
];

export const INITIAL_CHANNELS: Channel[] = [
  { id: 'c1', name: 'mobile-qa', createdAt: new Date(Date.now() - 86400000), isActive: true },
  { id: 'c2', name: 'backend-uat', createdAt: new Date(Date.now() - 172800000), isActive: false },
];
