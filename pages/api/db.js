import { MongoClient } from 'mongodb';

const uri = 'mongodb+srv://s6304062616072:<wlr5PySB4l3p6DJy>@cluster0.gr6z6a0.mongodb.net/?retryWrites=true&w=majority';
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

export default async function handler(req, res) {
  if (req.method === 'GET') {
    await client.connect();
    const database = client.db('graduate');
    const collection = database.collection('ENGLISH SUBJECTS','FILE UPLOADING','GRADUATE CHECKING','OFFICERS','STUDENTS','SUBJECTS VIEW');
    const data = await collection.find({}).toArray();
    res.json(data);
    await client.close();
  }
}

