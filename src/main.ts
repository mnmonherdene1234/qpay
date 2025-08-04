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
  private username = "";
  private password = "";
  private invoiceCode = "";
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

  isAccessTokenExpired(): boolean {
    if (!this.expiresIn) return true;
    return Date.now() > this.expiresIn.getTime();
  }

  isRefreshTokenExpired(): boolean {
    if (!this.refreshExpiresIn) return true;
    return Date.now() > this.refreshExpiresIn.getTime();
  }

  handleTokenResponse(response: QPayTokenResponse) {
    this.accessToken = response.access_token;
    this.expiresIn = new Date(response.expires_in * 1000);
    this.refreshToken = response.refresh_token;
    this.refreshExpiresIn = new Date(response.refresh_expires_in * 1000);
  }

  /**
   * QPay API-аас шинэ нэвтрэх токен авна.
   */
  async generateAuthToken() {
    // Хэрэглэгчийн нэр, нууц үгийг ашиглан Basic Authentication толгой үүсгэнэ.
    const authHeader = `Basic ${Buffer.from(
      `${this.username}:${this.password}`
    ).toString("base64")}`;

    // Токен авах хүсэлтийг илгээнэ.
    const response = await axios.post<QPayTokenResponse>(
      `${QPay.host}/v2/auth/token`,
      undefined, // Токен авах хүсэлтэд бие шаардлагагүй.
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: authHeader,
        },
      }
    );

    if (
      response.status !== 200 ||
      !response.data ||
      !response.data.access_token
    ) {
      throw new Error("Токен үүсгэх амжилтгүй боллоо. Хариу буруу байна.");
    }

    this.handleTokenResponse(response.data);
  }

  /**
   * Refresh token ашиглан шинэ access token авна.
   */
  async refreshAuthToken() {
    // Хүсэлтийн тохиргоог бэлтгэнэ.
    const config: AxiosRequestConfig = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${this.refreshToken}`,
      },
    };

    const response = await axios.post<QPayTokenResponse>(
      `${QPay.host}/v2/auth/refresh`,
      undefined,
      config
    );

    if (
      response.status !== 200 ||
      !response.data ||
      !response.data.access_token
    ) {
      throw new Error("Токен шинэчлэлт амжилтгүй боллоо. Хариу буруу байна.");
    }

    this.handleTokenResponse(response.data);
  }

  async checkAuth() {
    // Хэрэв access token хүчинтэй бол ямар ч үйлдэл хийхгүй.
    if (!this.isAccessTokenExpired()) {
      return;
    }

    // Хэрэв refresh token хүчинтэй бол шинэ токен авна.
    if (!this.isRefreshTokenExpired()) {
      try {
        await this.refreshAuthToken();
      } catch (error) {
        console.error(
          "Refresh token failed, generating new auth token.",
          error
        );
        this.generateAuthToken();
      }
      return;
    }

    // Хэрэв refresh token ч хүчинтэй биш бол шинэ токен авах шаардлагатай.
    await this.generateAuthToken();
  }

  /**
   * QPay API руу эрх бүхий HTTP хүсэлт илгээнэ.
   * Токен авах болон эрхийн толгойг автоматаар зохицуулна.
   * @param endpointUrl - API-ийн endpoint.
   * @param method - HTTP method (get, post, put, delete).
   * @param data - POST болон PUT хүсэлтүүдийн нэмэлт мэдээлэл.
   */
  async sendRequestWithAuth<T>(
    endpointUrl: string,
    method: "get" | "post" | "put" | "delete",
    data?: any
  ) {
    // Хүчинтэй токен байгаа эсэхийг шалгана.
    await this.checkAuth();

    // Хүсэлтийн тохиргоог бэлтгэнэ.
    const config: AxiosRequestConfig = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${this.accessToken}`,
      },
    };

    const fullUrl = QPay.host + endpointUrl;

    // HTTP аргын дагуу тохирох хүсэлтийг илгээнэ.
    switch (method) {
      case "get":
        return axios.get<T>(fullUrl, config);
      case "post":
        return axios.post<T>(fullUrl, data, config);
      case "put":
        return axios.put<T>(fullUrl, data, config);
      case "delete":
        return axios.delete<T>(fullUrl, config);
      default:
        throw new Error("Буруу HTTP арга өгөгдсөн байна.");
    }
  }

  /**
   * QPay системд шинэ нэхэмжлэх үүсгэнэ.
   * @param qpayInvoice - Үүсгэх нэхэмжлэхийн дэлгэрэнгүй мэдээлэл.
   */
  async createInvoice(qpayInvoice: QPayCreateInvoice) {
    // Нэхэмжлэхийн кодыг өгөгдөлд нэмнэ.
    qpayInvoice.invoice_code = this.invoiceCode;

    // Нэхэмжлэх үүсгэх хүсэлтийг илгээнэ.
    return this.sendRequestWithAuth<QPayCreateInvoiceResponse>(
      "/v2/invoice",
      "post",
      qpayInvoice
    );
  }

  /**
   * Нэхэмжлэхийн ID-аар нэхэмжлэхийн дэлгэрэнгүйг авна.
   * @param id - Нэхэмжлэхийн цорын ганц танигч.
   */
  async getInvoice(id: string) {
    // Нэхэмжлэхийн дэлгэрэнгүйг авах хүсэлтийг илгээнэ.
    return this.sendRequestWithAuth<QPayGetInvoiceResponse>(
      `/v2/invoice/${id}`,
      "get"
    );
  }
}

export default QPay;
export * from "./types";
