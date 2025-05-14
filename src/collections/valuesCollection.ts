import {
  type Field,
  type GroupField,
  type SingleRelationshipField,
  type ValidateOptions,
  ValidationError,
} from 'payload'

import type {
  FormFieldBlock,
  UserGeneratedFieldsCollectionConfig,
  UserGeneratedValuesJSON,
} from '../types.js'

const validateFieldConfig = (
  config: FormFieldBlock,
  values: { id: string; value: any }[],
  requiredFields: string[],
) => {
  if (config.blockType === 'row') {
    // For row fields, recursively validate each nested field
    config.fields.forEach((nestedField) => {
      validateFieldConfig(nestedField, values, requiredFields)
    })
  } else if (config.required) {
    // For regular fields, check if required value is present
    const hasValue = values?.find((value) => value.id === config.id)?.value
    if (!hasValue) {
      requiredFields.push(`${config.id}:This field is required.`)
    }
  }
}

const hasRequiredFields = (configs: FormFieldBlock[]): boolean => {
  return configs.some((config) => {
    if (config.blockType === 'row') {
      return hasRequiredFields(config.fields)
    }
    return config.required
  })
}

const getFieldIds = (configs: FormFieldBlock[]): string[] => {
  return configs.flatMap((config) => {
    if (config.blockType === 'row') {
      return getFieldIds(config.fields)
    }
    return config.id
  })
}

const getRelationshipValue = (obj: any, relationshipFieldName: string) => {
  if (relationshipFieldName.includes('.')) {
    const relationshipPath = relationshipFieldName.split('.')
    return relationshipPath.reduce((acc, prop) => acc[prop as keyof typeof acc], obj)
  }
  return obj[relationshipFieldName]
}

export const setupValuesCollectionFields = (
  debugMode: boolean,
  pluginCollectionConfig: UserGeneratedFieldsCollectionConfig,
  valuesCollectionFields: Field[],
  configCollectionConfigFieldName: string,
): Field[] => {
  const formattedGroupName = pluginCollectionConfig.valuesCollection.groupName
    .trim()
    .replace(/\s+/g, '-')
    .toLowerCase()

  const relationshipFieldName =
    pluginCollectionConfig.valuesCollection.relationshipFieldName ??
    pluginCollectionConfig.configCollection.slug

  const valuesFieldName =
    pluginCollectionConfig.valuesCollection.valuesFieldName ?? 'customFieldsValuesJSON'

  const configStorageField: Field = {
    name: `configStorage`,
    type: 'json',
    admin: {
      disableBulkEdit: true,
      disableListColumn: true,
      disableListFilter: true,
      hidden: !debugMode,
    },
    hooks: {
      beforeChange: [
        ({ context, value }) => {
          return {
            ...value,
            ...(context[`configStorage`] as { configuration: FormFieldBlock[] }),
          }
        },
      ],
    },
  }

  const groupField: GroupField = {
    name: formattedGroupName,
    type: 'group',
    fields: [
      configStorageField,
      {
        name: valuesFieldName,
        type: 'json',
        admin: {
          disableBulkEdit: true,
          disableListColumn: true,
          disableListFilter: true,
          ...(pluginCollectionConfig.valuesCollection.fieldOverrides?.admin ?? {}),
          components: {
            ...(pluginCollectionConfig.valuesCollection.fieldOverrides?.admin?.components ?? {}),
            Field: {
              path: 'payload-user-generated-fields-plugin/rsc#UserGeneratedFieldsValuesServer',
              serverProps: {
                configCollectionConfigFieldName,
                configCollectionSlug: pluginCollectionConfig.configCollection.slug,
                debug: debugMode,
                // Need groupName to be passed down to capture server-side error messages that is returned on the group field
                // (validating on this JSON field leads to an ugly message on validation errors about userGenereatedFieldsValuesJSON whenever any user-generated field is invalid, which is weird because the field is hidden)
                groupName: formattedGroupName,
                relationshipFieldName,
              },
            },
          },
        },
        hooks: {
          ...(pluginCollectionConfig.valuesCollection.fieldOverrides?.hooks ?? {}),
          beforeValidate: [
            ...(pluginCollectionConfig.valuesCollection.fieldOverrides?.hooks?.beforeValidate ??
              []),
            async ({ data, operation, originalDoc, req, value }) => {
              const relationshipId = getRelationshipValue(data, relationshipFieldName)

              //Skip this whole thing if the relationship is not set
              if (!data || !Number.isInteger(relationshipId) || !value) {
                return value
              }

              let configs:
                | {
                    configuration: FormFieldBlock[]
                  }
                | undefined

              const relationShipIsTheSame =
                relationshipId === getRelationshipValue(originalDoc, relationshipFieldName)

              //Fetch the config if the relationship has changed or it is not present
              if (operation === 'create' || !relationShipIsTheSame) {
                configs = await req.payload
                  .findByID({
                    id: relationshipId,
                    collection: pluginCollectionConfig.configCollection.slug,
                    req,
                    select: {
                      [configCollectionConfigFieldName]: true,
                    },
                  })
                  .then(
                    (res) =>
                      res[configCollectionConfigFieldName] as {
                        configuration: FormFieldBlock[]
                      },
                  )
              }

              //If the config is the same as the original we can save ourselves a call
              if (relationShipIsTheSame) {
                configs = originalDoc?.[`${formattedGroupName}`]['configStorage']
              }

              //This should almost never happen (if someone deleted the Config record at the right time, someone messed with the relationshipId on the client-side)
              if (!configs) {
                req.payload.logger.error(
                  'Payload-User-Generated-Fields-Plugin: No configs found during Values collection beforeValidate.',
                )
                throw new ValidationError({
                  collection: pluginCollectionConfig.valuesCollection.slug,
                  errors: [
                    {
                      message: 'Problem saving fields. Please refresh the page and try again.',
                      path: formattedGroupName,
                    },
                  ],
                })
              }

              //Store config in context for the upcoming hooks
              req.context[`configStorage`] = configs

              //Remove any values that are not in the config (because the config changed or client-side did something weird)
              const validFieldIds = getFieldIds(configs.configuration)
              const updatedValues = (value as unknown as UserGeneratedValuesJSON).filter((value) =>
                validFieldIds.includes(value.id),
              )
              return updatedValues
            },
          ],
        },
      },
    ],
    label: pluginCollectionConfig.valuesCollection.groupName,
    validate: (_, { req, siblingData }: ValidateOptions<any, any, any, any>) => {
      const valuesJSON = siblingData?.[formattedGroupName]?.userGeneratedFieldsValuesJSON

      const configs: { configuration: FormFieldBlock[] } | undefined = req.context?.configStorage

      if (!configs) {
        req.payload.logger.error(
          'Payload-User-Generated-Fields-Plugin: No configs found during Values collection validation.',
        )
        return 'Problem saving fields. Please refresh the page and try again.'
      }

      if (!valuesJSON) {
        if (hasRequiredFields(configs.configuration)) {
          return `Unknown error. Please confirm fields are filled and try again.`
        }
        return true
      }

      const requiredFields: string[] = []
      configs.configuration.forEach((config) => {
        validateFieldConfig(
          config,
          valuesJSON as unknown as { id: string; value: any }[],
          requiredFields,
        )
      })

      if (requiredFields.length > 0) {
        return requiredFields.join(';;')
      }

      return true
    },
  }

  const relationshipField: SingleRelationshipField = {
    name:
      pluginCollectionConfig.valuesCollection.relationshipFieldName ??
      pluginCollectionConfig.configCollection.slug,
    type: 'relationship',
    hasMany: false,
    maxDepth: 2,
    relationTo: pluginCollectionConfig.configCollection.slug,
    ...(pluginCollectionConfig.valuesCollection.relationshipFieldOverrides ?? {}),
  } as SingleRelationshipField

  if (pluginCollectionConfig.valuesCollection.useDefaultRelationshipField !== false) {
    valuesCollectionFields.push(relationshipField)
  }

  valuesCollectionFields.splice(
    pluginCollectionConfig.valuesCollection.groupPositionInFieldsArray ??
      valuesCollectionFields.length,
    0,
    groupField,
  )

  return valuesCollectionFields
}
