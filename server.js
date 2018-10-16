const express = require("express");
const mongoose = require("mongoose");

const keys = require("./config/keys");

const users = require("./routes/api/users");
const profile = require("./routes/api/profile");
const posts = require("./routes/api/posts");

const app = express();

// DB Config
const db = keys.mongoURI;

// Connect to database
mongoose
  .connect(
    db,
    { useNewUrlParser: true }
  )
  .then(() => console.log("MongoDB Connected"))
  .catch(error => console.log(error));

// Use Routes
app.use("/api/users", users);
app.use("/api/profile", profile);
app.use("/api/posts", posts);

const port = process.env.PORT || 5000;

app.listen(port, () => console.log(`Server running on port ${port}`));

app.get("/", (req, res, next) => {
  res.send("Hello");
});
