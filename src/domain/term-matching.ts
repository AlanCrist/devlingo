import { normalizeTerm } from './notebook-records'

const cleanForMatching = (value: string) =>
  normalizeTerm(value)
    .toLocaleLowerCase()
    .replace(/[^\p{L}\p{N}\s'-]/gu, ' ')
    .replace(/\s+/g, ' ')
    .trim()

export const sentenceContainsTerm = (
  sentence: string,
  term: string,
  variations: string[] = [],
): boolean => {
  const source = ` ${cleanForMatching(sentence)} `
  return [term, ...variations].some((candidate) => {
    const normalized = cleanForMatching(candidate)
    return Boolean(normalized) && source.includes(` ${normalized} `)
  })
}
