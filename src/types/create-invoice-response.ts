import { DeepLink } from "./deep-link";

export type QPayCreateInvoiceResponse = {
  invoice_id: string;
  qr_text: string;
  qr_image: string;
  qPay_shortUrl: string;
  urls: DeepLink[];
};
