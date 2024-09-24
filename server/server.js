const { Schema, model } = require("mongoose");
const express = require("express");
const axios = require("axios");
const FormData = require("form-data");
const mongoose = require("mongoose");
const cors = require("cors");
const multer = require("multer");
const fs = require("fs");
const { exec } = require("child_process");
const path = require("path");

const app = express();

app.use(
  cors({
    origin: "http://localhost:3000",
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    credentials: true,
  })
);

app.use(express.json());
// app.use("/file", express.static("file"));
app.use("/upload", express.static(path.join(__dirname, "public/upload")));

const mongoUrl = "mongodb+srv://admin:1234@cluster0.o78uko5.mongodb.net/";

mongoose
  .connect(mongoUrl)
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((e) => console.log("Error connecting to MongoDB:", e));

// -----------------------------------------------------------------
// For students

const studentsSchema = new Schema(
  {
    st_id: String,
    st_name: String,
    st_firstname_en: String,
    st_lastname_en: String,
    st_email: String,
    st_account_type: String,
    st_status: Boolean,
  },
  {
    timestamps: false,
    versionKey: false,
  }
);

const Students = model("students", studentsSchema);

app.post("/auth/login", async (req, res) => {
  let { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: "Missing credentials" });
  }

  try {
    const formData = new FormData();
    formData.append("username", username);
    formData.append("password", password);
    formData.append("scopes", "student,personel");

    const headersConfig = {
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers":
          "Origin, X-Requested-With, Content-Type, Accept",
        Authorization: "Bearer nK6p0wT-8NVHUwB8p0e9QSYBSaIZGp9D",
      },
    };

    const response = await axios.post(
      "https://api.account.kmutnb.ac.th/api/account-api/user-authen",
      formData,
      headersConfig
    );
    return res.json(response.data);
  } catch (error) {
    console.error("Error in login:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
});

app.post("/auth/info", async (req, res) => {
  const { st_username } = req.body.replace("s", "");
  if (!st_username) {
    return res.status(400).json({ message: "Missing username" });
  }

  try {
    const formData = new FormData();
    formData.append("username", st_username);

    const config = {
      method: "post",
      url: "https://account.kmutnb.ac.th/api/account-api/user-info",
      headers: {
        Authorization: "Bearer nK6p0wT-8NVHUwB8p0e9QSYBSaIZGp9D",
      },
      data: formData,
    };

    const response = await axios.request(config);
    return res.json(response.data);
  } catch (error) {
    console.error("Error in getting user info:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
});

app.delete("/students/:username", async (req, res) => {
  const username = req.params.username;
  if (!username) {
    return res.status(400).json({ message: "Username is required" });
  }

  try {
    const result = await Students.findOneAndDelete({ st_id: username });
    if (!result) {
      return res.status(404).json({ message: "Student not found" });
    }
    res.json(result);
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
});

app.get("/students", async (req, res) => {
  try {
    const students = await Students.find();
    res.json(students);
  } catch (error) {
    console.error("Error fetching students:", error);
    res.status(500).send("Internal Server Error");
  }
});

app.post("/students", async (req, res) => {
  try {
    // Modify properties of req.body if necessary
    const newStudentData = { ...req.body };

    if (typeof newStudentData.st_id === "string") {
      newStudentData.st_id = newStudentData.st_id.replace("s", ""); // Example of replacing "s" in st_id
    }

    const student = new Students(newStudentData);
    const result = await student.save();
    res.json(result);
  } catch (error) {
    console.error("Error creating student:", error);
    res.status(500).json({ message: error.message });
  }
});

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
app.delete("/english_subjects/:id", async (req, res) => {
  try {
    await Subject.findByIdAndDelete(req.params.id);
    res.json({ message: "Subject deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// -----------------------------------------------------------------

const upload = multer();

const PdfSchema2 = mongoose.Schema({
  fi_id: String,
  fi_name: String,
  fi_file: [String],
  fi_result: String,
  fi_status: String,
  fi_status: { type: String, default: "ยังไม่ได้ตรวจสอบ" },
});

const Pdf = mongoose.model("files", PdfSchema2);

app.post("/files", upload.array("files[]"), async (req, res) => {
  try {
    const studentId = req.body.std.replace("s", "");
    const studentName = req.body.stdName;
    const directoryPath = `../public/upload/${studentId}`;

    if (!fs.existsSync(directoryPath)) {
      fs.mkdirSync(directoryPath);
    }

    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: "No files were uploaded." });
    }

    let listfile = [];
    await Promise.all(
      req.files.map(async (file) => {
        const filePath = `${directoryPath}/${file.originalname}`;
        await fs.promises.writeFile(filePath, file.buffer);
        listfile.push(filePath);
      })
    );

    // Create or update record in MongoDB
    let document = await Pdf.findOne({ fi_id: studentId });

    if (!document) {
      // If document doesn't exist, create a new one
      await Pdf.create({
        fi_id: studentId,
        fi_name: studentName,
        fi_file: listfile,
        fi_result: "",
        fi_status: "ยังไม่ได้ตรวจสอบ", // Ensure this is set on creation
      });
    } else {
      // Update the existing document
      document.fi_file = listfile;
      document.fi_status = "ยังไม่ได้ตรวจสอบ"; // Reset status to not checked
      await document.save();
    }

    // Execute Python script to check files
    exec(`python3 extract1.py ${studentId}`, async (error, stdout, stderr) => {
      if (error) {
        console.error(`Error executing Python script: ${error.message}`);
        return res.status(500).json({ message: "Error checking file." });
      }

      // Parse Python output
      const result = stdout.trim();

      // Update MongoDB with the result and set status to "ได้รับการตรวจสอบแล้ว"
      await Pdf.updateOne(
        { fi_id: studentId },
        {
          $set: {
            fi_result: result,
            fi_status: "ได้รับการตรวจสอบแล้ว",
          },
        }
      );

      res.status(200).json({ message: "Files uploaded and checked successfully." });
    });
  } catch (error) {
    console.error("Error in file upload process:", error);
    res.status(500).json({ message: "Server error during file upload." });
  }
});

app.patch("/files/:fi_id", async (req, res) => {
  try {
    const { fi_id } = req.params;
    const { fi_status } = req.body;

    const updatedFile = await Pdf.updateOne(
      { fi_id: fi_id },
      { $set: { fi_status: fi_status } }
    );

    if (updatedFile.nModified > 0) {
      res.status(200).json({ message: "File status updated successfully." });
    } else {
      res.status(404).json({ message: "File not found." });
    }
  } catch (error) {
    console.error("Error updating file status:", error);
    res.status(500).json({ message: "Internal server error." });
  }
});



app.get("/files", async (req, res) => {
  const { st_id } = req.query;
  const files = await Pdf.find({ st_id });
  res.json(files);
});


// -----------------------------------------------------------------

const graduateCheckingSchema = new mongoose.Schema({
  gr_num: { type: Number, unique: true }, // Unique number for each record
  gr_id: { type: String, ref: "Students" },
  gr_name: { type: String, ref: "Students" },
  gr_result: [String],
});

const GraduateChecking = mongoose.model(
  "graduate_checkings",
  graduateCheckingSchema
);

app.get("/graduate_checkings", async (req, res) => {
  const { st_id } = req.query;
  const checkings = await GraduateChecking.find({ st_id });
  res.json(checkings);
});

app.post("/graduate_checkings", async (req, res) => {
  try {
    const { gr_result, gr_id, gr_name } = req.body;
    const studentInfo = await Students.findOne({
      st_id: gr_id,
      st_name: gr_name,
    });

    if (!studentInfo) {
      return res.status(404).json({ message: "Student not found" });
    }

    if (!gr_result || !gr_id || !gr_name) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    await GraduateChecking.deleteMany({ gr_id: studentInfo.st_id });

    let graduateChecking = await GraduateChecking.findOne({
      gr_id: studentInfo.st_id,
    });

    if (graduateChecking) {
      graduateChecking.gr_result = gr_result;
      await graduateChecking.save();
    } else {
      const maxNumRecord = await GraduateChecking.findOne().sort({
        gr_num: -1,
      });
      const newGrNum = maxNumRecord ? maxNumRecord.gr_num + 1 : 1;

      graduateChecking = new GraduateChecking({
        gr_num: newGrNum,
        gr_id: studentInfo.st_id,
        gr_name: studentInfo.st_name,
        gr_result: gr_result,
      });

      await graduateChecking.save();
    }

    // Update the file status in 'files' collection
    await Pdf.updateOne(
      { fi_id: gr_id },
      { $set: { fi_status: "ได้รับการตรวจสอบแล้ว" } }
    );

    res.status(201).json({ message: "Statuses saved successfully" });
  } catch (error) {
    console.error("Error in graduate checking:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// -----------------------------------------------------------------

app.get("/", async (req, res) => {
  res.send("Success yahhhhhh");
});

app.listen(4000, () => {
  console.log("server is running port 4000");
});

//------------------------------------------------------------------
