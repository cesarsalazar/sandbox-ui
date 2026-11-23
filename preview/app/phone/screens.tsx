"use client";

import { useState, type ReactNode } from "react";
import {
  Avatar,
  Button,
  DetailList,
  Dialog,
  DialogActions,
  Field,
  IconButton,
  Input,
  InstallPrompt,
  LargeTitle,
  OfflineScreen,
  PersonList,
  PersonRow,
  PhoneBar,
  PhoneBarBack,
  Row,
  RowGroup,
  SearchInput,
  Select,
  ShareIcon,
  Switch,
  SwitchRow,
  TabBar,
  TabBarItem,
  WelcomeAction,
  WelcomeScreen,
  type Platform,
} from "../../../src";
import { Bell, Card, Gear, Gift, Stamp, Users } from "../icons";
import { PEOPLE } from "../people";

function Tabs({ platform, active }: { platform: Platform; active: string }) {
  const w = (on: boolean) => (on ? 2.25 : 1.75);
  return (
    <TabBar platform={platform}>
      <TabBarItem href="/phone/directory" icon={<Users size={22} strokeWidth={w(active === "members")} />} active={active === "members"}>
        Members
      </TabBarItem>
      <TabBarItem href="#" icon={<Stamp size={22} strokeWidth={w(active === "postcards")} />} active={active === "postcards"}>
        Postcards
      </TabBarItem>
      <TabBarItem href="#" icon={<Avatar name="Ana López" size="xs" />} active={active === "profile"}>
        Profile
      </TabBarItem>
    </TabBar>
  );
}

function Screen({ children }: { children: ReactNode }) {
  return <main className="px-safe pb-32">{children}</main>;
}

function Directory({ platform, install = false }: { platform: Platform; install?: boolean }) {
  return (
    <>
      <Screen>
        <LargeTitle>Members</LargeTitle>
        {install && <InstallPrompt platform={platform} appName="Sandbox" className="mt-4" />}
        <div className="mt-4 flex flex-col gap-3">
          <SearchInput placeholder="Search members" />
          <Select aria-label="Hub" defaultValue="">
            <option value="">All hubs</option>
          </Select>
        </div>
        <PersonList className="mt-3">
          {PEOPLE.slice(0, 9).map((p) => (
            <PersonRow key={p.first} href="#" name={`${p.first} ${p.last}`} role={p.role} place={p.place} former={p.former} />
          ))}
        </PersonList>
      </Screen>
      <Tabs platform={platform} active="members" />
    </>
  );
}

function Profile({ platform, sheet = false }: { platform: Platform; sheet?: boolean }) {
  const [editing, setEditing] = useState(sheet);
  return (
    <>
      <Screen>
        <div className="flex flex-col items-center gap-3 pt-safe text-center">
          <Avatar name="Ana López" size="2xl" className="mt-10" />
          <h1 className="pt-3 font-serif text-[44px] leading-[1.02] text-ink">Ana López</h1>
          <div className="flex flex-col gap-0.5 text-[17px]">
            <p className="text-ink-muted">Mexico City</p>
            <p className="font-medium text-brand-ink">Board member</p>
          </div>
        </div>
        <div className="mt-6 flex items-center gap-3">
          <Button size="lg" className="flex-1" onClick={() => setEditing(true)}>
            Edit profile
          </Button>
          <IconButton label="Share" variant="outline" size="lg">
            <ShareIcon size={20} />
          </IconButton>
          <IconButton label="Account" variant="outline" size="lg">
            <Gear size={20} />
          </IconButton>
        </div>
        <section className="mt-8 flex flex-col gap-3">
          <h2 className="text-lg font-semibold text-ink">In Sandbox</h2>
          <DetailList
            items={[
              { label: "Member since", value: "2016" },
              { label: "Entry hub", value: "Mexico City" },
              { label: "Current city", value: "Mexico City" },
            ]}
          />
        </section>
      </Screen>
      <Tabs platform={platform} active="profile" />
      <Dialog
        open={editing}
        onClose={() => setEditing(false)}
        title="Edit profile"
        footer={
          <DialogActions>
            <Button variant="ghost" onClick={() => setEditing(false)}>
              Cancel
            </Button>
            <Button onClick={() => setEditing(false)}>Save</Button>
          </DialogActions>
        }
      >
        <Field label="Preferred first name" hint="If you go by another name, like Alex instead of Alexander.">
          {(f) => <Input id={f.id} aria-describedby={f.describedBy} defaultValue="" />}
        </Field>
        <Field label="Current city">{(f) => <Input id={f.id} defaultValue="Mexico City" />}</Field>
      </Dialog>
    </>
  );
}

function Account() {
  const [postcards, setPostcards] = useState(true);
  const [reminders, setReminders] = useState(false);
  return (
    <>
      <PhoneBar left={<PhoneBarBack href="/phone/profile" label="Profile" />} title="Account" />
      <Screen>
        <div className="flex flex-col gap-8 pt-6">
          <RowGroup title="Membership">
            <Row href="#" icon={<Card size={20} />} label="Payment method" value="Visa ending 4242" />
            <Row href="#" icon={<Gift size={20} />} label="Your gift" value="Monthly" />
          </RowGroup>
          <RowGroup title="Email" footer="Sandbox never shares your address.">
            <SwitchRow label="Postcards" description="When someone sends you one" control={<Switch checked={postcards} onChange={(e) => setPostcards(e.target.checked)} />} />
            <SwitchRow label="Account reminders" control={<Switch checked={reminders} onChange={(e) => setReminders(e.target.checked)} />} />
          </RowGroup>
          <RowGroup>
            <Row href="#" icon={<Bell size={20} />} label="Notifications" />
            <Row onClick={() => {}} label="Log out" danger />
          </RowGroup>
        </div>
      </Screen>
    </>
  );
}

export function PhoneScreen({ screen, platform }: { screen: string; platform: Platform }) {
  switch (screen) {
    case "welcome":
      return (
        <WelcomeScreen
          title="Welcome to Sandbox"
          description="Find other members, send postcards, and keep your profile up to date."
          action={<WelcomeAction href="#">Sign in</WelcomeAction>}
          secondary={
            <a href="#" className="underline underline-offset-4">
              What is Sandbox?
            </a>
          }
        />
      );
    case "install":
      return <Directory platform={platform} install />;
    case "offline":
      return <OfflineScreen appName="Sandbox" onRetry={() => {}} />;
    case "profile":
      return <Profile platform={platform} />;
    case "sheet":
      return <Profile platform={platform} sheet />;
    case "account":
      return <Account />;
    default:
      return <Directory platform={platform} />;
  }
}
