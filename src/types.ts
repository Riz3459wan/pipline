export type TabId = "applications" | "channels" | "channel-detail" | "monitor";

export interface Application {
  id: string;
  name: string;
  channelsCount: number;
  buildsCount: number;
  description?: string;
}

export type Platform = "Windows" | "OSX" | "Linux";

export interface Channel {
  id: string;
  applicationId: string;
  name: string;
  buildVersion: string; // e.g., "26.1.1"
  platform: Platform;
  password: string; // stored (mock) — display masked
  createdAt: Date;
}

export interface GitLabBuild {
  id: string;
  branch: string; // e.g., "main", "feature/auth"
  commit: string;
  version: string;
  timestamp: Date;
  label: string;
}

export interface Deployment {
  id: string;
  applicationId: string;
  applicationName: string;
  channelId: string;
  channelName: string;
  branch: string;
  commit: string;
  version: string;
  deployedAt: Date;
  status: "running" | "success" | "failed";
  awsPath: string; // e.g., "s3://aws-dev/enabling/riz-channel/"
}

export type LogLevel = "info" | "success" | "warn" | "error";

export interface LogEntry {
  id: string;
  timestamp: Date;
  message: string;
  level: LogLevel;
}
