import { useState } from "react";

export default function useBusy() {
    const [isBusy, setIsBusy] = useState();

    const busyWhile = async (thingToDo) => {
        try {
            setIsBusy(true);
            await thingToDo();
        }
        finally {
            setIsBusy(false);
        }
    }

    return { isBusy, busyWhile, setIsBusy };
}