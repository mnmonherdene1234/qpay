/**
 * Банкны апп-ын deep link төрөл
 */
export interface QPayDeepLink {
  /** Банкны нэр */
  name: string;
  /** Банкны тайлбар */
  description: string;
  /** Банкны лого */
  logo: string;
  /** Deep link URL */
  link: string;
}
