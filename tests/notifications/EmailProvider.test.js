import { EmailProvider } from "../../src/services/notifications/providers/EmailProvider.js";
import { jest } from '@jest/globals';

describe("EmailProvider", () => {
  let provider;

  beforeEach(() => {
    // Set env vars before instantiation
    process.env.RESEND_API_KEY = "test_key";
    process.env.RESEND_FROM = "Captus <test@captus.app>";
    provider = new EmailProvider();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it("Debe enviar un email correctamente", async () => {
    global.fetch = jest.fn(() =>
      Promise.resolve({ ok: true, json: () => ({ id: "sent" }) })
    );

    const result = await provider.sendEmail({
      to: "user@test.com",
      subject: "Prueba",
      html: "<p>Hola!</p>",
    });

    expect(result.success).toBe(true);
    expect(fetch).toHaveBeenCalled();
  });

  it("Debe manejar errores en el envío", async () => {
    global.fetch = jest.fn(() =>
      Promise.resolve({ ok: false, json: () => ({ message: "error resend" }) })
    );

    const result = await provider.sendEmail({
        to: "user@test.com",
        subject: "Prueba",
        html: "<p>Hola!</p>",
      });

      expect(result.success).toBe(false);
  });
});
