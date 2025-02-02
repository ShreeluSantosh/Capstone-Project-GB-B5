const express = require('express');
const { MongoClient } = require('mongodb');
const cors = require('cors');

const app = express();
const corsOptions = {
  origin: ['https://tweetbeacon-demo.vercel.app'],
  optionsSuccessStatus: 200,
};
app.use(cors(corsOptions));
app.use(express.json());

const mongoURI = 'mongodb+srv://shreelu:2A8bc9ws@cluster0.irbc4.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0>';
const client = new MongoClient(mongoURI);

let db = null;

// Function to initialize the database connection
const connectToDatabase = async () => {
  if (!db) {
    try {
      await client.connect();
      db = client.db('Threat_Actors'); // Replace with your database name
      console.log('Connected to MongoDB');
    } catch (err) {
      console.error('Error connecting to MongoDB:', err);
      throw new Error('Failed to connect to database');
    }
  }
};

// Endpoint to fetch all APT groups
app.get('/api/apt-groups', async (req, res) => {
  try {
    await connectToDatabase(); // Ensure the database is connected
    const aptGroups = await db.collection('APTGroups').find({}).toArray();
    res.status(200).json(aptGroups);
  } catch (err) {
    console.error('Error fetching APT groups:', err);
    res.status(500).send('Error fetching APT groups');
  }
});

module.exports = app;
