import React, { useEffect, useState } from 'react';
import { db } from 'Config'; // Adjust the import according to your file structure
import { collection, getDocs, updateDoc, doc } from 'firebase/firestore';
import { Box, Input, Button, VStack, Heading, Spinner } from '@chakra-ui/react';
import Swal from 'sweetalert2';
import Table from './Table'; // Adjust the import according to your file structure

const LikesData = () => {
  const [data, setData] = useState([]);
  const [search, setSearch] = useState('');
  const [originalData, setOriginalData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = async () => {
    try {
      const usersCollection = collection(db, 'users');
      const usersSnapshot = await getDocs(usersCollection);
      const usersData = usersSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

      const videosCollection = collection(db, 'videos');
      const videosSnapshot = await getDocs(videosCollection);
      const videosData = videosSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

      const mergedData = usersData.map(user => {
        const userVideos = videosData.filter(video => video.uid === user.uid);
        const likes = userVideos.reduce((total, video) => total + (video.likes ? video.likes.length : 0), 0);
        const amount = Math.floor(likes / 100); // Amount in Rs. (100 likes = 1 Rs.)
        const dislikes = userVideos.reduce((total, video) => total + (video.dislikes ? video.dislikes.length : 0), 0);
        const balanceAmount = amount - (user.paidDone || 0);

        return { ...user, likes, dislikes, amount, balanceAmount ,paidDone: user.paidDone || 0,};
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

  const handlePaidChange = async (id, newValue) => {
    if (newValue < 0) {
      Swal.fire({
        icon: 'error',
        title: 'Invalid Value',
        text: 'Paid amount cannot be negative!',
      });
      return;
    }

    const userIndex = data.findIndex(user => user.id === id);
    if (userIndex !== -1) {
      const user = data[userIndex];
      if (newValue > user.amount) {
        Swal.fire({
          icon: 'error',
          title: 'Invalid Value',
          text: 'Paid amount cannot be greater than the amount!',
        });
        return;
      }

      const updatedUser = { ...user, paidDone: newValue, balanceAmount: user.amount - newValue };
      const updatedData = [...data];
      updatedData[userIndex] = updatedUser;

      setData(updatedData);

      const userRef = doc(db, 'users', id);
      await updateDoc(userRef, { paidDone: newValue, balanceAmount: user.amount - newValue });
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
    const filteredData = data.filter(user => user?.contactNumber?.includes(search));
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
        <Table data={data} handlePaidChange={handlePaidChange} />
      </VStack>
    </Box>
  );
};

export default LikesData;
