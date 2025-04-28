import { Block } from 'payload'

const sortBlocksByKeys = (blocks: Block[]) => {
  return blocks?.map((block) =>
    Object.keys(block)
      .sort()
      .reduce(function (result: Record<string, any>, key: string) {
        result[key] = block[key as keyof Block]
        return result
      }, {}),
  )
}

export const blocksAreEqual = (blocks1: Block[], blocks2: Block[]): boolean => {
  return JSON.stringify(sortBlocksByKeys(blocks1)) == JSON.stringify(sortBlocksByKeys(blocks2))
}
