const fs = require("fs");
const express = require("express");
const mongoose = require("mongoose");
const multer = require("multer");
const cors = require("cors");

const app = express();
app.use(
  cors({
    origin: "http://localhost:3000",
  })
);

app.use("/file", express.static("/file"));

const mongoUrl = "mongodb+srv://admin:1234@cluster0.o78uko5.mongodb.net/";

mongoose
  .connect(mongoUrl, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Connect to MongoDB");
  })
  .catch((e) => console.log(e));

app.use(express.json());
app.use(cors());

// -----------------------------------------------------------------

const subjectSchema = new mongoose.Schema({
  en_name: String,
  en_year: String,
  en_semester: String,
  en_note: String,
});

const Subject = mongoose.model("english_subjects", subjectSchema);

// Add a new subject
app.post("/english_subjects", async (req, res) => {
  try {
    const { en_name, en_year, en_semester, en_note } = req.body;
    const subject = new Subject({ en_name, en_year, en_semester, en_note });
    await subject.save();
    res.status(201).json(subject);
  } catch (err) {
    console.error("Error adding subject:", err);
    res.status(500).send("Internal Server Error");
  }
});


app.get("/english_subjects", async (req, res) => {
  try {
    const subject = await Subject.find();
    res.json(subject);
  } catch (error) {
    console.error("Error Eng subjects na", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Update a subject by ID
app.put("/english_subjects/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { en_name, en_year, en_semester, en_note } = req.body;
    const updatedSubject = await Subject.findByIdAndUpdate(
      id,
      { en_name, en_year, en_semester, en_note },
      { new: true }
    );
    res.json(updatedSubject);
  } catch (err) {
    console.error("Error updating subject:", err);
    res.status(500).send("Internal Server Error");
  }
});

//Delete
app.delete('/english_subjects/:id', async (req, res) => {
  try {
      await Subject.findByIdAndDelete(req.params.id);
      res.json({ message: 'Subject deleted' });
  } catch (err) {
      res.status(500).json({ error: err.message });
  }
});

// -----------------------------------------------------------------

const upload = multer();
const PdfSchema = mongoose.Schema({
  fi_transcript: String,
  fi_internship: String,
  fi_kstep: String,
  fi_english: String,
  fi_thesis: String,
  fi_graduate: String,
  createdAt: String,
});

const PdfSchema2 = mongoose.Schema({
  fi_id: String,
  pdf: [String],
});

const Pdf = mongoose.model("files", PdfSchema2);

app.post("/files", upload.array("files[]"), async (req, res) => {

  try { 
    //creat folder
    let directoryPath = "../public/upload/" + req.body.std; 
    if (!fs.existsSync(directoryPath)) {
      fs.mkdirSync(directoryPath);
    }
    //check file
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: "No files were uploaded." });
    }
    let listfile = [];
    await Promise.all(
      req.files.map(async (file) => {
        console.log(file)
        const filePath = `${directoryPath}/${file.originalname}`;
        await fs.promises.writeFile(filePath, file.buffer);
        listfile.push(filePath);
      })
    );
    await Pdf.create({ title: req.body.std, fi_file: listfile });
    res.send({ status: "ok" });

    // return true; // Directory created successfully
  } catch (error) {
    console.error("Error creating directory:", error);
  }
});

app.get("/files", async (req, res) => {
  try {
    const data = await Pdf.find({});
    res.send({ status: "ok", data: data });
  } catch (error) {
    res.json({ status: error });
  }
});

// -----------------------------------------------------------------

// Create a schema for English subjects
const studentsSchema = new mongoose.Schema({
  st_id: String,
  st_firstname: String,
  st_lastname: String,
  st_email: String,
  st_phone: String,
});

// Create a model
const Students = mongoose.model("students", studentsSchema);

// Route to handle GET request for English subjects
app.get("/students", async (req, res) => {
  try {
    const students = await Students.find();
    res.json(students);
  } catch (error) {
    console.error("Error fetching students:", error);
    res.status(500).send("Internal Server Error");
  }
});

// -----------------------------------------------------------------

app.get("/", async (req, res) => {
  res.send("Success yahhhhhh");
});

app.listen(4000, () => {
  console.log("server is running port 4000");
});