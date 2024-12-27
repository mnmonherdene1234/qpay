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

let createdInvoiceID = "";

test("createInvoice", async () => {
  const invoiceResponse = await qpay.createInvoice({
    amount: 500,
    callback_url: "https://order-paid-url.com",
    invoice_description: "Гүйлгээний утга",
    invoice_receiver_code: "12345678",
    sender_invoice_no: "34",
  });

  createdInvoiceID = invoiceResponse.data.invoice_id;

  expect(invoiceResponse.status).toBe(200);
}, 10000);

test("getInvoice", async () => {
  const invoice = await qpay.getInvoice(createdInvoiceID);
  expect(invoice.status).toBe(200);
}, 10000);
