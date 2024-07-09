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
    const usersCollection = collection(db, 'users'); // Adjust collection name as needed
    const usersSnapshot = await getDocs(usersCollection);
    const usersData = usersSnapshot.docs.map(doc => doc.data());
    setData(usersData);
    setOriginalData(usersData);
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
    const filteredData = data.filter(user => user?.contactNumber?.includes(search));
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

export default  FollowerData
