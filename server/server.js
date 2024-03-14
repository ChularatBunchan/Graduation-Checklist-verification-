const express = require('express');
const mongoose = require('mongoose');
const multer = require('multer');
const cors = require("cors");


const app = express();
app.use(cors({
    origin: 'http://localhost:3000'
}));

app.use("/file" , express.static("/file"))
app.use("/fileintern" , express.static("/fileintern"))
app.use("/filetepc" , express.static("/filetepc"))
app.use("/fileeng" , express.static("/fileeng"))
app.use("/filecer" , express.static("/filecer"))
app.use("/filegra" , express.static("/filegra"))


const mongoUrl = "mongodb+srv://admin:1234@cluster0.o78uko5.mongodb.net/";

mongoose.connect(mongoUrl, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => {
  console.log("Connect to MongoDB");
}).catch((e) => console.log(e));

app.use(express.json());
app.use(cors())

// -----------------------------------------------------------------

const subjectSchema = new mongoose.Schema({
  en_code: String,
  en_name: String,
  en_year: String,
  en_semester: String,
  en_note: String
});

const Subject = mongoose.model('english_subjects', subjectSchema);

// Add a new subject
app.post('/AddSub', async (req, res) => {
  try {
    const { code, name, year, semester, note } = req.body;
    const subject = new Subject({ code, name, year, semester, note });
    await subject.save();
    res.status(201).json(subject);
  } catch (err) {
    console.error('Error adding subject:', err);
    res.status(500).send('Internal Server Error');
  }
});

// -----------------------------------------------------------------

const EngSubSchema = new mongoose.Schema({
  en_id: Number,
  en_code: String
});
const EngSub = mongoose.model('EngSub' , EngSubSchema )

app.get('/engsub', async (req,res) => {
  try{
    const engsub = await EngSub.find();
    res.json(engsub)
  } catch (error) {
    console.error('Error Eng subjects na',error)
    res.status(500).json({ error: "Internal server error"})
  }
})

// -----------------------------------------------------------------

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, "./file");
    },
    fileName: function (req, file, cb) {
      const uniqueSuffix = Date.now();
      cb(null, file.originalname);
    },
  });
  
  const upload = multer({ storage : storage });
  
  const PdfSchema = mongoose.Schema({
    title: String,
    pdf: String,
  });
  
  const Pdf = mongoose.model('Pdf', PdfSchema);
  
  app.post("/upload", upload.single("file"), async (req, res) => {
    console.log("NEWfile",req.file.originalname);
    const filename = req.file.originalname;
    console.log("file name",filename)
    try {
      await Pdf.create({ pdf: filename});
      res.send({ status: "ok" });
    } catch (error) {
      res.json({ status: error });
    }
  });
  
  app.get("/upload", async (req, res) => {
    try {
      const data = await Pdf.find({});
      res.send({ status: "ok", data: data });
    } catch (error) {
      res.json({ status: error });
    }
  });

// -----------------------------------------------------------------

const storage2 = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./fileintern");
  },
  fileName: function (req, file, cb) {
    const studentCode = req.body.studentCode; // Assuming studentCode is sent in the request body
    const fileName = studentCode + "_"  + file.originalname;
    cb(null, fileName);
  },
});

const upload2 = multer({ storage : storage2 });

const PdfSchema2 = mongoose.Schema({
  title: String,
  pdf: String
});

const Pdf2 = mongoose.model('Pdf2', PdfSchema2);

app.post("/uploadintern", upload2.single("file"), async (req, res) => {
  console.log(req.file);
  const filename = req.file.originalname;
  try {
    await Pdf2.create({ pdf: filename });
    res.send({ status: "ok" });
  } catch (error) {
    res.json({ status: error });
  }
});

app.get("/uploadintern", async (req, res) => {
  try {
    const data = await Pdf2.find({});
    res.send({ status: "ok", data: data });
  } catch (error) {
    res.json({ status: error });
  }
});
  
// -----------------------------------------------------------------

const storage3 = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./filetepc");
  },
  fileName: function (req, file, cb) {
    const studentCode = req.body.studentCode; // Assuming studentCode is sent in the request body
    const fileName = studentCode + "_"  + file.originalname;
    cb(null, fileName);
  },
});

const upload3 = multer({ storage : storage3 });

const PdfSchema3 = mongoose.Schema({
  title: String,
  pdf: String
});

const Pdf3 = mongoose.model('Pdf3', PdfSchema3);

app.post("/uploadtepc", upload3.single("file"), async (req, res) => {
  console.log(req.file);
  const filename = req.file.originalname;
  try {
    await Pdf3.create({ pdf: filename });
    res.send({ status: "ok" });
  } catch (error) {
    res.json({ status: error });
  }
});

app.get("/uploadtepc", async (req, res) => {
  try {
    const data = await Pdf3.find({});
    res.send({ status: "ok", data: data });
  } catch (error) {
    res.json({ status: error });
  }
});

// -----------------------------------------------------------------

const storage4 = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./fileeng");
  },
  fileName: function (req, file, cb) {
    const uniqueSuffix = Date.now();
    cb(null, uniqueSuffix + file.originalname);
  },
});

const upload4 = multer({ storage : storage4 });

const PdfSchema4 = mongoose.Schema({
  title: String,
  pdf: String
});

const Pdf4 = mongoose.model('Pdf4', PdfSchema4);

app.post("/uploadeng", upload4.single("file"), async (req, res) => {
  console.log(req.file);
  const filename = req.file.originalname;
  try {
    await Pdf4.create({ pdf: filename });
    res.send({ status: "ok" });
  } catch (error) {
    res.json({ status: error });
  }
});

app.get("/uploadeng", async (req, res) => {
  try {
    const data = await Pdf4.find({});
    res.send({ status: "ok", data: data });
  } catch (error) {
    res.json({ status: error });
  }
});

// -----------------------------------------------------------------

const storage5 = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./filecer");
  },
  fileName: function (req, file, cb) {
    const uniqueSuffix = Date.now();
    cb(null, uniqueSuffix + file.originalname);
  },
});

const upload5 = multer({ storage : storage5 });

const PdfSchema5 = mongoose.Schema({
  title: String,
  pdf: String
});

const Pdf5 = mongoose.model('Pdf5', PdfSchema5);

app.post("/uploadcer", upload5.single("file"), async (req, res) => {
  console.log(req.file);
  const filename = req.file.originalname;
  try {
    await Pdf5.create({ pdf: filename });
    res.send({ status: "ok" });
  } catch (error) {
    res.json({ status: error });
  }
});

app.get("/uploadcer", async (req, res) => {
  try {
    const data = await Pdf5.find({});
    res.send({ status: "ok", data: data });
  } catch (error) {
    res.json({ status: error });
  }
});

// -----------------------------------------------------------------

const storage6 = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./filecer");
  },
  fileName: function (req, file, cb) {
    const uniqueSuffix = Date.now();
    cb(null, uniqueSuffix + file.originalname);
  },
});

const upload6 = multer({ storage : storage6 });

const PdfSchema6 = mongoose.Schema({
  title: String,
  pdf: String
});

const Pdf6 = mongoose.model('Pdf6', PdfSchema6);

app.post("/uploadgra", upload6.single("file"), async (req, res) => {
  console.log(req.file);
  const filename = req.file.originalname;
  try {
    await Pdf6.create({ pdf: filename });
    res.send({ status: "ok" });
  } catch (error) {
    res.json({ status: error });
  }
});

app.get("/uploadgra", async (req, res) => {
  try {
    const data = await Pdf5.find({});
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
const Students = mongoose.model('students', studentsSchema);

// Route to handle GET request for English subjects
app.get('/students', async (req, res) => {
  try {
    const students = await Students.find();
    res.json(students);
  } catch (error) {
    console.error('Error fetching students:', error);
    res.status(500).send('Internal Server Error');
  }
});

// -----------------------------------------------------------------

const graSchema = new mongoose.Schema({
  _id: String,
  gd_status: String,
  fi_id: String,
  createdAt: String,
  updatedAt: String,
});

// Create a model
const Graduate = mongoose.model('files', graSchema);

// Route to handle GET request for English subjects
app.get('/graduate', async (req, res) => {
  try {
    const graduate = await Graduate.find();
    res.json(graduate);
  } catch (error) {
    console.error('Error fetching students:', error);
    res.status(500).send('Internal Server Error');
  }
});

// -----------------------------------------------------------------


app.get("/", async (req, res) => {
  res.send("Success yahhhhhh");
});

app.listen(4000, () => {
  console.log('server is running port 4000');
});
