// components/__tests__/UnitField.test.tsx
import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import UnitField from '../UnitField'; // Adjust path as necessary
import { UnitValue, ValidationError } from '../../containers/types';

describe('UnitField Component', () => {
  const mockHandleAmountChange = jest.fn();
  const unitName = 'BTC';
  const initialValue: UnitValue = { [unitName]: '1.23' };
  const noError: ValidationError = { unit: '', error: '' };
  const anError: ValidationError = { unit: unitName, error: 'Invalid input' };

  beforeEach(() => {
    mockHandleAmountChange.mockClear();
  });

  it('renders the unit name and initial value', () => {
    render(
      <UnitField
        unit={unitName}
        value={initialValue}
        handleAmountChange={mockHandleAmountChange}
        validationError={noError}
      />
    );
    expect(screen.getByText(unitName)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(unitName)).toHaveValue(1.23); // Input type number
  });

  it('calls handleAmountChange on input', async () => {
    render(
      <UnitField
        unit={unitName}
        value={initialValue}
        handleAmountChange={mockHandleAmountChange}
        validationError={noError}
      />
    );
    const inputField = screen.getByPlaceholderText(unitName);
    // userEvent.type clears and then types. For appending or specific changes, clear first or use 'type' carefully.
    // Let's simulate typing '456' after clearing existing '1.23'
    userEvent.clear(inputField);
    userEvent.type(inputField, '456');

    // Check last call because type may call it multiple times for each character
    expect(mockHandleAmountChange).toHaveBeenLastCalledWith('456', unitName);
    // Or check how many times it was called if each character is a separate call
    // For example, if it's called for '4', then '45', then '456'
    // expect(mockHandleAmountChange).toHaveBeenCalledTimes(3); // '4', '5', '6'
  });

  it('displays an error message when validationError matches the unit', () => {
    render(
      <UnitField
        unit={unitName}
        value={initialValue}
        handleAmountChange={mockHandleAmountChange}
        validationError={anError}
      />
    );
    expect(screen.getByText(anError.error)).toBeInTheDocument();
    // Check if input has error styling (e.g. border-red)
    const inputField = screen.getByPlaceholderText(unitName);
    expect(inputField).toHaveClass('border-red');
  });

  it('does not display an error message when validationError is for another unit', () => {
    render(
      <UnitField
        unit={unitName}
        value={initialValue}
        handleAmountChange={mockHandleAmountChange}
        validationError={{ unit: 'OTHER_UNIT', error: 'Some other error' }}
      />
    );
    expect(screen.queryByText(anError.error)).not.toBeInTheDocument();
    const inputField = screen.getByPlaceholderText(unitName);
    expect(inputField).not.toHaveClass('border-red');
  });

  it('disables the input field and shows disabled styling when disabled prop is true', () => {
    render(
      <UnitField
        unit={unitName}
        value={{ [unitName]: '0' }}
        handleAmountChange={mockHandleAmountChange}
        validationError={noError}
        disabled={true}
      />
    );
    const inputField = screen.getByPlaceholderText('N/A') as HTMLInputElement; // Placeholder changes when disabled
    expect(inputField).toBeDisabled();
    expect(inputField).toHaveClass('cursor-not-allowed');
    expect(inputField.closest('div.flex')).toHaveClass('opacity-70');

    // Attempt to type - should not call handler
    userEvent.type(inputField, '123');
    expect(mockHandleAmountChange).not.toHaveBeenCalled();
  });

   it('does not show error styling if disabled, even if there is an error for the unit', () => {
    render(
      <UnitField
        unit={unitName}
        value={initialValue}
        handleAmountChange={mockHandleAmountChange}
        validationError={anError} // Error IS present for this unit
        disabled={true} // But field is disabled
      />
    );
    // Error message div should not be rendered
    expect(screen.queryByText(anError.error)).not.toBeInTheDocument();

    // Input field should have disabled styling, not error styling
    const inputField = screen.getByPlaceholderText('N/A');
    expect(inputField).toHaveClass('bg-gray-100'); // Part of disabled style
    expect(inputField).not.toHaveClass('border-red'); // Should not have error style
  });

});
