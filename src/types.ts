export type TabId = 'channels' | 'deploy' | 'monitor';

export interface Channel {
  id: string;
  name: string;
  createdAt: Date;
  isActive: boolean;
}

export interface BuildArtifact {
  id: string;
  branch: string;
  commit: string;
  timestamp: Date;
  label: string;
}

export type DeploymentStatus = 'running' | 'success' | 'failed';

export interface Deployment {
  id: string;
  channel: string;
  branch: string;
  commit: string;
  deployedAt: Date;
  status: DeploymentStatus;
}

export type LogLevel = 'info' | 'success' | 'warn' | 'error';

export interface LogEntry {
  id: string;
  timestamp: Date;
  message: string;
  level: LogLevel;
}
