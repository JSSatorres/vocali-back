import { injectable, inject } from 'tsyringe'
import { Transcription } from '../domain/Transcription'
import { TranscriptionFilename } from '../domain/TranscriptionFilename'
import { TranscriptionDuration } from '../domain/TranscriptionDuration'
import { TranscriptionFileSize } from '../domain/TranscriptionFileSize'
import { TranscriptionS3Key } from '../domain/TranscriptionS3Key'
import { TranscriptionRepository } from '../domain/TranscriptionRepository'
import { TranscriptionCreatorRequest } from './TranscriptionCreatorRequest'
import { FileUploadService } from '../../Shared/domain/FileUploadService'
import { AudioMetadataService } from '../../Shared/domain/AudioMetadataService'

@injectable()
export class TranscriptionCreator {
  constructor (
    @inject('TranscriptionRepository') private readonly repository: TranscriptionRepository,
    @inject('FileUploadService') private readonly fileUploadService: FileUploadService,
    @inject('AudioMetadataService') private readonly audioMetadataService: AudioMetadataService
  ) {}

  async run (request: TranscriptionCreatorRequest): Promise<string> {
    console.log('TranscriptionCreator.run', { filename: request.filename, mimeType: request.mimeType })

    // Extract metadata from the audio file
    const { duration, fileSize } = await this.audioMetadataService.extractMetadata(
      request.filename,
      request.fileContent
    )

    // Upload file to S3 and get the S3 key
    const s3Key = await this.fileUploadService.upload(request.filename, request.fileContent)

    // Create transcription entity
    const transcription = Transcription.create(
      new TranscriptionFilename(request.filename),
      new TranscriptionDuration(duration),
      new TranscriptionFileSize(fileSize),
      new TranscriptionS3Key(s3Key)
    )

    await this.repository.save(transcription)

    return transcription.id.value
  }
}
