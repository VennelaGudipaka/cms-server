import Blog from '../models/Blog.js';
import User from '../models/User.js';
import Interest from '../models/Interest.js';
import { uploadToCloudinary } from '../config/cloudinary.js';

export const create = async (req, res) => {
  try {
    const { title, content, category, thumbnail } = req.body;
    
    // Verify that the category (interest) exists
    const interest = await Interest.findById(category);
    if (!interest) {
      return res.status(400).json({ message: 'Invalid category' });
    }

    // Handle thumbnail upload if it's base64
    let thumbnailUrl = thumbnail;
    if (thumbnail && thumbnail.startsWith('data:image')) {
      try {
        thumbnailUrl = await uploadToCloudinary(thumbnail);
      } catch (error) {
        return res.status(400).json({ message: 'Failed to upload thumbnail' });
      }
    }

    // Process content to upload any base64 images to Cloudinary
    let processedContent = content;
    const base64Regex = /data:image\/[^;]+;base64[^"]+/g;
    const base64Images = content.match(base64Regex) || [];
    
    for (const base64Image of base64Images) {
      try {
        const imageUrl = await uploadToCloudinary(base64Image);
        processedContent = processedContent.replace(base64Image, imageUrl);
      } catch (error) {
        console.error('Error uploading image:', error);
      }
    }

    const blog = new Blog({
      title,
      content: processedContent,
      category,
      thumbnail: thumbnailUrl,
      author: req.user._id
    });

    await blog.save();
    await blog.populate('author', 'username email');
    await blog.populate('category', 'name');

    res.status(201).json(blog);
  } catch (error) {
    res.status(500).json({ message: 'Error creating blog', error: error.message });
  }
};

export const getAllBlogs = async (req, res) => {
  try {
    const { search, category, userId } = req.query;
    let query = {};

    // Search by title or author
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { 'author.username': { $regex: search, $options: 'i' } }
      ];
    }

    // Filter by category
    if (category) {
      query.category = category;
    }

    // Filter by user
    if (userId) {
      query.author = userId;
    }

    const blogs = await Blog.find(query)
      .populate('author', 'username email')
      .populate('category', 'name')
      .sort({ createdAt: -1 });

    // If user is logged in, sort by their interests
    if (req.user) {
      const user = await User.findById(req.user._id).populate('interests');
      const userInterests = user.interests.map(interest => interest.name.toLowerCase());

      blogs.sort((a, b) => {
        const aMatchesInterest = userInterests.includes(a.category.name.toLowerCase());
        const bMatchesInterest = userInterests.includes(b.category.name.toLowerCase());
        
        if (aMatchesInterest && !bMatchesInterest) return -1;
        if (!aMatchesInterest && bMatchesInterest) return 1;
        return 0;
      });
    }

    res.json(blogs);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching blogs', error: error.message });
  }
};

export const getBlogById = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id)
      .populate('author', 'username email')
      .populate('category', 'name');
      
    if (!blog) {
      return res.status(404).json({ message: 'Blog not found' });
    }
    
    res.json(blog);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching blog', error: error.message });
  }
};

export const getBlogsByUser = async (req, res) => {
  try {
    const blogs = await Blog.find({ author: req.params.userId })
      .populate('category', 'name')
      .sort({ createdAt: -1 });
    res.json(blogs);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching user blogs', error: error.message });
  }
};

export const update = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    
    if (!blog) {
      return res.status(404).json({ message: 'Blog not found' });
    }

    if (blog.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to update this blog' });
    }

    const { title, content, category, thumbnail } = req.body;
    
    // Handle thumbnail upload if it's base64
    let thumbnailUrl = thumbnail;
    if (thumbnail && thumbnail.startsWith('data:image')) {
      try {
        thumbnailUrl = await uploadToCloudinary(thumbnail);
      } catch (error) {
        return res.status(400).json({ message: 'Failed to upload thumbnail' });
      }
    }

    // Process content to upload any base64 images to Cloudinary
    let processedContent = content;
    const base64Regex = /data:image\/[^;]+;base64[^"]+/g;
    const base64Images = content.match(base64Regex) || [];
    
    for (const base64Image of base64Images) {
      try {
        const imageUrl = await uploadToCloudinary(base64Image);
        processedContent = processedContent.replace(base64Image, imageUrl);
      } catch (error) {
        console.error('Error uploading image:', error);
      }
    }

    blog.title = title;
    blog.content = processedContent;
    blog.category = category;
    blog.thumbnail = thumbnailUrl;

    await blog.save();
    await blog.populate('author', 'username email');
    await blog.populate('category', 'name');

    res.json(blog);
  } catch (error) {
    res.status(500).json({ message: 'Error updating blog', error: error.message });
  }
};

export const deleteBlog = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    
    if (!blog) {
      return res.status(404).json({ message: 'Blog not found' });
    }

    if (blog.author.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to delete this blog' });
    }
    await Blog.deleteOne({ _id: req.params.id }); 
    res.json({ message: 'Blog deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting blog', error: error.message });
  }
};

export const uploadImage = async (req, res) => {
  try {
    const { image } = req.body;
    if (!image) {
      return res.status(400).json({ message: 'No image provided' });
    }
    const imageUrl = await uploadToCloudinary(image);
    res.json({ url: imageUrl });
  } catch (error) {
    res.status(500).json({ message: 'Error uploading image', error: error.message });
  }
};