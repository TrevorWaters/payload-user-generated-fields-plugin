import type { Config } from 'payload'

import type {
  UserGeneratedFieldsCollectionConfig,
  UserGeneratedFieldsPluginConfig,
} from './types.js'

import { setupConfigCollectionFields } from './collections/configCollection.js'
import { setupValuesCollectionFields } from './collections/valuesCollection.js'

/**
 * Devs declare which fields users can use to generate form fields for each collection, from the plugin config
 *
 * Creates a collection for each user generated fields collection passed in the plugin config, with a JSON field type.
 *
 * This JSON field will basically be the config for the user generated fields. This way we can support tenants, where each tenant can have different user generated fields for the same collection
 *
 * The Values collection will have a relationship field to the generated fields config collection.
 *
 * The Values collection UI will render the user generated fields based on the config in the config collection,
 *
 * JSON to Inputs and vice versa. data is saved as a hidden field
 */
export const pluginUserGeneratedFields =
  (pluginConfig: UserGeneratedFieldsPluginConfig) =>
  (config: Config): Config => {
    if (!config.collections) {
      config.collections = []
    }

    if (!pluginConfig.collections) {
      console.error('No collections found in User Generated Fields plugin config')
      return config
    }

    if (!config.admin) {
      config.admin = {}
    }

    if (!config.admin.components) {
      config.admin.components = {}
    }

    const debugMode = pluginConfig.debug ?? false

    for (const incomingCollectionConfig of pluginConfig.collections) {
      const collectionConfig: UserGeneratedFieldsCollectionConfig = {
        ...incomingCollectionConfig,
        allowedFields: {
          checkbox: true,
          //country: true,
          date: true,
          //email: true,
          //message: true,
          number: true,
          radio: true,
          select: true,
          //state: true,
          row: true,
          text: true,

          textarea: true,
          ...incomingCollectionConfig.allowedFields,
        },
      }

      if (
        collectionConfig.valuesCollection.useDefaultRelationshipField === true &&
        collectionConfig.valuesCollection.relationshipFieldName?.includes('.')
      ) {
        throw new Error(
          'useDefaultRelationshipField is true but relationshipFieldName is set to a nested relationship field. This is not supported.',
        )
      }

      //grab the actual collections so we can do stuff with them
      const configCollection = config.collections.find(
        (collection) => collection.slug === collectionConfig.configCollection.slug,
      )
      const valuesCollection = config.collections.find(
        (collection) => collection.slug === collectionConfig.valuesCollection.slug,
      )

      if (!valuesCollection) {
        console.error('valuesCollection not found in User Generated Fields plugin')
        return config
      }

      if (!configCollection) {
        console.error('configCollection not found in User Generated Fields plugin')
        return config
      }

      const configCollectionConfigFieldName =
        collectionConfig.configCollection.configFieldName ?? 'customFieldsConfig'

      const configCollectionOptionsFieldName =
        collectionConfig.configCollection.optionsFieldName ?? 'customFieldsOptions'

      configCollection.hooks = {
        ...(configCollection.hooks ?? {}),
        beforeChange: [
          ...(configCollection.hooks?.beforeChange ?? []),
          ({ data }) => {
            data[configCollectionConfigFieldName] = data[configCollectionOptionsFieldName]
            return data
          },
        ],
      }

      configCollection.fields = setupConfigCollectionFields(
        debugMode,
        collectionConfig,
        configCollection.fields,
        configCollectionConfigFieldName,
        configCollectionOptionsFieldName,
      )

      valuesCollection.fields = setupValuesCollectionFields(
        debugMode,
        collectionConfig,
        valuesCollection.fields,
        configCollectionConfigFieldName,
      )
    }

    return config
  }
