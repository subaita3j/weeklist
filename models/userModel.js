const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  FullName: String,
  email: String,
  password: String,
  age: Number,
  gender: String,
  mobile: Number,
  weekLists: [
    {
      description: String,
      startDate: { type: Date, default: Date.now() },
      endDate: {
        type: Date,
        default: () => {
          const date = new Date();
          date.setDate(date.getDate() + 7);
          return date;
        },
      },
      status: {
        type: String,
        enum: ['active', 'completed', 'inactive'],
        default: 'active',
      },
      createdAt: { type: Date, default: Date.now() },
    },
  ],
});

const userModel = new mongoose.model('users', userSchema);
module.exports = userModel;
