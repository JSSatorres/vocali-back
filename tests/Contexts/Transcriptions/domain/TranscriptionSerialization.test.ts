import { describe, it, expect } from '@jest/globals'
import { Transcription } from '../../../../src/context/Transcription/domain/Transcription'
import { TranscriptionStatus } from '../../../../src/context/Transcription/domain/TranscriptionStatus'
import {
  TranscriptionBuilder,
  TranscriptionMother,
  TranscriptionIdMother,
  TranscriptionFilenameMother,
  TranscriptionTextMother
} from './TestHelpers'

describe('Transcription - Serialization and Edge Cases', () => {
  it('should serialize transcription to primitives correctly', () => {
    // Arrange
    const transcription = TranscriptionBuilder
      .create()
      .withIdValue('test-id-12345')
      .withFilenameValue('serialize-test.mp3')
      .withDurationValue('02:15')
      .withFileSizeValue('4.2 MB')
      .withS3KeyValue('uploads/user/serialize-test.mp3')
      .withCompletedStatus()
      .withTranscriptionTextValue('This is a serialization test')
      .withUserIdValue('user-serialize-123')
      .withCreatedAtValue('2024-03-10T08:30:00.000Z')
      .build()

    // Act
    const primitives = transcription.toPrimitives()

    // Assert
    expect(primitives).toEqual({
      id: 'test-id-12345',
      filename: 'serialize-test.mp3',
      duration: '02:15',
      fileSize: '4.2 MB',
      s3Key: 'uploads/user/serialize-test.mp3',
      status: 'completed',
      transcriptionText: 'This is a serialization test',
      createdAt: '2024-03-10T08:30:00.000Z'
    })
    expect(typeof primitives.id).toBe('string')
    expect(typeof primitives.filename).toBe('string')
    expect(typeof primitives.duration).toBe('string')
    expect(typeof primitives.fileSize).toBe('string')
    expect(typeof primitives.s3Key).toBe('string')
    expect(typeof primitives.status).toBe('string')
    expect(typeof primitives.transcriptionText).toBe('string')
    expect(typeof primitives.createdAt).toBe('string')
  })

  it('should deserialize transcription from primitives correctly', () => {
    // Arrange
    const plainData = {
      id: 'deserialize-id-67890',
      filename: 'deserialize-test.wav',
      duration: '01:45',
      fileSize: '3.8 MB',
      s3Key: 'uploads/user/deserialize-test.wav',
      status: 'processing',
      transcriptionText: 'This is a deserialization test',
      trasncriptionUserId: 'user-deserialize-456',
      createdAt: '2024-03-11T12:45:00.000Z'
    }

    // Act
    const transcription = Transcription.fromPrimitives(plainData)

    // Assert
    expect(transcription).toBeInstanceOf(Transcription)
    expect(transcription.id.value).toBe('deserialize-id-67890')
    expect(transcription.filename.value).toBe('deserialize-test.wav')
    expect(transcription.duration.value).toBe('01:45')
    expect(transcription.fileSize.value).toBe('3.8 MB')
    expect(transcription.s3Key.value).toBe('uploads/user/deserialize-test.wav')
    expect(transcription.status.value).toBe('processing')
    expect(transcription.transcriptionText.value).toBe('This is a deserialization test')
    expect(transcription.trasncriptionUserId.value).toBe('user-deserialize-456')
    expect(transcription.createdAt.toISOString()).toBe('2024-03-11T12:45:00.000Z')
  })

  it('should handle serialization and deserialization round trip', () => {
    // Arrange
    const originalTranscription = TranscriptionMother.create(
      TranscriptionIdMother.create('round-trip-id'),
      TranscriptionFilenameMother.create('round-trip.m4a'),
      undefined,
      undefined,
      undefined,
      TranscriptionStatus.completed(),
      TranscriptionTextMother.create('Round trip serialization test')
    )

    // Act
    const primitives = originalTranscription.toPrimitives()
    const deserializedTranscription = Transcription.fromPrimitives({
      ...primitives,
      trasncriptionUserId: originalTranscription.trasncriptionUserId.value
    })

    // Assert
    expect(deserializedTranscription.id.value).toBe(originalTranscription.id.value)
    expect(deserializedTranscription.filename.value).toBe(originalTranscription.filename.value)
    expect(deserializedTranscription.duration.value).toBe(originalTranscription.duration.value)
    expect(deserializedTranscription.fileSize.value).toBe(originalTranscription.fileSize.value)
    expect(deserializedTranscription.s3Key.value).toBe(originalTranscription.s3Key.value)
    expect(deserializedTranscription.status.value).toBe(originalTranscription.status.value)
    expect(deserializedTranscription.transcriptionText.value).toBe(originalTranscription.transcriptionText.value)
    expect(deserializedTranscription.trasncriptionUserId.value).toBe(originalTranscription.trasncriptionUserId.value)
  })

  it('should handle edge cases with empty and extreme values', () => {
    // Arrange & Act - Empty transcription text
    const emptyTextTranscription = TranscriptionBuilder
      .create()
      .withEmptyTranscriptionText()
      .withFilenameValue('empty-text.mp3')
      .build()

    // Arrange & Act - Long transcription text
    // const longTextTranscription = TranscriptionBuilder
    //   .create()
    //   .withLongTranscriptionText()
    //   .withFilenameValue('long-text.mp3')
    //   .build()

    // Arrange & Act - Minimum duration
    const shortDurationTranscription = TranscriptionBuilder
      .create()
      .withDurationValue('00:01')
      .withFilenameValue('short.mp3')
      .build()

    // Arrange & Act - Long duration
    const longDurationTranscription = TranscriptionBuilder
      .create()
      .withDurationValue('59:59')
      .withFilenameValue('long.mp3')
      .build()

    // Assert
    expect(emptyTextTranscription.transcriptionText.value).toBe('')
    expect(emptyTextTranscription.transcriptionText.getWordCount()).toBe(0)

    // expect(longTextTranscription.transcriptionText.value.length).toBeGreaterThan(1000)
    // expect(longTextTranscription.transcriptionText.getWordCount()).toBeGreaterThan(100)

    expect(shortDurationTranscription.duration.value).toBe('00:01')
    expect(shortDurationTranscription.duration.toSeconds()).toBe(1)

    expect(longDurationTranscription.duration.value).toBe('59:59')
    expect(longDurationTranscription.duration.toSeconds()).toBe(3599)
  })

  it('should validate transcription text constraints and methods', () => {
    // Arrange
    const mediumText = 'This is a medium length transcription text for testing purposes. '.repeat(3)
    const transcription = TranscriptionBuilder
      .create()
      .withTranscriptionTextValue(mediumText)
      .build()

    // Act
    const wordCount = transcription.transcriptionText.getWordCount()
    const preview = transcription.transcriptionText.getPreview(50)

    // Assert
    expect(wordCount).toBeGreaterThan(10)
    expect(wordCount).toBeLessThan(100)
    expect(preview.length).toBeLessThanOrEqual(53) // 50 + '...'
    expect(preview.endsWith('...')).toBe(true)

    // Test full text preview
    const shortText = 'Short text'
    const shortTranscription = TranscriptionBuilder
      .create()
      .withTranscriptionTextValue(shortText)
      .build()

    const shortPreview = shortTranscription.transcriptionText.getPreview(50)
    expect(shortPreview).toBe(shortText)
    expect(shortPreview.endsWith('...')).toBe(false)
  })
})
