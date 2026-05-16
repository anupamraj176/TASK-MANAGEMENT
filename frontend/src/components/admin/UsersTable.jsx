export default function UsersTable({ users, loading, onEdit, onDelete }) {
  if (loading) {
    return (
      <div className="bg-white rounded-xl border border-[#E2E4ED] shadow-sm overflow-hidden">
        <div className="p-8 flex justify-center">
          <div className="w-8 h-8 border-4 border-[#5C6AC4] border-t-transparent rounded-full animate-spin"></div>
        </div>
      </div>
    );
  }

  if (!users || users.length === 0) {
    return (
      <div className="bg-white rounded-xl border border-[#E2E4ED] shadow-sm overflow-hidden p-12 text-center">
        <div className="w-12 h-12 bg-[#F5F6FA] rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-6 h-6 text-[#8B8FA8]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
          </svg>
        </div>
        <h3 className="text-[#1A1A2E] font-medium text-lg mb-1">No users found</h3>
        <p className="text-[#8B8FA8] text-sm">Try adjusting your search criteria</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl border border-[#E2E4ED] shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-[#E2E4ED] bg-[#F9FAFC]">
              <th className="px-6 py-4 text-xs font-semibold text-[#8B8FA8] uppercase tracking-wider">User</th>
              <th className="px-6 py-4 text-xs font-semibold text-[#8B8FA8] uppercase tracking-wider">Role</th>
              <th className="px-6 py-4 text-xs font-semibold text-[#8B8FA8] uppercase tracking-wider">Created</th>
              <th className="px-6 py-4 text-xs font-semibold text-[#8B8FA8] uppercase tracking-wider text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#E2E4ED]">
            {users.map((user) => (
              <tr key={user._id} className="hover:bg-[#F9FAFC] transition-colors group">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-[#5C6AC4]/10 text-[#5C6AC4] flex items-center justify-center font-medium text-sm">
                      {user.name ? user.name.substring(0, 1).toUpperCase() : '?'}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-[#1A1A2E]">{user.name}</p>
                      <p className="text-xs text-[#8B8FA8]">{user.email}</p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className={`inline-flex items-center px-2 py-1 rounded-md text-xs font-medium ${
                    user.role === 'admin' 
                      ? 'bg-purple-50 text-purple-700 ring-1 ring-inset ring-purple-600/20' 
                      : 'bg-gray-50 text-gray-600 ring-1 ring-inset ring-gray-500/10'
                  }`}>
                    {user.role}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-[#8B8FA8]">
                  {new Date(user.createdAt).toLocaleDateString()}
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => onEdit(user)}
                      className="p-1.5 text-[#8B8FA8] hover:text-[#5C6AC4] hover:bg-[#5C6AC4]/10 rounded-lg transition-colors"
                      title="Edit"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                      </svg>
                    </button>
                    <button
                      onClick={() => onDelete(user)}
                      className="p-1.5 text-[#8B8FA8] hover:text-[#EF4444] hover:bg-red-50 rounded-lg transition-colors"
                      title="Delete"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
