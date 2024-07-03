import express from "express";
import cors from "cors";
import { connectToDb } from "./database/config.js";
import { Movies } from "./model/Movies.js";

const app = express();

app.use(cors());

app.use(express.json());


(async () => await connectToDb())();

app.get("/",(req,res)=>{
  res.json("Hello");
})

app.get("/movies-list", async (req, res) => {
  try {
    const moviesList = await Movies.find();
    res.status(200).json(moviesList);
  } catch (e) {
    console.error(e);
    res.status(400).json({ message: error.message });
  }
});

app.get("/movies-list/:id", async (req, res) => {
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
});

app.post("/add-movie", async (req, res) => {
  const movieData = req.body;
  try {
    const newMovie = new Movies(movieData);
    await newMovie.save();
    res.status(201).json(newMovie);
  } catch (e) {
    console.error(e);
    res.status(400).json({ message: e.message });
  }
});

app.put("/edit-movie/:id", async (req, res) => {
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
});

app.delete("/delete-movie/:id", async (req, res) => {
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
});

app.post("/movies-list/:id/add-review", async (req, res) => {
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
});

app.post("/movies-list/:id/add-rating", async (req, res) => {
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
});

app.put("/movies-list/:id/toggle-watched", async (req, res) => {
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
});

// app.listen(8080, () => {
//   console.log("Listening to port - 8080");
// });
