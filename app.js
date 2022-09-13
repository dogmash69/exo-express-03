require("dotenv").config();

const express = require("express");

const app = express();

app.use(express.json()); 

const port = process.env.APP_PORT ?? 5000;

const welcome = (req, res) => {
  res.send("Welcome to my favourite movie list");
};

app.get("/", welcome);

const movieHandlers = require("./movieHandlers");
const getUser = require("./getUsers");
const { validateMovie, validateUser} = require("./validators");
const { hashPassword, verifyPassword, verifyToken } = require("./auth");
const userHandlers = require("./getUsers");


app.get("/api/movies", movieHandlers.getMovies);
app.get("/api/movies/:id", movieHandlers.getMovieById);
app.get("/api/users", getUser.getUser);
app.get("/api/users/:id", getUser.getUserById);
app.post("/api/users", validateUser, hashPassword, getUser.postUser);
app.post(
  "/api/login",
  userHandlers.getUserByEmailWithPasswordAndPassToNext,
  verifyPassword
);

app.use(verifyToken);

app.post("/api/movies", validateMovie, movieHandlers.postMovie);
app.put("/api/movies/:id", validateMovie, movieHandlers.updateMovie);
app.put("/api/users/:id", validateUser, getUser.checkIdPayloadToken, getUser.updateUser);
app.delete("/api/movies/:id", movieHandlers.delMovie);
app.delete("/api/users/:id", getUser.checkIdPayloadToken, getUser.delUser);


app.listen(port, (err) => {
  if (err) {
    console.error("Something bad happened");
  } else {
    console.log(`Server is listening on ${port}`);
  }
});
