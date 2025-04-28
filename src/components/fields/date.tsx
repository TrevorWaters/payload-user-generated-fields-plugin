'use client'

import { DatePicker, FieldError } from '@payloadcms/ui'
import React from 'react'

import type { DateField as DateFieldType } from '../../exports/types.js'

import { useFieldState } from './hooks/useFieldState.js'

export const DateField: React.FC<
  {
    groupName: string
    path: string
  } & DateFieldType
> = ({
  id,
  groupName,
  label,
  path,
  pickerAppearance = 'default',
  placeholder,
  required: requiredFromProps,
  width,
}) => {
  const { errorState, handleInputChange, jsonFieldValue } = useFieldState({ id, groupName, path })

  const currentValue: string | undefined = jsonFieldValue?.find((value) => value.id === id)?.value
  const selectedDate = currentValue

  const onInputChange = (date: Date | null): void => {
    handleInputChange(date?.toISOString() ?? '')
  }

  const styles = width
    ? ({ '--field-width': `${width}%` } as React.CSSProperties)
    : {
        flex: '1 1 auto',
      }
  return (
    <div
      className={`field-type date-time-field ${errorState.showError ? 'error' : ''}`}
      style={styles}
    >
      <label className="field-label" htmlFor={id}>
        {label}
        {requiredFromProps && <span className="required">*</span>}
      </label>
      <div className="field-type__wrap">
        <FieldError message={errorState.message} showError={errorState.showError} />
        <DatePicker
          aria-label={label}
          aria-required={requiredFromProps}
          id={id}
          onChange={onInputChange}
          overrides={{
            required: requiredFromProps,
          }}
          pickerAppearance={pickerAppearance}
          placeholder={placeholder}
          value={selectedDate}
        />
      </div>
    </div>
  )
}
