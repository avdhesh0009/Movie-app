const express = require("express");
const dotenv = require("dotenv").config();
const cors = require("cors"); // Import the cors package
const PORT = process.env.PORT || 5000;
const connectDB = require("./config/db");
const ticket = require("./routes/ticketRoutes");
const user = require("./routes/userRoutes");
connectDB();

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Enable CORS
app.use(cors());

app.get("/", (req, res) => {
  res.status(200).json("Database run successfully");
});

app.use("/api/users", user);
app.use("/api/tickets", ticket);

app.listen(PORT, () => {
  console.log(`server started on Port ${PORT}`);
});
