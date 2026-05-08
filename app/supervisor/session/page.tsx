import Link from "next/link";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input, Select, SectionLabel, Textarea } from "@/components/ui/Input";
import { PageHeader } from "@/components/ui/PageHeader";
import { THERAPISTS, SAMPLE_TRANSCRIPT } from "@/lib/mock-data";

export default function NewSessionPage() {
  return (
    <div>
      <PageHeader
        title="New Supervision Session"
        subtitle="Configure session details then proceed to scoring"
      />

      <div className="grid gap-5 lg:grid-cols-[300px_1fr]">
        <div className="flex flex-col gap-3.5">
          <Card>
            <h2 className="mb-3.5 text-sm font-extrabold text-ink">
              Session Details
            </h2>

            <div className="mb-3">
              <SectionLabel>Therapist</SectionLabel>
              <Select defaultValue={THERAPISTS[0].id}>
                {THERAPISTS.filter((t) => !t.archived && t.status === "Active").map((t) => (
                  <option key={t.id} value={t.id}>{t.name}</option>
                ))}
              </Select>
            </div>

            <div className="mb-3">
              <SectionLabel>Session Date</SectionLabel>
              <Input type="date" defaultValue="2026-03-08" />
            </div>

            <div className="mb-3">
              <SectionLabel>Session Type</SectionLabel>
              <Select defaultValue="individual">
                <option value="individual">Individual Supervision</option>
                <option value="group">Group Supervision</option>
                <option value="live">Live Observation</option>
              </Select>
            </div>

            <div>
              <SectionLabel>Session Number</SectionLabel>
              <Input type="number" defaultValue={9} min={1} />
            </div>
          </Card>

          <Link href="/supervisor/tapescript">
            <Button variant="orange" full>
              Go to Annotated Tape →
            </Button>
          </Link>
          <Link href="/supervisor/scoring">
            <Button variant="primary" full>
              Go to CTS-R Scoring →
            </Button>
          </Link>
        </div>

        <Card>
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-sm font-extrabold text-ink">Session Transcript</h2>
            <div className="flex gap-2">
              <Button variant="muted" className="!text-[11px]">📋 Sample</Button>
              <Button variant="muted" className="!text-[11px]">Clear</Button>
            </div>
          </div>
          <Textarea
            className="!h-[440px]"
            defaultValue={SAMPLE_TRANSCRIPT}
            placeholder={"Paste verbatim transcript here...\n\nT: [Therapist]\nC: [Client]"}
          />
        </Card>
      </div>
    </div>
  );
}
