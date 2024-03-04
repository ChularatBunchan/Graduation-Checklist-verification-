import fs from 'fs-extra';
import path from 'path';

const uploadDir = path.join(process.cwd(), 'public/uploads');

export default async function handler(req, res) {
  if (req.method === 'POST') {
    try {
      const data = req.body;
      const filePath = path.join(uploadDir, 'example.txt');

      await fs.writeFile(filePath, data, 'utf8');
      res.status(200).json({ message: 'File uploaded successfully' });
    } catch (error) {
      console.error('Error saving file:', error);
      res.status(500).json({ message: 'Error saving file' });
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}
