const {  fetchFileFromS3 ,getBucketDetails} = require("../services/s3Service");



const fetchFile = async (req, res) => {
  try {
    const { filename } = req.query;
    if (!filename) {
      return res.status(400).json({ error: "Filename is required" });
    }

    const bucketName = process.env.AWS_S3_BUCKET;
    await fetchFileFromS3(bucketName, filename, res);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const getBucketDetailsHandler = async (req, res) => {
  const { bucketName, prefix = "" } = req.query; 

  // Ensure that bucket name is provided
  if (!bucketName) {
    return res.status(400).json({ error: 'Bucket name is required' });
  }

  try {
    // Fetch the details of the bucket
    const bucketDetails = await getBucketDetails(bucketName,prefix);
    return res.json(bucketDetails);
  } catch (error) {
    console.error("Error fetching bucket details:", error);
    return res.status(500).json({ error: 'Error fetching bucket details' });
  }
};



module.exports = {  fetchFile ,getBucketDetailsHandler};
