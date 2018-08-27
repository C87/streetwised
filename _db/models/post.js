const mongoose = require('mongoose');
// -----------------------------------------------------------------------------
// -----------------------------------------------------------------------------
const Schema = mongoose.Schema;

const postSchema = new Schema({
  type: {
    type: String,
    enum: ['Feature'],
    required: true,
  },
  geometry: {
    type: {
      type: String,
      enum: ['Point'],
      required: true,
    },
    coordinates: {
      type: [Number],
      required: true,
    },
  },
  properties: {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    text: {
      type: String,
      required: true,
    },
    tag: {
      type: String,
      required: false,
    },
    location: {
      type: String,
      required: true,
    },
    created: {
      type: Date,
      default: Date.now,
    },
    comments: [{
      user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
      },
      text: {
        type: String,
        required: true,
      },
      created: {
        type: Date,
        default: Date.now,
      },
      upvotes: [{
        user: {
          type: Schema.Types.ObjectId,
          ref: 'User',
          required: true,
        },
        created: {
          type: Date,
          default: Date.now,
        },
      }],
    }],
  },
});

const Post = mongoose.model('Post', postSchema);
