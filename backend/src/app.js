const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const s3Routes = require("./routes/s3Routes");

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());

// Mount S3 Routes
app.use("/api/s3", s3Routes);

module.exports = app;
