import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import CheckInput from './CheckInput';

describe('CheckInput', () => {
  it('renders and toggles when clicked', () => {
    const mockOnClick = vi.fn();

    render(<CheckInput state={false} onClick={mockOnClick} />);

    const checkbox = screen.getByRole('checkbox');
    expect(checkbox).toBeInTheDocument();
    expect(checkbox).not.toBeChecked();

    fireEvent.click(checkbox);
    expect(mockOnClick).toHaveBeenCalled();
  });
});
