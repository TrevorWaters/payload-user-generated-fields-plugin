import type { Block, Field } from 'payload'

import type { FieldBlockConfig } from '../types.js'

const label: Field = {
  name: 'label',
  type: 'text',
  label: 'Label',
  localized: true,
  required: true,
}

const required: Field = {
  name: 'required',
  type: 'checkbox',
  label: 'Required',
}

const placeholder: Field = {
  name: 'placeholder',
  type: 'text',
  admin: {
    width: '50%',
  },
  label: 'Placeholder',
}

const width: Field = {
  name: 'width',
  type: 'number',
  admin: {
    condition: (_, __, blockData) => {
      //this indicates a row
      return blockData?.path?.includes('fields')
    },
    description:
      'How wide this field should be on the form page, in percent. 100 is a full row, 50 is half width, etc.',
    width: '50%',
  },
  label: 'Input Width',
  max: 100,
  min: 1,
}

const Radio: Block = {
  slug: 'radio',
  admin: {
    group: 'Fields',
  },
  fields: [
    {
      type: 'row',
      fields: [
        label,
        {
          name: 'defaultValue',
          type: 'text',
          label: 'Default Value',
          localized: true,
        },
      ],
    },
    required,
    {
      name: 'options',
      type: 'array',
      fields: [
        {
          type: 'row',
          fields: [
            {
              name: 'label',
              type: 'text',
              label: 'Label',
              localized: true,
              required: true,
            },
            {
              name: 'value',
              type: 'text',
              label: 'Value',
              required: true,
            },
          ],
        },
      ],
      label: 'Radio Attribute Options',
      labels: {
        plural: 'Options',
        singular: 'Option',
      },
    },
  ],
  labels: {
    plural: 'Radio Fields',
    singular: 'Radio',
  },
}

const Select: Block = {
  slug: 'select',
  admin: {
    group: 'Fields',
  },
  fields: [
    {
      type: 'row',
      fields: [
        label,
        {
          name: 'defaultValue',
          type: 'text',
          label: 'Default Value',
          localized: true,
        },
      ],
    },
    {
      type: 'row',
      fields: [placeholder, width],
    },
    required,
    {
      name: 'options',
      type: 'array',
      fields: [
        {
          type: 'row',
          fields: [
            label,
            {
              name: 'value',
              type: 'text',
              label: 'Value',
              required: true,
            },
          ],
        },
      ],
      label: 'Select Attribute Options',
      labels: {
        plural: 'Options',
        singular: 'Option',
      },
    },
  ],
  labels: {
    plural: 'Select Fields',
    singular: 'Select',
  },
}

const Text: Block = {
  slug: 'text',
  admin: {
    group: 'Fields',
  },
  fields: [
    {
      type: 'row',
      fields: [
        label,
        {
          name: 'defaultValue',
          type: 'text',
          label: 'Default Value',
          localized: true,
        },
      ],
    },
    required,
    {
      type: 'row',
      fields: [placeholder, width],
    },
  ],
  labels: {
    plural: 'Text Fields',
    singular: 'Text',
  },
}

const TextArea: Block = {
  slug: 'textarea',
  admin: {
    group: 'Fields',
  },
  fields: [
    {
      type: 'row',
      fields: [
        label,
        {
          name: 'defaultValue',
          type: 'text',
          label: 'Default Value',
          localized: true,
        },
      ],
    },
    required,
    {
      type: 'row',
      fields: [placeholder, width],
    },
  ],
  labels: {
    plural: 'Text Area Fields',
    singular: 'Text Area',
  },
}

const Number: Block = {
  slug: 'number',
  admin: {
    group: 'Fields',
  },
  fields: [
    {
      type: 'row',
      fields: [
        label,
        {
          name: 'defaultValue',
          type: 'number',
          label: 'Default Value',
        },
      ],
    },
    required,
    {
      type: 'row',
      fields: [placeholder, width],
    },
  ],
  labels: {
    plural: 'Number Fields',
    singular: 'Number',
  },
}

const Email: Block = {
  slug: 'email',
  admin: {
    group: 'Fields',
  },
  fields: [
    {
      type: 'row',
      fields: [
        label,
        {
          name: 'defaultValue',
          type: 'email',
          label: 'Default Value',
          localized: true,
        },
      ],
    },
    {
      type: 'row',
      fields: [placeholder, width, required],
    },
  ],
  labels: {
    plural: 'Email Fields',
    singular: 'Email',
  },
}

const State: Block = {
  slug: 'state',
  admin: {
    group: 'Fields',
  },
  fields: [
    {
      type: 'row',
      fields: [
        {
          ...label,
        },
        {
          ...placeholder,
        },
      ],
    },
    required,
  ],
  labels: {
    plural: 'State Fields',
    singular: 'State',
  },
}

const Country: Block = {
  slug: 'country',
  admin: {
    group: 'Fields',
  },
  fields: [
    {
      type: 'row',
      fields: [
        {
          ...label,
          admin: {
            width: '50%',
          },
        },
      ],
    },
    placeholder,
    required,
  ],
  labels: {
    plural: 'Country Fields',
    singular: 'Country',
  },
}

const Checkbox: Block = {
  slug: 'checkbox',
  admin: {
    group: 'Fields',
  },
  fields: [
    {
      type: 'row',
      fields: [
        label,
        {
          name: 'defaultValue',
          type: 'checkbox',
          label: 'Default Value',
        },
        width,
      ],
    },
  ],
  labels: {
    plural: 'Checkbox Fields',
    singular: 'Checkbox',
  },
}

const Message: Block = {
  slug: 'message',
  admin: {
    group: 'Layout',
  },
  fields: [
    {
      name: 'message',
      type: 'richText',
      localized: true,
    },
  ],
  labels: {
    plural: 'Message Blocks',
    singular: 'Message',
  },
}

const Date: Block = {
  slug: 'date',
  admin: {
    group: 'Fields',
  },
  fields: [
    {
      type: 'row',
      fields: [
        label,
        {
          name: 'defaultValue',
          type: 'date',
          label: 'Default Value',
        },
      ],
    },
    required,
    {
      type: 'row',
      fields: [
        placeholder,
        width,
        {
          name: 'pickerAppearance',
          type: 'select',
          admin: {
            description: 'Choose how the date picker should appear and behave',
          },
          defaultValue: 'default',
          label: 'Date Picker Type',
          options: [
            {
              label: 'Default (ex, April 14, 2025)',
              value: 'default',
            },
            {
              label: 'Day Only (ex, April 14)',
              value: 'dayOnly',
            },
            {
              label: 'Day and Time (ex, April 14, 10:00 AM)',
              value: 'dayAndTime',
            },
            {
              label: 'Month Only (ex, April)',
              value: 'monthOnly',
            },
            {
              label: 'Time Only (ex, 10:00 AM)',
              value: 'timeOnly',
            },
          ],
        },
      ],
    },
  ],
  labels: {
    plural: 'Date Fields',
    singular: 'Date',
  },
}

const Row: Block = {
  slug: 'row',
  admin: {
    group: 'Layout',
  },
  fields: [
    {
      name: 'fields',
      type: 'blocks',
      admin: {
        description: 'Each field will be displayed on the same horizontal row',
      },
      blocks: [Text, TextArea, Select, Radio, Email, State, Country, Checkbox, Date, Number],
      label: 'Fields',
      labels: {
        plural: 'Fields',
        singular: 'Field',
      },
    },
  ],
  labels: {
    plural: 'Row Fields',
    singular: 'Row',
  },
}

export const fieldBlocks = {
  checkbox: Checkbox,
  //country: Country,
  date: Date,
  //email: Email,
  //message: Message,
  number: Number,
  radio: Radio,
  row: Row,
  select: Select,
  //state: State,
  text: Text,
  textarea: TextArea,
} as FieldBlockConfig
