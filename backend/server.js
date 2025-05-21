require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bcrypt = require("bcrypt");
const locationsRouter = require('./routes/locations.js');
const businessRoutes = require('./routes/business');
const stripeRoutes = require('./routes/stripe');
const subscriptionRoutes = require('./routes/payment'); // assuming your file is routes/stripe.js
const bodyParser = require('body-parser');
const azureRoutes = require('./routes/azure');
const eventsRoutes = require('./routes/events');
const usersRoutes = require('./routes/users');


const app = express();
app.use('/api/stripe', stripeRoutes);
app.use(express.json());

app.use('/api/stripe', subscriptionRoutes); 

app.use(cors());

const PORT = process.env.PORT || 5000;
app.use('/api/users', usersRoutes);

app.use('/api/business', businessRoutes);
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('✅ Connected to MongoDB');

   
    app.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
    });
  })
  .catch(err => console.error('❌ MongoDB connection error:', err));


  const User = require('./models/User');

const reviewRoutes = require('./routes/reviews');
const favoriteRoutes = require('./routes/favorites');

app.use('/api/reviews', reviewRoutes);
app.use('/api/favorites', favoriteRoutes);
app.use('/api/azure', azureRoutes);
app.use('/api/locations', locationsRouter);
app.use('/api/events', eventsRoutes);

app.use(bodyParser.json());
app.post("/register", async (req, res) => {
  const {id, name, email, password } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({_id:id, name, email, password: hashedPassword });
    await user.save();
    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    res.status(400).json({ error: "User already exists or invalid data" });
  }
});
