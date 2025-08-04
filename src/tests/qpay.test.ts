import QPay from "../main";
import { invoiceCode, password, username } from "../private";

// Mock өгөгдөл ашиглан тест хийх
export const QPAY = new QPay({
  username,
  password,
  invoice_code: invoiceCode,
});

test("QPay instance creation", () => {
  expect(QPAY).toBeInstanceOf(QPay);
});
