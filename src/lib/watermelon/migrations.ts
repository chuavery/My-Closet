import { schema } from './schema';

export type Migration = {
  toVersion: number;
  steps: readonly (string | (() => Promise<void>))[];
};

export const migrations: Migration[] = [
  {
    toVersion: 1,
    steps: [],
  },
];
