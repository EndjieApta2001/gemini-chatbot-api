// In index.js


const express = require("express");
const app = express();
const generateContent = require("./routes/gemini.js");

// Middleware for parsing JSON requests
app.use(express.json());

// Root route
app.get("/", (req, res) => {
    res.json({ message: "Hello world" });
});

// Gemini route
app.get("/gemini", generateContent);

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: "Something went wrong!" });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`App is running on port ${PORT}`);
});
