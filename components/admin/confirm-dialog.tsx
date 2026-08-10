"use client";

import { Loader2, AlertTriangle } from "lucide-react";
import { Modal } from "./modal";

interface ConfirmDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  loading?: boolean;
  title?: string;
  message: string;
  confirmLabel?: string;
  variant?: "danger" | "warning";
}

export function ConfirmDialog({
  open,
  onClose,
  onConfirm,
  loading,
  title = "Confirm Action",
  message,
  confirmLabel = "Confirm",
  variant = "danger",
}: ConfirmDialogProps) {
  return (
    <Modal open={open} onClose={onClose} title={title} size="sm">
      <div className="flex flex-col items-center gap-4 text-center">
        <div className={`rounded-full p-3 ${variant === "danger" ? "bg-red-50 text-red-500" : "bg-yellow-50 text-yellow-500"}`}>
          <AlertTriangle size={24} />
        </div>
        <p className="text-sm text-neutral-600">{message}</p>
        <div className="flex w-full gap-3">
          <button
            onClick={onClose}
            disabled={loading}
            className="flex-1 rounded-lg border border-neutral-200 py-2 text-sm font-medium text-neutral-700 transition-colors hover:bg-neutral-50 disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={loading}
            className={`flex flex-1 items-center justify-center gap-2 rounded-lg py-2 text-sm font-medium text-white transition-colors disabled:opacity-50 ${
              variant === "danger" ? "bg-red-500 hover:bg-red-600" : "bg-yellow-500 hover:bg-yellow-600"
            }`}
          >
            {loading && <Loader2 size={14} className="animate-spin" />}
            {confirmLabel}
          </button>
        </div>
      </div>
    </Modal>
  );
}
