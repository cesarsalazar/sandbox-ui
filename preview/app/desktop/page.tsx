"use client";

import { useState } from "react";
import { Button, MemberCard, MemberGrid, PageHeader, Pagination, SearchInput, Select } from "../../../src";
import { DesktopShell } from "./shell";
import { UserPlus } from "../icons";
import { PEOPLE } from "../people";

export default function DesktopDirectory() {
  const [page, setPage] = useState(1);
  const [query, setQuery] = useState("");
  const shown = PEOPLE.filter((p) => `${p.first} ${p.last} ${p.place ?? ""}`.toLowerCase().includes(query.toLowerCase()));
  return (
    <DesktopShell active="members">
      <PageHeader
        title="Members"
        description="1,775 members in good standing"
        actions={
          <Button>
            <UserPlus size={16} /> New member
          </Button>
        }
      />
      <div className="mt-8 flex items-center gap-3">
        <SearchInput
          className="flex-1"
          placeholder="Search by name, city or email"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          count={`1–${shown.length} of 1,775`}
        />
        <div className="w-56">
          <Select aria-label="Hub" defaultValue="">
            <option value="">All hubs</option>
            <option>Berlin</option>
            <option>Mexico City</option>
          </Select>
        </div>
      </div>
      <MemberGrid className="mt-6">
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
    </DesktopShell>
  );
}
