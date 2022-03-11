import { useEffect } from "react"

// useChange calls a handler when any element of the dependencies array is changed.
export default function useChange(handler, dependencies) {
    useEffect(() => {
        return handler();

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [...dependencies])
}