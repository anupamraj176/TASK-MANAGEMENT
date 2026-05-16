import { useState, useEffect, useCallback } from 'react';
import { userService } from '../../services/userService';
import UsersTable from '../../components/admin/UsersTable';
import UserModal from '../../components/admin/UserModal';
import DeleteUserModal from '../../components/admin/DeleteUserModal';
import toast from 'react-hot-toast';

export default function UsersPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({ page: 1, limit: 10, total: 0, totalPages: 1 });
  const [search, setSearch] = useState('');
  
  const [modalOpen, setModalOpen] = useState(false);
  const [editUser, setEditUser] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await userService.getUsers({
        page: pagination.page,
        limit: pagination.limit,
        search,
      });
      setUsers(data.data || data.users || []);
      setPagination(prev => ({
        ...prev,
        total: data.total || data.users?.length || 0,
        totalPages: data.totalPages || 1
      }));
    } catch (err) {
      toast.error('Failed to load users');
    } finally {
      setLoading(false);
    }
  }, [pagination.page, pagination.limit, search]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const handlePageChange = (page) => setPagination(prev => ({ ...prev, page }));
  
  const openCreate = () => { setEditUser(null); setModalOpen(true); };
  const openEdit = (user) => { setEditUser(user); setModalOpen(true); };
  
  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-[#1A1A2E]">Users</h1>
            <p className="text-sm text-[#8B8FA8] mt-0.5">Manage system access and roles</p>
          </div>
          <button
            onClick={openCreate}
            className="flex items-center gap-2 px-4 py-2.5 bg-[#5C6AC4] text-white text-sm font-medium
              rounded-xl hover:bg-[#4a58b0] transition-colors shadow-sm"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            New User
          </button>
        </div>

        <div className="flex items-center gap-4 bg-[#F5F6FA] p-2 rounded-xl">
          <div className="relative flex-1 max-w-md">
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8B8FA8]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name or email..."
              className="w-full pl-9 pr-4 py-2 bg-white border border-[#E2E4ED] rounded-lg text-sm text-[#1A1A2E] placeholder-[#8B8FA8] focus:outline-none focus:ring-2 focus:ring-[#5C6AC4]/30 focus:border-[#5C6AC4] transition-all"
            />
          </div>
        </div>

        <UsersTable 
          users={users} 
          loading={loading} 
          onEdit={openEdit}
          onDelete={setDeleteTarget}
        />

        {pagination.totalPages > 1 && (
          <div className="flex justify-between items-center mt-4">
            <p className="text-sm text-[#8B8FA8]">
              Showing page {pagination.page} of {pagination.totalPages}
            </p>
            <div className="flex gap-2">
              <button 
                disabled={pagination.page === 1}
                onClick={() => handlePageChange(pagination.page - 1)}
                className="px-3 py-1.5 border border-[#E2E4ED] rounded-lg text-sm disabled:opacity-50"
              >
                Previous
              </button>
              <button 
                disabled={pagination.page === pagination.totalPages}
                onClick={() => handlePageChange(pagination.page + 1)}
                className="px-3 py-1.5 border border-[#E2E4ED] rounded-lg text-sm disabled:opacity-50"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>

      <UserModal 
        isOpen={modalOpen} 
        user={editUser} 
        onClose={() => setModalOpen(false)}
        onSuccess={() => { setModalOpen(false); fetchUsers(); }}
      />
      
      <DeleteUserModal
        user={deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onSuccess={() => { setDeleteTarget(null); fetchUsers(); }}
      />
    </div>
  );
}
