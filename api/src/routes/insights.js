const express = require('express');
const Question = require('../models/Question');
const Answer = require('../models/Answer');
const User = require('../models/User');
const { auth, requireManager } = require('../middleware/auth');

const router = express.Router();

// Get team insights (manager only)
router.get('/insights', auth, requireManager, async (req, res) => {
  try {
    // Total questions asked
    const totalQuestions = await Question.countDocuments();

    // Top 3 most active users (by questions asked + answers given)
    // First, get questions count per user
    const questionCounts = await Question.aggregate([
      {
        $group: {
          _id: '$createdBy',
          questionCount: { $sum: 1 }
        }
      }
    ]);

    // Get answers count per user
    const answerCounts = await Answer.aggregate([
      {
        $group: {
          _id: '$createdBy',
          answerCount: { $sum: 1 }
        }
      }
    ]);

    // Combine and get user details
    const userActivityMap = new Map();
    
    // Add question counts
    questionCounts.forEach(item => {
      userActivityMap.set(item._id.toString(), { 
        userId: item._id, 
        questionCount: item.questionCount,
        answerCount: 0
      });
    });
    
    // Add answer counts
    answerCounts.forEach(item => {
      const userId = item._id.toString();
      if (userActivityMap.has(userId)) {
        userActivityMap.get(userId).answerCount = item.answerCount;
      } else {
        userActivityMap.set(userId, { 
          userId: item._id, 
          questionCount: 0,
          answerCount: item.answerCount
        });
      }
    });

    // Get user details and calculate total activity
    const mongoose = require('mongoose');
    const userIds = Array.from(userActivityMap.keys())
      .filter(id => mongoose.Types.ObjectId.isValid(id))
      .map(id => new mongoose.Types.ObjectId(id));
    
    const users = await User.find({ _id: { $in: userIds } }).select('name email').lean();
    
    const topActiveUsers = users.map(user => {
      const activity = userActivityMap.get(user._id.toString()) || { questionCount: 0, answerCount: 0 };
      return {
        name: user.name,
        email: user.email,
        questionCount: activity.questionCount,
        answerCount: activity.answerCount,
        totalActivity: activity.questionCount + activity.answerCount
      };
    })
    .sort((a, b) => b.totalActivity - a.totalActivity)
    .slice(0, 3);

    // Average answers per question
    const totalAnswers = await Answer.countDocuments();
    const averageAnswersPerQuestion = totalQuestions > 0 ? (totalAnswers / totalQuestions).toFixed(2) : 0;

    // Transform data to match frontend expectations
    const transformedTopUsers = topActiveUsers.map(user => ({
      name: user.name,
      email: user.email,
      answers_count: user.totalActivity // Total activity (questions + answers)
    }));

    res.json({
      total_questions_asked: totalQuestions,
      top_3_most_active_users: transformedTopUsers,
      average_answers_per_question: parseFloat(averageAnswersPerQuestion)
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;

