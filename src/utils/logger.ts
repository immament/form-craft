import { Logger, type ILogObj, type ISettingsParam } from "tslog";

export const logger = new Logger<ILogObj>({
  name: "FormCraft",
  type: "pretty",
  hideLogPositionForProduction: true,
  prettyLogTemplate: "{{hh}}:{{mm}}:{{ss}} {{logLevelName}} {{name}} ",

  // Set minimum level (0: silly, 1: trace, 2: debug, 3: info, 4: warn, 5: error, 6: fatal)
  minLevel: 2,

  overwrite: {
    transportFormatted: (logMetaMarkup, logArgs, logErrors, logMeta) => {
      // Send different log levels to appropriate console methods
      const logLevel =
        logMeta?.logLevelName ?? logMetaMarkup.trim().split("\t")[1];
      switch (logLevel) {
        case "WARN":
          console.warn(logMetaMarkup, ...logArgs, ...logErrors);
          break;
        case "ERROR":
        case "FATAL":
          console.error(logMetaMarkup, ...logArgs, ...logErrors);
          break;
        case "INFO":
          console.info(logMetaMarkup, ...logArgs, ...logErrors);
          break;
        case "DEBUG":
        case "TRACE":
        case "SILLY":
        default:
          console.log(logMetaMarkup, ...logArgs, ...logErrors);
          break;
      }
    },
  },
});

export function getSubLogger(
  settings?: ISettingsParam<ILogObj>,
  logObj?: ILogObj,
) {
  return logger.getSubLogger(settings, logObj);
}
