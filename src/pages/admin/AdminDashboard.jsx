import { useEffect, useMemo, useState } from "react";
import StatCard from "../../components/admin/StatCard";
import QuickAction from "../../components/admin/QuickAction";

import { ensureCsrf } from "../../api/csrf";
import { getAdminProjects } from "../../api/projects";
import { listMessages } from "../../api/messages";
import { useAuth } from "../../auth/AuthProvider";

export default function AdminDashboard() {
  const { logout } = useAuth();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [projects, setProjects] = useState([]);
  const [messages, setMessages] = useState([]);

  async function load() {
    setLoading(true);
    setError("");

    try {
      // CSRF listo para rutas protegidas
      await ensureCsrf();

      // Cargar en paralelo
      const [projectsRes, messagesRes] = await Promise.all([
        getAdminProjects(),
        listMessages(),
      ]);

      setProjects(Array.isArray(projectsRes) ? projectsRes : []);
      setMessages(Array.isArray(messagesRes) ? messagesRes : []);
    } catch (e) {
      // Si sesión expira, cerramos sesión local (AdminLayout redirige al login)
      if (e?.response?.status === 401) {
        logout?.();
        return;
      }

      const msg =
        e?.response?.data?.message ||
        e?.message ||
        "No se pudo cargar el dashboard.";

      setError(msg);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Stats: por ahora con length
  const stats = useMemo(() => {
    const totalProjects = projects.length;

    const publishedCount = projects.filter((p) => p.status === "published").length;
    const draftCount = projects.filter((p) => p.status === "draft").length;

    const totalMessages = messages.length;
    const newMessages = messages.filter((m) => m.status === "new").length;

    return {
      totalProjects,
      publishedCount,
      draftCount,
      totalMessages,
      newMessages,
      servicesCount: 0,
    };
  }, [projects, messages]);

  // mensajes recientes (últimos 5) ordenados por createdAt desc
  const recentMessages = useMemo(() => {
    return [...messages]
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 5);
  }, [messages]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div className="flex flex-col gap-2">
          <h2 className="text-3xl font-semibold text-white">Dashboard</h2>
          <p className="text-sm text-slate-400">
            Resumen general del sitio: proyectos, contenido y mensajes.
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

      {error ? (
        <div className="rounded-xl border border-red-500/20 bg-red-500/5 p-3 text-xs text-red-300">
          {error}
        </div>
      ) : null}

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-3">
        <StatCard
          title="Proyectos"
          value={stats.totalProjects}
          subtitle={
            loading ? "" : `${stats.publishedCount} publicados • ${stats.draftCount} draft`
          }
          loading={loading}
        />

        <StatCard
          title="Servicios"
          value={stats.servicesCount}
          subtitle="(Se conecta cuando exista endpoint)"
          loading={loading}
        />

        <StatCard
          title="Mensajes"
          value={stats.totalMessages}
          subtitle={loading ? "" : `${stats.newMessages} nuevos`}
          loading={loading}
        />
      </div>

      {/* Grid: acciones + mensajes recientes */}
      <div className="grid gap-4 lg:grid-cols-3">
        {/* Quick actions */}
        <div className="lg:col-span-2 space-y-3">
          <h3 className="text-sm font-semibold text-white">Acciones rápidas</h3>

          <div className="grid gap-3 sm:grid-cols-2">
            <QuickAction
              title="Nuevo proyecto"
              description="Agrega un caso de estudio a tu portfolio."
              to="/admin/projects/new"
            />
            <QuickAction
              title="Editar Home"
              description="Cambia headline, about y CTAs sin tocar código."
              to="/admin/content/home"
            />
            <QuickAction
              title="Experience"
              description="Administra tu trayectoria profesional."
              to="/admin/experience"
            />
            <QuickAction
              title="Mensajes"
              description="Revisa los últimos contactos."
              to="/admin/messages"
            />
          </div>

          {/* Mensajes recientes */}
          <div className="rounded-2xl border border-slate-800/80 bg-slate-950/60 p-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-white">Mensajes recientes</h3>
              <a
                href="/admin/messages"
                className="text-xs text-slate-400 hover:text-accent transition"
              >
                Ver todos →
              </a>
            </div>

            <div className="mt-3 divide-y divide-slate-800/80">
              {loading ? (
                <div className="space-y-2">
                  <div className="h-10 rounded-md bg-slate-800/40 animate-pulse" />
                  <div className="h-10 rounded-md bg-slate-800/40 animate-pulse" />
                  <div className="h-10 rounded-md bg-slate-800/40 animate-pulse" />
                </div>
              ) : recentMessages.length ? (
                recentMessages.map((m) => (
                  <div key={m._id} className="py-3">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <p className="text-sm text-white truncate">
                          {m.name} <span className="text-slate-500">•</span>{" "}
                          <span className="text-slate-400">{m.email}</span>
                        </p>
                        <p className="mt-1 text-xs text-slate-400 line-clamp-2">
                          {m.message}
                        </p>
                      </div>

                      <span className={badgeClass(m.status)}>{m.status}</span>
                    </div>
                  </div>
                ))
              ) : (
                <p className="py-6 text-center text-xs text-slate-500">
                  No hay mensajes todavía.
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Panel lateral */}
        <div className="rounded-2xl border border-slate-800/80 bg-slate-950/60 p-4">
          <h3 className="text-sm font-semibold text-white">Estado</h3>

          <div className="mt-3 space-y-3 text-xs">
            <Row label="API" value="/api (ok)" />
            <Row label="CSRF" value="XSRF-TOKEN (ok)" />
            <Row label="Stats" value="Calculado con .length" />
          </div>

          <div className="mt-4 rounded-xl border border-slate-800 bg-slate-900/40 p-3">
            <p className="text-xs text-slate-300">
              Cuando hagamos paginación pro, migramos a:
              <span className="text-slate-200"> {`{ items, total }`}</span>.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function Row({ label, value }) {
  return (
    <div className="flex items-center justify-between gap-4">
      <span className="text-slate-500">{label}</span>
      <span className="text-slate-200">{value}</span>
    </div>
  );
}

function badgeClass(status) {
  const base = "shrink-0 rounded-full border px-2 py-1 text-[11px] leading-none";

  if (status === "new") {
    return `${base} border-emerald-500/20 bg-emerald-500/10 text-emerald-300`;
  }
  if (status === "read") {
    return `${base} border-slate-700 bg-slate-900/40 text-slate-300`;
  }
  if (status === "archived") {
    return `${base} border-purple-500/20 bg-purple-500/10 text-purple-300`;
  }
  return `${base} border-slate-700 bg-slate-900/40 text-slate-300`;
}
