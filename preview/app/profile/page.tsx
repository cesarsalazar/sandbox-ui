"use client";

import { useState } from "react";
import Link from "next/link";
import { Avatar, Button, DetailList, Dialog, DialogActions, Field, IconButton, Input, ShareIcon, iconButtonClass } from "../../../src";
import { AppShell, useQuery } from "../shell";
import { Gear } from "../icons";

// Your own profile, one page at every size: on desktop, as members shows it,
// a larger name, the buttons centred and each section in a card. ?sheet=1 opens Edit profile, a
// sheet on a phone and a dialog on desktop.
export default function Profile() {
  const sheet = useQuery("sheet") !== null;
  const [opened, setOpened] = useState<boolean | null>(null);
  const editing = opened ?? sheet;
  const setEditing = setOpened;
  return (
    <AppShell active="me" width="narrow">
      <div>
        <div className="flex flex-col items-center gap-3 pt-safe text-center md:pt-0">
          <Avatar name="Ana López" size="2xl" className="mt-10" />
          <h1 className="pt-3 font-serif text-[44px] leading-[1.02] text-ink md:text-[52px]">Ana López</h1>
          <div className="flex flex-col gap-0.5 text-[17px]">
            <p className="text-ink-muted">Mexico City</p>
            <p className="font-medium text-brand-ink">Board member</p>
          </div>
        </div>
        <div className="mt-6 flex items-center gap-3 md:justify-center">
          <Button size="lg" className="max-md:flex-1" onClick={() => setEditing(true)}>
            Edit profile
          </Button>
          <IconButton label="Share" variant="outline" size="lg">
            <ShareIcon size={20} />
          </IconButton>
          {/* Account is a phone screen; desktop has no gear. */}
          <Link href="/account" aria-label="Account" title="Account" className={`${iconButtonClass({ variant: "outline", size: "lg" })} md:hidden`}>
            <Gear size={20} />
          </Link>
        </div>
        <section className="mt-8 flex flex-col gap-3 md:mt-10 md:rounded-card md:border md:border-line md:bg-surface md:p-6 md:shadow-card">
          <h2 className="text-lg font-semibold text-ink">In Sandbox</h2>
          <DetailList
            items={[
              { label: "Member since", value: "2016" },
              { label: "Entry hub", value: "Mexico City" },
              { label: "Current city", value: "Mexico City" },
            ]}
          />
        </section>
      </div>
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
    </AppShell>
  );
}
