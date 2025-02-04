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
  const [prefix, setPrefix] = useState();

  // to fetch bucket details , use axios later
  useEffect(() => {
    const fetchBucketDetails = async () => {
      try {
        const response = await fetch(`http://localhost:3000/api/s3/bucket-details?bucketName=s3-docstore&prefix=${prefix}/`);
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
  }, [prefix]); //only when looded first


 

  // If loading
  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="container">
       <input
        type="text"
        value={prefix}
        onChange={(e) => setPrefix(e.target.value)}
        
        placeholder="Enter the uuid"
        className='search-input'
      />
      <h2>Bucket Details: {bucketData?.bucketName}</h2>
      <p>Total Files: {bucketData?.totalFiles}</p>
      <p>Total Size: {bytesToMB(bucketData?.totalSize)} MB</p>


    </div>
  );
};

export default BucketDetails;
