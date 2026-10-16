import React from "react";
import type { Application, Channel } from "../types";
import { StatusDot } from "./StatusDot";
import { Button } from "./ui/Button";

type PageView = "applications" | "channels" | "channel-detail" | "monitor";

interface NavbarProps {
  pageView: PageView;
  onNavigate: (v: PageView) => void;
  onReset: () => void;
  isDeploying: boolean;
  breadcrumbs: {
    app: Application | null;
    channel: Channel | null;
  };
  onBackToApplications: () => void;
  onBackToChannels: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  pageView,
  onNavigate,
  onReset,
  isDeploying,
  breadcrumbs,
  onBackToApplications,
  onBackToChannels,
}) => {
  const { app, channel } = breadcrumbs;

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

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              onClick={() => onNavigate("monitor")}
              className="!px-3 !py-1.5 !text-xs hidden sm:inline-flex"
            >
              📊 Logs
            </Button>
            <Button
              variant="outline"
              onClick={onReset}
              className="!px-3 !py-1.5 !text-xs sm:!px-4 sm:!py-2 sm:!text-sm"
            >
              🔄 Reset to Production
            </Button>
          </div>
        </div>

        {/* Breadcrumbs */}
        <nav className="flex items-center gap-2 pb-3 text-xs sm:text-sm">
          <button
            onClick={onBackToApplications}
            className={`transition-colors ${
              pageView === "applications"
                ? "font-medium text-white"
                : "text-slate-400 hover:text-indigo-400"
            }`}
          >
            Applications
          </button>

          {app && (
            <>
              <span className="text-slate-700">/</span>
              <button
                onClick={onBackToApplications}
                className={`transition-colors ${
                  pageView === "channels"
                    ? "font-medium text-white"
                    : "text-slate-400 hover:text-indigo-400"
                }`}
              >
                {app.name}
              </button>
            </>
          )}

          {app && channel && (
            <>
              <span className="text-slate-700">/</span>
              <button
                onClick={onBackToChannels}
                className={`transition-colors ${
                  pageView === "channel-detail"
                    ? "font-medium text-white"
                    : "text-slate-400 hover:text-indigo-400"
                }`}
              >
                {channel.name}
              </button>
            </>
          )}

          {pageView === "monitor" && (
            <>
              <span className="text-slate-700">/</span>
              <span className="font-medium text-white">Live Monitor</span>
            </>
          )}
        </nav>
      </div>
    </header>
  );
};
