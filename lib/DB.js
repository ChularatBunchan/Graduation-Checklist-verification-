import { MongoClient } from 'mongodb';

const uri = 'mongodb+srv://s6304062616072:<wlr5PySB4l3p6DJy>@cluster0.gr6z6a0.mongodb.net/?retryWrites=true&w=majority';

let cachedClient = null;
let cachedDb = null;

export async function connectToDatabase() {
  if (cachedClient && cachedDb) {
    return { client: cachedClient, db: cachedDb };
  }

  const client = await MongoClient.connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  const db = await client.db('YOUR_DATABASE_NAME');

  cachedClient = client;
  cachedDb = db;

  return { client, db };
}
