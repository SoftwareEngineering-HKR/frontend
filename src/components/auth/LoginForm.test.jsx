import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import LoginForm from './LoginForm';

vi.mock('../common/Input', () => ({
  default: ({ label, error, onChange, disabled, ...props }) => (
    <div>
      <label>{label}</label>
      <input data-testid={`input-${props.name}`} onChange={onChange} disabled={disabled} {...props} />
      {error && <span data-testid={`error-${props.name}`}>{error}</span>}
    </div>
  )
}));

vi.mock('../common/Button', () => ({
  default: ({ text, disabled, type }) => (
    <button type={type} disabled={disabled} data-testid="submit-btn">{text}</button>
  )
}));

describe('LoginForm', () => {
  it('validates submission and handles loading', async () => {
    const mockOnLogin = vi.fn().mockImplementation(() => new Promise(res => setTimeout(res, 10)));
    const user = userEvent.setup();
    render(<LoginForm onLogin={mockOnLogin} />);
    
    await user.type(screen.getByTestId('input-username'), 'admin');
    await user.type(screen.getByTestId('input-password'), 'password');
    fireEvent.click(screen.getByTestId('submit-btn'));
    
    expect(screen.getByTestId('submit-btn')).toHaveTextContent('Signing In...');
    await waitFor(() => expect(mockOnLogin).toHaveBeenCalledWith('admin', 'password'));
  });
});