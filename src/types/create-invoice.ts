/**
 * Нэхэмжлэх үүсгэх хүсэлтийн төрөл
 */
export interface QPayCreateInvoice {
  /** Нэхэмжлэхийн код (автоматаар нэмэгдэнэ) */
  invoice_code?: string;
  /** Илгээгчийн нэхэмжлэхийн дугаар */
  sender_invoice_no: string;
  /** Хүлээн авагчийн код */
  invoice_receiver_code: string;
  /** Нэхэмжлэхийн тайлбар */
  invoice_description: string;
  /** Нэхэмжлэхийн дүн */
  amount: number;
  /** Callback URL */
  callback_url: string;
}
