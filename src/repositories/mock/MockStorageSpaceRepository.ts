import { StorageSpace } from '@/models/StorageSpace';
import { StorageSpaceRepository } from '@/repositories/interfaces/StorageSpaceRepository';
import { sampleStorageSpaces } from './fixtures/sampleStorageSpaces';

let spaces = [...sampleStorageSpaces];

export class MockStorageSpaceRepository implements StorageSpaceRepository {
  async getAll(): Promise<StorageSpace[]> {
    return [...spaces];
  }

  async getById(id: string): Promise<StorageSpace | null> {
    return spaces.find((s) => s.id === id) ?? null;
  }

  async getByQrCode(qrCodeValue: string): Promise<StorageSpace | null> {
    return spaces.find((s) => s.qrCodeValue === qrCodeValue) ?? null;
  }

  async create(
    space: Omit<StorageSpace, 'id' | 'createdAt'>
  ): Promise<StorageSpace> {
    const newSpace: StorageSpace = {
      ...space,
      id: `ss-${String(Math.max(0, ...spaces.map((s) => parseInt(s.id.split('-')[1] ?? '0', 10))) + 1).padStart(3, '0')}`,
      createdAt: new Date().toISOString(),
    };
    spaces.push(newSpace);
    return newSpace;
  }

  async update(id: string, updates: Partial<StorageSpace>): Promise<void> {
    const idx = spaces.findIndex((s) => s.id === id);
    if (idx !== -1) {
      spaces[idx] = { ...spaces[idx], ...updates };
    }
  }

  async delete(id: string): Promise<void> {
    spaces = spaces.filter((s) => s.id !== id);
  }
}
