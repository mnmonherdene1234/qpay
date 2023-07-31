import axios, { AxiosRequestConfig } from "axios";
import {
  QPayCreateInvoice,
  QPayCreateInvoiceResponse,
  QPayGetInvoiceResponse,
  QPayTokenResponse,
  Setup,
} from "./types";

class QPay {
  private constructor() {}
  private static instance: QPay;

  private host = "https://merchant.qpay.mn";
  private accessToken = "";

  private username = "";
  private password = "";
  private invoiceCode = "";

  private static checkInstance() {
    if (!QPay.instance) {
      QPay.instance = new QPay();
    }
  }

  static setup({ username, password, invoice_code }: Setup) {
    this.checkInstance();

    QPay.instance.username = username;
    QPay.instance.password = password;
    QPay.instance.invoiceCode = invoice_code;
  }

  static getInstance() {
    this.checkInstance();

    return QPay.instance;
  }

  async token() {
    const auth = `Basic ${Buffer.from(
      `${this.username}:${this.password}`
    ).toString("base64")}`;

    const response = await axios.post<QPayTokenResponse>(
      `${this.host}/v2/auth/token`,
      undefined,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: auth,
        },
      }
    );

    this.accessToken = response.data.access_token;
  }

  private async makeAuthorizedRequest<T>(
    url: string,
    method: "get" | "post" | "put" | "delete",
    data?: any
  ) {
    await this.token();

    const config: AxiosRequestConfig = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${this.accessToken}`,
      },
    };

    if (method === "get") {
      return axios.get<T>(url, config);
    } else if (method === "post") {
      return axios.post<T>(url, data, config);
    } else if (method === "put") {
      return axios.put<T>(url, data, config);
    } else if (method === "delete") {
      return axios.delete<T>(url, config);
    } else {
      throw new Error("INVALID_METHOD");
    }
  }

  async createInvoice(qpayInvoice: QPayCreateInvoice) {
    qpayInvoice.invoice_code = this.invoiceCode;

    return this.makeAuthorizedRequest<QPayCreateInvoiceResponse>(
      `${this.host}/v2/invoice`,
      "post",
      qpayInvoice
    );
  }

  async getInvoice(id: string) {
    return this.makeAuthorizedRequest<QPayGetInvoiceResponse>(
      `${this.host}/v2/invoice/${id}`,
      "get"
    );
  }
}

export default QPay;

export * from "./types";
