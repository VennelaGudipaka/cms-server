import Article from '../models/Article.js';
import User from '../models/User.js';
import Interest from '../models/Interest.js';
import { uploadToCloudinary } from '../config/cloudinary.js';

export const create = async (req, res) => {
  try {
    const { title, introduction, body, conclusion, references, category, tags, thumbnail } = req.body;
    
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

    // Process body content to upload any base64 images to Cloudinary
    let processedBody = body;
    const base64Regex = /data:image\/[^;]+;base64[^"]+/g;
    const base64Images = body.match(base64Regex) || [];
    
    for (const base64Image of base64Images) {
      try {
        const imageUrl = await uploadToCloudinary(base64Image);
        processedBody = processedBody.replace(base64Image, imageUrl);
      } catch (error) {
        console.error('Error uploading image:', error);
      }
    }

    const article = new Article({
      title,
      introduction,
      body: processedBody,
      conclusion,
      references,
      category,
      tags,
      thumbnail: thumbnailUrl,
      author: req.user._id
    });

    await article.save();
    await article.populate('author', 'username email');
    await article.populate('category', 'name');

    res.status(201).json(article);
  } catch (error) {
    res.status(500).json({ message: 'Error creating article', error: error.message });
  }
};

export const getAllArticles = async (req, res) => {
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

    const articles = await Article.find(query)
      .populate('author', 'username email')
      .populate('category', 'name')
      .sort({ createdAt: -1 });

    // If user is logged in, sort by their interests
    if (req.user) {
      const user = await User.findById(req.user._id).populate('interests');
      const userInterests = user.interests.map(interest => interest.name.toLowerCase());

      articles.sort((a, b) => {
        const aMatchesInterest = userInterests.includes(a.category.name.toLowerCase());
        const bMatchesInterest = userInterests.includes(b.category.name.toLowerCase());
        
        if (aMatchesInterest && !bMatchesInterest) return -1;
        if (!aMatchesInterest && bMatchesInterest) return 1;
        return 0;
      });
    }

    res.json(articles);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching articles', error: error.message });
  }
};

export const getArticleById = async (req, res) => {
  try {
    const article = await Article.findById(req.params.id)
      .populate('author', 'username email')
      .populate('category', 'name');
      
    if (!article) {
      return res.status(404).json({ message: 'Article not found' });
    }
    
    res.json(article);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching article', error: error.message });
  }
};

export const getArticlesByUser = async (req, res) => {
  try {
    const articles = await Article.find({ author: req.params.userId })
      .populate('author', 'username')
      .populate('category', 'name')
      .sort({ createdAt: -1 });
    res.json(articles);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching user articles', error: error.message });
  }
};

export const update = async (req, res) => {
  try {
    const article = await Article.findById(req.params.id);
    
    if (!article) {
      return res.status(404).json({ message: 'Article not found' });
    }

    if (article.author.toString() !== req.user._id.toString() && 
        req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to update this article' });
    }

    const { title, introduction, body, conclusion, references, category, tags, thumbnail } = req.body;
    
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

    // Process body content to upload any base64 images to Cloudinary
    let processedBody = body;
    const base64Regex = /data:image\/[^;]+;base64[^"]+/g;
    const base64Images = body.match(base64Regex) || [];
    
    for (const base64Image of base64Images) {
      try {
        const imageUrl = await uploadToCloudinary(base64Image);
        processedBody = processedBody.replace(base64Image, imageUrl);
      } catch (error) {
        console.error('Error uploading image:', error);
      }
    }

    article.title = title;
    article.introduction = introduction;
    article.body = processedBody;
    article.conclusion = conclusion;
    article.references = references;
    article.thumbnail = thumbnailUrl;
    article.category = category;
    article.tags = tags;

    await article.save();
    await article.populate('author', 'username email');
    await article.populate('category', 'name');

    res.json(article);
  } catch (error) {
    res.status(500).json({ message: 'Error updating article', error: error.message });
  }
};

export const deleteArticle = async (req, res) => {
  try {
    const article = await Article.findById(req.params.id);
    
    if (!article) {
      return res.status(404).json({ message: 'Article not found' });
    }

    if (article.author.toString() !== req.user._id.toString() && 
        req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to delete this article' });
    }

    await Article.deleteOne({ _id: req.params.id }); // Correct method
    res.json({ message: 'Article deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting article', error: error.message });
  }
};
