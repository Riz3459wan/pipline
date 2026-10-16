import React from "react";
import type { Application } from "../../types";
import { Card } from "../ui/Card";

interface ApplicationsPageProps {
  applications: Application[];
  onSelectApplication: (appId: string) => void;
}

export const ApplicationsPage: React.FC<ApplicationsPageProps> = ({
  applications,
  onSelectApplication,
}) => {
  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <h2 className="text-lg font-semibold text-white sm:text-xl">
          Applications
        </h2>
        <p className="mt-1 text-sm text-slate-400">
          Select an application to view its testing channels and builds.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {applications.map((app) => (
          <button
            key={app.id}
            onClick={() => onSelectApplication(app.id)}
            className="group relative overflow-hidden rounded-xl border border-slate-800 bg-slate-900/50 p-6 text-left transition-all hover:border-indigo-500/60 hover:bg-slate-900 hover:shadow-lg hover:shadow-indigo-500/10 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-slate-950"
          >
            <div className="flex items-start justify-between">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-500/15 text-xl font-bold text-indigo-300 transition-colors group-hover:bg-indigo-500/25">
                {app.name.charAt(0).toUpperCase()}
              </div>
              <span className="text-xs text-slate-500 transition-colors group-hover:text-indigo-400">
                Open →
              </span>
            </div>

            <h3 className="mt-4 text-lg font-semibold text-white">
              {app.name}
            </h3>
            {app.description && (
              <p className="mt-1 text-xs text-slate-500">{app.description}</p>
            )}

            <div className="mt-5 grid grid-cols-2 gap-3">
              <div className="rounded-lg border border-slate-800 bg-slate-950/60 p-3">
                <p className="text-[10px] font-medium uppercase tracking-wider text-slate-500">
                  Channels
                </p>
                <p className="mt-0.5 text-lg font-semibold text-white">
                  {app.channelsCount.toLocaleString()}
                </p>
              </div>
              <div className="rounded-lg border border-slate-800 bg-slate-950/60 p-3">
                <p className="text-[10px] font-medium uppercase tracking-wider text-slate-500">
                  Builds
                </p>
                <p className="mt-0.5 text-lg font-semibold text-white">
                  {app.buildsCount.toLocaleString()}
                </p>
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};
