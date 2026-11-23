"use client";

import { useState } from "react";
import { Button, InstallPrompt, LargeTitle, MemberCard, MemberGrid, PageHeader, Pagination, PersonList, PersonRow, SearchInput, Select } from "../../../src";
import { AppShell, useQuery } from "../shell";
import { UserPlus } from "../icons";
import { PEOPLE } from "../people";

// The directory, as members has it: cards on desktop, a list of people on a
// phone. ?install=1 shows the Add to Home Screen prompt a phone browser gets.
export default function Directory() {
  const install = useQuery("install") !== null;
  const [page, setPage] = useState(1);
  const [query, setQuery] = useState("");
  const shown = PEOPLE.filter((p) => `${p.first} ${p.last} ${p.place ?? ""}`.toLowerCase().includes(query.toLowerCase()));
  return (
    <AppShell active="members">
      <LargeTitle>Members</LargeTitle>
      {install && <InstallPrompt platform="ios" appName="Sandbox" className="mt-4 md:hidden" />}
      <PageHeader
        className="max-md:hidden"
        title="Members"
        description="1,775 members in good standing"
        actions={
          <Button>
            <UserPlus size={16} /> New member
          </Button>
        }
      />
      <div className="mt-4 flex flex-col gap-3 md:mt-8 md:flex-row md:items-center">
        <SearchInput
          className="flex-1"
          placeholder="Search by name, city or email"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          count={`1–${shown.length} of 1,775`}
        />
        <div className="md:w-56">
          <Select aria-label="Hub" defaultValue="">
            <option value="">All hubs</option>
            <option>Berlin</option>
            <option>Mexico City</option>
          </Select>
        </div>
      </div>
      <PersonList className="mt-3 md:hidden">
        {shown.map((p) => (
          <PersonRow key={p.first + p.last} href="#" name={`${p.first} ${p.last}`} role={p.role} place={p.place} former={p.former} />
        ))}
      </PersonList>
      <MemberGrid className="mt-6 max-md:hidden">
        {shown.map((p) => (
          <MemberCard
            key={p.first + p.last}
            href="#"
            firstName={p.first}
            lastName={p.last}
            place={p.place}
            role={p.role}
            status={p.status}
            former={p.former}
          />
        ))}
      </MemberGrid>
      <Pagination className="mt-8" page={page} pages={36} onChange={setPage} />
    </AppShell>
  );
}
