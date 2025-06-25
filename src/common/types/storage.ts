export interface FileData {
    filename: string;
    fileData: ArrayBuffer;
}

export interface FileStorage {
    upload(data: FileData): Promise<string>;
    delete(filename: string): void;
    getObjectUri(filename: string): string;
}

export interface IStorageService {
    uploadFile(fileBuffer: Buffer, fileName: string): Promise<string>;
}
