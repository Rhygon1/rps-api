// models/User.js
import mongoose from 'mongoose';

const GameSchema = new mongoose.Schema({
  user: String,
  games: String,
  lastPlayed: Date,
  auth: String
});

const Game = mongoose.models.Game ||  mongoose.model('Game', GameSchema);

export default Game