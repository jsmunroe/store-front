const defaultMessage = 'An error has occured.';

export default function Error({message = defaultMessage, dev}) {
    return <p className="error">{message}</p>
}