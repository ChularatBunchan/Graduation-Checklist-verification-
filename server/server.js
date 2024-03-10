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


const mongoUrl = "mongodb+srv://admin:<password>@cluster0.o78uko5.mongodb.net/";

mongoose.connect(mongoUrl, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => {
  console.log("Connect to MongoDB");
}).catch((e) => console.log(e));

app.use(express.json());
app.use(cors())

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
    filename: function (req, file, cb) {
      const uniqueSuffix = Date.now();
      cb(null, uniqueSuffix + file.originalname);
    },
  });
  
  const upload = multer({ storage : storage });
  
  const PdfSchema = mongoose.Schema({
    title: String,
    pdf: String,
    image: Buffer
  });
  
  const Pdf = mongoose.model('Pdf', PdfSchema);
  
  app.post("/upload", upload.single("file"), async (req, res) => {
    console.log(req.file);
    const filename = req.file.filename;
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
    const uniqueSuffix = Date.now();
    cb(null, uniqueSuffix + file.originalname);
  },
});

const upload2 = multer({ storage2 : storage2 });

const PdfSchema2 = mongoose.Schema({
  title: String,
  pdf: String
});

const Pdf2 = mongoose.model('Pdf2', PdfSchema2);

app.post("/uploadintern", upload2.single("file"), async (req, res) => {
  console.log(req.file);
  const filename = req.file.filename;
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
    const uniqueSuffix = Date.now();
    cb(null, uniqueSuffix + file.originalname);
  },
});

const upload3 = multer({ storage: storage3 });

const PdfSchema3 = mongoose.Schema({
  title: String,
  pdf: String
});

const Pdf3 = mongoose.model('Pdf3', PdfSchema3);

app.post("/uploadtepc", upload3.single("file"), async (req, res) => {
  console.log(req.file);
  const filename = req.file.filename;
  try {
    await Pdf3.create({ pdf: filename , image: buffer });
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

const upload4 = multer({ storage4 : storage4 });

const PdfSchema4 = mongoose.Schema({
  title: String,
  pdf: String
});

const Pdf4 = mongoose.model('Pdf4', PdfSchema4);

app.post("/uploadeng", upload4.single("file"), async (req, res) => {
  console.log(req.file);
  const filename = req.file.filename;
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

const upload5 = multer({ storage5 : storage5 });

const PdfSchema5 = mongoose.Schema({
  title: String,
  pdf5: String
});

const Pdf5= mongoose.model('Pdf5', PdfSchema5);

app.post("/uploadcer", upload5.single("file"), async (req, res) => {
  console.log(req.file);
  const filename = req.file.filename;
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
    cb(null, "./filegra");
  },
  fileName: function (req, file, cb) {
    const uniqueSuffix = Date.now();
    cb(null, uniqueSuffix + file.originalname);
  },
});

const upload6 = multer({ storage6 : storage6 });

const PdfSchema6 = mongoose.Schema({
  title: String,
  pdf: String
});

const Pdf6 = mongoose.model('Pdf6', PdfSchema6);

app.post("/uploadgra", upload6.single("file"), async (req, res) => {
  console.log(req.file);
  const filename = req.file;
  try {
    await Pdf6.create({ pdf: filename });
    res.send({ status: "ok" });
  } catch (error) {
    res.json({ status: error });
  }
});

app.get("/uploadgra", async (req, res) => {
  try {
    const data = await Pdf6.find({});
    res.send({ status: "ok", data: data });
  } catch (error) {
    res.json({ status: error });
  }
});

// -----------------------------------------------------------------

app.post('/save-to-database', async (req, res) => {
  const { file, pdfData, cefrLevel } = req.body;

  try {
      const check = new CheckModel({ file, pdfData, cefrLevel });
      await check.save();
      res.status(201).send({ status: 'ok', message: 'Data saved successfully' });
  } catch (error) {
      console.error('Error saving data to the database: ', error.message);
      res.status(500).send({ status: 'error', message: 'Failed to save data to the database' });
  }
});

// -----------------------------------------------------------------


app.get("/", async (req, res) => {
  res.send("Success yahhhhhh");
});

app.listen(8001, () => {
  console.log('server is running port 8001');
});
