import axios, { AxiosRequestConfig } from "axios";
import {
  QPayCreateInvoice,
  QPayCreateInvoiceResponse,
  QPayGetInvoiceResponse,
  QPayTokenResponse,
  Setup,
} from "./types";

/**
 * QPay class нь QPay API-тай харилцан.
 * Энэ нь нэвтрэх токен үүсгэх, шинэчлэх болон API хандалтын үйлдлүүдийг гүйцэтгэнэ.
 */
export class QPay {
  private static readonly host = "https://merchant.qpay.mn";
  private static readonly TWO_HOURS_IN_MS = 2 * 60 * 60 * 1000;

  private username = "";
  private password = "";
  private invoiceCode = "";
  private tokenRefreshPromise: Promise<void> | null = null;

  accessToken = "";
  refreshToken = "";
  expiresIn: Date | null = null;
  refreshExpiresIn: Date | null = null;

  /**
   * QPay класыг шинэ instance үүсгэнэ.
   * @param setup - Хэрэглэгчийн нэр, нууц үг, нэхэмжлэхийн кодыг агуулна.
   */
  constructor({ username, password, invoice_code }: Setup) {
    this.username = username;
    this.password = password;
    this.invoiceCode = invoice_code;
    this.generateAuthToken();
  }

  /**
   * Access token дуусах дөхсөн эсэхийг шалгана.
   * Token дуусахаас 2 цагийн өмнө дуусна гэж үзнэ.
   */
  isAccessTokenExpired(): boolean {
    if (!this.expiresIn) return true;
    return Date.now() > this.expiresIn.getTime() - QPay.TWO_HOURS_IN_MS;
  }

  /**
   * Refresh token дуусах дөхсөн эсэхийг шалгана.
   * Token дуусахаас 2 цагийн өмнө дуусна гэж үзнэ.
   */
  isRefreshTokenExpired(): boolean {
    if (!this.refreshExpiresIn) return true;
    return Date.now() > this.refreshExpiresIn.getTime() - QPay.TWO_HOURS_IN_MS;
  }

  private handleTokenResponse(response: QPayTokenResponse): void {
    this.accessToken = response.access_token;
    this.refreshToken = response.refresh_token;

    this.expiresIn = new Date(response.expires_in * 1000);
    this.refreshExpiresIn = new Date(response.refresh_expires_in * 1000);
  }

  async generateAuthToken(): Promise<void> {
    const authHeader = `Basic ${Buffer.from(
      `${this.username}:${this.password}`
    ).toString("base64")}`;

    const response = await axios.post<QPayTokenResponse>(
      `${QPay.host}/v2/auth/token`,
      undefined,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: authHeader,
        },
      }
    );

    this.handleTokenResponse(response.data);
  }

  async refreshAuthToken(): Promise<void> {
    const response = await axios.post<QPayTokenResponse>(
      `${QPay.host}/v2/auth/refresh`,
      undefined,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${this.refreshToken}`,
        },
      }
    );

    this.handleTokenResponse(response.data);
  }

  private async checkAuth(): Promise<void> {
    if (!this.isAccessTokenExpired()) {
      return;
    }

    if (this.tokenRefreshPromise) {
      await this.tokenRefreshPromise;
      return;
    }

    this.tokenRefreshPromise = (async () => {
      try {
        if (!this.isRefreshTokenExpired()) {
          try {
            await this.refreshAuthToken();
          } catch {
            await this.generateAuthToken();
          }
        } else {
          await this.generateAuthToken();
        }
      } finally {
        this.tokenRefreshPromise = null;
      }
    })();

    await this.tokenRefreshPromise;
  }

  private async sendRequestWithAuth<T>(
    endpointUrl: string,
    method: "get" | "post" | "put" | "delete",
    data?: any
  ) {
    await this.checkAuth();

    const config: AxiosRequestConfig = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${this.accessToken}`,
      },
    };

    const fullUrl = `${QPay.host}${endpointUrl}`;

    switch (method) {
      case "get":
        return axios.get<T>(fullUrl, config);
      case "post":
        return axios.post<T>(fullUrl, data, config);
      case "put":
        return axios.put<T>(fullUrl, data, config);
      case "delete":
        return axios.delete<T>(fullUrl, config);
    }
  }

  async createInvoice(qpayInvoice: QPayCreateInvoice) {
    const invoiceData = {
      ...qpayInvoice,
      invoice_code: this.invoiceCode,
    };

    return this.sendRequestWithAuth<QPayCreateInvoiceResponse>(
      "/v2/invoice",
      "post",
      invoiceData
    );
  }

  async getInvoice(id: string) {
    return this.sendRequestWithAuth<QPayGetInvoiceResponse>(
      `/v2/invoice/${id}`,
      "get"
    );
  }
}
