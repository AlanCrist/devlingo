import type {
  CorrectionProviderResult,
  SentenceCorrectionProvider,
} from '../domain/notebook-types'

interface LanguageToolMatch {
  offset?: number
  length?: number
  message?: string
  replacements?: Array<{ value?: string }>
}

const unavailable = (sentence: string): CorrectionProviderResult => ({
  result: {
    originalText: sentence,
    matches: [],
    status: 'unavailable',
  },
  status: 'unavailable',
})

export class LanguageToolCorrectionProvider implements SentenceCorrectionProvider {
  private readonly endpoint: string

  constructor(endpoint = 'https://api.languagetool.org/v2/check') {
    this.endpoint = endpoint
  }

  async check(
    sentence: string,
    language: string,
  ): Promise<CorrectionProviderResult> {
    try {
      const body = new URLSearchParams({ text: sentence, language })
      const response = await fetch(this.endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body,
      })
      if (!response.ok) return unavailable(sentence)
      const payload: unknown = await response.json()
      if (!payload || typeof payload !== 'object' || !('matches' in payload)) {
        return unavailable(sentence)
      }
      const matches = Array.isArray(payload.matches)
        ? payload.matches.filter((match): match is LanguageToolMatch =>
            Boolean(match && typeof match === 'object'),
          )
        : []
      const normalized = matches
        .filter(
          (match) =>
            Number.isInteger(match.offset) &&
            Number.isInteger(match.length) &&
            typeof match.message === 'string',
        )
        .map((match) => ({
          offset: match.offset as number,
          length: match.length as number,
          message: match.message as string,
          replacements: (match.replacements ?? [])
            .map((replacement) => replacement.value)
            .filter((value): value is string => Boolean(value)),
        }))
      const correctedText = normalized.reduceRight(
        (text, match) =>
          match.replacements[0]
            ? `${text.slice(0, match.offset)}${match.replacements[0]}${text.slice(
                match.offset + match.length,
              )}`
            : text,
        sentence,
      )
      return {
        result: {
          originalText: sentence,
          ...(normalized.length ? { correctedText } : {}),
          matches: normalized,
          status: normalized.length ? 'has-suggestions' : 'correct',
        },
        status: 'complete',
      }
    } catch {
      return unavailable(sentence)
    }
  }
}
