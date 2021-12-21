import { toFriendlyError } from "../config/friendlyErrors";

const isDev = process.env.NODE_ENV !== "production";

export function error(error, forDev = true) {
    if (error instanceof Error) {
        // Log error with stack trace in development.
        if (isDev) {
            console.error(error); 
        }
        else { // Log error message only in production unless not forDev.
            if (!forDev) {
                console.error(error.message); // Only show error message in production.
            }
        }

        return toFriendlyError(error.message);
    }

    // Log error as string in developement or if forDev.
    if (isDev || !forDev) {
        console.error(error); 
    }

    return toFriendlyError(error);
}