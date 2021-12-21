// Use CommonJS require below so we can dynamically import during build-time
var mode = process.env.REACT_APP_MODE;
if (mode === "demo") {
    module.exports = require("./api.demo");
} else {
    module.exports = require("./api.firebase");
}