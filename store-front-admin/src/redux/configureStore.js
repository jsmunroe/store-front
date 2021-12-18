// Use CommonJS require below so we can dynamically import during build-time
var environment = process.env.NODE_ENV;
if (environment === "development") {
    module.exports = require("./configureStore.dev");
} else {
    module.exports = require("./configureStore.prod");
}