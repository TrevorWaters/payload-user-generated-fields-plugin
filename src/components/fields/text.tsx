'use client'

import { FieldError } from '@payloadcms/ui'
import React from 'react'

import type { TextField as TextFieldType } from '../../exports/types.js'

import { useFieldState } from './hooks/useFieldState.js'

export const Text: React.FC<
  {
    groupName: string
    path: string
  } & TextFieldType
> = ({ id, groupName, label, path, placeholder, required: requiredFromProps, width }) => {
  const { errorState, handleInputChange, jsonFieldValue } = useFieldState({ id, groupName, path })

  const onInputChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    handleInputChange(e.target.value)
  }

  const styles = !width
    ? {
        flex: '1 1 auto',
      }
    : ({ '--field-width': `${width}%` } as React.CSSProperties)

  return (
    <div className={`field-type text ${errorState.showError ? 'error' : ''}`} style={styles}>
      <label className="field-label" htmlFor={id}>
        {label}
        {requiredFromProps && <span className="required">*</span>}
      </label>
      <div className="field-type__wrap">
        <FieldError message={errorState.message} showError={errorState.showError} />
        <input
          aria-invalid={true}
          aria-label={label}
          id={id}
          onChange={onInputChange}
          placeholder={placeholder}
          required={requiredFromProps}
          type="text"
          value={jsonFieldValue?.find((value) => value.id === id)?.value}
        />
      </div>
    </div>
  )
}
