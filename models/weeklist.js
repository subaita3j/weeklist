const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const weekListSchema = new Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'users' },
  weekListId: Number,
  description: {
    type: String,
    required: true,
  },
  tasks: {
    type: [
      {
        description: String,
        completedAt: Date,
      },
    ],
    required: true,
  },
  createdAt: Date,
  updatedAt: Date,
  completed: Boolean,
  isActive: Boolean,
  timeLeft: Date,
});

module.exports = mongoose.model('WeekList', weekListSchema);
