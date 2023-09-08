var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");

//my imports
const db_initializer = require("./db/connection");
const routes = require("./src/routes");

const port = process.env.BACKEND_PORT;

//initialize express app
var app = express();
app.listen(port, () => {
  console.log(`Sysmart listening on port ${port}`);
});
//connecting database
db_initializer();

//initializing routes

routes(app);

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;
