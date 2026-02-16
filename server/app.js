const express = require('express');
const cors = require('cors');
const path = require('path');

const authRoutes = require('./routes/auth');
const newsRoutes = require('./routes/news');
const clothesRoutes = require('./routes/clothes');
const outfitsRoutes = require('./routes/outfits');
const tripsRoutes = require('./routes/trips');
const statsRoutes = require('./routes/stats');
const adminNewsRoutes = require('./routes/adminNews');
const usersRoutes = require('./routes/users');

const app = express();

app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use('/api/auth', authRoutes);
app.use('/api/news', newsRoutes);
app.use('/api/clothes', clothesRoutes);
app.use('/api/outfits', outfitsRoutes);
app.use('/api/trips', tripsRoutes);
app.use('/api/stats', statsRoutes);
app.use('/api/admin/news', adminNewsRoutes);
app.use('/api/users', usersRoutes);

module.exports = app;
