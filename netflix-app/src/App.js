import "./App.css";
import { Movie } from "./Movie.js";
import React, { useState } from "react";

const initMovies = [
  {
    url: "https://media.wired.co.uk/photos/606db6fc938ecee6e930f5fa/master/w_1600,c_limit/mr-robot-season-2-poster.jpg",
    alt: "Mr.Robot1",
  },
  {
    url: "https://media.wired.co.uk/photos/606db6fc938ecee6e930f5fa/master/w_1600,c_limit/mr-robot-season-2-poster.jpg",
    alt: "Mrs.Robot2",
  },
  {
    url: "https://media.wired.co.uk/photos/606db6fc938ecee6e930f5fa/master/w_1600,c_limit/mr-robot-season-2-poster.jpg",
    alt: "Mrs.Robot3",
  },
  {
    url: "https://media.wired.co.uk/photos/606db6fc938ecee6e930f5fa/master/w_1600,c_limit/mr-robot-season-2-poster.jpg",
    alt: "Mrs.Robot4",
  },
  {
    url: "https://media.wired.co.uk/photos/606db6fc938ecee6e930f5fa/master/w_1600,c_limit/mr-robot-season-2-poster.jpg",
    alt: "Mrs.Robot5",
  },
  {
    url: "https://media.wired.co.uk/photos/606db6fc938ecee6e930f5fa/master/w_1600,c_limit/mr-robot-season-2-poster.jpg",
    alt: "Mrs.Robot6",
  },
  {
    url: "https://media.wired.co.uk/photos/606db6fc938ecee6e930f5fa/master/w_1600,c_limit/mr-robot-season-2-poster.jpg",
    alt: "Mrs.Robot7",
  },
  {
    url: "https://media.wired.co.uk/photos/606db6fc938ecee6e930f5fa/master/w_1600,c_limit/mr-robot-season-2-poster.jpg",
    alt: "Mrs.Robot8",
  },
  {
    url: "https://media.wired.co.uk/photos/606db6fc938ecee6e930f5fa/master/w_1600,c_limit/mr-robot-season-2-poster.jpg",
    alt: "Mrs.Robot9",
  },
];

const App = () => {
  const [movies, setMovies] = useState(initMovies);

  return (
    <div className="layout">
      {movies.map((movie) => (
        <Movie url={movie.url} alt={movie.alt} />
      ))}
    </div>
  );
};

export default App;
