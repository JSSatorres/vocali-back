import { describe, it, expect } from '@jest/globals'
import { Transcription } from '../../../../src/context/Transcription/domain/Transcription'
import { TranscriptionStatus } from '../../../../src/context/Transcription/domain/TranscriptionStatus'
import {
  TranscriptionBuilder,
  TranscriptionMother,
  TranscriptionFilenameMother,
  TranscriptionDurationMother,
  TranscriptionFileSizeMother,
  TranscriptionS3KeyMother,
  TranscriptionTextMother
} from './TestHelpers'
import { TrasncriptionUserId } from '../../../../src/context/Transcription/domain/TrasncriptionUserId'

describe('Transcription - Creation and Construction', () => {
  it('should create a transcription with valid data using static factory method', () => {
    // Arrange
    const filename = TranscriptionFilenameMother.create('test-audio.mp3')
    const duration = TranscriptionDurationMother.create('02:30')
    const fileSize = TranscriptionFileSizeMother.create('5.2 MB')
    const userId = new TrasncriptionUserId('user-123')
    const s3Key = TranscriptionS3KeyMother.create('uploads/user-123/test-audio.mp3')
    const transcriptionText = 'Hello, this is a test transcription'

    // Act
    const transcription = Transcription.create(
      filename,
      duration,
      fileSize,
      userId,
      s3Key,
      transcriptionText
    )

    // Assert
    expect(transcription).toBeInstanceOf(Transcription)
    expect(transcription.id).toBeDefined()
    expect(transcription.filename.value).toBe('test-audio.mp3')
    expect(transcription.duration.value).toBe('02:30')
    expect(transcription.fileSize.value).toBe('5.2 MB')
    expect(transcription.s3Key.value).toBe('uploads/user-123/test-audio.mp3')
    expect(transcription.status.value).toBe('pending')
    expect(transcription.transcriptionText.value).toBe('Hello, this is a test transcription')
    expect(transcription.trasncriptionUserId.value).toBe('user-123')
    expect(transcription.createdAt).toBeInstanceOf(Date)
  })

  it('should create a transcription with empty transcription text by default', () => {
    // Arrange
    const filename = TranscriptionFilenameMother.create('empty-test.mp3')
    const duration = TranscriptionDurationMother.create('01:15')
    const fileSize = TranscriptionFileSizeMother.create('3.1 MB')
    const userId = new TrasncriptionUserId('user-456')
    const s3Key = TranscriptionS3KeyMother.create('uploads/user-456/empty-test.mp3')

    // Act
    const transcription = Transcription.create(
      filename,
      duration,
      fileSize,
      userId,
      s3Key
    )

    // Assert
    expect(transcription.transcriptionText.value).toBe('')
    expect(transcription.status.value).toBe('pending')
    expect(transcription.trasncriptionUserId.value).toBe('user-456')
  })

  it('should build transcription using TranscriptionBuilder with fluent interface', () => {
    // Arrange & Act
    const transcription = TranscriptionBuilder
      .create()
      .withFilenameValue('builder-test.wav')
      .withDurationValue('05:45')
      .withFileSizeValue('12.8 MB')
      .withS3KeyValue('uploads/builder-user/builder-test.wav')
      .withCompletedStatus()
      .withTranscriptionTextValue('This transcription was built using the builder pattern')
      .withUserIdValue('builder-user-789')
      .withCreatedAtValue('2024-01-15T10:30:00.000Z')
      .build()

    // Assert
    expect(transcription.filename.value).toBe('builder-test.wav')
    expect(transcription.duration.value).toBe('05:45')
    expect(transcription.fileSize.value).toBe('12.8 MB')
    expect(transcription.s3Key.value).toBe('uploads/builder-user/builder-test.wav')
    expect(transcription.status.value).toBe('completed')
    expect(transcription.transcriptionText.value).toBe('This transcription was built using the builder pattern')
    expect(transcription.trasncriptionUserId.value).toBe('builder-user-789')
    expect(transcription.createdAt.toISOString()).toBe('2024-01-15T10:30:00.000Z')
  })

  it('should create transcription using TranscriptionMother with different configurations', () => {
    // Arrange & Act
    const defaultTranscription = TranscriptionMother.create()
    const customTranscription = TranscriptionMother.create(
      undefined, // id
      TranscriptionFilenameMother.create('mother-test.m4a'),
      TranscriptionDurationMother.create('03:22'),
      TranscriptionFileSizeMother.create('7.5 MB'),
      TranscriptionS3KeyMother.create('uploads/mother-user/mother-test.m4a'),
      TranscriptionStatus.processing(),
      TranscriptionTextMother.create('Mother object generated this transcription text')
    )

    // Assert
    expect(defaultTranscription).toBeInstanceOf(Transcription)
    expect(defaultTranscription.id).toBeDefined()
    expect(defaultTranscription.filename).toBeDefined()
    expect(defaultTranscription.duration).toBeDefined()
    expect(defaultTranscription.fileSize).toBeDefined()
    expect(defaultTranscription.s3Key).toBeDefined()
    expect(defaultTranscription.status).toBeDefined()

    expect(customTranscription.filename.value).toBe('mother-test.m4a')
    expect(customTranscription.duration.value).toBe('03:22')
    expect(customTranscription.fileSize.value).toBe('7.5 MB')
    expect(customTranscription.s3Key.value).toBe('uploads/mother-user/mother-test.m4a')
    expect(customTranscription.status.value).toBe('processing')
    expect(customTranscription.transcriptionText.value).toBe('Mother object generated this transcription text')
  })

  it('should handle creation with long transcription text and different statuses', () => {
    // Arrange
    const longText = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. '.repeat(50)
    const builder = TranscriptionBuilder.create()

    // Act & Assert - Test different statuses
    const pendingTranscription = builder
      .withFilenameValue('long-test-pending.mp3')
      .withPendingStatus()
      .withTranscriptionTextValue(longText)
      .build()

    const processingTranscription = builder
      .withFilenameValue('long-test-processing.mp3')
      .withProcessingStatus()
      .build()

    const completedTranscription = builder
      .withFilenameValue('long-test-completed.mp3')
      .withCompletedStatus()
      .build()

    const failedTranscription = builder
      .withFilenameValue('long-test-failed.mp3')
      .withFailedStatus()
      .build()

    expect(pendingTranscription.status.value).toBe('pending')
    expect(pendingTranscription.transcriptionText.value).toBe(longText)
    expect(pendingTranscription.transcriptionText.getWordCount()).toBeGreaterThan(100)

    expect(processingTranscription.status.value).toBe('processing')
    expect(completedTranscription.status.value).toBe('completed')
    expect(failedTranscription.status.value).toBe('failed')
  })
})
