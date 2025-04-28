'use client'

import { FieldError } from '@payloadcms/ui'
import React from 'react'

import type { RadioField as RadioFieldType } from '../../../exports/types.js'

import { useFieldState } from '../hooks/useFieldState.js'
import './index.css'

export const Radio: React.FC<
  {
    groupName: string
    path: string
  } & RadioFieldType
> = ({ id, groupName, label, options, path, required: requiredFromProps, width }) => {
  const { errorState, handleInputChange, jsonFieldValue } = useFieldState({ id, groupName, path })

  const currentValue = jsonFieldValue?.find((value) => value.id === id)?.value

  const onInputChange = (value: string): void => {
    handleInputChange(value)
  }

  const styles = width
    ? ({ '--field-width': `${width}%` } as React.CSSProperties)
    : {
        flex: '1 1 auto',
      }

  return (
    <fieldset
      aria-invalid={errorState.showError}
      className={`field-type radio-group radio-group--layout-horizontal`}
      style={styles}
    >
      <legend className="field-label">
        {label}
        {requiredFromProps && <span className="required">*</span>}
      </legend>
      <div className="field-type__wrap">
        <FieldError message={errorState.message} showError={errorState.showError} />
        <ul className="radio-group--group" id={id}>
          {options?.map((option) => (
            <li key={option.value}>
              <label htmlFor={`${id}-${option.value}`}>
                <div
                  className={`radio-input ${currentValue === option.value ? 'radio-input--is-selected' : ''}`}
                >
                  <input
                    aria-label={option.label}
                    checked={currentValue === option.value}
                    id={`${id}-${option.value}`}
                    name={id}
                    onChange={() => onInputChange(option.value)}
                    required={requiredFromProps}
                    type="radio"
                    value={option.value}
                  />
                  <span className="radio-input__styled-radio"></span>
                  <span className="radio-input__label">{option.label}</span>
                </div>
              </label>
            </li>
          ))}
        </ul>
      </div>
    </fieldset>
  )
}
