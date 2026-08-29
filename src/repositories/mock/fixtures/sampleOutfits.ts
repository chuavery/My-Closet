import { Outfit } from '@/models/Outfit';

export const sampleOutfits: Outfit[] = [
  {
    id: 'out-001',
    name: 'Business Casual',
    wearCount: 6,
    lastWornAt: '2026-08-18T10:00:00Z',
    createdAt: '2026-04-01T10:00:00Z',
  },
  {
    id: 'out-002',
    name: 'Weekend Brunch',
    wearCount: 3,
    lastWornAt: '2026-08-10T10:00:00Z',
    createdAt: '2026-06-01T10:00:00Z',
  },
  {
    id: 'out-003',
    name: 'Date Night',
    wearCount: 2,
    lastWornAt: null,
    createdAt: '2026-07-15T10:00:00Z',
  },
];
