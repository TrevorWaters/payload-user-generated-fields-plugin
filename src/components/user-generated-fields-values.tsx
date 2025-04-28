import type { CustomComponent, JSONFieldServerProps, PayloadServerReactComponent } from 'payload'

import { JSONField } from '@payloadcms/ui'

import { InputsFormClient } from './inputs-form_client.js'

type UserGeneratedFieldsValuesServerProps = {
  configCollectionConfigFieldName: string
  configCollectionSlug: string
  debug: boolean
  groupName: string
  relationshipFieldName: string
} & JSONFieldServerProps

export const UserGeneratedFieldsValuesServer: PayloadServerReactComponent<
  CustomComponent<UserGeneratedFieldsValuesServerProps>
> = ({
  clientField,
  configCollectionConfigFieldName,
  configCollectionSlug,
  debug,
  groupName,
  path,
  permissions,
  relationshipFieldName,
  schemaPath,
}) => {
  return (
    <>
      {debug && (
        <JSONField
          field={clientField}
          path={path}
          permissions={permissions}
          schemaPath={schemaPath}
        />
      )}
      <InputsFormClient
        configCollectionConfigFieldName={configCollectionConfigFieldName}
        configCollectionSlug={configCollectionSlug}
        groupName={groupName}
        path={path}
        relationshipFieldName={relationshipFieldName}
      />
    </>
  )
}
