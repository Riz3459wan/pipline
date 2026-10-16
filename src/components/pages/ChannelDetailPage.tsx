import React, { useState } from "react";
import type {
  Application,
  Channel,
  Deployment,
  GitLabBuild,
} from "../../types";
import { Button } from "../ui/Button";
import { Card } from "../ui/Card";

interface ChannelDetailPageProps {
  application: Application;
  channel: Channel;
  builds: GitLabBuild[];
  currentDeployment: Deployment | null;
  onDeploy: (buildId: string) => void;
  isDeploying: boolean;
  onBack: () => void;
  onOpenMonitor: () => void;
}

const platformBadge: Record<string, string> = {
  Windows: "bg-sky-500/15 text-sky-400 border-sky-500/30",
  OSX: "bg-violet-500/15 text-violet-400 border-violet-500/30",
  Linux: "bg-amber-500/15 text-amber-400 border-amber-500/30",
};

export const ChannelDetailPage: React.FC<ChannelDetailPageProps> = ({
  application,
  channel,
  builds,
  currentDeployment,
  onDeploy,
  isDeploying,
  onBack,
  onOpenMonitor,
}) => {
  const [selectedBuildId, setSelectedBuildId] = useState<string>("");
  const selectedBuild = builds.find((b) => b.id === selectedBuildId);

  const channelDeployment =
    currentDeployment && currentDeployment.channelId === channel.id
      ? currentDeployment
      : null;

  const targetAwsPath = `s3://aws-dev/${application.name.toLowerCase()}/${channel.name}/`;

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 text-xs text-slate-500">
          <button
            onClick={onBack}
            className="transition-colors hover:text-indigo-400"
          >
            ← {application.name}
          </button>
          <span>/</span>
          <span className="text-slate-300">{channel.name}</span>
        </div>
        <h2 className="mt-2 text-lg font-semibold text-white sm:text-xl">
          {channel.name}
        </h2>
        <p className="mt-1 text-sm text-slate-400">
          Select a GitLab build artifact and transfer it to AWS dev location.
        </p>
      </div>

      {/* Channel Info */}
      <Card>
        <h3 className="text-sm font-semibold text-white">Channel Details</h3>
        <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <p className="text-[10px] font-medium uppercase tracking-wider text-slate-500">
              Application
            </p>
            <p className="mt-1 text-sm font-medium text-white">
              {application.name}
            </p>
          </div>
          <div>
            <p className="text-[10px] font-medium uppercase tracking-wider text-slate-500">
              Build Version
            </p>
            <p className="mt-1 font-mono text-sm text-indigo-300">
              {channel.buildVersion}
            </p>
          </div>
          <div>
            <p className="text-[10px] font-medium uppercase tracking-wider text-slate-500">
              Platform
            </p>
            <span
              className={`mt-1 inline-flex rounded-full border px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider ${platformBadge[channel.platform]}`}
            >
              {channel.platform}
            </span>
          </div>
          <div>
            <p className="text-[10px] font-medium uppercase tracking-wider text-slate-500">
              AWS Dev Location
            </p>
            <p
              className="mt-1 truncate font-mono text-xs text-emerald-300"
              title={targetAwsPath}
            >
              {targetAwsPath}
            </p>
          </div>
        </div>
      </Card>

      {/* Build Selection */}
      <Card>
        <label
          htmlFor="build-select"
          className="block text-sm font-semibold text-white"
        >
          Select Build from GitLab Artifacts
        </label>
        <p className="mt-1 text-xs text-slate-500">
          Branches with compiled artifacts currently stored in GitLab.
        </p>
        <select
          id="build-select"
          value={selectedBuildId}
          onChange={(e) => setSelectedBuildId(e.target.value)}
          className="mt-3 w-full rounded-lg border border-slate-700 bg-slate-950 px-4 py-2.5 text-sm text-white transition-colors focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
        >
          <option value="">-- Select a branch / build --</option>
          {builds.map((build) => (
            <option key={build.id} value={build.id}>
              {build.label}
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
                Version
              </p>
              <p className="mt-0.5 font-mono text-sm text-slate-300">
                {selectedBuild.version}
              </p>
            </div>
            <div>
              <p className="text-[10px] font-medium uppercase tracking-wider text-slate-500">
                Commit
              </p>
              <p className="mt-0.5 font-mono text-xs text-slate-300">
                {selectedBuild.commit}
              </p>
            </div>
            <div>
              <p className="text-[10px] font-medium uppercase tracking-wider text-slate-500">
                Built At
              </p>
              <p className="mt-0.5 text-xs text-slate-300">
                {selectedBuild.timestamp.toLocaleString()}
              </p>
            </div>
          </div>
        )}
      </Card>

      {/* Deploy Action */}
      <div className="flex flex-col items-start gap-4 rounded-xl border border-slate-800 bg-gradient-to-br from-slate-900/80 to-slate-950 p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">
        <div>
          <p className="text-sm font-medium text-white">Transfer to AWS Dev</p>
          <p className="text-xs text-slate-500">
            GitLab artifact will be copied to{" "}
            <span className="font-mono text-emerald-300">{targetAwsPath}</span>
          </p>
        </div>
        <Button
          variant="success"
          onClick={() => selectedBuildId && onDeploy(selectedBuildId)}
          disabled={!selectedBuildId || isDeploying}
          className="w-full !py-3 sm:w-auto"
        >
          {isDeploying ? "⏳ Transferring..." : "🚀 Send Build to AWS Sandbox"}
        </Button>
      </div>

      {/* Current Deployment for this channel */}
      {channelDeployment && (
        <Card className="border-emerald-500/30 bg-emerald-500/5">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-white">
              Active Deployment
            </h3>
            <span className="flex items-center gap-1.5 rounded-full bg-emerald-500/15 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-emerald-400">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
              Live
            </span>
          </div>
          <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div>
              <p className="text-[10px] font-medium uppercase tracking-wider text-slate-500">
                Branch
              </p>
              <p className="mt-1 truncate text-sm font-medium text-white">
                {channelDeployment.branch}
              </p>
            </div>
            <div>
              <p className="text-[10px] font-medium uppercase tracking-wider text-slate-500">
                Version
              </p>
              <p className="mt-1 font-mono text-sm text-indigo-300">
                {channelDeployment.version}
              </p>
            </div>
            <div>
              <p className="text-[10px] font-medium uppercase tracking-wider text-slate-500">
                Deployed At
              </p>
              <p className="mt-1 text-xs text-slate-300">
                {channelDeployment.deployedAt.toLocaleString()}
              </p>
            </div>
            <div>
              <p className="text-[10px] font-medium uppercase tracking-wider text-slate-500">
                AWS Path
              </p>
              <p className="mt-1 truncate font-mono text-xs text-emerald-300">
                {channelDeployment.awsPath}
              </p>
            </div>
          </div>
        </Card>
      )}

      {/* Monitor CTA */}
      <div className="flex flex-col items-start gap-3 rounded-xl border border-slate-800 bg-slate-900/40 p-4 text-xs text-slate-400 sm:flex-row sm:items-center sm:justify-between">
        <span>Check live deployment events and server status.</span>
        <button
          onClick={onOpenMonitor}
          className="text-indigo-400 transition-colors hover:text-indigo-300"
        >
          Open Live Monitor →
        </button>
      </div>
    </div>
  );
};
