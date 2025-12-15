import { QPay } from "../../";
import { invoiceCode, password, username } from "../private";

const QPAY = new QPay({
  username,
  password,
  invoiceCode,
});

test("Access token", async () => {
  await QPAY.generateAuthToken();
  expect(QPAY.expiresIn).toBeInstanceOf(Date);
  expect(QPAY.expiresIn).not.toBeNull();
  expect(QPAY.expiresIn!.getTime()).toBeGreaterThan(new Date().getTime());
  console.log("Access token expires at:", QPAY.expiresIn?.toLocaleString());
  console.log(
    "Refresh token expires at:",
    QPAY.refreshExpiresIn?.toLocaleString()
  );

  expect(QPAY.isAccessTokenExpired()).toBe(false);

  const initialExpiresAt = QPAY.expiresIn?.getDate();
  await QPAY.generateAuthToken();
  const newExpiresAt = QPAY.expiresIn?.getDate();
  expect(newExpiresAt).toBe(initialExpiresAt);
}, 10000);

test("Refresh token", async () => {
  const initialRefreshToken = QPAY.refreshToken;
  await QPAY.refreshAuthToken();
  const newRefreshToken = QPAY.refreshToken;
  expect(newRefreshToken).not.toBe(initialRefreshToken);
}, 10000);
