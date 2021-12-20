import { confirm as confirmBox } from "react-confirm-box";

export function times(count, callback) {
    return [...Array(count)].map(callback);
}

export async function confirm(message) {
    return await confirmBox(message, {
        classNames: {
            buttons: "btn"
        }
    })
}