export class JwtPayload {
  userId: string;
  email: string;
  accessToken?: string;
  refreshToken?: string;
}
