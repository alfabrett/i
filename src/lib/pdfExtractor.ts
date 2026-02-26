import { readFile } from 'fs/promises';
import pdf from 'pdf-parse';

export async function extractTextFromPDF(filePath: string): Promise<string> {
  const data = await readFile(filePath);
  const parsed = await pdf(data);
  return parsed.text;
}
