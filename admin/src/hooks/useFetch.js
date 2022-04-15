import { useState } from "react";
import uuid from "react-uuid";
import useChange from "./useChange";

export default function useFetch(fetch, dependencies = []) {
    if (typeof fetch !== 'function') {
        throw new Error('useFetch requires an asynchronous function that fetches data.');
    }
    const [token, setToken] = useState(uuid());
    const [data, setData] = useState();
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState();

    useChange(() => {
        fetch()
            .then(data => {
                setData(data)
            })
            .catch(error => {
                setError(error);
            })
            .then(() => {
                setIsLoading(false);
            });
    }, [...dependencies, token])

    const refresh = () => {
        setIsLoading(true);
        setToken(uuid());
        setData(null);
    }

    return {data, isLoading, error, refresh}
}