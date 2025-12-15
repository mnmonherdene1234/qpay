import { QPay } from "../src";

const username = process.env.QPAY_USERNAME;
const password = process.env.QPAY_PASSWORD;
const invoice_code = process.env.QPAY_INVOICE_CODE;

const hasCreds = Boolean(username && password && invoice_code);

(hasCreds ? test : test.skip)("QPay instance creation", () => {
  const qpay = new QPay({
    username: username!,
    password: password!,
    invoice_code: invoice_code!,
  });

  expect(qpay).toBeInstanceOf(QPay);
});
