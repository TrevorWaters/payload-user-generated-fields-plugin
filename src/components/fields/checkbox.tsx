'use client'

import { FieldError } from '@payloadcms/ui'
import React from 'react'

import type { CheckboxField as CheckboxFieldType } from '../../exports/types.js'

import { useFieldState } from './hooks/useFieldState.js'

export const Checkbox: React.FC<
  {
    groupName: string
    path: string
  } & CheckboxFieldType
> = ({ id, groupName, label, path, required: requiredFromProps, width }) => {
  const { errorState, handleInputChange, jsonFieldValue } = useFieldState({ id, groupName, path })

  const onInputChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    handleInputChange(e.target.checked)
  }
  const styles = width
    ? ({ '--field-width': `${width}%` } as React.CSSProperties)
    : {
        flex: '1 1 auto',
      }

  return (
    <div className={`field-type checkbox ${errorState.showError ? 'error' : ''}`} style={styles}>
      <label className="field-label" htmlFor={id}>
        {label}
        {requiredFromProps && <span className="required">*</span>}
      </label>
      <div className="field-type__wrap">
        <FieldError message={errorState.message} showError={errorState.showError} />
        <input
          aria-invalid={errorState.showError}
          aria-label={label}
          checked={jsonFieldValue?.find((value) => value.id === id)?.value}
          id={id}
          name={id}
          onChange={onInputChange}
          required={requiredFromProps}
          type="checkbox"
        />
      </div>
    </div>
  )
}
