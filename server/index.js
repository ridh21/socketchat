const express = require("express");
const app = express();
const { users } = require("./lib/users");
const { listComments, createComment } = require("./lib/comments");
const http = require("http").Server(app);
const cors = require("cors");

const PORT = 4000;

app.use(cors(
  {
    origin: "http://localhost:5173",

  }
));
app.use(express.json());

app.get("/users", (req, res) => {
  res.json(users);
});

app.get("/comments", (req, res) => {
  const comments = listComments();
  res.json(comments);
});

// Replace our create comment handler
app.post("/comments", async (req, res) => {
  const comment = createComment(req.body);
  io.emit("new-comment", { comment });
  res.json(comment);
});

http.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});

// Add this to where your other requires are
const io = require("socket.io")(http, {
  cors: {
    origin: "http://localhost:5173",
  },
});

// Above our `app.get("/users")` handler
io.on("connection", (socket) => {
  console.log(`⚡: ${socket.id} user just connected!`);

  socket.on("disconnect", () => {
    console.log("🔥: A user disconnected");
  });
});
