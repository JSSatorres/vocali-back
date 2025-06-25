import { Transcription } from './Transcription'
import { TranscriptionId } from './TranscriptionId'

export interface TranscriptionRepository {
  save: (transcription: Transcription) => Promise<void>
  search: (id: string) => Promise<Transcription | null>
  findById: (id: TranscriptionId) => Promise<Transcription | null>
  searchAll: () => Promise<Transcription[]>
  delete: (id: string) => Promise<void>
}
