import 'reflect-metadata'
import { container, DependencyContainer } from 'tsyringe'
import { UserRepository } from '../../../User/domain/UserRepository'
import { DynamoDBUserRepository } from '../../../User/infrastructure/persistence/DynamoDBUserRepository'
import { TranscriptionRepository } from '../../../Transcription/domain/TranscriptionRepository'
import { DynamoDBTranscriptionRepository } from '../../../Transcription/infrastructure/persistence/DynamoDBTranscriptionRepository'
import { FileUploadService } from '../../domain/FileUploadService'
import { S3FileUploadService } from '../FileUpload/S3FileUploadService'
import { AudioMetadataService } from '../../domain/AudioMetadataService'
import { BasicAudioMetadataService } from '../AudioMetadata/BasicAudioMetadataService'
import { FileParserService } from '../../domain/FileParserService'
import { BusboyMultipartParser } from '../FileParser/BusboyMultipartParser'

export const initializeDIContainer = (): void => {
  // Register User dependencies
  container.register<UserRepository>('UserRepository', {
    useClass: DynamoDBUserRepository
  })

  // Register Transcription dependencies
  container.register<TranscriptionRepository>('TranscriptionRepository', {
    useClass: DynamoDBTranscriptionRepository
  })

  // Register Shared services
  container.register<FileUploadService>('FileUploadService', {
    useClass: S3FileUploadService
  })

  container.register<AudioMetadataService>('AudioMetadataService', {
    useClass: BasicAudioMetadataService
  })

  container.register<FileParserService>('FileParserService', {
    useClass: BusboyMultipartParser
  })
}

export const getDIContainer = (): DependencyContainer => {
  return container
}
