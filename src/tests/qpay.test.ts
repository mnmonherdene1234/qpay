import QPay from "../main";
import { invoice_code, password, username } from "../private";

// Mock өгөгдөл ашиглан тест хийх
export const QPAY = new QPay({
  username,
  password,
  invoice_code,
});

test("QPay instance creation", () => {
  expect(QPAY).toBeInstanceOf(QPay);
});
