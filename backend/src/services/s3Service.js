const { s3Client } = require("../config/s3Client");
const { GetObjectCommand ,ListObjectsV2Command} = require("@aws-sdk/client-s3");

// Function to fetch and stream a file from S3
const fetchFileFromS3 = async (bucketName, key, res) => {
  try {
    const command = new GetObjectCommand({ Bucket: bucketName, Key: key });
    const { Body } = await s3Client.send(command);
    
    res.setHeader("Content-Type", "application/pdf");
    Body.pipe(res); // Stream file to client
  } catch (error) {
    console.error("Error fetching file:", error);
    throw error;
  }
};

async function getBucketDetails(bucketName,prefix = "") {
  
  const params = { Bucket: bucketName, Prefix: prefix };
  let totalFiles = 0;
  let totalSize = 0;

  try {
    const data = await s3Client.send(new ListObjectsV2Command(params));
   console.log(data);
   
    if (data.Contents) {
      const files = data.Contents.filter(obj => !(obj.Key.endsWith("/") && obj.Size === 0));

      totalFiles = files.length;
      totalSize = data.Contents.reduce((acc, obj) => acc + obj.Size, 0);
    }

    return { totalFiles, totalSize };
  } catch (error) {
    console.error("Error fetching S3 data:", error);
    throw new Error("Error fetching S3 data");
  }
}

module.exports = { fetchFileFromS3, getBucketDetails };
