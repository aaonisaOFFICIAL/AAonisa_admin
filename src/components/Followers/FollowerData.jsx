import React, { useEffect, useState } from 'react';
import { db } from 'Config'; // Adjust the import according to your file structure
import { collection, getDocs, updateDoc, doc } from 'firebase/firestore';
import { Box, Input, Button, VStack, Heading, Spinner } from '@chakra-ui/react';
import Swal from 'sweetalert2';
import Table from './Table'; // Adjust the import according to your file structure

const FollowerData = () => {
  const [data, setData] = useState([]);
  const [search, setSearch] = useState('');
  const [originalData, setOriginalData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pageIndex, setPageIndex] = useState(0); // State for pagination

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
        const totalFollowers = user.followers ? user.followers.length : 0;
        const amount = Math.floor(totalFollowers / 2); // Amount in Rs. (2 followers = 1 Rs.)

        const userVideos = videosData.filter(video => video.uid === user.uid);
        const dislikes = userVideos.reduce((total, video) => total + (video.dislikes ? video.dislikes.length : 0), 0);

        return {
          ...user,
          totalFollowers,
          amount,
          dislikes,
          paidDone: user.paidDone || 0, // Default value
          balanceAmount: user.paidDone ? amount - user.paidDone : amount, // Default value
          processingAmount: user.processingAmount || 0, // Default value
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
    const filteredData = originalData.filter(user => user?.mobileNumber?.includes(search));   // contactNumber to mobileNumber
    setData(filteredData);
  };

  const handlePaidChange = async (id, newPaidDone) => {
    const user = data.find(user => user.id === id);

    if (newPaidDone > user.amount) {
      Swal.fire({
        icon: 'error',
        title: 'Invalid Input',
        text: 'Paid Done cannot be greater than Amount.',
      });
      return;
    }

    const updatedData = data.map(user =>
      user.id === id ? { ...user, paidDone: newPaidDone, balanceAmount: user.amount - newPaidDone } : user
    );
    setData(updatedData);

    // Update in Firebase
    const userRef = doc(db, 'users', id);
    await updateDoc(userRef, { paidDone: newPaidDone, balanceAmount: user.amount - newPaidDone });
  };

  if (loading) return <Spinner size="xl" />;
  if (error) return <Box>Error: {error}</Box>;

  const handleProcessingAmountChange = async (id, newProcessingAmount) => {
    const updatedData = data.map(user =>
      user.id === id ? { ...user, processingAmount: newProcessingAmount } : user
    );
    setData(updatedData);
  
    // Update in Firebase
    const userRef = doc(db, 'users', id);
    await updateDoc(userRef, { processingAmount: newProcessingAmount });
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
       <Table
          data={data}
          onPaidChange={handlePaidChange}
          onProcessingAmountChange={handleProcessingAmountChange} // Pass the handler to UserTable
          pageIndex={pageIndex}
          setPageIndex={setPageIndex}
        />
      </VStack>
    </Box>
  );
};

export default FollowerData;
