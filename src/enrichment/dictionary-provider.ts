import type {
  EnrichmentResult,
  Meaning,
  VocabularyEnrichmentProvider,
} from '../domain/notebook-types'

interface DictionaryEntry {
  phonetic?: string
  phonetics?: Array<{ text?: string; audio?: string }>
  meanings?: Array<{
    partOfSpeech?: string
    definitions?: Array<{ definition?: string; example?: string }>
  }>
}

const isEntry = (value: unknown): value is DictionaryEntry =>
  typeof value === 'object' && value !== null

const createMeaning = (
  entry: DictionaryEntry,
  meaningIndex: number,
  definitionIndex: number,
  definition: { definition?: string; example?: string },
): Meaning | null => {
  if (!definition.definition?.trim()) return null
  return {
    id: `meaning-${meaningIndex}-${definitionIndex}`,
    partOfSpeech: entry.meanings?.[meaningIndex]?.partOfSpeech,
    definitionEn: definition.definition.trim(),
    ...(definition.example ? { exampleEn: definition.example.trim() } : {}),
  }
}

export class DictionaryApiProvider implements VocabularyEnrichmentProvider {
  private readonly endpoint: string

  constructor(endpoint = 'https://api.dictionaryapi.dev/api/v2/entries/en') {
    this.endpoint = endpoint
  }

  async lookup(term: string): Promise<EnrichmentResult> {
    try {
      const response = await fetch(
        `${this.endpoint}/${encodeURIComponent(term)}`,
      )
      if (!response.ok) return this.unavailable()
      const payload: unknown = await response.json()
      if (!Array.isArray(payload)) return this.unavailable()

      const entries = payload.filter(isEntry)
      const meanings = entries.flatMap((entry, entryIndex) =>
        (entry.meanings ?? []).flatMap((meaning, meaningIndex) =>
          (meaning.definitions ?? [])
            .map((definition, definitionIndex) =>
              createMeaning(
                entry,
                entryIndex + meaningIndex,
                definitionIndex,
                definition,
              ),
            )
            .filter((meaning): meaning is Meaning => meaning !== null),
        ),
      )
      const phonetic = entries
        .flatMap((entry) => entry.phonetics ?? [])
        .find((item) => item.text || item.audio)

      return {
        meanings,
        ...(phonetic && (phonetic.text || phonetic.audio)
          ? {
              pronunciation: {
                ...(phonetic.text ? { phoneticText: phonetic.text } : {}),
                ...(phonetic.audio ? { audioUrl: phonetic.audio } : {}),
              },
            }
          : {}),
        variations: [],
        recognitionExamples: meanings
          .map((meaning) => meaning.exampleEn)
          .filter((example): example is string => Boolean(example)),
        status: meanings.length > 0 ? 'complete' : 'partial',
      }
    } catch {
      return this.unavailable()
    }
  }

  private unavailable(): EnrichmentResult {
    return {
      meanings: [],
      variations: [],
      recognitionExamples: [],
      status: 'unavailable',
    }
  }
}
