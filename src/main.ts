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
 * Энэ нь токен үүсгэх, нэхэмжлэх үүсгэх, нэхэмжлэхийн дэлгэрэнгүй мэдээлэл авах зэрэг үйлдлүүдийг хийнэ.
 */
class QPay {
  // Singleton загварыг хэрэгжүүлэхийн тулд хувийн constructor функц.
  private constructor() {}

  // QPay-ийн цорын ганц instance.
  private static instance: QPay;

  // API-ийн тохиргоо болон нэвтрэх мэдээлэл
  private readonly host = "https://merchant.qpay.mn";
  private accessToken = "";
  private username = "";
  private password = "";
  private invoiceCode = "";

  /**
   * QPay-ийн цорын ганц instance үүссэн эсэхийг шалгана.
   */
  private static ensureInstance() {
    if (!QPay.instance) {
      QPay.instance = new QPay();
    }
  }

  /**
   * QPay-ийн instance шаардлагатай нэвтрэх мэдээлэл болон нэхэмжлэхийн кодоор тохируулна.
   * @param setup - Хэрэглэгчийн нэр, нууц үг, нэхэмжлэхийн кодыг агуулна.
   */
  static setup({ username, password, invoice_code }: Setup) {
    this.ensureInstance();
    QPay.instance.username = username;
    QPay.instance.password = password;
    QPay.instance.invoiceCode = invoice_code;
  }

  /**
   * QPay-ийн instance буцаана.
   */
  static getInstance() {
    this.ensureInstance();
    return QPay.instance;
  }

  /**
   * QPay API-аас шинэ нэвтрэх токен авна.
   */
  private async fetchToken() {
    // Хэрэглэгчийн нэр, нууц үгийг ашиглан Basic Authentication толгой үүсгэнэ.
    const authHeader = `Basic ${Buffer.from(
      `${this.username}:${this.password}`
    ).toString("base64")}`;

    // Токен авах хүсэлтийг илгээнэ.
    const response = await axios.post<QPayTokenResponse>(
      `${this.host}/v2/auth/token`,
      undefined, // Токен авах хүсэлтэд бие шаардлагагүй.
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: authHeader,
        },
      }
    );

    // Авсан токеныг хадгална.
    this.accessToken = response.data.access_token;
  }

  /**
   * QPay API руу эрх бүхий HTTP хүсэлт илгээнэ.
   * Токен авах болон эрхийн толгойг автоматаар зохицуулна.
   * @param url - API-ийн URL.
   * @param method - HTTP method (get, post, put, delete).
   * @param data - POST болон PUT хүсэлтүүдийн нэмэлт мэдээлэл.
   */
  private async makeAuthorizedRequest<T>(
    url: string,
    method: "get" | "post" | "put" | "delete",
    data?: any
  ) {
    // Хүчинтэй токен байгаа эсэхийг шалгана.
    await this.fetchToken();

    // Хүсэлтийн тохиргоог бэлтгэнэ.
    const config: AxiosRequestConfig = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${this.accessToken}`,
      },
    };

    // HTTP аргын дагуу тохирох хүсэлтийг илгээнэ.
    switch (method) {
      case "get":
        return axios.get<T>(url, config);
      case "post":
        return axios.post<T>(url, data, config);
      case "put":
        return axios.put<T>(url, data, config);
      case "delete":
        return axios.delete<T>(url, config);
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
    return this.makeAuthorizedRequest<QPayCreateInvoiceResponse>(
      `${this.host}/v2/invoice`,
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
    return this.makeAuthorizedRequest<QPayGetInvoiceResponse>(
      `${this.host}/v2/invoice/${id}`,
      "get"
    );
  }
}

export default QPay;
export * from "./types";
