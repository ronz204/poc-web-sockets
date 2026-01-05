import { SignJWT, jwtVerify } from "jose";
const secret = new TextEncoder().encode("your-secret-key");

export class JoseService {
  public static async sign() {
    return new SignJWT()
      .setIssuedAt()
      .setProtectedHeader({ alg: "HS256" })
      .setExpirationTime("2h")
      .sign(secret);
  };

  public static async verify(token: string) {
    return await jwtVerify(token, secret);
  };
};
