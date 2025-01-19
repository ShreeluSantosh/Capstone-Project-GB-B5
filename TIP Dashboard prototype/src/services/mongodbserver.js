const express = require('express');
const { MongoClient } = require('mongodb');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5000;

// MongoDB connection
const mongoURI = 'mongodb+srv://shreelu:2A8bc9ws@cluster0.irbc4.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0>';
const client = new MongoClient(mongoURI);

let db;
const connectToDatabase = async () => {
  try {
    await client.connect();
    db = client.db('Threat_Actors'); // Replace with your database name
    console.log('Connected to MongoDB');
  } catch (err) {
    console.error('Error connecting to MongoDB:', err);
  }
};

connectToDatabase();

// API route to fetch all APT groups
app.get('/api/apt-groups', async (req, res) => {
  try {
    const aptGroups = await db.collection('APTGroups').find({}).toArray(); // Replace with your collection name
    res.json(aptGroups);
  } catch (err) {
    console.error('Error fetching APT groups:', err);
    res.status(500).send('Error fetching APT groups');
  }
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

// Gracefully handle server shutdown
process.on('SIGINT', async () => {
  await client.close();
  console.log('MongoDB connection closed');
  process.exit(0);
});
