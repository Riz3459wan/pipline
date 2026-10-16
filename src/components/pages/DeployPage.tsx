import React from "react";
import type { BuildArtifact, Channel } from "../../types";
import { Button } from "../ui/Button";
import { Card } from "../ui/Card";

interface DeployPageProps {
  activeChannel: Channel | null;
  builds: BuildArtifact[];
  selectedBuildId: string | null;
  onSelectBuild: (id: string) => void;
  onDeploy: () => void;
  isDeploying: boolean;
  onGoToChannels: () => void;
  onGoToMonitor: () => void;
}

export const DeployPage: React.FC<DeployPageProps> = ({
  activeChannel,
  builds,
  selectedBuildId,
  onSelectBuild,
  onDeploy,
  isDeploying,
  onGoToChannels,
  onGoToMonitor,
}) => {
  const selectedBuild = builds.find((b) => b.id === selectedBuildId);

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Breadcrumb / Back */}
      <div className="flex items-center gap-2 text-xs text-slate-500">
        <button
          onClick={onGoToChannels}
          className="flex items-center gap-1 text-slate-400 transition-colors hover:text-indigo-400"
        >
          ← Back to Channels
        </button>
        <span className="text-slate-700">/</span>
        <span className="text-slate-300">Deploy</span>
      </div>

      <div>
        <h2 className="text-lg font-semibold text-white sm:text-xl">
          GitLab & AWS Deploy
        </h2>
        <p className="mt-1 text-sm text-slate-400">
          Select a compiled build artifact and deploy it to the AWS sandbox
          environment.
        </p>
      </div>

      <Card>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs font-medium uppercase tracking-wider text-slate-500">
              Active Target Channel
            </p>
            <div className="mt-1.5 flex items-center gap-2">
              {activeChannel ? (
                <>
                  <span className="flex h-2.5 w-2.5 rounded-full bg-emerald-400" />
                  <span className="text-lg font-semibold text-white">
                    {activeChannel.name}
                  </span>
                </>
              ) : (
                <>
                  <span className="flex h-2.5 w-2.5 rounded-full bg-rose-400" />
                  <span className="text-lg font-semibold text-slate-400">
                    No channel selected
                  </span>
                </>
              )}
            </div>
          </div>
          {!activeChannel && (
            <Button
              variant="outline"
              onClick={onGoToChannels}
              className="!text-xs"
            >
              ⚠ Select a Channel First →
            </Button>
          )}
        </div>
      </Card>

      <Card>
        <label
          htmlFor="build-select"
          className="block text-sm font-medium text-slate-300"
        >
          Select Build Artifact
        </label>
        <p className="mt-1 text-xs text-slate-500">
          Compiled artifacts and branch tags from GitLab CI/CD pipeline.
        </p>
        <select
          id="build-select"
          value={selectedBuildId ?? ""}
          onChange={(e) => onSelectBuild(e.target.value)}
          className="mt-3 w-full rounded-lg border border-slate-700 bg-slate-950 px-4 py-2.5 text-sm text-white transition-colors focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
        >
          <option value="" disabled>
            -- Select a build --
          </option>
          {builds.map((build) => (
            <option key={build.id} value={build.id}>
              {build.label} — {build.timestamp.toLocaleString()}
            </option>
          ))}
        </select>

        {selectedBuild && (
          <div className="mt-4 grid grid-cols-2 gap-4 rounded-lg border border-slate-800 bg-slate-950/60 p-4 sm:grid-cols-4">
            <div>
              <p className="text-[10px] font-medium uppercase tracking-wider text-slate-500">
                Branch
              </p>
              <p className="mt-0.5 truncate text-sm font-medium text-indigo-300">
                {selectedBuild.branch}
              </p>
            </div>
            <div>
              <p className="text-[10px] font-medium uppercase tracking-wider text-slate-500">
                Commit
              </p>
              <p className="mt-0.5 font-mono text-sm text-slate-300">
                {selectedBuild.commit}
              </p>
            </div>
            <div>
              <p className="text-[10px] font-medium uppercase tracking-wider text-slate-500">
                Built At
              </p>
              <p className="mt-0.5 text-sm text-slate-300">
                {selectedBuild.timestamp.toLocaleTimeString()}
              </p>
            </div>
            <div>
              <p className="text-[10px] font-medium uppercase tracking-wider text-slate-500">
                Status
              </p>
              <p className="mt-0.5 text-sm font-medium text-emerald-400">
                ✓ Compiled
              </p>
            </div>
          </div>
        )}
      </Card>

      <div className="flex flex-col items-start gap-4 rounded-xl border border-slate-800 bg-gradient-to-br from-slate-900/80 to-slate-950 p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">
        <div>
          <p className="text-sm font-medium text-white">Ready to deploy?</p>
          <p className="text-xs text-slate-500">
            This will deploy the selected build to the AWS sandbox for{" "}
            <span className="text-slate-300">{activeChannel?.name ?? "—"}</span>
            .
          </p>
        </div>
        <Button
          variant="success"
          onClick={onDeploy}
          disabled={!activeChannel || !selectedBuildId || isDeploying}
          className="w-full !py-3 sm:w-auto"
        >
          {isDeploying ? "⏳ Deploying..." : "🚀 Send Build to AWS Sandbox"}
        </Button>
      </div>

      {/* 🔗 Next Step CTA */}
      {selectedBuild && activeChannel && !isDeploying && (
        <div className="flex flex-col items-start gap-3 rounded-xl border border-slate-800 bg-slate-900/40 p-4 text-xs text-slate-400 sm:flex-row sm:items-center sm:justify-between">
          <span>Already deployed a build? Jump to monitor.</span>
          <button
            onClick={onGoToMonitor}
            className="text-indigo-400 transition-colors hover:text-indigo-300"
          >
            Go to Live Monitor →
          </button>
        </div>
      )}
    </div>
  );
};
