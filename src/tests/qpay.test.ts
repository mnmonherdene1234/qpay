import QPay from "../main";
import { invoice_code, password, username } from "../private";

const QPAY = new QPay({
  username,
  password,
  invoice_code,
});

test("QPay instance creation", () => {
  expect(QPAY).toBeInstanceOf(QPay);
});
