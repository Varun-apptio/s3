const express = require("express");
const {  fetchFile ,getBucketDetailsHandler} = require("../controllers/s3Controller");

const router = express.Router();



// Route to fetch and stream a file from S3
router.get("/fetch-file", fetchFile);
router.get('/bucket-details', getBucketDetailsHandler);
module.exports = router;


