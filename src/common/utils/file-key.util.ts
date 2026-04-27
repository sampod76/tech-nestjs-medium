import crypto from 'crypto';

type GenerateFileKeyPayload = {
  filename: string;
  size: number;
  userId?: string | null;
};

export function generateFileKey(payload: GenerateFileKeyPayload): string {
  const timestamp = Date.now();
  const raw = `${payload.filename}-${payload.size}-${payload.userId ?? 'anonymous'}-${timestamp}`;

  return crypto.createHash('sha256').update(raw).digest('hex');
}
