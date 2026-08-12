import crypto from 'crypto';

if (!process.env.ADMIN_SESSION_SECRET) {
  throw new Error("CRITICAL STARTUP ERROR: ADMIN_SESSION_SECRET environment variable is required.");
}

const SESSION_SECRET = process.env.ADMIN_SESSION_SECRET;

/**
 * Creates a cryptographically signed session token: username:expiry:signature
 */
export function createSessionToken(username: string): string {
  // Session is valid for 2 hours (7200 seconds)
  const expiry = Date.now() + 2 * 60 * 60 * 1000;
  const payload = `${username}:${expiry}`;
  const signature = crypto
    .createHmac('sha256', SESSION_SECRET)
    .update(payload)
    .digest('hex');
  return `${payload}:${signature}`;
}

/**
 * Verifies the cryptographically signed session token and checks expiry.
 * Safe against timing attacks.
 */
export function verifySessionToken(token: string | undefined): { username: string } | null {
  if (!token) return null;

  const parts = token.split(':');
  if (parts.length !== 3) return null;

  const [username, expiryStr, signature] = parts;
  const expiry = parseInt(expiryStr, 10);

  if (isNaN(expiry) || expiry < Date.now()) {
    return null; // Expired or invalid format
  }

  // Recompute signature for validation
  const payload = `${username}:${expiry}`;
  const expectedSignature = crypto
    .createHmac('sha256', SESSION_SECRET)
    .update(payload)
    .digest('hex');

  try {
    const signatureBuffer = Buffer.from(signature, 'hex');
    const expectedBuffer = Buffer.from(expectedSignature, 'hex');

    if (signatureBuffer.length !== expectedBuffer.length) {
      return null;
    }

    if (!crypto.timingSafeEqual(signatureBuffer, expectedBuffer)) {
      return null;
    }
  } catch (err) {
    return null;
  }

  return { username };
}
