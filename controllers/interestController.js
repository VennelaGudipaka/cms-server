import Interest from '../models/Interest.js';

export const create = async (req, res) => {
  try {
    const interest = new Interest(req.body);
    await interest.save();
    res.status(201).json(interest);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const getAll = async (req, res) => {
  try {
    const interests = await Interest.find().sort({ name: 1 });
    res.json(interests);
  } catch (error) {
    console.error('Error fetching interests:', error);
    res.status(500).json({ 
      message: 'Error fetching interests',
      error: error.message 
    });
  }
};

export const getById = async (req, res) => {
  try {
    const interest = await Interest.findById(req.params.id);
    if (!interest) {
      return res.status(404).json({ message: 'Interest not found' });
    }
    res.json(interest);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const update = async (req, res) => {
  try {
    const interest = await Interest.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!interest) {
      return res.status(404).json({ message: 'Interest not found' });
    }
    res.json(interest);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const remove = async (req, res) => {
  try {
    const interest = await Interest.findByIdAndDelete(req.params.id);
    if (!interest) {
      return res.status(404).json({ message: 'Interest not found' });
    }
    res.json({ message: 'Interest deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}; 