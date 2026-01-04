import { useEffect, useMemo, useState } from "react";
import { ensureCsrf } from "../../api/csrf";
import { deleteMessage, listMessages, updateMessageStatus } from "../../api/messages";
import ConfirmDialog from "../../components/common/ConfirmDialog";
import MessageDetailModal from "../../components/admin/messages/MessageDetailModal";
import { statusBadge, formatDateTime } from "../../components/admin/messages/messageUi";
import { useAuth } from "../../auth/AuthProvider";

const STATUS_OPTIONS = ["all", "new", "read", "archived"];

export default function MessagesPage() {
  const { logout } = useAuth();

  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const [detailOpen, setDetailOpen] = useState(false);
  const [selected, setSelected] = useState(null);

  const [confirmOpen, setConfirmOpen] = useState(false);

  async function load() {
    setLoading(true);
    setError("");
    try {
      const data = await listMessages();
      setRows(Array.isArray(data) ? data : []);
    } catch (e) {
      if (e?.response?.status === 401) {
        // sesión expirada -> logout local y redirección la hace AdminLayout
        logout?.();
        return;
      }
      setError(e?.response?.data?.message || e?.message || "No se pudieron cargar los mensajes.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  const filteredRows = useMemo(() => {
    const q = query.trim().toLowerCase();

    return [...rows]
      .filter((m) => {
        if (statusFilter !== "all" && m.status !== statusFilter) return false;
        if (!q) return true;
        return (
          (m.name || "").toLowerCase().includes(q) ||
          (m.email || "").toLowerCase().includes(q) ||
          (m.message || "").toLowerCase().includes(q)
        );
      })
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }, [rows, query, statusFilter]);

  const stats = useMemo(() => {
    const total = rows.length;
    const newCount = rows.filter((m) => m.status === "new").length;
    const readCount = rows.filter((m) => m.status === "read").length;
    const archivedCount = rows.filter((m) => m.status === "archived").length;
    return { total, newCount, readCount, archivedCount };
  }, [rows]);

  function openDetail(m) {
    setSelected(m);
    setDetailOpen(true);

    // UX: auto marcar como read al abrir (solo si está new)
    if (m?.status === "new") {
      void quickStatus(m, "read", { silent: true });
    }
  }

  function askDelete(m) {
    setSelected(m);
    setConfirmOpen(true);
  }

  async function quickStatus(m, status, opts) {
    if (!m?._id) return;
    setBusy(true);
    setError("");

    try {
      await ensureCsrf();
      const updated = await updateMessageStatus(m._id, status);
      setRows((prev) => prev.map((x) => (x._id === updated._id ? updated : x)));

      // sincroniza selected si está abierto el detalle
      setSelected((prev) => (prev?._id === updated._id ? updated : prev));
    } catch (e) {
      if (e?.response?.status === 401) {
        logout?.();
        return;
      }
      // 404: ya no existe
      if (e?.response?.status === 404) {
        setError("Este mensaje ya no existe. Refrescando lista…");
        await load();
        return;
      }
      if (!opts?.silent) {
        setError(e?.response?.data?.message || e?.message || "No se pudo cambiar el status.");
      }
    } finally {
      setBusy(false);
    }
  }

  async function handleDelete() {
    if (!selected?._id) return;
    setBusy(true);
    setError("");

    try {
      await ensureCsrf();
      await deleteMessage(selected._id);
      setRows((prev) => prev.filter((x) => x._id !== selected._id));
      setConfirmOpen(false);
      setDetailOpen(false);
      setSelected(null);
    } catch (e) {
      if (e?.response?.status === 401) {
        logout?.();
        return;
      }
      if (e?.response?.status === 404) {
        setError("Este mensaje ya no existe. Refrescando lista…");
        await load();
        return;
      }
      setError(e?.response?.data?.message || e?.message || "No se pudo eliminar.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-lg font-semibold text-white">Messages</h2>
          <p className="text-xs text-slate-400">
            Leads del formulario de contacto. Filtra, marca como leído/archivado o elimina.
          </p>
        </div>

        <button
          type="button"
          onClick={load}
          disabled={loading}
          className="rounded-md border border-slate-800 px-3 py-2 text-xs text-slate-200 hover:border-slate-600 disabled:opacity-60"
        >
          {loading ? "Cargando..." : "Recargar"}
        </button>
      </div>

      {/* Mini stats */}
      <div className="grid gap-3 sm:grid-cols-4">
        <MiniCard label="Total" value={stats.total} />
        <MiniCard label="New" value={stats.newCount} />
        <MiniCard label="Read" value={stats.readCount} />
        <MiniCard label="Archived" value={stats.archivedCount} />
      </div>

      {error ? (
        <div className="rounded-xl border border-red-500/20 bg-red-500/5 p-3 text-xs text-red-300">
          {error}
        </div>
      ) : null}

      {/* Controls */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-1 gap-2">
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Buscar por nombre, email o texto…"
            className="w-full rounded-md border border-slate-800 bg-slate-950 px-3 py-2 text-sm text-white outline-none focus:border-slate-600"
          />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-44 rounded-md border border-slate-800 bg-slate-950 px-3 py-2 text-sm text-white outline-none focus:border-slate-600"
          >
            {STATUS_OPTIONS.map((s) => (
              <option key={s} value={s}>
                {s === "all" ? "Todos" : s}
              </option>
            ))}
          </select>
        </div>

        <div className="flex gap-2">
          <button
            type="button"
            disabled={busy}
            onClick={() => {
              // Acción masiva simple: archivar los "read" filtrados (opcional)
              const target = filteredRows.filter((m) => m.status === "read").slice(0, 10);
              if (!target.length) return;
              // no masivo por ahora; mejor mantener simple
              setError("Acciones masivas las metemos después (pro).");
            }}
            className="rounded-md border border-slate-800 px-3 py-2 text-xs text-slate-200 hover:border-slate-600 disabled:opacity-60"
          >
            Acciones masivas (luego)
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="rounded-2xl border border-slate-800/80 bg-slate-950/60 overflow-hidden">
        <div className="flex items-center justify-between px-4 py-3 border-b border-slate-800">
          <p className="text-sm font-medium text-white">Listado</p>
          <p className="text-xs text-slate-500">{filteredRows.length} visibles</p>
        </div>

        <div className="overflow-auto">
          <table className="min-w-full text-left text-sm">
            <thead className="bg-slate-900/40 text-xs text-slate-400">
            <tr>
              <Th>Nombre</Th>
              <Th>Email</Th>
              <Th>Status</Th>
              <Th>Fecha</Th>
              <Th align="right">Acciones</Th>
            </tr>
            </thead>

            <tbody className="divide-y divide-slate-800/80">
            {loading ? (
              <tr>
                <td colSpan={5} className="px-4 py-10 text-center text-slate-400">
                  Cargando...
                </td>
              </tr>
            ) : filteredRows.length ? (
              filteredRows.map((m) => (
                <tr
                  key={m._id}
                  className={[
                    "hover:bg-slate-900/30 cursor-pointer",
                    m.status === "new" ? "bg-emerald-500/5" : "",
                  ].join(" ")}
                  onClick={() => openDetail(m)}
                >
                  <Td>
                    <div className="min-w-0">
                      <p className="text-white truncate">{m.name}</p>
                      <p className="text-xs text-slate-500 line-clamp-1">
                        {(m.message || "").slice(0, 80)}
                      </p>
                    </div>
                  </Td>
                  <Td className="text-slate-300">{m.email}</Td>
                  <Td>
                    <span className={statusBadge(m.status)}>{m.status}</span>
                  </Td>
                  <Td className="text-slate-300">{formatDateTime(m.createdAt)}</Td>
                  <Td align="right">
                    <div className="flex justify-end gap-2 px-4 py-2" onClick={(e) => e.stopPropagation()}>
                      <button
                        type="button"
                        disabled={busy}
                        onClick={() => quickStatus(m, "read")}
                        className="rounded-md border border-slate-800 px-2 py-1 text-xs text-slate-200 hover:border-slate-600 disabled:opacity-60"
                      >
                        Read
                      </button>
                      <button
                        type="button"
                        disabled={busy}
                        onClick={() => quickStatus(m, "archived")}
                        className="rounded-md border border-purple-500/30 bg-purple-500/10 px-2 py-1 text-xs text-purple-200 hover:bg-purple-500/15 disabled:opacity-60"
                      >
                        Archivar
                      </button>
                      <button
                        type="button"
                        disabled={busy}
                        onClick={() => askDelete(m)}
                        className="rounded-md border border-red-500/30 bg-red-500/10 px-2 py-1 text-xs text-red-200 hover:bg-red-500/15 disabled:opacity-60"
                      >
                        Eliminar
                      </button>
                    </div>
                  </Td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className="px-4 py-10 text-center">
                  <p className="text-sm text-slate-300">No hay mensajes con ese filtro.</p>
                  <p className="mt-1 text-xs text-slate-500">
                    Ajusta el buscador o cambia el status.
                  </p>
                </td>
              </tr>
            )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Detail modal */}
      <MessageDetailModal
        open={detailOpen}
        message={selected}
        busy={busy}
        onClose={() => (busy ? null : setDetailOpen(false))}
        onMarkRead={() => quickStatus(selected, "read")}
        onArchive={() => quickStatus(selected, "archived")}
        onDelete={() => setConfirmOpen(true)}
      />

      {/* Confirm delete */}
      <ConfirmDialog
        open={confirmOpen}
        title="Eliminar mensaje"
        description={
          selected
            ? `Vas a eliminar el mensaje de "${selected.name}" (${selected.email}). Esta acción no se puede deshacer.`
            : "¿Seguro que deseas eliminar?"
        }
        confirmText="Eliminar"
        onClose={() => (busy ? null : setConfirmOpen(false))}
        onConfirm={handleDelete}
        loading={busy}
        danger
      />
    </div>
  );
}

function MiniCard({ label, value }) {
  return (
    <div className="rounded-2xl border border-slate-800/80 bg-slate-950/60 p-4">
      <p className="text-xs text-slate-400">{label}</p>
      <p className="mt-1 text-lg font-semibold text-white">{value}</p>
    </div>
  );
}

function Th({ children, align }) {
  return (
    <th className="px-4 py-3 font-medium" style={{ textAlign: align || "left" }}>
      {children}
    </th>
  );
}

function Td({ children, align, className }) {
  return (
    <td
      className={["px-4 py-3", className || ""].join(" ")}
      style={{ textAlign: align || "left" }}
    >
      {children}
    </td>
  );
}
