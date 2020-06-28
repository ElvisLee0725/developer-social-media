const express = require('express');
const app = express();
const port = process.env.PORT || 5000;
const connectDB = require('./config/db');

// Database
connectDB();

// Init Middleware
app.use(express.json());

app.get('/', (req, res) => {
  res.send('API Running');
});

// Routes
app.use('/api/users', require('./routes/api/users'));
app.use('/api/auth', require('./routes/api/auth'));
app.use('/api/profile', require('./routes/api/profile'));
app.use('/api/posts', require('./routes/api/posts'));

app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});
