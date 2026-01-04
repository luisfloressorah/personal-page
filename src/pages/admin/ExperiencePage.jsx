import { useEffect, useMemo, useState } from "react";
import { ensureCsrf } from "../../api/csrf";
import {
  listExperience,
  createExperience,
  updateExperience,
  deleteExperience,
} from "../../api/experience";

import ExperienceFormModal from "../../components/admin/experience/ExperienceFormModal";
import ConfirmDialog from "../../components/common/ConfirmDialog";

function formatDate(iso) {
  if (!iso) return "—";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "—";
  return d.toISOString().slice(0, 10);
}

export default function ExperiencePage() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState("create"); // create | edit
  const [selected, setSelected] = useState(null);

  const [confirmOpen, setConfirmOpen] = useState(false);

  async function load() {
    setLoading(true);
    setError("");
    try {
      const data = await listExperience();
      setRows(Array.isArray(data) ? data : []);
    } catch (e) {
      setError(e?.response?.data?.message || e?.message || "No se pudo cargar experience.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  const sortedRows = useMemo(() => {
    return [...rows].sort((a, b) => {
      const ao = Number(a.order ?? 0);
      const bo = Number(b.order ?? 0);
      if (ao !== bo) return ao - bo;
      // fallback: startDate desc
      return new Date(b.startDate || 0).getTime() - new Date(a.startDate || 0).getTime();
    });
  }, [rows]);

  const stats = useMemo(() => {
    const total = rows.length;
    const current = rows.filter((r) => r.isCurrent).length;
    return { total, current };
  }, [rows]);

  function openCreate() {
    setSelected(null);
    setModalMode("create");
    setModalOpen(true);
  }

  function openEdit(row) {
    setSelected(row);
    setModalMode("edit");
    setModalOpen(true);
  }

  function openDelete(row) {
    setSelected(row);
    setConfirmOpen(true);
  }

  async function handleSave(payload) {
    setBusy(true);
    setError("");
    try {
      await ensureCsrf();

      if (modalMode === "create") {
        const created = await createExperience(payload);
        setRows((prev) => [created, ...prev]);
      } else {
        const updated = await updateExperience(selected._id, payload);
        setRows((prev) => prev.map((r) => (r._id === updated._id ? updated : r)));
      }

      setModalOpen(false);
      setSelected(null);
    } catch (e) {
      setError(e?.response?.data?.message || e?.message || "No se pudo guardar.");
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
      await deleteExperience(selected._id);
      setRows((prev) => prev.filter((r) => r._id !== selected._id));
      setConfirmOpen(false);
      setSelected(null);
    } catch (e) {
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
          <h2 className="text-lg font-semibold text-white">Experience</h2>
          <p className="text-xs text-slate-400">
            Administra tu timeline profesional (CRUD). Orden recomendado por <b>order</b>.
          </p>
        </div>

        <div className="flex gap-2">
          <button
            type="button"
            onClick={load}
            disabled={loading}
            className="rounded-md border border-slate-800 px-3 py-2 text-xs text-slate-200 hover:border-slate-600 disabled:opacity-60"
          >
            {loading ? "Cargando..." : "Recargar"}
          </button>
          <button
            type="button"
            onClick={openCreate}
            className="rounded-md bg-accent px-3 py-2 text-xs font-medium text-slate-950 hover:opacity-90"
          >
            + Nueva experiencia
          </button>
        </div>
      </div>

      {/* Mini stats */}
      <div className="grid gap-3 sm:grid-cols-3">
        <MiniCard label="Total" value={stats.total} />
        <MiniCard label="Actuales" value={stats.current} />
        <MiniCard label="Ordenado por" value="order" />
      </div>

      {error ? (
        <div className="rounded-xl border border-red-500/20 bg-red-500/5 p-3 text-xs text-red-300">
          {error}
        </div>
      ) : null}

      {/* Table */}
      <div className="rounded-2xl border border-slate-800/80 bg-slate-950/60 overflow-hidden">
        <div className="flex items-center justify-between px-4 py-3 border-b border-slate-800">
          <p className="text-sm font-medium text-white">Listado</p>
          <p className="text-xs text-slate-500">{rows.length} registros</p>
        </div>

        <div className="overflow-auto">
          <table className="min-w-full text-left text-sm">
            <thead className="bg-slate-900/40 text-xs text-slate-400">
            <tr>
              <Th>Order</Th>
              <Th>Role</Th>
              <Th>Company</Th>
              <Th>Dates</Th>
              <Th>Current</Th>
              <Th>Tags</Th>
              <Th align="right">Acciones</Th>
            </tr>
            </thead>

            <tbody className="divide-y divide-slate-800/80">
            {loading ? (
              <tr>
                <td colSpan={7} className="px-4 py-10 text-center text-slate-400">
                  Cargando...
                </td>
              </tr>
            ) : sortedRows.length ? (
              sortedRows.map((r) => (
                <tr key={r._id} className="hover:bg-slate-900/30">
                  <Td>{Number(r.order ?? 0)}</Td>
                  <Td>
                    <div className="min-w-0">
                      <p className="text-white truncate">{r.role}</p>
                      {r.location ? (
                        <p className="text-xs text-slate-500 truncate">{r.location}</p>
                      ) : null}
                    </div>
                  </Td>
                  <Td className="text-slate-200">{r.company}</Td>
                  <Td className="text-slate-300">
                    {formatDate(r.startDate)} → {r.isCurrent ? "Actual" : formatDate(r.endDate)}
                  </Td>
                  <Td>
                      <span className={r.isCurrent ? greenBadge : grayBadge}>
                        {r.isCurrent ? "Sí" : "No"}
                      </span>
                  </Td>
                  <Td>
                    <div className="flex flex-wrap gap-1">
                      {(r.tags || []).slice(0, 4).map((t) => (
                        <span key={t} className={tagPill}>
                            {t}
                          </span>
                      ))}
                      {(r.tags || []).length > 4 ? (
                        <span className="text-xs text-slate-500">
                            +{(r.tags || []).length - 4}
                          </span>
                      ) : null}
                    </div>
                  </Td>
                  <Td align="right">
                    <div className="flex justify-end gap-2 px-4 py-2">
                      <button
                        type="button"
                        onClick={() => openEdit(r)}
                        className="rounded-md border border-slate-800 px-2 py-1 text-xs text-slate-200 hover:border-slate-600"
                      >
                        Editar
                      </button>
                      <button
                        type="button"
                        onClick={() => openDelete(r)}
                        className="rounded-md border border-red-500/30 px-2 py-1 text-xs text-red-300 hover:border-red-400"
                      >
                        Eliminar
                      </button>
                    </div>
                  </Td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={7} className="px-4 py-10 text-center">
                  <p className="text-sm text-slate-300">Aún no tienes experiencia.</p>
                  <p className="mt-1 text-xs text-slate-500">
                    Crea el primer registro con “Nueva experiencia”.
                  </p>
                </td>
              </tr>
            )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modals */}
      <ExperienceFormModal
        open={modalOpen}
        mode={modalMode}
        initialData={selected}
        onClose={() => (busy ? null : setModalOpen(false))}
        onSubmit={handleSave}
        loading={busy}
      />

      <ConfirmDialog
        open={confirmOpen}
        title="Eliminar experiencia"
        description={
          selected
            ? `Vas a eliminar: "${selected.role}" en "${selected.company}". Esta acción no se puede deshacer.`
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
    <th
      className="px-4 py-3 font-medium"
      style={{ textAlign: align || "left" }}
    >
      {children}
    </th>
  );
}

function Td({ children, align }) {
  return (
    <td className="px-4 py-3" style={{ textAlign: align || "left" }}>
      {children}
    </td>
  );
}

const grayBadge =
  "inline-flex items-center rounded-full border border-slate-700 bg-slate-900/40 px-2 py-1 text-[11px] text-slate-300";
const greenBadge =
  "inline-flex items-center rounded-full border border-emerald-500/20 bg-emerald-500/10 px-2 py-1 text-[11px] text-emerald-300";
const tagPill =
  "inline-flex items-center rounded-full border border-slate-800 bg-slate-900/40 px-2 py-1 text-[11px] text-slate-300";
