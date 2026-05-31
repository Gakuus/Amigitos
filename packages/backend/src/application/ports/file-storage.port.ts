export interface FileStoragePort {
  upload(file: Buffer, fileName: string, mimeType: string): Promise<string>;
  delete(fileUrl: string): Promise<void>;
  getUrl(fileName: string): string;
}
