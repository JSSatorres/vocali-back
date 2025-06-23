import { Transcription } from './Transcription'

export interface TranscriptionRepository {
  save: (transcription: Transcription) => Promise<void>
  search: (id: string) => Promise<Transcription | null>
  searchAll: () => Promise<Transcription[]>
  searchByStatus: (status: string) => Promise<Transcription[]>
  update: (transcription: Transcription) => Promise<void>
  delete: (id: string) => Promise<void>
}
