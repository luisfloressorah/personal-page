import { Link } from 'react-router-dom'

export default function Navbar() {
  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-slate-800 bg-slate-900/70 backdrop-blur-md">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        {/* Marca personal */}
        <Link
          to="/"
          className="text-lg font-semibold tracking-tight text-primary hover:text-accent transition-colors"
        >
          Luis<span className="text-slate-200"> Flores</span>
        </Link>

        {/* Links desktop */}
        <div className="hidden items-center gap-6 text-sm text-slate-200 md:flex">
          <a href="#about" className="hover:text-accent transition-colors">Sobre mí</a>
          <a href="#skills" className="hover:text-accent transition-colors">Habilidades</a>
          <a href="#projects" className="hover:text-accent transition-colors">Proyectos</a>
          <a href="#contact" className="hover:text-accent transition-colors">Contacto</a>
        </div>
      </nav>
    </header>
  )
}
