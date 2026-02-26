import { mkdir, writeFile } from 'fs/promises';
import path from 'path';

const UPLOAD_DIR = process.env.UPLOAD_DIR || './uploads';

export async function saveBase64File(base64: string, fileName: string): Promise<string> {
  const [, data] = base64.split(',');
  const buffer = Buffer.from(data ?? base64, 'base64');
  await mkdir(UPLOAD_DIR, { recursive: true });
  const safeName = `${Date.now()}-${fileName.replace(/[^a-zA-Z0-9.-]/g, '_')}`;
  const fullPath = path.join(UPLOAD_DIR, safeName);
  await writeFile(fullPath, buffer);
  return fullPath;
}
