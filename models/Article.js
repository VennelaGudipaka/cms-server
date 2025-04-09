import mongoose from 'mongoose';

const articleSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  introduction: {
    type: String,
    required: true,
    trim: true
  },
  body: {
    type: String,
    required: true
  },
  conclusion: {
    type: String,
    required: true,
    trim: true
  },
  references: {
    type: [String], // List of reference links
    validate: {
      validator: function (refs) {
        return refs.every((v) => /^(http|https):\/\/[^ "]+$/.test(v));
      },
      message: (props) => `${props.value} is not a valid reference URL`,
    },
  },
  thumbnail: {
    type: String,
    trim: true,
    validate: {
      validator: function (v) {
        return /^(http|https):\/\/[^ "]+$/.test(v);
      },
      message: (props) => `${props.value} is not a valid URL`,
    },
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Interest',
    required: true
  },
  tags: {
    type: [String], // Keywords related to the article
  }
}, {
  timestamps: true
});

export default mongoose.model('Article', articleSchema);