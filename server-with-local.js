import { createApp } from "./app.js";
import { MovieModel } from './models/in-memory/movie.js'

createApp({ movieModel: MovieModel })
