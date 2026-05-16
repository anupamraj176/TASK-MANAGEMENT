import { useState } from 'react';
import { userService } from '../../services/userService';
import toast from 'react-hot-toast';

export default function DeleteUserModal({ user, onClose, onSuccess }) {
  const [deleting, setDeleting] = useState(false);

  if (!user) return null;

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await userService.deleteUser(user._id);
      toast.success('User deleted successfully');
      onSuccess();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to delete user');
      setDeleting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-[#1A1A2E]/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl w-full max-w-sm shadow-2xl overflow-hidden zoom-in-95 animate-in duration-200">
        <div className="p-6 text-center space-y-4">
          <div className="w-12 h-12 rounded-full bg-red-50 text-red-500 flex items-center justify-center mx-auto">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold text-[#1A1A2E]">Delete User</h3>
            <p className="text-sm text-[#8B8FA8] mt-1">
              Are you sure you want to delete <span className="font-medium text-[#1A1A2E]">{user.email}</span>? This action cannot be undone.
            </p>
          </div>

          <div className="pt-2 flex gap-3 w-full">
            <button
              onClick={onClose}
              disabled={deleting}
              className="flex-1 px-4 py-2 text-sm font-medium text-[#1A1A2E] bg-gray-50 border border-[#E2E4ED] rounded-xl hover:bg-gray-100 transition-colors disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              onClick={handleDelete}
              disabled={deleting}
              className="flex-1 px-4 py-2 text-sm font-medium text-white bg-red-500 rounded-xl hover:bg-red-600 transition-colors disabled:opacity-50"
            >
              {deleting ? 'Deleting...' : 'Delete User'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
