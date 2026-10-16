import React, { useState } from "react";
import type { Application, Channel, Platform } from "../../types";
import { Button } from "../ui/Button";
import { Card } from "../ui/Card";

interface ChannelsPageProps {
  application: Application;
  channels: Channel[];
  onSelectChannel: (channelId: string) => void;
  onCreateChannel: (data: {
    name: string;
    buildVersion: string;
    platform: Platform;
    password: string;
  }) => void;
  onBack: () => void;
}

const PLATFORMS: Platform[] = ["Windows", "OSX", "Linux"];

const platformBadge: Record<Platform, string> = {
  Windows: "bg-sky-500/15 text-sky-400 border-sky-500/30",
  OSX: "bg-violet-500/15 text-violet-400 border-violet-500/30",
  Linux: "bg-amber-500/15 text-amber-400 border-amber-500/30",
};

export const ChannelsPage: React.FC<ChannelsPageProps> = ({
  application,
  channels,
  onSelectChannel,
  onCreateChannel,
  onBack,
}) => {
  const [showForm, setShowForm] = useState(false);
  const [formName, setFormName] = useState("");
  const [formBuild, setFormBuild] = useState("");
  const [formPlatform, setFormPlatform] = useState<Platform>("Windows");
  const [formPassword, setFormPassword] = useState("");
  const [visiblePasswords, setVisiblePasswords] = useState<
    Record<string, boolean>
  >({});

  const resetForm = () => {
    setFormName("");
    setFormBuild("");
    setFormPlatform("Windows");
    setFormPassword("");
  };

  const handleCreate = () => {
    if (!formName.trim() || !formBuild.trim() || !formPassword.trim()) return;
    onCreateChannel({
      name: formName.trim(),
      buildVersion: formBuild.trim(),
      platform: formPlatform,
      password: formPassword,
    });
    resetForm();
    setShowForm(false);
  };

  const togglePassword = (id: string) => {
    setVisiblePasswords((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const maskedPassword = (pwd: string) => "•".repeat(Math.min(pwd.length, 10));

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <button
              onClick={onBack}
              className="transition-colors hover:text-indigo-400"
            >
              ← Applications
            </button>
            <span>/</span>
            <span className="text-slate-300">{application.name}</span>
          </div>
          <h2 className="mt-2 text-lg font-semibold text-white sm:text-xl">
            {application.name} — Channels
          </h2>
          <p className="mt-1 text-sm text-slate-400">
            {channels.length} channel{channels.length !== 1 ? "s" : ""} in this
            application.
          </p>
        </div>
        <Button variant="primary" onClick={() => setShowForm((s) => !s)}>
          {showForm ? "✕ Cancel" : "+ Create Channel"}
        </Button>
      </div>

      {/* Create Channel Form */}
      {showForm && (
        <Card className="animate-fade-in border-indigo-500/30 bg-indigo-500/5">
          <h3 className="text-sm font-semibold text-white">
            Create New Channel
          </h3>
          <p className="mt-1 text-xs text-slate-400">
            Add a new testing channel to{" "}
            <span className="text-indigo-300">{application.name}</span>.
          </p>

          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-xs font-medium text-slate-300">
                Channel Name
              </label>
              <input
                type="text"
                value={formName}
                onChange={(e) => setFormName(e.target.value)}
                placeholder="e.g., riz-channel"
                className="mt-1.5 w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-white placeholder-slate-500 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-300">
                Build Version
              </label>
              <input
                type="text"
                value={formBuild}
                onChange={(e) => setFormBuild(e.target.value)}
                placeholder="e.g., 26.1.1"
                className="mt-1.5 w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-white placeholder-slate-500 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-300">
                Platform
              </label>
              <select
                value={formPlatform}
                onChange={(e) => setFormPlatform(e.target.value as Platform)}
                className="mt-1.5 w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-white focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              >
                {PLATFORMS.map((p) => (
                  <option key={p} value={p}>
                    {p}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-300">
                Password
              </label>
              <input
                type="password"
                value={formPassword}
                onChange={(e) => setFormPassword(e.target.value)}
                placeholder="Channel password"
                className="mt-1.5 w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-white placeholder-slate-500 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
            </div>
          </div>

          <div className="mt-5 flex justify-end gap-2">
            <Button
              variant="outline"
              onClick={() => {
                resetForm();
                setShowForm(false);
              }}
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              onClick={handleCreate}
              disabled={
                !formName.trim() || !formBuild.trim() || !formPassword.trim()
              }
            >
              + Create Channel
            </Button>
          </div>
        </Card>
      )}

      {/* Channels Table */}
      <div className="overflow-hidden rounded-xl border border-slate-800 bg-slate-900/40">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-slate-800 bg-slate-900/80">
              <tr className="text-xs font-medium uppercase tracking-wider text-slate-500">
                <th className="px-5 py-3.5">Channel</th>
                <th className="px-5 py-3.5">Build</th>
                <th className="px-5 py-3.5">Platform</th>
                <th className="px-5 py-3.5">Password</th>
                <th className="px-5 py-3.5 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {channels.length === 0 ? (
                <tr>
                  <td
                    colSpan={5}
                    className="px-5 py-12 text-center text-sm text-slate-500"
                  >
                    No channels yet. Click{" "}
                    <span className="text-indigo-400">+ Create Channel</span> to
                    add one.
                  </td>
                </tr>
              ) : (
                channels.map((channel) => (
                  <tr
                    key={channel.id}
                    className="transition-colors hover:bg-slate-900/60"
                  >
                    <td className="px-5 py-4">
                      <button
                        onClick={() => onSelectChannel(channel.id)}
                        className="flex items-center gap-2 text-left text-sm font-medium text-indigo-400 transition-colors hover:text-indigo-300"
                      >
                        <span className="flex h-7 w-7 items-center justify-center rounded-md bg-indigo-500/15 text-xs font-semibold text-indigo-300">
                          {channel.name.charAt(0).toUpperCase()}
                        </span>
                        {channel.name}
                      </button>
                    </td>
                    <td className="px-5 py-4 font-mono text-xs text-slate-300">
                      {channel.buildVersion}
                    </td>
                    <td className="px-5 py-4">
                      <span
                        className={`inline-flex rounded-full border px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider ${platformBadge[channel.platform]}`}
                      >
                        {channel.platform}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2 font-mono text-xs text-slate-400">
                        <span>
                          {visiblePasswords[channel.id]
                            ? channel.password
                            : maskedPassword(channel.password)}
                        </span>
                        <button
                          onClick={() => togglePassword(channel.id)}
                          className="text-slate-500 transition-colors hover:text-indigo-400"
                          title={visiblePasswords[channel.id] ? "Hide" : "Show"}
                        >
                          {visiblePasswords[channel.id] ? "🙈" : "👁"}
                        </button>
                      </div>
                    </td>
                    <td className="px-5 py-4 text-right">
                      <button
                        onClick={() => onSelectChannel(channel.id)}
                        className="rounded-md border border-slate-700 bg-slate-900 px-3 py-1.5 text-xs font-medium text-slate-300 transition-colors hover:border-indigo-500/60 hover:bg-indigo-500/10 hover:text-indigo-300"
                      >
                        Open →
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
