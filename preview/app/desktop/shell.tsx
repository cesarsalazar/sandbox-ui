import type { ReactNode } from "react";
import { Avatar, SideNav, SideNavItem, SideNavLayout, SideNavSubItem } from "../../../src";
import { Code, Gift, LogOut, Mail, Pin, Shield, Stamp, Users } from "../icons";

// The preview's desktop app frame: members' side menu on sandbox-ui.
export function DesktopShell({ active, width, children }: { active: string; width?: "narrow" | "default" | "wide"; children: ReactNode }) {
  const nav = (
    <SideNav
      home="/desktop"
      person={
        <SideNavItem href="/desktop" icon={<Avatar name="Ana López" size="xs" />} active={active === "me"}>
          Ana
        </SideNavItem>
      }
      footer={
        <SideNavItem icon={<LogOut />} onClick={undefined}>
          Log out
        </SideNavItem>
      }
    >
      <SideNavItem href="/desktop" icon={<Users />} active={active === "members"}>
        Members
      </SideNavItem>
      <SideNavItem href="#" icon={<Stamp />}>
        Postcards
      </SideNavItem>
      <SideNavItem href="#" icon={<Gift />}>
        Gift
      </SideNavItem>
      <SideNavItem href="/desktop/hubs" icon={<Pin />} active={active === "hubs"}>
        Hubs
      </SideNavItem>
      <SideNavItem href="#" icon={<Mail />}>
        Broadcasts
      </SideNavItem>
      <SideNavItem href="#" icon={<Shield />}>
        Roles
      </SideNavItem>
      <SideNavItem
        href="/desktop/developers"
        icon={<Code />}
        active={active === "developers"}
        subItems={
          <>
            <SideNavSubItem href="#" active>
              Guide
            </SideNavSubItem>
            <SideNavSubItem href="#">Your apps</SideNavSubItem>
            <SideNavSubItem href="#">API reference</SideNavSubItem>
          </>
        }
      >
        Developers
      </SideNavItem>
    </SideNav>
  );
  return (
    <SideNavLayout nav={nav} width={width}>
      {children}
    </SideNavLayout>
  );
}
