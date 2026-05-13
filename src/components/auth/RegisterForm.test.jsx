import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import RegisterForm from './RegisterForm';

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
  default: ({ text, disabled }) => <button disabled={disabled} data-testid="submit-btn">{text}</button>
}));

describe('RegisterForm', () => {
  it('validates password matching', async () => {
    const user = userEvent.setup();
    render(<RegisterForm onSignup={vi.fn()} />);
    
    await user.type(screen.getByTestId('input-password'), 'password123');
    await user.type(screen.getByTestId('input-confirmPassword'), 'mismatch');
    fireEvent.click(screen.getByTestId('submit-btn'));
    
    expect(await screen.findByTestId('error-confirmPassword')).toHaveTextContent('Passwords do not match');
  });
});