const express = require('express');
const axios = require('axios');
const app = express();
const PORT = 5000;

app.use(express.json());

app.get('/api/cve/:cveId', async (req, res) => {
  const { cveId } = req.params;
  try {
    const response = await axios.get(`https://cve.circl.lu/api/cve/${cveId}`);
    res.json(response.data);
  } catch (error) {
    res.status(error.response?.status || 500).json({ error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
