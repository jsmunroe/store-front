import { useState } from "react";
import useChange from "./useChange";

export default function useFetch(fetch, ready=true) {
    if (typeof fetch !== 'function') {
        throw new Error('useFetch requires an asynchronous function that fetches data.');
    }

    const [data, setData] = useState();
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState();

    useChange(() => {
        if (ready) {
            fetch()
                .then(data => {
                    setData(data)
                })
                .catch(error => {
                    setError(error);
                })
                .then(() => {
                    setIsLoading(false);
                })
        }
            
    }, [ready])

    return {data, isLoading, error}
}