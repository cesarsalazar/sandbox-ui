"use client";

import { useSyncExternalStore, type ReactNode } from "react";
import Link from "next/link";
import { LuCalendarDays, LuKeyRound, LuLandmark, LuLayers, LuLayoutGrid, LuRocket } from "react-icons/lu";
import { Avatar, SideNav, SideNavGroup, SideNavItem, SideNavLayout, TabBar, TabBarItem, type Platform } from "../../src";
import { Gift, LogOut, Mail, Pin, Shield, Stamp, Users } from "./icons";

// A switch in the preview's address (?platform=android, ?install=1), read once
// the page is in the browser so the server's render and the first paint agree.
export function useQuery(name: string): string | null {
  return useSyncExternalStore(
    () => () => {},
    () => new URLSearchParams(window.location.search).get(name),
    () => null,
  );
}

// iPhone's tab bar unless the address asks for Android's.
function usePlatform(): Platform {
  return useQuery("platform") === "android" ? "android" : "ios";
}

// The preview's app frame, as members has it: the side menu on desktop (your
// page, the main sections, then quick links, admin and developers) and the tab
// bar on a phone. Every screen is one page that works at both sizes.
export function AppShell({ active, width, children }: { active: string; width?: "narrow" | "default" | "wide"; children: ReactNode }) {
  const item = (key: string, href: string, icon: ReactNode, label: string) => (
    <SideNavItem as={Link} href={href} icon={icon} active={active === key}>
      {label}
    </SideNavItem>
  );
  const nav = (
    <SideNav
      home="/members"
      as={Link}
      person={
        <SideNavItem as={Link} href="/profile" icon={<Avatar name="Ana López" size="xs" />} active={active === "me"}>
          Ana
        </SideNavItem>
      }
      footer={
        <SideNavItem icon={<LogOut />} onClick={undefined}>
          Log out
        </SideNavItem>
      }
    >
      {item("members", "/members", <Users />, "Members")}
      {item("postcards", "#", <Stamp />, "Postcards")}
      <SideNavGroup label="Quick links" storageKey="preview.nav.quick-links">
        <SideNavItem href="https://events.sandbox.is" external icon={<LuCalendarDays size={18} />}>
          Events
        </SideNavItem>
        <SideNavItem href="https://finance.sandbox.is" external icon={<LuLandmark size={18} />}>
          Finance
        </SideNavItem>
        {item("gift", "#", <Gift />, "Gift")}
      </SideNavGroup>
      <SideNavGroup label="Admin" storageKey="preview.nav.admin">
        {item("broadcasts", "#", <Mail />, "Broadcasts")}
        {item("hubs", "/hubs", <Pin />, "Hubs")}
        {item("roles", "#", <Shield />, "Roles")}
      </SideNavGroup>
      <SideNavGroup label="Developers" storageKey="preview.nav.developers">
        {item("developers", "#", <LuRocket size={18} />, "Get started")}
        {item("dev-apps", "#", <LuLayoutGrid size={18} />, "Your apps")}
        {item("dev-all", "#", <LuLayers size={18} />, "All apps")}
        {item("dev-access", "#", <LuKeyRound size={18} />, "Manage access")}
      </SideNavGroup>
    </SideNav>
  );
  const platform = usePlatform();
  const w = (on: boolean) => (on ? 2.25 : 1.75);
  const tabs = (
    <TabBar platform={platform}>
      <TabBarItem as={Link} href="/members" icon={<Users size={22} strokeWidth={w(active === "members")} />} active={active === "members"}>
        Members
      </TabBarItem>
      <TabBarItem href="#" icon={<Stamp size={22} strokeWidth={w(active === "postcards")} />} active={active === "postcards"}>
        Postcards
      </TabBarItem>
      <TabBarItem as={Link} href="/profile" icon={<Avatar name="Ana López" size="xs" />} active={active === "me"}>
        Profile
      </TabBarItem>
    </TabBar>
  );
  return (
    <SideNavLayout nav={<>{nav}{tabs}</>} width={width}>
      {children}
    </SideNavLayout>
  );
}
