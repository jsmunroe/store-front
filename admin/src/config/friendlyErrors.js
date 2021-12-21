const isDev = process.env.NODE_ENV !== "production";

const knownFriendlyErrors = [
    { regex: /auth\/wrong-password/, message: 'User name or password are incorrect.' },
    { regex: /Missing or insufficient permissions/, message: 'You do not have persmission to view this.' }
]

const defaultFriendlyError = 'An error has occurred.'

export function toFriendlyError(errorMessage, friendlyErrors = []) {
    const friendlyError = [...knownFriendlyErrors, ...friendlyErrors].find(e => e.regex.test(errorMessage));

    if (friendlyError) {
        return friendlyError.message;
    }

    if (isDev) {
        return errorMessage;
    }

    return defaultFriendlyError;
}