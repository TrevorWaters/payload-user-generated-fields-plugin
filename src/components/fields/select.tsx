'use client'

import { FieldError } from '@payloadcms/ui'
import React from 'react'
import Select from 'react-select'

import type { SelectField as SelectFieldType } from '../../exports/types.js'

import { useFieldState } from './hooks/useFieldState.js'

export const SelectField: React.FC<
  {
    groupName: string
    path: string
  } & SelectFieldType
> = ({ id, groupName, label, options, path, placeholder, required: requiredFromProps, width }) => {
  const { errorState, handleInputChange, jsonFieldValue } = useFieldState({ id, groupName, path })

  const currentValue = jsonFieldValue?.find((value) => value.id === id)?.value
  const selectedOption = options.find((option) => option.value === currentValue)

  const onInputChange = (option: { label: string; value: string } | null): void => {
    handleInputChange(option?.value ?? '')
  }

  const styles = width
    ? ({ '--field-width': `${width}%` } as React.CSSProperties)
    : {
        flex: '1 1 auto',
      }
  return (
    <div className={`field-type select ${errorState.showError ? 'error' : ''}`} style={styles}>
      <label className="field-label" htmlFor={id}>
        {label}
        {requiredFromProps && <span className="required">*</span>}
      </label>
      <div className="field-type__wrap">
        <FieldError message={errorState.message} showError={errorState.showError} />
        <Select
          aria-label={label}
          aria-required={requiredFromProps}
          className="react-select"
          classNamePrefix="rs"
          id={id}
          isClearable={!requiredFromProps}
          onChange={onInputChange}
          options={options}
          placeholder={placeholder}
          required={requiredFromProps}
          unstyled
          value={selectedOption}
        />
      </div>
    </div>
  )
}
