import { useState, useEffect } from 'react';
import { userService } from '../../services/userService';
import toast from 'react-hot-toast';

export default function UserModal({ isOpen, user, onClose, onSuccess }) {
  const isEdit = Boolean(user);
  
  const [form, setForm] = useState({
    name: '',
    email: '',
    role: 'user',
    password: ''
  });
  
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (user) {
      setForm({
        name: user.name || '',
        email: user.email || '',
        role: user.role || 'user',
        password: '' // empty for edit
      });
    } else {
      setForm({ name: '', email: '', role: 'user', password: '' });
    }
    setError('');
  }, [user, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');
    
    try {
      if (isEdit) {
        await userService.updateUser(user._id, {
          name: form.name,
          email: form.email,
          role: form.role,
        });
        toast.success('User updated successfully');
      } else {
        await userService.createUser({
          name: form.name,
          email: form.email,
          role: form.role,
          password: form.password
        });
        toast.success('User created successfully');
      }
      onSuccess();
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-[#1A1A2E]/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl overflow-hidden zoom-in-95 animate-in duration-200">
        <div className="px-6 py-4 border-b border-[#E2E4ED] flex items-center justify-between">
          <h2 className="text-lg font-semibold text-[#1A1A2E]">
            {isEdit ? 'Edit User' : 'Create New User'}
          </h2>
          <button onClick={onClose} className="p-2 text-[#8B8FA8] hover:bg-[#F5F6FA] rounded-full transition-colors">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="p-3 bg-red-50 text-red-600 text-sm rounded-lg border border-red-100">
              {error}
            </div>
          )}
          
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-[#1A1A2E]">Full Name <span className="text-red-500">*</span></label>
            <input
              type="text"
              required
              value={form.name}
              onChange={(e) => setForm(prev => ({ ...prev, name: e.target.value }))}
              className="w-full px-3 py-2 border border-[#E2E4ED] rounded-lg focus:ring-2 focus:ring-[#5C6AC4]/30 focus:border-[#5C6AC4] outline-none"
              placeholder="John Doe"
            />
          </div>
          
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-[#1A1A2E]">Email Address <span className="text-red-500">*</span></label>
            <input
              type="email"
              required
              value={form.email}
              onChange={(e) => setForm(prev => ({ ...prev, email: e.target.value }))}
              className="w-full px-3 py-2 border border-[#E2E4ED] rounded-lg focus:ring-2 focus:ring-[#5C6AC4]/30 focus:border-[#5C6AC4] outline-none"
              placeholder="john@example.com"
            />
          </div>
          
          {!isEdit && (
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-[#1A1A2E]">Temporary Password <span className="text-red-500">*</span></label>
              <input
                type="text"
                required
                value={form.password}
                onChange={(e) => setForm(prev => ({ ...prev, password: e.target.value }))}
                className="w-full px-3 py-2 border border-[#E2E4ED] rounded-lg focus:ring-2 focus:ring-[#5C6AC4]/30 focus:border-[#5C6AC4] outline-none"
                placeholder="Secure password..."
              />
            </div>
          )}
          
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-[#1A1A2E]">Role</label>
            <select
              value={form.role}
              onChange={(e) => setForm(prev => ({ ...prev, role: e.target.value }))}
              className="w-full px-3 py-2 border border-[#E2E4ED] rounded-lg focus:ring-2 focus:ring-[#5C6AC4]/30 focus:border-[#5C6AC4] outline-none"
            >
              <option value="user">User</option>
              <option value="admin">Admin</option>
            </select>
          </div>
          
          <div className="pt-4 flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-[#8B8FA8] hover:text-[#1A1A2E] hover:bg-[#F5F6FA] rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-4 py-2 text-sm font-medium text-white bg-[#5C6AC4] hover:bg-[#4a58b0] rounded-lg transition-colors disabled:opacity-50"
            >
              {submitting ? 'Saving...' : isEdit ? 'Save Changes' : 'Create User'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
