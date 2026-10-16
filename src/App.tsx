import React, { useCallback, useEffect, useState } from "react";
import { Navbar } from "./components/Navbar";
import { ChannelsPage } from "./components/pages/ChannelsPage";
import { DeployPage } from "./components/pages/DeployPage";
import { MonitorPage } from "./components/pages/MonitorPage";
import { INITIAL_CHANNELS, MOCK_BUILDS } from "./data/mockData";
import type { Channel, Deployment, LogEntry, LogLevel, TabId } from "./types";
import { createLogEntry } from "./utils/logUtils";

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabId>("channels");
  const [channels, setChannels] = useState<Channel[]>(INITIAL_CHANNELS);
  const [activeChannelId, setActiveChannelId] = useState<string | null>(
    INITIAL_CHANNELS[0]?.id ?? null,
  );
  const [selectedBuildId, setSelectedBuildId] = useState<string | null>(null);
  const [currentDeployment, setCurrentDeployment] = useState<Deployment | null>(
    null,
  );
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [isDeploying, setIsDeploying] = useState(false);

  const activeChannel = channels.find((c) => c.id === activeChannelId) ?? null;

  const addLog = useCallback((message: string, level: LogLevel = "info") => {
    setLogs((prev) => [...prev, createLogEntry(message, level)]);
  }, []);

  useEffect(() => {
    addLog("Pipeline Server initialized. AWS Testing Bridge ready.", "info");
    addLog(
      "Production build (master) is currently running on AWS sandbox.",
      "success",
    );
  }, [addLog]);

  const handleCreateChannel = useCallback(
    (name: string) => {
      const exists = channels.some(
        (c) => c.name.toLowerCase() === name.toLowerCase(),
      );
      if (exists) {
        addLog(`Channel "${name}" already exists. Creation skipped.`, "warn");
        return;
      }
      const newChannel: Channel = {
        id: `c-${Date.now()}`,
        name,
        createdAt: new Date(),
        isActive: false,
      };
      setChannels((prev) => [...prev, newChannel]);
      // Auto-select newly created channel
      setActiveChannelId(newChannel.id);
      addLog(`Created new testing channel: "${name}"`, "success");
      addLog(`Auto-selected "${name}" as active channel.`, "info");

      // 🔗 AUTO-NAVIGATE: Go to Deploy page after creating channel
      setTimeout(() => {
        addLog("Navigating to Deploy page...", "info");
        setActiveTab("deploy");
      }, 700);
    },
    [channels, addLog],
  );

  const handleSelectChannel = useCallback(
    (id: string) => {
      setActiveChannelId(id);
      const channel = channels.find((c) => c.id === id);
      if (channel) {
        addLog(`Switched active channel context to "${channel.name}".`, "info");

        // 🔗 AUTO-NAVIGATE: Go to Deploy page after selecting channel
        setTimeout(() => {
          addLog(
            `Ready to deploy. Navigating to Deploy page for "${channel.name}"...`,
            "info",
          );
          setActiveTab("deploy");
        }, 500);
      }
    },
    [channels, addLog],
  );

  const handleDeploy = useCallback(() => {
    const build = MOCK_BUILDS.find((b) => b.id === selectedBuildId);
    if (!build || !activeChannel) return;

    setIsDeploying(true);
    addLog(
      `Initiating deployment of "${build.branch}" (${build.commit}) to AWS sandbox...`,
      "info",
    );
    addLog(`Target channel: ${activeChannel.name}`, "info");

    setTimeout(() => {
      const deployment: Deployment = {
        id: `dep-${Date.now()}`,
        channel: activeChannel.name,
        branch: build.branch,
        commit: build.commit,
        deployedAt: new Date(),
        status: "success",
      };
      setCurrentDeployment(deployment);
      setIsDeploying(false);
      addLog(
        `Build "${build.branch}" deployed successfully to AWS sandbox.`,
        "success",
      );
      addLog(
        `Active deployment: ${build.branch} (${build.commit}) on channel "${activeChannel.name}".`,
        "success",
      );
      addLog("Auto-navigating to Live Monitor...", "info");

      // 🔗 AUTO-NAVIGATE: Go to Monitor page after deployment
      setActiveTab("monitor");
    }, 1800);
  }, [selectedBuildId, activeChannel, addLog]);

  const handleReset = useCallback(() => {
    setCurrentDeployment(null);
    setIsDeploying(false);
    addLog("🔄 RESET TO PRODUCTION: Flushing AWS sandbox...", "warn");

    // 🔗 AUTO-NAVIGATE: Go to Monitor to see reset logs
    setActiveTab("monitor");

    setTimeout(() => {
      addLog(
        "AWS sandbox flushed. Stable master/production build restored.",
        "success",
      );
      addLog("All testing deployments have been cleared.", "info");
    }, 600);
  }, [addLog]);

  const handleClearLogs = useCallback(() => setLogs([]), []);

  // 🔗 Helper: Quick navigate to Channels from other pages
  const goToChannels = useCallback(() => setActiveTab("channels"), []);
  const goToDeploy = useCallback(() => setActiveTab("deploy"), []);
  const goToMonitor = useCallback(() => setActiveTab("monitor"), []);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 antialiased">
      <Navbar
        activeTab={activeTab}
        onTabChange={setActiveTab}
        onReset={handleReset}
        isDeploying={isDeploying}
        hasActiveChannel={!!activeChannel}
        hasDeployment={!!currentDeployment}
      />

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {activeTab === "channels" && (
          <ChannelsPage
            channels={channels}
            activeChannelId={activeChannelId}
            onSelectChannel={handleSelectChannel}
            onCreateChannel={handleCreateChannel}
            onGoToDeploy={goToDeploy}
          />
        )}

        {activeTab === "deploy" && (
          <DeployPage
            activeChannel={activeChannel}
            builds={MOCK_BUILDS}
            selectedBuildId={selectedBuildId}
            onSelectBuild={setSelectedBuildId}
            onDeploy={handleDeploy}
            isDeploying={isDeploying}
            onGoToChannels={goToChannels}
            onGoToMonitor={goToMonitor}
          />
        )}

        {activeTab === "monitor" && (
          <MonitorPage
            currentDeployment={currentDeployment}
            logs={logs}
            onClearLogs={handleClearLogs}
            onGoToDeploy={goToDeploy}
            onGoToChannels={goToChannels}
          />
        )}
      </main>

      <footer className="border-t border-slate-800 py-6">
        <div className="mx-auto max-w-7xl px-4 text-center text-xs text-slate-600 sm:px-6 lg:px-8">
          Pipeline Server & AWS Testing Bridge Dashboard — Internal Tooling
        </div>
      </footer>
    </div>
  );
};

export default App;
