import type { Application, Channel, GitLabBuild } from "../types";

export const APPLICATIONS: Application[] = [
  {
    id: "app-enabling",
    name: "Enabling",
    channelsCount: 2056,
    buildsCount: 5056,
    description: "Core Enabling platform — production & QA channels",
  },
  {
    id: "app-jhatpat",
    name: "Jhatpat",
    channelsCount: 106,
    buildsCount: 203,
    description: "Jhatpat internal tooling — testing & staging",
  },
];

// Channels grouped by application
export const CHANNELS: Channel[] = [
  // Enabling channels
  {
    id: "ch-riz",
    applicationId: "app-enabling",
    name: "riz-channel",
    buildVersion: "26.1.1",
    platform: "Windows",
    password: "riz@2025",
    createdAt: new Date(Date.now() - 86400000 * 3),
  },
  {
    id: "ch-nas",
    applicationId: "app-enabling",
    name: "Nas-chn",
    buildVersion: "26.2.3",
    platform: "OSX",
    password: "nas#secure",
    createdAt: new Date(Date.now() - 86400000 * 5),
  },
  {
    id: "ch-qa-win",
    applicationId: "app-enabling",
    name: "qa-windows",
    buildVersion: "26.1.5",
    platform: "Windows",
    password: "qa@win2025",
    createdAt: new Date(Date.now() - 86400000 * 2),
  },
  // Jhatpat channels
  {
    id: "ch-jhatpat-dev",
    applicationId: "app-jhatpat",
    name: "jhatpat-dev",
    buildVersion: "25.8.0",
    platform: "Linux",
    password: "jhat@dev",
    createdAt: new Date(Date.now() - 86400000 * 7),
  },
  {
    id: "ch-jhatpat-test",
    applicationId: "app-jhatpat",
    name: "jhatpat-test",
    buildVersion: "25.7.2",
    platform: "OSX",
    password: "jhat#test",
    createdAt: new Date(Date.now() - 86400000 * 10),
  },
];

// GitLab artifacts (branches with builds)
export const GITLAB_BUILDS: GitLabBuild[] = [
  {
    id: "gl-1",
    branch: "main",
    commit: "a1b2c3d",
    version: "26.1.1",
    timestamp: new Date(Date.now() - 3600000),
    label: "main — v26.1.1 (a1b2c3d)",
  },
  {
    id: "gl-2",
    branch: "feature/auth-flow",
    commit: "e4f5g6h",
    version: "26.1.2-rc1",
    timestamp: new Date(Date.now() - 7200000),
    label: "feature/auth-flow — v26.1.2-rc1 (e4f5g6h)",
  },
  {
    id: "gl-3",
    branch: "fix/payment-gateway",
    commit: "i7j8k9l",
    version: "26.1.2-hotfix",
    timestamp: new Date(Date.now() - 10800000),
    label: "fix/payment-gateway — v26.1.2-hotfix (i7j8k9l)",
  },
  {
    id: "gl-4",
    branch: "feature/dashboard-v2",
    commit: "m0n1o2p",
    version: "26.2.0-beta",
    timestamp: new Date(Date.now() - 14400000),
    label: "feature/dashboard-v2 — v26.2.0-beta (m0n1o2p)",
  },
  {
    id: "gl-5",
    branch: "hotfix/critical-patch",
    commit: "q3r4s5t",
    version: "26.1.3",
    timestamp: new Date(Date.now() - 18000000),
    label: "hotfix/critical-patch — v26.1.3 (q3r4s5t)",
  },
  {
    id: "gl-6",
    branch: "release/26.2",
    commit: "u6v7w8x",
    version: "26.2.0",
    timestamp: new Date(Date.now() - 21600000),
    label: "release/26.2 — v26.2.0 (u6v7w8x)",
  },
];
