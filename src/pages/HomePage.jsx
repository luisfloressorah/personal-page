import Navbar from '../components/Navbar.jsx'

export default function HomePage() {
  return (
    <>
      <Navbar />
      <main className="pt-20">
        {/* HERO */}
        <section className="min-h-[80vh] flex items-center justify-center bg-gradient-to-b from-slate-900 to-slate-950">
          <div className="mx-auto flex max-w-5xl flex-col gap-6 px-4 text-center">
            <p className="text-sm uppercase tracking-[0.25em] text-accent/80">
              Desarrollador Web · React · Node.js
            </p>
            <h1 className="text-5xl md:text-6xl font-bold text-white leading-tight">
              Construyo experiencias digitales con propósito y tecnología moderna.
            </h1>
            <p className="max-w-2xl mx-auto text-base text-slate-300">
              Desarrollador enfocado en arquitectura web, UI moderna y backend eficiente.
              Creo soluciones pensadas para usuarios reales y entornos productivos.
            </p>
            <div className="flex justify-center gap-3">
              <a
                href="#projects"
                className="rounded-full bg-primary px-6 py-2 text-sm font-medium text-white hover:bg-secondary transition-colors"
              >
                Ver proyectos
              </a>
              <a
                href="#contact"
                className="rounded-full border border-slate-600 px-6 py-2 text-sm text-slate-200 hover:border-accent hover:text-accent transition-colors"
              >
                Contáctame
              </a>
            </div>
          </div>
        </section>

        {/* SOBRE MÍ */}
        <section id="about" className="py-20 bg-slate-900/40">
          <div className="mx-auto max-w-5xl px-4 text-center">
            <h2 className="text-3xl font-semibold text-white mb-4">Sobre mí</h2>
            <p className="text-slate-300 max-w-2xl mx-auto leading-relaxed">
              Soy <strong>Luis Francisco Flores Robles</strong>, desarrollador full-stack con experiencia en React, Vue, Node.js y NestJS.
              Mi enfoque está en crear interfaces limpias, escalables y con rendimiento óptimo, manteniendo una arquitectura de código robusta y mantenible.
            </p>
          </div>
        </section>

        {/* SKILLS */}
        <section id="skills" className="py-20">
          <div className="mx-auto max-w-5xl px-4">
            <h2 className="text-3xl font-semibold text-white text-center mb-10">Habilidades principales</h2>
            <div className="grid gap-6 md:grid-cols-3">
              {[
                {
                  title: 'Frontend',
                  desc: 'React, TailwindCSS, Vite, accesibilidad, rendimiento y diseño modular.'
                },
                {
                  title: 'Backend',
                  desc: 'Node.js, NestJS, REST APIs, autenticación JWT, PostgreSQL, Prisma.'
                },
                {
                  title: 'DevOps / Integraciones',
                  desc: 'Docker, CI/CD, integración de servicios, despliegues en nube.'
                }
              ].map((skill, i) => (
                <div
                  key={i}
                  className="rounded-xl border border-slate-800 bg-slate-950/70 p-6 hover:border-accent transition-colors"
                >
                  <h3 className="font-semibold text-primary mb-2">{skill.title}</h3>
                  <p className="text-slate-300 text-sm leading-relaxed">{skill.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* PROYECTOS */}
        <section id="projects" className="py-20 bg-slate-900/40">
          <div className="mx-auto max-w-5xl px-4 text-center">
            <h2 className="text-3xl font-semibold text-white mb-6">Proyectos destacados</h2>
            <p className="text-slate-400 text-sm mb-10">
              Algunos ejemplos de aplicaciones y sistemas que he desarrollado.
            </p>

            <div className="grid gap-6 md:grid-cols-3">
              <div className="rounded-xl border border-slate-800 bg-slate-950/70 p-5 hover:border-accent transition-colors">
                <p className="text-lg font-semibold text-white">Dashboard moderno</p>
                <p className="text-slate-400 text-sm">Panel de control con autenticación JWT y API modular.</p>
              </div>
              <div className="rounded-xl border border-slate-800 bg-slate-950/70 p-5 hover:border-accent transition-colors">
                <p className="text-lg font-semibold text-white">Gestor de contenidos</p>
                <p className="text-slate-400 text-sm">CMS personalizado con NestJS y PostgreSQL.</p>
              </div>
              <div className="rounded-xl border border-slate-800 bg-slate-950/70 p-5 hover:border-accent transition-colors">
                <p className="text-lg font-semibold text-white">Landing optimizada</p>
                <p className="text-slate-400 text-sm">Frontend rápido en Vite + Tailwind, SEO y performance A+.</p>
              </div>
            </div>
          </div>
        </section>

        {/* CONTACTO */}
        <section id="contact" className="py-20">
          <div className="mx-auto max-w-5xl px-4 text-center">
            <h2 className="text-3xl font-semibold text-white mb-6">Contacto</h2>
            <p className="text-slate-400 mb-8">
              Si tienes un proyecto o quieres colaborar, envíame un mensaje.
            </p>
            <form className="grid gap-4 max-w-lg mx-auto text-left">
              <input
                type="text"
                placeholder="Nombre"
                className="rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-white outline-none focus:border-primary"
              />
              <input
                type="email"
                placeholder="Correo electrónico"
                className="rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-white outline-none focus:border-primary"
              />
              <textarea
                rows="4"
                placeholder="Mensaje"
                className="rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-white outline-none focus:border-primary"
              />
              <button
                type="submit"
                className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-secondary transition-colors"
              >
                Enviar
              </button>
            </form>
          </div>
        </section>
      </main>
    </>
  )
}
