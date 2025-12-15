import { QPay } from "../src";

const username = process.env.QPAY_USERNAME;
const password = process.env.QPAY_PASSWORD;
const invoice_code = process.env.QPAY_INVOICE_CODE;

const hasCreds = Boolean(username && password && invoice_code);

let createdInvoiceID = "";

(hasCreds ? test : test.skip)(
  "createInvoice",
  async () => {
    const qpay = new QPay({
      username: username!,
      password: password!,
      invoice_code: invoice_code!,
    });

    const invoiceResponse = await qpay.createInvoice({
      amount: 500,
      callback_url: "https://order-paid-url.com",
      invoice_description: "Гүйлгээний утга",
      invoice_receiver_code: "12345678",
      sender_invoice_no: "34",
    });

    createdInvoiceID = invoiceResponse.data.invoice_id;
    expect(invoiceResponse.status).toBe(200);
    expect(createdInvoiceID).toBeTruthy();
  },
  30000
);

(hasCreds ? test : test.skip)(
  "getInvoice",
  async () => {
    if (!createdInvoiceID) {
      throw new Error("createInvoice did not run or returned no invoice_id");
    }

    const qpay = new QPay({
      username: username!,
      password: password!,
      invoice_code: invoice_code!,
    });

    const invoice = await qpay.getInvoice(createdInvoiceID);
    expect(invoice.status).toBe(200);
  },
  30000
);
