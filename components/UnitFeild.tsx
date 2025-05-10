import React from 'react';

type ValidationError = {
    unit: string,
    error: string,
}

type Props = {
    // TODO: fix up types
    unit: string,
    value: any,
    handleAmountChange: any,
    validationError: ValidationError
  }

const UnitFeild = (props: Props): JSX.Element => {
    const { unit, value, handleAmountChange, validationError } = props
    return (
        <div key={unit}>
            <div className="flex justify-between items-center p-4 bg-white rounded-lg shadow-sm border border-grey-200 hover:border-blue-light transition-colors duration-200">
                <div className="font-600 text-blue-darkest">
                    {unit}
                </div>
                <input
                    type="number"
                    name={unit}
                    className={validationError.unit == unit 
                        ? "border-2 border-red rounded-md w-3/4 md:w-1/3 p-2 text-black focus:outline-none focus:ring-2 focus:ring-red" 
                        : "border border-grey-300 rounded-md w-3/4 md:w-1/3 p-2 text-black focus:outline-none focus:ring-2 focus:ring-blue-light"}
                    placeholder={unit}
                    value={value[unit]}
                    onChange={(evt) => handleAmountChange(evt.target.value, unit)}
                    id={unit}
                    key={unit}
                    autoComplete={"off"}
                />
            </div>
            {
                validationError.unit == unit && (
                    <div className="font-400 py-2 px-4 mt-2 mb-4 text-sm text-red-dark rounded-md bg-red-lightest border-l-4 border-red">
                        {validationError.error}
                    </div>
                )
            }
        </div>
    );
  }

export default UnitFeild