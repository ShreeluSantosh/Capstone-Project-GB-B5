const express = require('express');
const { MongoClient } = require('mongodb');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = 5001;

const corsOptions = {
    origin: 'http://localhost:3000', 
    optionsSuccessStatus: 200,
  };
  app.use(cors(corsOptions));
  
  app.use(express.json());

const mongoURI = 'mongodb+srv://shreelu:2A8bc9ws@cluster0.irbc4.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0>';
const client = new MongoClient(mongoURI);

app.get('/api/tweets', async (req, res) => {
  try {
    await client.connect();
    const db = client.db('Tweets'); // Replace with your database name
    const tweetsCollection = db.collection('Tweets'); // Replace with your collection name
    const tweets = await tweetsCollection.find({}).toArray();
    res.json(tweets);
  } catch (err) {
    console.error('Error fetching tweets:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
