import { useEffect } from "react";
import { useState } from "react";

const appSettingPrefix = 'AppSetting';

// Serialize the given value as JSON.
const serialize = value => {
    return JSON.stringify({
        type: typeof value,
        value,
    });
}

// Deserialize a value from JSON.
const deserialize = json => {
    if (!json) {
        return null;
    }

    return JSON.parse(json).value;
}

export default function useSetting(name, initialValue) {
    const [value, setValue] = useState(initialValue);

    useEffect(() => {
        setValue(deserialize(localStorage.getItem(`${appSettingPrefix}.${name}`)));
    }, [name])

    const setSettingValue = value => {
        localStorage.setItem(`${appSettingPrefix}.${name}`, serialize(value));
        setValue(value);
    }

    return [value, setSettingValue];
}