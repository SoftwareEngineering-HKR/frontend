import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import RegisterForm from '../../src/components/auth/RegisterForm';

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

describe('RegisterForm', () => {
  it('calls onSignup when form is valid', async () => {
    const user = userEvent.setup();
    const mockOnSignup = vi.fn().mockResolvedValue({ success: true });

    render(<RegisterForm onSignup={mockOnSignup} />);

    await user.type(screen.getByTestId('input-username'), 'admin');
    await user.type(screen.getByTestId('input-password'), 'password123');
    await user.type(screen.getByTestId('input-confirmPassword'), 'password123');

    fireEvent.click(screen.getByTestId('submit-btn'));

    await waitFor(() => {
      expect(mockOnSignup).toHaveBeenCalledWith('admin', 'password123');
    });
  });

  it('shows validation errors when fields are empty', async () => {
    const mockOnSignup = vi.fn();

    render(<RegisterForm onSignup={mockOnSignup} />);

    fireEvent.click(screen.getByTestId('submit-btn'));

    expect(await screen.findByTestId('error-username')).toHaveTextContent(
      'Username is required'
    );
    expect(screen.getByTestId('error-password')).toHaveTextContent(
      'Password is required'
    );
    expect(mockOnSignup).not.toHaveBeenCalled();
  });

  it('validates short password', async () => {
    const user = userEvent.setup();
    const mockOnSignup = vi.fn();

    render(<RegisterForm onSignup={mockOnSignup} />);

    await user.type(screen.getByTestId('input-username'), 'admin');
    await user.type(screen.getByTestId('input-password'), '123');
    await user.type(screen.getByTestId('input-confirmPassword'), '123');

    fireEvent.click(screen.getByTestId('submit-btn'));

    expect(await screen.findByTestId('error-password')).toHaveTextContent(
      'Must be at least 6 characters'
    );
    expect(mockOnSignup).not.toHaveBeenCalled();
  });

  it('validates password matching', async () => {
    const user = userEvent.setup();
    const mockOnSignup = vi.fn();

    render(<RegisterForm onSignup={mockOnSignup} />);

    await user.type(screen.getByTestId('input-username'), 'admin');
    await user.type(screen.getByTestId('input-password'), 'password123');
    await user.type(screen.getByTestId('input-confirmPassword'), 'mismatch');

    fireEvent.click(screen.getByTestId('submit-btn'));

    expect(await screen.findByTestId('error-confirmPassword')).toHaveTextContent(
      'Passwords do not match'
    );
    expect(mockOnSignup).not.toHaveBeenCalled();
  });

  it('shows loading text while submitting', async () => {
    const user = userEvent.setup();
    const mockOnSignup = vi.fn(
      () => new Promise((resolve) => setTimeout(() => resolve({ success: true }), 20))
    );

    render(<RegisterForm onSignup={mockOnSignup} />);

    await user.type(screen.getByTestId('input-username'), 'admin');
    await user.type(screen.getByTestId('input-password'), 'password123');
    await user.type(screen.getByTestId('input-confirmPassword'), 'password123');

    fireEvent.click(screen.getByTestId('submit-btn'));

    expect(screen.getByTestId('submit-btn')).toHaveTextContent(
      'Creating Account...'
    );
  });

  it('shows external signup error', () => {
    render(
      <RegisterForm
        onSignup={vi.fn()}
        error="Username already exists"
      />
    );

    expect(screen.getByText('Username already exists')).toBeInTheDocument();
  });

  it('disables inputs and button when loading', () => {
    render(<RegisterForm onSignup={vi.fn()} isLoading={true} />);

    expect(screen.getByTestId('input-username')).toBeDisabled();
    expect(screen.getByTestId('input-password')).toBeDisabled();
    expect(screen.getByTestId('input-confirmPassword')).toBeDisabled();
    expect(screen.getByTestId('submit-btn')).toBeDisabled();
  });
});