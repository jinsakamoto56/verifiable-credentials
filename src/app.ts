const express = require('express');
const credentialRoutes = require('./routes/credentialRoutes');

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use('/api/credentials', credentialRoutes);

// Serve static files from the public directory
app.use(express.static('public'));

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
}); 