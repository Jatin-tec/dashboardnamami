import "server-only";
import { SignJWT, jwtVerify } from "jose";
import { UserResponse } from "@/types/types";
import { Session } from "@/types/generic";

// Secret key retrieved from environment variable
const secretKey = process.env.SECRET_KEY || "secret";
if (!secretKey) {
  throw new Error("SECRET_KEY is not defined in environment variables");
}
const encodedKey = new TextEncoder().encode(secretKey);

/**
 * Encrypt a payload into a JWT
 * @param payload - The payload to be signed
 * @returns A Promise resolving to the signed JWT as a string
 */
export async function encrypt(payload: UserResponse): Promise<string> {
  const session: Session = {
    user: payload.user,
    tokens: payload.tokens,
  };
  return new SignJWT(session)
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
): Promise<Session | null> {
  try {
    if (!session) return null;
    const { payload } = await jwtVerify(session, encodedKey, {
      algorithms: ["HS256"],
    });
    return payload as Session;
  } catch {
    return null;
  }
}
