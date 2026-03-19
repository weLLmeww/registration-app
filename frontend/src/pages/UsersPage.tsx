import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getUsers, deleteUser } from '../api.ts';
import type { UserResponse } from '../api.ts';
import type { AxiosError } from 'axios';

export default function UsersPage() {
  const [users, setUsers] = useState<UserResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [confirmId, setConfirmId] = useState<number | null>(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await getUsers();
        setUsers(res.data);
      } catch (err) {
        const axiosErr = err as AxiosError;
        setError(axiosErr.message || 'Failed to load users');
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  const handleDelete = async (id: number) => {
    setDeletingId(id);
    try {
      await deleteUser(id);
      setUsers((prev) => prev.filter((u) => u.id !== id));
    } catch {
      setError('Failed to delete user');
    } finally {
      setDeletingId(null);
      setConfirmId(null);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-65px)]">
        <svg className="animate-spin w-8 h-8 text-accent" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
        </svg>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-65px)]">
        <div className="text-center animate-fadeInUp">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-error/15 flex items-center justify-center">
            <svg className="w-8 h-8 text-error" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <p className="text-text-muted text-sm">Убедитесь, что сервер запущен</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-6 py-12">
      <div className="animate-fadeInUp">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold font-sans tracking-tight">Зарегистрированные пользователи</h1>
            <p className="text-text-muted text-sm mt-1">
              {users.length} {users.length === 1 ? 'пользователь' : 'пользователей'} всего
            </p>
          </div>
          <Link
            to="/"
            className="px-4 py-2 rounded-xl bg-accent hover:bg-accent-hover text-white text-sm font-medium transition-all duration-200 hover:shadow-lg hover:shadow-accent/25"
          >
            + Новый пользователь
          </Link>
        </div>
        <div className="space-y-3">
          {users.map((user, index) => (
            <div
              key={user.id}
              className="group bg-surface/60 backdrop-blur-sm border border-border/50 rounded-xl p-5 hover:border-accent/30 hover:bg-surface-light/1000 transition-all duration-500"
              style={{ animationDelay: `${index * 60}ms`, animation: 'fadeInUp 0.4s ease-out forwards', opacity: 0 }}
            >
              <div className="flex items-center gap-4">
                <div className="w-11 h-11 rounded-full bg-accent/15 flex items-center justify-center shrink-0">
                  <span className="text-accent font-semibold text-sm">
                    {user.name.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div className="min-w-0 flex-1">
                  <p className="font-medium text-text truncate">{user.name}</p>
                  <p className="text-sm text-text-muted truncate">{user.email}</p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-text-muted/40 text-xs font-sans">#{index + 1}</span>
                  {confirmId === user.id ? (
                    <div className="flex items-center gap-2 animate-fadeInRight">
                      <button
                        onClick={() => handleDelete(user.id)}
                        disabled={deletingId === user.id}
                        className="px-3 py-1.5 rounded-lg bg-error/15 text-error text-xs font-medium hover:bg-error/25 transition-all disabled:opacity-50 cursor-pointer"
                      >
                        {deletingId === user.id ? (
                          <svg className="animate-spin w-3.5 h-3.5" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                          </svg>
                        ) : 'Да'}
                      </button>
                      <button
                        onClick={() => setConfirmId(null)}
                        className="px-3 py-1.5 rounded-lg bg-gray/50 text-black/50 text-xs font-medium hover:text-text transition-all cursor-pointer"
                      >
                        Нет
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => setConfirmId(user.id)}
                      className="opacity-0 group-hover:opacity-100 p-2 rounded-lg text-text-muted/50 hover:text-error hover:bg-error/10 transition-all duration-200 cursor-pointer"
                      title="Удалить пользователя"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
