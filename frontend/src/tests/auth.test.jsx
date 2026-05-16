import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { describe, it, expect, vi } from 'vitest';
import LoginPage from '../pages/auth/LoginPage';
import SignUpPage from '../pages/auth/SignUpPage';

// Mock the Zustand store
vi.mock('../store/authStore', () => ({
  useAuthStore: () => ({
    login: vi.fn(),
    signup: vi.fn(),
    isLoading: false,
    error: null,
  }),
}));

describe('Auth Pages', () => {
  it('renders LoginPage correctly', () => {
    render(
      <BrowserRouter>
        <LoginPage role="user" />
      </BrowserRouter>
    );
    expect(screen.getByPlaceholderText(/email/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /sign in/i })).toBeInTheDocument();
  });

  it('renders SignUpPage correctly', () => {
    render(
      <BrowserRouter>
        <SignUpPage role="user" />
      </BrowserRouter>
    );
    expect(screen.getByPlaceholderText(/full name/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/email/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/create a password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /create account/i })).toBeInTheDocument();
  });

  it('shows password mismatch error on SignUpPage', async () => {
    render(
      <BrowserRouter>
        <SignUpPage role="user" />
      </BrowserRouter>
    );
    
    fireEvent.change(screen.getByPlaceholderText(/create a password/i), { target: { value: 'password123' } });
    fireEvent.change(screen.getByPlaceholderText(/re-enter password/i), { target: { value: 'password456' } });
    
    fireEvent.click(screen.getByRole('button', { name: /create account/i }));
    
    expect(await screen.findByText(/passwords do not match/i)).toBeInTheDocument();
  });
});
