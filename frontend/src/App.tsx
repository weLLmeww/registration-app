import { Routes, Route, Link, useLocation } from 'react-router-dom';
import RegisterPage from './pages/RegisterPage.tsx';
import UsersPage from './pages/UsersPage.tsx';

export default function App() {
  const location = useLocation();

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-[-20%] left-[-10%] w-125 h-125 rounded-full bg-accent/5 blur-[120px]" />
        <div className="absolute bottom-[-20%] right-[-10%] w-150 h-150 rounded-full bg-purple-600/5 blur-[120px]" />
      </div>

      {/* Navigation */}
      <nav className="relative z-10 border-b border-border/50 backdrop-blur-sm bg-white/50  ">
        <div className="max-w-5xl mx-auto py-4 flex items-center justify-between">
          <Link to="/" className="font-sans text-2xl font-bold tracking-tight text-accent hover:text-accent-hover transition-colors">
            KWORK
          </Link>
          <div className="flex gap-1">
            <Link
              to="/"
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                location.pathname === '/'
                  ? 'bg-accent/15 text-accent'
                  : 'text-text-muted hover:text-text hover:bg-surface-light/50'
              }`}
            >
              Регистрация
            </Link>
            <Link
              to="/users"
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                location.pathname === '/users'
                  ? 'bg-accent/15 text-accent'
                  : 'text-text-muted hover:text-text hover:bg-surface-light/50'
              }`}
            >
              Пользователи
            </Link>
          </div>
        </div>
      </nav>

      {/* Content */}
      <main className="relative z-10">
        <Routes>
          <Route path="/" element={<RegisterPage />} />
          <Route path="/users" element={<UsersPage />} />
        </Routes>
      </main>
    </div>
  );
}
