require('dotenv').config();
const connectDB = require('./config/db');
connectDB();
const express = require('express');
const cors = require('cors');
const auth = require('./middleware/auth');
const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/transactions', require('./routes/transactionRoutes'));
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Raven MERN API running' });
});
app.get('/api/me', auth, (req, res) => {
  res.json({ message: 'You are authenticated', userId: req.userId });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));