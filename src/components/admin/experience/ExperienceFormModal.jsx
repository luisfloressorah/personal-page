import { useEffect, useMemo, useState } from "react";
import Modal from "../../common/Modal";

const emptyForm = {
  role: "",
  company: "",
  location: "",
  startDate: "",
  endDate: "",
  isCurrent: false,
  description: "",
  tagsText: "", // UI helper (csv)
  order: 0,
};

function toDateInputValue(iso) {
  if (!iso) return "";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  // YYYY-MM-DD
  return d.toISOString().slice(0, 10);
}

function normalizeTags(tagsText) {
  return tagsText
    .split(",")
    .map((t) => t.trim())
    .filter(Boolean);
}

export default function ExperienceFormModal({
                                              open,
                                              mode, // "create" | "edit"
                                              initialData,
                                              onClose,
                                              onSubmit,
                                              loading,
                                            }) {
  const [form, setForm] = useState(emptyForm);
  const [touched, setTouched] = useState(false);

  useEffect(() => {
    if (!open) return;

    if (mode === "edit" && initialData) {
      setForm({
        role: initialData.role ?? "",
        company: initialData.company ?? "",
        location: initialData.location ?? "",
        startDate: toDateInputValue(initialData.startDate),
        endDate: toDateInputValue(initialData.endDate),
        isCurrent: !!initialData.isCurrent,
        description: initialData.description ?? "",
        tagsText: Array.isArray(initialData.tags) ? initialData.tags.join(", ") : "",
        order: Number.isFinite(initialData.order) ? initialData.order : 0,
      });
    } else {
      setForm({ ...emptyForm, order: 0 });
    }

    setTouched(false);
  }, [open, mode, initialData]);

  const errors = useMemo(() => {
    const e = {};
    if (!form.role.trim()) e.role = "Requerido";
    if (!form.company.trim()) e.company = "Requerido";

    // si isCurrent => endDate debe ir vacío
    if (form.isCurrent && form.endDate) e.endDate = "Si es actual, endDate debe estar vacío.";

    // si endDate existe y startDate existe, validar orden
    if (form.startDate && form.endDate) {
      const s = new Date(form.startDate).getTime();
      const en = new Date(form.endDate).getTime();
      if (en < s) e.endDate = "endDate no puede ser menor que startDate.";
    }

    return e;
  }, [form]);

  const canSubmit = Object.keys(errors).length === 0 && !loading;

  function setField(key, value) {
    setTouched(true);
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setTouched(true);
    if (!canSubmit) return;

    const payload = {
      role: form.role.trim(),
      company: form.company.trim(),
      location: form.location.trim() || undefined,
      startDate: form.startDate ? new Date(form.startDate).toISOString() : undefined,
      endDate:
        form.isCurrent || !form.endDate ? null : new Date(form.endDate).toISOString(),
      isCurrent: !!form.isCurrent,
      description: form.description.trim() || undefined,
      tags: normalizeTags(form.tagsText),
      order: Number(form.order) || 0,
    };

    await onSubmit(payload);
  }

  return (
    <Modal
      open={open}
      title={mode === "edit" ? "Editar experiencia" : "Nueva experiencia"}
      onClose={loading ? undefined : onClose}
      footer={
        <div className="flex justify-end gap-2">
          <button
            type="button"
            disabled={loading}
            onClick={onClose}
            className="rounded-md border border-slate-800 px-3 py-2 text-xs text-slate-200 hover:border-slate-600 disabled:opacity-60"
          >
            Cancelar
          </button>
          <button
            type="submit"
            form="experience-form"
            disabled={!canSubmit}
            className="rounded-md bg-accent px-3 py-2 text-xs font-medium text-slate-950 hover:opacity-90 disabled:opacity-60"
          >
            {loading ? "Guardando..." : "Guardar"}
          </button>
        </div>
      }
    >
      <form id="experience-form" onSubmit={handleSubmit} className="space-y-4">
        <div className="grid gap-3 md:grid-cols-2">
          <Field
            label="Role *"
            value={form.role}
            onChange={(v) => setField("role", v)}
            error={touched ? errors.role : ""}
          />
          <Field
            label="Company *"
            value={form.company}
            onChange={(v) => setField("company", v)}
            error={touched ? errors.company : ""}
          />
        </div>

        <div className="grid gap-3 md:grid-cols-2">
          <Field
            label="Location"
            value={form.location}
            onChange={(v) => setField("location", v)}
            placeholder="México / Remoto"
          />
          <Field
            label="Order"
            type="number"
            value={String(form.order)}
            onChange={(v) => setField("order", v)}
            placeholder="1"
          />
        </div>

        <div className="grid gap-3 md:grid-cols-2">
          <Field
            label="Start Date"
            type="date"
            value={form.startDate}
            onChange={(v) => setField("startDate", v)}
          />
          <div className="space-y-2">
            <Field
              label="End Date"
              type="date"
              value={form.endDate}
              onChange={(v) => setField("endDate", v)}
              disabled={form.isCurrent}
              error={touched ? errors.endDate : ""}
            />
            <label className="flex items-center gap-2 text-xs text-slate-300">
              <input
                type="checkbox"
                checked={form.isCurrent}
                onChange={(e) => {
                  const checked = e.target.checked;
                  setField("isCurrent", checked);
                  if (checked) setField("endDate", "");
                }}
                className="accent-[var(--accent)]"
              />
              Trabajo actual (isCurrent)
            </label>
          </div>
        </div>

        <Textarea
          label="Description"
          value={form.description}
          onChange={(v) => setField("description", v)}
          rows={5}
          placeholder="Qué hiciste, logros, contexto…"
        />

        <Field
          label="Tags (separadas por coma)"
          value={form.tagsText}
          onChange={(v) => setField("tagsText", v)}
          placeholder="React, Tailwind, NestJS"
        />

        <p className="text-[11px] text-slate-500">
          Tip: mantén <b>order</b> para ordenar el timeline sin depender de fechas.
        </p>
      </form>
    </Modal>
  );
}

function Field({ label, value, onChange, placeholder, error, type = "text", disabled }) {
  return (
    <label className="block">
      <div className="flex items-center justify-between">
        <span className="text-xs text-slate-300">{label}</span>
        {error ? <span className="text-[11px] text-red-300">{error}</span> : null}
      </div>
      <input
        type={type}
        value={value}
        disabled={disabled}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={[
          "mt-1 w-full rounded-md border bg-slate-950 px-3 py-2 text-sm text-white outline-none",
          disabled ? "opacity-60" : "",
          error ? "border-red-500/40 focus:border-red-400" : "border-slate-800 focus:border-slate-600",
        ].join(" ")}
      />
    </label>
  );
}

function Textarea({ label, value, onChange, rows = 4, placeholder, error }) {
  return (
    <label className="block">
      <div className="flex items-center justify-between">
        <span className="text-xs text-slate-300">{label}</span>
        {error ? <span className="text-[11px] text-red-300">{error}</span> : null}
      </div>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        rows={rows}
        placeholder={placeholder}
        className={[
          "mt-1 w-full resize-y rounded-md border bg-slate-950 px-3 py-2 text-sm text-white outline-none",
          error ? "border-red-500/40 focus:border-red-400" : "border-slate-800 focus:border-slate-600",
        ].join(" ")}
      />
    </label>
  );
}
