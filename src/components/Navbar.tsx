import React from "react";
import type { TabId } from "../types";
import { StatusDot } from "./StatusDot";
import { Button } from "./ui/Button";

interface NavbarProps {
  activeTab: TabId;
  onTabChange: (tab: TabId) => void;
  onReset: () => void;
  isDeploying: boolean;
  hasActiveChannel: boolean;
  hasDeployment: boolean;
}

const TABS: { id: TabId; label: string; shortLabel: string }[] = [
  { id: "channels", label: "1. Channels", shortLabel: "Channels" },
  { id: "deploy", label: "2. GitLab & AWS Deploy", shortLabel: "Deploy" },
  { id: "monitor", label: "3. Live Monitor & Logs", shortLabel: "Monitor" },
];

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  onTabChange,
  onReset,
  isDeploying,
  hasActiveChannel,
  hasDeployment,
}) => {
  // Progress states
  const stepStatus = {
    channels: hasActiveChannel ? "done" : "active",
    deploy: hasDeployment ? "done" : hasActiveChannel ? "active" : "pending",
    monitor: hasDeployment ? "active" : "pending",
  } as const;

  const renderStepIndicator = (tabId: TabId) => {
    const status = stepStatus[tabId];
    if (status === "done") return <span className="text-emerald-400">✓</span>;
    if (status === "active") return <span className="text-indigo-400">●</span>;
    return <span className="text-slate-600">○</span>;
  };

  return (
    <header className="sticky top-0 z-50 border-b border-slate-800 bg-slate-950/80 backdrop-blur-xl">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-600 font-bold text-white shadow-lg shadow-indigo-600/20">
              PS
            </div>
            <div className="hidden sm:block">
              <h1 className="text-sm font-semibold text-white sm:text-base">
                Pipeline Server & AWS Testing Bridge
              </h1>
              <div className="flex items-center gap-2 text-xs text-slate-400">
                <StatusDot status={isDeploying ? "deploying" : "online"} />
                <span>{isDeploying ? "Deploying..." : "System Online"}</span>
              </div>
            </div>
          </div>
          <Button
            variant="outline"
            onClick={onReset}
            className="!px-3 !py-1.5 !text-xs sm:!px-4 sm:!py-2 sm:!text-sm"
          >
            🔄 Reset to Production
          </Button>
        </div>

        {/* Workflow Progress Bar */}
        <div className="flex items-center gap-2 py-2 text-[10px] text-slate-500 sm:text-xs">
          <span className="font-medium uppercase tracking-wider">
            Workflow:
          </span>
          <div className="flex items-center gap-1.5">
            <span
              className={
                stepStatus.channels === "done"
                  ? "text-emerald-400"
                  : stepStatus.channels === "active"
                    ? "text-indigo-400"
                    : "text-slate-600"
              }
            >
              Channel Selected
            </span>
            <span className="text-slate-700">→</span>
            <span
              className={
                stepStatus.deploy === "done"
                  ? "text-emerald-400"
                  : stepStatus.deploy === "active"
                    ? "text-indigo-400"
                    : "text-slate-600"
              }
            >
              Build Selected
            </span>
            <span className="text-slate-700">→</span>
            <span
              className={
                stepStatus.monitor === "active"
                  ? "text-indigo-400"
                  : "text-slate-600"
              }
            >
              Deployed
            </span>
          </div>
        </div>

        <nav className="flex gap-1 overflow-x-auto pb-1">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`flex items-center gap-2 whitespace-nowrap rounded-t-lg px-4 py-2.5 text-xs font-medium transition-colors sm:text-sm ${
                activeTab === tab.id
                  ? "border-b-2 border-indigo-500 bg-slate-900/50 text-white"
                  : "text-slate-400 hover:bg-slate-900/30 hover:text-slate-200"
              }`}
            >
              <span className="text-[10px]">{renderStepIndicator(tab.id)}</span>
              <span className="hidden sm:inline">{tab.label}</span>
              <span className="sm:hidden">{tab.shortLabel}</span>
            </button>
          ))}
        </nav>
      </div>
    </header>
  );
};
