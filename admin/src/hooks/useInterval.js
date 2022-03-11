import { useEffect, useState } from "react"

export function useInterval(handler, interval) {
    const [intervalId, setIntervalId] = useState(-1);

    useEffect(() => {
        setIntervalId(setInterval(handler, interval))

        return () => clearInterval(intervalId);

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [interval])
}