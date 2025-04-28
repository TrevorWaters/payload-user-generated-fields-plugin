import { Checkbox } from './checkbox.js'
import { DateField } from './date.js'
import { Number } from './number.js'
import { Radio } from './radio/index.js'
import { RowField } from './row.js'
import { SelectField } from './select.js'
import { Text } from './text.js'
import { Textarea } from './textarea.js'

export const uiFields = {
  checkbox: Checkbox,
  //country: CountryField,
  date: DateField,
  //   email: EmailField,
  // message: MessageField,
  number: Number,
  radio: Radio,
  select: SelectField,
  // state: StateField,
  row: RowField,
  text: Text,
  textarea: Textarea,
}
