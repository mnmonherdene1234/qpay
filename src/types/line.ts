/**
 * Нэхэмжлэхийн мөрийн төрөл
 */
export interface QPayLine {
  /** Татварын бүтээгдэхүүний код */
  tax_product_code: string;
  /** Мөрийн тайлбар */
  line_description: string;
  /** Тоо хэмжээ */
  line_quantity: string;
  /** Нэгж үнэ */
  line_unit_price: string;
  /** Тэмдэглэл */
  note: string;
  /** Хөнгөлөлтүүд */
  discounts: unknown[];
  /** Нэмэлт төлбөрүүд */
  surcharges: unknown[];
  /** Татварууд */
  taxes: unknown[];
}
