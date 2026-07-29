"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Loader2, Mail, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  updateMessageStatus,
  updateMessageNotes,
  deleteMessage,
} from "@/actions/admin/messages";
import type { ContactMessage, MessageStatus } from "@/types/supabase";

const STATUS_STYLES: Record<MessageStatus, string> = {
  new: "bg-red-100 text-red-800",
  in_progress: "bg-amber-100 text-amber-800",
  resolved: "bg-green-100 text-green-800",
  spam: "bg-gray-100 text-gray-800",
};

const STATUS_LABELS: Record<MessageStatus, string> = {
  new: "New",
  in_progress: "In progress",
  resolved: "Resolved",
  spam: "Spam",
};

function StatusBadge({ status }: { status: MessageStatus }) {
  return (
    <Badge variant="secondary" className={STATUS_STYLES[status]}>
      {STATUS_LABELS[status]}
    </Badge>
  );
}

export function MessagesManager({ messages }: { messages: ContactMessage[] }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [selectedId, setSelectedId] = useState<string | null>(
    messages[0]?.id ?? null
  );
  const [notes, setNotes] = useState("");
  const [notesForId, setNotesForId] = useState<string | null>(null);

  const selected = messages.find((m) => m.id === selectedId) ?? null;

  // Reset the notes editor whenever a different message is selected
  // (adjust-state-during-render pattern; avoids setState in an effect).
  if (selected && notesForId !== selected.id) {
    setNotesForId(selected.id);
    setNotes(selected.admin_notes ?? "");
  }

  function setStatus(id: string, status: MessageStatus) {
    startTransition(async () => {
      const result = await updateMessageStatus(id, status);
      if (result.success) {
        toast.success(`Marked as ${STATUS_LABELS[status]}.`);
        router.refresh();
      } else {
        toast.error(result.message || "Failed to update status.");
      }
    });
  }

  function saveNotes(id: string) {
    startTransition(async () => {
      const result = await updateMessageNotes(id, notes);
      if (result.success) {
        toast.success("Notes saved.");
        router.refresh();
      } else {
        toast.error(result.message || "Failed to save notes.");
      }
    });
  }

  function remove(id: string) {
    if (!window.confirm("Delete this message? This cannot be undone.")) return;
    startTransition(async () => {
      const result = await deleteMessage(id);
      if (result.success) {
        toast.success("Message deleted.");
        if (selectedId === id) setSelectedId(null);
        router.refresh();
      } else {
        toast.error(result.message || "Failed to delete message.");
      }
    });
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,2fr)_minmax(0,3fr)]">
      {/* Message list */}
      <div className="divide-y rounded-lg border bg-white">
        {messages.length === 0 ? (
          <p className="py-8 text-center text-muted-text">No messages yet.</p>
        ) : (
          messages.map((message) => (
            <button
              key={message.id}
              type="button"
              onClick={() => setSelectedId(message.id)}
              className={`block w-full px-4 py-3 text-left transition-colors hover:bg-muted/50 ${
                message.id === selectedId
                  ? "border-l-2 border-l-gold bg-muted/40"
                  : "border-l-2 border-l-transparent"
              }`}
            >
              <div className="flex items-center justify-between gap-2">
                <span className="truncate font-medium text-body">
                  {message.full_name}
                </span>
                <StatusBadge status={message.status} />
              </div>
              <p className="mt-1 truncate text-sm text-body">
                {message.subject}
              </p>
              <p className="mt-1 text-xs text-muted-text">
                {new Date(message.created_at).toLocaleDateString()}
              </p>
            </button>
          ))
        )}
      </div>

      {/* Message detail */}
      <div className="self-start rounded-lg border bg-white p-6">
        {!selected ? (
          <p className="py-8 text-center text-muted-text">
            Select a message to view it.
          </p>
        ) : (
          <div className="space-y-6">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <h2 className="text-lg font-semibold text-navy">
                  {selected.subject}
                </h2>
                <p className="mt-1 text-sm text-muted-text">
                  {selected.full_name} ·{" "}
                  {new Date(selected.created_at).toLocaleString()}
                </p>
              </div>
              <StatusBadge status={selected.status} />
            </div>

            <dl className="grid gap-3 text-sm sm:grid-cols-2">
              <div>
                <dt className="text-xs font-medium uppercase text-muted-text">
                  Email
                </dt>
                <dd>
                  <a
                    href={`mailto:${selected.email}`}
                    className="text-navy underline-offset-2 hover:underline"
                  >
                    {selected.email}
                  </a>
                </dd>
              </div>
              <div>
                <dt className="text-xs font-medium uppercase text-muted-text">
                  Phone
                </dt>
                <dd className="text-body">{selected.phone || "—"}</dd>
              </div>
              <div>
                <dt className="text-xs font-medium uppercase text-muted-text">
                  Organization
                </dt>
                <dd className="text-body">{selected.organization || "—"}</dd>
              </div>
              <div>
                <dt className="text-xs font-medium uppercase text-muted-text">
                  Enquiry type
                </dt>
                <dd className="text-body">{selected.enquiry_type || "—"}</dd>
              </div>
            </dl>

            <div>
              <p className="text-xs font-medium uppercase text-muted-text">
                Message
              </p>
              <div className="mt-2 whitespace-pre-wrap rounded-md border bg-muted/30 p-4 text-sm text-body">
                {selected.message}
              </div>
            </div>

            <div>
              <p className="text-xs font-medium uppercase text-muted-text">
                Status
              </p>
              <div className="mt-2 flex flex-wrap gap-2">
                {(Object.keys(STATUS_LABELS) as MessageStatus[]).map(
                  (status) => (
                    <Button
                      key={status}
                      type="button"
                      size="sm"
                      variant={
                        selected.status === status ? "default" : "outline"
                      }
                      disabled={isPending || selected.status === status}
                      onClick={() => setStatus(selected.id, status)}
                      className={
                        selected.status === status
                          ? "bg-navy hover:bg-navy/90"
                          : ""
                      }
                    >
                      {STATUS_LABELS[status]}
                    </Button>
                  )
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="admin-notes">Admin notes</Label>
              <Textarea
                id="admin-notes"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Internal notes about this enquiry…"
                rows={4}
              />
              <Button
                type="button"
                size="sm"
                disabled={isPending || notes === (selected.admin_notes ?? "")}
                onClick={() => saveNotes(selected.id)}
                className="bg-navy hover:bg-navy/90"
              >
                {isPending && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                Save notes
              </Button>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-3 border-t pt-4">
              <Button type="button" variant="outline" size="sm" asChild>
                <a
                  href={`mailto:${selected.email}?subject=${encodeURIComponent(
                    `Re: ${selected.subject}`
                  )}`}
                >
                  <Mail className="mr-2 h-4 w-4" />
                  Reply by email
                </a>
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                disabled={isPending}
                onClick={() => remove(selected.id)}
                className="text-destructive hover:text-destructive"
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Delete
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
