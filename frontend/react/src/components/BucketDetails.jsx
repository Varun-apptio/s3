import React, { useState, useEffect } from 'react';
import '../styles/BucketDetails.css'
// convert bytes to MB
const bytesToMB = (bytes) => {
  return (bytes / 1024 / 1024).toFixed(2);
};

const BucketDetails = () => {
  const [bucketData, setBucketData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // to fetch bucket details , use axios later
  useEffect(() => {
    const fetchBucketDetails = async () => {
      try {
        const response = await fetch('http://localhost:3000/api/s3/bucket-details?bucketName=s3-docstore');
       //err
        if (!response.ok) {
          throw new Error('Failed to fetch data');
        }

        const data = await response.json();
        setBucketData(data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchBucketDetails();
  }, []); //only when looded first


  const sortedFiles = bucketData?.files.sort((a, b) => b.size - a.size); // Sorting by size in descending order

  // If loading
  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="container">
      <h2>Bucket Details: {bucketData?.bucketName}</h2>
      <p>Total Files: {bucketData?.totalFiles}</p>
      <p>Total Size: {bytesToMB(bucketData?.totalSize)} MB</p>

      <table border="1" cellPadding="8" cellSpacing="0" style={{ width: '100%', marginTop: '20px' }}>
        <thead>
          <tr>
            <th>File Name</th>
            <th>Size (MB)</th>
            <th>Last Modified</th>
          </tr>
        </thead>
        <tbody>
          {sortedFiles?.map((file, index) => (
            <tr key={index}>
              <td>{file.key}</td>
              <td>{bytesToMB(file.size)} MB</td>
              <td>{new Date(file.lastModified).toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default BucketDetails;
