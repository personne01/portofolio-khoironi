import {
  randomBytes,
  scrypt as scryptCallback,
  timingSafeEqual,
} from "node:crypto";

/**
 * Password hashing with Node's `crypto.scrypt`.
 *
 * Deliberately dependency-free (no bcrypt/argon2): scrypt is a memory-hard
 * KDF provided by Node itself. Each password gets a fresh 16-byte random salt,
 * and verification compares digests with a constant-time equality check so
 * timing cannot leak the expected hash.
 */

const KEY_LENGTH = 64;
const SALT_BYTES = 16;

export type PasswordHash = {
  hash: string;
  salt: string;
};

function scryptAsync(
  password: string,
  salt: string,
  keylen: number,
): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    scryptCallback(password, salt, keylen, (error, derivedKey) => {
      if (error !== null) reject(error);
      else resolve(derivedKey);
    });
  });
}

/** Derives a salted hash for a plaintext password. The salt is returned alongside. */
export async function hashPassword(password: string): Promise<PasswordHash> {
  const salt = randomBytes(SALT_BYTES).toString("hex");
  const derived = await scryptAsync(password, salt, KEY_LENGTH);
  return { hash: derived.toString("hex"), salt };
}

/**
 * Constant-time verification of a plaintext password against a stored
 * (salt, hash) pair. Returns false for malformed stored values; never throws
 * for a wrong password.
 */
export async function verifyPassword(
  password: string,
  salt: string,
  expectedHash: string,
): Promise<boolean> {
  if (salt === "" || expectedHash === "") return false;
  let derived: Buffer;
  try {
    derived = await scryptAsync(password, salt, KEY_LENGTH);
  } catch {
    // Invalid salt hex or scrypt failure: treat as not-a-match.
    return false;
  }
  const expected = Buffer.from(expectedHash, "hex");
  return (
    derived.length === expected.length && timingSafeEqual(derived, expected)
  );
}