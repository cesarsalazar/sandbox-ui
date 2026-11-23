"use client";

import { useState } from "react";
import { PageHeader, PhoneBar, PhoneBarBack, Row, RowGroup, Switch, SwitchRow } from "../../../src";
import { AppShell } from "../shell";
import { Bell, Card, Gift } from "../icons";

// Account settings: membership, email and log out. One page at every size.
export default function Account() {
  const [postcards, setPostcards] = useState(true);
  const [reminders, setReminders] = useState(false);
  return (
    <AppShell active="me" width="narrow">
      <div className="-mx-5 -mt-6 md:hidden">
        <PhoneBar left={<PhoneBarBack href="/profile" label="Profile" />} title="Account" />
      </div>
      <PageHeader className="max-md:hidden" title="Account" />
      <div>
        <div className="flex flex-col gap-8 pt-6 md:pt-8">
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
      </div>
    </AppShell>
  );
}
