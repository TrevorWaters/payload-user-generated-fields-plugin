'use client'

import { FieldError } from '@payloadcms/ui'
import React from 'react'

import type { TextAreaField as TextAreaFieldType } from '../../exports/types.js'

import { useFieldState } from './hooks/useFieldState.js'

export const Textarea: React.FC<
  {
    groupName: string
    path: string
  } & TextAreaFieldType
> = ({ id, groupName, label, path, placeholder, required: requiredFromProps, width }) => {
  const { errorState, handleInputChange, jsonFieldValue } = useFieldState({ id, groupName, path })

  const onInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>): void => {
    handleInputChange(e.target.value)
  }

  const styles = width
    ? ({ '--field-width': `${width}%` } as React.CSSProperties)
    : {
        flex: '1 1 auto',
      }

  return (
    <div className={`field-type textarea ${errorState.showError ? 'error' : ''}`} style={styles}>
      <label className="field-label" htmlFor={id}>
        {label}
        {requiredFromProps && <span className="required">*</span>}
      </label>
      <div className="field-type__wrap">
        <FieldError message={errorState.message} showError={errorState.showError} />
        <textarea
          aria-invalid={true}
          aria-label={label}
          id={id}
          onChange={onInputChange}
          placeholder={placeholder}
          required={requiredFromProps}
          value={jsonFieldValue?.find((value) => value.id === id)?.value}
        />
      </div>
    </div>
  )
}
