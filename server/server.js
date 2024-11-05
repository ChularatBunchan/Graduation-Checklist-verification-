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
const router = express.Router();
const bodyParser = require('body-parser');

app.use(bodyParser.json());

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "http://localhost:3000");
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE,PATCH");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  res.setHeader("Access-Control-Allow-Credentials", "true");
  next();
});

app.use(express.json());

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

app.delete('/students/:st_id', async (req, res) => {
  try {
    const st_id = req.params.st_id;
    console.log(`Attempting to delete student with st_id: ${st_id}`);
    
    // ลบ 's' ที่อาจอยู่ข้างหน้า st_id
    const cleanedStId = st_id.replace(/^s/, '');
    
    // ค้นหาและลบ student
    const result = await Students.findOneAndDelete({ st_id: cleanedStId });
    
    if (!result) {
      console.log(`No student found with st_id: ${cleanedStId}`);
      return res.status(404).send({ message: "Student not found" });
    }
    
    console.log(`Student with st_id ${cleanedStId} deleted successfully`);
    res.status(200).send({ message: "Student deleted successfully" });
  } catch (error) {
    console.error("Error deleting student:", error);
    res.status(500).send({ message: "Server error", error: error.message });
  }
});

app.get("/students", async (req, res) => {
  const { st_id } = req.query;
  console.log("Received st_id:", st_id); // Log the received st_id

  try {
    const students = st_id
      ? await Students.find({ st_id })
      : await Students.find();
    console.log("Fetched students:", students); // Log fetched students
    res.json(students);
  } catch (error) {
    console.error("Error fetching students:", error);
    res.status(500).send("Internal Server Error");
  }
});

app.get("/students/:st_id", async (req, res) => {
  const { st_id } = req.params; // Accessing st_id from the URL parameter
  console.log("Received st_id:", st_id); // Log the received st_id
  
  try {
    const student = await Students.findOne({ st_id }); // Use findOne to get a single student
    console.log("Fetched student:", student); // Log fetched student
    if (!student) {
      return res.status(404).send("Student not found"); // Handle case where student does not exist
    }
    res.json(student); // Return the student data
  } catch (error) {
    console.error("Error fetching student:", error);
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

const officerSchema = new Schema(
  {
    of_id: { type: String, required: true, unique: true },
  },
);

const Officers = model("officers", officerSchema);

app.get("/officers", async (req, res) => {
  try {
    const officer = await Officers.find();
    res.json(officer);
  } catch (error) {
    res.status(500).json({ message: "Error fetching officers" });
  }
});

// Add a new officer
app.post("/officers", async (req, res) => {
  const { of_id } = req.body;
  const newOfficer = new Officers({ of_id });

  try {
    const savedOfficer = await newOfficer.save();
    res.status(201).json(savedOfficer);
  } catch (error) {
    res.status(400).json({ message: "Error adding officer" });
  }
});

// Delete an officer by of_id
app.delete("/officers/:of_id", async (req, res) => {
  try {
    const { of_id } = req.params;
    console.log(`Attempting to delete officer with of_id: ${of_id}`);

    const result = await Officers.findOneAndDelete({ of_id });

    if (!result) {
      console.log(`No officer found with of_id: ${of_id}`);
      return res.status(404).send({ message: "Officer not found" });
    }

    console.log(`Officer with of_id ${of_id} deleted successfully`);
    res.status(200).send({ message: "Officer deleted successfully" });
  } catch (error) {
    console.error("Error deleting officer:", error);
    res.status(500).send({ message: "Server error", error: error.message });
  }
});

// Update an officer by of_id
app.put("/officers/:of_id", async (req, res) => {
  const { of_id } = req.params;

  try {
    const updatedOfficer = await Officers.findOneAndUpdate(
      { of_id },
      req.body, // Assuming you are updating with the same of_id
      { new: true }
    );

    if (!updatedOfficer) {
      return res.status(404).json({ message: "Officer not found" });
    }

    res.json(updatedOfficer);
  } catch (error) {
    res.status(400).json({ message: "Error updating officer" });
  }
});

// -----------------------------------------------------------------

const subjectSchema = new mongoose.Schema({
  en_code: String,
  en_name: String,
  en_section: String,
  en_year: String,
  en_semester: String,
  en_note: String,
});

const Subject = mongoose.model("english_subjects", subjectSchema);

// Add a new subject
app.post("/english_subjects", async (req, res) => {
  try {
    const { en_code, en_name, en_section, en_year, en_semester, en_note } = req.body;
    const subject = new Subject({ en_code, en_name, en_section, en_year, en_semester, en_note });
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
    const { en_code, en_name, en_section, en_year, en_semester, en_note } = req.body;
    const updatedSubject = await Subject.findByIdAndUpdate(
      id,
      { en_code, en_name, en_section, en_year, en_semester, en_note },
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
  fi_id: { type: String, ref: "Students" },
  fi_name: { type: String, ref: "Students" },
  fi_file: [String],
  fi_time: { type: String },
  fi_result: String,
  fi_credit: String,
  fi_status: { type: String, default: "ยังไม่ได้ตรวจสอบ" },
});

const Pdf = mongoose.model("files", PdfSchema2);

app.post("/files", upload.array("files[]"), async (req, res) => {
  try {
    const studentId = req.body.std;
    const studentName = req.body.stdName;
    const fileOrder = req.body.order;
    const filetime = req.body.fi_time;
    const directoryPath = `../public/upload/${studentId}`;

    if (!fs.existsSync(directoryPath)) {
      fs.mkdirSync(directoryPath);
    }

    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: "No files were uploaded." });
    }

    let listfile = [];
    await Promise.all(
      req.files.map(async (file, index) => {
        const filePath = `${directoryPath}/${file.originalname}`;
        await fs.promises.writeFile(filePath, file.buffer);
        listfile.push({ path: filePath, order: fileOrder[index]  }); // แก้ไขตรงนี้
      })
    );
    listfile.sort((a, b) => a.order - b.order);
    const sortedFiles = listfile.map(file => file.path);
    // Create or update record in MongoDB
    let document = await Pdf.findOne({ fi_id: studentId });

    if (!document) {
      await Pdf.create({
        fi_id: studentId,
        fi_name: studentName,
        fi_file: sortedFiles, // แก้ไขตรงนี้
        fi_time: filetime,
        fi_result: 'Pending',
        fi_credit: 'Pending',
        fi_status: "ยังไม่ได้ตรวจสอบ", 
      });
    } else {
      document.fi_file = sortedFiles; // แก้ไขตรงนี้
      document.fi_time = filetime; // แก้ไขตรงนี้
      document.fi_status = "ยังไม่ได้ตรวจสอบ"; 
      await document.save();
    }

    // Execute Python script to check files
    exec(`python extract1.py ${studentId}`, async (error, stdout, stderr) => {
      if (error) {
        console.error(`Error executing Python script: ${error.message}`);
        return res.status(500).json({ message: "Error checking file." });
      }

      try {
        const { result, credit } = JSON.parse(stdout.trim()); // Parse JSON output from Python

        await Pdf.updateOne(
          { fi_id: studentId },
          {
            $set: {
              fi_result: result,
              fi_credit: credit, // Include fi_credit in the update
              fi_time: filetime,
              fi_status: "ได้รับการตรวจสอบแล้ว",
            },
          }
        );

        res.status(200).json({ message: "Files uploaded and checked successfully." });
      } catch (parseError) {
        console.error("Error parsing Python script output:", parseError);
        res.status(500).json({ message: "Error processing script output." });
      }
    });
  } catch (error) {
    console.error("Error in file upload process:", error);
    res.status(500).json({ message: "Server error during file upload." });
  }
});

app.patch("/files/:fi_id", async (req, res) => {
  const { fi_id } = req.params;
  const { fi_status } = req.body; // Assuming you're sending the status in the request body
  
  try {
    const result = await Pdf.findOneAndUpdate(
      { fi_id },
      { fi_status },
      { new: true }
    );

    if (!result) {
      return res.status(404).json({ message: "File not found." });
    }

    res.status(200).json({ message: "File status updated successfully.", result });
  } catch (error) {
    console.error("Error updating file status:", error);
    res.status(500).json({ message: "Error updating file status." });
  }
});

app.get("/files", async (req, res) => {
  const { st_id } = req.query;
  console.log("Received st_id:", st_id); // Log the received st_id
  try {
    const file = st_id ? await Pdf.find({ fi_id: st_id }) : await Pdf.find();
    console.log("Fetched files:", file); // Log fetched files
    res.json(file);
  } catch (error) {
    console.error("Error fetching files:", error);
    res.status(500).send("Internal Server Error");
  }
});


// -----------------------------------------------------------------

const graduateCheckingSchema = new mongoose.Schema({
  gr_id: { type: String, ref: "Students", required: true },
  gr_name: { type: String, ref: "Students", required: true },
  gr_result: { type: [String]},
  gr_time: { type: String },

});

const GraduateChecking = mongoose.model("graduate_checkings", graduateCheckingSchema);

app.get("/graduate_checkings", async (req, res) => {
  const { st_id } = req.query;
  console.log("Received st_id:", st_id); 
  try {
    const graduate = st_id
      ? await GraduateChecking.find({ gr_id: st_id }) // Use `gr_id` instead of `st_id`
      : await GraduateChecking.find();
    console.log("Fetched graduate checkings:", graduate); // Log fetched graduate checkings
    res.json(graduate);
  } catch (error) {
    console.error("Error fetching graduate checkings:", error);
    res.status(500).send("Internal Server Error");
  }
});

app.post("/graduate_checkings", async (req, res) => {
  try {
    const { gr_result, gr_id, gr_name, gr_time } = req.body;
    const graduate = new GraduateChecking({ gr_result, gr_id, gr_name , gr_time});
    await graduate.save();
    res.status(201).json(graduate);
  } catch (err) {
    console.error("Error adding subject:", err);
    res.status(500).send("Internal Server Error");
  }
});

// Get a specific graduate checking record by fi_id
app.get('/graduate_checkings/:fi_id', async (req, res) => {
  const { fi_id } = req.params;
  try {
    const record = await GraduateChecking.findOne({ gr_id: fi_id });
    res.json(record);
  } catch (error) {
    res.status(500).json({ message: "Error fetching graduate checking record." });
  }
});

// Update an existing graduate checking record
app.put('/graduate_checkings/:fi_id', async (req, res) => {
  const { fi_id } = req.params;
  const { gr_result, gr_name, gr_time } = req.body;

  try {
    const updatedRecord = await GraduateChecking.findOneAndUpdate(
      { gr_id: fi_id }, // Assuming gr_id is used to identify the record
      { gr_result, gr_name, gr_time },
      { new: true }
    );

    if (!updatedRecord) {
      return res.status(404).json({ message: "Graduate checking record not found." });
    }
    res.json(updatedRecord);
  } catch (error) {
    res.status(500).json({ message: "Error updating graduate checking record." });
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

// const upload = multer();

// const PdfSchema2 = mongoose.Schema({
//   fi_id: { type: String, ref: "Students" },
//   fi_name: { type: String, ref: "Students" },
//   fi_file: [{
//     path: [String], // หรือ Array ที่ไม่มีการอ้างอิงแบบวนลูป
//     order: [String]
//   }],
//   fi_result: String,
//   fi_status: { type: String, default: "ยังไม่ได้ตรวจสอบ" },
// });

// const Pdf = mongoose.model("files", PdfSchema2);

// app.post("/files", upload.array("files[]"), async (req, res) => {
//   try {
//     const studentId = req.body.std;
//     const studentName = req.body.stdName;
//     const fileOrder = req.body.order;
//     const directoryPath = `../public/upload/${studentId}`;

//     if (!fs.existsSync(directoryPath)) {
//       fs.mkdirSync(directoryPath);
//     }

//     if (!req.files || req.files.length === 0) {
//       return res.status(400).json({ message: "No files were uploaded." });
//     }

//     let listfile = [];
//     await Promise.all(
//       req.files.map(async (file, index) => {
//         const filePath = `${directoryPath}/${file.originalname}`;
//         await fs.promises.writeFile(filePath, file.buffer);
//         listfile.push({ path: filePath, order: req.body.order[index] }); // แก้ไขตรงนี้
//       })
//     );

//     // Create or update record in MongoDB
//     let document = await Pdf.findOne({ fi_id: studentId });

//     if (!document) {
//       await Pdf.create({
//         fi_id: studentId,
//         fi_name: studentName,
//         fi_file: listfile, // แก้ไขตรงนี้
//         fi_result: "",
//         fi_status: "ยังไม่ได้ตรวจสอบ", 
//       });
//     } else {
//       document.fi_file = listfile; // แก้ไขตรงนี้
//       document.fi_status = "ยังไม่ได้ตรวจสอบ"; 
//       await document.save();
//     }

//     // Execute Python script to check files
//     exec(`python extract1.py ${studentId}`, async (error, stdout, stderr) => {
//       if (error) {
//         console.error(`Error executing Python script: ${error.message}`);
//         return res.status(500).json({ message: "Error checking file." });
//       }

//       const result = stdout.trim();

//       await Pdf.updateOne(
//         { fi_id: studentId },
//         {
//           $set: {
//             fi_result: result,
//             fi_status: "ได้รับการตรวจสอบแล้ว",
//           },
//         }
//       );

//       res.status(200).json({ message: "Files uploaded and checked successfully." });
//     });
//   } catch (error) {
//     console.error("Error in file upload process:", error);
//     res.status(500).json({ message: "Server error during file upload." });
//   }
// });
