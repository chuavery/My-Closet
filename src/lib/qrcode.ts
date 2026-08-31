import { Paths, Directory, File } from 'expo-file-system';

const STORAGE_DIR = new Directory(Paths.document, 'qrcodes');

export function generateQRCode(value: string): string {
  ensureDirExists();
  const filename = `qr_${sanitizeFilename(value)}.png`;
  const file = new File(STORAGE_DIR, filename);

  return file.uri;
}

export function parseQRCode(rawValue: string): string | null {
  if (!rawValue) return null;
  const trimmed = rawValue.trim();
  if (trimmed.length === 0) return null;
  return trimmed;
}

function sanitizeFilename(value: string): string {
  return value.replace(/[^a-zA-Z0-9_-]/g, '_').substring(0, 64);
}

function ensureDirExists(): void {
  if (!STORAGE_DIR.exists) {
    STORAGE_DIR.create({ intermediates: true });
  }
}
