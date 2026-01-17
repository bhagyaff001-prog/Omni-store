const express = require('express');
const cors = require('cors');
const fs = require('fs');
const app = express();

app.use(cors());
app.use(express.json());

const DB_FILE = './database.json';

// Helper: Data Read/Write
const getData = () => JSON.parse(fs.readFileSync(DB_FILE));
const saveData = (data) => fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2));

// Initial Database check
if (!fs.existsSync(DB_FILE)) {
    saveData({ downloads: 1050, reviews: [] });
}

// Routes
app.get('/api/stats', (req, res) => res.json(getData()));

app.post('/api/download', (req, res) => {
    let data = getData();
    data.downloads += 1;
    saveData(data);
    res.json({ success: true, total: data.downloads });
});

app.post('/api/review', (req, res) => {
    let data = getData();
    data.reviews.push({
        name: req.body.name,
        text: req.body.text,
        date: new Date().toLocaleDateString()
    });
    saveData(data);
    res.json({ success: true });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  
