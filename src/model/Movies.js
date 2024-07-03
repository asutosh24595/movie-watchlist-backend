import mongoose from "mongoose";

const moviesSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  releaseYear: {
    type: Number,
  },
  genre: {
    type: String,
  },
  isWatched: {
    type: Boolean,
    default: false,
  },
  rating: {
    type:  Number,
  },
  review: {
    type: String,
  },
});

export const Movies = mongoose.model("Movies",moviesSchema);
