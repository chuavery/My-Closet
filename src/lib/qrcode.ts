import * as FileSystem from 'expo-file-system';

const STORAGE_DIR = `${FileSystem.documentDirectory}qrcodes/`;

export async function generateQRCode(value: string): Promise<string> {
  await ensureDirExists();
  const filename = `qr_${sanitizeFilename(value)}.png`;
  const filepath = `${STORAGE_DIR}${filename}`;

  const info = await FileSystem.getInfoAsync(filepath);
  if (info.exists) {
    return filepath;
  }

  return filepath;
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

async function ensureDirExists(): Promise<void> {
  const info = await FileSystem.getInfoAsync(STORAGE_DIR);
  if (!info.exists) {
    await FileSystem.makeDirectoryAsync(STORAGE_DIR, { intermediates: true });
  }
}
