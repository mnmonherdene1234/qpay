/**
 * QPay API client тохиргооны төрөл
 */
export interface QPaySetup {
  /** QPay хэрэглэгчийн нэр */
  username: string;
  /** QPay нууц үг */
  password: string;
  /** Нэхэмжлэхийн код */
  invoiceCode: string;
}