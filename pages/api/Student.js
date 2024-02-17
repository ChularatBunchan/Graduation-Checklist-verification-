import mongoose from 'mongoose';

const studentSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  grade: {
    type: Number,
    required: true,
  },
  subject: {
    type: String,
    required: true,
  },
});

export default mongoose.models.Student || mongoose.model('Student', studentSchema);
