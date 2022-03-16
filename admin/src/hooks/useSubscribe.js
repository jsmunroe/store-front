import uuid from "react-uuid";
import useChange from "./useChange";

const actions = {};


export function useSubscribe(name, onPublish) {
    useChange(() => {
        let action = actions[name];

        if (!action) {
            action = { name, subscriptions: [] };
            actions[name] = action;
        }

        const subscription = {
            key: uuid(),
            handler: onPublish
        }

        action.subscriptions.push(subscription);

        return () => {
            action.subscriptions = action.subscriptions.filter(s => s.id !== subscription.id);
        }
    }, [])
}

export function publish(name, payload) {
    const action = actions[name];

    if (action) {
        action.subscriptions.forEach(s => s.handler(payload));
    }
}