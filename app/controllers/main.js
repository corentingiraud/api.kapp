var adherents = require("./adherents.js");
var users = require("./users.js");

module.exports = (app) => {
  app.use("/api/adherents", adherents);
  app.use("/api/users", users);
}
