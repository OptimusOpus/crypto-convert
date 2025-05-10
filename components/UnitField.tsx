import React, { ChangeEvent } from 'react';
import { UnitValue, ValidationError } from '../containers/types';

type Props = {
    unit: string;
    value: UnitValue;
    handleAmountChange: (amount: string, unit: string) => void;
    validationError: ValidationError;
}

const UnitField = ({ unit, value, handleAmountChange, validationError }: Props): JSX.Element => {
    const handleChange = (evt: ChangeEvent<HTMLInputElement>) => {
        handleAmountChange(evt.target.value, unit);
    };

    const hasError = validationError.unit === unit;
    
    return (
        <div key={unit}>
            <div className="flex justify-between items-center p-4 bg-white rounded-lg shadow-sm border border-grey-200 hover:border-blue-light transition-colors duration-200">
                <div className="font-600 text-blue-darkest">
                    {unit}
                </div>
                <input
                    type="number"
                    name={unit}
                    className={hasError 
                        ? "border-2 border-red rounded-md w-3/4 md:w-1/3 p-2 text-black focus:outline-none focus:ring-2 focus:ring-red" 
                        : "border border-grey-300 rounded-md w-3/4 md:w-1/3 p-2 text-black focus:outline-none focus:ring-2 focus:ring-blue-light"}
                    placeholder={unit}
                    value={value[unit]}
                    onChange={handleChange}
                    id={unit}
                    key={unit}
                    autoComplete="off"
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
