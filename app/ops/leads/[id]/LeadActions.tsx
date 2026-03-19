"use client";

import { useState } from "react";

export default function LeadActions({ lead }: { lead: any }) {
  const [status, setStatus] = useState(lead.status || "new");
  const [notes, setNotes] = useState(lead.notes || "");
  const [nextAction, setNextAction] = useState(lead.next_action || "");
  const [followUp, setFollowUp] = useState(
    lead.follow_up_at ? lead.follow_up_at.slice(0, 16) : ""
  );

  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState("");

  async function handleSave() {
    setSaving(true);
    setMsg("");

    const res = await fetch("/api/leads/update", {
      method: "POST",
      body: JSON.stringify({
        id: lead.id,
        status,
        notes,
        next_action: nextAction,
        follow_up_at: followUp || null,
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      setMsg(data.error || "Error saving");
    } else {
      setMsg("Saved");
    }

    setSaving(false);
  }

  return (
    <div className="mt-6 rounded-2xl border border-black/5 bg-white p-5">
      <h2 className="text-sm font-semibold text-neutral-500">
        Lead Control Panel
      </h2>

      <div className="mt-4 grid gap-4 md:grid-cols-2">
        <div>
          <label className="text-xs text-neutral-500">Status</label>
          <select
            className="mt-1 w-full rounded-xl border p-2 text-sm"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
          >
            <option value="new">New</option>
            <option value="contacted">Contacted</option>
            <option value="showing">Showing</option>
            <option value="application">Application</option>
            <option value="closed">Closed</option>
            <option value="lost">Lost</option>
          </select>
        </div>

        <div>
          <label className="text-xs text-neutral-500">
            Follow-up date
          </label>
          <input
            type="datetime-local"
            className="mt-1 w-full rounded-xl border p-2 text-sm"
            value={followUp}
            onChange={(e) => setFollowUp(e.target.value)}
          />
        </div>

        <div className="md:col-span-2">
          <label className="text-xs text-neutral-500">
            Next action
          </label>
          <input
            className="mt-1 w-full rounded-xl border p-2 text-sm"
            value={nextAction}
            onChange={(e) => setNextAction(e.target.value)}
            placeholder="Call, send listings, schedule showing..."
          />
        </div>

        <div className="md:col-span-2">
          <label className="text-xs text-neutral-500">Notes</label>
          <textarea
            className="mt-1 w-full rounded-xl border p-2 text-sm min-h-[120px]"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
          />
        </div>
      </div>

      <div className="mt-4 flex items-center gap-4">
        <button
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