var gte = require("semver").gte;

var version = process.version;

if (gte(version, "8.0.0")) {
  module.exports = require("./nested__8.0.0__.fixture.js");
} else if (gte(version, "6.0.0")) {
  module.exports = require("./nested__6.0.0__.fixture.js");
} else if (gte(version, "4.0.0")) {
  module.exports = require("./nested__4.0.0__.fixture.js");
} else if (gte(version, "0.12.0")) {
  module.exports = require("./nested__0.12.0__.fixture.js");
} else {
  module.exports = require("./nested__0.10.0__.fixture.js");
}
