import { injectable, inject } from 'tsyringe'
import { Transcription } from '../domain/Transcription'
import { TranscriptionRepository } from '../domain/TranscriptionRepository'
import { TranscriptionFinderRequest } from './TranscriptionFinderRequest'

@injectable()
export class TranscriptionFinder {
  constructor (@inject('TranscriptionRepository') private readonly repository: TranscriptionRepository) {}

  async run (request: TranscriptionFinderRequest): Promise<Transcription | null> {
    console.log('TranscriptionFinder.run', request)

    return await this.repository.search(request.id)
  }
}
