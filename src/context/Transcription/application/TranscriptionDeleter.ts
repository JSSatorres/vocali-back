import { injectable, inject } from 'tsyringe'
import { TranscriptionRepository } from '../domain/TranscriptionRepository'
import { TranscriptionId } from '../domain/TranscriptionId'
import { FileUploadService } from '../../Shared/domain/FileUploadService'

@injectable()
export class TranscriptionDeleter {
  constructor (
    @inject('TranscriptionRepository') private readonly repository: TranscriptionRepository,
    @inject('FileUploadService') private readonly fileUploadService: FileUploadService
  ) {}

  async run (transcriptionId: string): Promise<void> {
    const transcription = await this.repository.download(new TranscriptionId(transcriptionId))

    if (!transcription) {
      throw new Error(`Transcription with id ${transcriptionId} not found`)
    }

    await this.fileUploadService.delete(transcription.s3Key.value)

    await this.repository.delete(transcriptionId)
  }
}
