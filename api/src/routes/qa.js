const express = require('express');
const Question = require('../models/Question');
const Answer = require('../models/Answer');
const { auth } = require('../middleware/auth');

const router = express.Router();

// Create a question
router.post('/questions', auth, async (req, res) => {
  try {
    const { title, description, tags } = req.body;

    const question = new Question({
      title,
      description,
      tags: tags || [],
      createdBy: req.user._id
    });

    await question.save();

    // Populate the createdBy field and convert to plain object
    await question.populate('createdBy', 'name email');
    const questionObj = question.toObject();
    
    // Transform _id to id for frontend compatibility
    const transformedQuestion = {
      ...questionObj,
      id: questionObj._id.toString(),
      _id: questionObj._id.toString()
    };

    res.status(201).json({
      message: 'Question created successfully',
      question: transformedQuestion
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get all questions with search and pagination
router.get('/questions', async (req, res) => {
  try {
    const { search, tag, page = 1, limit = 100 } = req.query; // Increased limit for frontend

    let query = {};

    // Use regex for text search if text index is not available
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { tags: { $in: [new RegExp(search, 'i')] } }
      ];
    }

    if (tag) {
      query.tags = { $in: [tag] };
    }

    const questions = await Question.find(query)
      .populate('createdBy', 'name email')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .lean(); // Convert to plain objects for better JSON serialization

    // Transform _id to id for frontend compatibility
    const transformedQuestions = questions.map(q => ({
      ...q,
      id: q._id.toString(),
      _id: q._id.toString()
    }));

    const total = await Question.countDocuments(query);

    res.json({
      questions: transformedQuestions,
      totalPages: Math.ceil(total / limit),
      currentPage: parseInt(page),
      total
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get single question
router.get('/questions/:id', async (req, res) => {
  try {
    const question = await Question.findById(req.params.id)
      .populate('createdBy', 'name email')
      .lean();

    if (!question) {
      return res.status(404).json({ message: 'Question not found' });
    }

    // Transform _id to id for frontend compatibility
    const transformedQuestion = {
      ...question,
      id: question._id.toString(),
      _id: question._id.toString()
    };

    res.json({ question: transformedQuestion });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Create an answer
router.post('/answers/:questionId', auth, async (req, res) => {
  try {
    const { text } = req.body;
    const { questionId } = req.params;

    // Check if question exists
    const question = await Question.findById(questionId);
    if (!question) {
      return res.status(404).json({ message: 'Question not found' });
    }

    const answer = new Answer({
      text,
      questionId,
      createdBy: req.user._id
    });

    await answer.save();

    // Populate the createdBy field and convert to plain object
    await answer.populate('createdBy', 'name email');
    const answerObj = answer.toObject();
    
    // Transform _id to id for frontend compatibility
    const transformedAnswer = {
      ...answerObj,
      id: answerObj._id.toString(),
      _id: answerObj._id.toString()
    };

    res.status(201).json({
      message: 'Answer created successfully',
      answer: transformedAnswer
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get answers for a question
router.get('/answers/:questionId', async (req, res) => {
  try {
    const answers = await Answer.find({ questionId: req.params.questionId })
      .populate('createdBy', 'name email')
      .sort({ createdAt: -1 })
      .lean();

    // Transform _id to id for frontend compatibility
    const transformedAnswers = answers.map(a => ({
      ...a,
      id: a._id.toString(),
      _id: a._id.toString()
    }));

    res.json({ answers: transformedAnswers });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;

