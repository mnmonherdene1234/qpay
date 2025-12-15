import { QPayDeepLink } from "./deep-link";

/**
 * Нэхэмжлэх үүсгэсний хариултын төрөл
 */
export interface QPayCreateInvoiceResponse {
  /** Үүсгэсэн нэхэмжлэхийн ID */
  invoice_id: string;
  /** QR кодын текст */
  qr_text: string;
  /** QR кодын зураг (base64) */
  qr_image: string;
  /** QPay богино холбоос */
  qPay_shortUrl: string;
  /** Банкны апп-уудын deep link-үүд */
  urls: QPayDeepLink[];
}
