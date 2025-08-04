# QPay API Integration

QPay системийн API-д зориулсан TypeScript/JavaScript сан. Автомат токен менежмент, refresh token ашиглалт зэрэг боломжуудыг агуулсан.

## Онцлогууд

- ✅ **Автомат токен менежмент** - access token болон refresh token-г автоматаар удирдана
- ✅ **TypeScript дэмжлэг** - Бүрэн төрөл тодорхойлолттой
- ✅ **Axios суурьтай** - HTTP хүсэлтүүд болон хариунууд
- ✅ **Promise/async-await** - Орчин үеийн асинхрон программчлал

## API Coverage / Дэмжигдсэн функцүүд

Энэ сан нь QPay API-ийн дараах функцүүдийг дэмждэг:

### 🔐 Auth / Нэвтрэх (Эрх олгох)

- ✅ **Token / Токен үүсгэх** - Анхны нэвтрэх токен авах
- ✅ **Refresh / Токен шинэчлэх** - Хуучин токеноо шинэчлэх

### 📄 Invoice / Нэхэмжлэх удирдлага

- ✅ **Create Simple / Нэхэмжлэх үүсгэх** - Шинэ төлбөрийн нэхэмжлэх үүсгэх
- ✅ **Get / Нэхэмжлэх татах** - Нэхэмжлэхийн мэдээлэл, төлөв шалгах
- ❌ **Create / Нарийвчилсан нэхэмжлэх** - Барааны жагсаалттай нэхэмжлэх
- ❌ **Cancel / Нэхэмжлэх цуцлах** - Одоогоор дэмжигдэхгүй

### 💳 Payment / Төлбөр удирдлага (Ирээдүйд нэмэгдэх)

- ❌ **Get / Төлбөрийн мэдээлэл** - Төлбөрийн дэлгэрэнгүй мэдээлэл
- ❌ **List / Төлбөрийн жагсаалт** - Бүх төлбөрүүдийн жагсаалт
- ❌ **Check / Төлбөр шалгах** - Төлбөрийн төлөв шалгах
- ❌ **Cancel / Төлбөр цуцлах** - Төлбөр буцаах
- ❌ **Refund / Мөнгө буцаах** - Төлсөн мөнгө буцаах

### 🧾 EBarimt / Цахим баримт (Ирээдүйд нэмэгдэх)

- ❌ **Create / Баримт үүсгэх** - Цахим баримт үүсгэх
- ❌ **Cancel / Баримт цуцлах** - Цахим баримт цуцлах

**Тэмдэглэл:**

- ✅ = Одоо ашиглах боломжтой
- ❌ = Одоогоор дэмжигдэхгүй, ирээдүйд нэмэгдэнэ

## Суулгах

```bash
npm install qpay
```

## Тохиргоо

QPay API-г ашиглахын тулд эхлээд QPay класын шинэ instance үүсгэх шаардлагатай.

```typescript
import QPay from "qpay";

const qpay = new QPay({
  username: "EXAMPLE",
  password: "eXaMPlE",
  invoice_code: "EXAMPLE_INVOICE",
});
```

**Аюулгүй байдал:** Хэрэглэгчийн нэр, нууц үг зэрэг мэдээллийг кодонд шууд бичихээс зайлсхийж, environment variables ашиглана уу:

```typescript
import QPay from "qpay";

const qpay = new QPay({
  username: process.env.QPAY_USERNAME!,
  password: process.env.QPAY_PASSWORD!,
  invoice_code: process.env.QPAY_INVOICE_CODE!,
});
```

## Токен менежмент

Энэ сан нь токен менежментийг автоматаар хийдэг:

- **Access token** автоматаар үүсгэгдэж, хүчинтэй хугацаа шалгагдана
- **Refresh token** ашиглан access token-г шинэчилнэ
- Token дууссан үед автоматаар шинэ токен үүсгэнэ
- Алдаа гарсан үед refresh token-оор дахин оролдоно

Токен менежментийг гараар хийх шаардлагагүй - сан автоматаар удирдана.

## Нэхэмжлэх үүсгэх

Нэхэмжлэх үүсгэхийн тулд `createInvoice` функцийг ашиглана. Энэ функц нь нэхэмжлэхийн мэдээллийг агуулсан объект хүлээн авч, үүсгэсэн нэхэмжлэхийн хариуг буцаана.

```typescript
import QPay from "qpay";

const qpay = new QPay({
  username: process.env.QPAY_USERNAME!,
  password: process.env.QPAY_PASSWORD!,
  invoice_code: process.env.QPAY_INVOICE_CODE!,
});

try {
  const invoiceResponse = await qpay.createInvoice({
    amount: 500,
    callback_url: "https://your-website.com/callback",
    invoice_description: "Бүтээгдэхүүний төлбөр",
    invoice_receiver_code: "12345678",
    sender_invoice_no: "ORDER_001",
  });

  console.log("Нэхэмжлэх амжилттай үүслээ:");
  console.log("Invoice ID:", invoiceResponse.data.invoice_id);
  console.log("QR code:", invoiceResponse.data.qr_text);
  console.log("Deep links:", invoiceResponse.data.qpay_urls);
} catch (error) {
  console.error("Нэхэмжлэх үүсгэхэд алдаа гарлаа:", error);
}
```

### Нэхэмжлэхийн параметрүүд

- `amount`: Төлбөрийн дүн (заавал)
- `callback_url`: Төлбөр хийгдсэний дараа буцах URL (заавал)
- `invoice_description`: Нэхэмжлэхийн тайлбар (заавал)
- `invoice_receiver_code`: Хүлээн авагчийн код (заавал)
- `sender_invoice_no`: Таны системийн нэхэмжлэхийн дугаар (заавал)

## Нэхэмжлэх татах

Нэхэмжлэх татахын тулд `getInvoice` функцийг ашиглана. Энэ функц нь нэхэмжлэхийн ID-гаар хайдаг, тухайн нэхэмжлэхийн мэдээллийг буцаана.

```typescript
import QPay from "qpay";

const qpay = new QPay({
  username: process.env.QPAY_USERNAME!,
  password: process.env.QPAY_PASSWORD!,
  invoice_code: process.env.QPAY_INVOICE_CODE!,
});

try {
  const invoiceId = "a79715cb-1129-470e-a005-310614799124";
  const invoice = await qpay.getInvoice(invoiceId);

  console.log("Нэхэмжлэхийн мэдээлэл:");
  console.log("Төлөв:", invoice.data.invoice_status);
  console.log("Дүн:", invoice.data.amount);
  console.log("Тайлбар:", invoice.data.invoice_description);

  if (invoice.data.invoice_status === "PAID") {
    console.log("Төлбөр хийгдсэн!");
  }
} catch (error) {
  console.error("Нэхэмжлэх татахад алдаа гарлаа:", error);
}
```

## Дотоод API функц - sendRequestWithAuth

`sendRequestWithAuth` нь QPay класын дотоод функц бөгөөд автомат токен менежментээр эрх бүхий HTTP хүсэлтүүдийг QPay API руу илгээдэг.

### Функцийн ажиллагаа:

1. **Токен шалгах**: Одоогийн access token хүчинтэй эсэхийг шалгана
2. **Токен шинэчлэх**: Хэрэв token дууссан бол refresh token ашиглан шинэчилнэ
3. **Шинэ токен үүсгэх**: Refresh token ч дууссан бол шинэ токен үүсгэнэ
4. **HTTP хүсэлт**: Authorization толгойтой хүсэлтийг илгээнэ

```typescript
// Дотоод ашиглалт - шууд ашиглах шаардлагагүй
async sendRequestWithAuth<T>(
  endpointUrl: string,
  method: "get" | "post" | "put" | "delete",
  data?: any
): Promise<AxiosResponse<T>>
```

### Уян хатан байдал ба өргөтгөх боломж

Энэ функц нь QPay API-ийн ирээдүйн endpoint-үүдийг дэмжих уян хатан байдлыг бүрдүүлдэг:

- **Ямар ч endpoint**: Бүх API endpoint-тэй ажиллана
- **Бүх HTTP арга**: GET, POST, PUT, DELETE методуудыг дэмждэг
- **Generic төрөл**: TypeScript-ийн `<T>` ашиглан ямар ч хариуны төрөлтэй ажиллана
- **Автомат эрх**: Токен менежментийг автоматаар хийдэг

### Хэрэглэгчийн өөрийн хандалт

Хэдийгээр энэ функц дотоод зориулалттай боловч, хэрэв QPay API-д шинэ endpoint нэмэгдвэл эсвэл танд тусгай хандалт хэрэгтэй бол энэ функцийг ашиглан өөрийн методуудыг нэмж болно:

```typescript
// Жишээ: Хэрэв QPay шинэ API нэмвэл
class ExtendedQPay extends QPay {
  // Жишээ: Гүйлгээний түүх татах (хэрэв ийм API байгаа бол)
  async getTransactionHistory(filters?: any) {
    return this.sendRequestWithAuth<TransactionHistoryResponse>(
      "/v2/transactions/history",
      "get",
      filters
    );
  }

  // Жишээ: Нэхэмжлэх цуцлах (хэрэв ийм API байгаа бол)
  async cancelInvoice(invoiceId: string) {
    return this.sendRequestWithAuth<CancelResponse>(
      `/v2/invoice/${invoiceId}/cancel`,
      "put"
    );
  }
}
```

## TypeScript дэмжлэг

Энэ сан нь бүрэн TypeScript дэмжлэгтэй. Бүх төрлүүд автоматаар импорт хийгдэнэ:

```typescript
import QPay, { QPayCreateInvoice, QPayCreateInvoiceResponse } from "qpay";

const qpay = new QPay({
  username: process.env.QPAY_USERNAME!,
  password: process.env.QPAY_PASSWORD!,
  invoice_code: process.env.QPAY_INVOICE_CODE!,
});

// TypeScript-д төрлүүд автоматаар танигдана
const invoiceData: QPayCreateInvoice = {
  amount: 1000,
  callback_url: "https://example.com/callback",
  invoice_description: "Бүтээгдэхүүний төлбөр",
  invoice_receiver_code: "12345678",
  sender_invoice_no: "ORDER_002",
};

const response: QPayCreateInvoiceResponse = await qpay.createInvoice(
  invoiceData
);
```

## Анхаарах зүйлс

- **Аюулгүй байдал**: Хэрэглэгчийн нэр, нууц үг зэрэг мэдээллийг кодонд шууд бичихээс зайлсхийж, environment variables ашиглана уу.

- **Алдааны менежмент**: API хүсэлт алдааг зохих ёсоор барьж, хэрэглэгчдэд ойлгомжтой мэдээлэл өгөх нь чухал.

- **Токен менежмент**: Сан автоматаар токен удирддаг тул гараар токен үүсгэх шаардлагагүй.

- **Rate limiting**: QPay API-д хязгаарлалт байж болохыг анхаарна уу.

- **Callback URL**: Production орчинд HTTPS ашиглаж, callback URL-г зөв тохируулна уу.
