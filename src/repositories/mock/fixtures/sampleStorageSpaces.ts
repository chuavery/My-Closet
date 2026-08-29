import { StorageSpace } from '@/models/StorageSpace';

export const sampleStorageSpaces: StorageSpace[] = [
  {
    id: 'ss-001',
    name: 'Bedroom Closet',
    subLocation: 'Top Shelf',
    qrCodeValue: 'MYCLOSET-SS-001',
    createdAt: '2026-01-01T10:00:00Z',
  },
  {
    id: 'ss-002',
    name: 'Bedroom Closet',
    subLocation: 'Middle Rod',
    qrCodeValue: 'MYCLOSET-SS-002',
    createdAt: '2026-01-01T10:00:00Z',
  },
  {
    id: 'ss-003',
    name: 'Entryway Bench',
    qrCodeValue: 'MYCLOSET-SS-003',
    createdAt: '2026-02-15T10:00:00Z',
  },
  {
    id: 'ss-004',
    name: 'Guest Room Drawer',
    subLocation: 'Bottom Drawer',
    qrCodeValue: 'MYCLOSET-SS-004',
    createdAt: '2026-03-10T10:00:00Z',
  },
];
