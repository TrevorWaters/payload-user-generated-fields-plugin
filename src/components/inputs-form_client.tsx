'use client'

import { useField } from '@payloadcms/ui'
import React, { useCallback, useEffect, useState } from 'react'
import useSWR from 'swr'

import type { FormFieldBlock } from '../types.js'

import { RowField } from './fields/row.js'
import { uiFields } from './fields/uiFields.js'

const fetcher = (url: string) => fetch(url, { credentials: 'include' }).then((res) => res.json())

export const InputsFormClient: React.FC<{
  configCollectionConfigFieldName: string
  configCollectionSlug: string
  groupName: string
  path: string
  relationshipFieldName: string
}> = ({
  configCollectionConfigFieldName,
  configCollectionSlug,
  groupName,
  path,
  relationshipFieldName,
}) => {
  const { value: configCollectionId } = useField<number>({
    path: relationshipFieldName,
  })

  const { value: configStorage, setValue: setConfigStorage } = useField<{
    configuration: FormFieldBlock[]
  }>({
    path: `${groupName}.configStorage`,
  })
  const [currentRelationshipId, setCurrentRelationshipId] = useState(configCollectionId)

  const { data: configCollectionRecord } = useSWR(
    () =>
      Number.isInteger(configCollectionId) && currentRelationshipId !== configCollectionId
        ? `/api/${configCollectionSlug}/${configCollectionId}`
        : null,
    fetcher,
  )

  useEffect(() => {
    if (configCollectionRecord) {
      setConfigStorage(configCollectionRecord[configCollectionConfigFieldName])
      setCurrentRelationshipId(configCollectionId)
    }
  }, [
    configCollectionRecord,
    configCollectionConfigFieldName,
    setConfigStorage,
    setCurrentRelationshipId,
  ])

  const renderField = useCallback(
    (field: FormFieldBlock, index: number) => {
      const Field = uiFields[field.blockType as keyof typeof uiFields] as React.FC<
        { groupName: string; path: string } & FormFieldBlock
      >
      if (!Field) {
        return null
      }

      if (field.blockType === 'row') {
        return (
          <RowField key={index + field.id}>
            {field.fields.map((nestedField, nestedIndex) => renderField(nestedField, nestedIndex))}
          </RowField>
        )
      }

      return (
        <React.Fragment key={index + field.id}>
          <Field {...field} groupName={groupName} path={path} />
        </React.Fragment>
      )
    },
    [path, groupName],
  )

  return (
    configStorage &&
    configStorage?.configuration?.length > 0 && (
      <div
        aria-live="polite"
        aria-relevant="additions removals"
        className="render-fields"
        role="region"
      >
        {configStorage.configuration.map(renderField)}
      </div>
    )
  )
}
