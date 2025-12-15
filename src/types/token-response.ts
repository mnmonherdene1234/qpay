/**
 * QPay API токен хариултын төрөл
 */
export interface QPayTokenResponse {
  /** Токений төрөл (ихэвчлэн "Bearer") */
  token_type: string;
  /** Refresh токен дуусах хугацаа (Unix timestamp секундээр) */
  refresh_expires_in: number;
  /** Refresh токен */
  refresh_token: string;
  /** Access токен */
  access_token: string;
  /** Access токен дуусах хугацаа (Unix timestamp секундээр) */
  expires_in: number;
  /** Токений scope */
  scope: string;
  /** Not-before policy */
  "not-before-policy": string;
  /** Session state */
  session_state: string;
}
