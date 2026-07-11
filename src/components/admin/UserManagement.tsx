import { useState, useEffect, useCallback } from 'react';
import { Shield, UserPlus, Trash2 } from 'lucide-react';
import {
  fetchAdminUsers,
  createAdminUser,
  updateAdminUserRole,
  deleteAdminUser,
  type AdminUser,
  type UserRole,
} from '../../lib/admin-users';

export function UserManagement() {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [newUserEmail, setNewUserEmail] = useState('');
  const [newUserRole, setNewUserRole] = useState<UserRole>('editor');
  const [newUserName, setNewUserName] = useState('');

  const loadUsers = useCallback(async () => {
    setIsLoading(true);
    const { data, error } = await fetchAdminUsers();
    if (error) {
      setError(error.message);
    } else {
      setUsers(data || []);
    }
    setIsLoading(false);
  }, []);

  useEffect(() => {
    void loadUsers();
  }, [loadUsers]);

  const handleAddUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUserEmail.trim()) {
      setError('البريد الإلكتروني مطلوب');
      return;
    }

    setError('');
    setIsSubmitting(true);

    // للتبسيط، سنستخدم البريد الإلكتروني كـ user_id
    // في التطبيق الحقيقي، يجب الحصول على user_id من auth.users
    const { error: insertError } = await createAdminUser({
      user_id: newUserEmail,
      role: newUserRole,
      full_name: newUserName || null,
    });

    if (insertError) {
      setError(insertError.message);
      setIsSubmitting(false);
      return;
    }

    setNewUserEmail('');
    setNewUserRole('editor');
    setNewUserName('');
    setShowAddForm(false);
    await loadUsers();
    setIsSubmitting(false);
  };

  const handleUpdateRole = async (userId: string, newRole: UserRole) => {
    const { error } = await updateAdminUserRole(userId, newRole);
    if (error) {
      setError(error.message);
    } else {
      await loadUsers();
    }
  };

  const handleDeleteUser = async (id: string) => {
    if (!confirm('هل أنت متأكد من حذف هذا المستخدم؟')) {
      return;
    }

    const { error } = await deleteAdminUser(id);
    if (error) {
      setError(error.message);
    } else {
      await loadUsers();
    }
  };

  const roleColors: Record<UserRole, string> = {
    super_admin: 'bg-copper/20 text-copper-lt border-copper/30',
    admin: 'bg-brass/20 text-brass-lt border-brass/30',
    editor: 'bg-emerald/20 text-emerald-lt border-emerald/30',
  };

  return (
    <div className="space-y-6">
      {/* رأس القسم */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg border border-brass/25 bg-brass/8 flex items-center justify-center">
            <Shield className="w-5 h-5 text-brass-lt" />
          </div>
          <div>
            <h3 className="font-ruqaa text-xl text-sand">إدارة المستخدمين</h3>
            <p className="text-sm text-sand-dim">إدارة صلاحيات المشرفين والمحررين</p>
          </div>
        </div>
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="flex items-center gap-2 px-4 py-2 rounded-lg border border-brass/30 text-sm font-kufi text-brass-lt hover:bg-brass/10 transition-colors"
        >
          <UserPlus className="w-4 h-4" />
          إضافة مستخدم
        </button>
      </div>

      {/* نموذج إضافة مستخدم */}
      {showAddForm && (
        <div className="rounded-xl border border-brass/20 bg-ink-2/60 p-5">
          <h4 className="font-kufi text-lg text-brass-lt mb-4">إضافة مستخدم جديد</h4>
          <form onSubmit={(e) => { void handleAddUser(e); }} className="grid gap-3">
            <input
              type="email"
              value={newUserEmail}
              onChange={(e) => setNewUserEmail(e.target.value)}
              placeholder="البريد الإلكتروني"
              className="rounded-lg border border-brass/20 bg-ink/70 px-3 py-2 text-sand placeholder:text-sand-dim/60 focus:outline-none focus:border-brass/50"
              required
            />
            <input
              type="text"
              value={newUserName}
              onChange={(e) => setNewUserName(e.target.value)}
              placeholder="الاسم الكامل (اختياري)"
              className="rounded-lg border border-brass/20 bg-ink/70 px-3 py-2 text-sand placeholder:text-sand-dim/60 focus:outline-none focus:border-brass/50"
            />
            <select
              value={newUserRole}
              onChange={(e) => setNewUserRole(e.target.value as UserRole)}
              className="rounded-lg border border-brass/20 bg-ink/70 px-3 py-2 text-sand focus:outline-none focus:border-brass/50"
            >
              <option value="editor">محرر</option>
              <option value="admin">مشرف</option>
              <option value="super_admin">مشرف عام</option>
            </select>
            <div className="flex gap-2">
              <button
                type="submit"
                disabled={isSubmitting}
                className="rounded-lg bg-brass/20 border border-brass/35 px-4 py-2 text-sm font-kufi text-brass-lt hover:bg-brass/30 transition-colors disabled:opacity-60"
              >
                {isSubmitting ? 'جارٍ الإضافة...' : 'إضافة'}
              </button>
              <button
                type="button"
                onClick={() => setShowAddForm(false)}
                className="rounded-lg border border-sand/25 px-4 py-2 text-sm font-kufi text-sand-dim hover:bg-sand/10 transition-colors"
              >
                إلغاء
              </button>
            </div>
          </form>
        </div>
      )}

      {/* قائمة المستخدمين */}
      {isLoading ? (
        <p className="text-sm font-kufi text-sand-dim">جارٍ تحميل المستخدمين...</p>
      ) : users.length === 0 ? (
        <p className="text-sm font-kufi text-sand-dim">لا يوجد مستخدمين حالياً.</p>
      ) : (
        <div className="grid gap-3">
          {users.map((user) => (
            <div
              key={user.id}
              className="rounded-xl border border-brass/15 bg-ink/50 p-4 flex items-center justify-between gap-4"
            >
              <div className="flex-1">
                <p className="font-serif text-lg text-sand">
                  {user.full_name || 'بدون اسم'}
                </p>
                <p className="text-sm text-sand-dim">{user.user_id}</p>
              </div>
              <div className="flex items-center gap-3">
                <select
                  value={user.role}
                  onChange={(e) => { void handleUpdateRole(user.id, e.target.value as UserRole); }}
                  className={`rounded-lg border px-3 py-1.5 text-sm font-kufi focus:outline-none focus:border-brass/50 ${roleColors[user.role]}`}
                >
                  <option value="editor">محرر</option>
                  <option value="admin">مشرف</option>
                  <option value="super_admin">مشرف عام</option>
                </select>
                <button
                  onClick={() => { void handleDeleteUser(user.id); }}
                  className="p-2 rounded-lg border border-copper/40 text-copper hover:bg-copper/10 transition-colors"
                  aria-label="حذف المستخدم"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {error && <p className="text-xs font-kufi text-copper">{error}</p>}
    </div>
  );
}
