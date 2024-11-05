export default async function handler(req, res) {
  try {
    const response = await axios.get('http://localhost:5000/api/students');
    res.status(200).json(response.data);
  } catch (error) {
    console.error("Error fetching data from Flask API: ", error);
    res.status(500).json({ error: 'Failed to fetch data from Flask API' });
  }
}
