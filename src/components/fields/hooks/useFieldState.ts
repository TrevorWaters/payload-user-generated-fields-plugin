import { useField } from '@payloadcms/ui'
import { useEffect, useState } from 'react'

import type { UserGeneratedValuesJSON } from '../../../exports/types.js'

interface UseFieldStateProps {
  groupName: string
  id: string
  path: string
}

interface ErrorState {
  message: string
  showError: boolean
}

interface UseFieldStateReturn {
  errorState: ErrorState
  handleInputChange: (value: any) => void
  jsonFieldValue: undefined | UserGeneratedValuesJSON
  setErrorState: (state: ErrorState) => void
}

export const useFieldState = ({ id, groupName, path }: UseFieldStateProps): UseFieldStateReturn => {
  const {
    //errorMessage,
    setValue: setJsonFieldValue,
    //showError,
    value: jsonFieldValue,
  } = useField<UserGeneratedValuesJSON>({
    path,
  })

  const { errorMessage, showError } = useField({
    path: groupName,
  })

  const [errorState, setErrorState] = useState<ErrorState>({
    message: '',
    showError: false,
  })

  useEffect(() => {
    if (errorMessage && errorMessage.includes(id)) {
      const errorMessageArray = errorMessage.split(';;')
      const errorMessageObject = errorMessageArray.find((message) => message.includes(id))
      if (errorMessageObject && showError) {
        setErrorState({ message: errorMessageObject.split(':')[1], showError: true })
      }
    }
  }, [errorMessage, id, showError])

  const handleInputChange = (value: string): void => {
    setErrorState({ message: '', showError: false })

    const json = Array.isArray(jsonFieldValue) ? jsonFieldValue : []
    const existingValueIndex = json.findIndex((fieldValue) => fieldValue.id === id)

    if (existingValueIndex >= 0) {
      // Update existing value in the array
      json[existingValueIndex] = {
        ...json[existingValueIndex],
        value,
      }
    } else {
      // Add new value
      json.push({
        id,
        value,
      })
    }

    setJsonFieldValue(json)
  }

  return {
    errorState,
    handleInputChange,
    jsonFieldValue,
    setErrorState,
  }
}
