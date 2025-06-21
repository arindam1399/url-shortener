require('dotenv').config(); // Load env variables
const express = require("express");
const { connectToMongoDB } = require("./connect");
const urlRoute = require("./routes/url");
const URL = require("./models/url");

const app = express();
const PORT = process.env.PORT || 8001; // Use env PORT if available

// Connect to MongoDB using .env variable
connectToMongoDB(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB connected"))
  .catch(err => console.error("❌ MongoDB connection error:", err));

// Middleware
app.use(express.json());
app.use("/url", urlRoute);

// Route to handle short URL redirection
app.get('/:shortId', async (req, res) => {
  try {
    const shortId = req.params.shortId;
    const entry = await URL.findOneAndUpdate(
      { shortId },
      {
        $push: {
          visitHistory: {
            timestamp: Date.now(),
          },
        },
      }
    );

    if (!entry) {
      return res.status(404).send("❌ Short URL not found");
    }

    res.redirect(entry.redirectURL);
  } catch (err) {
    console.error("❌ Error in redirect route:", err);
    res.status(500).send("Internal Server Error");
  }
});

// Start the server
app.listen(PORT, () => console.log(`🚀 Server started at port: ${PORT}`));
