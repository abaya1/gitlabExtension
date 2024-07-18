import { DEBUG_MODE } from "../../shared/constants";

class Logger {
    private static readonly DEBUG_MODE = DEBUG_MODE;

    public static debug(message: string, ...optionalParams: any[]): void {
        if (Logger.DEBUG_MODE) {
            console.debug(message, ...optionalParams);

        }
    }

    public static info(message: string, ...optionalParams: any[]): void {
        if (Logger.DEBUG_MODE) {
            console.info(message, ...optionalParams);
        }
    }

    public static warn(message: string, ...optionalParams: any[]): void {
        if (Logger.DEBUG_MODE) {
            console.warn(message, ...optionalParams);
        }
    }

    public static error(message: string, ...optionalParams: any[]): void {
        console.error(message, ...optionalParams);
    }
}

export { Logger as log };
