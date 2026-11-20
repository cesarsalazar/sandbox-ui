"use client";

import { useState } from "react";
import {
  Button,
  ConfirmDialog,
  Dialog,
  DialogActions,
  Field,
  IconButton,
  Input,
  PageHeader,
  PencilIcon,
  RowActions,
  Table,
  TBody,
  Td,
  TdActions,
  Th,
  THead,
  Tr,
  useToast,
} from "../../../../src";
import { DesktopShell } from "../shell";
import { Plus, Trash } from "../../icons";
import { HUBS } from "../../people";

export default function DesktopHubs() {
  const toast = useToast();
  // One dialog for adding and editing: null is closed, "" is a new hub.
  const [editing, setEditing] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [deleting, setDeleting] = useState<string | null>(null);
  const open = (hub: string) => {
    setEditing(hub);
    setName(hub);
  };
  return (
    <DesktopShell active="hubs">
      <PageHeader
        title="Hubs"
        description="12 hubs, where members are based"
        actions={
          <Button onClick={() => open("")}>
            <Plus size={16} /> Add hub
          </Button>
        }
      />
      <Table className="mt-8">
        <THead>
          <Th>Name</Th>
          <Th align="end">Members</Th>
          <Th>
            <span className="sr-only">Actions</span>
          </Th>
        </THead>
        <TBody>
          {HUBS.map((hub, i) => (
            <Tr key={hub}>
              <Td>{hub}</Td>
              <Td align="end" muted className="tabular">
                {(i * 37 + 12) % 140}
              </Td>
              <TdActions>
                <RowActions>
                  <IconButton label={`Edit ${hub}`} size="sm" onClick={() => open(hub)}>
                    <PencilIcon size={16} />
                  </IconButton>
                  <IconButton label={`Delete ${hub}`} size="sm" variant="danger" onClick={() => setDeleting(hub)}>
                    <Trash size={16} />
                  </IconButton>
                </RowActions>
              </TdActions>
            </Tr>
          ))}
        </TBody>
      </Table>

      <Dialog
        open={editing !== null}
        onClose={() => setEditing(null)}
        title={editing ? "Edit hub" : "Add hub"}
        size="sm"
        footer={
          <DialogActions>
            <Button variant="ghost" onClick={() => setEditing(null)}>
              Cancel
            </Button>
            <Button
              disabled={!name.trim()}
              onClick={() => {
                setEditing(null);
                toast(editing ? "Hub saved" : "Hub added", "success");
              }}
            >
              {editing ? "Save" : "Add hub"}
            </Button>
          </DialogActions>
        }
      >
        <Field label="Name">
          {(f) => <Input id={f.id} value={name} onChange={(e) => setName(e.target.value)} autoFocus placeholder="City" />}
        </Field>
      </Dialog>

      <ConfirmDialog
        open={deleting !== null}
        onClose={() => setDeleting(null)}
        onConfirm={() => {
          setDeleting(null);
          toast("Hub deleted");
        }}
        title={`Delete ${deleting}?`}
        description="It’s removed from the list of hubs. This can’t be undone."
        confirmLabel="Delete hub"
        danger
      />
    </DesktopShell>
  );
}
