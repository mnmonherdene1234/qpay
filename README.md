# QPay API integration

QPay API-тай ажиллахдаа бүх HTTP хүсэлтүүдийг Axios ашиглан гүйцэтгэдэг бөгөөд хариу нь AxiosResponse төрөлтэй байдаг. Энэ нь хариуны өгөгдөл, статус код, толгой мэдээлэл зэрэг чухал мэдээллийг агуулдаг.

## Тохиргоо

QPay API-г ашиглахын тулд эхлээд өөрийн хэрэглэгчийн нэр, нууц үг, нэхэмжлэхийн кодыг тохируулах шаардлагатай.

```typescript
import QPay from "qpay";

QPay.setup({
  username: "EXAMPLE",
  password: "eXaMPlE",
  invoice_code: "EXAMPLE_INVOICE",
});
```

## Нэхэмжлэх үүсгэх

Нэхэмжлэх үүсгэхийн тулд createInvoice функцийг ашиглана. Энэ функц нь нэхэмжлэхийн мэдээллийг агуулсан объект хүлээн авч, үүсгэсэн нэхэмжлэхийн хариуг буцаана.

```typescript
import QPay from "qpay";

const qpay = QPay.getInstance();

const invoiceResponse = await qpay.createInvoice({
  amount: 500,
  callback_url: "https://order-paid-url.com",
  invoice_description: "Гүйлгээний утга",
  invoice_receiver_code: "12345678",
  sender_invoice_no: "34",
});
```

## Нэхэмжлэх татах

Нэхэмжлэх татахын тулд getInvoice функцийг ашиглана. Энэ функц нь нэхэмжлэхийн ID-гаар хайдаг, тухайн нэхэмжлэхийн мэдээллийг буцаана.

```typescript
import QPay from "qpay";

const qpay = QPay.getInstance();

try {
  const invoiceId = "a79715cb-1129-470e-a005-310614799124"; // Нэхэмжлэхийн ID
  const invoice = await qpay.getInvoice(invoiceId);
  console.log("Нэхэмжлэхийн дэлгэрэнгүй:", invoice.data);
} catch (error) {
  console.error("Нэхэмжлэх татахад алдаа гарлаа:", error);
}
```

## Анхаарах зүйлс

- Аюулгүй байдал: Хэрэглэгчийн нэр, нууц үг зэрэг мэдээллийг кодонд шууд бичихээс зайлсхийх, Environment variables ашиглахыг зөвлөж байна.

- Алдааны менежмент: API хүсэлт алдааг зохих ёсоор барьж, хэрэглэгчдэд ойлгомжтой мэдээлэл өгөх нь чухал.

Дэлгэрэнгүй мэдээлэл болон нэмэлт тохиргооны талаар QPay-ийн албан ёсны баримт бичигтэй танилцана уу: [developer.qpay.mn](https://developer.qpay.mn/)
