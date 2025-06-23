export interface FileParserService {
  parseMultipart: (body: string, contentType: string) => Promise<{
    filename: string
    fileContent: Buffer
    mimeType: string
  }>
}
