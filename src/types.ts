import type { Block, BlocksField, Field, JSONField, SingleRelationshipField } from 'payload'

export interface BlockConfig {
  block: Block
  validate?: (value: unknown) => boolean | string
}

export function isValidBlockConfig(blockConfig: BlockConfig | string): blockConfig is BlockConfig {
  return (
    typeof blockConfig !== 'string' &&
    typeof blockConfig?.block?.slug === 'string' &&
    Array.isArray(blockConfig?.block?.fields)
  )
}

export interface FieldValues {
  [key: string]: boolean | null | number | string | undefined
}

export type FieldConfig = Partial<Field>

export interface FieldsConfig {
  [key: string]: boolean | FieldConfig | undefined
  checkbox?: boolean | FieldConfig
  date?: boolean | FieldConfig
  //country?: boolean | FieldConfig
  //email?: boolean | FieldConfig
  //message?: boolean | FieldConfig
  number?: boolean | FieldConfig
  radio?: boolean | FieldConfig
  row?: boolean | FieldConfig
  select?: boolean | FieldConfig
  //state?: boolean | FieldConfig
  text?: boolean | FieldConfig
  textarea?: boolean | FieldConfig
}

export interface TextField {
  blockName?: string
  blockType: 'text'
  defaultValue?: string
  id: string
  label?: string
  name: string
  placeholder?: string
  required?: boolean
  width?: number
}

export interface TextAreaField {
  blockName?: string
  blockType: 'textarea'
  defaultValue?: string
  id: string
  label?: string
  name: string
  placeholder?: string
  required?: boolean
  width?: number
}

export interface SelectFieldOption {
  label: string
  value: string
}

export interface SelectField {
  blockName?: string
  blockType: 'select'
  defaultValue?: string
  id: string
  label?: string
  name: string
  options: SelectFieldOption[]
  placeholder?: string
  required?: boolean
  width?: number
}

export interface RadioField {
  blockName?: string
  blockType: 'radio'
  defaultValue?: string
  id: string
  label?: string
  name: string
  options: SelectFieldOption[]
  placeholder?: string
  required?: boolean
  width?: number
}

export interface EmailField {
  blockName?: string
  blockType: 'email'
  defaultValue?: string
  id: string
  label?: string
  name: string
  placeholder?: string
  required?: boolean
  width?: number
}

export interface StateField {
  blockName?: string
  blockType: 'state'
  defaultValue?: string
  id: string
  label?: string
  name: string
  placeholder?: string
  required?: boolean
  width?: number
}

export interface CountryField {
  blockName?: string
  blockType: 'country'
  defaultValue?: string
  id: string
  label?: string
  name: string
  placeholder?: string
  required?: boolean
  width?: number
}

export interface CheckboxField {
  blockName?: string
  blockType: 'checkbox'
  defaultValue?: boolean
  id: string
  label?: string
  name: string
  placeholder?: string
  required?: boolean
  width?: number
}

export interface MessageField {
  blockName?: string
  blockType: 'message'
  message: object
}

export interface DateField {
  blockName?: string
  blockType: 'date'
  defaultValue?: string
  id: string
  label?: string
  name: string
  pickerAppearance?: 'dayAndTime' | 'dayOnly' | 'default' | 'monthOnly' | 'timeOnly'
  placeholder?: string
  required?: boolean
  width?: number
}

export interface RowField {
  blockName?: string
  blockType: 'row'
  fields: FormFieldBlock[]
  id: string
}

export type FormFieldBlock =
  | CheckboxField
  | CountryField
  | DateField
  | EmailField
  | RadioField
  | RowField
  | SelectField
  | StateField
  | TextAreaField
  | TextField

export type FieldBlockConfig = {
  [key: string]: ((fieldConfig?: boolean | FieldConfig) => Block) | Block
}

export type UserGeneratedValuesJSON = Array<{
  id: string
  value: any
}>

export type UserGeneratedFieldsPluginConfig = {
  /**
   * List of collection pairs
   */
  collections?: UserGeneratedFieldsCollectionConfig[]
  /**
   * Shows the hidden JSON fields storing the config and values for the user generated fields
   *
   * @default false
   */
  debug?: boolean
}

export type UserGeneratedFieldsCollectionConfig = {
  /**
   * Fields that are allowed to be used by users to generate fields
   *
   * Defaults to all included fields
   */
  allowedFields?: FieldsConfig
  /**
   * Collection the user will select the fields and save the config from
   */
  configCollection: {
    /**
     * The `name` of the hidden JSON field that will save the user generated fields config
     *
     * Must be alphanumeric and cannot contain ' . '
     *
     * Must not be one of reserved field names: ['__v', 'salt', 'hash', 'file']
     * @link — https://payloadcms.com/docs/fields/overview#field-names
     *
     * @default "customFieldsConfig"
     */
    configFieldName?: string
    /**
     * Override the config field that saves the user generated fields config
     */
    configFieldOverrides?: Partial<JSONField>
    /**
     * The `name` of the field that will save the user generated fields options
     *
     *  Must be alphanumeric and cannot contain ' . '
     *
     * Must not be one of reserved field names: ['__v', 'salt', 'hash', 'file']
     * @link — https://payloadcms.com/docs/fields/overview#field-names
     *
     * @default "customFieldsOptions"
     */
    optionsFieldName?: string
    /**
     * Override the options field that contains the blocks for the user generated fields
     */
    optionsFieldOverrides?: Partial<BlocksField>
    /**
     * The position of the options field in the fields array. (0-indexed)
     *
     * if not provided, the options field will be added to the end of the fields array
     */
    optionsFieldPositionInFieldsArray?: number
    /**
     * Slug of the collection that you want to use to generate the config
     */
    slug: string
  }
  /**
   * Collection that will present the user generated input fields from the config, and where the answer values are saved in a hidden JSON field.
   */
  valuesCollection: (CustomRelationshipFieldConfig | DefaultRelationshipFieldConfig) &
    UserGeneratedFieldsValuesCollectionConfig
}

export type UserGeneratedFieldsValuesCollectionConfig = {
  /**
   * Override the JSON field that saves the user generated fields values
   */
  fieldOverrides?: Partial<JSONField>
  /**
   * The group heading that the user generated fields will be grouped under in the admin UI
   *
   * Validations are applied on this group
   *
   * Must be alphanumeric and cannot contain ' . '
   *
   * Must not be one of reserved field names: ['__v', 'salt', 'hash', 'file']
   * @link — https://payloadcms.com/docs/fields/overview#field-names
   */
  groupName: string
  /**
   * The position of the group in the fields array. (0-indexed)
   *
   * if not provided, the group will be added to the end of the fields array
   */
  groupPositionInFieldsArray?: number
  /**
   * The name of the relationship field that is related to the config collection
   *
   * Must be alphanumeric and cannot contain ' . '
   *
   * Must not be one of reserved field names: ['__v', 'salt', 'hash', 'file']
   * @link — https://payloadcms.com/docs/fields/overview#field-names
   *
   * @required when `useDefaultRelationshipField` is `false`, in order to identify the field.
   *
   * Accepts nested relationship fields. Use `.` to separate each level of the schema path to the relationship field.
   *
   * @example
   *
   * ```
   * relationshipFieldName: "tabName.blockName.relationshipFieldName"
   * ```
   *
   */
  relationshipFieldName?: string
  /**
   * Override the relationship field options
   */
  relationshipFieldOverrides?: Partial<
    Omit<SingleRelationshipField, 'hasMany' | 'name' | 'relationTo' | 'type'>
  >
  /**
   * Slug of the collection that you want to use the user generated fields values on
   */
  slug: string
  /**
   * Use the default relationship field
   *
   * @default true
   */
  useDefaultRelationshipField?: boolean
  /**
   * The name of the field that will save the user generated fields values
   *
   * Must be alphanumeric and cannot contain ' . '
   *
   * Must not be one of reserved field names: ['__v', 'salt', 'hash', 'file']
   * @link — https://payloadcms.com/docs/fields/overview#field-names
   *
   * @default "customFieldsValuesJSON"
   */
  valuesFieldName?: string
}

export type DefaultRelationshipFieldConfig = {
  relationshipFieldName?: string
  useDefaultRelationshipField: true
}

export type CustomRelationshipFieldConfig = {
  relationshipFieldName: string
  relationshipFieldOverrides?: undefined
  useDefaultRelationshipField: false
}
