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

// Every screen in the preview. Each is one page that works at every size, as
// members' are; the frames below show the same address at phone and desktop
// width. A screen can also be opened full size.
// Every screen in the preview, at the sizes members uses it: the installed
// app's screens and Account only on a phone, admin pages only on desktop, and the rest at both, each one page styled for each size.
type Size = "phone" | "desktop";
const BOTH: Size[] = ["phone", "desktop"];
const SCREENS: { path: string; label: string; sizes: Size[] }[] = [
  { path: "/welcome", label: "Welcome", sizes: ["phone"] },
  { path: "/members", label: "Directory", sizes: BOTH },
  { path: "/members?install=1", label: "Directory, with Add to Home Screen", sizes: ["phone"] },
  { path: "/members?platform=android", label: "Directory, Android's tab bar", sizes: ["phone"] },
  { path: "/profile", label: "Your profile", sizes: BOTH },
  { path: "/profile?sheet=1", label: "Edit profile", sizes: BOTH },
  { path: "/account", label: "Account", sizes: ["phone"] },
  { path: "/offline", label: "Offline", sizes: ["phone"] },
  { path: "/hubs", label: "Hubs", sizes: ["desktop"] },
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
            Every component, working, and whole screens built from them: each one page that works on a phone and on desktop.
          </p>
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

      <Block id="screens" title="Screens" note="Each screen at the sizes it's used: on a phone, on desktop, or both from the same address, styled for each. Open one to use it full size.">
        <div className="flex flex-col gap-10">
          {SCREENS.map((sc) => (
            <figure key={sc.path} className="flex flex-col gap-3">
              <figcaption className="flex items-baseline gap-3 text-sm font-medium text-ink">
                {sc.label}
                <a href={sc.path} className="font-normal text-brand-ink underline underline-offset-4">
                  Open
                </a>
              </figcaption>
              <div className="flex items-start gap-6 overflow-x-auto pb-2">
                {sc.sizes.includes("phone") && (
                  <div className="shrink-0 overflow-hidden rounded-[36px] border-[8px] border-[#1b1b22] bg-paper shadow-[0_12px_40px_rgb(10_10_20/0.18)]">
                    <iframe title={`${sc.label}, phone`} src={sc.path} loading="lazy" className="block h-[852px] w-[393px]" style={{ zoom: 0.5 }} />
                  </div>
                )}
                {sc.sizes.includes("desktop") && (
                  <div className="shrink-0 overflow-hidden rounded-card border border-line bg-paper shadow-card">
                    <iframe title={`${sc.label}, desktop`} src={sc.path} loading="lazy" className="block h-[900px] w-[1440px]" style={{ zoom: 0.4 }} />
                  </div>
                )}
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
