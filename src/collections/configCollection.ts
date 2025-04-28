import type { Block, Field, FieldHook } from 'payload'

import { deepMergeWithSourceArrays } from 'payload'

import type { UserGeneratedFieldsCollectionConfig } from '../types.js'

import { fieldBlocks } from './fieldBlocks.js'

export const setupConfigCollectionFields = (
  debugMode: boolean,
  pluginCollectionConfig: UserGeneratedFieldsCollectionConfig,
  configCollectionFields: Field[],
  configFieldName: string,
  configOptionsFieldName: string,
): Field[] => {
  const getOptionsFromConfig: FieldHook = ({ siblingData }) => {
    return siblingData[configFieldName]?.configuration
  }

  const configField: Field = {
    ...(pluginCollectionConfig.configCollection.configFieldOverrides ?? {}),
    name: configFieldName,
    type: 'json',
    admin: {
      disableBulkEdit: true,
      disableListColumn: true,
      disableListFilter: true,
      hidden: !debugMode,
      ...(pluginCollectionConfig.configCollection.configFieldOverrides?.admin ?? {}),
    },
    hooks: {
      beforeChange: [
        ...(pluginCollectionConfig.configCollection.configFieldOverrides?.hooks?.beforeChange ??
          []),
        ({ data }) => {
          return {
            configuration: data?.[configOptionsFieldName],
          }
        },
      ],
    },
  }
  const optionsField: Field = {
    ...(pluginCollectionConfig.configCollection.optionsFieldOverrides ?? {}),
    name: configOptionsFieldName,
    type: 'blocks',
    admin: {
      disableBulkEdit: true,
      disableListColumn: true,
      disableListFilter: true,
      ...(pluginCollectionConfig.configCollection.optionsFieldOverrides?.admin ?? {}),
    },
    blocks: Object.entries(pluginCollectionConfig.allowedFields || {})
      .map(([fieldKey, fieldConfig]) => {
        // let the config enable/disable fields with either boolean values or objects
        if (fieldConfig !== false) {
          const block = fieldBlocks[fieldKey]

          if (block === undefined && typeof fieldConfig === 'object') {
            return fieldConfig
          }

          if (typeof block === 'object' && typeof fieldConfig === 'object') {
            return deepMergeWithSourceArrays(block, fieldConfig)
          }

          if (typeof block === 'function') {
            return block(fieldConfig)
          }

          return block
        }

        return null
      })
      .filter(Boolean) as Block[],
    hooks: {
      afterRead: [
        ...(pluginCollectionConfig.configCollection.optionsFieldOverrides?.hooks?.afterRead ?? []),
        getOptionsFromConfig,
      ],
      ...(pluginCollectionConfig.configCollection.optionsFieldOverrides?.hooks ?? {}),
    },
    virtual: true,
  }

  configCollectionFields.push(configField)
  configCollectionFields.splice(
    pluginCollectionConfig.configCollection.optionsFieldPositionInFieldsArray ??
      configCollectionFields.length,
    0,
    optionsField,
  )

  return configCollectionFields
}
