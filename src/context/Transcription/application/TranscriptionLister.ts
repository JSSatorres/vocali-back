import { injectable, inject } from 'tsyringe'
import { Transcription } from '../domain/Transcription'
import { TranscriptionRepository } from '../domain/TranscriptionRepository'

@injectable()
export class TranscriptionLister {
  constructor (@inject('TranscriptionRepository') private readonly repository: TranscriptionRepository) {}

  async run (): Promise<Transcription[]> {
    console.log('TranscriptionLister.run')

    return await this.repository.searchAll()
  }

  async runByStatus (status: string): Promise<Transcription[]> {
    console.log('TranscriptionLister.runByStatus', status)

    return await this.repository.searchByStatus(status)
  }
}
