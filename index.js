const express = require("express");
const { connectToMongoDB } = require("./connect");
const urlRoute = require("./routes/url");
const URL = require("./models/url");

const app = express();
const PORT = 8001;

// Connect to MongoDB
connectToMongoDB("mongodb://localhost:27017/MyDb")
  .then(() => console.log("MongoDB connected"));

// Middleware
app.use(express.json());
app.use("/url", urlRoute);
app.get('/:shortId', async (req, res)=>{
      const shortId = req.params.shortId;
      const entry = await URL.findOneAndUpdate({
        shortId
      }, {$push: {
        visitHistory: {
        timestamp: Date.now(),
        }
      },
    }
  );
  res.redirect(entry.redirectURL);
}); 

// Start server
app.listen(PORT, () => console.log(`Server started at port: ${PORT}`));
