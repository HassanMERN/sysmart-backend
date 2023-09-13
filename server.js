var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
const cors = require("cors");
const http = require("http");
const socketIo = require("socket.io");

//my imports
const db_initializer = require("./db/connection");
const routes = require("./src/routes");

const port = process.env.BACKEND_PORT;

//initialize express app
var app = express();
const corsOptions = {
  origin: "http://localhost:3000",
  credentials: true, //access-control-allow-credentials:true
  optionSuccessStatus: 200,
};
app.use(cors(corsOptions));
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

const server = http.createServer(app);
const io = socketIo(server);

// Initialize an empty object to store connected clients.
const connectedClients = {};

io.on("connection", (socket) => {
  // Handle new socket connections here.
  console.log(`Socket connected: ${socket.id}`);

  // Listen for a custom event when a user sends a message.
  socket.on("message", ({ userId, message }) => {
    // Broadcast the message to the recipient (store owner).
    if (connectedClients[userId]) {
      connectedClients[userId].emit("message", message);
    }
  });

  // Handle disconnect event.
  socket.on("disconnect", () => {
    // Remove the socket from the connectedClients object.
    for (const [key, value] of Object.entries(connectedClients)) {
      if (value === socket) {
        delete connectedClients[key];
        break;
      }
    }
    console.log(`Socket disconnected: ${socket.id}`);
  });
});

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
