export const HOST_STRATEGY = 'HOST_STRATEGY';

export interface IHostStrategy {
  uploadFile(file: Express.Multer.File): Promise<string>;
  deleteFile(fileUrl: string): Promise<void>;
  getHostName(): string;
}
