"use client";

import { OfflineScreen } from "../../../src";

// What the installed app shows when a page can't be reached.
export default function Offline() {
  return <OfflineScreen appName="Sandbox" onRetry={() => {}} />;
}
