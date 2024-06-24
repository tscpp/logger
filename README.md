# @eliassko/logger

A simple isomorphic logger library.

## Installation

```sh
npm i @eliassko/logger
```

## Usage

Instantiate the logger for each project or library. By default, the logger does not print anything, which is useful when the library is used programmatically and should not pollute the standard output.

```ts
import { Logger } from "@eliassko/logger";

export const logger = new Logger();
```

To configure logging for command line or debugging purposes, set it up to format and log everything above a certain log level.

```ts
import { printLog, formatLog, LogLevel } from "@eliassko/logger";

// Print all logs above level "info" to the console.
logger.onLog((log) => printLog(formatLog(log)), LogLevel.Info);
```

The event dispatches the log object, allowing you to print logs however and wherever you want. This setup can be reused multiple times to print to multiple sources.

```ts
logger.onLog((log) => {
  // ...
});
```

Use the corresponding method for the severity of the log.

```ts
// [INFO] Did something.
logger.info("Did something.");

// [ERR!] Failed to do something!
logger.error("Failed to do something!");
```

## License

This project is licensed under the [MIT License](./LICENSE).

## Versioning

This project adheres to the [semantic versioning](https://semver.org/spec/v2.0.0.html) (semver) specification for versioning.
