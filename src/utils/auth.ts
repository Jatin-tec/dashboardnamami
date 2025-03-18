import "server-only";
import { SignJWT, jwtVerify, JWTPayload } from "jose";
import { UserResponse } from "@/types/types";

// Secret key retrieved from environment variable
const secretKey = process.env.SECRET_KEY || "secret";
if (!secretKey) {
  throw new Error("SECRET_KEY is not defined in environment variables");
}
const encodedKey = new TextEncoder().encode(secretKey);

// Define the payload interface for JWT
export interface JwtPayload extends JWTPayload {
  user: UserResponse["user"];
  tokens: UserResponse["tokens"];
}

/**
 * Encrypt a payload into a JWT
 * @param payload - The payload to be signed
 * @returns A Promise resolving to the signed JWT as a string
 */
export async function encrypt(payload: UserResponse): Promise<string> {
  const jwtPayload: JwtPayload = {
    user: payload.user,
    tokens: payload.tokens,
  };
  return new SignJWT(jwtPayload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(encodedKey);
}

/**
 * Decrypt a JWT and verify its validity
 * @param session - The JWT session token
 * @returns A Promise resolving to the payload if verification succeeds, or undefined if it fails
 */
export async function decrypt(
  session?: string,
): Promise<JwtPayload | null> {
  try {
    if (!session) return null;
    const { payload } = await jwtVerify(session, encodedKey, {
      algorithms: ["HS256"],
    });
    return payload as JwtPayload;
  } catch {
    return null;
  }
}
