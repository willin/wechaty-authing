export class WechatyAuthingError extends Error {
  constructor(message: string) {
    super(`[wechaty-authing]: ${message}`);
  }
}
