const isTesting = process.env.JEST_WORKER_ID !== undefined;
const inProduction = process.env.NODE_ENV === 'production'

export default function debug(message, ...params) {
    return !inProduction && !isTesting && console.log(message, ...params);
} 