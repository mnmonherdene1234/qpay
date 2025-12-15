import { QPayLine } from "./line";

/**
 * Нэхэмжлэхийн төлөв
 */
export type QPayInvoiceStatus = "OPEN" | "CLOSED";

/**
 * Нэхэмжлэх авах хариултын төрөл
 */
export interface QPayGetInvoiceResponse {
  /** Нэхэмжлэхийн ID */
  invoice_id: string;
  /** Нэхэмжлэхийн төлөв */
  invoice_status: QPayInvoiceStatus;
  /** Илгээгчийн нэхэмжлэхийн дугаар */
  sender_invoice_no: string;
  /** Илгээгчийн салбарын код */
  sender_branch_code: string;
  /** Илгээгчийн салбарын мэдээлэл */
  sender_branch_data: string;
  /** Илгээгчийн ажилтны код */
  sender_staff_code: string;
  /** Илгээгчийн ажилтны мэдээлэл */
  sender_staff_data: string;
  /** Илгээгчийн терминалын код */
  sender_terminal_code: string;
  /** Илгээгчийн терминалын мэдээлэл */
  sender_terminal_data: string;
  /** Нэхэмжлэхийн тайлбар */
  invoice_description: string;
  /** Төлбөр хийх сүүлийн хугацаа */
  invoice_due_date: string;
  /** Дуусах хугацаа идэвхтэй эсэх */
  enable_expiry: boolean;
  /** Дуусах огноо */
  expiry_date: string;
  /** Хэсэгчлэн төлөх боломжтой эсэх */
  allow_partial: boolean;
  /** Хамгийн бага дүн */
  minimum_amount: number;
  /** Илүү төлөх боломжтой эсэх */
  allow_exceed: boolean;
  /** Хамгийн их дүн */
  maximum_amount: string;
  /** Нийт дүн */
  total_amount: string;
  /** Нийт дүн (татваргүй) */
  gross_amount: string;
  /** Татварын дүн */
  tax_amount: string;
  /** Нэмэлт төлбөрийн дүн */
  surcharge_amount: string;
  /** Хөнгөлөлтийн дүн */
  discount_amount: string;
  /** Callback URL */
  callback_url: string;
  /** Тэмдэглэл */
  note: string;
  /** Нэхэмжлэхийн мөрүүд */
  lines: QPayLine[];
  /** Гүйлгээнүүд */
  transactions: unknown[];
  /** Нэмэлт оролтууд */
  inputs: unknown[];
}
