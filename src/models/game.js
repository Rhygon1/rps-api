// models/User.js
import mongoose from 'mongoose';

const GameSchema = new mongoose.Schema({
  user: String,
  games: String
});

const Game = mongoose.models.Game ||  mongoose.model('Game', GameSchema);

export default Game