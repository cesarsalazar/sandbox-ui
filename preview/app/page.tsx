"use client";

import { useState, type ReactNode } from "react";
import {
  Avatar,
  Button,
  ChoiceList,
  ConfirmDialog,
  CopyButton,
  CopyIconButton,
  CopyText,
  DetailList,
  Dialog,
  DialogActions,
  Field,
  IconButton,
  Input,
  MemberCard,
  MemberGrid,
  MenuDivider,
  MenuItem,
  Pagination,
  PencilIcon,
  ProfileMenu,
  RowActions,
  SearchInput,
  SegmentedControl,
  ShareIcon,
  Skeleton,
  Table,
  TBody,
  Td,
  TdActions,
  Th,
  THead,
  Tr,
  useToast,
  XIcon,
} from "../../src";
import { Archive, Trash } from "./icons";
import { PEOPLE } from "./people";

const PHONES: { screen: string; label: string; platform?: "android" }[] = [
  { screen: "welcome", label: "Welcome" },
  { screen: "install", label: "Add to Home Screen" },
  { screen: "directory", label: "Directory (iPhone)" },
  { screen: "directory", label: "Directory (Android)", platform: "android" },
  { screen: "profile", label: "Your profile" },
  { screen: "sheet", label: "Sheet" },
  { screen: "account", label: "Account settings" },
  { screen: "offline", label: "Offline" },
];

function Block({ id, title, note, children }: { id: string; title: string; note?: ReactNode; children: ReactNode }) {
  return (
    <section id={id} className="flex flex-col gap-5 border-t border-line pt-10">
      <div className="flex max-w-2xl flex-col gap-1">
        <h2 className="text-2xl font-semibold tracking-tight text-ink">{title}</h2>
        {note && <p className="text-[15px] leading-relaxed text-ink-muted">{note}</p>}
      </div>
      {children}
    </section>
  );
}

export default function Preview() {
  const toast = useToast();
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const [view, setView] = useState<"active" | "archived">("active");
  const [page, setPage] = useState(3);
  const [dialog, setDialog] = useState(false);
  const [confirm, setConfirm] = useState(false);
  const flip = (t: "light" | "dark") => {
    setTheme(t);
    document.documentElement.dataset.theme = t;
  };

  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-12 px-6 py-14">
      <header className="flex flex-wrap items-end justify-between gap-6">
        <div className="flex flex-col gap-2">
          <p className="text-sm font-medium text-brand-ink">sandbox-ui preview</p>
          <h1 className="text-[34px] font-semibold tracking-tight text-ink">Components for Sandbox apps</h1>
          <p className="max-w-2xl text-[17px] leading-relaxed text-ink-muted">
            Every component, working. The phone screens are real pages at iPhone size; the desktop examples open full screen.
          </p>
          <div className="flex flex-col items-start gap-2 pt-2">
            <a className="text-[15px] font-medium text-brand-ink underline underline-offset-4" href="/desktop">
              Desktop: directory
            </a>
            <a className="text-[15px] font-medium text-brand-ink underline underline-offset-4" href="/desktop/hubs">
              Desktop: hubs table and dialogs
            </a>
            <a className="text-[15px] font-medium text-brand-ink underline underline-offset-4" href="/desktop/developers">
              Desktop: section with sub-pages
            </a>
          </div>
        </div>
        <SegmentedControl
          label="Theme"
          value={theme}
          onChange={flip}
          options={[
            { value: "light", label: "Light" },
            { value: "dark", label: "Dark" },
          ]}
        />
      </header>

      <Block id="phone" title="On a phone, installed" note="Each frame is a full page at iPhone 15 size, safe areas and all. The welcome, install and offline screens are what makes the app work as an installed app.">
        <div className="-mx-6 flex snap-x gap-6 overflow-x-auto px-6 pb-4">
          {PHONES.map((p) => (
            <figure key={p.label} className="flex shrink-0 snap-start flex-col gap-2">
              <figcaption className="text-sm font-medium text-ink-muted">{p.label}</figcaption>
              <div className="overflow-hidden rounded-[44px] border-[10px] border-[#1b1b22] bg-paper shadow-[0_12px_40px_rgb(10_10_20/0.18)]">
                <iframe
                  title={p.label}
                  src={`/phone/${p.screen}${p.platform ? "?platform=android" : ""}`}
                  className="block h-[852px] w-[393px] origin-top-left"
                  style={{ zoom: 0.62 }}
                />
              </div>
            </figure>
          ))}
        </div>
      </Block>

      <Block id="cards" title="Member cards" note="People in a directory on desktop and tablet. Same height with or without a role; someone who has left shows in grey.">
        <MemberGrid>
          {PEOPLE.slice(0, 5)
            .concat(PEOPLE[10]!)
            .map((p) => (
              <MemberCard key={p.first} href="#" firstName={p.first} lastName={p.last} place={p.place} role={p.role} status={p.status} former={p.former} />
            ))}
        </MemberGrid>
      </Block>

      <Block id="table" title="Tables and row actions" note="Hover a row: its actions appear. They also appear when a keyboard reaches them, and always on touch screens.">
        <Table>
          <THead>
            <Th>Subject</Th>
            <Th>Audience</Th>
            <Th align="end">Sent</Th>
            <Th>
              <span className="sr-only">Actions</span>
            </Th>
          </THead>
          <TBody>
            {[
              ["General Assembly 2026", "Everyone", "1,753"],
              ["Board notes: October", "Board", "12"],
              ["Welcome, new members", "New this month", "48"],
            ].map(([s, a, n]) => (
              <Tr key={s} onClick={() => toast(`Opens “${s}”`)}>
                <Td className="font-medium">{s}</Td>
                <Td muted>{a}</Td>
                <Td align="end" muted className="tabular">
                  {n}
                </Td>
                <TdActions>
                  <RowActions>
                    <IconButton label="Edit" size="sm" onClick={() => toast("Edit")}>
                      <PencilIcon size={16} />
                    </IconButton>
                    <IconButton label="Archive" size="sm" onClick={() => toast("Archived")}>
                      <Archive size={16} />
                    </IconButton>
                    <IconButton label="Delete" size="sm" variant="danger" onClick={() => setConfirm(true)}>
                      <Trash size={16} />
                    </IconButton>
                  </RowActions>
                </TdActions>
              </Tr>
            ))}
          </TBody>
        </Table>
      </Block>

      <Block id="dialogs" title="Dialogs and confirmations" note="A box on desktop, a sheet from the bottom on a phone (see the Sheet frame above). The confirm replaces the browser’s own box.">
        <div className="flex flex-wrap gap-2">
          <Button onClick={() => setDialog(true)}>Open a dialog</Button>
          <Button variant="secondary" onClick={() => setConfirm(true)}>
            Ask to confirm
          </Button>
          <Button variant="secondary" onClick={() => toast("Link copied")}>
            Show a toast
          </Button>
          <Button variant="secondary" onClick={() => toast("Postcard sent", "success")}>
            Success toast
          </Button>
        </div>
      </Block>

      <Block id="controls" title="Controls">
        <div className="grid gap-8 md:grid-cols-2">
          <div className="flex flex-col gap-3">
            <p className="text-sm font-medium text-ink-muted">Segmented control</p>
            <SegmentedControl
              label="Show"
              value={view}
              onChange={setView}
              options={[
                { value: "active", label: "Active" },
                { value: "archived", label: "Archived" },
              ]}
            />
          </div>
          <div className="flex flex-col gap-3">
            <p className="text-sm font-medium text-ink-muted">One answer from a short list</p>
            <ChoiceList
              name="approve"
              legend="Do you approve this change?"
              options={[
                { value: "approve", label: "Approve" },
                { value: "reject", label: "Reject" },
                { value: "abstain", label: "Abstain", description: "Counts towards turnout, not the result." },
              ]}
            />
          </div>
          <div className="flex flex-col gap-3">
            <p className="text-sm font-medium text-ink-muted">Search with a count</p>
            <SearchInput placeholder="Search by name, city or email" count="1–50 of 1,775" />
          </div>
          <div className="flex flex-col gap-3">
            <p className="text-sm font-medium text-ink-muted">Pagination</p>
            <Pagination page={page} pages={36} onChange={setPage} />
          </div>
          <div className="flex flex-col gap-3">
            <p className="text-sm font-medium text-ink-muted">Copy</p>
            <div className="flex gap-2">
              <CopyButton text="https://sandbox.is/ana-lopez" label="Copy link" />
              <CopyButton text="example" label="Copy key" variant="primary" />
            </div>
            <p className="text-sm text-ink-muted">A value whose icon appears on hover</p>
            <CopyText text="https://events.sandbox.is/auth/callback" label="Copy callback URL" />
            <p className="text-sm text-ink-muted">A list: copy in each row&apos;s actions, on hover</p>
            <ul className="divide-y divide-line rounded-field border border-line">
              {["{{preferred_name}}", "{{hub}}", "{{profile_url}}"].map((v) => (
                <li key={v} className="group/row flex items-center gap-3 px-3.5 py-1 hover:bg-sunken/60">
                  <code className="flex-1 font-mono text-sm">{v}</code>
                  <RowActions>
                    <CopyIconButton text={v} label={`Copy ${v}`} />
                  </RowActions>
                </li>
              ))}
            </ul>
          </div>
          <div className="flex flex-col gap-3">
            <p className="text-sm font-medium text-ink-muted">Icon buttons</p>
            <div className="flex items-center gap-2">
              <IconButton label="Edit">
                <PencilIcon size={18} />
              </IconButton>
              <IconButton label="Share" variant="outline" size="lg">
                <ShareIcon size={20} />
              </IconButton>
              <IconButton label="Close" variant="soft">
                <XIcon size={18} />
              </IconButton>
              <IconButton label="Delete" variant="danger">
                <Trash size={18} />
              </IconButton>
            </div>
          </div>
          <div className="flex flex-col gap-3">
            <p className="text-sm font-medium text-ink-muted">Loading</p>
            <div className="flex items-center gap-4">
              <Skeleton className="size-14 rounded-full" />
              <div className="flex flex-1 flex-col gap-2">
                <Skeleton className="h-4 w-2/3" />
                <Skeleton className="h-3.5 w-1/3" />
              </div>
            </div>
          </div>
        </div>
      </Block>

      <Block id="people" title="Avatars and details" note="If a photo’s small copy fails, the original is tried, then initials. Details stack one per line.">
        <div className="flex items-end gap-4">
          <Avatar name="Ana López" size="xs" />
          <Avatar name="Ana López" size="sm" />
          <Avatar name="Ana López" size="md" />
          <Avatar name="Ana López" size="lg" />
          <Avatar name="Ana López" size="xl" src="/missing-small.jpg" fallbackSrc="/missing.jpg" />
          <Avatar name="Ana López" size="2xl" />
        </div>
        <div className="max-w-md">
          <DetailList
            items={[
              { label: "Member since", value: "2016" },
              { label: "Entry hub", value: "Mexico City" },
              { label: "Email", value: <span className="text-brand-ink">ana@example.com</span> },
            ]}
          />
        </div>
      </Block>

      <Block id="profile-menu" title="Profile menu" note="The photo at the end of the top bar. Your name and email, app choices with a check on the current one, then sign out.">
        <div className="flex justify-end pb-56">
          <ProfileMenu name="Ana López" detail="ana@example.com">
            <MenuItem selected>View as admin</MenuItem>
            <MenuItem selected={false}>View as voter</MenuItem>
            <MenuDivider />
            <MenuItem>Sign out</MenuItem>
          </ProfileMenu>
        </div>
      </Block>

      <Dialog
        open={dialog}
        onClose={() => setDialog(false)}
        title="Edit hub"
        description="The name shows in the directory filter and on profiles."
        size="sm"
        footer={
          <DialogActions start={<Button variant="danger" onClick={() => { setDialog(false); setConfirm(true); }}>Delete hub</Button>}>
            <Button variant="ghost" onClick={() => setDialog(false)}>
              Cancel
            </Button>
            <Button onClick={() => { setDialog(false); toast("Hub saved", "success"); }}>Save</Button>
          </DialogActions>
        }
      >
        <Field label="Name">{(f) => <Input id={f.id} defaultValue="Amsterdam" autoFocus />}</Field>
      </Dialog>
      <ConfirmDialog
        open={confirm}
        onClose={() => setConfirm(false)}
        onConfirm={() => {
          setConfirm(false);
          toast("Deleted");
        }}
        title="Delete Amsterdam?"
        description="It’s removed from the list of hubs. This can’t be undone."
        confirmLabel="Delete hub"
        danger
      />
    </div>
  );
}
