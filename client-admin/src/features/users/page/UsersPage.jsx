import { useEffect, useState } from 'react';
import { Users, CheckCircle2, RefreshCw, Search, XCircle, Ban, Unlock } from 'lucide-react';
import toast from 'react-hot-toast';
import {
  activateUserRequest,
  denyUserRequest,
  blockUserRequest,
  unblockUserRequest,
  getAuthErrorMessage,
  getUsersRequest,
} from '../../../shared/api/api';
import { clearUserPenaltyRequest } from '../../../shared/api/adminApi';

export function UsersPage() {
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [actionId, setActionId] = useState(null);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('pending'); // pending | active | blocked | all
  const [loadError, setLoadError] = useState('');

  const fetchUsers = async () => {
    setIsLoading(true);
    setLoadError('');
    try {
      const res = await getUsersRequest();
      const list = Array.isArray(res.data?.data) ? res.data.data : [];
      setUsers(list);
    } catch (error) {
      const message = getAuthErrorMessage(error, 'Error al cargar usuarios');
      setLoadError(message);
      setUsers([]);
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const runAction = async (userId, action) => {
    setActionId(userId);
    try {
      if (action === 'activate') {
        await activateUserRequest(userId);
        toast.success('Usuario activado');
      } else if (action === 'deny') {
        await denyUserRequest(userId);
        toast.success('Acceso denegado');
      } else if (action === 'block') {
        await blockUserRequest(userId);
        toast.success('Usuario bloqueado');
      } else if (action === 'unblock') {
        await unblockUserRequest(userId);
        try {
          await clearUserPenaltyRequest(userId);
        } catch (e) {
          console.warn(e);
        }
        toast.success('Usuario rehabilitado');
      }
      await fetchUsers();
    } catch (error) {
      toast.error(getAuthErrorMessage(error, 'No se pudo completar la acción'));
    } finally {
      setActionId(null);
    }
  };

  const filtered = users.filter((u) => {
    const q = search.toLowerCase();
    const matchesSearch =
      !q ||
      u.email?.toLowerCase().includes(q) ||
      u.username?.toLowerCase().includes(q) ||
      u.name?.toLowerCase().includes(q) ||
      u.surname?.toLowerCase().includes(q);

    if (!matchesSearch) return false;
    if (filter === 'pending') return !u.status && !u.isBlocked;
    if (filter === 'active') return !!u.status && !u.isBlocked;
    if (filter === 'blocked') return !!u.isBlocked;
    return true;
  });

  const statusBadge = (user) => {
    if (user.isBlocked) {
      return { label: 'Bloqueado', className: 'bg-[#ffd6d6] text-[#7d0a42]' };
    }
    if (user.status) {
      return { label: 'Activo', className: 'bg-emerald-100 text-emerald-800' };
    }
    return { label: 'Pendiente', className: 'bg-[#fff4ea] text-[#ff8928]' };
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-black text-[#031633] uppercase font-display tracking-wider">
            Usuarios
          </h1>
          <p className="text-sm font-bold text-[#ff8928] uppercase tracking-wide">
            Aprueba, niega o rehabilita cuentas
          </p>
        </div>
        <button
          onClick={fetchUsers}
          className="bg-white hover:bg-[#f5f3f6] text-[#031633] font-black px-5 py-3 rounded-2xl border-2 border-[#031633] shadow-[3px_3px_0_0_#031633] uppercase text-xs cursor-pointer flex items-center gap-2"
        >
          <RefreshCw size={14} /> Actualizar
        </button>
      </div>

      <div className="bg-white p-5 rounded-3xl border-2 border-[#031633] shadow-[4px_4px_0_0_#031633] flex flex-col md:flex-row gap-4 items-center">
        <div className="relative w-full md:flex-1">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#031633]" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar por nombre, usuario o correo..."
            className="w-full pl-10 pr-4 py-3 bg-[#f5f3f6] rounded-2xl border-2 border-[#031633] font-bold text-sm focus:outline-none"
          />
        </div>
        <div className="flex gap-2 w-full md:w-auto flex-wrap">
          {[
            { id: 'pending', label: 'Pendientes' },
            { id: 'active', label: 'Activos' },
            { id: 'blocked', label: 'Bloqueados' },
            { id: 'all', label: 'Todos' },
          ].map((f) => (
            <button
              key={f.id}
              onClick={() => setFilter(f.id)}
              className={`px-4 py-2 text-xs font-black uppercase rounded-xl border-2 border-[#031633] cursor-pointer ${
                filter === f.id
                  ? 'bg-[#ff8928] text-white shadow-[2px_2px_0_0_#031633]'
                  : 'bg-white text-[#031633]'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {loadError && (
        <div className="bg-[#fff4ea] border-2 border-[#031633] rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <p className="text-sm font-bold text-[#031633]">{loadError}</p>
          <button
            onClick={fetchUsers}
            className="bg-[#ff8928] text-white font-black px-4 py-2 rounded-xl border-2 border-[#031633] uppercase text-[10px] cursor-pointer"
          >
            Reintentar
          </button>
        </div>
      )}

      {isLoading ? (
        <div className="text-center py-12 font-bold text-[#031633]">Cargando usuarios...</div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-3xl border-2 border-dashed border-slate-200 space-y-3">
          <Users className="mx-auto text-[#ff8928]" size={28} />
          <p className="text-sm font-black uppercase text-[#031633]">No hay usuarios en esta vista</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((user) => {
            const badge = statusBadge(user);
            const busy = actionId === user.id;
            return (
              <div
                key={user.id}
                className="bg-white rounded-3xl border-2 border-[#031633] shadow-[3px_3px_0_0_#031633] p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div className="min-w-0">
                  <p className="text-sm font-black uppercase text-[#031633] truncate">
                    {user.name} {user.surname}
                  </p>
                  <p className="text-xs font-bold text-[#ff8928] truncate">{user.email}</p>
                  <p className="text-[10px] font-bold text-[#031633]/60 uppercase mt-1">
                    @{user.username} · {user.role}
                  </p>
                </div>

                <div className="flex items-center gap-2 shrink-0 flex-wrap justify-end">
                  <span
                    className={`text-[10px] font-black uppercase px-3 py-1.5 rounded-full border-2 border-[#031633] ${badge.className}`}
                  >
                    {badge.label}
                  </span>

                  {!user.status && !user.isBlocked && (
                    <>
                      <button
                        onClick={() => runAction(user.id, 'activate')}
                        disabled={busy}
                        className="bg-[#ff8928] text-white font-black px-3 py-2 rounded-xl border-2 border-[#031633] shadow-[2px_2px_0_0_#031633] uppercase text-[10px] cursor-pointer flex items-center gap-1 disabled:opacity-60"
                      >
                        <CheckCircle2 size={14} /> Aceptar
                      </button>
                      <button
                        onClick={() => runAction(user.id, 'deny')}
                        disabled={busy}
                        className="bg-white text-[#7d0a42] font-black px-3 py-2 rounded-xl border-2 border-[#031633] uppercase text-[10px] cursor-pointer flex items-center gap-1 disabled:opacity-60"
                      >
                        <XCircle size={14} /> Negar
                      </button>
                    </>
                  )}

                  {user.status && !user.isBlocked && user.role !== 'ADMIN_ROLE' && (
                    <button
                      onClick={() => runAction(user.id, 'block')}
                      disabled={busy}
                      className="bg-white text-[#7d0a42] font-black px-3 py-2 rounded-xl border-2 border-[#031633] uppercase text-[10px] cursor-pointer flex items-center gap-1 disabled:opacity-60"
                    >
                      <Ban size={14} /> Bloquear
                    </button>
                  )}

                  {user.isBlocked && (
                    <button
                      onClick={() => runAction(user.id, 'unblock')}
                      disabled={busy}
                      className="bg-emerald-600 text-white font-black px-3 py-2 rounded-xl border-2 border-[#031633] shadow-[2px_2px_0_0_#031633] uppercase text-[10px] cursor-pointer flex items-center gap-1 disabled:opacity-60"
                    >
                      <Unlock size={14} /> Habilitar
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
