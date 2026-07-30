import type { Logger } from "../../domain/ports/logger.js";

/**
 * Structured JSON-line logger to stdout. No external dependency for now —
 * swap for a richer adapter (pino, etc.) later without touching anything
 * that depends on the Logger port.
 */
export class ConsoleLogger implements Logger {
  info(message: string, meta?: Record<string, unknown>): void {
    this.write("info", message, meta);
  }

  warn(message: string, meta?: Record<string, unknown>): void {
    this.write("warn", message, meta);
  }

  error(message: string, meta?: Record<string, unknown>): void {
    this.write("error", message, meta);
  }

  debug(message: string, meta?: Record<string, unknown>): void {
    this.write("debug", message, meta);
  }

  private write(level: string, message: string, meta?: Record<string, unknown>): void {
    console.log(JSON.stringify({ level, message, time: new Date().toISOString(), ...meta }));
  }
}
