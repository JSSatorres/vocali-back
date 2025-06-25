import { injectable, inject } from 'tsyringe'
import { TranscriptionRepository } from '../domain/TranscriptionRepository'
import { TranscriptionId } from '../domain/TranscriptionId'
import { FileUploadService } from '../../Shared/domain/FileUploadService'

@injectable()
export class TranscriptionDownloader {
  constructor (
    @inject('TranscriptionRepository') private readonly repository: TranscriptionRepository,
    @inject('FileUploadService') private readonly fileUploadService: FileUploadService
  ) {}

  async run (transcriptionId: string): Promise<{ textContent: string, filename: string }> {
    const transcription = await this.repository.download(new TranscriptionId(transcriptionId))

    if (!transcription) {
      throw new Error('Transcription not found')
    }

    return {
      textContent: transcription.transcriptionText.value,
      filename: transcription.filename.value
    }
  }
}
