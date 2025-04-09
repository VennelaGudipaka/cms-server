import mongoose from 'mongoose';

const blogSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  content: {
    type: String,
    required: true
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
  thumbnail: {
    type: String,
    trim: true,
    validate: {
      validator: function (v) {
        return /^(http|https):\/\/[^ "]+$/.test(v); // validate the image URL
      },
      message: (props) => `${props.value} is not a valid URL`,
    },
  }
}, {
  timestamps: true
});

export default mongoose.model('Blog', blogSchema); 