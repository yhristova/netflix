import express from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { User } from "./database.js";
import { Movie } from "./database.js";

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
const port = 4000;
const SECRET = "my-secret";

const extractBearerToken = (headerValue) => {
  if (typeof headerValue !== "string") {
    false;
  }
  const matches = headerValue.match(/(bearer)\s+(\S+)/i);

  return matches[0] && matches[2];
};

const checkTokenMiddleware = (req, res, next) => {
  const token =
    req.headers.authorization && extractBearerToken(req.headers.authorization);

  if (!token) {
    return res.status(401).json({ msg: "need a token" });
  }

  jwt.verify(token, SECRET, (err, decodedToken) => {
    if (err) {
      return res.status(401).json({ message: "bad token" });
    }
  });
  next();
};

app.get("/movies", async (req, res) => {
  try {
    const movies = await Movie.findAll();
    res.send(movies);
  } catch (err) {
    console.log(err);
    res.send("Error");
  }
});

app.post("/movies", async (req, res) => {
  const data = req.body;
  try {
    const movie = await Movie.create({
      movie_name: data.movie_name,
      movie_src: data.movie_src,
    });
    res.status(201);
    res.send(movie);
  } catch (err) {
    console.log(err);

    res.send("Error");
  }
});

app.delete("/movies/:id", async (req, res) => {
  try {
    const isDeleted = await Movie.destroy({
      where: {
        id: req.params.id,
      },
    });
    if (isDeleted) {
      return res.status(200).send("Movie is deleted");
    } else res.status(404);
    res.send("Bad id");
  } catch (err) {
    console.log(err);
    res.send("Error");
  }
});

app.get("/movies/:id", async (req, res) => {
  try {
    const movie = await Movie.findOne({
      where: {
        id: req.params.id,
      },
    });
    if (!movie) {
      return res.status(404).send("Movie not found");
    }
    return res.send(movie);
  } catch (err) {
    console.log(err);
    res.send("Error");
  }
});

app.post("/register", async (req, res) => {
  const data = req.body;
  const salt = await bcrypt.genSalt();
  const hashedPassword = await bcrypt.hash(data.password, salt);
  try {
    const newUser = await User.create({
      username: data.username,
      password: hashedPassword,
    });
    res.status(201);
    res.send(newUser);
  } catch (err) {
    console.log(err);
    res.send("Error");
  }
});

app.post("/login", async (req, res) => {
  const username = req.body.username;
  const password = req.body.password;
  const salt = await bcrypt.genSalt();
  const hashedPassword = await bcrypt.hash(password, salt);

  try {
    const user = await User.findOne({ username });
    if (!user) {
      res.status(400).json({ msg: "User not exist" });
    }
    bcrypt.compare(password, hashedPassword, (err, data) => {
      if (data) {
        const token = jwt.sign(
          {
            sub: user.id,
            username: user.username,
          },
          SECRET,
          { expiresIn: "3 hours" }
        );
        return res.json({ access_token: token });
      }

      res.status(401).json({ msg: "Invalid credentials" });
    });
  } catch (err) {
    console.log(err);
    res.send("Error");
  }
});

app.get("/me", checkTokenMiddleware, (req, res) => {
  const token =
    req.headers.authorization && extractBearerToken(req.headers.authorization);

  try {
    const decoded = jwt.decode(token, { complete: false });
    res.json({ content: decoded });
  } catch (err) {
    console.log(err);
    res.send("Error");
  }
});

app.get("*", (req, res) => {
  res.status(404).json({ msg: "page not found" });
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
