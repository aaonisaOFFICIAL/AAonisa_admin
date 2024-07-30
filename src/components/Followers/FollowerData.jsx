import React, { useEffect, useState } from 'react';
import { db } from 'Config'; // Adjust the import according to your file structure
import { collection, getDocs } from 'firebase/firestore';
import { Box, Input, Button, VStack, Heading, Spinner } from '@chakra-ui/react';
import Table from './Table'; // Adjust the import according to your file structure

const FollowerData = () => {
  const [data, setData] = useState([]);
  const [search, setSearch] = useState('');
  const [originalData, setOriginalData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = async () => {
    try {
      // Fetch users data
      const usersCollection = collection(db, 'users');
      const usersSnapshot = await getDocs(usersCollection);
      const usersData = usersSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

      // Fetch videos data
      const videosCollection = collection(db, 'videos');
      const videosSnapshot = await getDocs(videosCollection);
      const videosData = videosSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

      // Merge users and videos data
      const mergedData = usersData.map(user => {
        // Calculate total followers from the user data
        const totalFollowers = user.followers ? user.followers.length : 0;
        const amount = Math.floor(totalFollowers / 2); // Amount in Rs. (2 followers = 1 Rs.)
  
        // Calculate dislikes from videos
        const userVideos = videosData.filter(video => video.uid === user.uid);
        const dislikes = userVideos.reduce((total, video) => total + (video.dislikes ? video.dislikes.length : 0), 0);
  
        return {
          ...user,
          totalFollowers,
          amount,
          dislikes
        };
      });

      setData(mergedData);
      setOriginalData(mergedData);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching data:", error);
      setError("Failed to load data.");
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (search === '') {
      setData(originalData);
    }
  }, [search, originalData]);

  const handleSearch = () => {
    const filteredData = originalData.filter(user => user?.contactNumber?.includes(search));
    setData(filteredData);
  };

  if (loading) return <Spinner size="xl" />;
  if (error) return <Box>Error: {error}</Box>;

  return (
    <Box p={4}>
      <Heading mb={4}>Admin Panel</Heading>
      <VStack spacing={4} align="stretch">
        <Box>
          <Input
            placeholder="Search by mobile number"
            value={search}
            type='number'
            onChange={(e) => setSearch(e.target.value)}
          />
          <Button mt={2} onClick={handleSearch}>Search</Button>
        </Box>
        <Table data={data} />
      </VStack>
    </Box>
  );
};

export default FollowerData;
