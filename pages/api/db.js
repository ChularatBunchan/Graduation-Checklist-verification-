const mongoose = require('mongoose');

const dbURI = 'mongodb://localhost/yourDatabase'; // เปลี่ยนเป็น URI ของคุณ

mongoose.connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.log('Error connecting to MongoDB:', err));

const Schema = mongoose.Schema;

const courseSchema = new Schema({
  en_code: { type: String, required: true },
  en_name: { type: String, required: true },
  en_year: { type: String, required: true }
});

const Course = mongoose.model('Course', courseSchema);

module.exports = { Course };
