import React from 'react';
import { Crypto } from './constants'

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
        <div className="flex justify-between py-4 px-2 md:p-4 my-2 bg-blue-light rounded">
            <div className="font-500">
                {unit}:
            </div>
            <input
                type="number"
                name={unit}
                className={validationError.unit == unit ? "border-4 border-red w-3/4 md:w-1/3 p-1" : "w-3/4 md:w-1/3 p-1"}
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
                    <div className="font-600 py-4 px-2 my-2 mx-1 text-red-dark rounded bg-red-lightest">
                        {validationError.error}:
                    </div>
                )
            }
        </div >
    );
  }

export default UnitFeild