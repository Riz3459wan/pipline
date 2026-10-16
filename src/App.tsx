import React, { useCallback, useEffect, useState } from "react";
import { Navbar } from "./components/Navbar";
import { ApplicationsPage } from "./components/pages/ApplicationsPage";
import { ChannelsPage } from "./components/pages/ChannelsPage";
import { ChannelDetailPage } from "./components/pages/ChannelDetailPage";
import { MonitorPage } from "./components/pages/MonitorPage";
import { APPLICATIONS, CHANNELS, GITLAB_BUILDS } from "./data/mockData";
import type {
  Application,
  Channel,
  Deployment,
  LogEntry,
  LogLevel,
  TabId,
} from "./types";
import { createLogEntry } from "./utils/logUtils";

type PageView = "applications" | "channels" | "channel-detail" | "monitor";

const App: React.FC = () => {
  const [pageView, setPageView] = useState<PageView>("applications");
  const [applications] = useState<Application[]>(APPLICATIONS);
  const [channels, setChannels] = useState<Channel[]>(CHANNELS);
  const [activeAppId, setActiveAppId] = useState<string | null>(null);
  const [activeChannelId, setActiveChannelId] = useState<string | null>(null);
  const [currentDeployment, setCurrentDeployment] = useState<Deployment | null>(
    null,
  );
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [isDeploying, setIsDeploying] = useState(false);

  const activeApp = applications.find((a) => a.id === activeAppId) ?? null;
  const activeChannel = channels.find((c) => c.id === activeChannelId) ?? null;
  const appChannels = channels.filter((c) => c.applicationId === activeAppId);

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

  // ---- Navigation Handlers ----
  const handleSelectApplication = useCallback(
    (appId: string) => {
      const app = applications.find((a) => a.id === appId);
      if (!app) return;
      setActiveAppId(appId);
      setActiveChannelId(null);
      setPageView("channels");
      addLog(
        `Opened application "${app.name}" — ${app.channelsCount} channels, ${app.buildsCount} builds.`,
        "info",
      );
    },
    [applications, addLog],
  );

  const handleBackToApplications = useCallback(() => {
    setPageView("applications");
    setActiveAppId(null);
    setActiveChannelId(null);
  }, []);

  const handleSelectChannel = useCallback(
    (channelId: string) => {
      const channel = channels.find((c) => c.id === channelId);
      if (!channel) return;
      setActiveChannelId(channelId);
      setPageView("channel-detail");
      addLog(
        `Opened channel "${channel.name}" (v${channel.buildVersion} / ${channel.platform}).`,
        "info",
      );
    },
    [channels, addLog],
  );

  const handleBackToChannels = useCallback(() => {
    setPageView("channels");
    setActiveChannelId(null);
  }, []);

  const handleCreateChannel = useCallback(
    (data: {
      name: string;
      buildVersion: string;
      platform: "Windows" | "OSX" | "Linux";
      password: string;
    }) => {
      if (!activeAppId) return;

      const exists = channels.some(
        (c) =>
          c.applicationId === activeAppId &&
          c.name.toLowerCase() === data.name.toLowerCase(),
      );
      if (exists) {
        addLog(
          `Channel "${data.name}" already exists in this application.`,
          "warn",
        );
        return;
      }

      const newChannel: Channel = {
        id: `ch-${Date.now()}`,
        applicationId: activeAppId,
        name: data.name,
        buildVersion: data.buildVersion,
        platform: data.platform,
        password: data.password,
        createdAt: new Date(),
      };
      setChannels((prev) => [...prev, newChannel]);
      addLog(
        `Created new channel "${data.name}" (v${data.buildVersion} / ${data.platform}) in "${activeApp?.name}".`,
        "success",
      );
    },
    [activeAppId, activeApp, channels, addLog],
  );

  // ---- Deploy Handler ----
  const handleDeploy = useCallback(
    (buildId: string) => {
      const build = GITLAB_BUILDS.find((b) => b.id === buildId);
      if (!build || !activeChannel || !activeApp) return;

      setIsDeploying(true);
      const awsPath = `s3://aws-dev/${activeApp.name.toLowerCase()}/${activeChannel.name}/`;

      addLog(
        `Fetching build "${build.branch}" (${build.commit}) from GitLab artifacts...`,
        "info",
      );
      addLog(`Target AWS Dev location: ${awsPath}`, "info");

      setTimeout(() => {
        addLog(`Copying artifact "${build.label}" to AWS dev...`, "info");
      }, 600);

      setTimeout(() => {
        const deployment: Deployment = {
          id: `dep-${Date.now()}`,
          applicationId: activeApp.id,
          applicationName: activeApp.name,
          channelId: activeChannel.id,
          channelName: activeChannel.name,
          branch: build.branch,
          commit: build.commit,
          version: build.version,
          deployedAt: new Date(),
          status: "success",
          awsPath,
        };
        setCurrentDeployment(deployment);
        setIsDeploying(false);
        addLog(`Build "${build.branch}" transferred successfully.`, "success");
        addLog(
          `Active on channel "${activeChannel.name}" at ${awsPath}`,
          "success",
        );
      }, 2000);
    },
    [activeChannel, activeApp, addLog],
  );

  const handleReset = useCallback(() => {
    setCurrentDeployment(null);
    setIsDeploying(false);
    addLog("🔄 RESET TO PRODUCTION: Flushing AWS sandbox...", "warn");
    setPageView("monitor");
    setTimeout(() => {
      addLog(
        "AWS sandbox flushed. Stable master/production build restored.",
        "success",
      );
      addLog("All testing deployments have been cleared.", "info");
    }, 600);
  }, [addLog]);

  const handleClearLogs = useCallback(() => setLogs([]), []);

  const handleOpenMonitor = useCallback(() => {
    setPageView("monitor");
  }, []);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 antialiased">
      <Navbar
        pageView={pageView}
        onNavigate={setPageView}
        onReset={handleReset}
        isDeploying={isDeploying}
        breadcrumbs={{
          app: activeApp,
          channel: activeChannel,
        }}
        onBackToApplications={handleBackToApplications}
        onBackToChannels={handleBackToChannels}
      />

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {pageView === "applications" && (
          <ApplicationsPage
            applications={applications}
            onSelectApplication={handleSelectApplication}
          />
        )}

        {pageView === "channels" && activeApp && (
          <ChannelsPage
            application={activeApp}
            channels={appChannels}
            onSelectChannel={handleSelectChannel}
            onCreateChannel={handleCreateChannel}
            onBack={handleBackToApplications}
          />
        )}

        {pageView === "channel-detail" && activeApp && activeChannel && (
          <ChannelDetailPage
            application={activeApp}
            channel={activeChannel}
            builds={GITLAB_BUILDS}
            currentDeployment={currentDeployment}
            onDeploy={handleDeploy}
            isDeploying={isDeploying}
            onBack={handleBackToChannels}
            onOpenMonitor={handleOpenMonitor}
          />
        )}

        {pageView === "monitor" && (
          <MonitorPage
            currentDeployment={currentDeployment}
            logs={logs}
            onClearLogs={handleClearLogs}
            onBackToApplications={handleBackToApplications}
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
