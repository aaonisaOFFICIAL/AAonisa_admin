// src/components/UserProfile.js
import React, { useEffect, useState } from 'react';
import { Box, Heading, Text, Stack, Button } from "@chakra-ui/react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "Config";

const UserProfile = ({ userId, onBack }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      const docRef = doc(db, 'users', userId);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        setUser(docSnap.data());
      } else {
        console.log("No such document!");
      }
    };

    fetchUser();
  }, [userId]);

  const handleStatusToggle = async () => {
    // Add logic to toggle user status
  };

  if (!user) return <Box>Loading...</Box>;

  return (
    <Box p={5} shadow="md" borderWidth="1px">
      <Heading mb={5}>User Profile</Heading>
      <Text><strong>Name:</strong> {user.name}</Text>
      <Text><strong>Email:</strong> {user.email}</Text>
      <Text><strong>Contact:</strong> {user.contact}</Text>
      <Text><strong>Status:</strong> {user.status}</Text>
      <Text><strong>Registration Date:</strong> {new Date(user.registrationDate).toLocaleDateString()}</Text>
      <Stack direction="row" mt={5}>
        <Button colorScheme="blue" onClick={onBack}>Back</Button>
        <Button colorScheme="yellow" onClick={handleStatusToggle}>
          {user.status === 'active' ? 'Deactivate' : 'Activate'}
        </Button>
      </Stack>
    </Box>
  );
};

export default UserProfile;
