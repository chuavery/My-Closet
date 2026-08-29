import { StorageSpace } from '@/models/StorageSpace';

export interface StorageSpaceRepository {
  getAll(): Promise<StorageSpace[]>;
  getById(id: string): Promise<StorageSpace | null>;
  getByQrCode(qrCodeValue: string): Promise<StorageSpace | null>;
  create(space: Omit<StorageSpace, 'id' | 'createdAt'>): Promise<StorageSpace>;
  update(id: string, updates: Partial<StorageSpace>): Promise<void>;
  delete(id: string): Promise<void>;
}
