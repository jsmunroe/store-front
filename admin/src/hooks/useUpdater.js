import { useState } from "react";
import uuid from "react-uuid"

export default function useUpdater() {
    const [token, setToken] = useState(uuid());

    const update = () => setToken(uuid());

    return [token, update];
}