import React, { useEffect, useRef } from "react";
import type { Deployment, LogEntry } from "../../types";
import { logLevelColors, logLevelPrefixes } from "../../utils/logUtils";
import { StatusDot } from "../StatusDot";
import { Card } from "../ui/Card";
import { Button } from "../ui/Button";

interface MonitorPageProps {
  currentDeployment: Deployment | null;
  logs: LogEntry[];
  onClearLogs: () => void;
  onGoToDeploy: () => void;
  onGoToChannels: () => void;
}

export const MonitorPage: React.FC<MonitorPageProps> = ({
  currentDeployment,
  logs,
  onClearLogs,
  onGoToDeploy,
  onGoToChannels,
}) => {
  const logEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    logEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [logs]);

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-lg font-semibold text-white sm:text-xl">
            Live Monitor & Logs
          </h2>
          <p className="mt-1 text-sm text-slate-400">
            Real-time status of the AWS testing server and a live stream of
            deployment events.
          </p>
        </div>
        {/* 🔗 Quick Actions */}
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={onGoToChannels}
            className="!text-xs"
          >
            ← Channels
          </Button>
          <Button variant="primary" onClick={onGoToDeploy} className="!text-xs">
            🚀 Deploy New Build
          </Button>
        </div>
      </div>

      <Card>
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold text-white">
            AWS Testing Server Status
          </h3>
          <span className="flex items-center gap-2 rounded-full bg-slate-800 px-3 py-1 text-[10px] font-semibold uppercase tracking-wider text-slate-300">
            <span className="h-1.5 w-1.5 rounded-full bg-amber-400" />
            Max 1 Build Concurrent
          </span>
        </div>

        {currentDeployment ? (
          <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-lg border border-slate-800 bg-slate-950/60 p-4">
              <p className="text-[10px] font-medium uppercase tracking-wider text-slate-500">
                Active Build
              </p>
              <p className="mt-1 truncate text-sm font-medium text-white">
                {currentDeployment.branch}
              </p>
              <p className="font-mono text-xs text-indigo-300">
                {currentDeployment.commit}
              </p>
            </div>
            <div className="rounded-lg border border-slate-800 bg-slate-950/60 p-4">
              <p className="text-[10px] font-medium uppercase tracking-wider text-slate-500">
                Channel
              </p>
              <p className="mt-1 truncate text-sm font-medium text-white">
                {currentDeployment.channel}
              </p>
            </div>
            <div className="rounded-lg border border-slate-800 bg-slate-950/60 p-4">
              <p className="text-[10px] font-medium uppercase tracking-wider text-slate-500">
                Deployed At
              </p>
              <p className="mt-1 text-sm font-medium text-white">
                {currentDeployment.deployedAt.toLocaleTimeString()}
              </p>
              <p className="text-xs text-slate-500">
                {currentDeployment.deployedAt.toLocaleDateString()}
              </p>
            </div>
            <div className="rounded-lg border border-slate-800 bg-slate-950/60 p-4">
              <p className="text-[10px] font-medium uppercase tracking-wider text-slate-500">
                Status
              </p>
              <div className="mt-1 flex items-center gap-2">
                <StatusDot
                  status={
                    currentDeployment.status === "running"
                      ? "deploying"
                      : "online"
                  }
                />
                <p className="text-sm font-medium capitalize text-white">
                  {currentDeployment.status}
                </p>
              </div>
            </div>
          </div>
        ) : (
          <div className="mt-5 rounded-lg border border-dashed border-slate-700 bg-slate-950/40 p-8 text-center">
            <p className="text-sm text-slate-500">
              No active deployment. The AWS sandbox is running the stable
              production build.
            </p>
            <Button
              variant="primary"
              onClick={onGoToDeploy}
              className="mt-4 !text-xs"
            >
              🚀 Deploy a Build
            </Button>
          </div>
        )}
      </Card>

      <div className="rounded-xl border border-slate-800 bg-slate-950">
        <div className="flex items-center justify-between border-b border-slate-800 px-4 py-3">
          <div className="flex items-center gap-2">
            <div className="flex gap-1.5">
              <span className="h-2.5 w-2.5 rounded-full bg-rose-500/80" />
              <span className="h-2.5 w-2.5 rounded-full bg-amber-500/80" />
              <span className="h-2.5 w-2.5 rounded-full bg-emerald-500/80" />
            </div>
            <span className="ml-2 text-xs font-medium text-slate-400">
              activity.log
            </span>
            <span className="rounded bg-slate-800 px-2 py-0.5 text-[10px] font-medium text-slate-400">
              {logs.length} entries
            </span>
          </div>
          <button
            onClick={onClearLogs}
            className="rounded px-2 py-1 text-[10px] font-medium text-slate-500 transition-colors hover:bg-slate-800 hover:text-slate-300"
          >
            Clear
          </button>
        </div>

        <div className="scrollbar-thin h-80 overflow-y-auto p-4 font-mono text-xs leading-relaxed sm:h-96">
          {logs.length === 0 ? (
            <p className="text-slate-600">-- No log entries yet --</p>
          ) : (
            logs.map((log) => (
              <div key={log.id} className="flex gap-3 py-0.5">
                <span className="shrink-0 text-slate-600">
                  [{log.timestamp.toLocaleTimeString()}]
                </span>
                <span className={`shrink-0 ${logLevelColors[log.level]}`}>
                  {logLevelPrefixes[log.level]}
                </span>
                <span className={logLevelColors[log.level]}>{log.message}</span>
              </div>
            ))
          )}
          <div ref={logEndRef} />
        </div>
      </div>
    </div>
  );
};
