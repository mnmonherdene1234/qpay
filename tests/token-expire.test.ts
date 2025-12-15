import { QPay } from "../src";

const username = process.env.QPAY_USERNAME;
const password = process.env.QPAY_PASSWORD;
const invoice_code = process.env.QPAY_INVOICE_CODE;

const hasCreds = Boolean(username && password && invoice_code);

const makeClient = () =>
  new QPay({
    username: username!,
    password: password!,
    invoice_code: invoice_code!,
  });

(hasCreds ? test : test.skip)(
  "Access token",
  async () => {
    const qpay = makeClient();

    await qpay.generateAuthToken();
    expect(qpay.expiresIn).toBeInstanceOf(Date);
    expect(qpay.expiresIn).not.toBeNull();
    expect(qpay.expiresIn!.getTime()).toBeGreaterThan(Date.now());

    expect(qpay.isAccessTokenExpired()).toBe(false);

    const initialExpiresAt = qpay.expiresIn?.getDate();
    await qpay.generateAuthToken();
    const newExpiresAt = qpay.expiresIn?.getDate();
    expect(newExpiresAt).toBe(initialExpiresAt);
  },
  30000
);

(hasCreds ? test : test.skip)(
  "Refresh token",
  async () => {
    const qpay = makeClient();

    const initialRefreshToken = qpay.refreshToken;
    await qpay.refreshAuthToken();
    const newRefreshToken = qpay.refreshToken;
    expect(newRefreshToken).not.toBe(initialRefreshToken);
  },
  30000
);
