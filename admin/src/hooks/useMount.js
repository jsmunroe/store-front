import { useEffect } from "react";

export default function useMount(mountHandler) {
    useEffect(() => {
        return mountHandler();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])
}