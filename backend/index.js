const express = require('express');
require('dotenv').config();
require('./config/db.js');
const cors = require('cors');

const prisma = require('./config/prisma');
const { backfillProductImages } = require('./config/backfillImages');
const productRoutes = require('./routes/productRoutes');
const { notFoundHandler, errorHandler } = require('./middleware/errorHandler');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.send('backend running....');
});

app.use('/api/products', productRoutes);

app.use(notFoundHandler);
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`backend running port http://localhost:${PORT}`);

  backfillProductImages(prisma).catch((err) => {
    console.error('Image backfill skipped:', err.message);
  });
});
