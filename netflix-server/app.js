import express from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { User } from "./database.js";
import { Movie } from "./database.js";

export const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
const port = 4000;
const SECRET = "my-secret";

export const extractBearerToken = (headerValue) => {
  if (typeof headerValue !== "string") {
    return false;
  }
  const matches = headerValue.match(/(bearer)\s+(\S+)/i);
  return matches && matches[2];
};

export const checkTokenMiddleware = (req, res, next) => {
  const token =
    req.headers.authorization && extractBearerToken(req.headers.authorization);

  if (!token) {
    return res.status(401).json({ msg: "need a token" });
  }

  jwt.verify(token, SECRET, (err, decodedToken) => {
    if (err) {
      return res.status(401).json({ msg: "bad token" });
    }
  });
  next();
};

export const createToken = (data) => {
  const options = { expiresIn: "1h" };
  return jwt.sign(data, SECRET, options);
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
  try {
    const user = await User.findOne({
      where: {
        username: req.body.username,
      },
    });
    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }
    const passwordValid = bcrypt.compare(
      req.body.password,
      user.password,
      (err, data) => {
        if (err) {
          return res.status(400).json({ msg: "Error" });
        }
        if (!data) {
          return res.status(401).json({ msg: "Incorrect password" });
        }

        return res.status(200).json({
          token: createToken({ id: user.id, username: user.username }),
        });
      }
    );
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

// app.listen(port, () => {
//   console.log(`Example app listening on port ${port}`);
// });
