import { Q } from '@nozbe/watermelondb';
import { StorageSpace } from '@/models/StorageSpace';
import { StorageSpaceRepository } from '@/repositories/interfaces/StorageSpaceRepository';
import { getDatabase } from '@/lib/watermelon/database';
import { StorageSpaceModel } from '@/lib/watermelon/models/StorageSpaceModel';

function mapToStorageSpace(model: StorageSpaceModel): StorageSpace {
  return {
    id: model.id,
    name: model.name,
    subLocation: model.subLocation,
    qrCodeValue: model.qrCodeValue,
    createdAt: new Date((model._raw as any).created_at * 1000).toISOString(),
  };
}

export class LocalStorageSpaceRepository implements StorageSpaceRepository {
  private get collection() {
    return getDatabase().get<StorageSpaceModel>('storage_spaces');
  }

  async getAll(): Promise<StorageSpace[]> {
    const models = await this.collection.query().fetch();
    return models.map(mapToStorageSpace);
  }

  async getById(id: string): Promise<StorageSpace | null> {
    try {
      const model = await this.collection.find(id);
      return mapToStorageSpace(model);
    } catch {
      return null;
    }
  }

  async getByQrCode(qrCodeValue: string): Promise<StorageSpace | null> {
    const models = await this.collection
      .query(Q.where('qr_code_value', qrCodeValue))
      .fetch();
    return models.length > 0 ? mapToStorageSpace(models[0]) : null;
  }

  async create(
    space: Omit<StorageSpace, 'id' | 'createdAt'>
  ): Promise<StorageSpace> {
    const model = await this.collection.create((rec) => {
      rec.name = space.name;
      rec.subLocation = space.subLocation;
      rec.qrCodeValue = space.qrCodeValue;
    });
    return mapToStorageSpace(model);
  }

  async update(id: string, updates: Partial<StorageSpace>): Promise<void> {
    const model = await this.collection.find(id);
    await model.update((rec) => {
      if (updates.name !== undefined) rec.name = updates.name;
      if (updates.subLocation !== undefined) rec.subLocation = updates.subLocation;
      if (updates.qrCodeValue !== undefined) rec.qrCodeValue = updates.qrCodeValue;
    });
  }

  async delete(id: string): Promise<void> {
    const articles = getDatabase().get('articles');
    const orphans = await articles
      .query(Q.where('storage_space_id', id))
      .fetch();
    for (const orphan of orphans) {
      await orphan.update((rec: any) => {
        rec.storageSpaceId = null;
      });
    }
    const model = await this.collection.find(id);
    await model.destroyPermanently();
  }
}
