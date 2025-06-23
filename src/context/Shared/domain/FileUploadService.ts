export interface FileUploadService {
  upload: (fileName: string, fileContent: Buffer) => Promise<string>
}
