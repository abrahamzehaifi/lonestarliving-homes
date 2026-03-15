"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";

type Props = {
leadId: string;
currentStatus: string | null;
};

function toLocalDateTime(daysFromNow: number) {
const date = new Date();

// move date forward
date.setDate(date.getDate() + daysFromNow);

// set follow-up time to 9:00 AM local
date.setHours(9, 0, 0, 0);

// build YYYY-MM-DDTHH:MM:SS format (local time)
const year = date.getFullYear();
const month = String(date.getMonth() + 1).padStart(2, "0");
const day = String(date.getDate()).padStart(2, "0");

const hours = String(date.getHours()).padStart(2, "0");
const minutes = String(date.getMinutes()).padStart(2, "0");
const seconds = "00";

return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}`;
}

export default function LeadQuickActions({
leadId,
currentStatus,
}: Props) {
const router = useRouter();
const [isPending, startTransition] = useTransition();
const [error, setError] = useState("");
const [success, setSuccess] = useState("");

async function postJson(url: string, body: Record<string, unknown>) {
const res = await fetch(url, {
method: "POST",
headers: {
"Content-Type": "application/json",
},
body: JSON.stringify(body),
});

```
const data = await res.json().catch(() => ({}));

if (!res.ok) {
  throw new Error(
    typeof data?.error === "string" ? data.error : "Request failed."
  );
}

return data;
```

}

function refreshWithMessage(message: string) {
setSuccess(message);

```
startTransition(() => {
  router.refresh();
});
```

}

async function handleFollowUp(daysFromNow: number) {
setError("");
setSuccess("");

```
try {
  await postJson("/api/lead-follow-up", {
    id: leadId,
    followUpAt: toLocalDateTime(daysFromNow),
  });

  refreshWithMessage(
    daysFromNow === 0
      ? "Follow-up set for today."
      : "Follow-up set for tomorrow."
  );
} catch (err) {
  setError(
    err instanceof Error ? err.message : "Failed to update follow-up."
  );
}
```

}

async function handleClearFollowUp() {
setError("");
setSuccess("");

```
try {
  await postJson("/api/lead-follow-up", {
    id: leadId,
    followUpAt: null,
  });

  refreshWithMessage("Follow-up cleared.");
} catch (err) {
  setError(
    err instanceof Error ? err.message : "Failed to clear follow-up."
  );
}
```

}

async function handleStatus(
status: "contacted" | "qualified" | "showing" | "lost"
) {
if (currentStatus === status) {
setError("");
setSuccess(`Already marked ${status}.`);
return;
}

```
setError("");
setSuccess("");

try {
  await postJson("/api/lead-status", {
    id: leadId,
    status,
  });

  refreshWithMessage(`Marked ${status}.`);
} catch (err) {
  setError(err instanceof Error ? err.message : "Failed to update status.");
}
```

}

return ( <div className="mt-4 space-y-2"> <div className="flex flex-wrap gap-2">
<button
type="button"
disabled={isPending}
onClick={() => void handleFollowUp(0)}
className="inline-flex h-8 items-center justify-center rounded-full border border-black/10 bg-white px-3 text-xs font-medium text-neutral-900 transition hover:bg-neutral-50 disabled:cursor-not-allowed disabled:opacity-60"
>
Today </button>

```
    <button
      type="button"
      disabled={isPending}
      onClick={() => void handleFollowUp(1)}
      className="inline-flex h-8 items-center justify-center rounded-full border border-black/10 bg-white px-3 text-xs font-medium text-neutral-900 transition hover:bg-neutral-50 disabled:cursor-not-allowed disabled:opacity-60"
    >
      Tomorrow
    </button>

    <button
      type="button"
      disabled={isPending}
      onClick={() => void handleClearFollowUp()}
      className="inline-flex h-8 items-center justify-center rounded-full border border-black/10 bg-white px-3 text-xs font-medium text-neutral-700 transition hover:bg-neutral-50 disabled:cursor-not-allowed disabled:opacity-60"
    >
      Clear Follow-Up
    </button>

    <button
      type="button"
      disabled={isPending}
      onClick={() => void handleStatus("contacted")}
      className="inline-flex h-8 items-center justify-center rounded-full border border-amber-200 bg-amber-50 px-3 text-xs font-medium text-amber-700 transition hover:bg-amber-100 disabled:cursor-not-allowed disabled:opacity-60"
    >
      Contacted
    </button>

    <button
      type="button"
      disabled={isPending}
      onClick={() => void handleStatus("qualified")}
      className="inline-flex h-8 items-center justify-center rounded-full border border-emerald-200 bg-emerald-50 px-3 text-xs font-medium text-emerald-700 transition hover:bg-emerald-100 disabled:cursor-not-allowed disabled:opacity-60"
    >
      Qualified
    </button>

    <button
      type="button"
      disabled={isPending}
      onClick={() => void handleStatus("showing")}
      className="inline-flex h-8 items-center justify-center rounded-full border border-violet-200 bg-violet-50 px-3 text-xs font-medium text-violet-700 transition hover:bg-violet-100 disabled:cursor-not-allowed disabled:opacity-60"
    >
      Showing
    </button>

    <button
      type="button"
      disabled={isPending}
      onClick={() => void handleStatus("lost")}
      className="inline-flex h-8 items-center justify-center rounded-full border border-red-200 bg-red-50 px-3 text-xs font-medium text-red-700 transition hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-60"
    >
      Mark Lost
    </button>
  </div>

  <div className="min-h-[20px] text-xs">
    {isPending ? (
      <span className="text-neutral-500">Updating…</span>
    ) : success ? (
      <span className="text-emerald-600">{success}</span>
    ) : error ? (
      <span className="text-red-600">{error}</span>
    ) : null}
  </div>
</div>
```

);
}
