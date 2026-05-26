import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import LoginForm from '../../src/components/auth/LoginForm';

vi.mock('../src/components/common/Input', () => ({
  default: ({ label, error, onChange, disabled, ...props }) => (
    <div>
      <label>{label}</label>
      <input
        data-testid={`input-${props.name}`}
        onChange={onChange}
        disabled={disabled}
        {...props}
      />
      {error && <span data-testid={`error-${props.name}`}>{error}</span>}
    </div>
  ),
}));

vi.mock('../src/components/common/Button', () => ({
  default: ({ text, disabled, type }) => (
    <button type={type} disabled={disabled} data-testid="submit-btn">
      {text}
    </button>
  ),
}));

describe('LoginForm', () => {
  it('calls onLogin when username and password are valid', async () => {
    const user = userEvent.setup();
    const mockOnLogin = vi.fn().mockResolvedValue({ success: true });

    render(<LoginForm onLogin={mockOnLogin} />);

    await user.type(screen.getByTestId('input-username'), 'admin');
    await user.type(screen.getByTestId('input-password'), 'password');

    fireEvent.click(screen.getByTestId('submit-btn'));

    await waitFor(() => {
      expect(mockOnLogin).toHaveBeenCalledWith('admin', 'password');
    });
  });

  it('shows loading text while submitting', async () => {
    const user = userEvent.setup();
    const mockOnLogin = vi.fn(
      () => new Promise((resolve) => setTimeout(() => resolve({ success: true }), 20))
    );

    render(<LoginForm onLogin={mockOnLogin} />);

    await user.type(screen.getByTestId('input-username'), 'admin');
    await user.type(screen.getByTestId('input-password'), 'password');

    fireEvent.click(screen.getByTestId('submit-btn'));

    expect(screen.getByTestId('submit-btn')).toHaveTextContent('Signing In...');
  });

  it('shows validation errors when fields are empty', async () => {
    const mockOnLogin = vi.fn();

    render(<LoginForm onLogin={mockOnLogin} />);

    fireEvent.click(screen.getByTestId('submit-btn'));

    expect(await screen.findByTestId('error-username')).toHaveTextContent(
      'Username is required'
    );
    expect(screen.getByTestId('error-password')).toHaveTextContent(
      'Password is required'
    );
    expect(mockOnLogin).not.toHaveBeenCalled();
  });

  it('does not call onLogin when username is missing', async () => {
    const user = userEvent.setup();
    const mockOnLogin = vi.fn();

    render(<LoginForm onLogin={mockOnLogin} />);

    await user.type(screen.getByTestId('input-password'), 'password');

    fireEvent.click(screen.getByTestId('submit-btn'));

    expect(await screen.findByTestId('error-username')).toHaveTextContent(
      'Username is required'
    );
    expect(mockOnLogin).not.toHaveBeenCalled();
  });

  it('does not call onLogin when password is missing', async () => {
    const user = userEvent.setup();
    const mockOnLogin = vi.fn();

    render(<LoginForm onLogin={mockOnLogin} />);

    await user.type(screen.getByTestId('input-username'), 'admin');

    fireEvent.click(screen.getByTestId('submit-btn'));

    expect(await screen.findByTestId('error-password')).toHaveTextContent(
      'Password is required'
    );
    expect(mockOnLogin).not.toHaveBeenCalled();
  });

  it('shows external login error', () => {
    render(
      <LoginForm
        onLogin={vi.fn()}
        error="Invalid username or password"
      />
    );

    expect(screen.getByText('Invalid username or password')).toBeInTheDocument();
  });

  it('disables inputs and button when loading', () => {
    render(<LoginForm onLogin={vi.fn()} isLoading={true} />);

    expect(screen.getByTestId('input-username')).toBeDisabled();
    expect(screen.getByTestId('input-password')).toBeDisabled();
    expect(screen.getByTestId('submit-btn')).toBeDisabled();
  });
});