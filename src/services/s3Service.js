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

async function getBucketDetails(bucketName) {
  try {
    const command = new ListObjectsV2Command({ Bucket: bucketName });
    const data = await s3Client.send(command); // Make the request to S3
    
      // Calculate the total size of all files in the bucket
      let totalSize = 0;
      data.Contents.forEach(item => {
          totalSize += item.Size; // Add the size of each file
      });

      return {
          bucketName,
          totalFiles: data.Contents.length,
          totalSize,
          files: data.Contents.map(item => ({
              key: item.Key,
              size: item.Size,
              lastModified: item.LastModified,
          }))
      };
  } catch (error) {
      console.error("Error fetching bucket details:", error);
      throw error;  // Propagate error to be handled by the controller
  }
}

module.exports = { fetchFileFromS3, getBucketDetails };
