import express from "express";
import bodyParser from "body-parser";

import { Movie } from "./database.js";

const app = express();
const port = 4000;
var jsonParser = bodyParser.json();

app.get("/", async (req, res) => {
  const movie = await Movie.findAll();
  res.send(movie);
});

app.post("/", jsonParser, async (req, res) => {
  const data = req.body;

  try {
    const movie = await Movie.create({
      movie_name: data.movie_name,
      movie_src: data.movie_src,
    });
    res.send(movie);
  } catch (err) {
    console.log(err);
    res.send("Bad data");
  }
});

app.delete("/:id", async (req, res) => {
  try {
    const isDeleted = await Movie.destroy({
      where: {
        id: req.params.id,
      },
    });
    if (isDeleted) {
      return res.send();
    }

    res.status(404);
    res.send("Bad id");
  } catch (err) {
    console.log(err);
    res.send("Bad data");
  }
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
