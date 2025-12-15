import { QPay } from "../../";
import { invoiceCode, password, username } from "../private";

const QPAY = new QPay({
  username,
  password,
  invoiceCode,
});

test("QPay instance creation", () => {
  expect(QPAY).toBeInstanceOf(QPay);
});
