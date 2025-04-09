import User from '../models/User.js';
import  Blog  from '../models/Blog.js';
import  Article  from '../models/Article.js';

export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({}, '-password -otp -resetPasswordOtp');
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    // Don't allow admin to delete themselves
    if (id === req.user._id.toString()) {
      return res.status(400).json({ message: 'Cannot delete your own account' });
    }

    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Don't allow deletion of other admins
    if (user.role === 'admin' && req.user.role === 'admin') {
      return res.status(403).json({ message: 'Cannot delete admin users' });
    }

    // Delete all user's content
    await Promise.all([
      Blog.deleteMany({ author: id }),
      Article.deleteMany({ author: id }),
      User.findByIdAndDelete(id)
    ]);

    res.json({ message: 'User and associated content deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
