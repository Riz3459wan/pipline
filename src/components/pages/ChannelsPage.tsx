import React, { useState } from "react";
import type { Channel } from "../../types";
import { Button } from "../ui/Button";
import { Card } from "../ui/Card";

interface ChannelsPageProps {
  channels: Channel[];
  activeChannelId: string | null;
  onSelectChannel: (id: string) => void;
  onCreateChannel: (name: string) => void;
  onGoToDeploy: () => void;
}

export const ChannelsPage: React.FC<ChannelsPageProps> = ({
  channels,
  activeChannelId,
  onSelectChannel,
  onCreateChannel,
  onGoToDeploy,
}) => {
  const [newChannelName, setNewChannelName] = useState("");
  const activeChannel = channels.find((c) => c.id === activeChannelId);

  const handleCreate = () => {
    const trimmed = newChannelName.trim();
    if (!trimmed) return;
    onCreateChannel(trimmed);
    setNewChannelName("");
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") handleCreate();
  };

  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <h2 className="text-lg font-semibold text-white sm:text-xl">
          Testing Channels
        </h2>
        <p className="mt-1 text-sm text-slate-400">
          Create and manage isolated testing environments. Click a channel to
          set it as the active deployment target.
        </p>
      </div>

      <Card>
        <label
          htmlFor="channel-name"
          className="block text-sm font-medium text-slate-300"
        >
          Create New Testing Channel
        </label>
        <div className="mt-3 flex flex-col gap-3 sm:flex-row">
          <input
            id="channel-name"
            type="text"
            value={newChannelName}
            onChange={(e) => setNewChannelName(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="e.g., mobile-qa, backend-uat"
            className="flex-1 rounded-lg border border-slate-700 bg-slate-950 px-4 py-2.5 text-sm text-white placeholder-slate-500 transition-colors focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
          />
          <Button onClick={handleCreate} disabled={!newChannelName.trim()}>
            + Create Channel
          </Button>
        </div>
        <p className="mt-2 text-xs text-slate-500">
          💡 Creating a channel auto-selects it and navigates to Deploy.
        </p>
      </Card>

      <div>
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-sm font-medium text-slate-400">
            Existing Channels ({channels.length})
          </h3>
          {activeChannel && (
            <span className="text-xs text-emerald-400">
              ✓ Active: {activeChannel.name}
            </span>
          )}
        </div>
        {channels.length === 0 ? (
          <div className="rounded-xl border border-dashed border-slate-700 bg-slate-900/30 p-12 text-center">
            <p className="text-sm text-slate-500">
              No channels yet. Create your first testing channel above.
            </p>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {channels.map((channel) => {
              const isActive = channel.id === activeChannelId;
              return (
                <button
                  key={channel.id}
                  onClick={() => onSelectChannel(channel.id)}
                  className={`group relative overflow-hidden rounded-xl border p-5 text-left transition-all focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-slate-950 ${
                    isActive
                      ? "border-indigo-500/60 bg-indigo-500/10 shadow-lg shadow-indigo-500/10"
                      : "border-slate-800 bg-slate-900/50 hover:border-slate-700 hover:bg-slate-900"
                  }`}
                >
                  {isActive && (
                    <div className="absolute right-3 top-3">
                      <span className="flex items-center gap-1.5 rounded-full bg-emerald-500/15 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-emerald-400">
                        <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                        Active
                      </span>
                    </div>
                  )}
                  <div className="flex items-center gap-3">
                    <div
                      className={`flex h-10 w-10 items-center justify-center rounded-lg text-lg font-semibold ${
                        isActive
                          ? "bg-indigo-500/20 text-indigo-300"
                          : "bg-slate-800 text-slate-400"
                      }`}
                    >
                      {channel.name.charAt(0).toUpperCase()}
                    </div>
                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold text-white">
                        {channel.name}
                      </p>
                      <p className="text-xs text-slate-500">
                        Created {channel.createdAt.toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* 🔗 Next Step CTA */}
      {activeChannel && (
        <div className="flex flex-col items-start gap-4 rounded-xl border border-indigo-500/30 bg-gradient-to-br from-indigo-500/10 to-slate-950 p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">
          <div>
            <p className="text-sm font-medium text-white">
              Channel ready: {activeChannel.name}
            </p>
            <p className="text-xs text-slate-400">
              Next step: Select a build and deploy to AWS sandbox.
            </p>
          </div>
          <Button
            variant="primary"
            onClick={onGoToDeploy}
            className="w-full sm:w-auto"
          >
            Continue to Deploy →
          </Button>
        </div>
      )}
    </div>
  );
};
