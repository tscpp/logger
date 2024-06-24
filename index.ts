import { Chalk, supportsColor } from "chalk";
import inspect from "object-inspect";

export enum LogLevel {
  Silent = 0,
  Error,
  Warning,
  Info,
  Verbose,
  Debug,
}

export interface Log {
  text: string;
  level: LogLevel;
}

export class Logger {
  #callbacks = new Set<(log: Log) => void>();

  onLog(listener: (log: Log) => void, filter?: LogLevel) {
    const callback = (log: Log) => {
      if (filter && log.level > filter) {
        return;
      }
      listener(log);
    };

    this.#callbacks.add(callback);
    return () => {
      this.#callbacks.delete(callback);
    };
  }

  #write(log: Log) {
    for (const callback of this.#callbacks) {
      callback(log);
    }
  }

  debug(...data: unknown[]) {
    return this.#write({ text: format(data), level: LogLevel.Debug });
  }

  verbose(...data: unknown[]) {
    return this.#write({ text: format(data), level: LogLevel.Verbose });
  }

  info(text: string) {
    return this.#write({ text, level: LogLevel.Info });
  }

  warn(text: string) {
    return this.#write({ text, level: LogLevel.Warning });
  }

  error(text: string) {
    return this.#write({ text, level: LogLevel.Error });
  }

  fatal(text: string): never {
    this.error(text);
    throw new Error(text);
  }
}

function format(data: unknown[]) {
  return data
    .map((object) => (typeof object === "string" ? object : inspect(object)))
    .join(" ");
}

export const logger = new Logger();

export interface FormatLogOptions {
  colorize?: boolean;
}

export function formatLog(log: Log, options?: FormatLogOptions) {
  const colorize = options?.colorize ?? true;

  const chalk = new Chalk({
    level: colorize && supportsColor ? supportsColor.level : 0,
  });

  let text = log.text;

  switch (log.level) {
    case LogLevel.Debug:
      text = chalk.dim("[DBUG] " + text);
      break;

    case LogLevel.Verbose:
      text = chalk.dim("[VERB] " + text);
      break;

    case LogLevel.Info:
      text = chalk.blue("[INFO] ") + text;
      break;

    case LogLevel.Warning:
      text = chalk.yellow("[WARN] ") + text;
      break;

    case LogLevel.Error:
      text = chalk.red("[ERR!] ") + text;
      break;
  }

  return {
    ...log,
    text,
  };
}

export function printLog(log: Log) {
  const method = log.level >= LogLevel.Warning ? "error" : "log";
  console[method](log.text);
}
