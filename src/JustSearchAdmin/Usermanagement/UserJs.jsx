// src/App.js
import React, { useState } from 'react';
import { ChakraProvider, Box, Heading } from "@chakra-ui/react";
import UserList from './UserList';
import UserProfile from './UserProfile';

function UserJs() {
  const [selectedUser, setSelectedUser] = useState(null);

  return (
    <ChakraProvider>
      <Box p={5}>
        <Heading mb={5}>User Management</Heading>
        {selectedUser ? (
          <UserProfile userId={selectedUser.id} onBack={() => setSelectedUser(null)} />
        ) : (
          <UserList onSelectUser={setSelectedUser} />
        )}
      </Box>
    </ChakraProvider>
  );
}

export default UserJs;
