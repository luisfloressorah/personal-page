import { useMemo } from "react";
import Modal from "../../common/Modal";
import { statusBadge, formatDateTime } from "./messageUi";

export default function MessageDetailModal({
                                             open,
                                             message,
                                             onClose,
                                             onMarkRead,
                                             onArchive,
                                             onDelete,
                                             busy,
                                           }) {
  const canMarkRead = useMemo(() => message?.status !== "read", [message]);
  const canArchive = useMemo(() => message?.status !== "archived", [message]);

  return (
    <Modal
      open={open}
      title="Detalle del mensaje"
      onClose={busy ? undefined : onClose}
      footer={
        <div className="flex flex-wrap justify-end gap-2">
          <button
            type="button"
            disabled={busy}
            onClick={onClose}
            className="rounded-md border border-slate-800 px-3 py-2 text-xs text-slate-200 hover:border-slate-600 disabled:opacity-60"
          >
            Cerrar
          </button>

          <button
            type="button"
            disabled={busy || !canMarkRead}
            onClick={onMarkRead}
            className="rounded-md border border-slate-800 px-3 py-2 text-xs text-slate-200 hover:border-slate-600 disabled:opacity-60"
          >
            Marcar leído
          </button>

          <button
            type="button"
            disabled={busy || !canArchive}
            onClick={onArchive}
            className="rounded-md border border-purple-500/30 bg-purple-500/10 px-3 py-2 text-xs text-purple-200 hover:bg-purple-500/15 disabled:opacity-60"
          >
            Archivar
          </button>

          <button
            type="button"
            disabled={busy}
            onClick={onDelete}
            className="rounded-md border border-red-500/30 bg-red-500/10 px-3 py-2 text-xs text-red-200 hover:bg-red-500/15 disabled:opacity-60"
          >
            Eliminar
          </button>
        </div>
      }
    >
      {!message ? (
        <p className="text-sm text-slate-400">Sin mensaje seleccionado.</p>
      ) : (
        <div className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="min-w-0">
              <p className="text-sm font-semibold text-white truncate">{message.name}</p>
              <p className="text-xs text-slate-400 truncate">{message.email}</p>
            </div>
            <div className="flex items-center gap-2">
              <span className={statusBadge(message.status)}>{message.status}</span>
              <span className="text-xs text-slate-500">
                {formatDateTime(message.createdAt)}
              </span>
            </div>
          </div>

          <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-4">
            <p className="text-sm text-slate-200 whitespace-pre-line">
              {message.message}
            </p>
          </div>

          <div className="text-xs text-slate-500">
            Updated: {formatDateTime(message.updatedAt)}
          </div>
        </div>
      )}
    </Modal>
  );
}
