var gte = require("semver").gte;

var version = process.version;

if (gte(version, "8.0.0")) {
  module.exports = require("./client__8.0.0__.fixture.js");
} else if (gte(version, "6.0.0")) {
  module.exports = require("./client__6.0.0__.fixture.js");
} else if (gte(version, "4.0.0")) {
  module.exports = require("./client__4.0.0__.fixture.js");
} else if (gte(version, "0.12.0")) {
  module.exports = require("./client__0.12.0__.fixture.js");
} else {
  module.exports = require("./client__0.10.0__.fixture.js");
}
