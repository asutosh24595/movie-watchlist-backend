import express from "express";
import { connectToDb } from "./src/database/config.js";
import { Movies } from "./src/model/Movies.js";

const app = express();

const allowCors = fn => async (req, res) => {
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', 'https://movie-watchlist-frontend-sepia.vercel.app');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }
  return await fn(req, res);
};

app.use(express.json());

(async () => await connectToDb())();

const handler = (req, res) => {
  const d = new Date();
  res.end(d.toString());
};

app.get("/", allowCors(handler));

app.get("/movies-list", allowCors(async (req, res) => {
  try {
    const moviesList = await Movies.find();
    res.status(200).json(moviesList);
  } catch (e) {
    console.error(e);
    res.status(400).json({ message: e.message });
  }
}));

app.get("/movies-list/:id", allowCors(async (req, res) => {
  const id = req.params.id;
  try {
    const movie = await Movies.findById(id);
    if (!movie) {
      return res.status(404).json({ message: "Movie not found" });
    }
    res.status(200).json(movie);
  } catch (e) {
    console.error(e);
    res.status(400).json({ message: e.message });
  }
}));

app.post("/add-movie", allowCors(async (req, res) => {
  const movieData = req.body;
  try {
    const newMovie = new Movies(movieData);
    await newMovie.save();
    res.status(201).json(newMovie);
  } catch (e) {
    console.error(e);
    res.status(400).json({ message: e.message });
  }
}));

app.put("/edit-movie/:id", allowCors(async (req, res) => {
  const id = req.params.id;
  const updatedMovieData = req.body;
  try {
    const updatedMovie = await Movies.findByIdAndUpdate(id, updatedMovieData, {
      new: true,
    });

    if (!updatedMovie) {
      return res.status(404).json({ message: "Movie not found" });
    }

    res.status(200).json(updatedMovie);
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: e.message });
  }
}));

app.delete("/delete-movie/:id", allowCors(async (req, res) => {
  const id = req.params.id;
  try {
    const deletedMovie = await Movies.findByIdAndDelete(id);

    if (!deletedMovie) {
      return res.status(404).json({ message: "Movie not found" });
    }

    res.status(200).json({ message: "Movie deleted successfully" });
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: e.message });
  }
}));

app.post("/movies-list/:id/add-review", allowCors(async (req, res) => {
  const { id } = req.params;
  const { review } = req.body;

  try {
    const updatedMovie = await Movies.findByIdAndUpdate(
      id,
      { review },
      { new: true }
    );

    if (!updatedMovie) {
      return res.status(404).json({ message: "Movie not found" });
    }

    res.status(200).json(updatedMovie);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
}));

app.post("/movies-list/:id/add-rating", allowCors(async (req, res) => {
  const  id  = req.params.id;
  const rating  = req.body.rating;
  console.log("Rating received in backend: ", rating);
  try {
    const updatedMovie = await Movies.findByIdAndUpdate(
      id,
      {rating} ,
      { new: true }
    );

    if (!updatedMovie) {
      return res.status(404).json({ message: "Movie not found" });
    }

    res.status(200).json(updatedMovie);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
}));

app.put("/movies-list/:id/toggle-watched", allowCors(async (req, res) => {
  const { id } = req.params;

  try {
    const movie = await Movies.findById(id);

    if (!movie) {
      return res.status(404).json({ message: "Movie not found" });
    }

    movie.isWatched = !movie.isWatched;
    await movie.save();

    res.status(200).json(movie);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
}));

// Export the app for Vercel
export default app;
