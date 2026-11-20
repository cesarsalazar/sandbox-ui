import { CopyButton, PageHeader, Section, Card } from "../../../../src";
import { DesktopShell } from "../shell";

// Shows a section with pages of its own: its sub-pages list under it in the
// side menu while you're in it.
export default function DesktopDevelopers() {
  return (
    <DesktopShell active="developers" width="default">
      <PageHeader title="Developers" description="Build apps that work with Sandbox members." />
      <Card className="mt-8">
        <Section title="Your API key" description="Keep it secret. Anyone with it can act as your app.">
          <div className="flex items-center gap-3">
            <code className="flex h-10 min-w-0 flex-1 items-center truncate rounded-field border border-line bg-sunken px-3 font-mono text-sm text-ink">sbx_live_••••••••••••••••3f9a</code>
            <CopyButton text="example-key" label="Copy key" />
          </div>
        </Section>
      </Card>
    </DesktopShell>
  );
}
