import { injectable, inject } from 'tsyringe'
import { Transcription } from '../domain/Transcription'
import { TranscriptionRepository } from '../domain/TranscriptionRepository'

@injectable()
export class TranscriptionLister {
  constructor (@inject('TranscriptionRepository') private readonly repository: TranscriptionRepository) {}

  async run (trasncriptionUserId: string): Promise<Transcription[]> {
    return await this.repository.searchAll(trasncriptionUserId)
  }
}
