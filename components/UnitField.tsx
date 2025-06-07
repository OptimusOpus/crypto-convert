import React, { ChangeEvent } from 'react';
import { UnitValue, ValidationError } from '../containers/types';

type Props = {
    unit: string;
    value: UnitValue;
    handleAmountChange: (amount: string, unit: string) => void;
    validationError: ValidationError;
    disabled?: boolean; // Added disabled prop
}

const UnitField = ({ unit, value, handleAmountChange, validationError, disabled = false }: Props): JSX.Element => {
    const handleChange = (evt: ChangeEvent<HTMLInputElement>) => {
        if (disabled) return; // Prevent change if disabled
        handleAmountChange(evt.target.value, unit);
    };

    const hasError = !disabled && validationError.unit === unit; // Only show error if not disabled
    
    // Base input classes
    let inputClasses = "border border-grey-300 rounded-md w-3/4 md:w-1/3 p-2 text-black focus:outline-none focus:ring-2 focus:ring-blue-light";
    if (hasError) {
        inputClasses = "border-2 border-red rounded-md w-3/4 md:w-1/3 p-2 text-black focus:outline-none focus:ring-2 focus:ring-red";
    } else if (disabled) {
        inputClasses = "border border-grey-300 rounded-md w-3/4 md:w-1/3 p-2 text-gray-500 bg-gray-100 cursor-not-allowed focus:outline-none";
    }

    return (
        <div key={unit}>
            <div className={`flex justify-between items-center p-4 bg-white rounded-lg shadow-sm border border-grey-200 ${disabled ? 'opacity-70' : 'hover:border-blue-light transition-colors duration-200'}`}>
                <div className={`font-600 ${disabled ? 'text-gray-500' : 'text-blue-darkest'}`}>
                    {unit}
                </div>
                <input
                    type="number"
                    name={unit}
                    className={inputClasses}
                    placeholder={disabled ? "N/A" : unit}
                    value={value[unit] !== undefined ? value[unit] : ''} // Ensure value is not undefined
                    onChange={handleChange}
                    id={unit}
                    // key={unit} // Redundant if the parent div or mapping key is set, which it is.
                    autoComplete="off"
                    disabled={disabled} // Apply disabled attribute
                />
            </div>
            {hasError && (
                <div className="font-400 py-2 px-4 mt-2 mb-4 text-sm text-red-dark rounded-md bg-red-lightest border-l-4 border-red">
                    {validationError.error}
                </div>
            )}
        </div>
    );
};

export default UnitField;
