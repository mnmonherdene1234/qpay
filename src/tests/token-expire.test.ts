import { QPAY } from "./qpay.test";

test("Access token", async () => {
  await QPAY.generateAuthToken();
  expect(QPAY.expiresIn).toBeInstanceOf(Date);
  expect(QPAY.expiresIn).not.toBeNull();
  expect(QPAY.expiresIn!.getTime()).toBeGreaterThan(new Date().getTime());

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
