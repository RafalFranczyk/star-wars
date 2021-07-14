/* eslint-disable prettier/prettier */
import * as mongoose from 'mongoose';

export const StarWarCharacterSchema = new mongoose.Schema({
  name: {
    type: String,
    unique: true,
    required: true,
    minlength: 3,
    maxlength: 50,
  },
  episodes: [
    {
      type: String,
      required: true,
    },
  ],
  planet: {
    type: String,
    required: false,
    default: null,
  },
});
