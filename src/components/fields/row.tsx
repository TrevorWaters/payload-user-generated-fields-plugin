import type { PropsWithChildren } from 'react'

import React from 'react'

export const RowField: React.FC<PropsWithChildren> = (props) => {
  return (
    <div className="field-type row">
      <div className="render-fields row__fields render-fields--margins-none">{props.children}</div>
    </div>
  )
}
