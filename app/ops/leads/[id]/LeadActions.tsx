"use client";

import { useState } from "react";

const STAGE_OPTIONS = [
  { value: "new", label: "New" },
  { value: "contacted", label: "Contacted" },
  { value: "conversation", label: "Conversation" },
  { value: "appointment_set", label: "Appointment Set" },
  { value: "appointment_done", label: "Appointment Done" },
  { value: "follow_up", label: "Follow-Up" },
  { value: "listing_signed", label: "Listing Signed" },
  { value: "closed", label: "Closed" },
  { value: "lost", label: "Lost" },
  { value: "nurture", label: "Nurture" },
];

type LeadActionsProps = {
  lead: {
    id: string;
    stage?: string | null;
    next_follow_up_at?: string | null;
    timeline?: string | null;
    pain_point?: string | null;
    cma_notes?: string | null;
  };
};

export default function LeadActions({ lead }: LeadActionsProps) {
  const [stage, setStage] = useState(lead.stage || "new");
  const [timeline, setTimeline] = useState(lead.timeline || "");
  const [painPoint, setPainPoint] = useState(lead.pain_point || "");
  const [cmaNotes, setCmaNotes] = useState(lead.cma_notes || "");
  const [followUp, setFollowUp] = useState(
    lead.next_follow_up_at ? lead.next_follow_up_at.slice(0, 16) : ""
  );

  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState("");

  async function handleSave() {
    setSaving(true);
    setMsg("");

    try {
      const res = await fetch("/api/crm/update-lead", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: lead.id,
          stage,
          timeline: timeline || null,
          pain_point: painPoint || null,
          cma_notes: cmaNotes || null,
          next_follow_up_at: followUp || null,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setMsg(data.error || "Error saving");
      } else {
        setMsg("Saved");
      }
    } catch {
      setMsg("Error saving");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="mt-6 rounded-2xl border border-black/5 bg-white p-5">
      <h2 className="text-sm font-semibold text-neutral-500">
        Lead Control Panel
      </h2>

      <div className="mt-4 grid gap-4 md:grid-cols-2">
        <div>
          <label className="text-xs text-neutral-500">Stage</label>
          <select
            className="mt-1 w-full rounded-xl border p-2 text-sm"
            value={stage}
            onChange={(e) => setStage(e.target.value)}
          >
            {STAGE_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="text-xs text-neutral-500">Follow-up date</label>
          <input
            type="datetime-local"
            className="mt-1 w-full rounded-xl border p-2 text-sm"
            value={followUp}
            onChange={(e) => setFollowUp(e.target.value)}
          />
        </div>

        <div>
          <label className="text-xs text-neutral-500">Timeline</label>
          <input
            className="mt-1 w-full rounded-xl border p-2 text-sm"
            value={timeline}
            onChange={(e) => setTimeline(e.target.value)}
            placeholder="Ex: within 2 weeks"
          />
        </div>

        <div>
          <label className="text-xs text-neutral-500">Pain point</label>
          <input
            className="mt-1 w-full rounded-xl border p-2 text-sm"
            value={painPoint}
            onChange={(e) => setPainPoint(e.target.value)}
            placeholder="Ex: no offers, price resistance"
          />
        </div>

        <div className="md:col-span-2">
          <label className="text-xs text-neutral-500">CMA notes</label>
          <textarea
            className="mt-1 min-h-[120px] w-full rounded-xl border p-2 text-sm"
            value={cmaNotes}
            onChange={(e) => setCmaNotes(e.target.value)}
          />
        </div>
      </div>

      <div className="mt-4 flex items-center gap-4">
        <button
          type="button"
          onClick={handleSave}
          disabled={saving}
          className="rounded-full bg-neutral-900 px-5 py-2 text-sm text-white"
        >
          {saving ? "Saving..." : "Save"}
        </button>

        {msg && <p className="text-sm text-neutral-500">{msg}</p>}
      </div>
    </div>
  );
}