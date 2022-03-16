import { useEffect } from "react";

export default function useBinding({eventName, onFire}) {
    useEffect(() => {
        const setup = () => {
            document.addEventListener(eventName, onFire);

            return () => {
                document.removeEventListener(eventName, onFire);
            }
        }

        return setup;
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [eventName, !onFire])
}