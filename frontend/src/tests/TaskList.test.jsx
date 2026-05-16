import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { describe, it, expect, vi } from 'vitest';
import TaskTable from '../components/tasks/TaskTable';

// Mock the Auth hook
vi.mock('../hooks/useAuth', () => ({
  useAuth: () => ({
    user: { _id: '1', role: 'user' },
  }),
}));

const mockTasks = [
  {
    _id: '1',
    title: 'Test Task 1',
    description: 'Description 1',
    status: 'todo',
    priority: 'high',
    dueDate: new Date().toISOString(),
    assignedTo: { _id: '2', name: 'John Doe', email: 'john@example.com' },
  },
];

const mockSort = { field: 'createdAt', order: 'desc' };

describe('TaskTable Component', () => {
  it('renders loading state', () => {
    const { container } = render(
      <BrowserRouter>
        <TaskTable loading={true} tasks={[]} sort={mockSort} onSort={vi.fn()} onEdit={vi.fn()} onDelete={vi.fn()} />
      </BrowserRouter>
    );
    expect(container.querySelector('.animate-pulse')).toBeInTheDocument();
  });

  it('renders empty state when no tasks exist', () => {
    render(
      <BrowserRouter>
        <TaskTable loading={false} tasks={[]} sort={mockSort} onSort={vi.fn()} onEdit={vi.fn()} onDelete={vi.fn()} />
      </BrowserRouter>
    );
    expect(screen.getByText(/no tasks found/i)).toBeInTheDocument();
  });

  it('renders a list of tasks', () => {
    render(
      <BrowserRouter>
        <TaskTable loading={false} tasks={mockTasks} sort={mockSort} onSort={vi.fn()} onEdit={vi.fn()} onDelete={vi.fn()} />
      </BrowserRouter>
    );
    expect(screen.getByText('Test Task 1')).toBeInTheDocument();
    expect(screen.getByText('John Doe')).toBeInTheDocument();
  });
});
