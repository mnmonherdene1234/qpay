import { QPAY } from "./qpay.test";

let createdInvoiceID = "";

test("createInvoice", async () => {
  const invoiceResponse = await QPAY.createInvoice({
    amount: 500,
    callback_url: "https://order-paid-url.com",
    invoice_description: "Гүйлгээний утга",
    invoice_receiver_code: "12345678",
    sender_invoice_no: "34",
  });

  createdInvoiceID = invoiceResponse.data.invoice_id;
  console.log("Created Invoice ID:", createdInvoiceID);

  expect(invoiceResponse.status).toBe(200);
}, 10000);

test("getInvoice", async () => {
  const invoice = await QPAY.getInvoice(createdInvoiceID);
  expect(invoice.status).toBe(200);
}, 10000);
