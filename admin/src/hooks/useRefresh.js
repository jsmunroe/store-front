import { useState } from "react";
import uuid from "react-uuid";

export default function useRefresh() {
    const [token, setToken] = useState(uuid());

    const refresh = () => setToken(uuid());

    return [refresh, token];
}