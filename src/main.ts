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
class QPay {
  // API-ийн тохиргоо болон нэвтрэх мэдээлэл
  private static readonly host = "https://merchant.qpay.mn";
  private static readonly TWO_HOURS_IN_MS = 2 * 60 * 60 * 1000; // Константыг class түвшинд зарлах

  private username = "";
  private password = "";
  private invoiceCode = "";
  private tokenRefreshPromise: Promise<void> | null = null; // Token refresh давхцахаас сэргийлэх

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

  /**
   * Token response өгөгдлийг боловсруулж, class instance-д хадгална.
   */
  private handleTokenResponse(response: QPayTokenResponse): void {
    this.accessToken = response.access_token;
    this.refreshToken = response.refresh_token;

    // QPay API нь expires_in болон refresh_expires_in-г Unix timestamp-аар өгдөг
    // Timestamp нь секундээр байгаа тул миллисекунд руу хөрвүүлнэ
    this.expiresIn = new Date(response.expires_in * 1000);
    this.refreshExpiresIn = new Date(response.refresh_expires_in * 1000);
  }

  /**
   * QPay API-аас шинэ нэвтрэх токен авна.
   */
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

  /**
   * Refresh token ашиглан шинэ access token авна.
   */
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

  /**
   * Token-ий хүчинтэй эсэхийг шалгаж, шаардлагатай бол шинэчилнэ.
   * Олон дуудлага зэрэг орох үед давхцахаас сэргийлнэ.
   */
  private async checkAuth(): Promise<void> {
    // Хэрэв access token хүчинтэй бол шалгах шаардлагагүй
    if (!this.isAccessTokenExpired()) {
      return;
    }

    // Хэрэв өөр process token refresh хийж байвал түүнийг хүлээх
    if (this.tokenRefreshPromise) {
      await this.tokenRefreshPromise;
      return;
    }

    // Token refresh эхлүүлэх
    this.tokenRefreshPromise = (async () => {
      try {
        // Хэрэв refresh token хүчинтэй бол түүгээр шинэчилнэ
        if (!this.isRefreshTokenExpired()) {
          try {
            await this.refreshAuthToken();
          } catch (error) {
            // Refresh амжилтгүй бол шинээр нэвтрэх
            await this.generateAuthToken();
          }
        } else {
          // Refresh token дууссан бол шинээр нэвтрэх
          await this.generateAuthToken();
        }
      } finally {
        // Дууссаны дараа promise-ийг цэвэрлэх
        this.tokenRefreshPromise = null;
      }
    })();

    await this.tokenRefreshPromise;
  }

  /**
   * QPay API руу эрх бүхий HTTP хүсэлт илгээнэ.
   * @param endpointUrl - API-ийн endpoint (жишээ: "/v2/invoice")
   * @param method - HTTP method (get, post, put, delete)
   * @param data - Хүсэлтийн body (POST/PUT-д шаардлагатай)
   */
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

  /**
   * QPay системд шинэ нэхэмжлэх үүсгэнэ.
   * @param qpayInvoice - Үүсгэх нэхэмжлэхийн мэдээлэл
   * @returns Үүсгэсэн нэхэмжлэхийн мэдээлэл
   */
  async createInvoice(qpayInvoice: QPayCreateInvoice) {
    // Өгөгдлийг мутацлахгүйн тулд хуулбар үүсгэх
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

  /**
   * Нэхэмжлэхийн ID-аар нэхэмжлэхийн мэдээлэл авна.
   * @param id - Нэхэмжлэхийн ID
   * @returns Нэхэмжлэхийн дэлгэрэнгүй мэдээлэл
   */
  async getInvoice(id: string) {
    return this.sendRequestWithAuth<QPayGetInvoiceResponse>(
      `/v2/invoice/${id}`,
      "get"
    );
  }
}

export default QPay;
export * from "./types";
