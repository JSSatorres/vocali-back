import { injectable } from 'tsyringe'
import { AudioMetadataService } from '../../domain/AudioMetadataService'

@injectable()
export class BasicAudioMetadataService implements AudioMetadataService {
  async extractMetadata (filename: string, fileContent: Buffer): Promise<{ duration: string, fileSize: string }> {
    // Calculate file size
    const fileSizeInBytes = fileContent.length
    const fileSize = this.formatFileSize(fileSizeInBytes)

    // For now, we'll use a simple duration estimation
    // In a real implementation, you'd use a library like 'node-ffmpeg' or 'music-metadata'
    const duration = this.estimateDuration(fileSizeInBytes, filename)

    return {
      duration,
      fileSize
    }
  }

  private formatFileSize (bytes: number): string {
    if (bytes === 0) return '0 B'

    const k = 1024
    const sizes = ['B', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    const size = (bytes / Math.pow(k, i)).toFixed(1)

    return `${size} ${sizes[i]}`
  }

  private estimateDuration (fileSizeInBytes: number, filename: string): string {
    // Simple estimation based on file size and format
    // This is a rough approximation - in production you'd use proper audio analysis
    const ext = filename.toLowerCase().split('.').pop()

    let bitrate = 128 // default bitrate in kbps
    switch (ext) {
      case 'mp3': bitrate = 128; break
      case 'wav': bitrate = 1411; break // uncompressed
      case 'm4a': bitrate = 128; break
      case 'mp4': bitrate = 128; break
    }

    // Duration = (file size in bits) / (bitrate in bits per second)
    const fileSizeInBits = fileSizeInBytes * 8
    const bitrateInBitsPerSecond = bitrate * 1000
    const durationInSeconds = Math.floor(fileSizeInBits / bitrateInBitsPerSecond)

    return this.formatDuration(durationInSeconds)
  }

  private formatDuration (totalSeconds: number): string {
    const hours = Math.floor(totalSeconds / 3600)
    const minutes = Math.floor((totalSeconds % 3600) / 60)
    const seconds = totalSeconds % 60

    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
    } else {
      return `${minutes}:${seconds.toString().padStart(2, '0')}`
    }
  }
}
