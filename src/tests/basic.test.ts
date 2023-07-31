import QPay from "../main";
import { invoiceCode, password, username } from "../private";

QPay.setup({
  username: username,
  password: password,
  invoice_code: invoiceCode,
});

const qpay = QPay.getInstance();

test("getInstance", async () => {
  expect(QPay.getInstance()).toBeInstanceOf(QPay);
});

test("Create invoice", async () => {
  const invoiceResponse = await qpay.createInvoice({
    amount: 10,
    callback_url: "https://order-paid-url.com",
    invoice_description: "TEST",
    invoice_receiver_code: "TEST",
    sender_invoice_no: "TEST",
  });

  expect(invoiceResponse.status).toBe(200);
}, 10000);

test("Get Invoice", async () => {
  const invoice = await qpay.getInvoice("a79715cb-1129-470e-a005-310614799124");
  expect(invoice.status).toBe(200);
}, 10000);
