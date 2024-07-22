import React, { useEffect, useState } from 'react';
import { db } from 'Config'; // Adjust the import according to your file structure
import { collection, getDocs } from 'firebase/firestore';
import { Box, Input, Button, VStack, Heading } from '@chakra-ui/react';
import Table from './Table'; // Adjust the import according to your file structure

const FollowerData = () => {
  const [data, setData] = useState([]);
  const [search, setSearch] = useState('');
  const [originalData, setOriginalData] = useState([]);

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
        const userVideos = videosData.filter(video => video.uid === user.uid);
        const likes = userVideos.reduce((total, video) => total + (video.likes ? video.likes.length : 0), 0);
        const dislikes = userVideos.reduce((total, video) => total + (video.dislikes ? video.dislikes.length : 0), 0);
        return { ...user, likes, dislikes };
      });

      setData(mergedData);
      setOriginalData(mergedData);
    } catch (error) {
      console.error("Error fetching data:", error);
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
